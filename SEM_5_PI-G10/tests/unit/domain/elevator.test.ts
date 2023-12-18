import { Elevator } from "../../../src/domain/elevator";
import { elevatorType } from "../../../src/domain/elevatorType";
import { when, mock, instance, verify } from 'ts-mockito';
import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { expect } from 'chai';
import { Building } from "./../../../src/domain/building";
import { UniqueEntityID } from "./../../../src/core/domain/UniqueEntityID";
describe('Elevator', () => {
  it('should create a valid elevator', () => {
    const props = {
      BuildingCode: 'B1',
      ElevatorCode: 'E1',
      FloorsAttended: [1, 2, 3],
      ElevatorType: elevatorType.create({marca:"sony",modelo:"up1"}).getValue(),
      NumSerie: '1234567890',
      Description: 'Test elevator'
    };

    const elevatorOrError = Elevator.create(props, new UniqueEntityID());

    expect(elevatorOrError.isSuccess).to.be.true;

    const elevator = elevatorOrError.getValue();
    let floors = [1, 2, 3];

    expect(elevator.Buildingcode).to.equal('B1');
    expect(elevator.ElevatorCode).to.equal('E1');
    expect(elevator.FloorsAttended.length).to.equal(floors.length);
    expect(elevator.ElevatorType.marca).to.equal( elevatorType.create({marca:"sony",modelo:"up1"}).getValue().marca);
    expect(elevator.ElevatorType.modelo).to.equal( elevatorType.create({marca:"sony",modelo:"up1"}).getValue().modelo);
    expect(elevator.NumSerie).to.equal('1234567890');
    expect(elevator.Description).to.equal('Test elevator');
  });

  it('should fail to create an elevator with invalid NumSerie', () => {
    const props = {
      BuildingCode: 'B1',
      ElevatorCode: 'E1',
      FloorsAttended: [1, 2, 3],
      ElevatorType: elevatorType.create({marca:"sony",modelo:"up1"}).getValue(),
      NumSerie: '',
      Description: 'Test elevator'
    };

    const elevatorOrError = Elevator.create(props, new UniqueEntityID());

    expect(elevatorOrError.isFailure).to.be.true;
    expect(elevatorOrError.error).to.equal('NumSerie must be between 1 and 50 characters.');
  });

  it('should fail to create an elevator with invalid Description', () => {
    const props = {
      BuildingCode: 'B1',
      ElevatorCode: 'E1',
      FloorsAttended: [1, 2, 3],
      ElevatorType: elevatorType.create({marca:"sony",modelo:"up1"}).getValue(),
      NumSerie: '1234567890',
      Description: ''
    };

    const elevatorOrError = Elevator.create(props, new UniqueEntityID());

    expect(elevatorOrError.isFailure).to.be.true;
    expect(elevatorOrError.error).to.equal('Description must be between 1 and 250 characters.');
  });
});