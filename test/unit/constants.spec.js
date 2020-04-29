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
} from '../../src';

describe('constants', () => {
  it('should expose default predefine relation', () => {
    expect(DEFAULT_PREDEFINE_NAME).to.be.equal('Unknown');
    expect(DEFAULT_PREDEFINE_COLOR).to.be.equal('#6D9EEB');
    expect(DEFAULT_PREDEFINE_WEIGHT).to.be.equal(Number.MAX_SAFE_INTEGER);
    expect(DEFAULT_PREDEFINE_RELATION).to.be.eql({
      _id: null,
      strings: {
        name: { en: 'Unknown', sw: 'Unknown' },
        abbreviation: { en: 'U', sw: 'U' },
        color: '#6D9EEB',
      },
      numbers: { weight: Number.MAX_SAFE_INTEGER },
    });
  });

  it('should expose defaults', () => {
    expect(DEFAULT_UNIT_NAME).to.be.undefined;
    expect(DEFAULT_ADMINISTRATIVELEVEL_NAME).to.be.undefined;
    expect(DEFAULT_FEATURETYPE_NAME).to.be.undefined;
    expect(DEFAULT_EVENTINDICATOR_NAME).to.be.undefined;
    expect(DEFAULT_EVENTTOPIC_NAME).to.be.undefined;
    expect(DEFAULT_EVENTLEVEL_NAME).to.exist;
    expect(DEFAULT_EVENTSEVERITY_NAME).to.be.exist;
    expect(DEFAULT_EVENTCERTAINTY_NAME).to.be.exist;
    expect(DEFAULT_EVENTSTATUS_NAME).to.be.exist;
    expect(DEFAULT_EVENTURGENCY_NAME).to.be.exist;
    expect(DEFAULT_EVENTRESPONSE_NAME).to.be.exist;
    expect(DEFAULT_PARTYGROUP_NAME).to.exist;
    expect(DEFAULT_PARTYROLE_NAME).to.exist;
    expect(DEFAULT_EVENTGROUP_NAME).to.be.undefined;
    expect(DEFAULT_EVENTTYPE_NAME).to.be.undefined;
    expect(DEFAULT_EVENTFUNCTION_NAME).to.be.undefined;
    expect(DEFAULT_EVENTACTION_NAME).to.be.undefined;
    expect(DEFAULT_EVENTQUESTION_NAME).to.be.undefined;
    expect(DEFAULT_ADMINISTRATIVEAREA_NAME).to.be.undefined;
    expect(DEFAULT_EVENT_NUMBER).to.be.undefined;
    expect(DEFAULT_NAMES).to.be.exist.and.be.an('array');
  });
});
