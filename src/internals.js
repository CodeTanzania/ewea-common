import { join, stringify } from '@lykmapipo/common';

export const PREDEFINE_NAMESPACES = [
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
];
export const PREDEFINE_RELATIONS = {};

// setup
process.env.PREDEFINE_NAMESPACES = join(PREDEFINE_NAMESPACES, ',');
process.env.PREDEFINE_RELATIONS_IGNORED = join(PREDEFINE_NAMESPACES, ',');
process.env.PREDEFINE_RELATIONS = stringify(PREDEFINE_RELATIONS);
