import {
  MODEL_NAME_PREDEFINE,
  PREDEFINE_NAMESPACE_EVENTSEVERITY,
} from '@codetanzania/ewea-internals';
import { isEmpty, get } from 'lodash';
import { waterfall } from 'async';
import { mergeObjects } from '@lykmapipo/common';
import { objectIdFor } from '@lykmapipo/mongoose-common';
import {
  expect,
  // enableDebug
} from '@lykmapipo/mongoose-test-helpers';
import { Predefine } from '@codetanzania/emis-stakeholder';

import '@codetanzania/ewea-event';
import '@codetanzania/ewea-dispatch';
import '@codetanzania/ewea-case';

import {
  readCsvFile,
  seedFromCsv,
  seedFromJson,
  seedFromSeeds,
  seedPredefine,
  seedParty,
  seedEvent,
  seedPermissions,
  seedDefaults,
  seedCommons,
  seedUnits,
  seedPriorities,
  seedAdministrativeLevels,
  seedFeatureTypes,
  seedEventIndicators,
  seedEventTopics,
  seedEventLevels,
  seedEventSeverities,
  seedEventCertainties,
  seedEventStatuses,
  seedEventUrgencies,
  seedEventResponses,
  seedPartyOwnerships,
  seedPartyGroups,
  seedPartyRoles,
  seedPartyGenders,
  seedPartyOccupations,
  seedPartyNationalities,
  seedVehicleTypes,
  seedVehicleModels,
  seedVehicleMakes,
  seedVehicleStatuses,
  seedEventGroups,
  seedEventTypes,
  seedEventFunctions,
  seedEventActions,
  seedEventQuestions,
  seedAdministrativeAreas,
  seedAdministrators,
  seedAgencies,
  seedFocals,
  seedFeatures,
  seedHealthFacilities,
  seedVehicles,
  seedEventActionCatalogues,
  seedNotificationTemplates,
  seedEvents,
  // seedEventChangeLogs,
  seedVehicleDispatches,
  seedCases,
  // seedCaseChangeLogs,
  seed,
} from '../../src';

