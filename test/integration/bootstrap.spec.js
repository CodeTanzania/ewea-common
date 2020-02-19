import { clear, drop } from '@lykmapipo/mongoose-test-helpers';
import { connect } from '../../src';

before(done => connect(done));

before(done => clear(done));

after(done => drop(done));
