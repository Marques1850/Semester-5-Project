import { Passage } from './../../../src/domain/passage';
import { PassageId } from './../../../src/domain/passageId';
import { UniqueEntityID } from './../../../src/core/domain/UniqueEntityID';
import { expect } from 'chai';
import { PassageCode } from '../../../src/domain/passagecode';

describe('Passage', () => {
  const passageProps = {
    codigo:PassageCode.create({code:'123'}).getValue(),
    codeBuilding1: 'A',
    codeBuilding2: 'B',
    FloorBuilding1Name: 'First Floor',
    FloorBuilding2Name: 'Second Floor'
  };

  it('should create a passage', () => {
    const passageOrError = Passage.create(passageProps);

    expect(passageOrError.isSuccess).to.be.true;

    const passage = passageOrError.getValue();

    expect(passage.codigo).to.equal(passageProps.codigo);
    expect(passage.codeBuilding1).to.equal(passageProps.codeBuilding1);
    expect(passage.codeBuilding2).to.equal(passageProps.codeBuilding2);
    expect(passage.FloorBuilding1Name).to.equal(passageProps.FloorBuilding1Name);
    expect(passage.FloorBuilding2Name).to.equal(passageProps.FloorBuilding2Name);
  });

  it('should fail to create a passage with undefined codeBuilding1', () => {
    const invalidPassageProps = {
      codigo:PassageCode.create({code:'123'}).getValue(),
      codeBuilding1: undefined as any,
      codeBuilding2: 'B',
      FloorBuilding1Name: 'First Floor',
      FloorBuilding2Name: 'Second Floor'
    };

    const passageOrError = Passage.create(invalidPassageProps);

    expect(passageOrError.isFailure).to.be.true;
    expect(passageOrError.error).to.include('codeBuilding1');
  });

  it('should fail to create a passage with undefined codeBuilding2', () => {
    const invalidPassageProps = {
      codigo:PassageCode.create({code:'123'}).getValue(),
      codeBuilding1: 'A',
      codeBuilding2: undefined as any,
      FloorBuilding1Name: 'First Floor',
      FloorBuilding2Name: 'Second Floor'
    };

    const passageOrError = Passage.create(invalidPassageProps);

    expect(passageOrError.isFailure).to.be.true;
    expect(passageOrError.error).to.include('codeBuilding2');
  });

  it('should fail to create a passage with undefined FloorBuilding1Name', () => {
    const invalidPassageProps = {
      codigo:PassageCode.create({code:'123'}).getValue(),
      codeBuilding1: 'A',
      codeBuilding2: 'B',
      FloorBuilding1Name: undefined as any,
      FloorBuilding2Name: 'Second Floor'
    };

    const passageOrError = Passage.create(invalidPassageProps);

    expect(passageOrError.isFailure).to.be.true;
    expect(passageOrError.error).to.include('FoorBuilding1Name');
  });
  
  it('should fail to create a passage with undefined FloorBuilding2Name', () => {
    const invalidPassageProps = {
      codigo:PassageCode.create({code:'123'}).getValue(),
      codeBuilding1: 'A',
      codeBuilding2: 'B',
      FloorBuilding1Name: 'First Floor',
      FloorBuilding2Name: undefined as any
    };

    const passageOrError = Passage.create(invalidPassageProps);

    expect(passageOrError.isFailure).to.be.true;
    expect(passageOrError.error).to.include('FoorBuilding2Name');
  });

  it('should fail to create a passage with null codeBuilding1', () => {
    const invalidPassageProps = {
      codigo:PassageCode.create({code:'123'}).getValue(),
      codeBuilding1: null as any,
      codeBuilding2: 'B',
      FloorBuilding1Name: 'First Floor',
      FloorBuilding2Name: 'Second Floor'
    };

    const passageOrError = Passage.create(invalidPassageProps);

    expect(passageOrError.isFailure).to.be.true;
    expect(passageOrError.error).to.include('codeBuilding1');
  });

  it('should fail to create a passage with null codeBuilding2', () => {
    const invalidPassageProps = {
      codigo:PassageCode.create({code:'123'}).getValue(),
      codeBuilding1: 'A',
      codeBuilding2: null as any,
      FloorBuilding1Name: 'First Floor',
      FloorBuilding2Name: 'Second Floor'
    };

    const passageOrError = Passage.create(invalidPassageProps);

    expect(passageOrError.isFailure).to.be.true;
    expect(passageOrError.error).to.include('codeBuilding2');
  });

  it('should fail to create a passage with null FloorBuilding1Name', () => {
    const invalidPassageProps = {
      codigo:PassageCode.create({code:'123'}).getValue(),
      codeBuilding1: 'A',
      codeBuilding2: 'B',
      FloorBuilding1Name: null as any,
      FloorBuilding2Name: 'Second Floor'
    };

    const passageOrError = Passage.create(invalidPassageProps);

    expect(passageOrError.isFailure).to.be.true;
    expect(passageOrError.error).to.include('FoorBuilding1Name');
  });

  it('should fail to create a passage with null FloorBuilding2Name', () => {
    const invalidPassageProps = {
      codigo:PassageCode.create({code:'123'}).getValue(),
      codeBuilding1: 'A',
      codeBuilding2: 'B',
      FloorBuilding1Name: 'First Floor',
      FloorBuilding2Name: null as any
    };

    const passageOrError = Passage.create(invalidPassageProps);

    expect(passageOrError.isFailure).to.be.true;
    expect(passageOrError.error).to.include('FoorBuilding2Name');
  });

  it('get codeBuilding1', () => {
    const passageOrError = Passage.create(passageProps);

    expect(passageOrError.isSuccess).to.be.true;

    const codeBuilding1 = passageOrError.getValue().codeBuilding1;

    expect(codeBuilding1).to.equal(passageProps.codeBuilding1);
  });

  it('get codeBuilding2', () => {
    const passageOrError = Passage.create(passageProps);

    expect(passageOrError.isSuccess).to.be.true;

    const codeBuilding2 = passageOrError.getValue().codeBuilding2;

    expect(codeBuilding2).to.equal(passageProps.codeBuilding2);
  });

  it('get codeBuilding1', () => {
    const passageOrError = Passage.create(passageProps);

    expect(passageOrError.isSuccess).to.be.true;

    const FloorBuilding1Name = passageOrError.getValue().FloorBuilding1Name;

    expect(FloorBuilding1Name).to.equal(passageProps.FloorBuilding1Name);
  });

  it('get codeBuilding2', () => {
    const passageOrError = Passage.create(passageProps);

    expect(passageOrError.isSuccess).to.be.true;

    const FloorBuilding2Name = passageOrError.getValue().FloorBuilding2Name;

    expect(FloorBuilding2Name).to.equal(passageProps.FloorBuilding2Name);
  });

});