import 'reflect-metadata';
import sinon from 'sinon';
import IBuildingDTO from '../../../src/dto/IBuildingDTO';
import IFloorDTO from '../../../src/dto/IFloorDTO';
import BuildingService from '../../../src/services/buildingService';
import FloorService from '../../../src/services/floorService';
import { Request, Response } from 'express';
import { Result } from '../../../src/core/logic/Result';
import { Container } from 'typedi';
import PassageService from "../../../src/services/passageService";
import PassageController from "../../../src/controllers/passageController";
import IPassageDTO from '../../../src/dto/IPassageDTO';
import { Floor } from '../../../src/domain/floor';
import { Passage } from '../../../src/domain/passage';
import { MapMap } from '../../../src/mappers/MapMap';
import {Map} from '../../../src/domain/map';
import { map } from 'lodash';

declare module 'express-serve-static-core' {
    interface Request {
      token?: any;
    }
  }

describe('passage controller', function () {
	let buildingService: BuildingService;
  	let floorService: FloorService;
	let passageService: PassageService;
  	let passageController: PassageController;

	beforeEach(function() {
		buildingService = sinon.createStubInstance(BuildingService);
        floorService = sinon.createStubInstance(FloorService);
		passageService = sinon.createStubInstance(PassageService);
        passageController = new PassageController(passageService);
    });

	describe('createPassage', () => {
		it('should return a 201 status code and the updated passage when successful', async function () {
			// Arrange
			let requestBody = {
				"codigo": '123',
				"codeBuilding1": 'A',
				"codeBuilding2": 'B',
				"FloorBuilding1Name": 'First Floor',
				"FloorBuilding2Name": 'Second Floor'
			};

			let req: Partial<Request> = {
				body: requestBody,
				token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
			};

			let res: Partial<Response> = {
				json: sinon.stub(),
				status: sinon.stub().returnsThis(),
				send: sinon.stub()
			}

			const passageDTO = {
				codigo: '123',
				codeBuilding1: 'A',
				codeBuilding2: 'B',
				FloorBuilding1Name: 'First Floor',
				FloorBuilding2Name: 'Second Floor'
			};

			(passageService.createPassage as sinon.SinonStub).resolves(Result.ok<IPassageDTO>(passageDTO));

			// Act
			await passageController.createPassage(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
		});

		it('should return a 400 status code and the error message when the building creation fails', async function () {	
			// Arrange
			let requestBody = {
				"codigo": null,
				"codeBuilding1": 'A',
				"codeBuilding2": 'B',
				"FloorBuilding1Name": 'First Floor',
				"FloorBuilding2Name": 'Second Floor'
			};

			let req: Partial<Request> = {
				body: requestBody,
				token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
			};

			let res: Partial<Response> = {
				json: sinon.stub(),
				status: sinon.stub().returnsThis(),
				send: sinon.stub()
			}

			const passageDTO = {
				codigo: null as any,
				codeBuilding1: 'A',
				codeBuilding2: 'B',
				FloorBuilding1Name: 'First Floor',
				FloorBuilding2Name: 'Second Floor'
			};

			(passageService.createPassage as sinon.SinonStub).resolves(Result.fail<IPassageDTO>("Passage not created"));

			// Act
			await passageController.createPassage(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
			sinon.assert.calledWith(res.send as sinon.SinonStub, "Passage not created");
		});
	});

	describe('updatePassage', () => {
		it('should return a 200 status code and the updated passage when successful', async function () {
			// Arrange
			let requestBody = {
				"codigo": '123',
				"codeBuilding1": 'A',
				"codeBuilding2": 'B',
				"FloorBuilding1Name": 'First Floor',
				"FloorBuilding2Name": 'Second Floor'
			};

			let req: Partial<Request> = {
				body: requestBody,
				token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
			};

			let res: Partial<Response> = {
				json: sinon.stub(),
				status: sinon.stub().returnsThis(),
				send: sinon.stub()
			}

			const passageDTO = {
				codigo: '123',
				codeBuilding1: 'A',
				codeBuilding2: 'B',
				FloorBuilding1Name: 'First Floor',
				FloorBuilding2Name: 'Second Floor'
			};

			(passageService.updatePassage as sinon.SinonStub).resolves(Result.ok<IPassageDTO>(passageDTO));

			// Act
			await passageController.updatePassage(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
		});

		it('should return a 400 status code and the error message when the passage update fails', async function () {	
			// Arrange
			let requestBody = {
				"codigo": null,
				"codeBuilding1": 'A',
				"codeBuilding2": 'B',
				"FloorBuilding1Name": 'First Floor',
				"FloorBuilding2Name": 'Second Floor'
			};

			let req: Partial<Request> = {
				body: requestBody,
				token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
			};

			let res: Partial<Response> = {
				json: sinon.stub(),
				status: sinon.stub().returnsThis(),
				send: sinon.stub()
			}

			const passageDTO = {
				codigo: null as any,
				codeBuilding1: 'A',
				codeBuilding2: 'B',
				FloorBuilding1Name: 'First Floor',
				FloorBuilding2Name: 'Second Floor'
			};

			(passageService.updatePassage as sinon.SinonStub).resolves(Result.fail<IPassageDTO>("Passage not found"));

			// Act
			await passageController.updatePassage(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
			sinon.assert.calledWith(res.send as sinon.SinonStub, "Passage not found");
		});
	});

	describe('getFloorsWithPassage', () => {
		it('should return a 200 status code and return the list of floors with passage when successful', async function () {
			// Arrange
			let requestBody = {
				"codigo": '123',
				"codeBuilding1": 'A',
				"codeBuilding2": 'B',
				"FloorBuilding1Name": 'First Floor',
				"FloorBuilding2Name": 'Second Floor'
			};

			let req: Partial<Request> = {
				body: requestBody,
				token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
			};

			let res: Partial<Response> = {
				json: sinon.stub(),
				status: sinon.stub().returnsThis(),
				send: sinon.stub()
			}

			const passageDTO = {
				codigo: '123',
				codeBuilding1: 'A',
				codeBuilding2: 'B',
				FloorBuilding1Name: 'First Floor',
				FloorBuilding2Name: 'Second Floor'
			};

			const testMapProps = Map.create ({
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
				  exitFloor: ["floor0ab"],
				  rooms: [],
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

			const floorDTOs = [
                {
                    name: 'Floor1',
                    description: 'Description',
                    buildingCode: "Edif",
                    level: '1',
                    width: '10',
                    length: '10',
                    rooms: [],
                    plant: MapMap.toDTO(testMapProps.getValue()),
                },
                {
                    name: 'Floor2',
                    description: 'Description',
                    buildingCode: "Edif",
                    level: '2',
                    width: '10',
                    length: '10',
                    rooms: [],
                    plant: MapMap.toDTO(testMapProps.getValue()),
                },
            ];

			(passageService.listAllFloorsWithPassage as sinon.SinonStub).resolves(Result.ok<IFloorDTO[]>(floorDTOs));

			// Act
			await passageController.getFloorsWithPassage(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
		});

		it('should return a 400 status code and the error message when the there areno floors with passage fails', async function () {	
			// Arrange
			let requestBody = {
				"codigo": null,
				"codeBuilding1": 'A',
				"codeBuilding2": 'B',
				"FloorBuilding1Name": 'First Floor',
				"FloorBuilding2Name": 'Second Floor'
			};

			let req: Partial<Request> = {
				body: requestBody,
				token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
			};

			let res: Partial<Response> = {
				json: sinon.stub(),
				status: sinon.stub().returnsThis(),
				send: sinon.stub()
			}

			const passageDTO = {
				codigo: null as any,
				codeBuilding1: 'A',
				codeBuilding2: 'B',
				FloorBuilding1Name: 'First Floor',
				FloorBuilding2Name: 'Second Floor'
			};

			(passageService.listAllFloorsWithPassage as sinon.SinonStub).resolves(Result.fail<IFloorDTO[]>("No floors with passages found"));

			// Act
			await passageController.getFloorsWithPassage(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
			sinon.assert.calledWith(res.send as sinon.SinonStub, "No floors with passages found");
		});
	});


	describe('getPassagesBuilding', () => {
		it('should return a 200 status code and return a list of passages when successful', async function () {
			// Arrange
			let requestBody = {
				"codeBuilding1": 'A',
        		"codeBuilding2": 'B'
			};

			let req: Partial<Request> = {
				query: requestBody,
				token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
			};

			let res: Partial<Response> = {
				json: sinon.stub(),
				status: sinon.stub().returnsThis(),
				send: sinon.stub()
			}

			const passageDTOs = [{
				codigo: '123',
				codeBuilding1: 'A',
				codeBuilding2: 'B',
				FloorBuilding1Name: 'First Floor',
				FloorBuilding2Name: 'Second Floor'
			},
			{
				codigo: '1234',
				codeBuilding1: 'A',
				codeBuilding2: 'B',
				FloorBuilding1Name: 'First Floor',
				FloorBuilding2Name: 'Second Floor'
			}];

			(passageService.getPassagesBuilding as sinon.SinonStub).resolves(Result.ok<IPassageDTO[]>(passageDTOs));

			// Act
			await passageController.getPassagesBuilding(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
		});

		it('should return a 400 status code and the error message when there are no passages in that building creation fails', async function () {	
			// Arrange
			let requestBody = {
				"codeBuilding1": 'A',
				"codeBuilding2": 'B'
			};

			let req: Partial<Request> = {
				query: requestBody,
				token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
			};

			let res: Partial<Response> = {
				json: sinon.stub(),
				status: sinon.stub().returnsThis(),
				send: sinon.stub()
			}

			const passageDTO = {
				codigo: null as any,
				codeBuilding1: 'A',
				codeBuilding2: 'B',
				FloorBuilding1Name: 'First Floor',
				FloorBuilding2Name: 'Second Floor'
			};

			(passageService.getPassagesBuilding as sinon.SinonStub).resolves(Result.fail<IPassageDTO[]>("No passages in building found"));

			// Act
			await passageController.getPassagesBuilding(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
			sinon.assert.calledWith(res.send as sinon.SinonStub, "No passages in building found");
		});
	});

});