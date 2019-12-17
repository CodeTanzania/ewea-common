import { expect } from '@lykmapipo/mongoose-test-helpers';
import {
  seedCsv,
  seedUnits,
  seedAdministrativeLevels,
  seedFeatureTypes,
  seedEventIndicators,
  seedEventSeverities,
  seedEventCertainties,
  seedPartyGroups,
  seedPartyRoles,
  seedEventGroups,
  seedEventTypes,
  seedEventFunctions,
  seedEventActions,
  seedEventQuestions,
  seed,
} from '../../src';
import '@codetanzania/emis-stakeholder';

describe('seed', () => {
  const { BASE_PATH, DATA_PATH } = process.env;

  // enableDebug();

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

  it('should seed units', done => {
    seedUnits(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed administrative levels', done => {
    seedAdministrativeLevels(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed feature types', done => {
    seedFeatureTypes(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event indicators', done => {
    seedEventIndicators(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event severities', done => {
    seedEventSeverities(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event certainties', done => {
    seedEventCertainties(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed party groups', done => {
    seedPartyGroups(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed party roles', done => {
    seedPartyRoles(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event groups', done => {
    seedEventGroups(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event types', done => {
    seedEventTypes(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event functions', done => {
    seedEventFunctions(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event actions', done => {
    seedEventActions(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event questions', done => {
    seedEventQuestions(error => {
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
