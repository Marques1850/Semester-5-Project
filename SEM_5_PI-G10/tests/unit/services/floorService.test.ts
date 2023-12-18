// Import necessary packages
import { when, mock, instance, verify,anything} from 'ts-mockito';
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
import FloorService from '../../../src/services/floorService';
import { Building } from '../../../src/domain/building';
import { BuildingCode } from '../../../src/domain/buildingcode';
import { MapMap } from '../../../src/mappers/MapMap';
import {Map} from '../../../src/domain/map';



describe('FloorService', function () {
	let BuildingRepo: IBuildingRepo;
	let FloorRepo: IFloorRepo;
	let floorService: IFloorService;

	beforeEach(function () {
		BuildingRepo = mock<IBuildingRepo>();
		FloorRepo = mock<IFloorRepo>();
		floorService = new FloorService(instance(FloorRepo), instance(BuildingRepo));
	});

	afterEach(function () {
		//sandbox.restore();
	});

	describe('createFloor', function () {
		
		it('should return a failure result when the building does not exist', async function () {
			// Arrange
			const buildingCode = 'invalid';
			const testMapProps= Map.create( {
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
			const floorDTO = {
				name: 'Floor 1',
				description: 'Description',
				buildingCode: 'invalid',
				level: '1',
				width: '10',
				length: '10',
				rooms: [],
				plant: MapMap.toDTO(testMapProps.getValue()),
			};

			when(BuildingRepo.findByBuildingCode(buildingCode)).thenReturn(Promise.resolve(null));

			// Act
			const result = await floorService.createFloor(floorDTO);

			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('That building does not exist');
			verify(BuildingRepo.findByBuildingCode(buildingCode)).once();

		});

		it('should return failure when trying to create floor 1 without floor 0', async function () {
			// Arrange
			const buildingCode = 'Edif2';
			const testMapProps= Map.create( {
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
			const building = Building.create({
				code: BuildingCode.create({code:buildingCode}).getValue(),
				name: "ForTest",
				description: "Building to use for unity tests",
				width: 10,
				length: 10
			}).getValue();

			const floorDTO = {
				name: 'Floor2',
				description: 'Description',
				buildingCode: buildingCode,
				level: '1',
				width: '10',
				length: '10',
				rooms: [],
				plant: MapMap.toDTO(testMapProps.getValue()),
			};

			when(BuildingRepo.findByBuildingCode(buildingCode)).thenReturn(Promise.resolve(building));

			// Act
			const result = await floorService.createFloor(floorDTO);

			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Building has no floors');
			verify(BuildingRepo.findByBuildingCode(buildingCode)).twice();
		});

		it('should return failure when trying to create floor 2 without floor 1', async function () {
			// Arrange
			const buildingCode = 'Edif2';

			const building = Building.create({
				code: BuildingCode.create({code:buildingCode}).getValue(),
				name: "ForTest",
				description: "Building to use for unity tests",
				width: 10,
				length: 10
			}).getValue();

			const testMapProps= Map.create( {
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

			const floorDTO = {
				name: 'Floor2',
				description: 'Description',
				buildingCode: buildingCode,
				level: '2',
				width: '10',
				length: '10',
				rooms: [],
				plant: MapMap.toDTO(testMapProps.getValue()),
			};

			const floor1 = Floor.create({
				name: "Floor0Edif2",
				description: "Bug testing",
				buildingCode: buildingCode,
				level: 0,
				width: 10,
				length: 30,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			when(BuildingRepo.findByBuildingCode(buildingCode)).thenReturn(Promise.resolve(building));
			when(FloorRepo.findByBuildingCode(buildingCode)).thenReturn(Promise.resolve([floor1]));

			// Act
			const result = await floorService.createFloor(floorDTO);

			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Floor level is not the highest');
			verify(BuildingRepo.findByBuildingCode(buildingCode)).twice();
			verify(FloorRepo.findByBuildingCode(buildingCode)).once();

		});

		it('should return success if exists floor 0 and is creating floor 1', async function () {
			// Arrange
			const buildingCode = 'Edif2';
			const testMapProps= Map.create( {
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

			const building = Building.create({
				code: BuildingCode.create({code:buildingCode}).getValue(),
				name: "ForTest",
				description: "Building to use for unity tests",
				width: 10,
				length: 10
			}).getValue();

			const floorDTO = {
				name: 'Floor2',
				description: 'Description',
				buildingCode: buildingCode,
				level: '1',
				width: '10',
				length: '10',
				rooms: [],
				plant: MapMap.toDTO(testMapProps.getValue()),
			};

			const floor1 = Floor.create({
				name: "Floor0Edif2",
				description: "Bug testing",
				buildingCode: buildingCode,
				level: 0,
				width: 10,
				length: 30,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			when(BuildingRepo.findByBuildingCode(buildingCode)).thenReturn(Promise.resolve(building));
			when(FloorRepo.findByBuildingCode(buildingCode)).thenReturn(Promise.resolve([floor1]));

			// Act
			const result = await floorService.createFloor(floorDTO);

			// Assert
			expect(result.isSuccess).to.be.true;
			expect(result.error).to.equal(null);
			verify(BuildingRepo.findByBuildingCode(buildingCode)).twice();
			verify(FloorRepo.findByBuildingCode(buildingCode)).once();
		});

		it('should return failure when trying to create floor -2 when floor -1 doesnot exsist', async function () {
			// Arrange
			const buildingCode = 'Edif2';

			const building = Building.create({
				code: BuildingCode.create({code:buildingCode}).getValue(),
				name: "ForTest",
				description: "Building to use for unity tests",
				width: 10,
				length: 10
			}).getValue();
			const testMapProps= Map.create( {
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

			const floorDTO = {
				name: 'Floor2',
				description: 'Description',
				buildingCode: buildingCode,
				level: '-2',
				width: '10',
				length: '10',
				rooms: [],
				plant: MapMap.toDTO(testMapProps.getValue()),
			};

			const floor1 = Floor.create({
				name: "Floor0Edif2",
				description: "Bug testing",
				buildingCode: buildingCode,
				level: 0,
				width: 10,
				length: 30,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			when(BuildingRepo.findByBuildingCode(buildingCode)).thenReturn(Promise.resolve(building));
			when(FloorRepo.findByBuildingCode(buildingCode)).thenReturn(Promise.resolve([floor1]));

			// Act
			const result = await floorService.createFloor(floorDTO);

			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Floor level is not the lowest');
			verify(BuildingRepo.findByBuildingCode(buildingCode)).twice();
			verify(FloorRepo.findByBuildingCode(buildingCode)).once();
		});
	});

	describe('updateFloor', function () {
		it('should return a failure result when the building does not exist', async function () {
			// Arrange
			const testMapProps= Map.create( {
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
			const floorDTO = {
				name: 'Floor 1',
				description: 'Description',
				buildingCode: 'invalid',
				level: '1',
				width: '10',
				length: '10',
				rooms: [],
				plant: MapMap.toDTO(testMapProps.getValue()),
			};
			
			const floor = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode: "Edif2",
				level: 1,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			when(FloorRepo.findFloor(floorDTO.name)).thenReturn(Promise.resolve(floor));

			// Act
			const result = await floorService.updateFloor(floorDTO);

			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Cannot change building code');
			verify(FloorRepo.findFloor(floorDTO.name)).once();
		});

		it('should return a failure result when the floor width is higher than the building width', async function () {
			// Arrange
			const testMapProps= Map.create( {
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
			const floorDTO = {
				name: 'Floor2',
				description: 'Description',
				buildingCode: 'Edif2',
				level: '0',
				width: '100',
				length: '10',
				rooms: [],
				plant: MapMap.toDTO(testMapProps.getValue()),
			};
			const floor = Floor.create({
				name: "Floor2",
				description: "Bug testing",
				buildingCode: "Edif2",
				level: 0,
				width: 10,
				length: 30,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
			const building = Building.create({
				code: BuildingCode.create({code:"Edif2"}).getValue(),
				name: "ForTest",
				description: "Building to use for unity tests",
				width: 10,
				length: 30
			}).getValue();

			when(FloorRepo.findFloor(floorDTO.name)).thenReturn(Promise.resolve(floor));
			when(BuildingRepo.findByBuildingCode(floorDTO.buildingCode)).thenReturn(Promise.resolve(building));

			// Act
			const result = await floorService.updateFloor(floorDTO);

			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Width of floor cannot be bigger than width of building');
			verify(FloorRepo.findFloor(floorDTO.name)).once();
			verify(BuildingRepo.findByBuildingCode(floorDTO.buildingCode)).once();
		});

		it('should return a failure result when the floor length is higher than the building length', async function () {
			// Arrange
			const testMapProps= Map.create( {
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
			const floorDTO = {
				name: 'Floor2',
				description: 'Description',
				buildingCode: 'Edif2',
				level: '0',
				width: '10',
				length: '100',
				rooms: [],
				plant: MapMap.toDTO(testMapProps.getValue()),
			};
			const floor = Floor.create({
				name: "Floor2",
				description: "Bug testing",
				buildingCode: "Edif2",
				level: 0,
				width: 10,
				length: 30,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
			const building = Building.create({
				code: BuildingCode.create({code:"Edif2"}).getValue(),
				name: "ForTest",
				description: "Building to use for unity tests",
				width: 10,
				length: 30
			}).getValue();

			when(FloorRepo.findFloor(floorDTO.name)).thenReturn(Promise.resolve(floor));
			when(BuildingRepo.findByBuildingCode(floorDTO.buildingCode)).thenReturn(Promise.resolve(building));

			// Act
			const result = await floorService.updateFloor(floorDTO);

			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Length of floor cannot be bigger than length of building');
			verify(FloorRepo.findFloor(floorDTO.name)).once();
			verify(BuildingRepo.findByBuildingCode(floorDTO.buildingCode)).once();
		});

		it('should return a success result when the floor is updated successfully', async function () {
			// Arrange
			const testMapProps= Map.create( {
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
			const buildingCode = 'Edif2';
			const floorDTO = {
				name: 'Floor1Edif2',
				description: 'Description',
				buildingCode: 'Edif2',
				level: '1',
				width: '10',
				length: '10',
				rooms: [],
				plant: MapMap.toDTO(testMapProps.getValue()),
			};
			const floor = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode: "Edif2",
				level: 1,
				width: 10,
				length: 5,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			const building = Building.create({
				code: BuildingCode.create({code:"Edif2"}).getValue(),
				name: "ForTest",
				description: "Building to use for unity tests",
				width: 10,
				length: 10
			}).getValue();
			
			when(FloorRepo.findFloor(floorDTO.name)).thenReturn(Promise.resolve(floor));
			when(BuildingRepo.findByBuildingCode(buildingCode)).thenReturn(Promise.resolve(building));

			// Act
			const result = await floorService.updateFloor(floorDTO);

			// Assert
			expect(result.isSuccess).to.be.true;
			expect(result.error).to.equal(null);
			verify(FloorRepo.findFloor(floorDTO.name)).once();
			verify(BuildingRepo.findByBuildingCode(buildingCode)).once();
		});
	});

	describe('uploadMapFloorinBuilding', function () {
		it('should update the floor map and return the updated floor', async function () {
			// Arrange

			const testMapProps= Map.create( {
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
			const building = Building.create({
				code: BuildingCode.create({code:"Edif2"}).getValue(),
				name: "ForTest",
				description: "Building to use for unity tests",
				width: 30,
				length: 100
			}).getValue();

			const floorDTO = {
				name: 'Floor1Edif2',
				description: 'Description',
				buildingCode: 'Edif2',
				level: '1',
				width: '10',
				length: '10',
				rooms: [],
				plant: MapMap.toDTO(testMapProps.getValue()),
			};

			const floor = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode: "Edif2",
				level: 1,
				width: 10,
				length: 30,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
			const testMapPropsUpdated = Map.create( {
				maze: {
				  size: [5, 5],
				  map: [
				  ['E', 'W', 'W', 'W', 'W'],
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

			const updatedfloor = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode: "Edif2",
				level: 1,
				width: 10,
				length: 30,
				plant: testMapPropsUpdated.getValue(),
				rooms: []
			}).getValue();

			when(FloorRepo.findFloor(floorDTO.name)).thenReturn(Promise.resolve(floor));
			when(BuildingRepo.findByBuildingCode(floor.buildingCode)).thenReturn(Promise.resolve(building));
			when(FloorRepo.uploadMapFloorinBuilding(floorDTO.name,anything() )).thenReturn(Promise.resolve(updatedfloor));

      let buffer: Buffer = new Buffer(JSON.stringify(floorDTO.plant));
     
      let str: string = buffer.toString('utf-8');
			// Act
			const result = await floorService.uploadFloorMap("Floor1Edif2",str);

			// Assert
    

			expect(result.isSuccess).to.be.true;
			expect(result.error).to.equal(null);
			expect(result.getValue().plant.toString).to.equal(floorDTO.plant.toString);
			verify(BuildingRepo.findByBuildingCode(floor.buildingCode)).once();
			verify(FloorRepo.findFloor(floorDTO.name)).once();
		});

		it('should throw an error if the floor does not exist', async function () {
			// Arrange
			const testMapProps= Map.create( {
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

			const building = Building.create({
				code: BuildingCode.create({code:"Edif2"}).getValue(),
				name: "ForTest",
				description: "Building to use for unity tests",
				width: 30,
				length: 100
			}).getValue();

			const floorDTO = {
				name: 'Floor1Edif2',
				description: 'Description',
				buildingCode: 'Edif2',
				level: '1',
				width: '10',
				length: '10',
				rooms: [],
				plant: testMapProps.getValue(),
			};

			const floor = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode: "Edif2",
				level: 1,
				width: 10,
				length: 30,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			when(FloorRepo.findFloor(floorDTO.name)).thenReturn(Promise.resolve(null));
			when(BuildingRepo.findByBuildingCode(floorDTO.buildingCode)).thenReturn(Promise.resolve(building));


			// Act
			const result = await floorService.uploadFloorMap(floorDTO.name, "OLA.com");

			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('Floor not found');
			verify(FloorRepo.findFloor(floorDTO.name)).once();
		});

		it('should throw an error if the building does not exist', async function () {

			const testMapProps= Map.create( {
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


			const floorDTO = {
				name: 'Floor1Edif2',
				description: 'Description',
				buildingCode: 'Edif2',
				level: '1',
				width: '10',
				length: '10',
				rooms: [],
				plant: [["O", "N"]],
			};

			const floor = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode: "Edif2",
				level: 1,
				width: 10,
				length: 30,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			when(FloorRepo.findFloor(floorDTO.name)).thenReturn(Promise.resolve(floor));
			when(BuildingRepo.findByBuildingCode(floor.buildingCode)).thenReturn(Promise.resolve(null));

      let buffer: Buffer = new Buffer(JSON.stringify(floorDTO.plant));
     
      let str: string = buffer.toString('utf-8');
			// Act
			const result = await floorService.uploadFloorMap(floorDTO.name, str);

			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal("Building not found");
			verify(FloorRepo.findFloor(floorDTO.name)).once();
			verify(BuildingRepo.findByBuildingCode(floor.buildingCode)).once();
		});


	});

	describe('ListBuildingFloors', function () {
		it('should return a failure result when the building does not exist', async function () {
			// Arrange
			const buildingCode = 'invalid';
			when(BuildingRepo.findByBuildingCode(buildingCode)).thenReturn(Promise.resolve(null));

			// Act
			const result = await floorService.listBuildingFloors(buildingCode);

			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('That building does not exist');
			verify(BuildingRepo.findByBuildingCode(buildingCode)).once();
		});

		it('should return a success result with the building floors if exists', async function () {
			const testMapProps= Map.create( {
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
			const buildingCode = 'Edif2';
			const floor1 = Floor.create({
				name: "Floor0Edif2",
				description: "Bug testing",
				buildingCode: "Edif2",
				level: 0,
				width: 10,
				length: 30,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();
			const floor2 = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode: "Edif2",
				level: 1,
				width: 10,
				length: 30,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

			const building = Building.create({
				code: BuildingCode.create({code:"Edif2"}).getValue(),
				name: "ForTest",
				description: "Building to use for unity tests",
				width: 10,
				length: 10
			}).getValue();

			when(BuildingRepo.findByBuildingCode(buildingCode)).thenReturn(Promise.resolve(building));
			when(FloorRepo.findByBuildingCode(buildingCode)).thenReturn(Promise.resolve([floor1, floor2]));

			// Act
			const result = await floorService.listBuildingFloors(buildingCode);

			// Assert
			expect(result.isSuccess).to.be.true;
			expect(result.error).to.equal(null);
			expect(result.getValue().length).to.equal(2);
			verify(BuildingRepo.findByBuildingCode(buildingCode)).once();
			verify(FloorRepo.findByBuildingCode(buildingCode)).once();
		});

	});

});
