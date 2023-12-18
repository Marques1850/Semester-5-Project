import { when, mock, instance, verify } from 'ts-mockito';
import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { expect } from 'chai';
import { Building } from "./../../../src/domain/building";
import { UniqueEntityID } from "./../../../src/core/domain/UniqueEntityID";
import { BuildingCode } from '../../../src/domain/buildingcode';

describe('Building', () => {
  const buildingProps = {
    code:BuildingCode.create({code:'B001'}).getValue() ,
    name: 'Building 1',
    description: 'A building',
    width: 10,
    length: 20
  };

  it('should create a building with valid properties', () => {
    const buildingOrError = Building.create(buildingProps, new UniqueEntityID());
    expect(buildingOrError.isSuccess).to.be.true;
    const building = buildingOrError.getValue();
   
    expect(building.code).to.equal(buildingProps.code.code);
    expect(building.name).to.equal(buildingProps.name);
    expect(building.description).to.equal(buildingProps.description);
    expect(building.width).to.equal(buildingProps.width);
    expect(building.length).to.equal(buildingProps.length);
  });

  it('should fail to create a building with invalid properties', () => {
    const invalidBuildingProps = {
      code: BuildingCode.create({code:''}).errorValue(),
      name: '',
      description: '',
      width: -1,
      length: -1
    };

    const buildingOrError = Building.create(invalidBuildingProps, new UniqueEntityID());

    expect(buildingOrError.isFailure).to.be.true;
   
  });

  it('should fail to create a building with invalid name', () => {
    const invalidBuildingProps = {
      ...buildingProps,
      name: ''
    };
  
    const buildingOrError = Building.create(invalidBuildingProps, new UniqueEntityID());

    expect(buildingOrError.isFailure).to.be.true;
    expect(buildingOrError.error).to.equal('Name must be between 1 and 50 characters.');
  });

  it('should fail to create a building with invalid description', () => {
    const invalidBuildingProps = {
      ...buildingProps,
      description: ''
    };

    const buildingOrError = Building.create(invalidBuildingProps, new UniqueEntityID());

    expect(buildingOrError.isFailure).to.be.true;
    expect(buildingOrError.error).to.equal('Description must be between 1 and 250 characters.');
  });

});