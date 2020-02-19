import { PREDEFINE_RELATIONS, MODEL_NAME_PREDEFINE, PARTY_RELATIONS, EVENT_RELATIONS, MODEL_NAME_PARTY, MODEL_NAME_EVENT } from '@codetanzania/ewea-internals';
export * from '@codetanzania/ewea-internals';
import { waterfall } from 'async';
import { connect as connect$1, syncIndexes as syncIndexes$1, model } from '@lykmapipo/mongoose-common';
import { createModels } from '@lykmapipo/file';
import { join, resolve } from 'path';
import { toLower, mapKeys, split, map, forEach, isArray, first, omit, keys, isEmpty, endsWith, isFunction } from 'lodash';
import { pluralize, mergeObjects, join as join$1, compact, sortedUniq } from '@lykmapipo/common';
import { getString } from '@lykmapipo/env';
import { debug, warn } from '@lykmapipo/logger';
import { readCsv, readJson } from '@lykmapipo/geo-tools';
import { transformToPredefine, listPermissions } from '@lykmapipo/predefine';
import { Permission } from '@lykmapipo/permission';

/**
 * @function connect
 * @name connect
 * @description Ensure database connection
 * @param {Function} done callback to invoke on success or error
 * @returns {Error} connection error if failed
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * connect(error => { ... });
 */
const connect = done => {
  return connect$1(error => {
    createModels();
    return done(error);
  });
};

/**
 * @function syncIndexes
 * @name syncIndexes
 * @description Synchronize model database indexes
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|object} error if failed else sync results
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * syncIndexes(error => { ... });
 */
