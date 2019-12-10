import { expect } from '@lykmapipo/test-helpers';
import { getStrings } from '@lykmapipo/env';
import { PREDEFINE_NAMESPACES } from '../../src';

describe('common', () => {
  it('should set predefine namespaces', () => {
    expect(process.env.PREDEFINE_NAMESPACES).to.exist.and.be.equal(
      'PartyRole,PartyGroup,EventCertainty,EventSeverity,EventStatus,EventUrgency,FeatureType,Feature,AdministrativeLevel,AdministrativeArea,EventGroup,EventType,EventFunction,EventAction,EventCatalogue,EventIndicator,EventQuestion,Unit'
    );
    expect(getStrings('PREDEFINE_NAMESPACES')).to.be.eql(PREDEFINE_NAMESPACES);
  });

  it('should set predefine ignored relations', () => {
    expect(process.env.PREDEFINE_RELATIONS_IGNORED).to.exist.and.be.equal(
      'PartyRole,PartyGroup,EventCertainty,EventSeverity,EventStatus,EventUrgency,FeatureType,Feature,AdministrativeLevel,AdministrativeArea,EventGroup,EventType,EventFunction,EventAction,EventCatalogue,EventIndicator,EventQuestion,Unit'
    );
    expect(getStrings('PREDEFINE_RELATIONS_IGNORED')).to.be.eql(
      PREDEFINE_NAMESPACES
    );
  });
});
