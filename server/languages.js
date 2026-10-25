// Every language the Code Editor can run, and HOW to run it.
// To add a language: add one entry below. Nothing else needs to change.
//
//   tools   - programs that must be installed (we look for them when the server starts)
//   file    - name the code is saved as inside the temporary folder
//   steps() - list of commands to run in order. "compile" steps stop the run if they fail.
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const isWin = process.platform === 'win32';
// Full path to a program we just compiled inside the run folder
const exe = (dir, name) => path.join(dir, isWin ? `${name}.exe` : name);

// Is this program installed? (runs "<program> <args>" and checks it worked)
function works(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: 'ignore', timeout: 8000, windowsHide: true });
  return !r.error && r.status === 0;
}
function find(candidates, versionArgs = ['--version']) {
  for (const c of candidates) if (works(c, versionArgs)) return c;
  return null;
}

// tsx lets us run TypeScript directly (installed as a normal npm dependency)
function tsxCli() {
  try {
    return require.resolve('tsx/cli');
  } catch {
    return null;
  }
}

export const LANGUAGES = {
  javascript: {
    label: 'JavaScript (Node.js)', file: 'main.js',
    find: () => ({ node: process.execPath }),
    steps: (t) => [{ cmd: t.node, args: ['main.js'] }],
  },
  typescript: {
    label: 'TypeScript', file: 'main.ts',
    find: () => (tsxCli() ? { node: process.execPath, tsx: tsxCli() } : null),
    steps: (t) => [{ cmd: t.node, args: [t.tsx, 'main.ts'] }],
  },
  python: {
    label: 'Python 3', file: 'main.py',
    find: () => {
      const py = find(['python3', 'python', 'py'], ['--version']);
      return py ? { py } : null;
    },
    steps: (t) => [{ cmd: t.py, args: ['-u', 'main.py'] }],
  },
  c: {
    label: 'C (gcc)', file: 'main.c',
    find: () => { const gcc = find(['gcc']); return gcc ? { gcc } : null; },
    steps: (t, dir) => [
      { cmd: t.gcc, args: ['main.c', '-o', 'main', '-lm'], compile: true },
      { cmd: exe(dir, 'main'), args: [] },
    ],
  },
  cpp: {
    label: 'C++ (g++)', file: 'main.cpp',
    find: () => { const gpp = find(['g++']); return gpp ? { gpp } : null; },
    steps: (t, dir) => [
      { cmd: t.gpp, args: ['main.cpp', '-o', 'main'], compile: true },
      { cmd: exe(dir, 'main'), args: [] },
    ],
  },
  java: {
    label: 'Java (JDK 11+)', file: 'Main.java',
    // needs the JDK (javac), not just the JRE
    find: () => {
      const javac = find(['javac'], ['-version']);
      const java = find(['java'], ['-version']);
      return javac && java ? { java } : null;
    },
    // "java Main.java" compiles + runs in one go
    steps: (t) => [{ cmd: t.java, args: ['Main.java'], compile: false }],
  },
  go: {
    label: 'Go', file: 'main.go',
    find: () => { const go = find(['go'], ['version']); return go ? { go } : null; },
    steps: (t) => [{ cmd: t.go, args: ['run', 'main.go'] }],
  },
  rust: {
    label: 'Rust', file: 'main.rs',
    find: () => { const rustc = find(['rustc']); return rustc ? { rustc } : null; },
    steps: (t, dir) => [
      { cmd: t.rustc, args: ['main.rs', '-o', 'main'], compile: true },
      { cmd: exe(dir, 'main'), args: [] },
    ],
  },
  csharp: {
    label: 'C# (.NET)', file: 'Program.cs',
    find: () => { const dotnet = find(['dotnet']); return dotnet ? { dotnet } : null; },
    prepare: (dir, t) => {
      const v = spawnSync(t.dotnet, ['--version'], { encoding: 'utf8' }).stdout || '8.0';
      const major = parseInt(v, 10) || 8;
      fs.writeFileSync(
        path.join(dir, 'app.csproj'),
        `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType>` +
          `<TargetFramework>net${major}.0</TargetFramework><ImplicitUsings>disable</ImplicitUsings>` +
          `<Nullable>disable</Nullable></PropertyGroup></Project>`
      );
    },
    steps: (t) => [{ cmd: t.dotnet, args: ['run', '--nologo', '-v', 'q'] }],
  },
  kotlin: {
    label: 'Kotlin', file: 'main.kt',
    find: () => {
      const kotlinc = find(['kotlinc'], ['-version']);
      const java = find(['java'], ['-version']);
      return kotlinc && java ? { kotlinc, java } : null;
    },
    steps: (t) => [
      { cmd: t.kotlinc, args: ['main.kt', '-include-runtime', '-d', 'main.jar'], compile: true },
      { cmd: t.java, args: ['-jar', 'main.jar'] },
    ],
  },
  swift: {
    label: 'Swift', file: 'main.swift',
    find: () => { const swift = find(['swift'], ['--version']); return swift ? { swift } : null; },
    steps: (t) => [{ cmd: t.swift, args: ['main.swift'] }],
  },
  php: {
    label: 'PHP', file: 'main.php',
    find: () => { const php = find(['php'], ['-v']); return php ? { php } : null; },
    steps: (t) => [{ cmd: t.php, args: ['main.php'] }],
  },
  ruby: {
    label: 'Ruby', file: 'main.rb',
    find: () => { const ruby = find(['ruby'], ['--version']); return ruby ? { ruby } : null; },
    steps: (t) => [{ cmd: t.ruby, args: ['main.rb'] }],
  },
  bash: {
    label: 'Bash', file: 'main.sh',
    find: () => { const bash = find(['bash'], ['--version']); return bash ? { bash } : null; },
    steps: (t) => [{ cmd: t.bash, args: ['main.sh'] }],
  },
  lua: {
    label: 'Lua', file: 'main.lua',
    find: () => { const lua = find(['lua', 'lua5.4', 'lua5.3', 'luajit'], ['-v']); return lua ? { lua } : null; },
    steps: (t) => [{ cmd: t.lua, args: ['main.lua'] }],
  },
  r: {
    label: 'R', file: 'main.R',
    find: () => { const r = find(['Rscript'], ['--version']); return r ? { r } : null; },
    steps: (t) => [{ cmd: t.r, args: ['main.R'] }],
  },
  // Special: handled by server/sql-runner.js instead of a command line
  mysql: { label: 'MySQL', special: 'sql' },
  // Not "run" on the server - the editor shows these in a live preview instead
  html: { label: 'HTML', special: 'preview' },
  css: { label: 'CSS', special: 'preview' },
  react: { label: 'React', special: 'preview' },
};

// Look for installed tools once, at startup.
export function detectLanguages({ sqlReady }) {
  const out = {};
  for (const [id, lang] of Object.entries(LANGUAGES)) {
    if (lang.special === 'preview') {
      out[id] = { id, label: lang.label, runnable: false, mode: 'preview' };
    } else if (lang.special === 'sql') {
      out[id] = {
        id, label: lang.label, runnable: sqlReady, mode: 'sql',
        reason: sqlReady ? undefined : 'Sandbox MySQL user is not configured (see README_BACKEND.md)',
      };
    } else {
      const tools = lang.find();
      out[id] = {
        id, label: lang.label, runnable: Boolean(tools), mode: 'process', tools,
        reason: tools ? undefined : 'Required compiler/interpreter is not installed on the server',
      };
    }
  }
  return out;
}
