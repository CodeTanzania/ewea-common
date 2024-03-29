import {
  MODEL_NAME_PERMISSION,
  MODEL_NAME_PREDEFINE,
  MODEL_NAME_PARTY,
  MODEL_NAME_EVENT,
  MODEL_NAME_VEHICLEDISPATCH,
  MODEL_NAME_CASE,
  PREDEFINE_NAMESPACE_UNIT,
  PREDEFINE_NAMESPACE_PRIORITY,
  PREDEFINE_NAMESPACE_ADMINISTRATIVELEVEL,
  PREDEFINE_NAMESPACE_FEATURETYPE,
  PREDEFINE_NAMESPACE_EVENTINDICATOR,
  PREDEFINE_NAMESPACE_EVENTTOPIC,
  PREDEFINE_NAMESPACE_EVENTLEVEL,
  PREDEFINE_NAMESPACE_EVENTSEVERITY,
  PREDEFINE_NAMESPACE_EVENTCERTAINTY,
  PREDEFINE_NAMESPACE_EVENTSTATUS,
  PREDEFINE_NAMESPACE_EVENTURGENCY,
  PREDEFINE_NAMESPACE_EVENTRESPONSE,
  PREDEFINE_NAMESPACE_PARTYOWNERSHIP,
  PREDEFINE_NAMESPACE_PARTYGROUP,
  PREDEFINE_NAMESPACE_PARTYROLE,
  PREDEFINE_NAMESPACE_PARTYGENDER,
  PREDEFINE_NAMESPACE_PARTYOCCUPATION,
  PREDEFINE_NAMESPACE_PARTYNATIONALITY,
  PREDEFINE_NAMESPACE_VEHICLETYPE,
  PREDEFINE_NAMESPACE_VEHICLEMODEL,
  PREDEFINE_NAMESPACE_VEHICLEMAKE,
  PREDEFINE_NAMESPACE_VEHICLESTATUS,
  PREDEFINE_NAMESPACE_EVENTGROUP,
  PREDEFINE_NAMESPACE_EVENTTYPE,
  PREDEFINE_NAMESPACE_EVENTFUNCTION,
  PREDEFINE_NAMESPACE_EVENTACTION,
  PREDEFINE_NAMESPACE_EVENTQUESTION,
  PREDEFINE_NAMESPACE_FEATURE,
  PREDEFINE_NAMESPACE_HEALTHFACILITY,
  PREDEFINE_NAMESPACE_VEHICLE,
  PREDEFINE_NAMESPACE_EVENTACTIONCATALOGUE,
  PREDEFINE_NAMESPACE_ADMINISTRATIVEAREA,
  PREDEFINE_NAMESPACE_NOTIFICATIONTEMPLATE,
  PARTY_RELATIONS,
  PREDEFINE_RELATIONS,
  EVENT_RELATIONS,
  VEHICLE_DISPATCH_RELATIONS,
  CASE_RELATIONS,
} from '@codetanzania/ewea-internals';
import { join as joinPath, resolve as resolvePath } from 'path';
import {
  endsWith,
  first,
  forEach,
  get,
  includes,
  isArray,
  isEmpty,
  isFunction,
  isNaN,
  keys,
  map,
  mapKeys,
  omit,
  set,
  split,
  toLower,
  toNumber,
  trim,
  values,
} from 'lodash';
import { waterfall } from 'async';
import {
  areNotEmpty,
  compact,
  join,
  pluralize,
  mergeObjects,
  sortedUniq,
  classify,
} from '@lykmapipo/common';
import { getString } from '@lykmapipo/env';
import { toE164 } from '@lykmapipo/phone';
import { debug, warn } from '@lykmapipo/logger';
import { readCsv, readJson, parseCoordinateString } from '@lykmapipo/geo-tools';
import { model, objectIdFor } from '@lykmapipo/mongoose-common';
import { listPermissions, transformToPredefine } from '@lykmapipo/predefine';
import { Permission } from '@lykmapipo/permission';

import {
  DEFAULT_SEEDS,
  COMMON_VEHICLESTATUS_SEEDS,
  COMMON_CASESEVERITY_SEEDS,
  COMMON_CASESTAGE_SEEDS,
} from './constants';

