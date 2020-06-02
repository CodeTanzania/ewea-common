'use strict';

const eweaInternals = require('@codetanzania/ewea-internals');
const constants = require('@lykmapipo/constants');
const crypto = require('crypto');
const lodash = require('lodash');
const common = require('@lykmapipo/common');
const env = require('@lykmapipo/env');
const mongooseCommon = require('@lykmapipo/mongoose-common');
const mongooseLocaleSchema = require('mongoose-locale-schema');
const async = require('async');
const file = require('@lykmapipo/file');
const path = require('path');
const logger = require('@lykmapipo/logger');
const geoTools = require('@lykmapipo/geo-tools');
const predefine = require('@lykmapipo/predefine');
const permission = require('@lykmapipo/permission');
const emisStakeholder = require('@codetanzania/emis-stakeholder');

const DEFAULT_PREDEFINE_NAME = env.getString(
  'DEFAULT_PREDEFINE_NAME',
  'Unknown'
);
const DEFAULT_PREDEFINE_COLOR = env.getString(
  'DEFAULT_PREDEFINE_COLOR',
  '#6D9EEB'
);
const DEFAULT_PREDEFINE_WEIGHT = env.getNumber(
  'DEFAULT_PREDEFINE_WEIGHT',
  1000
);

const DEFAULT_PREDEFINE_RELATION = {
  _id: null,
  strings: {
    name: mongooseLocaleSchema.localizedValuesFor({ en: DEFAULT_PREDEFINE_NAME }),
    abbreviation: mongooseLocaleSchema.localizedAbbreviationsFor({ en: DEFAULT_PREDEFINE_NAME }),
    color: DEFAULT_PREDEFINE_COLOR,
  },
  numbers: { weight: DEFAULT_PREDEFINE_WEIGHT },
};

const DEFAULT_UNIT_NAME = env.getString(
  'DEFAULT_UNIT_NAME',
  eweaInternals.PREDEFINE_UNIT_NAME
);

const DEFAULT_ADMINISTRATIVELEVEL_NAME = env.getString(
  'DEFAULT_ADMINISTRATIVELEVEL_NAME',
  eweaInternals.PREDEFINE_ADMINISTRATIVELEVEL_NAME
);

const DEFAULT_FEATURETYPE_NAME = env.getString(
  'DEFAULT_FEATURETYPE_NAME',
  eweaInternals.PREDEFINE_FEATURETYPE_NAME
);

const DEFAULT_EVENTINDICATOR_NAME = env.getString(
  'DEFAULT_EVENTINDICATOR_NAME',
  eweaInternals.PREDEFINE_EVENTINDICATOR_NAME
);

const DEFAULT_EVENTTOPIC_NAME = env.getString(
  'DEFAULT_EVENTTOPIC_NAME',
  eweaInternals.PREDEFINE_EVENTTOPIC_NAME
);

const DEFAULT_EVENTLEVEL_NAME = env.getString(
  'DEFAULT_EVENTLEVEL_NAME',
  eweaInternals.PREDEFINE_EVENTLEVEL_NAME
);

const DEFAULT_EVENTSEVERITY_NAME = env.getString(
  'DEFAULT_EVENTSEVERITY_NAME',
  eweaInternals.PREDEFINE_EVENTSEVERITY_NAME
);

const DEFAULT_EVENTCERTAINTY_NAME = env.getString(
  'DEFAULT_EVENTCERTAINTY_NAME',
  eweaInternals.PREDEFINE_EVENTCERTAINTY_NAME
);

const DEFAULT_EVENTSTATUS_NAME = env.getString(
  'DEFAULT_EVENTSTATUS_NAME',
  eweaInternals.PREDEFINE_EVENTSTATUS_NAME
);

const DEFAULT_EVENTURGENCY_NAME = env.getString(
  'DEFAULT_EVENTURGENCY_NAME',
  eweaInternals.PREDEFINE_EVENTURGENCY_NAME
);

const DEFAULT_EVENTRESPONSE_NAME = env.getString(
  'DEFAULT_EVENTRESPONSE_NAME',
  eweaInternals.PREDEFINE_EVENTRESPONSE_NAME
);

const DEFAULT_PARTYGROUP_NAME = env.getString(
  'DEFAULT_PARTYGROUP_NAME',
  eweaInternals.PREDEFINE_PARTYGROUP_NAME
);

const DEFAULT_PARTYROLE_NAME = env.getString(
  'DEFAULT_PARTYROLE_NAME',
  eweaInternals.PREDEFINE_PARTYROLE_NAME
);

const DEFAULT_EVENTGROUP_NAME = env.getString(
  'DEFAULT_EVENTGROUP_NAME',
  eweaInternals.PREDEFINE_EVENTGROUP_NAME
);

const DEFAULT_EVENTTYPE_NAME = env.getString(
  'DEFAULT_EVENTTYPE_NAME',
  eweaInternals.PREDEFINE_EVENTTYPE_NAME
);

const DEFAULT_EVENTFUNCTION_NAME = env.getString(
  'DEFAULT_EVENTFUNCTION_NAME',
  eweaInternals.PREDEFINE_EVENTFUNCTION_NAME
);

const DEFAULT_EVENTACTION_NAME = env.getString(
  'DEFAULT_EVENTACTION_NAME',
  eweaInternals.PREDEFINE_EVENTACTION_NAME
);

const DEFAULT_EVENTQUESTION_NAME = env.getString(
  'DEFAULT_EVENTQUESTION_NAME',
  eweaInternals.PREDEFINE_EVENTQUESTION_NAME
);

const DEFAULT_ADMINISTRATIVEAREA_NAME = env.getString(
  'DEFAULT_ADMINISTRATIVEAREA_NAME',
  eweaInternals.PREDEFINE_ADMINISTRATIVEAREA_NAME
);

const DEFAULT_EVENT_NUMBER = env.getString(
  'DEFAULT_EVENT_NUMBER',
  undefined
);

const DEFAULT_NAMES = common.sortedUniq([
  DEFAULT_UNIT_NAME,
  DEFAULT_ADMINISTRATIVELEVEL_NAME,
  DEFAULT_FEATURETYPE_NAME,
  DEFAULT_EVENTINDICATOR_NAME,
  DEFAULT_EVENTTOPIC_NAME,
  DEFAULT_EVENTLEVEL_NAME,
  DEFAULT_EVENTSEVERITY_NAME,
  DEFAULT_EVENTCERTAINTY_NAME,
  DEFAULT_EVENTSTATUS_NAME,
  DEFAULT_EVENTURGENCY_NAME,
  DEFAULT_EVENTRESPONSE_NAME,
  DEFAULT_PARTYGROUP_NAME,
  DEFAULT_PARTYROLE_NAME,
  DEFAULT_EVENTGROUP_NAME,
  DEFAULT_EVENTTYPE_NAME,
  DEFAULT_EVENTFUNCTION_NAME,
  DEFAULT_EVENTACTION_NAME,
  DEFAULT_EVENTQUESTION_NAME,
  DEFAULT_ADMINISTRATIVEAREA_NAME,
]);

