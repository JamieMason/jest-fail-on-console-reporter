import { expectJest } from './lib/expect-jest';

describe('when an unmocked console.log is called by a file under test', () => {
  describe('when running multiple specs', () => {
    it('should fail the test', () => {
      expectJest([
        './test/fixtures/with-logs.spec.ts',
        './test/fixtures/without-logs.spec.ts'
      ]).toContainConsoleOutput(`
        PASS test/fixtures/with-logs.spec.ts
        PASS test/fixtures/without-logs.spec.ts
        FAIL test/fixtures/with-logs.spec.ts
        unexpected console.log test/fixtures/with-logs.ts:2
          foo bar baz

        Untested console[error|log|warn] calls are prevented by jest-fail-on-console-reporter
      `);
    });
  });
});
