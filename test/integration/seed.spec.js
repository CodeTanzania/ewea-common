import { expect } from '@lykmapipo/test-helpers';
import { seed } from '../../src';

describe.only('seed', () => {
  it('should seed data', done => {
    seed(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });
});
