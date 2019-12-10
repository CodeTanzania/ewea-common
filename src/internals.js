import { join, stringify } from '@lykmapipo/common';

// namespaces
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

// relations
export const PREDEFINE_RELATIONS = {
  permissions: { ref: 'Permission', array: true },
  roles: { ref: 'Predefine', array: true },
  groups: { ref: 'Predefine', array: true },
  unit: { ref: 'Predefine' },
};

// setup
process.env.PREDEFINE_NAMESPACES = join(PREDEFINE_NAMESPACES, ',');
process.env.PREDEFINE_RELATIONS_IGNORED = join(PREDEFINE_NAMESPACES, ',');
process.env.PREDEFINE_RELATIONS = stringify(PREDEFINE_RELATIONS);