const DEFAULT_PATHS = common.mergeObjects(
  {
    unit: { namespace: eweaInternals.PREDEFINE_NAMESPACE_UNIT },
    role: { namespace: eweaInternals.PREDEFINE_NAMESPACE_PARTYROLE },
    template: { namespace: eweaInternals.PREDEFINE_NAMESPACE_NOTIFICATIONTEMPLATE },
  },
  eweaInternals.EVENT_RELATIONS
);

const objectIdFor = (model, namespace, uniqueValue) => {
  // ensure secret & message
  const secret = model || namespace;
  const message = namespace || model;
  const data = uniqueValue ? message + uniqueValue : message;

  // generate 24-byte hex hash
  const hash = crypto.createHmac('md5', secret)
    .update(data)
    .digest('hex')
    .slice(0, 24);

  // create objectid from hash
  const objectId = mongooseCommon.MongooseTypes.ObjectId.createFromHexString(hash);

  return objectId;
};

const DEFAULT_SEEDS_IGNORE = [
  eweaInternals.PREDEFINE_NAMESPACE_FEATURETYPE,
  eweaInternals.PREDEFINE_NAMESPACE_EVENTINDICATOR,
  eweaInternals.PREDEFINE_NAMESPACE_EVENTTOPIC,
  eweaInternals.PREDEFINE_NAMESPACE_VEHICLE,
  eweaInternals.PREDEFINE_NAMESPACE_EVENTFUNCTION,
  eweaInternals.PREDEFINE_NAMESPACE_EVENTACTION,
  eweaInternals.PREDEFINE_NAMESPACE_EVENTQUESTION,
  eweaInternals.PREDEFINE_NAMESPACE_FEATURE,
  eweaInternals.PREDEFINE_NAMESPACE_EVENTACTIONCATALOGUE,
  eweaInternals.PREDEFINE_NAMESPACE_NOTIFICATIONTEMPLATE,
];

const DEFAULT_SEEDS = lodash.mapValues(
  lodash.omit(eweaInternals.PREDEFINE_DEFAULTS, ...DEFAULT_SEEDS_IGNORE),
  (defaultValue, namespace) => {
    return {
      _id: objectIdFor(eweaInternals.MODEL_NAME_PREDEFINE, namespace),
      namespace,
      strings: {
        name: mongooseLocaleSchema.localizedValuesFor({ en: defaultValue }),
        abbreviation: mongooseLocaleSchema.localizedAbbreviationsFor({ en: defaultValue }),
        color: DEFAULT_PREDEFINE_COLOR,
      },
      numbers: { weight: DEFAULT_PREDEFINE_WEIGHT },
      booleans: { default: true, system: true },
    };
  }
);

// TODO: move to internal or common?
// TODO: use constants
const COMMON_VEHICLESTATUSES = {
  Waiting: { weight: 1, name: 'Waiting', abbreviation: 'WTN' },
  Enroute: { weight: 2, name: 'Enroute', abbreviation: 'ERT' },
  Canceled: {
    weight: DEFAULT_PREDEFINE_WEIGHT,
    name: 'Canceled',
    abbreviation: 'CNL',
  },
  AtPickup: { weight: 4, name: 'At Pickup', abbreviation: 'APU' },
  FromPickup: { weight: 5, name: 'From Pickup', abbreviation: 'FPU' },
  AtDropoff: { weight: 6, name: 'At Dropoff', abbreviation: 'ADO' },
  FromDropoff: { weight: 7, name: 'From Dropoff', abbreviation: 'FDO' },
  Completed: { weight: 8, name: 'Completed', abbreviation: 'CPT' },
  Idle: { weight: DEFAULT_PREDEFINE_WEIGHT, name: 'Idle', abbreviation: 'IDL' },
};

const COMMON_VEHICLESTATUS_SEEDS = lodash.mapValues(
  COMMON_VEHICLESTATUSES,
  ({ weight, name, abbreviation }) => {
    const namespace = eweaInternals.PREDEFINE_NAMESPACE_VEHICLESTATUS;
    return {
      _id: objectIdFor(eweaInternals.MODEL_NAME_PREDEFINE, namespace, name),
      namespace,
      strings: {
        name: mongooseLocaleSchema.localizedValuesFor({ en: name }),
        abbreviation: mongooseLocaleSchema.localizedValuesFor({ en: abbreviation || name }),
      },
      numbers: { weight: weight || DEFAULT_PREDEFINE_WEIGHT },
      booleans: { system: true },
    };
  }
);

