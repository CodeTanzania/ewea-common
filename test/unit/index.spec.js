import {
  PREDEFINE_NAMESPACES,
  PREDEFINE_RELATIONS,
} from '@codetanzania/ewea-internals';
import { expect } from '@lykmapipo/test-helpers';
import { getStrings, getObject } from '@lykmapipo/env';
import {
  pathFor,
  dataPathFor,
  seedPathFor,
  csvPathFor,
  shapeFilePathFor,
  geoJsonPathFor,
  jsonPathFor,
  transformSeedKeys,
  applyTransformsOn,
  transformToPredefineSeed,
} from '../../src';

describe('common', () => {
  const { BASE_PATH, DATA_PATH } = process.env;

  before(() => {
    process.env.BASE_PATH = process.cwd();
    process.env.DATA_PATH = 'data';
  });

  it('should set predefine namespaces', () => {
    expect(process.env.PREDEFINE_NAMESPACES).to.exist;
    expect(getStrings('PREDEFINE_NAMESPACES')).to.be.eql(PREDEFINE_NAMESPACES);
  });

  it('should set predefine ignored relations', () => {
    expect(process.env.PREDEFINE_RELATIONS_IGNORED).to.exist;
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

  it('should transform to predefine seed', () => {
    const data = {
      name: 'Two',
      description: 'Two',
      group: 'Meteorological',
      agencies: 'Roads Agency',
      area: '',
    };
    const seed = transformToPredefineSeed(data);
    expect(seed).to.be.eql({
      strings: {
        name: { en: 'Two', sw: 'Two' },
        description: { en: 'Two', sw: 'Two' },
      },
      numbers: {},
      booleans: {},
      dates: {},
      populate: {
        'relations.group': {
          model: 'Predefine',
          match: { 'strings.name.en': { $in: [data.group] } },
          array: false,
        },
        'relations.agencies': {
          model: 'Party',
          match: { name: { $in: [data.agencies] } },
          array: true,
        },
      },
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

  after(() => {
    process.env.BASE_PATH = BASE_PATH;
    process.env.DATA_PATH = DATA_PATH;
  });
});
