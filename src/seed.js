import { join as joinPath, resolve as resolvePath } from 'path';
import { forEach, isEmpty, mapKeys, split, toLower } from 'lodash';
import { waterfall } from 'async';
import {
  compact,
  join,
  pluralize,
  mergeObjects,
  sortedUniq,
} from '@lykmapipo/common';
import { getString } from '@lykmapipo/env';
import { debug, warn } from '@lykmapipo/logger';
import { readCsv } from '@lykmapipo/geo-tools';
import { Predefine, transformToPredefine } from '@lykmapipo/predefine';
import { PREDEFINE_RELATIONS } from './internals';
import { syncIndexes } from './database';

const PREDEFINE_MODEL_NAME = 'Predefine';

/**
 * @function pathFor
 * @name pathFor
 * @description Derive path from application base
 * @param {...string} [paths] valid path to derive from base
 * @returns {string} derived path
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * pathFor('seeds');
 * => /home/ewea/seeds
 */
export const pathFor = (...paths) => {
  const base = getString('BASE_PATH', process.cwd());
  const path = joinPath(base, ...paths);
  return path;
};

/**
 * @function dataPathFor
 * @name dataPathFor
 * @description Derive data path from application base of given file name
 * @param {string} fileName valid file name
 * @returns {string} valid data path
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * dataPathFor('events.csv');
 * => /home/ewea/data/events.csv
 */
export const dataPathFor = fileName => {
  const path = getString('DATA_PATH', pathFor('data'));
  return resolvePath(path, fileName);
};

/**
 * @function seedPathFor
 * @name seedPathFor
 * @description Derive seed path from application base of given file name
 * @param {string} fileName valid file name
 * @returns {string} valid seed path
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedPathFor('events.json');
 * => /home/ewea/seeds/events.json
 */
export const seedPathFor = fileName => {
  const path = getString('SEED_PATH', pathFor('seeds'));
  return resolvePath(path, fileName);
};

/**
 * @function csvPathFor
 * @name csvPathFor
 * @description Derive csv seed path of given model name
 * @param {string} modelName valid model name or predefine namespace
 * @returns {string} valid csv seed path
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * csvPathFor('events');
 * => /home/ewea/data/events.csv
 */
export const csvPathFor = modelName => {
  const fileName = `${pluralize(toLower(modelName))}.csv`;
  const csvPath = dataPathFor(fileName);
  return csvPath;
};

/**
 * @function shapeFilePathFor
 * @name shapeFilePathFor
 * @description Derive shapefile seed path of given model name
 * @param {string} modelName valid model name or predefine namespace
 * @returns {string} valid shapefile seed path
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * shapeFilePathFor('events');
 * => /home/ewea/data/events.shp
 */
export const shapeFilePathFor = modelName => {
  const fileName = `${pluralize(toLower(modelName))}.shp`;
  const shapeFilePath = dataPathFor(fileName);
  return shapeFilePath;
};

/**
 * @function geoJsonPathFor
 * @name geoJsonPathFor
 * @description Derive geojson seed path of given model name
 * @param {string} modelName valid model name or predefine namespace
 * @returns {string} valid geojson seed path
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * geoJsonPathFor('events');
 * => /home/ewea/data/events.geojson
 */
export const geoJsonPathFor = modelName => {
  const fileName = `${pluralize(toLower(modelName))}.geojson`;
  const geoJsonFilePath = dataPathFor(fileName);
  return geoJsonFilePath;
};

/**
 * @function jsonPathFor
 * @name jsonPathFor
 * @description Derive json seed path of given model name
 * @param {string} modelName valid model name or predefine namespace
 * @returns {string} valid json seed path
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * jsonPathFor('events');
 * => /home/ewea/seeds/events.json
 * => /home/ewea/seeds/events.js
 */
export const jsonPathFor = modelName => {
  const fileName = `${pluralize(toLower(modelName))}`;
  const jsonFilePath = dataPathFor(fileName);
  return jsonFilePath;
};

/**
 * @function transformSeedKeys
 * @name transformSeedKeys
 * @description Transform and normalize seed keys
 * @param {object} seed valid seed
 * @returns {object} transformed seed
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * transformSeedKeys({ Name: 'John Doe' });
 * => { name: 'John Doe' }
 */
export const transformSeedKeys = seed => {
  // copy seed
  const data = mergeObjects(seed);

  // normalize keys
  const transformed = mapKeys(data, (value, key) => {
    // key to lower
    let path = toLower(key);
    // key to path
    path = join(split(path, ' '), '.');
    // return normalized key
    return path;
  });

  // return
  return transformed;
};

/**
 * @function transformToPredefineSeed
 * @name transformToPredefineSeed
 * @description Transform and normalize given seed to predefine seed
 * @param {object} seed valid seed
 * @returns {object} valid predefine seed
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * transformToPredefineSeed({ Name: 'John Doe' });
 * => { strings: { name: { en : 'John Doe' } } }
 */
