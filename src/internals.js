import { join, stringify } from '@lykmapipo/common';

// namespaces
// order: mostly dependent -> less dependent
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
  'NotificationTemplate',
];

// relations
export const PREDEFINE_RELATIONS = {
  permissions: { ref: 'Permission', array: true },
  roles: { ref: 'Predefine', namespace: 'PartyRole', array: true },
  groups: { ref: 'Predefine', namespace: 'PartyGroup', array: true },
  group: { ref: 'Predefine', namespace: 'EventGroup' },
  type: { ref: 'Predefine', namespace: ['EventType', 'FeatureType'] },
  function: { ref: 'Predefine', namespace: 'EventFunction' },
  action: { ref: 'Predefine', namespace: 'EventAction' },
  level: { ref: 'Predefine', namespace: 'AdministrativeLevel' },
  area: { ref: 'Predefine', namespace: 'AdministrativeArea' },
  indicator: { ref: 'Predefine', namespace: 'EventIndicator' },
  unit: { ref: 'Predefine', namespace: 'Unit' },
  agencies: { ref: 'Party', array: true },
  focals: { ref: 'Party', array: true },
  custodians: { ref: 'Party', array: true },
};

// setup
process.env.PREDEFINE_NAMESPACES = join(PREDEFINE_NAMESPACES, ',');
process.env.PREDEFINE_RELATIONS_IGNORED = join(PREDEFINE_NAMESPACES, ',');
process.env.PREDEFINE_RELATIONS = stringify(PREDEFINE_RELATIONS);
