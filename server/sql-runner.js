// Runs SQL typed in the editor against the user's private scratch database.
import { getSandboxPool, sandboxDbName } from './db.js';

// Turn rows into a plain-text table like the mysql command-line client.
function asTable(fields, rows) {
  const cols = fields.map((f) => f.name);
  if (!cols.length) return '';
  const cell = (v) => (v === null ? 'NULL' : v instanceof Date ? v.toISOString() : String(v));
  const body = rows.map((r) => cols.map((c) => cell(r[c])));
  const widths = cols.map((c, i) => Math.max(c.length, ...body.map((r) => r[i].length), 1));
  const line = '+' + widths.map((w) => '-'.repeat(w + 2)).join('+') + '+';
  const fmt = (arr) => '| ' + arr.map((v, i) => v.padEnd(widths[i])).join(' | ') + ' |';
  const out = [line, fmt(cols), line, ...body.map(fmt), line, `${rows.length} row${rows.length === 1 ? '' : 's'}`];
  return out.join('\n');
}

const isOk = (r) => r && !Array.isArray(r) && typeof r === 'object' && 'affectedRows' in r;

export async function runSql({ code, owner, timeoutMs }) {
  const started = Date.now();
  const dbName = sandboxDbName(owner);
  const conn = await getSandboxPool().getConnection();
  let broken = false; // a timed-out connection may still be busy, so we throw it away
  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4`);
    await conn.query(`USE \`${dbName}\``);

    const [rows, fields] = await conn.query({ sql: code, timeout: timeoutMs });

    // One statement -> rows is a plain array / OK packet. Several -> an array of those.
    const multi =
      Array.isArray(rows) && rows.length > 0 && (Array.isArray(rows[0]) || isOk(rows[0]));
    const results = multi ? rows : [rows];
    const fieldLists = multi ? fields || [] : [fields];

    const parts = results.map((res, i) => {
      if (isOk(res)) {
        const extra = res.insertId ? `, last insert id ${res.insertId}` : '';
        return `Query OK, ${res.affectedRows} row(s) affected${extra}`;
      }
      return asTable(fieldLists[i] || [], res);
    });

    return {
      stdout: parts.join('\n\n') || 'Query OK',
      stderr: '', exitCode: 0, timedOut: false, truncated: false,
      phase: 'run', durationMs: Date.now() - started,
    };
  } catch (err) {
    const timedOut = err.code === 'PROTOCOL_SEQUENCE_TIMEOUT';
    if (timedOut) broken = true;
    return {
      stdout: '',
      stderr: timedOut ? 'Query timed out.' : `SQL error${err.errno ? ` ${err.errno}` : ''}: ${err.sqlMessage || err.message}`,
      exitCode: 1, timedOut, truncated: false, phase: 'run', durationMs: Date.now() - started,
    };
  } finally {
    if (broken) conn.destroy();
    else conn.release();
  }
}
