import {
  MODEL_NAME_PREDEFINE,
  PREDEFINE_UNIT_NAME,
  PREDEFINE_ADMINISTRATIVELEVEL_NAME,
  PREDEFINE_FEATURETYPE_NAME,
  PREDEFINE_EVENTINDICATOR_NAME,
  PREDEFINE_EVENTTOPIC_NAME,
  PREDEFINE_EVENTLEVEL_NAME,
  PREDEFINE_EVENTSEVERITY_NAME,
  PREDEFINE_EVENTCERTAINTY_NAME,
  PREDEFINE_EVENTSTATUS_NAME,
  PREDEFINE_EVENTURGENCY_NAME,
  PREDEFINE_EVENTRESPONSE_NAME,
  PREDEFINE_PARTYGROUP_NAME,
  PREDEFINE_PARTYROLE_NAME,
  PREDEFINE_EVENTGROUP_NAME,
  PREDEFINE_EVENTTYPE_NAME,
  PREDEFINE_EVENTFUNCTION_NAME,
  PREDEFINE_EVENTACTION_NAME,
  PREDEFINE_EVENTQUESTION_NAME,
  PREDEFINE_ADMINISTRATIVEAREA_NAME,
  PREDEFINE_NAMESPACE_UNIT,
  PREDEFINE_NAMESPACE_CASESEVERITY,
  PREDEFINE_NAMESPACE_CASESTAGE,
  PREDEFINE_NAMESPACE_PARTYROLE,
  PREDEFINE_NAMESPACE_FEATURETYPE,
  PREDEFINE_NAMESPACE_EVENTINDICATOR,
  PREDEFINE_NAMESPACE_EVENTTOPIC,
  PREDEFINE_NAMESPACE_VEHICLESTATUS,
  PREDEFINE_NAMESPACE_VEHICLE,
  PREDEFINE_NAMESPACE_EVENTFUNCTION,
  PREDEFINE_NAMESPACE_EVENTACTION,
  PREDEFINE_NAMESPACE_EVENTQUESTION,
  PREDEFINE_NAMESPACE_FEATURE,
  PREDEFINE_NAMESPACE_EVENTACTIONCATALOGUE,
  PREDEFINE_NAMESPACE_NOTIFICATIONTEMPLATE,
  EVENT_RELATIONS,
  PREDEFINE_DEFAULTS,
} from '@codetanzania/ewea-internals';
import { createHmac } from 'crypto';
import { mapValues, omit } from 'lodash';
import { sortedUniq, mergeObjects } from '@lykmapipo/common';
import { getNumber, getString } from '@lykmapipo/env';
import { MongooseTypes } from '@lykmapipo/mongoose-common';
import {
  localizedValuesFor,
  localizedAbbreviationsFor,
} from 'mongoose-locale-schema';

export const DEFAULT_PREDEFINE_NAME = getString(
  'DEFAULT_PREDEFINE_NAME',
  'Unknown'
);
export const DEFAULT_PREDEFINE_COLOR = getString(
  'DEFAULT_PREDEFINE_COLOR',
  '#6D9EEB'
);
export const DEFAULT_PREDEFINE_WEIGHT = getNumber(
  'DEFAULT_PREDEFINE_WEIGHT',
  1000
);

export const DEFAULT_PREDEFINE_RELATION = {
  _id: null,
  strings: {
    name: localizedValuesFor({ en: DEFAULT_PREDEFINE_NAME }),
    abbreviation: localizedAbbreviationsFor({ en: DEFAULT_PREDEFINE_NAME }),
    color: DEFAULT_PREDEFINE_COLOR,
  },
  numbers: { weight: DEFAULT_PREDEFINE_WEIGHT },
};

export const DEFAULT_UNIT_NAME = getString(
  'DEFAULT_UNIT_NAME',
  PREDEFINE_UNIT_NAME
);

export const DEFAULT_ADMINISTRATIVELEVEL_NAME = getString(
  'DEFAULT_ADMINISTRATIVELEVEL_NAME',
  PREDEFINE_ADMINISTRATIVELEVEL_NAME
);

export const DEFAULT_FEATURETYPE_NAME = getString(
  'DEFAULT_FEATURETYPE_NAME',
  PREDEFINE_FEATURETYPE_NAME
);

export const DEFAULT_EVENTINDICATOR_NAME = getString(
  'DEFAULT_EVENTINDICATOR_NAME',
  PREDEFINE_EVENTINDICATOR_NAME
);

export const DEFAULT_EVENTTOPIC_NAME = getString(
  'DEFAULT_EVENTTOPIC_NAME',
  PREDEFINE_EVENTTOPIC_NAME
);

