'use strict';

const common = require('@lykmapipo/common');
const async = require('async');
const mongooseCommon = require('@lykmapipo/mongoose-common');
const file = require('@lykmapipo/file');

// namespaces
const PREDEFINE_NAMESPACES = [
  'PartyRole',
  'PartyGroup',
  'EventCertainty',
  'EventSeverity',
  'EventStatus',
  'EventUrgency',
  'FeatureType',
  'Feature',
  'AdministrativeLevel',
  'AdministrativeArea',
  'EventGroup',
  'EventType',
  'EventFunction',
  'EventAction',
  'EventCatalogue',
  'EventIndicator',
  'EventQuestion',
  'Unit',
  'NotificationTemplate',
];

// relations
const PREDEFINE_RELATIONS = {
  permissions: { ref: 'Permission', array: true },
  roles: { ref: 'Predefine', namespace: 'PartyRole', array: true },
  groups: { ref: 'Predefine', namespace: 'PartyGroup', array: true },
  group: { ref: 'Predefine', namespace: 'EventGroup' },
  type: { ref: 'Predefine', namespace: ['EventType', 'FeatureType'] },
  function: { ref: 'Predefine', namespace: 'EventFunction' },
  level: { ref: 'Predefine', namespace: 'AdministrativeLevel' },
  area: { ref: 'Predefine', namespace: 'AdministrativeArea' },
  indicator: { ref: 'Predefine', namespace: 'EventIndicator' },
  unit: { ref: 'Predefine', namespace: 'Unit' },
  agencies: { ref: 'Party', array: true },
  focals: { ref: 'Party', array: true },
  custodians: { ref: 'Party', array: true },
};

// setup
process.env.PREDEFINE_NAMESPACES = common.join(PREDEFINE_NAMESPACES, ',');
process.env.PREDEFINE_RELATIONS_IGNORED = common.join(PREDEFINE_NAMESPACES, ',');
process.env.PREDEFINE_RELATIONS = common.stringify(PREDEFINE_RELATIONS);

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
  return mongooseCommon.connect(error => {
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
const syncIndexes = done => async.waterfall([connect, mongooseCommon.syncIndexes], done);

exports.PREDEFINE_NAMESPACES = PREDEFINE_NAMESPACES;
exports.PREDEFINE_RELATIONS = PREDEFINE_RELATIONS;
exports.connect = connect;
exports.syncIndexes = syncIndexes;