const syncIndexes = done => waterfall([connect, syncIndexes$1], done);

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
const pathFor = (...paths) => {
  const base = getString('BASE_PATH', process.cwd());
  const path = join(base, ...paths);
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
const dataPathFor = fileName => {
  const path = getString('DATA_PATH', pathFor('data'));
  return resolve(path, fileName);
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
const seedPathFor = fileName => {
  const path = getString('SEED_PATH', pathFor('seeds'));
  return resolve(path, fileName);
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
const csvPathFor = modelName => {
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
const shapeFilePathFor = modelName => {
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
const geoJsonPathFor = modelName => {
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
 */
const jsonPathFor = modelName => {
  const fileName = `${pluralize(toLower(modelName))}.json`;
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
const transformSeedKeys = seed => {
  // copy seed
  const data = mergeObjects(seed);

  // normalize keys
  const transformed = mapKeys(data, (value, key) => {
    // key to lower
    let path = toLower(key);
    // key to path
    path = join$1(split(path, ' '), '.');
    // return normalized key
    return path;
  });

  // return
  return transformed;
};

/**
 * @function applyTransformsOn
 * @name applyTransformsOn
 * @description Transform and normalize seed
 * @param {object|object[]} seed valid seed(s)
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
const applyTransformsOn = (seed, ...transformers) => {
  // copy seed
  let data = compact([].concat(seed));

  data = map(data, value => {
    // copy value
    let transformed = mergeObjects(value);

    // ensure transformers
    const transforms = compact([transformSeedKeys].concat(transformers));

    // apply transform sequentially
    forEach(transforms, applyTransformOn => {
      transformed = applyTransformOn(transformed);
    });

    // return transformed
    return transformed;
  });

  // return
  data = isArray(seed) ? data : first(data);
  return data;
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
const transformToPredefineSeed = seed => {
  // copy seed
  const data = mergeObjects(seed);

  // normalize to predefine
  let predefine = transformToPredefine(data);

  // transform relations
  const populate = {};
  forEach(PREDEFINE_RELATIONS, (value, key) => {
    const hasRelation = key && seed[key];
    if (hasRelation) {
      const options = mergeObjects(value);
      const path = `relations.${options.path || key}`;
      const modelName = options.ref || MODEL_NAME_PREDEFINE;
      const array = options.array || false;
      const vals = sortedUniq(split(seed[key], ','));
      const match =
        modelName === MODEL_NAME_PREDEFINE
          ? { 'strings.name.en': { $in: vals } }
          : { name: { $in: vals } };
      populate[path] = { model: modelName, match, array };
    }
  });
  predefine.populate = populate;

  // return
  predefine = omit(predefine, ...[...keys(PREDEFINE_RELATIONS), 'relations']);
  return predefine;
};

/**
 * @function transformToPartySeed
 * @name transformToPartySeed
 * @description Transform and normalize given seed to party seed
 * @param {object} seed valid seed
 * @returns {object} valid party seed
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * transformToPartySeed({ Name: 'John Doe' });
 * => { name: 'John Doe' }
 */
const transformToPartySeed = seed => {
  // copy seed
  let data = mergeObjects(seed);

  // transform relations
  const populate = {};
  forEach(PARTY_RELATIONS, (value, key) => {
    const hasRelation = key && data[key];
    if (hasRelation) {
      const options = mergeObjects(value);
      const path = `${options.path || key}`;
      const modelName = options.ref || MODEL_NAME_PREDEFINE;
      const array = options.array || false;
      const vals = sortedUniq(split(data[key], ','));
      const match =
        modelName === MODEL_NAME_PREDEFINE
          ? { 'strings.name.en': { $in: vals } }
          : { name: { $in: vals } };
      populate[path] = { model: modelName, match, array };
    }
  });
  data.populate = populate;

  // return
  data = omit(data, ...[...keys(PARTY_RELATIONS), 'relations', 'namespace']);
  return data;
};

/**
 * @function transformToEventSeed
 * @name transformToEventSeed
 * @description Transform and normalize given seed to event seed
 * @param {object} seed valid seed
 * @returns {object} valid party seed
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * transformToEventSeed({ Name: 'John Doe' });
 * => { name: 'John Doe' }
 */
const transformToEventSeed = seed => {
  // copy seed
  let data = mergeObjects(seed);

  // transform relations
  const populate = {};
  forEach(EVENT_RELATIONS, (value, key) => {
    const hasRelation = key && data[key];
    if (hasRelation) {
      const options = mergeObjects(value);
      const path = `${options.path || key}`;
      const modelName = options.ref || MODEL_NAME_PREDEFINE;
      const array = options.array || false;
      const vals = sortedUniq(split(data[key], ','));
      const match =
        modelName === MODEL_NAME_PREDEFINE
          ? { 'strings.name.en': { $in: vals } }
          : { name: { $in: vals } };
      populate[path] = { model: modelName, match, array };
    }
  });
  data.populate = populate;

  // return
  data = omit(data, ...[...keys(EVENT_RELATIONS), 'relations', 'namespace']);
  return data;
};

/**
 * @function readCsvFile
 * @name readCsvFile
 * @description Read csv seed and apply seed transforms
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
 * readCsvFile(path, transforms, (error, { finished, feature, next }) => { ... });
 */
const readCsvFile = (path, transformers, done) => {
  return readCsv({ path }, (error, { finished, feature, next }) => {
    let data = feature;
    if (!isEmpty(feature) && next && !finished) {
      data = applyTransformsOn(feature, ...transformers);
    }
    return done(error, { finished, feature: data, next });
  });
};

/**
 * @function processCsvSeed
 * @name processCsvSeed
 * @description process each csv row (data)
 * @param {object} [options] valid options
 * @param {string} [options.Model=undefined] valid model name
 * @param {object} [options.properties={}] valid extra properties to merge on each seed
 * @param {string} [options.namespace=undefined] valid predefine namespace
 * @param {boolean} [options.throws=false] whether to throw error
 * @param {Function} done callback to invoke on success or error
 * @returns {Function} call back function
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const options = { Model = undefined, properties = {}, namespace = undefined, throws = false }
 * processCsvSeed((options,done) => (error,{finished,feature,next}) => { ... });
 */
const processCsvSeed = (
  { Model = undefined, properties = {}, namespace = undefined, throws = false },
  done
) => (error, { finished, feature, next }) => {
  // handle file read errors
  if (error) {
    return throws ? done(error) : done();
  }
  // handle read finish
  if (finished) {
    return done();
  }
  // process datas
  if (feature && next) {
    // seed data & next chunk from csv read stream
    const data = mergeObjects(properties, { namespace }, feature);
    return Model.seed(data, next);
  }
  // request next chunk from csv read stream
  return next && next();
};

/**
 * @function seedFromCsv
 * @name seedFromCsv
 * @description Seed given model from csv file
 * @param {object} optns valid seed options
 * @param {string} [optns.modelName] valid model name
 * @param {string} [optns.namespace] valid predefine namespace
 * @param {boolean} [optns.throws=false] whether to throw error
 * @param {string} [optns.filePath=undefined] valid full file path for csv seed
 * @param {object} [optns.properties={}] extra properties to merge on each seed
 * @param {Function[]} [optns.transformers] valid predefine transformers
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const opts = { modelName: ..., transformers: [ ... ] };
 * seedFromCsv(optns, error => { ... });
 */
const seedFromCsv = (optns, done) => {
  // normalize options
  const {
    filePath = undefined,
    properties = {},
    modelName = undefined,
    namespace = undefined,
    throws = false,
    transformers = [],
  } = mergeObjects(optns);

  // do: seed data to model if exists
  const Model = model(modelName);
  if (Model) {
    // prepare seed options
    const isPredefine =
      modelName === MODEL_NAME_PREDEFINE && !isEmpty(namespace);
    const csvFilePath = filePath || csvPathFor(namespace || modelName);
    const appliedTransformers = isPredefine
      ? [transformToPredefineSeed, ...transformers]
      : [...transformers];

    // seed from csv
    return readCsvFile(
      csvFilePath,
      appliedTransformers,
      processCsvSeed({ Model, properties, throws }, done)
    );
  }

  // backoff: no data model found
  return done();
};

/**
 * @function seedFromJson
 * @name seedFromJson
 * @description Seed given model from json file
 * @param {object} optns valid seed options
 * @param {string} [optns.modelName] valid model name
 * @param {string} [optns.namespace] valid predefine namespace
 * @param {boolean} [optns.throws=false] whether to throw error
 * @param {string} [optns.filePath=undefined] valid full file path for json seed
 * @param {object} [optns.properties={}] extra properties to merge on each seed
 * @param {Function[]} [optns.transformers] valid predefine transformers
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const opts = { modelName: ..., transformers: [ ... ] };
 * seedFromJson(optns, error => { ... });
 */
const seedFromJson = (optns, done) => {
  // normalize options
  const {
    filePath = undefined,
    properties = {},
    modelName = undefined,
    namespace = undefined,
    throws = false,
    transformers = [],
  } = mergeObjects(optns);

  // do: seed data to model if exists
  const Model = model(modelName);
  if (Model) {
    // prepare seed options
    const isPredefine =
      modelName === MODEL_NAME_PREDEFINE && !isEmpty(namespace);
    const jsonFilePath = filePath || jsonPathFor(namespace || modelName);
    const appliedTransformers = isPredefine
      ? [transformToPredefineSeed, ...transformers]
      : [...transformers];

    // prepare json seed stages
    const path = endsWith(jsonFilePath, '.json')
      ? jsonFilePath
      : `${jsonFilePath}.json`;
    return readJson({ path, throws }, (error, data) => {
      if (!isEmpty(data)) {
        const transform = seed => {
          const merged = mergeObjects(properties, { namespace }, seed);
          return applyTransformsOn(merged, ...appliedTransformers);
        };
        return Model.seed({ data, transform }, done);
      }
      return done(error, data);
    });
  }
  // backoff: no data model found
  return done();
};

/**
 * @function seedFromSeeds
 * @name seedFromSeeds
 * @description Seed given model from seeds file
 * @param {object} optns valid seed options
 * @param {string} [optns.modelName] valid model name
 * @param {boolean} [optns.throws=false] whether to throw error
 * @param {Function} [optns.filter=undefined] seed data filter
 * @param {Function} [optns.transform=undefined] seed data transformer
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const opts = { modelName: ... };
 * seedFromSeeds(optns, error => { ... });
 */
const seedFromSeeds = (optns, done) => {
  // normalize options
  const {
    modelName = undefined,
    throws = false,
    filter,
    transform,
  } = mergeObjects(optns);

  // do: seed data to model if seeds exists
  const Model = model(modelName);
  const canSeed = Model && isFunction(Model.seed);
  if (canSeed) {
    // filter, transform & seed
    return Model.seed({ filter, transform }, (error, results) => {
      // reply with errors
      if (throws) {
        return done(error, results);
      }
      // ignore errors
      return done(null, results);
    });
  }
  // backoff: no data model found
  return done();
};

/**
 * @function seedPredefine
 * @name seedPredefine
 * @description Seed given predefine namespace
 * @param {object} optns valid seed options
 * @param {string} optns.namespace valid predefine namespace
 * @param {boolean} [optns.throws=false] whether to ignore error
 * @param {Function[]} optns.transformers valid predefine transformers
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
 * seedPredefine(optns, error => { ... });
 */
const seedPredefine = (optns, done) => {
  // normalize options
  const {
    modelName = MODEL_NAME_PREDEFINE,
    namespace = undefined,
    throws = false,
    transformers = [],
  } = mergeObjects(optns);

  // prepare namespace filter
  const filter = seed => seed.namespace === namespace;

  // prepare options
  const options = { modelName, namespace, throws, transformers, filter };

  // prepare predefine seed stages
  const fromSeeds = next => seedFromSeeds(options, error => next(error));
  const fromJson = next => seedFromJson(options, error => next(error));
  const fromCsv = next => seedFromCsv(options, error => next(error));
  const stages = [fromSeeds, fromJson, fromCsv];

  // do seed predefine
  return waterfall(stages, done);
};

/**
 * @function seedParty
 * @name seedParty
 * @description Seed given parties
 * @param {object} optns valid seed options
 * @param {string} optns.type valid party type
 * @param {boolean} [optns.throws=false] whether to ignore error
 * @param {Function[]} optns.transformers valid party transformers
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
 * seedParty(optns, error => { ... });
 */
const seedParty = (optns, done) => {
  // normalize options
  const {
    modelName = MODEL_NAME_PARTY,
    type = 'Focal',
    throws = false,
    transformers = [],
  } = mergeObjects(optns);

  // prepare type filter
  const filter = seed => seed.type === type;

  // prepare options
  const options = {
    modelName,
    namespace: type,
    properties: { type },
    type,
    throws,
    transformers: [transformToPartySeed, ...transformers],
    filter,
  };

  // prepare party seed stages
  const fromSeeds = next => seedFromSeeds(options, error => next(error));
  const fromJson = next => seedFromJson(options, error => next(error));
  const fromCsv = next => seedFromCsv(options, error => next(error));
  const stages = [fromSeeds, fromJson, fromCsv];

  // do seed party
  return waterfall(stages, done);
};

/**
 * @function seedEvent
 * @name seedEvent
 * @description Seed given events
 * @param {object} optns valid seed options
 * @param {boolean} [optns.throws=false] whether to ignore error
 * @param {Function[]} optns.transformers valid event transformers
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
 * seedEvent(optns, error => { ... });
 */
const seedEvent = (optns, done) => {
  // normalize options
  const {
    modelName = MODEL_NAME_EVENT,
    throws = false,
    transformers = [],
  } = mergeObjects(optns);

  // prepare options
  const options = {
    modelName,
    properties: {},
    throws,
    transformers: [transformToEventSeed, ...transformers],
  };

  // prepare event seed stages
  const fromSeeds = next => seedFromSeeds(options, error => next(error));
  const fromJson = next => seedFromJson(options, error => next(error));
  const fromCsv = next => seedFromCsv(options, error => next(error));
  const stages = [fromSeeds, fromJson, fromCsv];

  // do seed event
  return waterfall(stages, done);
};

/**
 * @function seedPermissions
 * @name seedPermissions
 * @description Seed permissions
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.4.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedPermissions(error => { ... });
 */
const seedPermissions = done => {
  debug('Start Seeding Permissions Data');

  // prepare permissions seed stages
  const seedResourcePermissions = next => {
    return Permission.seed(error => next(error));
  };
  const seedPredefineNamespacePermissions = next => {
    const namespacePermissions = listPermissions();
    return Permission.seed(namespacePermissions, error => next(error));
  };
  const stages = [seedResourcePermissions, seedPredefineNamespacePermissions];

  // do seed permissions
  return waterfall(stages, error => {
    debug('Finish Seeding Permissions Data');
    return done(error);
  });
};

/**
 * @function seedUnits
 * @name seedUnits
 * @description Seed unit of measure
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
 * seedUnits(error => { ... });
 */
const seedUnits = done => {
  debug('Start Seeding Units Data');
  const namespace = 'Unit';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Units Data');
    return done(error);
  });
};

/**
 * @function seedAdministrativeLevels
 * @name seedAdministrativeLevels
 * @description Seed administrative levels
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
 * seedAdministrativeLevels(error => { ... });
 */
const seedAdministrativeLevels = done => {
  debug('Start Seeding Administrative Levels Data');
  const namespace = 'AdministrativeLevel';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Administrative Levels Data');
    return done(error);
  });
};

/**
 * @function seedFeatureTypes
 * @name seedFeatureTypes
 * @description Seed feature types
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
 * seedFeatureTypes(error => { ... });
 */
const seedFeatureTypes = done => {
  debug('Start Seeding Feature Types Data');
  const namespace = 'FeatureType';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Feature Types Data');
    return done(error);
  });
};

/**
 * @function seedEventIndicators
 * @name seedEventIndicators
 * @description Seed event indicators
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
 * seedEventIndicators(error => { ... });
 */
const seedEventIndicators = done => {
  debug('Start Seeding Event Indicators Data');
  const namespace = 'EventIndicator';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Event Indicators Data');
    return done(error);
  });
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
const seedEventSeverities = done => {
  debug('Start Seeding Event Severities Data');
  const namespace = 'EventSeverity';
  return seedPredefine({ namespace }, error => {
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
const seedEventCertainties = done => {
  debug('Start Seeding Event Certainties Data');
  const namespace = 'EventCertainty';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Event Certainties Data');
    return done(error);
  });
};

/**
 * @function seedEventStatuses
 * @name seedEventStatuses
 * @description Seed event statuses
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.5.1
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedEventStatuses(error => { ... });
 */
const seedEventStatuses = done => {
  debug('Start Seeding Event Statuses Data');
  const namespace = 'EventStatus';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Event Statuses Data');
    return done(error);
  });
};

