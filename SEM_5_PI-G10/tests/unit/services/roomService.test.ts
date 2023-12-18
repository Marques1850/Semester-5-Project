// Import necessary packages
import { when, mock, instance, verify } from 'ts-mockito';
import 'reflect-metadata';
import { expect } from 'chai';
import { Result } from '../../../src/core/logic/Result';
import  IRoomDTO from '../../../src/dto/IRoomDTO';
import RoomService from '../../../src/services/roomService';
import IFloorRepo from '../../../src/services/IRepos/IFloorRepo';
import { RoomMap } from '../../../src/mappers/RoomMap';
import { room } from '../../../src/domain/room';
import { Roomtype } from '../../../src/domain/roomtype';
import { Floor } from '../../../src/domain/floor';
import {Map} from '../../../src/domain/map';


describe('RoomService', () => {
	let roomService: RoomService;
	let FloorRepo: IFloorRepo;
  
	beforeEach(() => {
	  FloorRepo = mock<IFloorRepo>();
	  roomService = new RoomService(instance(FloorRepo));
	});
  
	describe('createRoom', () => {
	  it('should create a room and add it to the floor', async () => {
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
		const floorName = 'Floor1Edif';
		const roomDTO: IRoomDTO = {
		  name: 'testRoom',
		  description: 'testDescription',
		  roomtype: "outro",
		};

		const floor = Floor.create({
			name: "Floor1Edif",
			description: "Bug testing",
			buildingCode: "Edif",
			level: 1,
			width: 10,
			length: 10,
			plant: testMapProps.getValue(),
			rooms: []
		}).getValue();

		const Room = room.create( {
			name: 'testRoom',
		  	description: 'testDescription',
		  	roomtype: Roomtype.Outro	
		}).getValue();
		
		when(FloorRepo.findFloor(floorName)).thenReturn(Promise.resolve(floor));
  
		// Act
		const result = await roomService.createRoom(floorName, roomDTO);
  
		// Assert
		expect(result.isSuccess).to.be.true;
		expect(result.error).to.equal(null);
		verify(FloorRepo.findFloor(floorName)).once();
	  });
  
	  it('should return a failure result if room creation fails', async () => {
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
		const floorName = 'Floor1Edif';
		const roomDTO: IRoomDTO = {
		  name: 'testRoom',
		  description: 'testDescription',
		  roomtype: "outro",
		};

		const floor = Floor.create({
			name: "Floor1Edif",
			description: "Bug testing",
			buildingCode: "Edif",
			level: 1,
			width: 10,
			length: 10,
			plant: testMapProps.getValue(),
			rooms: []
		}).getValue();
		
		when(FloorRepo.findFloor(floorName)).thenReturn(Promise.resolve(null));
  
		// Act
		const result = await roomService.createRoom(floorName, roomDTO);
  
		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal("Floor not found");
		verify(FloorRepo.findFloor(floorName)).once();
	  });
	});
  });