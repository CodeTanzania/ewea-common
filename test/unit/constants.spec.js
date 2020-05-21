import {
  MODEL_NAME_PARTY,
  MODEL_NAME_PREDEFINE,
  PREDEFINE_NAMESPACE_UNIT,
  PREDEFINE_UNIT_NAME,
} from '@codetanzania/ewea-internals';
import { expect } from '@lykmapipo/test-helpers';
import {
  DEFAULT_PREDEFINE_NAME,
  DEFAULT_PREDEFINE_COLOR,
  DEFAULT_PREDEFINE_WEIGHT,
  DEFAULT_PREDEFINE_RELATION,
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
  DEFAULT_EVENT_NUMBER,
  DEFAULT_NAMES,
  objectIdFor,
  DEFAULT_SEEDS_IGNORE,
  DEFAULT_SEEDS,
} from '../../src';

describe('constants', () => {
  it('should expose default predefine relation', () => {
    expect(DEFAULT_PREDEFINE_NAME).to.be.equal('Unknown');
    expect(DEFAULT_PREDEFINE_COLOR).to.be.equal('#6D9EEB');
    expect(DEFAULT_PREDEFINE_WEIGHT).to.be.equal(1000);
    expect(DEFAULT_PREDEFINE_RELATION).to.be.eql({
      _id: null,
      strings: {
        name: { en: 'Unknown', sw: 'Unknown' },
        abbreviation: { en: 'U', sw: 'U' },
        color: '#6D9EEB',
      },
      numbers: { weight: 1000 },
    });
  });

  it('should expose defaults', () => {
    expect(DEFAULT_UNIT_NAME).to.be.equal('Unknown');
    expect(DEFAULT_ADMINISTRATIVELEVEL_NAME).to.be.equal('Unknown');
    expect(DEFAULT_FEATURETYPE_NAME).to.be.equal('Unknown');
    expect(DEFAULT_EVENTINDICATOR_NAME).to.be.equal('Unknown');
    expect(DEFAULT_EVENTTOPIC_NAME).to.be.equal('Unknown');
    expect(DEFAULT_EVENTLEVEL_NAME).to.be.equal('White');
    expect(DEFAULT_EVENTSEVERITY_NAME).to.be.equal('Unknown');
    expect(DEFAULT_EVENTCERTAINTY_NAME).to.be.equal('Unknown');
    expect(DEFAULT_EVENTSTATUS_NAME).to.be.equal('Actual');
    expect(DEFAULT_EVENTURGENCY_NAME).to.be.equal('Unknown');
    expect(DEFAULT_EVENTRESPONSE_NAME).to.be.equal('None');
    expect(DEFAULT_PARTYGROUP_NAME).to.be.equal('Unknown');
    expect(DEFAULT_PARTYROLE_NAME).to.be.equal('Unknown');
    expect(DEFAULT_EVENTGROUP_NAME).to.be.equal('Unknown');
    expect(DEFAULT_EVENTTYPE_NAME).to.be.equal('Unknown');
    expect(DEFAULT_EVENTFUNCTION_NAME).to.be.equal('Unknown');
    expect(DEFAULT_EVENTACTION_NAME).to.be.equal('Unknown');
    expect(DEFAULT_EVENTQUESTION_NAME).to.be.equal('Unknown');
    expect(DEFAULT_ADMINISTRATIVEAREA_NAME).to.be.equal('Unknown');
    expect(DEFAULT_EVENT_NUMBER).to.be.undefined;
    expect(DEFAULT_NAMES).to.be.exist.and.be.an('array');
  });

  it('should generate defult objectid for models', () => {
    const oid1 = objectIdFor(MODEL_NAME_PARTY);
    const oid2 = objectIdFor(MODEL_NAME_PARTY);
    expect(oid1).to.exist;
    expect(oid2).to.exist;
    expect(oid1).to.be.eql(oid2);

    const oid3 = objectIdFor(MODEL_NAME_PREDEFINE);
    const oid4 = objectIdFor(MODEL_NAME_PREDEFINE);
    expect(oid3).to.exist;
    expect(oid4).to.exist;
    expect(oid3).to.be.eql(oid4);

    const oid5 = objectIdFor(MODEL_NAME_PREDEFINE, PREDEFINE_NAMESPACE_UNIT);
    const oid6 = objectIdFor(MODEL_NAME_PREDEFINE, PREDEFINE_NAMESPACE_UNIT);
    expect(oid5).to.exist;
    expect(oid6).to.exist;
    expect(oid5).to.be.eql(oid6);

    const oid7 = objectIdFor(
      MODEL_NAME_PREDEFINE,
      PREDEFINE_NAMESPACE_UNIT,
      PREDEFINE_UNIT_NAME
    );
    const oid8 = objectIdFor(
      MODEL_NAME_PREDEFINE,
      PREDEFINE_NAMESPACE_UNIT,
      PREDEFINE_UNIT_NAME
    );
    expect(oid7).to.exist;
    expect(oid8).to.exist;
    expect(oid7).to.be.eql(oid8);
  });

  it('should ignore namespace from default seed', () => {
    expect(DEFAULT_SEEDS_IGNORE).to.be.eql([
      'FeatureType',
      'EventIndicator',
      'EventTopic',
      'Vehicle',
      'EventFunction',
      'EventAction',
      'EventQuestion',
      'Feature',
      'EventActionCatalogue',
      'NotificationTemplate',
    ]);
  });

  it('should provide default namespace seeds', () => {
    expect(DEFAULT_SEEDS).to.exist;
    expect(DEFAULT_SEEDS).to.not.include.keys(...DEFAULT_SEEDS_IGNORE);
  });
});