import { syncIndexes } from './database';

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
export const dataPathFor = (fileName) => {
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
export const seedPathFor = (fileName) => {
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
export const csvPathFor = (modelName) => {
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
export const shapeFilePathFor = (modelName) => {
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
export const geoJsonPathFor = (modelName) => {
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
export const jsonPathFor = (modelName) => {
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
export const transformSeedKeys = (seed) => {
  // copy seed
  const data = mergeObjects(seed);

  // normalize keys
  const transformed = mapKeys(data, (value, key) => {
    // key to lower
    // TODO: camelize?
    let path = toLower(trim(key));
    // key to path
    path = join(split(path, ' '), '.');
    // return normalized key
    return path;
  });

  // return
  return transformed;
};

/**
 * @function transformGeoFields
 * @name transformGeoFields
 * @description Transform and normalize seed geo fields
 * @param {object} seed valid seed
 * @returns {object} transformed seed
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * transformGeoFields({ point: '1,2' });
 * => { point: { type: 'Point', coordinates: [ 1, 2 ] } }
 */
export const transformGeoFields = (seed) => {
  // copy seed
  const transformed = mergeObjects(seed);

  // allowed geo fields
  const fields = {
    location: 'location',
    centroid: 'centroid',
    point: 'point',
    'geos.point': 'geos.point',
    circle: 'polygon',
    'geos.circle': 'geos.polygon',
    polygon: 'polygon',
    'geos.polygon': 'geos.polygon',
    geometry: 'geometry',
  };

  // transform geo fields
  forEach(fields, (seedPath, originalPath) => {
    // parse coordinates to geometry
    try {
      const geometry = parseCoordinateString(seed[originalPath]);
      if (geometry) {
        transformed[seedPath] = geometry;
      }
    } catch (e) {
      // ignore on error
    }
  });

  // otherwise tranform longitude and latitude
  if (transformed.longitude && transformed.latitude) {
    transformed.point = {
      type: 'Point',
      coordinates: [
        Number(transformed.longitude),
        Number(transformed.latitude),
      ],
    };
  }

  // return
  return transformed;
};

/**
 * @function transformOtherFields
 * @name transformOtherFields
 * @description Transform and normalize other seed fields
 * @param {object} seed valid seed
 * @returns {object} transformed seed
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * transformOtherFields({ action: '...' });
 * => { name: '...', action: '...' }
 */
export const transformOtherFields = (seed) => {
  // copy seed
  const transformed = mergeObjects(seed);

  // ensure event action catalogue.name from action
  if (isEmpty(transformed.name) && !isEmpty(transformed.action)) {
    transformed.name = transformed.action;
  }

  // ensure weight from level & order
  const weight = toNumber(transformed.level || transformed.order);
  if (!isNaN(weight)) {
    transformed.weight = weight;
    transformed.numbers = mergeObjects(transformed.numbers, { weight });
  }

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
export const applyTransformsOn = (seed, ...transformers) => {
  // copy seed
  let data = compact([].concat(seed));

  data = map(data, (value) => {
    // copy value
    let transformed = mergeObjects(value);

    // ensure transformers
    const baseTransformers = [
      transformSeedKeys,
      transformGeoFields,
      transformOtherFields,
    ];
    const transforms = compact(baseTransformers.concat(transformers));

    // apply transform sequentially
    forEach(transforms, (applyTransformOn) => {
      transformed = isFunction(applyTransformOn)
        ? applyTransformOn(transformed)
        : mergeObjects(transformed);
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
export const transformToPredefineSeed = (seed) => {
  // copy seed
  const data = mergeObjects(seed);

  // normalize to predefine
  let predefine = transformToPredefine(data);
  predefine.raw = data;

  // transform relations
  // TODO: honor exist populate option
  // TODO: handle parent of administrative area using level
  const populate = {};
  forEach(PREDEFINE_RELATIONS, (value, key) => {
    const hasRelation = key && seed[key];
    if (hasRelation) {
      const options = mergeObjects(value);
      const path = `relations.${options.path || key}`;
      const modelName = options.ref || MODEL_NAME_PREDEFINE;
      const namespaces = compact([].concat(options.namespace));
      const array = options.array || false;
      const vals = sortedUniq(split(seed[key], ','));
      const match =
        modelName === MODEL_NAME_PREDEFINE
          ? { 'strings.name.en': { $in: vals }, namespace: { $in: namespaces } }
          : { name: { $in: vals } };

      // honour administrative area seed hierarchy
      const handleAdministrativeArea =
        seed.namespace === PREDEFINE_NAMESPACE_ADMINISTRATIVEAREA &&
        key === 'parent' &&
        seed.level;
      const ignore = handleAdministrativeArea
        ? {
            model: modelName,
            path: 'relations.level',
            match: {
              'strings.name.en': { $in: [seed.level] },
              namespace: { $in: [PREDEFINE_NAMESPACE_ADMINISTRATIVELEVEL] },
            },
            array: false,
          }
        : {};

      populate[path] = { model: modelName, match, array, ignore };
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
export const transformToPartySeed = (seed) => {
  // copy seed
  let data = mergeObjects(seed);

  // generate seed object id
  const shouldGenerateId =
    !get(data, '_id') && areNotEmpty(data.mobile, data.email);
  if (shouldGenerateId) {
    set(
      data,
      '_id',
      objectIdFor(MODEL_NAME_PARTY, toE164(data.mobile), toLower(data.email))
    );
  }

  // ensure default password
  if (isEmpty(data.password)) {
    data.password = getString(
      'DEFAULT_HASHED_PASSWORD',
      // TODO: dynamically hash DEFAULT_PASSWORD
      '$2a$10$rwpL/BhU8xY4fkf8SG7fHugF4PCioTJqy8BLU7BZ8N0YV.8Y1dXem'
    );
  }

  // ensure confirmed time
  data.confirmedAt = new Date();

  // clear lock
  data.failedAttempts = 0;
  data.lockedAt = null;
  data.unlockedAt = null;
  data.unlockToken = null;
  data.unlockSentAt = null;
  data.unlockTokenExpiryAt = null;

  // transform relations
  const populate = {};
  forEach(PARTY_RELATIONS, (value, key) => {
    const hasRelation = key && data[key];
    if (hasRelation) {
      const options = mergeObjects(value);
      const path = `${options.path || key}`;
      const modelName = options.ref || MODEL_NAME_PREDEFINE;
      const namespaces = compact([].concat(options.namespace));
      const array = options.array || false;
      const vals = sortedUniq(split(data[key], ','));
      const match =
        modelName === MODEL_NAME_PREDEFINE
          ? { 'strings.name.en': { $in: vals }, namespace: { $in: namespaces } }
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
 * @returns {object} valid event seed
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
export const transformToEventSeed = (seed) => {
  // copy seed
  let data = mergeObjects(seed);

  // generate seed object id
  if (!get(data, '_id') && data.number) {
    set(data, '_id', objectIdFor(MODEL_NAME_EVENT, data.number));
  }

  // transform relations
  const populate = {};
  forEach(EVENT_RELATIONS, (value, key) => {
    const hasRelation = key && data[key];
    if (hasRelation) {
      const options = mergeObjects(value);
      const path = `${options.path || key}`;
      const modelName = options.ref || MODEL_NAME_PREDEFINE;
      const namespaces = compact([].concat(options.namespace));
      const array = options.array || false;
      const vals = sortedUniq(split(data[key], ','));
      const match =
        modelName === MODEL_NAME_PREDEFINE
          ? { 'strings.name.en': { $in: vals }, namespace: { $in: namespaces } }
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
 * @function transformToVehicleDispatchSeed
 * @name transformToVehicleDispatchSeed
 * @description Transform and normalize given seed to vehicle dispatch seed
 * @param {object} seed valid seed
 * @returns {object} valid vehicle dispatch seed
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.14.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * transformToVehicleDispatchSeed({ Name: 'John Doe' });
 * => { name: 'John Doe' }
 */
export const transformToVehicleDispatchSeed = (seed) => {
  // copy seed
  let data = mergeObjects(seed);

  // generate seed object id
  if (!get(data, '_id') && data.number) {
    set(data, '_id', objectIdFor(MODEL_NAME_VEHICLEDISPATCH, data.number));
  }

  // transform relations
  const populate = {};
  forEach(VEHICLE_DISPATCH_RELATIONS, (value, key) => {
    const hasRelation = key && data[key];
    if (hasRelation) {
      const options = mergeObjects(value);
      const path = `${options.path || key}`;
      const modelName = options.ref || MODEL_NAME_PREDEFINE;
      const namespaces = compact([].concat(options.namespace));
      const array = options.array || false;
      const vals = sortedUniq(split(data[key], ','));
      const match =
        modelName === MODEL_NAME_PREDEFINE
          ? { 'strings.name.en': { $in: vals }, namespace: { $in: namespaces } }
          : { name: { $in: vals } };
      populate[path] = { model: modelName, match, array };
    }
  });
  data.populate = populate;

  // return
  data = omit(
    data,
    ...[...keys(VEHICLE_DISPATCH_RELATIONS), 'relations', 'namespace']
  );
  return data;
};

/**
 * @function transformToCaseSeed
 * @name transformToCaseSeed
 * @description Transform and normalize given seed to case seed
 * @param {object} seed valid seed
 * @returns {object} valid case seed
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.18.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * transformToCaseSeed({ Name: 'John Doe' });
 * => { name: 'John Doe' }
 */
export const transformToCaseSeed = (seed) => {
  // TODO: support alias on relation doted path

  // copy seed
  let data = mergeObjects(seed);

  // generate seed object id
  if (!get(data, '_id') && data.number) {
    set(data, '_id', objectIdFor(MODEL_NAME_CASE, data.number));
  }

  // transform relations
  const populate = {};
  forEach(CASE_RELATIONS, (value, key) => {
    const hasRelation = key && data[key];
    if (hasRelation) {
      const options = mergeObjects(value);
      const path = `${options.path || key}`;
      const modelName = options.ref || MODEL_NAME_PREDEFINE;
      const namespaces = compact([].concat(options.namespace));
      const array = options.array || false;
      const vals = sortedUniq(split(data[key], ','));
      const match =
        modelName === MODEL_NAME_PREDEFINE
          ? { 'strings.name.en': { $in: vals }, namespace: { $in: namespaces } }
          : { name: { $in: vals } };
      populate[path] = { model: modelName, match, array };
    }
  });
  data.populate = populate;

  // return
  data = omit(data, ...[...keys(CASE_RELATIONS), 'relations', 'namespace']);
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
export const readCsvFile = (path, transformers, done) => {
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
 * @param {object} [optns] valid options
 * @param {string} [optns.Model=undefined] valid model name
 * @param {object} [optns.properties={}] valid extra properties to merge on each seed
 * @param {string} [optns.namespace=undefined] valid predefine namespace
 * @param {string} [optns.domain=undefined] valid predefine domain
 * @param {boolean} [optns.throws=false] whether to throw error
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
 * processCsvSeed((options, done) => (error, {finished, feature, next}) => { ... });
 */
export const processCsvSeed =
  (
    {
      Model = undefined,
      properties = {},
      namespace = undefined,
      domain = undefined,
      throws = false,
    },
    done
  ) =>
  (error, { finished, feature, next }) => {
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
      const data = mergeObjects(properties, { namespace, domain }, feature);
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
 * @param {string} [optns.domain=undefined] valid predefine domain
 * @param {boolean} [optns.throws=false] whether to throw error
 * @param {string} [optns.filePath=undefined] valid full file path for csv seed
 * @param {object} [optns.properties={}] extra properties to merge on each seed
 * @param {Function} [optns.transform] valid seed transform
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
export const seedFromCsv = (optns, done) => {
  // normalize options
  const {
    filePath = undefined,
    properties = {},
    modelName = undefined,
    namespace = undefined,
    domain = undefined,
    throws = true,
    transform = (seed) => seed,
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
      ? map([transformToPredefineSeed, ...transformers, transform], (fn) => {
          return (seed) => {
            return fn({ namespace, domain, ...seed });
          };
        })
      : [...transformers, transform];

    // seed from csv
    return readCsvFile(
      csvFilePath,
      appliedTransformers,
      processCsvSeed({ Model, properties, namespace, domain, throws }, done)
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
 * @param {string} [optns.domain=undefined] valid predefine domain
 * @param {boolean} [optns.throws=false] whether to throw error
 * @param {string} [optns.filePath=undefined] valid full file path for json seed
 * @param {object} [optns.properties={}] extra properties to merge on each seed
 * @param {Function} [optns.transform] valid seed transform
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
export const seedFromJson = (optns, done) => {
  // normalize options
  const {
    filePath = undefined,
    properties = {},
    modelName = undefined,
    namespace = undefined,
    domain = undefined,
    throws = false,
    transform = (seed) => seed,
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
      ? map([transformToPredefineSeed, ...transformers, transform], (fn) => {
          return (seed) => {
            return fn({ namespace, domain, ...seed });
          };
        })
      : [...transformers, transform];

    // prepare json seed stages
    const path = endsWith(jsonFilePath, '.json')
      ? jsonFilePath
      : `${jsonFilePath}.json`;
    return readJson({ path, throws }, (error, data) => {
      if (!isEmpty(data)) {
        const doTransform = (seed) => {
          const merged = mergeObjects(properties, { namespace, domain }, seed);
          return applyTransformsOn(merged, ...appliedTransformers);
        };
        return Model.seed({ data, transform: doTransform }, done);
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
export const seedFromSeeds = (optns, done) => {
  // TODO: transform relations to populate?

  // normalize options
  const {
    modelName = undefined,
    throws = false,
    data = undefined,
    filter,
    transform = (seed) => seed,
    transformers = [],
  } = mergeObjects(optns);

  // merge transform & transformers
  const doTransform = (seed) => {
    const merged = mergeObjects(seed);
    const appliedTransformers = compact(
      [].concat(transformers).concat(transform)
    );
    return applyTransformsOn(merged, ...appliedTransformers);
  };

  // do: seed data to model if seeds exists
  const Model = model(modelName);
  const canSeed = Model && isFunction(Model.seed);
  if (canSeed) {
    // filter, transform & seed
    const options = { data, filter, transform: doTransform };
    return Model.seed(options, (error, results) => {
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
 * @param {string} [optns.domain=undefined] valid predefine domain
 * @param {boolean} [optns.throws=false] whether to ignore error
 * @param {Function} [optns.transform] valid seed transform
 * @param {Function[]} [optns.transformers] valid predefine transformers
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
export const seedPredefine = (optns, done) => {
  // TODO: default transform(namespace, domain, parent, name code)
  // normalize options
  const {
    modelName = MODEL_NAME_PREDEFINE,
    namespace = undefined,
    domain = undefined,
    throws = false,
    transform = (seed) => seed,
    transformers = [],
  } = mergeObjects(optns);

  // prepare namespace filter
  const filter = (seed) => seed.namespace === namespace;

  // prepare options
  const options = {
    modelName,
    namespace,
    domain,
    throws,
    transform,
    transformers,
    filter,
  };

  // prepare predefine seed stages
  const fromSeeds = (next) => seedFromSeeds(options, (error) => next(error));
  const fromJson = (next) => seedFromJson(options, (error) => next(error));
  const fromCsv = (next) => seedFromCsv(options, (error) => next(error));
  const stages = [fromCsv, fromJson, fromSeeds];

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
 * @param {Function} [optns.transform] valid seed transform
 * @param {Function[]} [optns.transformers] valid party transformers
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
export const seedParty = (optns, done) => {
  // normalize options
  const {
    modelName = MODEL_NAME_PARTY,
    type = 'Focal',
    throws = false,
    transform = (seed) => seed,
    transformers = [],
  } = mergeObjects(optns);

  // prepare type filter
  const filter = (seed) => seed.type === type;

  // prepare options
  const options = {
    modelName,
    namespace: type,
    properties: { type },
    type,
    throws,
    transform,
    transformers: [transformToPartySeed, ...transformers],
    filter,
  };

  // prepare party seed stages
  const fromSeeds = (next) => seedFromSeeds(options, (error) => next(error));
  const fromJson = (next) => seedFromJson(options, (error) => next(error));
  const fromCsv = (next) => seedFromCsv(options, (error) => next(error));
  const stages = [fromCsv, fromJson, fromSeeds];

  // do seed party
  return waterfall(stages, done);
};

/**
 * @function seedEvent
 * @name seedEvent
 * @description Seed given events
 * @param {object} optns valid seed options
 * @param {boolean} [optns.throws=false] whether to ignore error
 * @param {Function} [optns.transform] valid seed transform
 * @param {Function[]} [optns.transformers] valid event transformers
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
export const seedEvent = (optns, done) => {
  // normalize options
  const {
    modelName = MODEL_NAME_EVENT,
    throws = false,
    transform = (seed) => seed,
    transformers = [],
  } = mergeObjects(optns);

  // prepare options
  const options = {
    modelName,
    properties: {},
    throws,
    transform,
    transformers: [transformToEventSeed, ...transformers],
  };

  // prepare event seed stages
  const fromSeeds = (next) => seedFromSeeds(options, (error) => next(error));
  const fromJson = (next) => seedFromJson(options, (error) => next(error));
  const fromCsv = (next) => seedFromCsv(options, (error) => next(error));
  const stages = [fromCsv, fromJson, fromSeeds];

  // do seed event
  return waterfall(stages, done);
};

/**
 * @function seedVehicleDispatch
 * @name seedVehicleDispatch
 * @description Seed given vehicle dispatches
 * @param {object} optns valid seed options
 * @param {boolean} [optns.throws=false] whether to ignore error
 * @param {Function} [optns.transform] valid seed transform
 * @param {Function[]} [optns.transformers] valid event transformers
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.14.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedVehicleDispatch(optns, error => { ... });
 */
export const seedVehicleDispatch = (optns, done) => {
  // normalize options
  const {
    modelName = MODEL_NAME_VEHICLEDISPATCH,
    throws = false,
    transform = (seed) => seed,
    transformers = [],
  } = mergeObjects(optns);

  // prepare options
  const options = {
    modelName,
    properties: {},
    throws,
    transform,
    transformers: [transformToVehicleDispatchSeed, ...transformers],
  };

  // prepare vehicle dispatch seed stages
  const fromSeeds = (next) => seedFromSeeds(options, (error) => next(error));
  const fromJson = (next) => seedFromJson(options, (error) => next(error));
  const fromCsv = (next) => seedFromCsv(options, (error) => next(error));
  const stages = [fromCsv, fromJson, fromSeeds];

  // do seed vehicle dispatch
  return waterfall(stages, done);
};

/**
 * @function seedCase
 * @name seedCase
 * @description Seed given cases
 * @param {object} optns valid seed options
 * @param {boolean} [optns.throws=false] whether to ignore error
 * @param {Function} [optns.transform] valid seed transform
 * @param {Function[]} [optns.transformers] valid case transformers
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.18.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedCase(optns, error => { ... });
 */
export const seedCase = (optns, done) => {
  // normalize options
  const {
    modelName = MODEL_NAME_CASE,
    throws = false,
    transform = (seed) => seed,
    transformers = [],
  } = mergeObjects(optns);

  // prepare options
  const options = {
    modelName,
    properties: {},
    throws,
    transform,
    transformers: [transformToCaseSeed, ...transformers],
  };

  // prepare case seed stages
  const fromSeeds = (next) => seedFromSeeds(options, (error) => next(error));
  const fromJson = (next) => seedFromJson(options, (error) => next(error));
  const fromCsv = (next) => seedFromCsv(options, (error) => next(error));
  const stages = [fromCsv, fromJson, fromSeeds];

  // do seed vehicle dispatch
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
export const seedPermissions = (done) => {
  // TODO: honour wildcard for _id generation
  debug('Start Seeding Permissions Data');

  // generate object id
  const transform = (seed) => {
    const merged = mergeObjects(
      { _id: objectIdFor(MODEL_NAME_PERMISSION, seed.wildcard) },
      seed
    );
    return merged;
  };

  // prepare permissions seed stages
  // TODO: dashboard permission seeds
  const seedResourcePermissions = (next) => {
    const data = Permission.prepareResourcesPermissions();
    const options = { data, transform };
    return Permission.seed(options, (error) => next(error));
  };
  const seedPredefineNamespacePermissions = (next) => {
    const data = listPermissions();
    const options = { data, transform };
    return Permission.seed(options, (error) => next(error));
  };
  const stages = [seedResourcePermissions, seedPredefineNamespacePermissions];

  // do seed permissions
  return waterfall(stages, (error) => {
    debug('Finish Seeding Permissions Data');
    return done(error);
  });
};

/**
 * @function seedDefaults
 * @name seedDefaults
 * @description Seed default predefines
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.15.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedDefaults(error => { ... });
 */
export const seedDefaults = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Default Predefines Data');

  // prepare options
  const modelName = MODEL_NAME_PREDEFINE;
  const data = values(DEFAULT_SEEDS);
  const namespaces = keys(DEFAULT_SEEDS);
  const filter = ({ namespace = undefined }) => {
    return includes(namespaces, namespace);
  };
  const optns = { modelName, data, filter };

  // do seeding
  return seedFromSeeds(optns, (error) => {
    debug('Finish Seeding Default Predefines Data');
    return done(error);
  });
};

/**
 * @function seedCommons
 * @name seedCommons
 * @description Seed common predefines
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.16.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedCommons(error => { ... });
 */
export const seedCommons = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Common Predefines Data');

  // prepare options
  const modelName = MODEL_NAME_PREDEFINE;
  const data = [
    ...values(COMMON_VEHICLESTATUS_SEEDS),
    ...values(COMMON_CASESEVERITY_SEEDS),
    ...values(COMMON_CASESTAGE_SEEDS),
  ];
  const namespaces = sortedUniq(map(data, 'namespace'));
  const filter = ({ namespace = undefined }) => {
    return includes(namespaces, namespace);
  };
  const optns = { modelName, data, filter };

  // do seeding
  return seedFromSeeds(optns, (error) => {
    debug('Finish Seeding Common Predefines Data');
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
export const seedUnits = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Units Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_UNIT;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Units Data');
    return done(error);
  });
};

/**
 * @function seedPriorities
 * @name seedPriorities
 * @description Seed priorities
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.15.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedPriorities(error => { ... });
 */
export const seedPriorities = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Priorities Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_PRIORITY;

  // TODO: priority domains(case, dispatch etc)

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Priorities Data');
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
export const seedAdministrativeLevels = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Administrative Levels Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_ADMINISTRATIVELEVEL;

  // TODO: use domain with weight(level) and
  // drop administrative level namespace?

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
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
export const seedFeatureTypes = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Feature Types Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_FEATURETYPE;

  // TODO: use domain with weight(level) and
  // drop feature type namespace?

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
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
export const seedEventIndicators = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Event Indicators Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_EVENTINDICATOR;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Event Indicators Data');
    return done(error);
  });
};

/**
 * @function seedEventTopics
 * @name seedEventTopics
 * @description Seed event topics
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @author ricardo aggrey <richardaggrey7@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedEventTopics(error => { ... });
 */
export const seedEventTopics = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Event Topics Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_EVENTTOPIC;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Event Topics Data');
    return done(error);
  });
};

/**
 * @function seedEventLevels
 * @name seedEventLevels
 * @description Seed event levels
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @author ricardo aggrey <richardaggrey7@gmail.com>
 * @license MIT
 * @since 0.3.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedEventLevels(error => { ... });
 */
export const seedEventLevels = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Event Levels Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_EVENTLEVEL;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Event Levels Data');
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
export const seedEventSeverities = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Event Severities Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_EVENTSEVERITY;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
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
export const seedEventCertainties = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Event Certainties Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_EVENTCERTAINTY;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
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
export const seedEventStatuses = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Event Statuses Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_EVENTSTATUS;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
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
export const seedEventUrgencies = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Event Urgencies Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_EVENTURGENCY;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Event Urgencies Data');
    return done(error);
  });
};

/**
 * @function seedEventResponses
 * @name seedEventResponses
 * @description Seed event responses
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.7.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedEventResponses(error => { ... });
 */
export const seedEventResponses = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Event Responses Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_EVENTRESPONSE;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Event Responses Data');
    return done(error);
  });
};

/**
 * @function seedPartyOwnerships
 * @name seedPartyOwnerships
 * @description Seed party ownerships
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.11.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedPartyOwnerships(error => { ... });
 */
export const seedPartyOwnerships = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Party Ownerships Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_PARTYOWNERSHIP;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Party Ownerships Data');
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
export const seedPartyGroups = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Party Groups Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_PARTYGROUP;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
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
export const seedPartyRoles = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Party Roles Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_PARTYROLE;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Party Roles Data');
    return done(error);
  });
};

/**
 * @function seedPartyGenders
 * @name seedPartyGenders
 * @description Seed party genders
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.13.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedPartyGenders(error => { ... });
 */
export const seedPartyGenders = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Party Genders Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_PARTYGENDER;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Party Genders Data');
    return done(error);
  });
};

/**
 * @function seedPartyOccupations
 * @name seedPartyOccupations
 * @description Seed party occupations
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.17.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedPartyOccupations(error => { ... });
 */
export const seedPartyOccupations = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Party Occupations Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_PARTYOCCUPATION;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Party Occupations Data');
    return done(error);
  });
};

/**
 * @function seedPartyNationalities
 * @name seedPartyNationalities
 * @description Seed party nationalities
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.19.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedPartyNationalities(error => { ... });
 */
export const seedPartyNationalities = (done) => {
  // TODO: honour code(e.g TZS) for _id generation
  // TODO: support country data
  debug('Start Seeding Party Nationalities Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_PARTYNATIONALITY;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Party Nationalities Data');
    return done(error);
  });
};

/**
 * @function seedVehicleTypes
 * @name seedVehicleTypes
 * @description Seed vehicle types
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.11.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedVehicleTypes(error => { ... });
 */
export const seedVehicleTypes = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Vehicle Types Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_VEHICLETYPE;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Vehicle Types Data');
    return done(error);
  });
};

/**
 * @function seedVehicleModels
 * @name seedVehicleModels
 * @description Seed vehicle models
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.11.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedVehicleModels(error => { ... });
 */
export const seedVehicleModels = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Vehicle Models Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_VEHICLEMODEL;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Vehicle Models Data');
    return done(error);
  });
};

/**
 * @function seedVehicleMakes
 * @name seedVehicleMakes
 * @description Seed vehicle makes
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.11.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedVehicleMakes(error => { ... });
 */
export const seedVehicleMakes = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Vehicle Makes Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_VEHICLEMAKE;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Vehicle Makes Data');
    return done(error);
  });
};

/**
 * @function seedVehicleStatuses
 * @name seedVehicleStatuses
 * @description Seed vehicle statuses
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.12.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedVehicleStatuses(error => { ... });
 */
export const seedVehicleStatuses = (done) => {
  // TODO: honour code for _id generation
  debug('Start Seeding Vehicle Statuses Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_VEHICLESTATUS;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Vehicle Statuses Data');
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
export const seedEventGroups = (done) => {
  // TODO: honour group code for _id generation
  debug('Start Seeding Event Groups Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_EVENTGROUP;

  // generate object id
  const transform = (seed) => {
    // TODO: grab code
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
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
export const seedEventTypes = (done) => {
  // TODO: honour event group etc for _id generation
  debug('Start Seeding Event Types Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_EVENTTYPE;

  // generate object id
  const transform = (seed) => {
    // TODO: grap event group
    // TODO: support group if available
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
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
export const seedEventFunctions = (done) => {
  // TODO: honour event type, group etc for _id generation
  debug('Start Seeding Event Functions Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_EVENTFUNCTION;

  // generate object id
  const transform = (seed) => {
    // TODO: grab event group
    // TODO: grab event type
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
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
export const seedEventActions = (done) => {
  // TODO: honour event type, group etc for _id generation
  debug('Start Seeding Event Actions Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_EVENTACTION;

  // generate object id
  const transform = (seed) => {
    // TODO: grab event group
    // TODO: grab event type
    // TODO: grab administrative area
    // TODO: grab domain if available
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
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
export const seedEventQuestions = (done) => {
  // TODO: generate _id per indicator, topic
  debug('Start Seeding Event Questions Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_EVENTQUESTION;

  // generate object id
  const transform = (seed) => {
    // TODO: grab indicator
    // TODO: grab topic
    // TODO: grab domain if available
    const name = get(seed, 'strings.code');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
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
export const seedAdministrativeAreas = (done) => {
  // TODO: seed per hierarchy
  // TODO: seed per domain i.e ADMINISTRATIVE_LEVEL, ADMINISTRATIVE_HIERARCHY
  // TODO: domain === hierarchy
  // TODO: level === hierarchy
  // TODO: support parent on object id generation
  debug('Start Seeding Administrative Areas Data');

  // const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_ADMINISTRATIVEAREA;

  // generate object id
  const transform = (seed) => {
    // const name = get(seed, 'strings.name.en');
    // if (!isEmpty(name)) {
    //   const merged = mergeObjects(
    //     { _id: objectIdFor(modelName, namespace, name) },
    //     seed
    //   );
    //   return merged;
    // }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Administrative Areas Data');
    return done(error);
  });
};

/**
 * @function seedAdministrators
 * @name seedAdministrators
 * @description Seed administrators
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.22.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedAdministrators(error => { ... });
 */
export const seedAdministrators = (done) => {
  // TODO: hash plain password
  debug('Start Seeding Administrators Data');

  // prepare administrator seeds
  const modelName = MODEL_NAME_PARTY;
  const type = 'Focal';
  const name = getString('ADMINISTRATOR_NAME', 'Administrator');
  const abbreviation = getString('ADMINISTRATOR_ABBREVIATION', 'ADMN');
  const locale = getString(
    'ADMINISTRATOR_LOCALE',
    getString('DEFAULT_LOCALE', 'en')
  );
  const email = getString('ADMINISTRATOR_EMAIL', 'administrator@example.com');
  const mobile = getString('ADMINISTRATOR_MOBILE', '0714001001');
  const password = getString(
    'ADMINISTRATOR_PASSWORD',
    getString(
      'DEFAULT_HASHED_PASSWORD',
      '$2a$10$rwpL/BhU8xY4fkf8SG7fHugF4PCioTJqy8BLU7BZ8N0YV.8Y1dXem'
    )
  );
  const role = getString('ADMINISTRATOR_ROLE', 'Administrator');
  const filter = (seed) => seed.type === type;

  // collect administrator seeds data
  const data = [
    transformToPartySeed({
      type,
      name,
      abbreviation,
      locale,
      email,
      mobile,
      password,
      role,
    }),
  ];

  // prepare seed options
  const optns = { modelName, data, filter };

  // do seeding
  return seedFromSeeds(optns, (error) => {
    debug('Finish Seeding Administrators Data');
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
export const seedAgencies = (done) => {
  debug('Start Seeding Agencies Data');
  const type = 'Agency';
  return seedParty({ type }, (error) => {
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
export const seedFocals = (done) => {
  debug('Start Seeding Focals Data');
  const type = 'Focal';
  return seedParty({ type }, (error) => {
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
export const seedFeatures = (done) => {
  // TODO: seed per feature type i.e hospitals, buildings etc
  // TODO: support seed per domain i.e building etc
  // TODO: seed per domain by concat streams
  // TODO: support seed per type
  debug('Start Seeding Features Data');

  // const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_FEATURE;

  // generate object id
  const transform = (seed) => {
    // const name = get(seed, 'strings.name.en');
    // if (!isEmpty(name)) {
    //   const merged = mergeObjects(
    //     { _id: objectIdFor(modelName, namespace, name) },
    //     seed
    //   );
    //   return merged;
    // }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Features Data');
    return done(error);
  });
};

/**
 * @function seedHealthFacilities
 * @name seedHealthFacilities
 * @description Seed health facilities
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.22.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedHealthFacilities(error => { ... });
 */
export const seedHealthFacilities = (done) => {
  // TODO: domain i.e hospital, dispensary etc
  // TODO: seed per type i.e hospitals, clinics etc
  // TODO: seed per domain by concat streams
  // TODO: seed operating status flag
  // TODO: seed common properties
  debug('Start Seeding Health Facilities Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_HEALTHFACILITY;

  // generate object id
  const transform = (seed) => {
    const domain = classify(get(seed, 'raw.type'));
    const code = get(seed, 'raw.number');
    const name = get(seed, 'strings.name.en');

    set(seed, 'domain', domain);
    set(seed, 'strings.code', code);

    const shouldGenerateId = areNotEmpty(domain, code, name);
    if (shouldGenerateId) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, domain, code, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Health Facilities Data');
    return done(error);
  });
};

/**
 * @function seedVehicles
 * @name seedVehicles
 * @description Seed vehicles
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
 * seedVehicles(error => { ... });
 */
export const seedVehicles = (done) => {
  // TODO: seed per vehicle type i.e ambulances, fires etc
  // TODO: vehicle domain: ambulances, fires, unknown
  debug('Start Seeding Vehicles Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_VEHICLE;

  // generate object id
  // TODO: use strings.code
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Vehicles Data');
    return done(error);
  });
};

/**
 * @function seedEventActionCatalogues
 * @name seedEventActionCatalogues
 * @description Seed event action catalogues
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
 * seedEventActionCatalogues(error => { ... });
 */
export const seedEventActionCatalogues = (done) => {
  // TODO: seed per event phase i.e mitigation, preparedness, response, recovery
  // TODO: use domain i.e mitigation, preparedness, response, recovery
  debug('Start Seeding Event Action Catalogues Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_EVENTACTIONCATALOGUE;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
    debug('Finish Seeding Event Action Catalogues Data');
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
export const seedNotificationTemplates = (done) => {
  // TODO: transform code as sender id
  debug('Start Seeding Notification Templates Data');

  const modelName = MODEL_NAME_PREDEFINE;
  const namespace = PREDEFINE_NAMESPACE_NOTIFICATIONTEMPLATE;

  // generate object id
  const transform = (seed) => {
    const name = get(seed, 'strings.name.en');
    if (!isEmpty(name)) {
      const merged = mergeObjects(
        { _id: objectIdFor(modelName, namespace, name) },
        seed
      );
      return merged;
    }
    return seed;
  };

  return seedPredefine({ namespace, transform }, (error) => {
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
export const seedEvents = (done) => {
  // TODO: seed per stage i.e alert and event
  // TODO: seed per phase i.e response etc
  // TODO: transform _id
  debug('Start Seeding Events Data');
  return seedEvent({}, (error) => {
    debug('Finish Seeding Events Data');
    return done(error);
  });
};

/**
 * @function seedVehicleDispatches
 * @name seedVehicleDispatches
 * @description seed vehicle dispatches
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.14.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedVehicleDispatches(error => { ... });
 */
export const seedVehicleDispatches = (done) => {
  // TODO: transform _id
  debug('Start Seeding Vehicle Dispatches Data');
  return seedVehicleDispatch({}, (error) => {
    debug('Finish Seeding Vehicle Dispatches Data');
    return done(error);
  });
};

/**
 * @function seedCases
 * @name seedCases
 * @description seed cases
 * @param {Function} done callback to invoke on success or error
 * @returns {Error|undefined} error if fails else undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.18.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * seedCases(error => { ... });
 */
export const seedCases = (done) => {
  // TODO: transform _id
  debug('Start Seeding Cases Data');
  return seedCase({}, (error) => {
    debug('Finish Seeding Cases Data');
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
export const seed = (done) => {
  // TODO: allow seed specifics
  // prepare seed tasks
  const tasks = [
    syncIndexes,
    seedPermissions, // TODO: ensure resource list + dashboard permissions
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