export const DEFAULT_EVENTLEVEL_NAME = getString(
  'DEFAULT_EVENTLEVEL_NAME',
  PREDEFINE_EVENTLEVEL_NAME
);

export const DEFAULT_EVENTSEVERITY_NAME = getString(
  'DEFAULT_EVENTSEVERITY_NAME',
  PREDEFINE_EVENTSEVERITY_NAME
);

export const DEFAULT_EVENTCERTAINTY_NAME = getString(
  'DEFAULT_EVENTCERTAINTY_NAME',
  PREDEFINE_EVENTCERTAINTY_NAME
);

export const DEFAULT_EVENTSTATUS_NAME = getString(
  'DEFAULT_EVENTSTATUS_NAME',
  PREDEFINE_EVENTSTATUS_NAME
);

export const DEFAULT_EVENTURGENCY_NAME = getString(
  'DEFAULT_EVENTURGENCY_NAME',
  PREDEFINE_EVENTURGENCY_NAME
);

export const DEFAULT_EVENTRESPONSE_NAME = getString(
  'DEFAULT_EVENTRESPONSE_NAME',
  PREDEFINE_EVENTRESPONSE_NAME
);

export const DEFAULT_PARTYGROUP_NAME = getString(
  'DEFAULT_PARTYGROUP_NAME',
  PREDEFINE_PARTYGROUP_NAME
);

export const DEFAULT_PARTYROLE_NAME = getString(
  'DEFAULT_PARTYROLE_NAME',
  PREDEFINE_PARTYROLE_NAME
);

export const DEFAULT_EVENTGROUP_NAME = getString(
  'DEFAULT_EVENTGROUP_NAME',
  PREDEFINE_EVENTGROUP_NAME
);

export const DEFAULT_EVENTTYPE_NAME = getString(
  'DEFAULT_EVENTTYPE_NAME',
  PREDEFINE_EVENTTYPE_NAME
);

export const DEFAULT_EVENTFUNCTION_NAME = getString(
  'DEFAULT_EVENTFUNCTION_NAME',
  PREDEFINE_EVENTFUNCTION_NAME
);

export const DEFAULT_EVENTACTION_NAME = getString(
  'DEFAULT_EVENTACTION_NAME',
  PREDEFINE_EVENTACTION_NAME
);

export const DEFAULT_EVENTQUESTION_NAME = getString(
  'DEFAULT_EVENTQUESTION_NAME',
  PREDEFINE_EVENTQUESTION_NAME
);

export const DEFAULT_ADMINISTRATIVEAREA_NAME = getString(
  'DEFAULT_ADMINISTRATIVEAREA_NAME',
  PREDEFINE_ADMINISTRATIVEAREA_NAME
);

export const DEFAULT_EVENT_NUMBER = getString(
  'DEFAULT_EVENT_NUMBER',
  undefined
);

