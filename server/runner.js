// Runs one piece of code in a throw-away temp folder and returns what it printed.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { LANGUAGES } from './languages.js';

const isWin = process.platform === 'win32';

// Don't leak server secrets (DB passwords, API keys...) to the code being run.
function cleanEnv() {
  const env = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (/(SECRET|TOKEN|PASSWORD|PASSWD|KEY|CREDENTIAL|AUTH)|^(DB_|SANDBOX_|CORS_|RUN_|MAX_)/i.test(k)) continue;
    env[k] = v;
  }
  env.PYTHONIOENCODING = 'utf-8';
  return env;
}

function killTree(child) {
  try {
    if (isWin) spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    else process.kill(-child.pid, 'SIGKILL'); // whole process group
  } catch {
    try { child.kill('SIGKILL'); } catch { /* already gone */ }
  }
}

// Run ONE command. Resolves with { code, stdout, stderr, timedOut, truncated }.
function runCommand({ cmd, args, cwd, stdin, timeoutMs, maxBytes }) {
  return new Promise((resolve) => {
    let stdout = '', stderr = '', bytes = 0, timedOut = false, truncated = false, settled = false;
    const child = spawn(cmd, args, {
      cwd, env: cleanEnv(), windowsHide: true,
      detached: !isWin, // lets us kill the whole group on Linux/macOS
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const finish = (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut, truncated });
    };

    const timer = setTimeout(() => { timedOut = true; killTree(child); }, timeoutMs);

    const collect = (which) => (chunk) => {
      if (truncated) return;
      bytes += chunk.length;
      if (bytes > maxBytes) {
        truncated = true;
        killTree(child);
        return;
      }
      if (which === 'out') stdout += chunk.toString('utf8');
      else stderr += chunk.toString('utf8');
    };
    child.stdout.on('data', collect('out'));
    child.stderr.on('data', collect('err'));

    child.on('error', (err) => { stderr += `\n[could not start "${cmd}": ${err.message}]`; finish(-1); });
    child.on('close', (code) => finish(code));

    child.stdin.on('error', () => {}); // program may exit without reading stdin
    child.stdin.end(stdin || '');
  });
}

export async function runCode({ language, code, stdin, tools, limits }) {
  const lang = LANGUAGES[language];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'campspace-run-'));
  const started = Date.now();
  let result = { stdout: '', stderr: '', exitCode: 0, timedOut: false, truncated: false, phase: 'run' };

  try {
    fs.writeFileSync(path.join(dir, lang.file), code, 'utf8');
    if (lang.prepare) lang.prepare(dir, tools);

    for (const step of lang.steps(tools, dir)) {
      const isCompile = Boolean(step.compile);
      const r = await runCommand({
        cmd: step.cmd, args: step.args, cwd: dir, stdin: isCompile ? '' : stdin,
        timeoutMs: isCompile ? Math.max(limits.timeoutMs, 30000) : limits.timeoutMs,
        maxBytes: limits.maxBytes,
      });
      // Don't show the server's temp folder path in error messages
      const hide = (text) => text.split(dir + path.sep).join('').split(dir).join('.');
      result = {
        stdout: hide(r.stdout), stderr: hide(r.stderr), exitCode: r.code, timedOut: r.timedOut,
        truncated: r.truncated, phase: isCompile ? 'compile' : 'run',
      };
      if (r.code !== 0 || r.timedOut || r.truncated) break; // stop at the first failure
    }
  } catch (err) {
    result = { ...result, stderr: `Server error: ${err.message}`, exitCode: -1 };
  } finally {
    fs.rm(dir, { recursive: true, force: true }, () => {});
  }

  return { ...result, durationMs: Date.now() - started };
}
