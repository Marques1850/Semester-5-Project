// Import necessary packages
import { when, mock, instance, verify } from 'ts-mockito';
import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { expect } from 'chai';
import config from "../../../config";
import { Result } from '../../../src/core/logic/Result';
//import { IFloorDTO } from '../../../src/dto/IFloorDTO';
import { Floor } from '../../../src/domain/floor';
import { FloorMap } from '../../../src/mappers/FloorMap';
import IFloorRepo from '../../../src/services/IRepos/IFloorRepo';
import IBuildingRepo from '../../../src/services/IRepos/IBuildingRepo';
import IFloorService from '../../../src/services/IServices/IFloorService';
import { Building } from '../../../src/domain/building';
import IElevatorRepo from '../../../src/services/IRepos/IElevatorRepo';
import ElevatorRepo from '../../../src/repos/ElevatorRepo';
import ElevatorService from '../../../src/services/elevatorService';
import { Elevator } from '../../../src/domain/elevator';
import  { elevatorType } from '../../../src/domain/elevatorType';
import IElevatorService from '../../../src/services/IServices/IElevatorService';
import IElevatorDTO from '../../../src/dto/IElevatorDTO';
import { ElevatorMap } from '../../../src/mappers/ElevatorMap';
import { BuildingCode } from '../../../src/domain/buildingcode';

describe('ElevatorService', function () {
	let ElevatorRepo: IElevatorRepo;
	let elevatorService: IElevatorService;
	let buildingRepo: IBuildingRepo;

	beforeEach(function() {
		ElevatorRepo = mock<IElevatorRepo>();
		buildingRepo = mock<IBuildingRepo>();

		elevatorService = new ElevatorService(instance(ElevatorRepo),instance(buildingRepo));
  	});

	afterEach(function() {
		//sandbox.restore();
	});

	describe('listElevatorsInBuilding', function () {
		it('should return a list of elevators in the building', async function () {
			// Arrange
			const buildingCode = 'Edif';
			const elevator = Elevator.create({
				BuildingCode: "Edif",
    			ElevatorCode: "elevA",
    			FloorsAttended: [1,2],
				ElevatorType: elevatorType.create({marca: "marca", modelo: "modelo"}).getValue(),
    			NumSerie: "123a",
    			Description: "55555"
			}).getValue();

			const building1 = Building.create({ 
				code: BuildingCode.create({code:"Edif"}).getValue(),
				name: "Edif",
				description: "Building to use for unity tests",
				width: 10,
				length: 10
			}).getValue();

			when(ElevatorRepo.findByBuildingCode(buildingCode)).thenResolve(elevator);
			
	
			// Act
			const result = await elevatorService.listElevatorsInBuilding(buildingCode);
	
			// Assert
			expect(result.isSuccess).to.be.true;
			const expectedDTO: IElevatorDTO = ElevatorMap.toDTO(elevator) as IElevatorDTO;
			expect(result.getValue()).to.deep.equal(expectedDTO);
		});
	
		it('should return a failure result if no elevators are found', async function () {
			// Arrange
			const buildingCode = 'Edif';

			const building1 = Building.create({ 
				code:BuildingCode.create({code:"Edif"}).getValue(),
				name: "Edif",
				description: "Building to use for unity tests",
				width: 10,
				length: 10
			}).getValue();

			when(ElevatorRepo.findByBuildingCode(buildingCode)).thenResolve(null);
	
			// Act
			const result = await elevatorService.listElevatorsInBuilding(buildingCode);
	
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('elevators not found');
		});
	});

	describe('createElevator', function () {
		it('should return a failure result when building already has an elevator', async function () {
		// Arrange
			const elevatorDTO: IElevatorDTO = {
				BuildingCode: "B001",
				ElevatorCode: "E001",
				FloorsAttended: [1,2],
				ElevatorType: elevatorType.create({marca: "marca", modelo: "modelo"}).getValue(),
				NumSerie: "123a",
				Description: "55555"
			};

		
			// Create an existing elevator for the building
			const existingElevator = Elevator.create({
				BuildingCode: "B001",
				ElevatorCode: "E001",
				FloorsAttended: [1,2],
				ElevatorType: elevatorType.create({marca: "marca", modelo: "modelo"}).getValue(),
				NumSerie: "123a",
				Description: "55555"
			}).getValue();

			const edifCode = 'Edif';
			const building = {
				code:BuildingCode.create({code:edifCode}).getValue() ,
				name: "ForTest",
				description: "Unity Test Building",
				width: 10,
				length: 10,
			};
			const buildingExpected = Building.create(building);
			when(ElevatorRepo.findByBuildingCode(elevatorDTO.BuildingCode)).thenResolve(existingElevator);
			when(ElevatorRepo.save(existingElevator)).thenResolve();
			when(buildingRepo.findByBuildingCode(elevatorDTO.BuildingCode)).thenResolve(buildingExpected.getValue());
			ElevatorRepo.save(existingElevator);
		
			// Act
			const result = await elevatorService.createElevator(elevatorDTO);
		
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('building already has elevator');
		});

		it('should return a success result when creating a new elevator', async function () {
		// Arrange
			const elevatorDTO: IElevatorDTO = {
				BuildingCode: "B001",
				ElevatorCode: "E001",
				FloorsAttended: [1,2],
				ElevatorType: elevatorType.create({marca: "marca", modelo: "modelo"}).getValue(),
				NumSerie: "123a",
				Description: "55555"
			};

			const edifCode = 'B001';
			const building = {
				code:BuildingCode.create({code:edifCode}).getValue() ,
				name: "ForTest",
				description: "Unity Test Building",
				width: 10,
				length: 10,
			};
			const buildingExpected = Building.create(building);
			when(buildingRepo.findByBuildingCode(elevatorDTO.BuildingCode)).thenResolve(buildingExpected.getValue());
		// Act
		const result = await elevatorService.createElevator(elevatorDTO);
	
		// Assert
		expect(result.isSuccess).to.be.true;
		expect(result.getValue()).to.deep.equal(elevatorDTO);
		});
	});

	describe('updateElevator', function () {
		it('should return a failure result when elevator does not exist', async function () {
		// Arrange
			const elevatorDTO: IElevatorDTO = {
				BuildingCode: "B001",
				ElevatorCode: "E001",
				FloorsAttended: [1,2],
				ElevatorType: elevatorType.create({marca: "marca", modelo: "modelo"}).getValue(),
				NumSerie: "123a",
				Description: "55555"
			};
	
		// Act
		const result = await elevatorService.updateElevator(elevatorDTO);
	
		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('elevator not found');
		});

		it('should return a success result when updating an elevator', async function () {
		// Arrange
			const elevatorDTO: IElevatorDTO = {
				BuildingCode: "B001",
				ElevatorCode: "E001",
				FloorsAttended: [1,2],
				ElevatorType: elevatorType.create({marca: "marca", modelo: "modelo"}).getValue(),
				NumSerie: "123a",
				Description: "55555"
			};

			const existingElevator = Elevator.create({
				BuildingCode: "B001",
				ElevatorCode: "E001",
				FloorsAttended: [1,2],
				ElevatorType: elevatorType.create({marca: "marca", modelo: "modelo"}).getValue(),
				NumSerie: "123a",
				Description: "55555"
			}).getValue();
	
			when(ElevatorRepo.findByBuildingCode(elevatorDTO.BuildingCode)).thenResolve(existingElevator);
			when(ElevatorRepo.save(existingElevator)).thenResolve();
			ElevatorRepo.save(existingElevator);
		});
	});
});