describe('seed', () => {
  const {
    BASE_PATH,
    DATA_PATH,
    SEED_PATH,
    ADMINISTRATOR_NAME,
    ADMINISTRATOR_ABBREVIATION,
    ADMINISTRATOR_LOCALE,
    ADMINISTRATOR_EMAIL,
    ADMINISTRATOR_MOBILE,
  } = process.env;

  before(() => {
    process.env.BASE_PATH = __dirname;
    process.env.DATA_PATH = `${__dirname}'/../fixtures`;
    process.env.SEED_PATH = `${__dirname}'/../fixtures`;
  });

  afterEach(() => {
    process.env.ADMINISTRATOR_NAME = ADMINISTRATOR_NAME;
    process.env.ADMINISTRATOR_ABBREVIATION = ADMINISTRATOR_ABBREVIATION;
    process.env.ADMINISTRATOR_LOCALE = ADMINISTRATOR_LOCALE;
    process.env.ADMINISTRATOR_EMAIL = ADMINISTRATOR_EMAIL;
    process.env.ADMINISTRATOR_MOBILE = ADMINISTRATOR_MOBILE;
  });

  it('should read csv seed file', (done) => {
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

  it('should seed from csv if file exists', (done) => {
    const modelName = MODEL_NAME_PREDEFINE;
    const namespace = PREDEFINE_NAMESPACE_EVENTSEVERITY;
    const transform = (seedData) => {
      const name = get(seedData, 'strings.name.en');
      if (!isEmpty(name)) {
        const merged = mergeObjects(
          { _id: objectIdFor(modelName, namespace, name) },
          seedData
        );
        return merged;
      }
      return seedData;
    };
    const optns = { modelName, namespace, transform };

    seedFromCsv(optns, (error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed from json if file exists', (done) => {
    const modelName = MODEL_NAME_PREDEFINE;
    const namespace = PREDEFINE_NAMESPACE_EVENTSEVERITY;
    const transform = (seedData) => {
      const name = get(seedData, 'strings.name.en');
      if (!isEmpty(name)) {
        const merged = mergeObjects(
          { _id: objectIdFor(modelName, namespace, name) },
          seedData
        );
        return merged;
      }
      return seedData;
    };
    const optns = { modelName, namespace, transform };

    seedFromJson(optns, (error, results) => {
      expect(error).to.not.exist;
      expect(results).to.exist;
      done(error);
    });
  });

  it('should not seed from json if file exists', (done) => {
    const modelName = MODEL_NAME_PREDEFINE;
    const namespace = 'Unknown';
    const optns = { modelName, namespace };

    seedFromJson(optns, (error, results) => {
      expect(error).to.not.exist;
      expect(results).to.exist;
      done(error);
    });
  });

  it('should filter seed from seeds file if exists', (done) => {
    const modelName = MODEL_NAME_PREDEFINE;
    const namespace = PREDEFINE_NAMESPACE_EVENTSEVERITY;
    const filter = (val) => val.namespace === namespace;
    const transform = (seedData) => {
      const name = get(seedData, 'strings.name.en');
      if (!isEmpty(name)) {
        const merged = mergeObjects(
          { _id: objectIdFor(modelName, namespace, name) },
          seedData
        );
        return merged;
      }
      return seedData;
    };
    const optns = { modelName, namespace, filter, transform };

    seedFromSeeds(optns, (error, results) => {
      expect(error).to.not.exist;
      expect(results).to.exist;
      done(error);
    });
  });

  it('should not seed from seeds file if not exists', (done) => {
    const modelName = 'Unknown';
    const optns = { modelName };

    seedFromSeeds(optns, (error, results) => {
      expect(error).to.not.exist;
      expect(results).to.not.exist;
      done(error);
    });
  });

  it.skip('should not seed from seeds file if throws is true', (done) => {
    const modelName = MODEL_NAME_PREDEFINE;
    const optns = { modelName, throws: true };

    seedFromSeeds(optns, (error, results) => {
      expect(error).to.exist;
      expect(results).to.be.undefined;
      done();
    });
  });

  it('should seed predefine', (done) => {
    const optns = {};
    seedPredefine(optns, (error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed party', (done) => {
    seedParty({}, (error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event', (done) => {
    seedEvent({}, (error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed permissions', (done) => {
    seedPermissions((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed defaults', (done) => {
    seedDefaults((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed commons', (done) => {
    seedCommons((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed units', (done) => {
    seedUnits((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed priorities', (done) => {
    seedPriorities((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed administrative levels', (done) => {
    seedAdministrativeLevels((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed feature types', (done) => {
    seedFeatureTypes((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event indicators', (done) => {
    seedEventIndicators((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event topics', (done) => {
    seedEventTopics((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event levels', (done) => {
    seedEventLevels((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event severities', (done) => {
    seedEventSeverities((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event certainties', (done) => {
    seedEventCertainties((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event statuses', (done) => {
    seedEventStatuses((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event urgencies', (done) => {
    seedEventUrgencies((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event responses', (done) => {
    seedEventResponses((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed party ownerships', (done) => {
    seedPartyOwnerships((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed party groups', (done) => {
    seedPartyGroups((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed party roles', (done) => {
    seedPartyRoles((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed party roles', (done) => {
    seedPartyGenders((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed party occupations', (done) => {
    seedPartyOccupations((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed party nationalities', (done) => {
    seedPartyNationalities((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed vehicle types', (done) => {
    seedVehicleTypes((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed vehicle models', (done) => {
    seedVehicleModels((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed vehicle makes', (done) => {
    seedVehicleMakes((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed vehicle statuses', (done) => {
    seedVehicleStatuses((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event groups', (done) => {
    seedEventGroups((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event types', (done) => {
    seedEventTypes((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event functions', (done) => {
    seedEventFunctions((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event actions', (done) => {
    seedEventActions((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event questions', (done) => {
    seedEventQuestions((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed administrative areas', (done) => {
    seedAdministrativeAreas((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed default administrator', (done) => {
    seedAdministrators((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed provided administrator', (done) => {
    process.env.ADMINISTRATOR_NAME = 'Lally Elias';
    process.env.ADMINISTRATOR_ABBREVIATION = 'LE';
    process.env.ADMINISTRATOR_LOCALE = 'en';
    process.env.ADMINISTRATOR_EMAIL = 'lally.elias@example.com';
    process.env.ADMINISTRATOR_MOBILE = '0714005001';

    seedAdministrators((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed agencies', (done) => {
    seedAgencies((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed focals', (done) => {
    seedFocals((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed features', (done) => {
    seedFeatures((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed health facilities', (done) => {
    seedHealthFacilities((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed vehicles', (done) => {
    seedVehicles((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed event action catalogues', (done) => {
    seedEventActionCatalogues((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed notification templates', (done) => {
    seedNotificationTemplates((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed events', (done) => {
    seedEvents((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed vehicle dispatches', (done) => {
    seedVehicleDispatches((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should seed cases', (done) => {
    seedCases((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  it('should not override same seed with different related', (done) => {
    waterfall(
      [
        (next) => seedAdministrativeAreas(next),
        (next) => Predefine.findAdministrativeArea(next),
      ],
      (error, areas) => {
        expect(error).to.not.exist;
        expect(areas).to.exist.and.have.length(4); // TODO: cross check assertions
        expect(areas.map((area) => area.strings.name.en)).to.have.length(
          areas.length
        );
        done(error, areas);
      }
    );
  });

  it('should seed data', (done) => {
    seed((error) => {
      expect(error).to.not.exist;
      done(error);
    });
  });

  after(() => {
    process.env.BASE_PATH = BASE_PATH;
    process.env.DATA_PATH = DATA_PATH;
    process.env.SEED_PATH = SEED_PATH;
    process.env.ADMINISTRATOR_NAME = ADMINISTRATOR_NAME;
    process.env.ADMINISTRATOR_ABBREVIATION = ADMINISTRATOR_ABBREVIATION;
    process.env.ADMINISTRATOR_LOCALE = ADMINISTRATOR_LOCALE;
    process.env.ADMINISTRATOR_EMAIL = ADMINISTRATOR_EMAIL;
    process.env.ADMINISTRATOR_MOBILE = ADMINISTRATOR_MOBILE;
  });
});
