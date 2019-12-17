import { expect } from '@lykmapipo/test-helpers';
import { seedCsv, seedEventSeverities, seed } from '../../src';
import '@codetanzania/emis-stakeholder';

describe('seed', () => {
  const { BASE_PATH, DATA_PATH } = process.env;

  before(() => {
    process.env.BASE_PATH = __dirname;
    process.env.DATA_PATH = `${__dirname}'/../fixtures`;
  });

  it('should seed csv file', done => {
    const path = `${__dirname}/../fixtures/eventseverities.csv`;
    seedCsv(path, [], (error, { finished, feature, next }) => {
      if (error) {
        expect(error).to.not.exist;
        return done(error);
      }
      if (finished) {
        expect(finished).to.be.ok;
        return done();
      }
      expect(feature).to.exist;
      expect(feature.name).to.exist;
      expect(feature.description).to.exist;
      expect(next).to.exist.and.be.a('function');
      return next();
    });
  });

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

  after(() => {
    process.env.BASE_PATH = BASE_PATH;
    process.env.DATA_PATH = DATA_PATH;
  });
});
