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
import IPassageRepo from '../../../src/services/IRepos/IPassageRepo';
import IPassageService from '../../../src/services/IServices/IPassageService';
import PassageService from '../../../src/services/passageService';
import { Building } from '../../../src/domain/building';
import IFloorDTO from '../../../src/dto/IFloorDTO';
import { Passage } from '../../../src/domain/passage';
import { floor } from 'lodash';
import { BuildingCode } from '../../../src/domain/buildingcode';
import { PassageCode } from '../../../src/domain/passagecode';
import {Map} from '../../../src/domain/map';





describe('PassageService', function () {
	let PassageRepo: IPassageRepo;
	let BuildingRepo: IBuildingRepo;
	let FloorRepo: IFloorRepo;
    let passageService: IPassageService;

	beforeEach(function() {
		PassageRepo = mock<IPassageRepo>();
		BuildingRepo = mock<IBuildingRepo>();
        FloorRepo = mock<IFloorRepo>();
		passageService = new PassageService( instance(PassageRepo),instance(BuildingRepo),instance(FloorRepo));
  	});

	afterEach(function() {
		//sandbox.restore();
	});

	describe('updatePassage', function () {
		it('should return a failure result when the building 1 does not exist', async function () {
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
		// Arrange
		const codeBuilding1 = 'Edif';
		const codeBuilding2 = 'Edif2';
		const FloorBuilding1Name = 'Floor1Edif';
		const FloorBuilding2Name = 'Floor2Edif';
		const passageDTO ={
			codigo: 'Unity',
			codeBuilding1: 'Edif',
			codeBuilding2: 'Edif2',
			FloorBuilding1Name: 'Floor1Edif',
			FloorBuilding2Name: 'Floor2Edif',
		};

		const floor1 = Floor.create({
			name: "Floor1Edif",
			description: "Bug testing",
			buildingCode:"Edif",
			level: 1,
			width: 10,
			length: 10,
			plant: testMapProps.getValue(),
			rooms: []
		}).getValue();

		const floor2 = Floor.create({
			name: "Floor1Edif2",
			description: "Bug testing",
			buildingCode:"Edif2",
			level: 2,
			width: 10,
			length: 10,
			plant: testMapProps.getValue(),
			rooms: []
		}).getValue();

		const building2 = Building.create({ code:BuildingCode.create({code:"Edif2"}).getValue() ,
		name: "Edif2",
		description: "Building to use for unity tests",
		width: 10,
		length: 10}).getValue();

		when(BuildingRepo.findByBuildingCode(codeBuilding1)).thenReturn(Promise.resolve(null));
		when(BuildingRepo.findByBuildingCode(codeBuilding2)).thenReturn(Promise.resolve(building2));
		when(FloorRepo.findFloor(FloorBuilding1Name)).thenReturn(Promise.resolve(floor1));
		when(FloorRepo.findFloor(FloorBuilding2Name)).thenReturn(Promise.resolve(floor2));

		// Act
		const result = await passageService.updatePassage(passageDTO);
	
		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('Building 1 not found');
		verify(BuildingRepo.findByBuildingCode(codeBuilding1)).once();
		});

		it('should return a failure result when the building 2 does not exist', async function () {
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
			// Arrange
			const codeBuilding1 = 'Edif';
			const codeBuilding2 = 'Edif2';
			const FloorBuilding1Name = 'Floor1Edif';
			const FloorBuilding2Name = 'Floor2Edif2';
			const passageDTO ={
				codigo: 'Unity',
				codeBuilding1: 'Edif',
				codeBuilding2: 'Edif2',
				FloorBuilding1Name: 'Floor1Edif',
				FloorBuilding2Name: 'Floor2Edif2',
			};
	
			const floor1 = Floor.create({
				name: "Floor1Edif",
				description: "Bug testing",
				buildingCode:"Edif",
				level: 1,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
	
			const floor2 = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode:"Edif2",
				level: 2,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
	
			const building1 = Building.create({ code:BuildingCode.create({code:"Edif2"}).getValue(),
			name: "Edif",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();
	
			when(BuildingRepo.findByBuildingCode(codeBuilding1)).thenReturn(Promise.resolve(building1));
			when(BuildingRepo.findByBuildingCode(codeBuilding2)).thenReturn(Promise.resolve(null));
			when(FloorRepo.findFloor(FloorBuilding1Name)).thenReturn(Promise.resolve(floor1));
			when(FloorRepo.findFloor(FloorBuilding2Name)).thenReturn(Promise.resolve(floor2));
	
			// Act
			const result = await passageService.updatePassage(passageDTO);
		
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Building 2 not found');
			verify(BuildingRepo.findByBuildingCode(codeBuilding1)).once();
			verify(BuildingRepo.findByBuildingCode(codeBuilding2)).once();
		});

		it('should return a failure result when the floor 1 does not exist', async function () {
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
			// Arrange
			const codeBuilding1 = 'Edif';
			const codeBuilding2 = 'Edif2';
			const FloorBuilding1Name = 'Floor1Edif';
			const FloorBuilding2Name = 'Floor2Edif2';
			const passageDTO ={
				codigo:'Unity',
				codeBuilding1: 'Edif',
				codeBuilding2: 'Edif2',
				FloorBuilding1Name: 'Floor1Edif',
				FloorBuilding2Name: 'Floor2Edif2',
			};
	
			const floor2 = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode: "Edif2",
				level: 2,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
	
			const building1 = Building.create({code:BuildingCode.create({code:"Edif2"}).getValue(),
			name: "Edif",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();

			const building2 = Building.create({ code:BuildingCode.create({code:"Edif2"}).getValue(),
			name: "Edif2",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();
	
			when(BuildingRepo.findByBuildingCode(codeBuilding1)).thenReturn(Promise.resolve(building1));
			when(BuildingRepo.findByBuildingCode(codeBuilding2)).thenReturn(Promise.resolve(building2));
			when(FloorRepo.findFloor(FloorBuilding1Name)).thenReturn(Promise.resolve(null));
			when(FloorRepo.findFloor(FloorBuilding2Name)).thenReturn(Promise.resolve(floor2));
	
			// Act
			const result = await passageService.updatePassage(passageDTO);
		
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Floor 1 not found');
			verify(BuildingRepo.findByBuildingCode(codeBuilding1)).once();
			verify(BuildingRepo.findByBuildingCode(codeBuilding2)).once();
			verify(FloorRepo.findFloor(FloorBuilding1Name)).once();
		});

		it('should return a failure result when the floor 2 does not exist', async function () {
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
			// Arrange
			const codeBuilding1 = 'Edif';
			const codeBuilding2 = 'Edif2';
			const FloorBuilding1Name = 'Floor1Edif';
			const FloorBuilding2Name = 'Floor2Edif2';
			const passageDTO ={
				codigo:'Unity',
				codeBuilding1: 'Edif',
				codeBuilding2: 'Edif2',
				FloorBuilding1Name: 'Floor1Edif',
				FloorBuilding2Name: 'Floor2Edif2',
			};

			const floor1 = Floor.create({
				name: "Floor1Edif",
				description: "Bug testing",
				buildingCode:"Edif",
				level: 1,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
	
			const building1 = Building.create({ code:BuildingCode.create({code:"Edif2"}).getValue(),
			name: "Edif",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();

			const building2 = Building.create({ code:BuildingCode.create({code:"Edif2"}).getValue(),
			name: "Edif2",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();
	
			when(BuildingRepo.findByBuildingCode(codeBuilding1)).thenReturn(Promise.resolve(building1));
			when(BuildingRepo.findByBuildingCode(codeBuilding2)).thenReturn(Promise.resolve(building2));
			when(FloorRepo.findFloor(FloorBuilding1Name)).thenReturn(Promise.resolve(floor1));
			when(FloorRepo.findFloor(FloorBuilding2Name)).thenReturn(Promise.resolve(null));
	
			// Act
			const result = await passageService.updatePassage(passageDTO);
		
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Floor 2 not found');
			verify(BuildingRepo.findByBuildingCode(codeBuilding1)).once();
			verify(BuildingRepo.findByBuildingCode(codeBuilding2)).once();
			verify(FloorRepo.findFloor(FloorBuilding1Name)).once();
			verify(FloorRepo.findFloor(FloorBuilding2Name)).once();
		});

		it('should return a failure result when the floor 1 does not belong to building 1', async function () {
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
			// Arrange
			const codeBuilding1 = 'Edif';
			const codeBuilding2 = 'Edif2';
			const FloorBuilding1Name = 'Floor1Edif';
			const FloorBuilding2Name = 'Floor2Edif2';
			const passageDTO ={
				codigo:'Unity',
				codeBuilding1: 'Edif',
				codeBuilding2: 'Edif2',
				FloorBuilding1Name: 'Floor1Edif',
				FloorBuilding2Name: 'Floor2Edif2',
			};

			const floor1 = Floor.create({
				name: "Floor1Edif",
				description: "Bug testing",
				buildingCode: "Edif3",
				level: 1,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			const floor2 = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode:"Edif2",
				level: 2,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
	
			const building1 = Building.create({ code:BuildingCode.create({code:"Edif"}).getValue(),
			name: "Edif",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();

			const building2 = Building.create({ code:BuildingCode.create({code:"Edif2"}).getValue(),
			name: "Edif2",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();
	
			when(BuildingRepo.findByBuildingCode(codeBuilding1)).thenReturn(Promise.resolve(building1));
			when(BuildingRepo.findByBuildingCode(codeBuilding2)).thenReturn(Promise.resolve(building2));
			when(FloorRepo.findFloor(FloorBuilding1Name)).thenReturn(Promise.resolve(floor1));
			when(FloorRepo.findFloor(FloorBuilding2Name)).thenReturn(Promise.resolve(floor2));
	
			// Act
			const result = await passageService.updatePassage(passageDTO);
		
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Floor 1 does not belong to building 1');
			verify(BuildingRepo.findByBuildingCode(codeBuilding1)).once();
			verify(BuildingRepo.findByBuildingCode(codeBuilding2)).once();
			verify(FloorRepo.findFloor(FloorBuilding1Name)).once();
			verify(FloorRepo.findFloor(FloorBuilding2Name)).once();
		});

		it('should return a failure result when the floor 2 does not belong to building 2', async function () {
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
			// Arrange
			const codeBuilding1 = 'Edif';
			const codeBuilding2 = 'Edif2';
			const FloorBuilding1Name = 'Floor1Edif';
			const FloorBuilding2Name = 'Floor2Edif2';
			const passageDTO ={
				codigo:'Unity',
				codeBuilding1: 'Edif',
				codeBuilding2: 'Edif2',
				FloorBuilding1Name: 'Floor1Edif',
				FloorBuilding2Name: 'Floor2Edif2',
			};

			const floor1 = Floor.create({
				name: "Floor1Edif",
				description: "Bug testing",
				buildingCode:"Edif",
				level: 1,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			const floor2 = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode: "Edif3",
				level: 2,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
	
			const building1 = Building.create({ code:BuildingCode.create({code:"Edif"}).getValue(),
			name: "Edif",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();

			const building2 = Building.create({ code:BuildingCode.create({code:"Edif2"}).getValue(),
			name: "Edif2",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();
	
			when(BuildingRepo.findByBuildingCode(codeBuilding1)).thenReturn(Promise.resolve(building1));
			when(BuildingRepo.findByBuildingCode(codeBuilding2)).thenReturn(Promise.resolve(building2));
			when(FloorRepo.findFloor(FloorBuilding1Name)).thenReturn(Promise.resolve(floor1));
			when(FloorRepo.findFloor(FloorBuilding2Name)).thenReturn(Promise.resolve(floor2));
	
			// Act
			const result = await passageService.updatePassage(passageDTO);
		
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Floor 2 does not belong to building 2');
			verify(BuildingRepo.findByBuildingCode(codeBuilding1)).once();
			verify(BuildingRepo.findByBuildingCode(codeBuilding2)).once();
			verify(FloorRepo.findFloor(FloorBuilding1Name)).once();
			verify(FloorRepo.findFloor(FloorBuilding2Name)).once();
		});

		it('should return a failure result when the two floors are in the same building', async function () {
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
			// Arrange
			const codeBuilding1 = 'Edif';
			const codeBuilding2 = 'Edif2';
			const FloorBuilding1Name = 'Floor1Edif';
			const FloorBuilding2Name = 'Floor2Edif2';
			const passageDTO ={
				codigo:'Unity',
				codeBuilding1: 'Edif',
				codeBuilding2: 'Edif2',
				FloorBuilding1Name: 'Floor1Edif',
				FloorBuilding2Name: 'Floor2Edif2',
			};

			const floor1 = Floor.create({
				name: "Floor1Edif",
				description: "Bug testing",
				buildingCode:"Edif",
				level: 1,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			const floor2 = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode:"Edif",
				level: 2,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
	
			const building1 = Building.create({ code:BuildingCode.create({code:"Edif2"}).getValue(),
			name: "Edif",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();

			const building2 = Building.create({ code:BuildingCode.create({code:"Edif2"}).getValue(),
			name: "Edif2",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();
	
			when(BuildingRepo.findByBuildingCode(codeBuilding1)).thenReturn(Promise.resolve(building1));
			when(BuildingRepo.findByBuildingCode(codeBuilding2)).thenReturn(Promise.resolve(building2));
			when(FloorRepo.findFloor(FloorBuilding1Name)).thenReturn(Promise.resolve(floor1));
			when(FloorRepo.findFloor(FloorBuilding2Name)).thenReturn(Promise.resolve(floor2));
	
			// Act
			const result = await passageService.updatePassage(passageDTO);
		
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Floors belong to the same building');
			verify(BuildingRepo.findByBuildingCode(codeBuilding1)).once();
			verify(BuildingRepo.findByBuildingCode(codeBuilding2)).once();
			verify(FloorRepo.findFloor(FloorBuilding1Name)).once();
			verify(FloorRepo.findFloor(FloorBuilding2Name)).once();
		});

		it('should return a failure result when the two building codes are of the same building', async function () {
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
			// Arrange
			const codeBuilding1 = 'Edif';
			const codeBuilding2 = 'Edif';
			const FloorBuilding1Name = 'Floor1Edif';
			const FloorBuilding2Name = 'Floor2Edif2';
			const passageDTO ={
				codigo:'Unity',
				codeBuilding1: 'Edif',
				codeBuilding2: 'Edif',
				FloorBuilding1Name: 'Floor1Edif',
				FloorBuilding2Name: 'Floor2Edif2',
			};

			const floor1 = Floor.create({
				name: "Floor1Edif",
				description: "Bug testing",
				buildingCode:"Edif",
				level: 1,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			const floor2 = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode:"Edif2",
				level: 2,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
	
			const building1 = Building.create({ code:BuildingCode.create({code:"Edif"}).getValue(),
			name: "Edif",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();

			const building2 = Building.create({ code:BuildingCode.create({code:"Edif"}).getValue(),
			name: "Edif",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();
	
			when(BuildingRepo.findByBuildingCode(codeBuilding1)).thenReturn(Promise.resolve(building1));
			when(BuildingRepo.findByBuildingCode(codeBuilding2)).thenReturn(Promise.resolve(building2));
			when(FloorRepo.findFloor(FloorBuilding1Name)).thenReturn(Promise.resolve(floor1));
			when(FloorRepo.findFloor(FloorBuilding2Name)).thenReturn(Promise.resolve(floor2));
	
			// Act
			const result = await passageService.updatePassage(passageDTO);
		
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Buildings are the same');
			verify(BuildingRepo.findByBuildingCode("Edif")).twice();
		});

		it('should return a failure result when the passage does not exist', async function () {
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
			// Arrange
			const codeBuilding1 = 'Edif';
			const codeBuilding2 = 'Edif2';
			const FloorBuilding1Name = 'Floor1Edif';
			const FloorBuilding2Name = 'Floor2Edif2';
			const passageDTO ={
				codigo:'Unity',
				codeBuilding1: 'Edif',
				codeBuilding2: 'Edif2',
				FloorBuilding1Name: 'Floor1Edif',
				FloorBuilding2Name: 'Floor2Edif2',
			};

			const floor1 = Floor.create({
				name: "Floor1Edif",
				description: "Bug testing",
				buildingCode:"Edif",
				level: 1,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			const floor2 = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode:"Edif2",
				level: 2,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
	
			const building1 = Building.create({ code:BuildingCode.create({code:"Edif"}).getValue(),
			name: "Edif",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();

			const building2 = Building.create({ code:BuildingCode.create({code:"Edif2"}).getValue(),
			name: "Edif2",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();
	
			when(BuildingRepo.findByBuildingCode(codeBuilding1)).thenReturn(Promise.resolve(building1));
			when(BuildingRepo.findByBuildingCode(codeBuilding2)).thenReturn(Promise.resolve(building2));
			when(FloorRepo.findFloor(FloorBuilding1Name)).thenReturn(Promise.resolve(floor1));
			when(FloorRepo.findFloor(FloorBuilding2Name)).thenReturn(Promise.resolve(floor2));
	
			// Act
			const result = await passageService.updatePassage(passageDTO);
		
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Passage not found');
			verify(BuildingRepo.findByBuildingCode(codeBuilding1)).once();
			verify(BuildingRepo.findByBuildingCode(codeBuilding2)).once();
			verify(FloorRepo.findFloor(FloorBuilding1Name)).once();
			verify(FloorRepo.findFloor(FloorBuilding2Name)).once();
		});

		it('should return a failure result when the passage does not exist', async function () {
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
			// Arrange
			const codeBuilding1 = 'Edif';
			const codeBuilding2 = 'Edif2';
			const FloorBuilding1Name = 'Floor1Edif';
			const FloorBuilding2Name = 'Floor2Edif2';
			const passageDTO ={
				codigo:'Unity',
				codeBuilding1: 'Edif',
				codeBuilding2: 'Edif2',
				FloorBuilding1Name: 'Floor1Edif',
				FloorBuilding2Name: 'Floor2Edif2',
			};

			const floor1 = Floor.create({
				name: "Floor1Edif",
				description: "Bug testing",
				buildingCode:"Edif",
				level: 1,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			const floor2 = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode:"Edif2",
				level: 2,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
	
			const building1 = Building.create({ code:BuildingCode.create({code:"Edif"}).getValue(),
			name: "Edif",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();

			const building2 = Building.create({ code:BuildingCode.create({code:"Edif2"}).getValue(),
			name: "Edif2",
			description: "Building to use for unity tests",
			width: 10,
			length: 10}).getValue();

			const passage = Passage.create({
				codigo:PassageCode.create({code:'Unity'}).getValue(),
				codeBuilding1: 'Edif',
				codeBuilding2: 'Edif2',
				FloorBuilding1Name: 'Floor1Edif',
				FloorBuilding2Name: 'Floor2Edif2',
			}).getValue();
	
			when(BuildingRepo.findByBuildingCode(codeBuilding1)).thenReturn(Promise.resolve(building1));
			when(BuildingRepo.findByBuildingCode(codeBuilding2)).thenReturn(Promise.resolve(building2));
			when(FloorRepo.findFloor(FloorBuilding1Name)).thenReturn(Promise.resolve(floor1));
			when(FloorRepo.findFloor(FloorBuilding2Name)).thenReturn(Promise.resolve(floor2));
			when(PassageRepo.findByPassageCode(passageDTO.codigo)).thenReturn(Promise.resolve(passage));
	
			// Act
			const result = await passageService.updatePassage(passageDTO);
		
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Passage not found');
			verify(BuildingRepo.findByBuildingCode(codeBuilding1)).once();
			verify(BuildingRepo.findByBuildingCode(codeBuilding2)).once();
			verify(FloorRepo.findFloor(FloorBuilding1Name)).once();
			verify(FloorRepo.findFloor(FloorBuilding2Name)).once();
		});
  	});

	describe('ListAllPassage', function () {
		it('should return a failure result when there are no passages in database', async function () {
			// Arrange
			when(PassageRepo.findAll()).thenReturn(Promise.resolve([]));

			// Act
			const result = await passageService.listAllFloorsWithPassage();
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('No floors with passages found');
		});

		it('should return a succes result with passages when there are passages in the database', async function () {
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
			// Arrange
			const floorBuilding1Name = 'floor1';
			const floorBuilding2Name = 'floor2';
			const floor1 = Floor.create({ name: floorBuilding1Name,
				buildingCode: 'building1',
				width: 10,
				length: 10,
				description: "floor1b1",
				level: 1,
				rooms: [],
				plant: testMapProps.getValue(), });
			const floor2 = Floor.create({name: floorBuilding2Name,
				buildingCode: 'building2',
				width: 10,
				length: 10,
				description: "floor1b2",
				level: 1,
				rooms: [],
				plant: testMapProps.getValue(),});
			const passage = Passage.create({ codigo:PassageCode.create({code:'pass1'}).getValue(), 
				codeBuilding1: 'building1', 
				codeBuilding2: 'building2', 
				FloorBuilding1Name: floorBuilding1Name, 
				FloorBuilding2Name: floorBuilding2Name });

			when(PassageRepo.findAll()).thenReturn( Promise.resolve( [passage.getValue()] ));
			when(FloorRepo.getFloorByName(floorBuilding1Name)).thenReturn( Promise.resolve(floor1.getValue()) );
			when(FloorRepo.getFloorByName(floorBuilding2Name)).thenReturn( Promise.resolve(floor2.getValue()) );

			// Act
			const result = await passageService.listAllFloorsWithPassage();
			// Assert
			expect(result.isFailure).to.be.false;
			expect(result.getValue()).to.be.an('array');
			expect(result.getValue()).to.have.lengthOf(2);
			expect(result.getValue()[0].name).to.equal(floorBuilding1Name);
			expect(result.getValue()[1].name).to.equal(floorBuilding2Name);
		});
	});

	describe('getPassagesBuilding', function () {
		it('should return a failure result when the buildingCodes does not exist', async function () {
			const building1code = 'invalid';
			const building2code = 'b2';
			// Arrange
			when(BuildingRepo.findByBuildingCode(building1code)).thenReturn(Promise.resolve(null));
			when(BuildingRepo.findByBuildingCode(building2code)).thenReturn(Promise.resolve(null));
			when(PassageRepo.findByBuildingCodes( building1code,building2code)).thenReturn(Promise.resolve([]));

			// Act
			const result = await passageService.getPassagesBuilding(building1code,building2code);
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Invalid building code');
		});

		it('should return a failure result when the are no passages between two buildings', async function () {
			const building1code = 'b1';
			const building2code = 'b2';

			const building1 = Building.create({ name: 'building1', code:BuildingCode.create({code:building1code}).getValue(), description: "building1", width: 10, length: 10 });
			const building2 = Building.create({ name: 'building2', code: BuildingCode.create({code:building2code}).getValue(), description: "building2", width: 10, length: 10 });
			// Arrange
			when(BuildingRepo.findByBuildingCode(building1code)).thenReturn(Promise.resolve(building1.getValue()));
			when(BuildingRepo.findByBuildingCode(building2code)).thenReturn(Promise.resolve(building2.getValue()));
			when(PassageRepo.findByBuildingCodes( building1code,building2code)).thenReturn(Promise.resolve([]));

			// Act
			const result = await passageService.getPassagesBuilding(building1code,building2code);
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('No passages in building found');
		});
		
		it('should return a succes result when there are passages between two buildings', async function () {
			const building1code = 'b1';
			const building2code = 'b2';
			const building1 = Building.create({ name: 'building1',code:BuildingCode.create({code:building1code}).getValue(), description: "building1", width: 10, length: 10 });
			const building2 = Building.create({ name: 'building2',code:BuildingCode.create({code:building2code}).getValue(), description: "building2", width: 10, length: 10 });
			const passage = Passage.create({codigo:PassageCode.create({code:'pass1'}).getValue(), 
				codeBuilding1: building1code, 
				codeBuilding2: building2code, 
				FloorBuilding1Name: "floorBuilding1Name", 
				FloorBuilding2Name: "floorBuilding2Name" });
			// Arrange
			when(BuildingRepo.findByBuildingCode(building1code)).thenReturn(Promise.resolve(building1.getValue()));
			when(BuildingRepo.findByBuildingCode(building2code)).thenReturn(Promise.resolve(building2.getValue()));
			when(PassageRepo.findByBuildingCodes( building1code,building2code)).thenReturn(Promise.resolve([passage.getValue()]));


			// Act
			const result = await passageService.getPassagesBuilding(building1code,building2code);
			// Assert
			expect(result.isFailure).to.be.false;
			expect(result.getValue()).to.be.an('array');
			expect(result.getValue()).to.have.lengthOf(1);
			expect(result.getValue()[0].codeBuilding1).to.equal(building1code);
			expect(result.getValue()[0].codeBuilding2).to.equal(building2code);
		});
	});

	describe('createPassage', function (){
		it('should return a failure result when building 1 does not exist', async function () {
			// Arrange
			const passageDTO = {
			  codigo: 'P001',
			  codeBuilding1: 'B001',
			  codeBuilding2: 'B002',
			  FloorBuilding1Name: 'Floor 1',
			  FloorBuilding2Name: 'Floor 2',
			};
			when(BuildingRepo.findByBuildingCode(passageDTO.codeBuilding1)).thenReturn(Promise.resolve(null));
		
			// Act
			const result = await passageService.createPassage(passageDTO);
		
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Building 1 does not exist');
		  });
		
		it('should return a failure result when building 2 does not exist', async function () {
		// Arrange
		const passageDTO = {
			codigo: 'P001',
			codeBuilding1: 'B001',
			codeBuilding2: 'B002',
			FloorBuilding1Name: 'Floor 1',
			FloorBuilding2Name: 'Floor 2',
		};
		const buildingDTO: IBuildingDTO = {
			code:BuildingCode.create({code:"B001"}).getValue().code ,
			name: "edificioteste",
			description: "edificio teste",
			width: 10,
			length: 10,
		};

		const building= {
			code:BuildingCode.create({code:"B001"}).getValue() ,
			name: "edificioteste",
			description: "edificio teste",
			width: 10,
			length: 10,
		};
		const buildingExpected = Building.create(building);
		when(BuildingRepo.findByBuildingCode(passageDTO.codeBuilding1)).thenReturn(Promise.resolve(buildingExpected.getValue()));
		when(BuildingRepo.findByBuildingCode(passageDTO.codeBuilding2)).thenReturn(Promise.resolve(null));
		// Act
		const result = await passageService.createPassage(passageDTO);
	
		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('Building 2 does not exist');
		});
	
		it('should return a failure result when floor 1 does not exist', async function () {
		// Arrange
		const passageDTO = {
			codigo: 'P001',
			codeBuilding1: 'B001',
			codeBuilding2: 'B002',
			FloorBuilding1Name: 'Floor 1',
			FloorBuilding2Name: 'Floor 2',
		};
		const buildingDTO: IBuildingDTO = {
				code: "B001",
				name: "edificioteste",
				description: "edificio teste",
				width: 10,
				length: 10,
		};
		const buildingDTO2: IBuildingDTO = {
				code: "B002",
				name: "edificioteste2",
				description: "edificio teste2",
				width: 10,
				length: 10,
		}
        const building= {
			code:BuildingCode.create({code:"B001"}).getValue() ,
			name: "edificioteste",
			description: "edificio teste",
			width: 10,
			length: 10,
		};
		const building2= {
			code:BuildingCode.create({code:"B002"}).getValue() ,
			name: "edificioteste2",
			description: "edificio teste2",
			width: 10,
			length: 10,
		};
		
		const buildingExpected = Building.create(building);
		const buildingExpected2 = Building.create(building2);
		when(BuildingRepo.findByBuildingCode(passageDTO.codeBuilding1)).thenReturn(Promise.resolve(buildingExpected.getValue()));
		when(BuildingRepo.findByBuildingCode(passageDTO.codeBuilding2)).thenReturn(Promise.resolve(buildingExpected2.getValue()));
		when(FloorRepo.findFloor(passageDTO.FloorBuilding1Name)).thenReturn(Promise.resolve(null));
	
		// Act
		const result = await passageService.createPassage(passageDTO);
	
		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('Floor 1 does not exist');
		});

		it('should return a failure result when passage already exists', async function () {
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
			// Arrange
			const passageDTO = {
			  codigo: 'P001',
			  codeBuilding1: 'B001',
			  codeBuilding2: 'B002',
			  FloorBuilding1Name: 'Floor 1',
			  FloorBuilding2Name: 'Floor 2',
			};

			const passage = {
				codigo: PassageCode.create({code:'P001'}).getValue(),
				codeBuilding1: 'B001',
				codeBuilding2: 'B002',
				FloorBuilding1Name: 'Floor 1',
				FloorBuilding2Name: 'Floor 2',
			  };

			const building= {
				code:BuildingCode.create({code:"B001"}).getValue() ,
				name: "edificioteste",
				description: "edificio teste",
				width: 10,
				length: 10,
			};
			const buildingDTO2 = {
				code:BuildingCode.create({code:"B002"}).getValue(),
				name: "edificioteste2",
				description: "edificio teste2",
				width: 10,
				length: 10,
			}
			const buildingExpected = Building.create(building);
			const buildingExpected2 = Building.create(buildingDTO2);
			const floor1 = Floor.create({
				name: "Floor 1",
				description: "Bug testing",
				buildingCode: "B001",
				level: 1,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
			const floor2 = Floor.create({
				name: "Floor 2",
				description: "Bug testing",
				buildingCode: "B002",
				level: 2,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			when(BuildingRepo.findByBuildingCode(passageDTO.codeBuilding1)).thenReturn(Promise.resolve(buildingExpected.getValue()));
			when(BuildingRepo.findByBuildingCode(passageDTO.codeBuilding2)).thenReturn(Promise.resolve(buildingExpected2.getValue()));
			when(FloorRepo.findFloor(passageDTO.FloorBuilding1Name)).thenReturn(Promise.resolve(floor1));
			when(FloorRepo.findFloor(passageDTO.FloorBuilding2Name)).thenReturn(Promise.resolve(floor2));
		
			// Create a passage with the same code
			const existingPassage = Passage.create(passage).getValue();
			when(PassageRepo.findByPassageCode(passageDTO.codigo)).thenReturn(Promise.resolve(existingPassage));
			PassageRepo.save(existingPassage);
		
			// Act
			const result = await passageService.createPassage(passageDTO);
		
			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Passage already exists');
		});
		
		it('should return a success result when passage is created', async function () {
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
			// Arrange
			const passageDTO = {
				codigo: 'P001',
				codeBuilding1: 'B001',
				codeBuilding2: 'B002',
				FloorBuilding1Name: 'Floor 1',
				FloorBuilding2Name: 'Floor 2',
			  };
               
			  const passage2 = {
				codigo: PassageCode.create({code:'P001'}).getValue(),
				codeBuilding1: 'B001',
				codeBuilding2: 'B002',
				FloorBuilding1Name: 'Floor 1',
				FloorBuilding2Name: 'Floor 2',
			  };

			  const buildingDTO= {
				code:BuildingCode.create({code:"B001"}).getValue() ,
				name: "edificioteste",
				description: "edificio teste",
				width: 10,
				length: 10,
			};
			const buildingDTO2 = {
				code:BuildingCode.create({code:"B002"}).getValue(),
				name: "edificioteste2",
				description: "edificio teste2",
				width: 10,
				length: 10,
			}
			  const buildingExpected = Building.create(buildingDTO);
			  const buildingExpected2 = Building.create(buildingDTO2);
			  const floor1 = Floor.create({
				  name: "Floor 1",
				  description: "Bug testing",
				  buildingCode: "B001",
				  level: 1,
				  width: 10,
				  length: 10,
				  plant: testMapProps.getValue(),
				  rooms: []
			  }).getValue();
			  const floor2 = Floor.create({
				  name: "Floor 2",
				  description: "Bug testing",
				  buildingCode: "B002",
				  level: 2,
				  width: 10,
				  length: 10,
				  plant: testMapProps.getValue(),
				  rooms: []
			  }).getValue();
  
			  when(BuildingRepo.findByBuildingCode(passageDTO.codeBuilding1)).thenReturn(Promise.resolve(buildingExpected.getValue()));
			  when(BuildingRepo.findByBuildingCode(passageDTO.codeBuilding2)).thenReturn(Promise.resolve(buildingExpected2.getValue()));
			  when(FloorRepo.findFloor(passageDTO.FloorBuilding1Name)).thenReturn(Promise.resolve(floor1));
			  when(FloorRepo.findFloor(passageDTO.FloorBuilding2Name)).thenReturn(Promise.resolve(floor2));

			  const passage = Passage.create(passage2).getValue();
			  when(PassageRepo.findByPassageCode(passageDTO.codigo)).thenReturn(Promise.resolve(null));
			  when(PassageRepo.save(passage)).thenReturn(Promise.resolve(passage));

			  // Act
			  const result = await passageService.createPassage(passageDTO);
		
			// Assert
			expect(result.isSuccess).to.be.true;
			
			expect(result.getValue().FloorBuilding1Name).to.deep.equal(passageDTO.FloorBuilding1Name);
			expect(result.getValue().FloorBuilding2Name).to.deep.equal(passageDTO.FloorBuilding2Name);
			expect(result.getValue().codeBuilding1).to.deep.equal(passageDTO.codeBuilding1);
			expect(result.getValue().codeBuilding2).to.deep.equal(passageDTO.codeBuilding2);
		  });

	});
});
