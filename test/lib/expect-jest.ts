import { spawnSync } from 'child_process';
import { resolve } from 'path';
import stripAnsi from 'strip-ansi';

export const expectJest = (specs: string[]) => {
  let jestConsoleOutput = stripAnsi(
    spawnSync('./node_modules/.bin/jest', ['--useStderr', ...specs], {
      cwd: resolve(__dirname, '../..'),
      encoding: 'utf8',
      stdio: [null, null, null]
    }).stderr
  );

  // either strip-ansi or jest are causing the number of spaces following
  // "PASS" or "FAIL" to vary unpredictably
  jestConsoleOutput = jestConsoleOutput.replace(/ +/g, ' ');

  return {
    toContainConsoleOutput: (expectedLines: string) =>
      expectedLines
        .trim()
        .replace(/^ +/gm, '')
        .split('\n')
        .filter(Boolean)
        .forEach((line) => expect(jestConsoleOutput).toContain(line))
  };
};
