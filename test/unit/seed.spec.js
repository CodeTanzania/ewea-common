import {
  MODEL_NAME_PARTY,
  MODEL_NAME_PREDEFINE,
  PREDEFINE_NAMESPACES,
  PREDEFINE_RELATIONS,
  PREDEFINE_NAMESPACE_ADMINISTRATIVELEVEL,
  PREDEFINE_NAMESPACE_EVENTLEVEL,
  PREDEFINE_NAMESPACE_ADMINISTRATIVEAREA,
} from '@codetanzania/ewea-internals';
import { expect, fake } from '@lykmapipo/test-helpers';
import { getStrings, getObject } from '@lykmapipo/env';
import {
  pathFor,
  processCsvSeed,
  dataPathFor,
  seedPathFor,
  csvPathFor,
  shapeFilePathFor,
  geoJsonPathFor,
  jsonPathFor,
  transformSeedKeys,
  transformGeoFields,
  applyTransformsOn,
  transformToPredefineSeed,
  transformToEventSeed,
  transformToVehicleDispatchSeed,
  transformToCaseSeed,
  seedFromCsv,
  seedFromJson,
  seedFromSeeds,
} from '../../src';

describe('process csv file', () => {
  it('should call done with error if throw is true', () => {
    const done = fake();
    const error = new Error();
    processCsvSeed({ throws: true }, done)(error, {});
    expect(error).to.exist;
    expect(done).to.have.been.calledWith(error);
  });

  it('should not call done with error if throw is false', () => {
    const done = fake();
    const error = new Error();
    processCsvSeed({ throws: false }, done)(error, {});
    expect(error).to.exist;
    expect(done).to.have.not.been.calledWith(error);
  });

  it('should not call done if finished is false', () => {
    const done = fake();
    const error = undefined;
    processCsvSeed({ throws: false }, done)(error, { finished: false });
    expect(error).to.not.exist;
    expect(done).to.have.not.been.called;
  });

  it('should call on model seed function when next is true', () => {
    const Model = {};
    const done = fake();
    const next = true;
    const error = undefined;
    const data = {
      strings: {
        description: { en: 'Ward', sw: 'Ward' },
        name: { en: 'Ward', sw: 'Ward' },
      },
    };
    Model.seed = fake();

    processCsvSeed({ Model, throws: false }, done)(error, {
      feature: {},
    });
    Model.seed(data, next);
    expect(Model.seed).to.be.calledOnce;
    expect(Model.seed).to.have.been.calledWith(data, next);
  });

  it('should not call model seed function next is false', () => {
    const Model = {};
    const done = fake();
    const error = undefined;
    Model.seed = fake();

    processCsvSeed({ Model, throws: false }, done)(error, {
      next: false,
    });
    expect(Model.seed).to.have.not.been.called;
  });
});

describe('seed from csv', () => {
  it('should call done if model does not exist', () => {
    const done = fake();
    const option = { modelName: undefined };
    seedFromCsv(option, done);
    expect(done).to.have.been.called;
  });
});

describe('seed from json', () => {
  it('should call done if model does not exist', () => {
    const done = fake();
    const option = { modelName: undefined };
    seedFromJson(option, done);
    expect(done).to.have.been.called;
  });
});

describe('seed from seeds', () => {
  it('should call done if model does not exist', () => {
    const done = fake();
    const option = {};
    seedFromSeeds(option, done);
    expect(done).to.have.been.called;
  });

  it('should call done with error and result if throws is true', () => {
    const error = new Error();
    const Model = { modelName: 'TEST' };
    const results = {};
    const done = fake();
    Model.seed = fake();

    Model.seed({ throws: true }, done(error, results));
    expect(error).to.exist;
    expect(done).to.have.been.calledWith(error, results);
  });

  it('should call done with result if throws is false', () => {
    const error = null;
    const Model = { modelName: 'TEST' };
    const results = {};
    const done = fake();
    Model.seed = fake();

    Model.seed({ throws: false }, done(error, results));
    expect(error).to.not.exist;
    expect(done).to.have.been.calledWith(null, results);
  });
});