// TODO: move to dispatch
const dispatchStatusFor = (optns) => {
  // ensure options
  const options = common.mergeObjects(optns);

  // defaults
  let dispatch = COMMON_VEHICLESTATUS_SEEDS.Waiting;
  let vehicle = COMMON_VEHICLESTATUS_SEEDS.Idle;

  // dispatched
  if (options.dispatchedAt) {
    dispatch = COMMON_VEHICLESTATUS_SEEDS.Enroute;
    vehicle = COMMON_VEHICLESTATUS_SEEDS.Enroute;
  }

  // canceled
  if (options.canceledAt) {
    dispatch = COMMON_VEHICLESTATUS_SEEDS.Canceled;
    vehicle = COMMON_VEHICLESTATUS_SEEDS.Idle;
  }

  // arrived at pickup
  if (options.pickup && options.pickup.arrivedAt) {
    dispatch = COMMON_VEHICLESTATUS_SEEDS.AtPickup;
    vehicle = COMMON_VEHICLESTATUS_SEEDS.Enroute;
  }

  // dispatched from pickup
  if (options.pickup && options.pickup.dispatchedAt) {
    dispatch = COMMON_VEHICLESTATUS_SEEDS.FromPickup;
    vehicle = COMMON_VEHICLESTATUS_SEEDS.Enroute;
  }

  // arrived at dropoff
  if (options.dropoff && options.dropoff.arrivedAt) {
    dispatch = COMMON_VEHICLESTATUS_SEEDS.AtDropoff;
    vehicle = COMMON_VEHICLESTATUS_SEEDS.Enroute;
  }

  // dispatched from dropoff
  if (options.dropoff && options.dropoff.dispatchedAt) {
    dispatch = COMMON_VEHICLESTATUS_SEEDS.FromDropoff;
    vehicle = COMMON_VEHICLESTATUS_SEEDS.Enroute;
  }

  // resolved/completed
  if (options.resolvedAt || options.completedAt) {
    dispatch = COMMON_VEHICLESTATUS_SEEDS.Completed;
    vehicle = COMMON_VEHICLESTATUS_SEEDS.Idle;
  }

  return { dispatch, vehicle };
};

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
const connect = (done) => {
  return mongooseCommon.connect((error) => {
    file.createModels();
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
const syncIndexes = (done) => async.waterfall([connect, mongooseCommon.syncIndexes], done);

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
  const base = env.getString('BASE_PATH', process.cwd());
  const path$1 = path.join(base, ...paths);
  return path$1;
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
const dataPathFor = (fileName) => {
  const path$1 = env.getString('DATA_PATH', pathFor('data'));
  return path.resolve(path$1, fileName);
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
const seedPathFor = (fileName) => {
  const path$1 = env.getString('SEED_PATH', pathFor('seeds'));
  return path.resolve(path$1, fileName);
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
const csvPathFor = (modelName) => {
  const fileName = `${common.pluralize(lodash.toLower(modelName))}.csv`;
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
const shapeFilePathFor = (modelName) => {
  const fileName = `${common.pluralize(lodash.toLower(modelName))}.shp`;
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
const geoJsonPathFor = (modelName) => {
  const fileName = `${common.pluralize(lodash.toLower(modelName))}.geojson`;
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
const jsonPathFor = (modelName) => {
  const fileName = `${common.pluralize(lodash.toLower(modelName))}.json`;
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
const transformSeedKeys = (seed) => {
  // copy seed
  const data = common.mergeObjects(seed);

  // normalize keys
  const transformed = lodash.mapKeys(data, (value, key) => {
    // key to lower
    let path = lodash.toLower(lodash.trim(key));
    // key to path
    path = common.join(lodash.split(path, ' '), '.');
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
const transformGeoFields = (seed) => {
  // copy seed
  const transformed = common.mergeObjects(seed);

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
  lodash.forEach(fields, (seedPath, originalPath) => {
    // parse coordinates to geometry
    try {
      const geometry = geoTools.parseCoordinateString(seed[originalPath]);
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
      coordinates: [transformed.longitude, transformed.latitude],
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
const transformOtherFields = (seed) => {
  // copy seed
  const transformed = common.mergeObjects(seed);

  // ensure event action catalogue.name from action
  if (lodash.isEmpty(transformed.name) && !lodash.isEmpty(transformed.action)) {
    transformed.name = transformed.action;
  }

  // ensure weight from level & order
  const weight = lodash.toNumber(transformed.level || transformed.order);
  if (!lodash.isNaN(weight)) {
    transformed.weight = weight;
    transformed.numbers = common.mergeObjects(transformed.numbers, { weight });
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
const applyTransformsOn = (seed, ...transformers) => {
  // copy seed
  let data = common.compact([].concat(seed));

  data = lodash.map(data, (value) => {
    // copy value
    let transformed = common.mergeObjects(value);

    // ensure transformers
    const baseTransformers = [
      transformSeedKeys,
      transformGeoFields,
      transformOtherFields,
    ];
    const transforms = common.compact(baseTransformers.concat(transformers));

    // apply transform sequentially
    lodash.forEach(transforms, (applyTransformOn) => {
      transformed = applyTransformOn(transformed);
    });

    // return transformed
    return transformed;
  });

  // return
  data = lodash.isArray(seed) ? data : lodash.first(data);
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
const transformToPredefineSeed = (seed) => {
  // copy seed
  const data = common.mergeObjects(seed);

  // normalize to predefine
  let predefine$1 = predefine.transformToPredefine(data);

  // transform relations
  // TODO: honor exist populate option
  // TODO: handle parent of administrative area using level
  const populate = {};
  lodash.forEach(eweaInternals.PREDEFINE_RELATIONS, (value, key) => {
    const hasRelation = key && seed[key];
    if (hasRelation) {
      const options = common.mergeObjects(value);
      const path = `relations.${options.path || key}`;
      const modelName = options.ref || eweaInternals.MODEL_NAME_PREDEFINE;
      const namespaces = common.compact([].concat(options.namespace));
      const array = options.array || false;
      const vals = common.sortedUniq(lodash.split(seed[key], ','));
      const match =
        modelName === eweaInternals.MODEL_NAME_PREDEFINE
          ? { 'strings.name.en': { $in: vals }, namespace: { $in: namespaces } }
          : { name: { $in: vals } };

      // honour administrative area seed hierarchy
      const handleAdministrativeArea =
        seed.namespace === eweaInternals.PREDEFINE_NAMESPACE_ADMINISTRATIVEAREA &&
        key === 'parent' &&
        seed.level;
      const ignore = handleAdministrativeArea
        ? {
            model: modelName,
            path: 'relations.level',
            match: {
              'strings.name.en': { $in: [seed.level] },
              namespace: { $in: [eweaInternals.PREDEFINE_NAMESPACE_ADMINISTRATIVELEVEL] },
            },
            array: false,
          }
        : {};

      populate[path] = { model: modelName, match, array, ignore };
    }
  });
  predefine$1.populate = populate;

  // return
  predefine$1 = lodash.omit(predefine$1, ...[...lodash.keys(eweaInternals.PREDEFINE_RELATIONS), 'relations']);
  return predefine$1;
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
const transformToPartySeed = (seed) => {
  // copy seed
  let data = common.mergeObjects(seed);

  // ensure default password
  if (lodash.isEmpty(data.password)) {
    data.password = env.getString(
      'DEFAULT_HASHED_PASSWORD',
      '$2a$10$rwpL/BhU8xY4fkf8SG7fHugF4PCioTJqy8BLU7BZ8N0YV.8Y1dXem'
    );
  }

  // ensure confirmed time
  data.confirmedAt = new Date();

  // transform relations
  const populate = {};
  lodash.forEach(eweaInternals.PARTY_RELATIONS, (value, key) => {
    const hasRelation = key && data[key];
    if (hasRelation) {
      const options = common.mergeObjects(value);
      const path = `${options.path || key}`;
      const modelName = options.ref || eweaInternals.MODEL_NAME_PREDEFINE;
      const namespaces = common.compact([].concat(options.namespace));
      const array = options.array || false;
      const vals = common.sortedUniq(lodash.split(data[key], ','));
      const match =
        modelName === eweaInternals.MODEL_NAME_PREDEFINE
          ? { 'strings.name.en': { $in: vals }, namespace: { $in: namespaces } }
          : { name: { $in: vals } };
      populate[path] = { model: modelName, match, array };
    }
  });
  data.populate = populate;

  // return
  data = lodash.omit(data, ...[...lodash.keys(eweaInternals.PARTY_RELATIONS), 'relations', 'namespace']);
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
const transformToEventSeed = (seed) => {
  // copy seed
  let data = common.mergeObjects(seed);

  // transform relations
  const populate = {};
  lodash.forEach(eweaInternals.EVENT_RELATIONS, (value, key) => {
    const hasRelation = key && data[key];
    if (hasRelation) {
      const options = common.mergeObjects(value);
      const path = `${options.path || key}`;
      const modelName = options.ref || eweaInternals.MODEL_NAME_PREDEFINE;
      const namespaces = common.compact([].concat(options.namespace));
      const array = options.array || false;
      const vals = common.sortedUniq(lodash.split(data[key], ','));
      const match =
        modelName === eweaInternals.MODEL_NAME_PREDEFINE
          ? { 'strings.name.en': { $in: vals }, namespace: { $in: namespaces } }
          : { name: { $in: vals } };
      populate[path] = { model: modelName, match, array };
    }
  });
  data.populate = populate;

  // return
  data = lodash.omit(data, ...[...lodash.keys(eweaInternals.EVENT_RELATIONS), 'relations', 'namespace']);
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
const transformToVehicleDispatchSeed = (seed) => {
  // copy seed
  let data = common.mergeObjects(seed);

  // transform relations
  const populate = {};
  lodash.forEach(eweaInternals.VEHICLE_DISPATCH_RELATIONS, (value, key) => {
    const hasRelation = key && data[key];
    if (hasRelation) {
      const options = common.mergeObjects(value);
      const path = `${options.path || key}`;
      const modelName = options.ref || eweaInternals.MODEL_NAME_PREDEFINE;
      const namespaces = common.compact([].concat(options.namespace));
      const array = options.array || false;
      const vals = common.sortedUniq(lodash.split(data[key], ','));
      const match =
        modelName === eweaInternals.MODEL_NAME_PREDEFINE
          ? { 'strings.name.en': { $in: vals }, namespace: { $in: namespaces } }
          : { name: { $in: vals } };
      populate[path] = { model: modelName, match, array };
    }
  });
  data.populate = populate;

  // return
  data = lodash.omit(
    data,
    ...[...lodash.keys(eweaInternals.VEHICLE_DISPATCH_RELATIONS), 'relations', 'namespace']
  );
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
  return geoTools.readCsv({ path }, (error, { finished, feature, next }) => {
    let data = feature;
    if (!lodash.isEmpty(feature) && next && !finished) {
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
 * processCsvSeed((options, done) => (error, {finished, feature, next}) => { ... });
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
    const data = common.mergeObjects(properties, { namespace }, feature);
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
    throws = true,
    transformers = [],
  } = common.mergeObjects(optns);

  // do: seed data to model if exists
  const Model = mongooseCommon.model(modelName);
  if (Model) {
    // prepare seed options
    const isPredefine =
      modelName === eweaInternals.MODEL_NAME_PREDEFINE && !lodash.isEmpty(namespace);
    const csvFilePath = filePath || csvPathFor(namespace || modelName);
    const appliedTransformers = isPredefine
      ? lodash.map([transformToPredefineSeed, ...transformers], (fn) => {
          return (seed) => {
            return fn({ namespace, ...seed });
          };
        })
      : [...transformers];

    // seed from csv
    return readCsvFile(
      csvFilePath,
      appliedTransformers,
      processCsvSeed({ Model, properties, namespace, throws }, done)
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
  } = common.mergeObjects(optns);

  // do: seed data to model if exists
  const Model = mongooseCommon.model(modelName);
  if (Model) {
    // prepare seed options
    const isPredefine =
      modelName === eweaInternals.MODEL_NAME_PREDEFINE && !lodash.isEmpty(namespace);
    const jsonFilePath = filePath || jsonPathFor(namespace || modelName);
    const appliedTransformers = isPredefine
      ? lodash.map([transformToPredefineSeed, ...transformers], (fn) => {
          return (seed) => {
            return fn({ namespace, ...seed });
          };
        })
      : [...transformers];

    // prepare json seed stages
    const path = lodash.endsWith(jsonFilePath, '.json')
      ? jsonFilePath
      : `${jsonFilePath}.json`;
    return geoTools.readJson({ path, throws }, (error, data) => {
      if (!lodash.isEmpty(data)) {
        const transform = (seed) => {
          const merged = common.mergeObjects(properties, { namespace }, seed);
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
  // TODO: transform relations to populate?

  // normalize options
  const {
    modelName = undefined,
    throws = false,
    data = undefined,
    filter,
    transform,
  } = common.mergeObjects(optns);

  // do: seed data to model if seeds exists
  const Model = mongooseCommon.model(modelName);
  const canSeed = Model && lodash.isFunction(Model.seed);
  if (canSeed) {
    // filter, transform & seed
    return Model.seed({ data, filter, transform }, (error, results) => {
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
    modelName = eweaInternals.MODEL_NAME_PREDEFINE,
    namespace = undefined,
    throws = false,
    transformers = [],
  } = common.mergeObjects(optns);

  // prepare namespace filter
  const filter = (seed) => seed.namespace === namespace;

  // prepare options
  const options = { modelName, namespace, throws, transformers, filter };

  // prepare predefine seed stages
  const fromSeeds = (next) => seedFromSeeds(options, (error) => next(error));
  const fromJson = (next) => seedFromJson(options, (error) => next(error));
  const fromCsv = (next) => seedFromCsv(options, (error) => next(error));
  const stages = [fromCsv, fromJson, fromSeeds];

  // do seed predefine
  return async.waterfall(stages, done);
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
    modelName = eweaInternals.MODEL_NAME_PARTY,
    type = 'Focal',
    throws = false,
    transformers = [],
  } = common.mergeObjects(optns);

  // prepare type filter
  const filter = (seed) => seed.type === type;

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
  const fromSeeds = (next) => seedFromSeeds(options, (error) => next(error));
  const fromJson = (next) => seedFromJson(options, (error) => next(error));
  const fromCsv = (next) => seedFromCsv(options, (error) => next(error));
  const stages = [fromCsv, fromJson, fromSeeds];

  // do seed party
  return async.waterfall(stages, done);
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
    modelName = eweaInternals.MODEL_NAME_EVENT,
    throws = false,
    transformers = [],
  } = common.mergeObjects(optns);

  // prepare options
  const options = {
    modelName,
    properties: {},
    throws,
    transformers: [transformToEventSeed, ...transformers],
  };

  // prepare event seed stages
  const fromSeeds = (next) => seedFromSeeds(options, (error) => next(error));
  const fromJson = (next) => seedFromJson(options, (error) => next(error));
  const fromCsv = (next) => seedFromCsv(options, (error) => next(error));
  const stages = [fromCsv, fromJson, fromSeeds];

  // do seed event
  return async.waterfall(stages, done);
};

/**
 * @function seedVehicleDispatch
 * @name seedVehicleDispatch
 * @description Seed given vehicle dispatches
 * @param {object} optns valid seed options
 * @param {boolean} [optns.throws=false] whether to ignore error
 * @param {Function[]} optns.transformers valid event transformers
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
const seedVehicleDispatch = (optns, done) => {
  // normalize options
  const {
    modelName = eweaInternals.MODEL_NAME_VEHICLEDISPATCH,
    throws = false,
    transformers = [],
  } = common.mergeObjects(optns);

  // prepare options
  const options = {
    modelName,
    properties: {},
    throws,
    transformers: [transformToVehicleDispatchSeed, ...transformers],
  };

  // prepare vehicle dispatch seed stages
  const fromSeeds = (next) => seedFromSeeds(options, (error) => next(error));
  const fromJson = (next) => seedFromJson(options, (error) => next(error));
  const fromCsv = (next) => seedFromCsv(options, (error) => next(error));
  const stages = [fromCsv, fromJson, fromSeeds];

  // do seed vehicle dispatch
  return async.waterfall(stages, done);
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
const seedPermissions = (done) => {
  logger.debug('Start Seeding Permissions Data');
  // TODO: ensure collision free ids

  // prepare permissions seed stages
  const seedResourcePermissions = (next) => {
    return permission.Permission.seed((error) => next(error));
  };
  const seedPredefineNamespacePermissions = (next) => {
    const namespacePermissions = predefine.listPermissions();
    return permission.Permission.seed(namespacePermissions, (error) => next(error));
  };
  const stages = [seedResourcePermissions, seedPredefineNamespacePermissions];

  // do seed permissions
  return async.waterfall(stages, (error) => {
    logger.debug('Finish Seeding Permissions Data');
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
const seedDefaults = (done) => {
  logger.debug('Start Seeding Default Predefines Data');

  // prepare options
  const modelName = eweaInternals.MODEL_NAME_PREDEFINE;
  const data = lodash.values(DEFAULT_SEEDS);
  const namespaces = lodash.keys(DEFAULT_SEEDS);
  const filter = ({ namespace = undefined }) => {
    return lodash.includes(namespaces, namespace);
  };
  const optns = { modelName, data, filter };

  // do seeding
  return seedFromSeeds(optns, (error) => {
    logger.debug('Finish Seeding Default Predefines Data');
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
const seedCommons = (done) => {
  logger.debug('Start Seeding Common Predefines Data');

  // prepare options
  const modelName = eweaInternals.MODEL_NAME_PREDEFINE;
  const data = [...lodash.values(COMMON_VEHICLESTATUS_SEEDS)];
  const namespaces = common.sortedUniq(lodash.map(data, 'namespace'));
  const filter = ({ namespace = undefined }) => {
    return lodash.includes(namespaces, namespace);
  };
  const optns = { modelName, data, filter };

  // do seeding
  return seedFromSeeds(optns, (error) => {
    logger.debug('Finish Seeding Common Predefines Data');
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
const seedUnits = (done) => {
  logger.debug('Start Seeding Units Data');
  const namespace = 'Unit';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Units Data');
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
const seedPriorities = (done) => {
  logger.debug('Start Seeding Priorities Data');
  const namespace = 'Priority';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Priorities Data');
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
const seedAdministrativeLevels = (done) => {
  logger.debug('Start Seeding Administrative Levels Data');
  const namespace = 'AdministrativeLevel';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Administrative Levels Data');
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
const seedFeatureTypes = (done) => {
  logger.debug('Start Seeding Feature Types Data');
  const namespace = 'FeatureType';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Feature Types Data');
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
const seedEventIndicators = (done) => {
  logger.debug('Start Seeding Event Indicators Data');
  const namespace = 'EventIndicator';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Event Indicators Data');
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
const seedEventTopics = (done) => {
  logger.debug('Start Seeding Event Topics Data');
  const namespace = 'EventTopic';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Event Topics Data');
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
const seedEventLevels = (done) => {
  logger.debug('Start Seeding Event Levels Data');
  const namespace = 'EventLevel';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Event Levels Data');
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
const seedEventSeverities = (done) => {
  logger.debug('Start Seeding Event Severities Data');
  const namespace = 'EventSeverity';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Event Severities Data');
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
const seedEventCertainties = (done) => {
  logger.debug('Start Seeding Event Certainties Data');
  const namespace = 'EventCertainty';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Event Certainties Data');
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
const seedEventStatuses = (done) => {
  logger.debug('Start Seeding Event Statuses Data');
  const namespace = 'EventStatus';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Event Statuses Data');
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
const seedEventUrgencies = (done) => {
  logger.debug('Start Seeding Event Urgencies Data');
  const namespace = 'EventUrgency';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Event Urgencies Data');
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
const seedEventResponses = (done) => {
  logger.debug('Start Seeding Event Responses Data');
  const namespace = 'EventResponse';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Event Responses Data');
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
const seedPartyOwnerships = (done) => {
  logger.debug('Start Seeding Party Ownerships Data');
  const namespace = 'PartyOwnership';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Party Ownerships Data');
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
const seedPartyGroups = (done) => {
  logger.debug('Start Seeding Party Groups Data');
  const namespace = 'PartyGroup';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Party Groups Data');
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
const seedPartyRoles = (done) => {
  logger.debug('Start Seeding Party Roles Data');
  const namespace = 'PartyRole';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Party Roles Data');
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
const seedPartyGenders = (done) => {
  logger.debug('Start Seeding Party Genders Data');
  const namespace = 'PartyGender';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Party Genders Data');
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
const seedPartyOccupations = (done) => {
  logger.debug('Start Seeding Party Occupations Data');
  const namespace = 'PartyOccupation';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Party Occupations Data');
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
const seedVehicleTypes = (done) => {
  logger.debug('Start Seeding Vehicle Types Data');
  const namespace = 'VehicleType';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Vehicle Types Data');
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
const seedVehicleModels = (done) => {
  logger.debug('Start Seeding Vehicle Models Data');
  const namespace = 'VehicleModel';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Vehicle Models Data');
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
const seedVehicleMakes = (done) => {
  logger.debug('Start Seeding Vehicle Makes Data');
  const namespace = 'VehicleMake';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Vehicle Makes Data');
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
const seedVehicleStatuses = (done) => {
  logger.debug('Start Seeding Vehicle Statuses Data');
  const namespace = 'VehicleStatus';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Vehicle Statuses Data');
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
const seedEventGroups = (done) => {
  logger.debug('Start Seeding Event Groups Data');
  const namespace = 'EventGroup';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Event Groups Data');
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
const seedEventTypes = (done) => {
  logger.debug('Start Seeding Event Types Data');
  const namespace = 'EventType';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Event Types Data');
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
const seedEventFunctions = (done) => {
  logger.debug('Start Seeding Event Functions Data');
  const namespace = 'EventFunction';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Event Functions Data');
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
const seedEventActions = (done) => {
  logger.debug('Start Seeding Event Actions Data');
  const namespace = 'EventAction';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Event Actions Data');
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
const seedEventQuestions = (done) => {
  logger.debug('Start Seeding Event Questions Data');
  const namespace = 'EventQuestion';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Event Questions Data');
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
const seedAdministrativeAreas = (done) => {
  logger.debug('Start Seeding Administrative Areas Data');
  const namespace = 'AdministrativeArea';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Administrative Areas Data');
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
const seedAgencies = (done) => {
  logger.debug('Start Seeding Agencies Data');
  const type = 'Agency';
  return seedParty({ type }, (error) => {
    logger.debug('Finish Seeding Agencies Data');
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
const seedFocals = (done) => {
  // TODO: merge administrator|seedAdministrator
  logger.debug('Start Seeding Focals Data');
  const type = 'Focal';
  return seedParty({ type }, (error) => {
    logger.debug('Finish Seeding Focals Data');
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
const seedFeatures = (done) => {
  // TODO: seed per feature type i.e hospitals, buildings etc
  logger.debug('Start Seeding Features Data');
  const namespace = 'Feature';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Features Data');
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
const seedVehicles = (done) => {
  // TODO: seed per vehicle type i.e ambulances, fires etc
  logger.debug('Start Seeding Vehicles Data');
  const namespace = 'Vehicle';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Vehicles Data');
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
const seedEventActionCatalogues = (done) => {
  logger.debug('Start Seeding Event Action Catalogues Data');
  const namespace = 'EventActionCatalogue';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Event Action Catalogues Data');
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
const seedNotificationTemplates = (done) => {
  logger.debug('Start Seeding Notification Templates Data');
  const namespace = 'NotificationTemplate';
  return seedPredefine({ namespace }, (error) => {
    logger.debug('Finish Seeding Notification Templates Data');
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
const seedEvents = (done) => {
  logger.debug('Start Seeding Events Data');
  return seedEvent({}, (error) => {
    logger.debug('Finish Seeding Events Data');
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
const seedVehicleDispatches = (done) => {
  logger.debug('Start Seeding Vehicle Dispatches Data');
  return seedVehicleDispatch({}, (error) => {
    logger.debug('Finish Seeding Vehicle Dispatches Data');
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
const seed = (done) => {
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
    // seedAdministrators,
    seedAgencies,
    seedFocals,
    seedFeatures,
    seedVehicles,
    seedEventActionCatalogues,
    seedNotificationTemplates,
    seedEvents,
    // seedEventChangeLogs,
    seedVehicleDispatches,
  ];

  // run seed tasks
  logger.debug('Start Seeding Data');
  async.waterfall(tasks, (error, result) => {
    if (error) {
      logger.warn('Fail Seeding Data', error);
    } else {
      logger.debug('Finish Seeding Data');
    }
    return done(error, result);
  });
};

/**
 * @function findDefaults
 * @name findDefaults
 * @description Find default predefine values
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} default values or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.8.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * findDefaults((error, defaults) => { ... });
 * //=> { unit: {...}, ... }
 *
 */
const findDefaultPredefines = (done) => {
  // TODO: Party, Event, ChangeLog defaults

  // prepare criterias
  const namePaths = mongooseLocaleSchema.localizedKeysFor('strings.name');
  const nameCriteria = lodash.isEmpty(DEFAULT_NAMES)
    ? undefined
    : common.arrayToObject(namePaths, (/* object, path */) => {
        return { $in: DEFAULT_NAMES };
      });
  const defaultCriteria = { 'booleans.default': true };

  // prepare query options
  const criteria = { $or: common.compact([defaultCriteria, nameCriteria]) };
  const projection = null; // TODO: support projections
  const options = { autopopulate: false };

  // fetch defaults
  const fetchDefaults = (next) => {
    return predefine.Predefine.find(criteria, projection, options, next);
  };

  // transform defaults to map
  const transformDefaults = (defaults, next) => {
    // transform to object
    const results = { predefines: defaults };
    lodash.forEach(DEFAULT_PATHS, ({ namespace, array = false }, key) => {
      // find defaults per namespace
      const predefines = common.compact([].concat(lodash.filter(defaults, { namespace })));

      // collect array of defaults
      if (array) {
        results[key] = predefines;
      }
      // collect single default
      else {
        results[key] =
          lodash.find(predefines, { 'booleans.default': true }) || lodash.first(predefines);
      }
    });

    // return defaults
    return next(null, results);
  };

  // execute
  const tasks = [fetchDefaults, transformDefaults];
  return async.waterfall(tasks, done);
};

/**
 * @function findPartyDefaults
 * @name findPartyDefaults
 * @description Find party default predefine values
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} default values or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.8.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * findPartyDefaults((error, defaults) => { ... });
 * //=> { role: {...}, ... }
 *
 */
const findPartyDefaults = (done) => {
  // find default predefines
  return findDefaultPredefines((error, { predefines }) => {
    if (error) {
      return done(error);
    }

    // derive party defaults
    const results = {};
    lodash.forEach(eweaInternals.PARTY_RELATIONS, ({ namespace }, key) => {
      results[key] = lodash.find(predefines, { namespace });
    });
    return done(null, results);
  });
};

const findEventDefaults = (done) => {
  return done();
};

const findChangelogDefaults = (done) => {
  return done();
};

const preloadRelated = (predefine, done) => {
  return done();
};

const preloadPartyRelated = (party, done) => {
  return done();
};

const preloadEventRelated = (event, done) => {
  return done();
};

const preloadChangelogRelated = (changelog, done) => {
  return done();
};

/**
 * @function findAdministrativeLevelChildren
 * @name findAdministrativeLevelChildren
 * @description Find lower administrative levels recursive based on criteria
 * @param {object} criteria valid lower query options
 * @param {Function} done callback to invoke on success or error
 * @returns {object[]|Error} found administrative levels or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.8.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const criteria = { _id: ... }
 * findAdministrativeLevelChildren(criteria,(error, levels) => { ... });
 * //=> [ Predefine { ... }, ... ]
 */
const findAdministrativeLevelChildren = (criteria, done) => {
  return predefine.Predefine.findAdministrativeLevelChildren(criteria, done);
};

/**
 * @function findAdministrativeLevelParents
 * @name findAdministrativeLevelParents
 * @description Find parent administrative levels recursive based on criteria
 * @param {object} criteria valid parent query options
 * @param {Function} done callback to invoke on success or error
 * @returns {object[]|Error} found administrative levels or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.8.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const criteria = { _id: ... }
 * findAdministrativeLevelParents(criteria,(error, levels) => { ... });
 * //=> [ Predefine { ... }, ... ]
 */
const findAdministrativeLevelParents = (criteria, done) => {
  return predefine.Predefine.findAdministrativeLevelParents(criteria, done);
};

/**
 * @function findAdministrativeAreaChildren
 * @name findAdministrativeAreaChildren
 * @description Find lower administrative areas recursive based on criteria
 * @param {object} criteria valid lower query options
 * @param {Function} done callback to invoke on success or error
 * @returns {object[]|Error} found administrative areas or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.8.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const criteria = { _id: ... }
 * findAdministrativeAreaChildren(criteria,(error, areas) => { ... });
 * //=> [ Predefine { ... }, ... ]
 */
const findAdministrativeAreaChildren = (criteria, done) => {
  return predefine.Predefine.findAdministrativeAreaChildren(criteria, done);
};

/**
 * @function findAdministrativeAreaParents
 * @name findAdministrativeAreaParents
 * @description Find parent administrative areas recursive based on criteria
 * @param {object} criteria valid parent query options
 * @param {Function} done callback to invoke on success or error
 * @returns {object[]|Error} found administrative areas or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.8.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * const criteria = { _id: ... }
 * findAdministrativeAreaParents(criteria,(error, areas) => { ... });
 * //=> [ Predefine { ... }, ... ]
 */
const findAdministrativeAreaParents = (criteria, done) => {
  return predefine.Predefine.findAdministrativeAreaParents(criteria, done);
};

// start:query shortcuts

/* eslint-disable jsdoc/check-param-names */

/**
 * @function findPermissions
 * @name findPermissions
 * @description Find permissions
 * @param {object} [filter] valid query condition
 * @param {object} [projection] valid fields to select
 * @param {object} [options] valid query options
 * @param {Function} [callback] callback to invoke on success or error
 * @param {*} [optns] valid query options
 * @returns {object[]|Error} permissions or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * findPermissions((error, found) => { ... });
 * //=> [ Permission { ... }, ... ]
 */
const findPermissions = (...optns) => {
  return permission.Permission.find(...optns);
};

/**
 * @function findPermission
 * @name findPermission
 * @description Find permission
 * @param {object} [filter] valid query condition
 * @param {object} [projection] valid fields to select
 * @param {object} [options] valid query options
 * @param {Function} [callback] callback to invoke on success or error
 * @param {*} [optns] valid query options
 * @returns {object|Error} permission or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * findPermission((error, found) => { ... });
 * //=> Permission { ... }
 */
const findPermission = (...optns) => {
  return permission.Permission.findOne(...optns);
};

/**
 * @function findAdministrativeLevels
 * @name findAdministrativeLevels
 * @description Find administrative levels
 * @param {object} [filter] valid query condition
 * @param {object} [projection] valid fields to select
 * @param {object} [options] valid query options
 * @param {Function} [callback] callback to invoke on success or error
 * @param {*} [optns] valid query options
 * @returns {object[]|Error} administrative levels or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * findAdministrativeLevels((error, found) => { ... });
 * //=> [ Predefine { ... }, ... ]
 */
const findAdministrativeLevels = (...optns) => {
  return predefine.Predefine.findAdministrativeLevel(...optns);
};

/**
 * @function findAdministrativeLevel
 * @name findAdministrativeLevel
 * @description Find administrative level
 * @param {object} [filter] valid query condition
 * @param {object} [projection] valid fields to select
 * @param {object} [options] valid query options
 * @param {Function} [callback] callback to invoke on success or error
 * @param {*} [optns] valid query options
 * @returns {object|Error} administrative level or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * findAdministrativeLevel((error, found) => { ... });
 * //=> Predefine { ... }
 */
const findAdministrativeLevel = (...optns) => {
  return predefine.Predefine.findOneAdministrativeLevel(...optns);
};

/**
 * @function findPartyRoles
 * @name findPartyRoles
 * @description Find party roles
 * @param {object} [filter] valid query condition
 * @param {object} [projection] valid fields to select
 * @param {object} [options] valid query options
 * @param {Function} [callback] callback to invoke on success or error
 * @param {*} [optns] valid query options
 * @returns {object[]|Error} party roles or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * findPartyRoles((error, found) => { ... });
 * //=> [ Predefine { ... }, ... ]
 */
const findPartyRoles = (...optns) => {
  return predefine.Predefine.findPartyRole(...optns);
};

/**
 * @function findPartyRole
 * @name findPartyRole
 * @description Find party role
 * @param {object} [filter] valid query condition
 * @param {object} [projection] valid fields to select
 * @param {object} [options] valid query options
 * @param {Function} [callback] callback to invoke on success or error
 * @param {*} [optns] valid query options
 * @returns {object|Error} party role or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * findPartyRole((error, found) => { ... });
 * //=> Predefine { ... }
 */
const findPartyRole = (...optns) => {
  return predefine.Predefine.findOnePartyRole(...optns);
};

/**
 * @function findPartyGroups
 * @name findPartyGroups
 * @description Find party groups
 * @param {object} [filter] valid query condition
 * @param {object} [projection] valid fields to select
 * @param {object} [options] valid query options
 * @param {Function} [callback] callback to invoke on success or error
 * @param {*} [optns] valid query options
 * @returns {object[]|Error} party groups or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * findPartyGroups((error, found) => { ... });
 * //=> [ Predefine { ... }, ... ]
 */
const findPartyGroups = (...optns) => {
  return predefine.Predefine.findPartyGroup(...optns);
};

/**
 * @function findPartyGroup
 * @name findPartyGroup
 * @description Find party group
 * @param {object} [filter] valid query condition
 * @param {object} [projection] valid fields to select
 * @param {object} [options] valid query options
 * @param {Function} [callback] callback to invoke on success or error
 * @param {*} [optns] valid query options
 * @returns {object|Error} party group or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * findPartyGroup((error, found) => { ... });
 * //=> Predefine { ... }
 */
const findPartyGroup = (...optns) => {
  return predefine.Predefine.findOnePartyGroup(...optns);
};

/**
 * @function findAdministrativeAreas
 * @name findAdministrativeAreas
 * @description Find administrative areas
 * @param {object} [filter] valid query condition
 * @param {object} [projection] valid fields to select
 * @param {object} [options] valid query options
 * @param {Function} [callback] callback to invoke on success or error
 * @param {*} [optns] valid query options
 * @returns {object[]|Error} administrative areas or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * findAdministrativeAreas((error, found) => { ... });
 * //=> [ Predefine { ... }, ... ]
 */
const findAdministrativeAreas = (...optns) => {
  return predefine.Predefine.findAdministrativeArea(...optns);
};

/**
 * @function findAdministrativeArea
 * @name findAdministrativeArea
 * @description Find administrative area
 * @param {object} [filter] valid query condition
 * @param {object} [projection] valid fields to select
 * @param {object} [options] valid query options
 * @param {Function} [callback] callback to invoke on success or error
 * @param {*} [optns] valid query options
 * @returns {object|Error} administrative area or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * findAdministrativeArea((error, found) => { ... });
 * //=> Predefine { ... }
 */
const findAdministrativeArea = (...optns) => {
  return predefine.Predefine.findOneAdministrativeArea(...optns);
};

/**
 * @function findParties
 * @name findParties
 * @description Find parties
 * @param {object} [filter] valid query condition
 * @param {object} [projection] valid fields to select
 * @param {object} [options] valid query options
 * @param {Function} [callback] callback to invoke on success or error
 * @param {*} [optns] valid query options
 * @returns {object[]|Error} parties or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * findParties((error, found) => { ... });
 * //=> [ Party { ... }, ... ]
 */
const findParties = (...optns) => {
  return emisStakeholder.Party.find(...optns);
};

/**
 * @function findParty
 * @name findParty
 * @description Find party
 * @param {object} [filter] valid query condition
 * @param {object} [projection] valid fields to select
 * @param {object} [options] valid query options
 * @param {Function} [callback] callback to invoke on success or error
 * @param {*} [optns] valid query options
 * @returns {object|Error} party or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.9.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * findParty((error, found) => { ... });
 * //=> Party { ... }
 */
const findParty = (...optns) => {
  return emisStakeholder.Party.findOne(...optns);
};

/* eslint-enable jsdoc/check-param-names */

// start:query shortcuts

Object.keys(eweaInternals).forEach(function (k) {
  if (k !== 'default') Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () {
      return eweaInternals[k];
    }
  });
});
Object.keys(constants).forEach(function (k) {
  if (k !== 'default') Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () {
      return constants[k];
    }
  });
});
exports.COMMON_VEHICLESTATUSES = COMMON_VEHICLESTATUSES;
exports.COMMON_VEHICLESTATUS_SEEDS = COMMON_VEHICLESTATUS_SEEDS;
exports.DEFAULT_ADMINISTRATIVEAREA_NAME = DEFAULT_ADMINISTRATIVEAREA_NAME;
exports.DEFAULT_ADMINISTRATIVELEVEL_NAME = DEFAULT_ADMINISTRATIVELEVEL_NAME;
exports.DEFAULT_EVENTACTION_NAME = DEFAULT_EVENTACTION_NAME;
exports.DEFAULT_EVENTCERTAINTY_NAME = DEFAULT_EVENTCERTAINTY_NAME;
exports.DEFAULT_EVENTFUNCTION_NAME = DEFAULT_EVENTFUNCTION_NAME;
exports.DEFAULT_EVENTGROUP_NAME = DEFAULT_EVENTGROUP_NAME;
exports.DEFAULT_EVENTINDICATOR_NAME = DEFAULT_EVENTINDICATOR_NAME;
exports.DEFAULT_EVENTLEVEL_NAME = DEFAULT_EVENTLEVEL_NAME;
exports.DEFAULT_EVENTQUESTION_NAME = DEFAULT_EVENTQUESTION_NAME;
exports.DEFAULT_EVENTRESPONSE_NAME = DEFAULT_EVENTRESPONSE_NAME;
exports.DEFAULT_EVENTSEVERITY_NAME = DEFAULT_EVENTSEVERITY_NAME;
exports.DEFAULT_EVENTSTATUS_NAME = DEFAULT_EVENTSTATUS_NAME;
exports.DEFAULT_EVENTTOPIC_NAME = DEFAULT_EVENTTOPIC_NAME;
exports.DEFAULT_EVENTTYPE_NAME = DEFAULT_EVENTTYPE_NAME;
exports.DEFAULT_EVENTURGENCY_NAME = DEFAULT_EVENTURGENCY_NAME;
exports.DEFAULT_EVENT_NUMBER = DEFAULT_EVENT_NUMBER;
exports.DEFAULT_FEATURETYPE_NAME = DEFAULT_FEATURETYPE_NAME;
exports.DEFAULT_NAMES = DEFAULT_NAMES;
exports.DEFAULT_PARTYGROUP_NAME = DEFAULT_PARTYGROUP_NAME;
exports.DEFAULT_PARTYROLE_NAME = DEFAULT_PARTYROLE_NAME;
exports.DEFAULT_PATHS = DEFAULT_PATHS;
exports.DEFAULT_PREDEFINE_COLOR = DEFAULT_PREDEFINE_COLOR;
exports.DEFAULT_PREDEFINE_NAME = DEFAULT_PREDEFINE_NAME;
exports.DEFAULT_PREDEFINE_RELATION = DEFAULT_PREDEFINE_RELATION;
exports.DEFAULT_PREDEFINE_WEIGHT = DEFAULT_PREDEFINE_WEIGHT;
exports.DEFAULT_SEEDS = DEFAULT_SEEDS;
exports.DEFAULT_SEEDS_IGNORE = DEFAULT_SEEDS_IGNORE;
exports.DEFAULT_UNIT_NAME = DEFAULT_UNIT_NAME;
exports.applyTransformsOn = applyTransformsOn;
exports.connect = connect;
exports.csvPathFor = csvPathFor;
exports.dataPathFor = dataPathFor;
exports.dispatchStatusFor = dispatchStatusFor;
exports.findAdministrativeArea = findAdministrativeArea;
exports.findAdministrativeAreaChildren = findAdministrativeAreaChildren;
exports.findAdministrativeAreaParents = findAdministrativeAreaParents;
exports.findAdministrativeAreas = findAdministrativeAreas;
exports.findAdministrativeLevel = findAdministrativeLevel;
exports.findAdministrativeLevelChildren = findAdministrativeLevelChildren;
exports.findAdministrativeLevelParents = findAdministrativeLevelParents;
exports.findAdministrativeLevels = findAdministrativeLevels;
exports.findChangelogDefaults = findChangelogDefaults;
exports.findDefaultPredefines = findDefaultPredefines;
exports.findEventDefaults = findEventDefaults;
exports.findParties = findParties;
exports.findParty = findParty;
exports.findPartyDefaults = findPartyDefaults;
exports.findPartyGroup = findPartyGroup;
exports.findPartyGroups = findPartyGroups;
exports.findPartyRole = findPartyRole;
exports.findPartyRoles = findPartyRoles;
exports.findPermission = findPermission;
exports.findPermissions = findPermissions;
exports.geoJsonPathFor = geoJsonPathFor;
exports.jsonPathFor = jsonPathFor;
exports.objectIdFor = objectIdFor;
exports.pathFor = pathFor;
exports.preloadChangelogRelated = preloadChangelogRelated;
exports.preloadEventRelated = preloadEventRelated;
exports.preloadPartyRelated = preloadPartyRelated;
exports.preloadRelated = preloadRelated;
exports.processCsvSeed = processCsvSeed;
exports.readCsvFile = readCsvFile;
exports.seed = seed;
exports.seedAdministrativeAreas = seedAdministrativeAreas;
exports.seedAdministrativeLevels = seedAdministrativeLevels;
exports.seedAgencies = seedAgencies;
exports.seedCommons = seedCommons;
exports.seedDefaults = seedDefaults;
exports.seedEvent = seedEvent;
exports.seedEventActionCatalogues = seedEventActionCatalogues;
exports.seedEventActions = seedEventActions;
exports.seedEventCertainties = seedEventCertainties;
exports.seedEventFunctions = seedEventFunctions;
exports.seedEventGroups = seedEventGroups;
exports.seedEventIndicators = seedEventIndicators;
exports.seedEventLevels = seedEventLevels;
exports.seedEventQuestions = seedEventQuestions;
exports.seedEventResponses = seedEventResponses;
exports.seedEventSeverities = seedEventSeverities;
exports.seedEventStatuses = seedEventStatuses;
exports.seedEventTopics = seedEventTopics;
exports.seedEventTypes = seedEventTypes;
exports.seedEventUrgencies = seedEventUrgencies;
exports.seedEvents = seedEvents;
exports.seedFeatureTypes = seedFeatureTypes;
exports.seedFeatures = seedFeatures;
exports.seedFocals = seedFocals;
exports.seedFromCsv = seedFromCsv;
exports.seedFromJson = seedFromJson;
exports.seedFromSeeds = seedFromSeeds;
exports.seedNotificationTemplates = seedNotificationTemplates;
exports.seedParty = seedParty;
exports.seedPartyGenders = seedPartyGenders;
exports.seedPartyGroups = seedPartyGroups;
exports.seedPartyOccupations = seedPartyOccupations;
exports.seedPartyOwnerships = seedPartyOwnerships;
exports.seedPartyRoles = seedPartyRoles;
exports.seedPathFor = seedPathFor;
exports.seedPermissions = seedPermissions;
exports.seedPredefine = seedPredefine;
exports.seedPriorities = seedPriorities;
exports.seedUnits = seedUnits;
exports.seedVehicleDispatch = seedVehicleDispatch;
exports.seedVehicleDispatches = seedVehicleDispatches;
exports.seedVehicleMakes = seedVehicleMakes;
exports.seedVehicleModels = seedVehicleModels;
exports.seedVehicleStatuses = seedVehicleStatuses;
exports.seedVehicleTypes = seedVehicleTypes;
exports.seedVehicles = seedVehicles;
exports.shapeFilePathFor = shapeFilePathFor;
exports.syncIndexes = syncIndexes;
exports.transformGeoFields = transformGeoFields;
exports.transformOtherFields = transformOtherFields;
exports.transformSeedKeys = transformSeedKeys;
exports.transformToEventSeed = transformToEventSeed;
exports.transformToPartySeed = transformToPartySeed;
exports.transformToPredefineSeed = transformToPredefineSeed;
exports.transformToVehicleDispatchSeed = transformToVehicleDispatchSeed;
