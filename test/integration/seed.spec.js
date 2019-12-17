import { expect } from '@lykmapipo/test-helpers';
import { seedEventSeverities, seed } from '../../src';

describe.only('seed', () => {
  it('should seed event severities', done => {
    seedEventSeverities(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed data', done => {
    seed(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });
});