export const transformToPredefineSeed = seed => {
  // copy seed
  const data = mergeObjects(seed);

  // normalize to predefine
  const predefine = transformToPredefine(data);

  // transform relations
  const populate = {};
  forEach(PREDEFINE_RELATIONS, (value, key) => {
    const hasRelation = key && seed[key];
    if (hasRelation) {
      const options = mergeObjects(value);
      const path = `relations.${key}`;
      const model = options.ref || PREDEFINE_MODEL_NAME;
      const array = options.array || false;
      const vals = sortedUniq(split(seed[key], ','));
      const match =
        model === PREDEFINE_MODEL_NAME
          ? { 'strings.name.en': { $in: vals } }
          : { name: { $in: vals } };
      populate[path] = { model, match, array };
    }
  });
  predefine.populate = populate;

  // return
  return predefine;
};

/**
 * @function applyTransformsOn
 * @name applyTransformsOn
 * @description Transform and normalize seed
 * @param {object} seed valid seed
 * @param {...Function} [transformers] transform to apply on seed
 * @returns {object} transformed seed
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * applyTransformsOn({ Name: 'John Doe' });
 * => { name: 'John Doe' }
 */
export const applyTransformsOn = (seed, ...transformers) => {
  // copy seed
  let data = mergeObjects(seed);

  // ensure transformers
  const transforms = compact([transformSeedKeys].concat(transformers));

  // apply transform sequentially
  forEach(transforms, applyTransformOn => {
    data = applyTransformOn(data);
  });

  // return
  return data;
};

/**
 * @function seedCsv
 * @name seedCsv
 * @description Read csv seed and apply see transforms
 * @param {string} path valid csv path
 * @param {Function[]} [transformers] transforms to apply on seed
 * @param {Function} done callback to invoke on next seed
 * @returns {object} transformed seed
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedCsv(path, transforms, (error, { finished, feature, next }) => { ... });
 */
export const seedCsv = (path, transformers, done) => {
  return readCsv({ path }, (error, { finished, feature, next }) => {
    let data = feature;
    if (!isEmpty(feature) && next && !finished) {
      data = applyTransformsOn(feature, ...transformers);
    }
    return done(error, { finished, feature: data, next });
  });
};

/**
 * @function seedPredefine
 * @name seedPredefine
 * @description Seed given predefine namespace
 * @param {string} namespace valid predefine namespace
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedPredefine(namespace, error => { ... });
 */
export const seedPredefine = (namespace, done) => {
  const csvFilePath = csvPathFor(namespace);
  const transformers = [transformToPredefineSeed];
  const stages = [
    then => {
      seedCsv(
        csvFilePath,
        transformers,
        (error, { finished, feature, next }) => {
          // handle read errors
          if (error) {
            return then(error);
          }
          // handle read finish
          if (finished) {
            return then();
          }
          // process features
          if (feature && next) {
            // seed feature
            const data = mergeObjects(feature, { namespace });
            return Predefine.seed(data, (err, seeded) => {
              return next(err, seeded);
            });
          }
          // request next chunk from stream
          return next && next();
        }
      );
    },
  ];
  return waterfall(stages, done);
};

/**
 * @function seedEventSeverities
 * @name seedEventSeverities
 * @description Seed event severities
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedEventSeverities(error => { ... });
 */
export const seedEventSeverities = done => {
  debug('Start Seeding Event Severities Data');
  return seedPredefine('EventSeverity', error => {
    debug('Finish Seeding Event Severities Data');
    return done(error);
  });
};

/**
 * @function seedEventCertainties
 * @name seedEventCertainties
 * @description Seed event certainties
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedEventCertainties(error => { ... });
 */
export const seedEventCertainties = done => {
  debug('Start Seeding Event Certainties Data');
  return seedPredefine('EventCertainty', error => {
    debug('Finish Seeding Event Certainties Data');
    return done(error);
  });
};

/**
 * @function seedPartyGroups
 * @name seedPartyGroups
 * @description Seed party groups
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedPartyGroups(error => { ... });
 */
export const seedPartyGroups = done => {
  debug('Start Seeding Party Groups Data');
  return seedPredefine('PartyGroup', error => {
    debug('Finish Seeding Party Groups Data');
    return done(error);
  });
};

/**
 * @function seedPartyRoles
 * @name seedPartyRoles
 * @description Seed party roles
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedPartyRoles(error => { ... });
 */
export const seedPartyRoles = done => {
  debug('Start Seeding Party Roles Data');
  return seedPredefine('PartyRole', error => {
    debug('Finish Seeding Party Roles Data');
    return done(error);
  });
};

/**
 * @function seedEventGroups
 * @name seedEventGroups
 * @description Seed event groups
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedEventGroups(error => { ... });
 */
export const seedEventGroups = done => {
  debug('Start Seeding Event Groups Data');
  return seedPredefine('EventGroup', error => {
    debug('Finish Seeding Event Groups Data');
    return done(error);
  });
};

/**
 * @function seed
 * @name seed
 * @description Seed data
 * @param {Function} done callback to invoke on success or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seed(error => { ... });
 */
export const seed = done => {
  // prepare seed tasks
  const tasks = [
    syncIndexes,
    seedEventSeverities,
    seedEventCertainties,
    seedPartyGroups,
    seedPartyRoles,
    seedEventGroups,
  ];

  // run seed tasks
  debug('Start Seeding Data');
  waterfall(tasks, (error, result) => {
    if (error) {
      warn('Fail Seeding Data', error);
    } else {
      debug('Finish Seeding Data');
    }
    return done(error, result);
  });
};
