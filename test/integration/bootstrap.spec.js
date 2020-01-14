import '@codetanzania/ewea-internals';
import { clear, drop } from '@lykmapipo/mongoose-test-helpers';
import { connect } from '../../src';

process.env.NODE_ENV = 'test';
process.env.DEFAULT_LOCALE = 'en';
process.env.LOCALES = 'en,sw';

before(done => connect(done));

before(done => clear(done));

after(done => drop(done));
