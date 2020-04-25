import { map } from 'lodash';
import { areSameInstance } from '@lykmapipo/mongoose-common';
import { Predefine } from '@lykmapipo/predefine';
import {
  clear,
  create,
  expect,
  // enableDebug,
} from '@lykmapipo/mongoose-test-helpers';
import { findDefaultPredefines, findPartyDefaults } from '../../src';

describe('queries', () => {
  const unit = Predefine.fakeUnit();
  const group = Predefine.fakeEventGroup();
  const type = Predefine.fakeEventType();
  const level = Predefine.fakeEventLevel();
  const severity = Predefine.fakeEventSeverity();
  const certainty = Predefine.fakeEventCertainty();
  const status = Predefine.fakeEventStatus();
  const urgency = Predefine.fakeEventUrgency();
  const response = Predefine.fakeEventResponse();
  const area = Predefine.fakeAdministrativeArea();
  const template = Predefine.fakeNotificationTemplate();

  const role = Predefine.fakePartyRole();
  role.set({ strings: { name: { en: 'Unknown', sw: 'Unknown' } } });

  const partyGroup = Predefine.fakePartyGroup();
  partyGroup.set({ strings: { name: { en: 'Unknown', sw: 'Unknown' } } });

  const predefines = map(
    [
      unit,
      group,
      type,
      level,
      severity,
      certainty,
      status,
      urgency,
      response,
      area,
      template,
    ],
    (predefine) => {
      predefine.set({ booleans: { default: true } });
      return predefine;
    }
  );

  before((done) => clear(done));
  before((done) => create(...predefines, done));
  before((done) => create(role, partyGroup, done));

  it('should find default predefines', (done) => {
    findDefaultPredefines((error, defaults) => {
      expect(error).to.not.exist;
      expect(defaults).to.exist.and.be.an('object');
      expect(defaults.predefines).to.exist.and.be.an('array');

      expect(defaults.unit).to.exist;
      expect(areSameInstance(defaults.unit, unit)).to.be.true;

      expect(defaults.role).to.exist;
      expect(areSameInstance(defaults.role, role)).to.be.true;

      expect(defaults.group).to.exist;
      expect(areSameInstance(defaults.group, group)).to.be.true;

      expect(defaults.type).to.exist;
      expect(areSameInstance(defaults.type, type)).to.be.true;

      expect(defaults.level).to.exist;
      expect(areSameInstance(defaults.level, level)).to.be.true;

      expect(defaults.severity).to.exist;
      expect(areSameInstance(defaults.severity, severity)).to.be.true;

      expect(defaults.certainty).to.exist;
      expect(areSameInstance(defaults.certainty, certainty)).to.be.true;

      expect(defaults.status).to.exist;
      expect(areSameInstance(defaults.status, status)).to.be.true;

      expect(defaults.urgency).to.exist;
      expect(areSameInstance(defaults.urgency, urgency)).to.be.true;

      expect(defaults.areas).to.exist;
      expect(areSameInstance(defaults.areas[0], area)).to.be.true;

      expect(defaults.template).to.exist;
      expect(areSameInstance(defaults.template, template)).to.be.true;

      done(error, defaults);
    });
  });

  it('should find default predefines', (done) => {
    findPartyDefaults((error, defaults) => {
      expect(error).to.not.exist;
      expect(defaults).to.exist.and.be.an('object');

      expect(defaults.role).to.exist;
      expect(areSameInstance(defaults.role, role)).to.be.true;

      expect(defaults.area).to.exist;
      expect(areSameInstance(defaults.area, area)).to.be.true;

      expect(defaults.group).to.exist;
      expect(areSameInstance(defaults.group, partyGroup)).to.be.true;

      done(error, defaults);
    });
  });

  after((done) => clear(done));
});
