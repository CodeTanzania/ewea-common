import { waterfall } from 'async';
import {
  connect as connectToDatabase,
  syncIndexes as ensureIndexes,
} from '@lykmapipo/mongoose-common';
import { isTest } from '@lykmapipo/env';
import { createModels } from '@lykmapipo/file';

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
export const connect = (done) => {
  return connectToDatabase((error) => {
    if (!error && !isTest()) {
      createModels();
    }
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
export const syncIndexes = (done) => waterfall([connect, ensureIndexes], done);