/**
 * @function seedEventUrgencies
 * @name seedEventUrgencies
 * @description Seed event urgencies
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.5.1
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedEventUrgencies(error => { ... });
 */
const seedEventUrgencies = done => {
  debug('Start Seeding Event Urgencies Data');
  const namespace = 'EventUrgency';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Event Urgencies Data');
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
const seedPartyGroups = done => {
  debug('Start Seeding Party Groups Data');
  const namespace = 'PartyGroup';
  return seedPredefine({ namespace }, error => {
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
const seedPartyRoles = done => {
  debug('Start Seeding Party Roles Data');
  const namespace = 'PartyRole';
  return seedPredefine({ namespace }, error => {
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
const seedEventGroups = done => {
  debug('Start Seeding Event Groups Data');
  const namespace = 'EventGroup';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Event Groups Data');
    return done(error);
  });
};

/**
 * @function seedEventTypes
 * @name seedEventTypes
 * @description Seed event types
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
 * seedEventTypes(error => { ... });
 */
const seedEventTypes = done => {
  debug('Start Seeding Event Types Data');
  const namespace = 'EventType';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Event Types Data');
    return done(error);
  });
};

/**
 * @function seedEventFunctions
 * @name seedEventFunctions
 * @description Seed event functions
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
 * seedEventFunctions(error => { ... });
 */
const seedEventFunctions = done => {
  debug('Start Seeding Event Functions Data');
  const namespace = 'EventFunction';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Event Functions Data');
    return done(error);
  });
};

/**
 * @function seedEventActions
 * @name seedEventActions
 * @description Seed event actions
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
 * seedEventActions(error => { ... });
 */
const seedEventActions = done => {
  debug('Start Seeding Event Actions Data');
  const namespace = 'EventAction';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Event Actions Data');
    return done(error);
  });
};