describe.only('common', () => {
  const { BASE_PATH, DATA_PATH, SEED_PATH } = process.env;

  before(() => {
    process.env.BASE_PATH = process.cwd();
    process.env.DATA_PATH = 'data';
    process.env.SEED_PATH = 'seeds';
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
      `${process.cwd()}/data/events.json`
    );
  });

  it('should transform seed keys', () => {
    expect(transformSeedKeys({ FID: 1, Name: 'Two' })).to.be.eql({
      fid: 1,
      name: 'Two',
    });
    expect(transformSeedKeys({ 'FID ': 1, Name: 'Two' })).to.be.eql({
      fid: 1,
      name: 'Two',
    });
    expect(transformSeedKeys({ FID: 1, 'Name En': 'Two' })).to.be.eql({
      fid: 1,
      'name.en': 'Two',
    });
  });

  it('should transform seed longitude,latitude geo fields', () => {
    const seed = transformGeoFields({ longitude: 1, latitude: 2 });
    expect(seed).to.exist;
    expect(seed.point).to.exist;
    expect(seed.point.type).to.be.equal('Point');
    expect(seed.point.coordinates).to.be.an('array');
  });

  it('should transform seed location geo fields', () => {
    const seed = transformGeoFields({ location: '1,2' });
    expect(seed).to.exist;
    expect(seed.location).to.exist;
    expect(seed.location.type).to.be.equal('Point');
    expect(seed.location.coordinates).to.be.an('array');
  });

  it('should transform seed centroid geo fields', () => {
    const seed = transformGeoFields({ centroid: '1,2' });
    expect(seed).to.exist;
    expect(seed.centroid).to.exist;
    expect(seed.centroid.type).to.be.equal('Point');
    expect(seed.centroid.coordinates).to.be.an('array');
  });

  it('should transform seed point geo fields', () => {
    const seed = transformGeoFields({ point: '1,2' });
    expect(seed).to.exist;
    expect(seed.point).to.exist;
    expect(seed.point.type).to.be.equal('Point');
    expect(seed.point.coordinates).to.be.an('array');
  });

  it('should transform seed circle geo fields', () => {
    const seed = transformGeoFields({ circle: '1,2 3' });
    expect(seed).to.exist;
    expect(seed.polygon).to.exist;
    expect(seed.polygon.type).to.be.equal('Polygon');
    expect(seed.polygon.coordinates).to.be.an('array');
  });

  it('should transform seed polygon geo fields', () => {
    const seed = transformGeoFields({ polygon: '1,2 1.3,2.3, 1.9,2.9 1,2' });
    expect(seed).to.exist;
    expect(seed.polygon).to.exist;
    expect(seed.polygon.type).to.be.equal('Polygon');
    expect(seed.polygon.coordinates).to.be.an('array');
  });

  it('should transform seed geometry geo fields', () => {
    const seed = transformGeoFields({ geometry: '1,2 1.3,2.3, 1.9,2.9 1,2' });
    expect(seed).to.exist;
    expect(seed.geometry).to.exist;
    expect(seed.geometry.type).to.be.equal('Polygon');
    expect(seed.geometry.coordinates).to.be.an('array');
  });

  it('should transform to predefine seed', () => {
    const data = {
      name: 'Two',
      description: 'Two',
      parent: 'One',
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
      populate: {
        'relations.parent': {
          model: MODEL_NAME_PREDEFINE,
          match: {
            'strings.name.en': { $in: [data.parent] },
            namespace: { $in: [...PREDEFINE_NAMESPACES] },
          },
          array: false,
          ignore: {},
        },
        'relations.group': {
          model: MODEL_NAME_PREDEFINE,
          match: {
            'strings.name.en': { $in: [data.group] },
            namespace: { $in: ['EventGroup'] },
          },
          array: false,
          ignore: {},
        },
        'relations.agencies': {
          model: MODEL_NAME_PARTY,
          match: { name: { $in: [data.agencies] } },
          array: true,
          ignore: {},
        },
      },
    });
  });

  it('should transform to administrative area seed', () => {
    const data = {
      namespace: PREDEFINE_NAMESPACE_ADMINISTRATIVEAREA,
      level: 'Town',
      name: 'Down Town',
      parent: 'Up Town',
    };
    const seed = transformToPredefineSeed(data);
    expect(seed).to.be.eql({
      namespace: PREDEFINE_NAMESPACE_ADMINISTRATIVEAREA,
      strings: {
        name: { en: 'Down Town', sw: 'Down Town' },
      },
      populate: {
        'relations.level': {
          model: MODEL_NAME_PREDEFINE,
          match: {
            'strings.name.en': { $in: [data.level] },
            namespace: {
              $in: [
                PREDEFINE_NAMESPACE_ADMINISTRATIVELEVEL,
                PREDEFINE_NAMESPACE_EVENTLEVEL,
              ],
            },
          },
          array: false,
          ignore: {},
        },
        'relations.parent': {
          model: MODEL_NAME_PREDEFINE,
          match: {
            'strings.name.en': { $in: [data.parent] },
            namespace: { $in: [...PREDEFINE_NAMESPACES] },
          },
          array: false,
          ignore: {
            model: MODEL_NAME_PREDEFINE,
            path: 'relations.level',
            match: {
              'strings.name.en': { $in: [data.level] },
              namespace: { $in: [PREDEFINE_NAMESPACE_ADMINISTRATIVELEVEL] },
            },
            array: false,
          },
        },
      },
    });
  });

  it('should transform to event seed', () => {
    const data = {
      number: '2020-000022-TZ',
    };
    const s1 = transformToEventSeed(data);
    const s2 = transformToEventSeed(data);
    expect(s1).to.exist;
    expect(s2).to.exist;
    expect(s1._id).to.be.eql(s2._id);
  });

  it('should transform to vehicle dispatch seed', () => {
    const data = {
      number: '2020-000022-TZ',
    };
    const s1 = transformToVehicleDispatchSeed(data);
    const s2 = transformToVehicleDispatchSeed(data);
    expect(s1).to.exist;
    expect(s2).to.exist;
    expect(s1._id).to.be.eql(s2._id);
  });

  it('should transform to case seed', () => {
    const data = {
      number: '2020-O5-0001-TZ',
    };
    const s1 = transformToCaseSeed(data);
    const s2 = transformToCaseSeed(data);
    expect(s1).to.exist;
    expect(s2).to.exist;
    expect(s1._id).to.be.eql(s2._id);
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
    process.env.SEED_PATH = SEED_PATH;
  });
});
