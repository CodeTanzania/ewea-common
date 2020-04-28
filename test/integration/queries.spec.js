import { map, pick } from 'lodash';
import { flat } from '@lykmapipo/common';
import { areSameInstance } from '@lykmapipo/mongoose-common';
import { Permission } from '@lykmapipo/permission';
import { Predefine } from '@lykmapipo/predefine';
import { Party } from '@codetanzania/emis-stakeholder';
import { clear, create, expect } from '@lykmapipo/mongoose-test-helpers';
import {
  findDefaultPredefines,
  findPartyDefaults,
  findPermissions,
  findPermission,
  findAdministrativeLevels,
  findAdministrativeLevel,
  findPartyRoles,
  findPartyRole,
  findPartyGroups,
  findPartyGroup,
  findAdministrativeAreas,
  findAdministrativeArea,
  findParties,
  findParty,
} from '../../src';

describe('queries', () => {
  const permission = Permission.fake();
  const party = Party.fake();
  const unit = Predefine.fakeUnit();
  const administrativeLevel = Predefine.fakeAdministrativeLevel();
  const group = Predefine.fakeEventGroup();
  const type = Predefine.fakeEventType();
  const level = Predefine.fakeEventLevel();
  const severity = Predefine.fakeEventSeverity();
  const certainty = Predefine.fakeEventCertainty();
  const status = Predefine.fakeEventStatus();
  const urgency = Predefine.fakeEventUrgency();
  const response = Predefine.fakeEventResponse();
  const administrativeArea = Predefine.fakeAdministrativeArea();
  const template = Predefine.fakeNotificationTemplate();

  const partyRole = Predefine.fakePartyRole();
  partyRole.set({ strings: { name: { en: 'Unknown', sw: 'Unknown' } } });

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
      administrativeArea,
      template,
    ],
    (predefine) => {
      predefine.set({ booleans: { default: true } });
      return predefine;
    }
  );

  before((done) => clear(done));
  before((done) => create(permission, administrativeLevel, party, done));
  before((done) => create(...predefines, done));
  before((done) => create(partyRole, partyGroup, done));

  it('should find default predefines', (done) => {
    findDefaultPredefines((error, defaults) => {
      expect(error).to.not.exist;
      expect(defaults).to.exist.and.be.an('object');
      expect(defaults.predefines).to.exist.and.be.an('array');

      expect(defaults.unit).to.exist;
      expect(areSameInstance(defaults.unit, unit)).to.be.true;

      expect(defaults.role).to.exist;
      expect(areSameInstance(defaults.role, partyRole)).to.be.true;

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
      expect(areSameInstance(defaults.areas[0], administrativeArea)).to.be.true;

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
      expect(areSameInstance(defaults.role, partyRole)).to.be.true;

      expect(defaults.area).to.exist;
      expect(areSameInstance(defaults.area, administrativeArea)).to.be.true;

      expect(defaults.group).to.exist;
      expect(areSameInstance(defaults.group, partyGroup)).to.be.true;

      done(error, defaults);
    });
  });

  // query shortcuts

  it('should find permissions', (done) => {
    findPermissions((error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      done(error, found);
    });
  });

  it('should find permission', (done) => {
    const criteria = flat(pick(permission, 'wildcard'));
    findPermission(criteria, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      done(error, found);
    });
  });

  it('should find administrative levels', (done) => {
    findAdministrativeLevels((error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      done(error, found);
    });
  });

  it('should find administrative level', (done) => {
    const criteria = flat(pick(administrativeLevel, 'strings.name.en'));
    findAdministrativeLevel(criteria, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      done(error, found);
    });
  });

  it('should find party roles', (done) => {
    findPartyRoles((error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      done(error, found);
    });
  });

  it('should find party role', (done) => {
    const criteria = flat(pick(partyRole, 'strings.name.en'));
    findPartyRole(criteria, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      done(error, found);
    });
  });

  it('should find party groups', (done) => {
    findPartyGroups((error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      done(error, found);
    });
  });

  it('should find party group', (done) => {
    const criteria = flat(pick(partyGroup, 'strings.name.en'));
    findPartyGroup(criteria, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      done(error, found);
    });
  });

  it('should find administrative areas', (done) => {
    findAdministrativeAreas((error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      done(error, found);
    });
  });

  it('should find administrative area', (done) => {
    const criteria = flat(pick(administrativeArea, 'strings.name.en'));
    findAdministrativeArea(criteria, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      done(error, found);
    });
  });

  it('should find parties', (done) => {
    findParties((error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      done(error, found);
    });
  });

  it('should find party', (done) => {
    const criteria = flat(pick(party, 'mobile'));
    findParty(criteria, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist;
      done(error, found);
    });
  });

  after((done) => clear(done));
});
