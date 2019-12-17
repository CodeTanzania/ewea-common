import { expect } from '@lykmapipo/test-helpers';
import { getStrings, getObject } from '@lykmapipo/env';
import {
  PREDEFINE_NAMESPACES,
  PREDEFINE_RELATIONS,
  pathFor,
  dataPathFor,
  seedPathFor,
  csvPathFor,
  shapeFilePathFor,
  geoJsonPathFor,
  jsonPathFor,
  transformSeedKeys,
  applyTransformsOn,
} from '../../src';

describe('common', () => {
  it('should set predefine namespaces', () => {
    expect(process.env.PREDEFINE_NAMESPACES).to.exist.and.be.equal(
      'PartyRole,PartyGroup,EventCertainty,EventSeverity,EventStatus,EventUrgency,FeatureType,Feature,AdministrativeLevel,AdministrativeArea,EventGroup,EventType,EventFunction,EventAction,EventCatalogue,EventIndicator,EventQuestion,Unit,NotificationTemplate'
    );
    expect(getStrings('PREDEFINE_NAMESPACES')).to.be.eql(PREDEFINE_NAMESPACES);
  });

  it('should set predefine ignored relations', () => {
    expect(process.env.PREDEFINE_RELATIONS_IGNORED).to.exist.and.be.equal(
      'PartyRole,PartyGroup,EventCertainty,EventSeverity,EventStatus,EventUrgency,FeatureType,Feature,AdministrativeLevel,AdministrativeArea,EventGroup,EventType,EventFunction,EventAction,EventCatalogue,EventIndicator,EventQuestion,Unit,NotificationTemplate'
    );
    expect(getStrings('PREDEFINE_RELATIONS_IGNORED')).to.be.eql(
      PREDEFINE_NAMESPACES
    );
  });

  it('should set predefine relations', () => {
    expect(process.env.PREDEFINE_RELATIONS).to.exist;
    expect(getObject('PREDEFINE_RELATIONS')).to.eql(PREDEFINE_RELATIONS);
  });

  it('should derive data and seed paths', () => {
    expect(pathFor()).to.exist.and.be.equal(process.cwd());
    expect(pathFor('data')).to.exist.and.be.equal(`${process.cwd()}/data`);
    expect(pathFor('seeds')).to.exist.and.be.equal(`${process.cwd()}/seeds`);

    expect(dataPathFor('events')).to.exist.and.be.equal(
      `${process.cwd()}/data/events`
    );

    expect(seedPathFor('events')).to.exist.and.be.equal(
      `${process.cwd()}/seeds/events`
    );

    expect(csvPathFor('Event')).to.exist.and.be.equal(
      `${process.cwd()}/data/events.csv`
    );

    expect(shapeFilePathFor('Event')).to.exist.and.be.equal(
      `${process.cwd()}/data/events.shp`
    );

    expect(geoJsonPathFor('Event')).to.exist.and.be.equal(
      `${process.cwd()}/data/events.geojson`
    );

    expect(jsonPathFor('Event')).to.exist.and.be.equal(
      `${process.cwd()}/data/events`
    );
  });

  it('should transform seed keys', () => {
    expect(transformSeedKeys({ FID: 1, Name: 'Two' })).to.be.eql({
      fid: 1,
      name: 'Two',
    });
    expect(transformSeedKeys({ FID: 1, 'Name En': 'Two' })).to.be.eql({
      fid: 1,
      'name.en': 'Two',
    });
  });

  it('should apply transforms', () => {
    expect(applyTransformsOn({ FID: 1, Name: 'Two' })).to.be.eql({
      fid: 1,
      name: 'Two',
    });
    expect(applyTransformsOn({ FID: 1, 'Name En': 'Two' })).to.be.eql({
      fid: 1,
      'name.en': 'Two',
    });
  });
});