export const DEFAULT_NAMES = sortedUniq([
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

export const DEFAULT_PATHS = mergeObjects(
  {
    unit: { namespace: PREDEFINE_NAMESPACE_UNIT },
    role: { namespace: PREDEFINE_NAMESPACE_PARTYROLE },
    template: { namespace: PREDEFINE_NAMESPACE_NOTIFICATIONTEMPLATE },
  },
  EVENT_RELATIONS
);

export const objectIdFor = (model, namespace, uniqueValue) => {
  // ensure secret & message
  const secret = model || namespace;
  const message = namespace || model;
  const data = uniqueValue ? message + uniqueValue : message;

  // generate 24-byte hex hash
  const hash = createHmac('md5', secret)
    .update(data)
    .digest('hex')
    .slice(0, 24);

  // create objectid from hash
  const objectId = MongooseTypes.ObjectId.createFromHexString(hash);

  return objectId;
};

export const DEFAULT_SEEDS_IGNORE = [
  PREDEFINE_NAMESPACE_FEATURETYPE,
  PREDEFINE_NAMESPACE_EVENTINDICATOR,
  PREDEFINE_NAMESPACE_EVENTTOPIC,
  PREDEFINE_NAMESPACE_VEHICLE,
  PREDEFINE_NAMESPACE_EVENTFUNCTION,
  PREDEFINE_NAMESPACE_EVENTACTION,
  PREDEFINE_NAMESPACE_EVENTQUESTION,
  PREDEFINE_NAMESPACE_FEATURE,
  PREDEFINE_NAMESPACE_EVENTACTIONCATALOGUE,
  PREDEFINE_NAMESPACE_NOTIFICATIONTEMPLATE,
];

export const DEFAULT_SEEDS = mapValues(
  omit(PREDEFINE_DEFAULTS, ...DEFAULT_SEEDS_IGNORE),
  (defaultValue, namespace) => {
    return {
      _id: objectIdFor(MODEL_NAME_PREDEFINE, namespace),
      namespace,
      strings: {
        name: localizedValuesFor({ en: defaultValue }),
        abbreviation: localizedAbbreviationsFor({ en: defaultValue }),
        color: DEFAULT_PREDEFINE_COLOR,
      },
      numbers: { weight: DEFAULT_PREDEFINE_WEIGHT },
      booleans: { default: true, system: true },
    };
  }
);

// TODO: move to internal or common?
// TODO: use constants
export const COMMON_VEHICLESTATUSES = {
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

export const COMMON_VEHICLESTATUS_SEEDS = mapValues(
  COMMON_VEHICLESTATUSES,
  ({ weight, name, abbreviation }) => {
    const namespace = PREDEFINE_NAMESPACE_VEHICLESTATUS;
    return {
      _id: objectIdFor(MODEL_NAME_PREDEFINE, namespace, name),
      namespace,
      strings: {
        name: localizedValuesFor({ en: name }),
        abbreviation: localizedValuesFor({ en: abbreviation || name }),
      },
      numbers: { weight: weight || DEFAULT_PREDEFINE_WEIGHT },
      booleans: { system: true },
    };
  }
);

// TODO: move to dispatch
export const dispatchStatusFor = (optns) => {
  // ensure options
  const options = mergeObjects(optns);

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

export const COMMON_CASESTAGES = {
  Screening: { weight: 1, name: 'Screening', abbreviation: 'SCRN' },
  Suspect: { weight: 2, name: 'Suspect', abbreviation: 'SUSP' },
  Probable: { weight: 3, name: 'Probable', abbreviation: 'PROB' },
  Confirmed: { weight: 4, name: 'Confirmed', abbreviation: 'CNFD' },
  Recovered: { weight: 5, name: 'Recovered', abbreviation: 'REC' },
  Followup: { weight: 6, name: 'Followup', abbreviation: 'FOL' },
  Died: { weight: 7, name: 'Died', abbreviation: 'DD' },
};

export const COMMON_CASESTAGE_SEEDS = mapValues(
  COMMON_CASESTAGES,
  ({ weight, name, abbreviation }) => {
    const namespace = PREDEFINE_NAMESPACE_CASESTAGE;
    return {
      _id: objectIdFor(MODEL_NAME_PREDEFINE, namespace, name),
      namespace,
      strings: {
        name: localizedValuesFor({ en: name }),
        abbreviation: localizedValuesFor({ en: abbreviation || name }),
      },
      numbers: { weight: weight || DEFAULT_PREDEFINE_WEIGHT },
      booleans: { system: true },
    };
  }
);

export const COMMON_CASESEVERITIES = {
  Asymptomatic: { weight: 0, name: 'Asymptomatic', abbreviation: 'ASY' },
  Mild: { weight: 2, name: 'Mild', abbreviation: 'MIL' },
  Moderate: { weight: 3, name: 'Moderate', abbreviation: 'MOD' },
  Severe: { weight: 4, name: 'Severe', abbreviation: 'SEV' },
  Critical: { weight: 5, name: 'Critical', abbreviation: 'CRT' },
};

export const COMMON_CASESEVERITY_SEEDS = mapValues(
  COMMON_CASESEVERITIES,
  ({ weight, name, abbreviation }) => {
    const namespace = PREDEFINE_NAMESPACE_CASESEVERITY;
    return {
      _id: objectIdFor(MODEL_NAME_PREDEFINE, namespace, name),
      namespace,
      strings: {
        name: localizedValuesFor({ en: name }),
        abbreviation: localizedValuesFor({ en: abbreviation || name }),
      },
      numbers: { weight: weight || DEFAULT_PREDEFINE_WEIGHT },
      booleans: { system: true },
    };
  }
);

// TODO to case
export const caseSeverityFor = (optns) => {
  // ensure options
  const { score } = mergeObjects(optns);

  // special
  if (score === 0) {
    return COMMON_CASESEVERITY_SEEDS.Asymptomatic;
  }

  // mild
  if (score > 0 && score <= 2) {
    return COMMON_CASESEVERITY_SEEDS.Mild;
  }

  // moderate
  if (score > 2 && score <= 3) {
    return COMMON_CASESEVERITY_SEEDS.Moderate;
  }

  // severe
  if (score > 3 && score <= 4) {
    return COMMON_CASESEVERITY_SEEDS.Severe;
  }

  // critical
  if (score > 4) {
    return COMMON_CASESEVERITY_SEEDS.Critical;
  }

  // return default
  return DEFAULT_SEEDS[PREDEFINE_NAMESPACE_CASESEVERITY];
};
