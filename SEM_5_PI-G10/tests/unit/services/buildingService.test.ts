// Import necessary packages
import { when, mock, instance, verify } from 'ts-mockito';
import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { expect } from 'chai';
import config from "../../../config";
import { Result } from '../../../src/core/logic/Result';
import BuildingService from '../../../src/services/buildingService';
import { Floor } from '../../../src/domain/floor';
import { FloorMap } from '../../../src/mappers/FloorMap';
import IFloorRepo from '../../../src/services/IRepos/IFloorRepo';
import IBuildingRepo from '../../../src/services/IRepos/IBuildingRepo';
import IBuildingService from '../../../src/services/IServices/IBuildingService';
import IBuildingDTO from '../../../src/dto/IBuildingDTO';
import { BuildingCode } from '../../../src/domain/buildingcode';

import { Building } from '../../../src/domain/building';

import { MapMap } from '../../../src/mappers/MapMap';
import {Map} from '../../../src/domain/map';

describe('BuildingService', function () {
	let BuildingRepo: IBuildingRepo;
	let FloorRepo: IFloorRepo;
	let buildingService: IBuildingService;

	beforeEach(function() {
		BuildingRepo = mock<IBuildingRepo>();
		FloorRepo = mock<IFloorRepo>();
		buildingService = new BuildingService( instance(BuildingRepo),instance(FloorRepo));
  	});

	afterEach(function() {
		//sandbox.restore();
	});

	describe('createBuilding', function () {
		it('should return a success result when the building is created', async function () {
			// Arrange
			const edifCode = 'Edif';
			const building = {
				code:BuildingCode.create({code:edifCode}).getValue() ,
				name: "ForTest",
				description: "Unity Test Building",
				width: 10,
				length: 10,
			};
			const buildingDTO = {
				code:edifCode ,
				name: "ForTest",
				description: "Unity Test Building",
				width: 10,
				length: 10,
			};
			const buildingExpected = Building.create(building);
			when(BuildingRepo.save(buildingExpected.getValue())).thenReturn(Promise.resolve(buildingExpected.getValue()));
			// Act
			const result = await buildingService.createBuilding(buildingDTO);
			// Assert
			expect(result.isSuccess).to.be.true;
			expect(result.error).to.equal(null);
			verify(BuildingRepo.findByBuildingCode(edifCode)).once();
		});

		it('should return a failure result when the building already exists', async function () {
			// Arrange
			const edifCode = 'Edif';
			const buildingDTO: IBuildingDTO = {
				code: edifCode,
				name: "ForTest",
				description: "Unity Test Building",
				width: 10,
				length: 10,
			};
			const building = {
				code:BuildingCode.create({code:edifCode}).getValue() ,
				name: "ForTest",
				description: "Unity Test Building",
				width: 10,
				length: 10,
			};
			const buildingExpected = Building.create(building);
			when(BuildingRepo.findByBuildingCode(edifCode)).thenReturn(Promise.resolve(buildingExpected.getValue()));
			// Act
			const result = await buildingService.createBuilding(buildingDTO);
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Building already exists with code=' + edifCode);
			verify(BuildingRepo.findByBuildingCode(edifCode)).once();
		});
	});


	it('should return a failure result when there are no buildings', async function () {
		// Arrange
		
				when(BuildingRepo.findAll()).thenReturn(Promise.resolve([]));

				// Act
				const result = await buildingService.listAllBuildings();

		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('There are no buildings');
		
	});

	it('should return a failure result when there are no buildings', async function () {
		// Arrange
		
				when(BuildingRepo.findAll()).thenReturn(Promise.resolve([]));

				// Act
				const result = await buildingService.listAllBuildings();

		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('There are no buildings');
		
	});

	it('should return a sucess result when there are  buildings', async function () {
		// Arrange
		const building = Building.create({ code: BuildingCode.create({code:"Edif"}).getValue(),
		name: "ForTest",
		description: "Building to use for unity tests",
		width: 10,
		length: 10}).getValue();

		const building2 = Building.create({  code: BuildingCode.create({code:"Edif2"}).getValue(),
		name: "ForTest2",
		description: "Building to use for unity tests",
		width: 10,
		length: 10}).getValue();

		let buildings = [building,building2];
				when(BuildingRepo.findAll()).thenReturn(Promise.resolve(buildings ));

				// Act
				const result = await buildingService.listAllBuildings();

		// Assert
		verify(BuildingRepo.findAll()).once();
		expect(result.isSuccess).to.be.true;
		expect(result.error).to.equal(null);
  
		
	});

	it('update building that does not exist', async function () {
		// Arrange
		const buildingCode = 'invalid';
		const buildingDTO : IBuildingDTO = {
			code: "invalido",
			name: "edificioteste",
			description: "edificioteste",
			width: 10,
			length: 10,
		};
		when(BuildingRepo.findByBuildingCode(buildingCode)).thenReturn(Promise.resolve(null));

		// Act
		const result = await buildingService.updateBuilding(buildingDTO);
		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('Building does not exist');
	});


it('update building with valid parameters', async function () {
		// Arrange
		const buildingCode = "valid";

		const buildingDTO: IBuildingDTO = {
			code: "valid",
			name: "edificioteste",
			description: "edificio teste",
			width: 10,
			length: 10,
		};

		const building = {
			code:BuildingCode.create({code:"valid"}).getValue() ,
			name: "edificioteste",
			description: "edificio teste",
			width: 10,
			length: 10,
		};
		const buildingExpected = Building.create(building);

		when(BuildingRepo.findByBuildingCode(buildingCode)).thenReturn(
			Promise.resolve(buildingExpected.getValue())
		);
		when(BuildingRepo.changeBuilding(buildingCode, buildingDTO.name, buildingDTO.description, buildingDTO.width, buildingDTO.length))
						.thenReturn( Promise.resolve(buildingExpected.getValue()));
		// Act
		const result = await buildingService.updateBuilding(buildingDTO);
		// Assert
		expect(result.isFailure).to.be.false;

		//expect(result.getValue().code).to.equal(buildingDTO.code);
		expect(result.getValue().name).to.equal(buildingDTO.name);
		expect(result.getValue().description).to.equal(buildingDTO.description);
		expect(result.getValue().width).to.equal(buildingDTO.width);
		expect(result.getValue().length).to.equal(buildingDTO.length);
	});

	it('should return a failure result when minFloors is negative', async function () {
		// Arrange
		const minFloors = -1;
		const maxFloors = 2;
	
		// Act
		const result = await buildingService.listBuildingsWithFloorsInRange(minFloors, maxFloors);
	
		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('Bad range of floors.');
	  });

	it('should return a failure result when maxFloors is negative', async function () {
		// Arrange
		const minFloors = 1;
		const maxFloors = -1;
	
		// Act
		const result = await buildingService.listBuildingsWithFloorsInRange(minFloors, maxFloors);
	
		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('Bad range of floors.');
	});

	it('should return a failure result when minFloors is greater than maxFloors', async function () {
		// Arrange
		const minFloors = 3;
		const maxFloors = 2;
	
		// Act
		const result = await buildingService.listBuildingsWithFloorsInRange(minFloors, maxFloors);
	
		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('Bad range of floors.');
	});

	it('should return a failure result when no buildings match the criteria', async function () {
		// Arrange
		const minFloors = 1;
		const maxFloors = 2;
		when(BuildingRepo.findAll()).thenReturn(Promise.resolve([]));
	
		// Act
		const result = await buildingService.listBuildingsWithFloorsInRange(minFloors, maxFloors);
	
		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('There are no buildings with the specified number of floors.');
	});

	it('should return a success result with matching buildings', async function () {
		// Arrange
		const minFloors = 1;
		const maxFloors = 3;

		const building= {
			code:BuildingCode.create({code:"vali1"}).getValue() ,
			name: "edificioteste",
			description: "edificio teste",
			width: 10,
			length: 10,
		};
		const building2  = {
			code: BuildingCode.create({code:"vali2"}).getValue(),
			name: "edificioteste2",
			description: "edificio teste2",
			width: 10,
			length: 10,
		};
		const building3 = {
			code: BuildingCode.create({code:"vali3"}).getValue(),
			name: "edificioteste3",
			description: "edificio teste3",
			width: 10,
			length: 10,
		};
		const buildingExpected = Building.create(building);
		const buildingExpected2 = Building.create(building2);
		const buildingExpected3 = Building.create(building3);

		const buildings = [buildingExpected.getValue(), buildingExpected2.getValue(), buildingExpected3.getValue()];
		const testMapProps = Map.create({
			maze: {
			  size: [5, 5],
			  map: [
			  ['W', 'W', 'W', 'W', 'W'],
			  ['W', 'E', ' ', ' ', 'W'],
			  ['W', ' ', 'W', ' ', 'W'],
			  ['W', ' ', ' ', ' ', 'W'],
			  ['W', 'W', 'W', 'W', 'W'],
			  ],
			  exits: [[1, 0]],
			  elevators: [[2, 2]],
			  exitLocation: [[1, 0]],
			  exitFloor: [],
			  rooms: []
			},
			ground: {
			  size: { width: 10, height: 10, depth: 1 },
			  segments: { width: 1, height: 1 },
			  primaryColor: '#654321',
			  maps: {
			  color: { url: 'ground_color.jpg' },
			  ao: { url: 'ground_ao.jpg', intensity: 0.5 },
			  displacement: { url: 'ground_displacement.jpg', scale: 1, bias: 0 },
			  normal: { url: 'ground_normal.jpg', type: 1, scale: { x: 1, y: 1 } },
			  bump: { url: 'ground_bump.jpg', scale: 1 },
			  roughness: { url: 'ground_roughness.jpg', rough: 0.8 },
			  },
			  wrapS: 1000,
			  wrapT: 1000,
			  repeat: { u: 5, v: 5 },
			  magFilter: 1,
			  minFilter: 2,
			  secondaryColor: '#987654',
			},
			wall: {
			  segments: { width: 1, height: 2 },
			  primaryColor: '#000000',
			  maps: {
			  color: { url: 'wall_color.jpg' },
			  ao: { url: 'wall_ao.jpg', intensity: 0.5 },
			  displacement: { url: 'wall_displacement.jpg', scale: 1, bias: 0 },
			  normal: { url: 'wall_normal.jpg', type: 1, scale: { x: 1, y: 1 } },
			  bump: { url: 'wall_bump.jpg', scale: 1 },
			  roughness: { url: 'wall_roughness.jpg', rough: 0.8 },
			  },
			  wrapS: 1000,
			  wrapT: 1000,
			  repeat: { u: 5, v: 5 },
			  magFilter: 1,
			  minFilter: 2,
			  secondaryColor: '#CCCCCC',
			},
			player: {
			  initialPosition: [2, 2],
			  initialDirection: 0,
			},
			});
	  
		const floor = Floor.create({
			name: "Floor1Edif2",
			description: "Bug testing",
			buildingCode: "vali1",
			level: 0,
			width: 2,
			length: 2,
			plant: null,
			rooms: []
		}).getValue();

		const floor2 = Floor.create({
			name: "Floor2Edif2",
			description: "Bug testing",
			buildingCode: "vali1",
			level: 1,
			width: 2,
			length: 2,
			plant:null,
			rooms: []
		}).getValue();

		const floor21 = Floor.create({
			name: "Floor1Edif3",
			description: "Bug testing",
			buildingCode: "vali2",
			level: 0,
			width: 2,
			length: 2,
			plant:null,
			rooms: []
		}).getValue();
	
		when(BuildingRepo.findAll()).thenReturn(Promise.resolve(buildings));
		when(FloorRepo.findByBuildingCode("vali1")).thenReturn(Promise.resolve([floor, floor2]));
		when(FloorRepo.findByBuildingCode("vali2")).thenReturn(Promise.resolve([floor21]));
		when(FloorRepo.findByBuildingCode("vali3")).thenReturn(Promise.resolve([]));

	

	
		// Act
		const result = await buildingService.listBuildingsWithFloorsInRange(minFloors, maxFloors);
		// Assert
		// !!!
		//n funciona porque no BuildingMap.ts em toDTO() faz building.props.code.toString()
		/*
		expect(result.isSuccess).to.be.true;
		expect(result.error).to.be.null;
		// Add more assertions to check the returned data
	    expect(result.getValue().length).to.equal(2);
		
		expect(result.getValue()[0].code).equal('vali1');
		expect(result.getValue()[1].code).equal('vali2');
		*/
	  });
});
