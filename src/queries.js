import { PARTY_RELATIONS } from '@codetanzania/ewea-internals';
import { isEmpty, forEach, filter, find, first } from 'lodash';
import { waterfall } from 'async';
import { compact, arrayToObject } from '@lykmapipo/common';
import { localizedKeysFor } from 'mongoose-locale-schema';
import { Predefine } from '@lykmapipo/predefine';
import { DEFAULT_NAMES, DEFAULT_PATHS } from './constants';

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
export const findDefaultPredefines = (done) => {
  // TODO: Party, Event, ChangeLog defaults

  // prepare criterias
  const namePaths = localizedKeysFor('strings.name');
  const nameCriteria = isEmpty(DEFAULT_NAMES)
    ? undefined
    : arrayToObject(namePaths, (/* object, path */) => {
        return { $in: DEFAULT_NAMES };
      });
  const defaultCriteria = { 'booleans.default': true };

  // prepare query options
  const criteria = { $or: compact([defaultCriteria, nameCriteria]) };
  const projection = null; // TODO: support projections
  const options = { autopopulate: false };

  // fetch defaults
  const fetchDefaults = (next) => {
    return Predefine.find(criteria, projection, options, next);
  };

  // transform defaults to map
  const transformDefaults = (defaults, next) => {
    // transform to object
    const results = { predefines: defaults };
    forEach(DEFAULT_PATHS, ({ namespace, array = false }, key) => {
      // find defaults per namespace
      const predefines = compact([].concat(filter(defaults, { namespace })));

      // collect array of defaults
      if (array) {
        results[key] = predefines;
      }
      // collect single default
      else {
        results[key] =
          find(predefines, { 'booleans.default': true }) || first(predefines);
      }
    });

    // return defaults
    return next(null, results);
  };

  // execute
  const tasks = [fetchDefaults, transformDefaults];
  return waterfall(tasks, done);
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
export const findPartyDefaults = (done) => {
  // find default predefines
  return findDefaultPredefines((error, { predefines }) => {
    if (error) {
      return done(error);
    }

    // derive party defaults
    const results = {};
    forEach(PARTY_RELATIONS, ({ namespace }, key) => {
      results[key] = find(predefines, { namespace });
    });
    return done(null, results);
  });
};

export const findEventDefaults = (done) => {
  return done();
};

export const findChangelogDefaults = (done) => {
  return done();
};

export const preloadRelated = (predefine, done) => {
  return done();
};

export const preloadPartyRelated = (party, done) => {
  return done();
};

export const preloadEventRelated = (event, done) => {
  return done();
};

export const preloadChangelogRelated = (changelog, done) => {
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
export const findAdministrativeLevelChildren = (criteria, done) => {
  return Predefine.findAdministrativeLevelChildren(criteria, done);
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
export const findAdministrativeLevelParents = (criteria, done) => {
  return Predefine.findAdministrativeLevelParents(criteria, done);
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
export const findAdministrativeAreaChildren = (criteria, done) => {
  return Predefine.findAdministrativeAreaChildren(criteria, done);
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
export const findAdministrativeAreaParents = (criteria, done) => {
  return Predefine.findAdministrativeAreaParents(criteria, done);
};
