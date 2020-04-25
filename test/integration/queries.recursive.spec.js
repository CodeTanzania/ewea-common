import {
  PREDEFINE_NAMESPACE_ADMINISTRATIVELEVEL,
  PREDEFINE_NAMESPACE_ADMINISTRATIVEAREA,
} from '@codetanzania/ewea-internals';
import { idOf } from '@lykmapipo/common';
import { expect, clear, create } from '@lykmapipo/mongoose-test-helpers';
import { Predefine } from '@lykmapipo/predefine';
import {
  findAdministrativeLevelChildren,
  findAdministrativeLevelParents,
  findAdministrativeAreaChildren,
  findAdministrativeAreaParents,
} from '../../src';

describe('recursive queries', () => {
  const l1 = Predefine.fakeAdministrativeLevel();
  const l2 = Predefine.fakeAdministrativeLevel();
  l2.set({ relations: { parent: l1 } });

  const a1 = Predefine.fakeAdministrativeArea();
  const a2 = Predefine.fakeAdministrativeArea();
  a2.set({ relations: { parent: a1 } });

  before((done) => clear(done));
  before((done) => create(l1, a1, done));
  before((done) => create(l2, a2, done));

  it('should find administrative level children recursively', (done) => {
    findAdministrativeLevelChildren({ _id: idOf(l1) }, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist.and.to.have.length(2);
      expect(idOf(found[0])).to.be.eql(idOf(l1));
      expect(idOf(found[1])).to.be.eql(idOf(l2));
      expect(found[0].namespace).to.exist.and.to.be.eql(
        PREDEFINE_NAMESPACE_ADMINISTRATIVELEVEL
      );
      expect(found[1].namespace).to.exist.and.to.be.eql(
        PREDEFINE_NAMESPACE_ADMINISTRATIVELEVEL
      );
      done(error, found);
    });
  });

  it('should find administrative level parents recursively', (done) => {
    findAdministrativeLevelParents({ _id: idOf(l2) }, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist.and.to.have.length(2);
      expect(idOf(found[0])).to.be.eql(idOf(l2));
      expect(idOf(found[1])).to.be.eql(idOf(l1));
      expect(found[0].namespace).to.exist.and.to.be.eql(
        PREDEFINE_NAMESPACE_ADMINISTRATIVELEVEL
      );
      expect(found[1].namespace).to.exist.and.to.be.eql(
        PREDEFINE_NAMESPACE_ADMINISTRATIVELEVEL
      );
      done(error, found);
    });
  });

  it('should find administrative area children recursively', (done) => {
    findAdministrativeAreaChildren({ _id: idOf(a1) }, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist.and.to.have.length(2);
      expect(idOf(found[0])).to.be.eql(idOf(a1));
      expect(idOf(found[1])).to.be.eql(idOf(a2));
      expect(found[0].namespace).to.exist.and.to.be.eql(
        PREDEFINE_NAMESPACE_ADMINISTRATIVEAREA
      );
      expect(found[1].namespace).to.exist.and.to.be.eql(
        PREDEFINE_NAMESPACE_ADMINISTRATIVEAREA
      );
      done(error, found);
    });
  });

  it('should find administrative area parents recursively', (done) => {
    findAdministrativeAreaParents({ _id: idOf(a2) }, (error, found) => {
      expect(error).to.not.exist;
      expect(found).to.exist.and.to.have.length(2);
      expect(idOf(found[0])).to.be.eql(idOf(a2));
      expect(idOf(found[1])).to.be.eql(idOf(a1));
      expect(found[0].namespace).to.exist.and.to.be.eql(
        PREDEFINE_NAMESPACE_ADMINISTRATIVEAREA
      );
      expect(found[1].namespace).to.exist.and.to.be.eql(
        PREDEFINE_NAMESPACE_ADMINISTRATIVEAREA
      );
      done(error, found);
    });
  });

  after((done) => clear(done));
});