/**
 * @function seedEventQuestions
 * @name seedEventQuestions
 * @description Seed event questions
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
 * seedEventQuestions(error => { ... });
 */
const seedEventQuestions = done => {
  debug('Start Seeding Event Questions Data');
  const namespace = 'EventQuestion';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Event Questions Data');
    return done(error);
  });
};

/**
 * @function seedAdministrativeAreas
 * @name seedAdministrativeAreas
 * @description Seed administrative areas
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.4.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedAdministrativeAreas(error => { ... });
 */
const seedAdministrativeAreas = done => {
  debug('Start Seeding Administrative Areas Data');
  const namespace = 'AdministrativeArea';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Administrative Areas Data');
    return done(error);
  });
};

/**
 * @function seedAgencies
 * @name seedAgencies
 * @description Seed agencies
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.4.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedAgencies(error => { ... });
 */
const seedAgencies = done => {
  debug('Start Seeding Agencies Data');
  const type = 'Agency';
  return seedParty({ type }, error => {
    debug('Finish Seeding Agencies Data');
    return done(error);
  });
};

/**
 * @function seedFocals
 * @name seedFocals
 * @description Seed agencies
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.4.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedFocals(error => { ... });
 */
const seedFocals = done => {
  debug('Start Seeding Focals Data');
  const type = 'Focal';
  return seedParty({ type }, error => {
    debug('Finish Seeding Focals Data');
    return done(error);
  });
};

