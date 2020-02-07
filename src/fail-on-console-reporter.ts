import { DefaultReporter } from '@jest/reporters';
import getResultHeader from '@jest/reporters/build/get_result_header';
import { TestResult } from '@jest/test-result';
import { Config } from '@jest/types';
import chalk from 'chalk';
import { getConsoleOutput } from 'jest-util';
import { basename, relative } from 'path';

export class FailOnConsoleReporter extends DefaultReporter {
  private _untestedConsoleOutput: Array<{
    consoleOutput: string;
    testPath: string;
  }>;

  constructor(globalConfig: Config.GlobalConfig) {
    super(globalConfig);
    this._untestedConsoleOutput = [];
  }

  public printTestFileHeader(
    _testPath: Config.Path,
    config: Config.ProjectConfig,
    result: TestResult
  ) {
    this.log(getResultHeader(result, this._globalConfig, config));
    if (result.console) {
      const cwd = config.cwd;
      const isVerbose = !!this._globalConfig.verbose;
      const logEntries = result.console;
      this._untestedConsoleOutput.push({
        consoleOutput: getConsoleOutput(cwd, isVerbose, logEntries),
        testPath: relative(this._globalConfig.rootDir, _testPath)
      });
    }
  }

  public getLastError() {
    if (this._untestedConsoleOutput.length > 0) {
      const deindent = (str: string) => str.replace(/^  /gm, '');
      const FAIL = chalk.reset.inverse.bold.red(` FAIL `);
      const messages = this._untestedConsoleOutput
        .map(({ consoleOutput, testPath }) => {
          const filename = basename(testPath);
          const prettyPath = chalk
            .redBright(testPath)
            .replace(filename, chalk.reset.bold(filename));
          const output = deindent(consoleOutput)
            .trimRight()
            .replace('console.', 'unexpected console.');
          return `${FAIL} ${prettyPath}\n${output}`;
        })
        .join('\n');

      const footer = chalk.red(
        `Untested console[error|log|warn] calls are prevented by jest-fail-on-console-reporter`
      );

      this.log(`${messages}\n\n${footer}`);

      return new Error(`${messages}\n\n${footer}`);
    }
    return DefaultReporter.prototype.getLastError.call(this);
  }
}
