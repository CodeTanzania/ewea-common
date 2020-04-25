import { expect } from '@lykmapipo/test-helpers';
import { connect, syncIndexes } from '../../src';

describe('database', () => {
  it('should connect to database', (done) => {
    connect((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should sync database indexes', (done) => {
    syncIndexes((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });
});
