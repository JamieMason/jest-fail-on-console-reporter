import { run } from './without-logs';

describe('without logs', () => {
  it('passes as normal', () => {
    expect(run()).toEqual('Hello World');
  });
});