/**
 * @function seedFeatures
 * @name seedFeatures
 * @description Seed features
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.4.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedFeatures(error => { ... });
 */
const seedFeatures = done => {
  debug('Start Seeding Features Data');
  const namespace = 'Feature';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Features Data');
    return done(error);
  });
};

/**
 * @function seedEventCatalogues
 * @name seedEventCatalogues
 * @description Seed event catalogues
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.4.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedEventCatalogues(error => { ... });
 */
const seedEventCatalogues = done => {
  debug('Start Seeding Event Catalogues Data');
  const namespace = 'EventCatalogue';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Event Catalogues Data');
    return done(error);
  });
};

/**
 * @function seedNotificationTemplates
 * @name seedNotificationTemplates
 * @description Seed notification templates
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.4.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedNotificationTemplates(error => { ... });
 */
const seedNotificationTemplates = done => {
  debug('Start Seeding Notification Templates Data');
  const namespace = 'NotificationTemplate';
  return seedPredefine({ namespace }, error => {
    debug('Finish Seeding Notification Templates Data');
    return done(error);
  });
};

/**
 * @function seedEvents
 * @name seedEvents
 * @description seed events
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.4.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedEvents(error => { ... });
 */
const seedEvents = done => {
  debug('Start Seeding Events Data');
  return seedEvent({}, error => {
    debug('Finish Seeding Events Data');
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
const seed = done => {
  // prepare seed tasks
  const tasks = [
    syncIndexes,
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
    // seedEventChangeLogs,
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

export { applyTransformsOn, connect, csvPathFor, dataPathFor, geoJsonPathFor, jsonPathFor, pathFor, processCsvSeed, readCsvFile, seed, seedAdministrativeAreas, seedAdministrativeLevels, seedAgencies, seedEvent, seedEventActions, seedEventCatalogues, seedEventCertainties, seedEventFunctions, seedEventGroups, seedEventIndicators, seedEventQuestions, seedEventSeverities, seedEventStatuses, seedEventTypes, seedEventUrgencies, seedEvents, seedFeatureTypes, seedFeatures, seedFocals, seedFromCsv, seedFromJson, seedFromSeeds, seedNotificationTemplates, seedParty, seedPartyGroups, seedPartyRoles, seedPathFor, seedPermissions, seedPredefine, seedUnits, shapeFilePathFor, syncIndexes, transformSeedKeys, transformToEventSeed, transformToPartySeed, transformToPredefineSeed };
