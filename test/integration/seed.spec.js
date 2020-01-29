import {
  MODEL_NAME_PREDEFINE,
  PREDEFINE_NAMESPACE_EVENTSEVERITY,
} from '@codetanzania/ewea-internals';
import { expect } from '@lykmapipo/mongoose-test-helpers';
import {
  readCsvFile,
  seedFromCsv,
  seedFromJson,
  seedFromSeeds,
  seedPredefine,
  seedParty,
  seedEvent,
  seedPermissions,
  seedUnits,
  seedAdministrativeLevels,
  seedFeatureTypes,
  seedEventIndicators,
  seedEventSeverities,
  seedEventCertainties,
  seedEventStatuses,
  seedEventUrgencies,
  seedPartyGroups,
  seedPartyRoles,
  seedEventGroups,
  seedEventTypes,
  seedEventFunctions,
  seedEventActions,
  seedEventQuestions,
  seedAdministrativeAreas,
  seedAgencies,
  seedFocals,
  seedFeatures,
  seedEventCatalogues,
  seedNotificationTemplates,
  seedEvents,
  seed,
} from '../../src';
import '@codetanzania/emis-stakeholder';
import '@codetanzania/ewea-event';

describe('seed', () => {
  const { BASE_PATH, DATA_PATH, SEED_PATH } = process.env;

  // enableDebug();

  before(() => {
    process.env.BASE_PATH = __dirname;
    process.env.DATA_PATH = `${__dirname}'/../fixtures`;
    process.env.SEED_PATH = `${__dirname}'/../fixtures`;
  });

  it('should read csv seed file', done => {
    const path = `${__dirname}/../fixtures/eventseverities.csv`;
    readCsvFile(path, [], (error, { finished, feature, next }) => {
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

  it('should seed from csv if file exists', done => {
    const modelName = MODEL_NAME_PREDEFINE;
    const namespace = PREDEFINE_NAMESPACE_EVENTSEVERITY;
    const optns = { modelName, namespace };

    seedFromCsv(optns, error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed from json if file exists', done => {
    const modelName = MODEL_NAME_PREDEFINE;
    const namespace = PREDEFINE_NAMESPACE_EVENTSEVERITY;
    const optns = { modelName, namespace };

    seedFromJson(optns, (error, results) => {
      expect(error).to.not.exist;
      expect(results).to.exist;
      done(error);
    });
  });

  it('should not seed from json if file exists', done => {
    const modelName = MODEL_NAME_PREDEFINE;
    const namespace = 'Unknown';
    const optns = { modelName, namespace };

    seedFromJson(optns, (error, results) => {
      expect(error).to.not.exist;
      expect(results).to.exist;
      done(error);
    });
  });

  it('should seed from seeds file if exists', done => {
    const modelName = MODEL_NAME_PREDEFINE;
    const optns = { modelName };

    seedFromSeeds(optns, (error, results) => {
      expect(error).to.not.exist;
      expect(results).to.exist;
      done(error);
    });
  });

  it('should filter seed from seeds file if exists', done => {
    const modelName = MODEL_NAME_PREDEFINE;
    const filter = val => val.namespace === PREDEFINE_NAMESPACE_EVENTSEVERITY;
    const optns = { modelName, filter };

    seedFromSeeds(optns, (error, results) => {
      expect(error).to.not.exist;
      expect(results).to.exist;
      done(error);
    });
  });

  it('should not seed from seeds file if not exists', done => {
    const modelName = 'Unknown';
    const optns = { modelName };

    seedFromSeeds(optns, (error, results) => {
      expect(error).to.not.exist;
      expect(results).to.not.exist;
      done(error);
    });
  });

  it('should seed predefines', done => {
    seedPredefine({}, error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed parties', done => {
    seedParty({}, error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event', done => {
    seedEvent({}, error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed permissions', done => {
    seedPermissions(error => {
      expect(error).to.not.exist;
      done(error);
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

  it('should seed event statuses', done => {
    seedEventStatuses(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event urgencies', done => {
    seedEventUrgencies(error => {
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

  it('should seed administrative areas', done => {
    seedAdministrativeAreas(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed agencies', done => {
    seedAgencies(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed focals', done => {
    seedFocals(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed features', done => {
    seedFeatures(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event catalogues', done => {
    seedEventCatalogues(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed notification templates', done => {
    seedNotificationTemplates(error => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed events', done => {
    seedEvents(error => {
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
    process.env.SEED_PATH = SEED_PATH;
  });
});
