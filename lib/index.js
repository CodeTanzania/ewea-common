'use strict';

const eweaInternals = require('@codetanzania/ewea-internals');
const common = require('@lykmapipo/common');
const env = require('@lykmapipo/env');
const constants = require('@lykmapipo/constants');
require('async');
require('@lykmapipo/mongoose-common');
require('@lykmapipo/file');
require('path');
require('lodash');
require('@lykmapipo/logger');
require('@lykmapipo/geo-tools');
require('@lykmapipo/predefine');
require('@lykmapipo/permission');
require('mongoose-locale-schema');

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
Object.defineProperty(exports, 'applyTransformsOn', {
  enumerable: true,
  get: function () {
    return constants.applyTransformsOn;
  }
});
Object.defineProperty(exports, 'connect', {
  enumerable: true,
  get: function () {
    return constants.connect;
  }
});
Object.defineProperty(exports, 'csvPathFor', {
  enumerable: true,
  get: function () {
    return constants.csvPathFor;
  }
});
Object.defineProperty(exports, 'dataPathFor', {
  enumerable: true,
  get: function () {
    return constants.dataPathFor;
  }
});
Object.defineProperty(exports, 'findAdministrativeAreaChildren', {
  enumerable: true,
  get: function () {
    return constants.findAdministrativeAreaChildren;
  }
});
Object.defineProperty(exports, 'findAdministrativeAreaParents', {
  enumerable: true,
  get: function () {
    return constants.findAdministrativeAreaParents;
  }
});
Object.defineProperty(exports, 'findAdministrativeLevelChildren', {
  enumerable: true,
  get: function () {
    return constants.findAdministrativeLevelChildren;
  }
});
Object.defineProperty(exports, 'findAdministrativeLevelParents', {
  enumerable: true,
  get: function () {
    return constants.findAdministrativeLevelParents;
  }
});
Object.defineProperty(exports, 'findChangelogDefaults', {
  enumerable: true,
  get: function () {
    return constants.findChangelogDefaults;
  }
});
Object.defineProperty(exports, 'findDefaultPredefines', {
  enumerable: true,
  get: function () {
    return constants.findDefaultPredefines;
  }
});
Object.defineProperty(exports, 'findEventDefaults', {
  enumerable: true,
  get: function () {
    return constants.findEventDefaults;
  }
});
Object.defineProperty(exports, 'findPartyDefaults', {
  enumerable: true,
  get: function () {
    return constants.findPartyDefaults;
  }
});
Object.defineProperty(exports, 'geoJsonPathFor', {
  enumerable: true,
  get: function () {
    return constants.geoJsonPathFor;
  }
});
Object.defineProperty(exports, 'jsonPathFor', {
  enumerable: true,
  get: function () {
    return constants.jsonPathFor;
  }
});
Object.defineProperty(exports, 'pathFor', {
  enumerable: true,
  get: function () {
    return constants.pathFor;
  }
});
Object.defineProperty(exports, 'preloadChangelogRelated', {
  enumerable: true,
  get: function () {
    return constants.preloadChangelogRelated;
  }
});
Object.defineProperty(exports, 'preloadEventRelated', {
  enumerable: true,
  get: function () {
    return constants.preloadEventRelated;
  }
});
Object.defineProperty(exports, 'preloadPartyRelated', {
  enumerable: true,
  get: function () {
    return constants.preloadPartyRelated;
  }
});
Object.defineProperty(exports, 'preloadRelated', {
  enumerable: true,
  get: function () {
    return constants.preloadRelated;
  }
});
Object.defineProperty(exports, 'processCsvSeed', {
  enumerable: true,
  get: function () {
    return constants.processCsvSeed;
  }
});
Object.defineProperty(exports, 'readCsvFile', {
  enumerable: true,
  get: function () {
    return constants.readCsvFile;
  }
});
Object.defineProperty(exports, 'seed', {
  enumerable: true,
  get: function () {
    return constants.seed;
  }
});
Object.defineProperty(exports, 'seedAdministrativeAreas', {
  enumerable: true,
  get: function () {
    return constants.seedAdministrativeAreas;
  }
});
Object.defineProperty(exports, 'seedAdministrativeLevels', {
  enumerable: true,
  get: function () {
    return constants.seedAdministrativeLevels;
  }
});
Object.defineProperty(exports, 'seedAgencies', {
  enumerable: true,
  get: function () {
    return constants.seedAgencies;
  }
});
Object.defineProperty(exports, 'seedEvent', {
  enumerable: true,
  get: function () {
    return constants.seedEvent;
  }
});
Object.defineProperty(exports, 'seedEventActionCatalogues', {
  enumerable: true,
  get: function () {
    return constants.seedEventActionCatalogues;
  }
});
Object.defineProperty(exports, 'seedEventActions', {
  enumerable: true,
  get: function () {
    return constants.seedEventActions;
  }
});
Object.defineProperty(exports, 'seedEventCertainties', {
  enumerable: true,
  get: function () {
    return constants.seedEventCertainties;
  }
});
Object.defineProperty(exports, 'seedEventFunctions', {
  enumerable: true,
  get: function () {
    return constants.seedEventFunctions;
  }
});
Object.defineProperty(exports, 'seedEventGroups', {
  enumerable: true,
  get: function () {
    return constants.seedEventGroups;
  }
});
Object.defineProperty(exports, 'seedEventIndicators', {
  enumerable: true,
  get: function () {
    return constants.seedEventIndicators;
  }
});
Object.defineProperty(exports, 'seedEventLevels', {
  enumerable: true,
  get: function () {
    return constants.seedEventLevels;
  }
});
Object.defineProperty(exports, 'seedEventQuestions', {
  enumerable: true,
  get: function () {
    return constants.seedEventQuestions;
  }
});
Object.defineProperty(exports, 'seedEventResponses', {
  enumerable: true,
  get: function () {
    return constants.seedEventResponses;
  }
});
Object.defineProperty(exports, 'seedEventSeverities', {
  enumerable: true,
  get: function () {
    return constants.seedEventSeverities;
  }
});
Object.defineProperty(exports, 'seedEventStatuses', {
  enumerable: true,
  get: function () {
    return constants.seedEventStatuses;
  }
});
Object.defineProperty(exports, 'seedEventTopics', {
  enumerable: true,
  get: function () {
    return constants.seedEventTopics;
  }
});
Object.defineProperty(exports, 'seedEventTypes', {
  enumerable: true,
  get: function () {
    return constants.seedEventTypes;
  }
});
Object.defineProperty(exports, 'seedEventUrgencies', {
  enumerable: true,
  get: function () {
    return constants.seedEventUrgencies;
  }
});
Object.defineProperty(exports, 'seedEvents', {
  enumerable: true,
  get: function () {
    return constants.seedEvents;
  }
});
Object.defineProperty(exports, 'seedFeatureTypes', {
  enumerable: true,
  get: function () {
    return constants.seedFeatureTypes;
  }
});
Object.defineProperty(exports, 'seedFeatures', {
  enumerable: true,
  get: function () {
    return constants.seedFeatures;
  }
});
Object.defineProperty(exports, 'seedFocals', {
  enumerable: true,
  get: function () {
    return constants.seedFocals;
  }
});
Object.defineProperty(exports, 'seedFromCsv', {
  enumerable: true,
  get: function () {
    return constants.seedFromCsv;
  }
});
Object.defineProperty(exports, 'seedFromJson', {
  enumerable: true,
  get: function () {
    return constants.seedFromJson;
  }
});
Object.defineProperty(exports, 'seedFromSeeds', {
  enumerable: true,
  get: function () {
    return constants.seedFromSeeds;
  }
});
Object.defineProperty(exports, 'seedNotificationTemplates', {
  enumerable: true,
  get: function () {
    return constants.seedNotificationTemplates;
  }
});
Object.defineProperty(exports, 'seedParty', {
  enumerable: true,
  get: function () {
    return constants.seedParty;
  }
});
Object.defineProperty(exports, 'seedPartyGroups', {
  enumerable: true,
  get: function () {
    return constants.seedPartyGroups;
  }
});
Object.defineProperty(exports, 'seedPartyRoles', {
  enumerable: true,
  get: function () {
    return constants.seedPartyRoles;
  }
});
Object.defineProperty(exports, 'seedPathFor', {
  enumerable: true,
  get: function () {
    return constants.seedPathFor;
  }
});
Object.defineProperty(exports, 'seedPermissions', {
  enumerable: true,
  get: function () {
    return constants.seedPermissions;
  }
});
Object.defineProperty(exports, 'seedPredefine', {
  enumerable: true,
  get: function () {
    return constants.seedPredefine;
  }
});
Object.defineProperty(exports, 'seedUnits', {
  enumerable: true,
  get: function () {
    return constants.seedUnits;
  }
});
Object.defineProperty(exports, 'shapeFilePathFor', {
  enumerable: true,
  get: function () {
    return constants.shapeFilePathFor;
  }
});
Object.defineProperty(exports, 'syncIndexes', {
  enumerable: true,
  get: function () {
    return constants.syncIndexes;
  }
});
Object.defineProperty(exports, 'transformGeoFields', {
  enumerable: true,
  get: function () {
    return constants.transformGeoFields;
  }
});
Object.defineProperty(exports, 'transformOtherFields', {
  enumerable: true,
  get: function () {
    return constants.transformOtherFields;
  }
});
Object.defineProperty(exports, 'transformSeedKeys', {
  enumerable: true,
  get: function () {
    return constants.transformSeedKeys;
  }
});
Object.defineProperty(exports, 'transformToEventSeed', {
  enumerable: true,
  get: function () {
    return constants.transformToEventSeed;
  }
});
Object.defineProperty(exports, 'transformToPartySeed', {
  enumerable: true,
  get: function () {
    return constants.transformToPartySeed;
  }
});
Object.defineProperty(exports, 'transformToPredefineSeed', {
  enumerable: true,
  get: function () {
    return constants.transformToPredefineSeed;
  }
});
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
exports.DEFAULT_UNIT_NAME = DEFAULT_UNIT_NAME;
