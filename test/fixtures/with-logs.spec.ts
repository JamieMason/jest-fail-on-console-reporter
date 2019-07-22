import { run } from './with-logs';

describe('with logs', () => {
  it('fails when unmocked console.log is run', () => {
    expect(run()).toEqual('Hello World');
  });
});
