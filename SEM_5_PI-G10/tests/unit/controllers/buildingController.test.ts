import sinon from 'sinon';
import BuildingController from '../../../src/controllers/buildingController';
import IBuildingDTO from '../../../src/dto/IBuildingDTO';
import IFloorDTO from '../../../src/dto/IFloorDTO';
import BuildingService from '../../../src/services/buildingService';
import FloorService from '../../../src/services/floorService';
import { Request, Response } from 'express';
import { Result } from '../../../src/core/logic/Result';
import {Map} from '../../../src/domain/map';
import { MapMap } from '../../../src/mappers/MapMap';

declare module 'express-serve-static-core' {
    interface Request {
      token?: any;
    }
  }


describe('BuildingController', () => {
  let buildingService: BuildingService;
  let floorService: FloorService;
  let buildingController: BuildingController;


    beforeEach( function() {
        buildingService = sinon.createStubInstance(BuildingService);
        floorService = sinon.createStubInstance(FloorService);
        buildingController = new BuildingController(buildingService, floorService);
    });

    describe('createBuilding', () => {
        it('should return a 201 status code and the created building when successful', async () => {
            // Arrange
            let requestBody = {
                "code": "Edif",
                "name": "ForTest",
                "description": "Unity Test Building",
                "width": 10,
                "length": 10,
            };
    
            let req: Partial<Request> = {
                body: requestBody,
                token: { role: "5d81e810-5fdd-4e0f-8b80-5cd97198a145" }
            };
    
            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            }

            const buildingDTO = {
                code: "Edif",
                name: "ForTest",
                description: "Unity Test Building",
                width: 10,
                length: 10,
            };
    
            (buildingService.createBuilding as sinon.SinonStub).resolves(Result.ok<IBuildingDTO>(buildingDTO));
    
            // Act
            await buildingController.createBuilding(req as Request, res as Response, () => {});
    
            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        });
        
        it('should return a 400 status code and the error message when the building creation fails', async () => {
            // Arrange
            let requestBody = {
                "code": null,
                "name": "ForTest",
                "description": "Unity Test Building",
                "width": 10,
                "length": 10,
            };
    
            let req: Partial<Request> = {
                body: requestBody,
                token: { role: "5d81e810-5fdd-4e0f-8b80-5cd97198a145" }
            };
    
            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            }

            const buildingDTO = {
                code: null as any,
                name: "ForTest",
                description: "Unity Test Building",
                width: 10,
                length: 10,
            };
    
            (buildingService.createBuilding as sinon.SinonStub).resolves(Result.fail<IBuildingDTO>("Building already exists with code=" + buildingDTO.code));
    
            // Act
            await buildingController.createBuilding(req as Request, res as Response, () => {});
    
            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
            sinon.assert.calledWith(res.send as sinon.SinonStub, "Building already exists with code=" + buildingDTO.code);
        });
        
    });

    describe('updateBuilding', () => {
        it('should return a 201 status code and the updated building when successful', async () => {
            // Arrange
            let requestBody = {
                "code": "Edif",
                "name": "ForTest",
                "description": "Unity Test Building",
                "width": 20,
                "length": 10,
            };

            let req: Partial<Request> = {
                body: requestBody,
                token: { role: "5d81e810-5fdd-4e0f-8b80-5cd97198a145" }
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            }

            const buildingDTO = {
                code: "Edif",
                name: "ForTest",
                description: "Unity Test Building",
                width: 20,
                length: 10,
            };

            (buildingService.updateBuilding as sinon.SinonStub).resolves(Result.ok<IBuildingDTO>(buildingDTO));

            // Act
            await buildingController.updateBuilding(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        });

        it('should return a 400 status code and the error message when the building update fails', async () => {
            // Arrange
            let requestBody = {
                "code": "Edif",
                "name": "ForTest",
                "description": "Unity Test Building",
                "width": 20,
                "length": 10,
            };

            let req: Partial<Request> = {
                body: requestBody,
                token: { role: "5d81e810-5fdd-4e0f-8b80-5cd97198a145" }
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            }

            const buildingDTO = {
                code: "Edif",
                name: "ForTest",
                description: "Unity Test Building",
                width: 20,
                length: 10,
            };

            (buildingService.updateBuilding as sinon.SinonStub).resolves(Result.fail<IBuildingDTO>("error updating building"));

            // Act
            await buildingController.updateBuilding(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
            sinon.assert.calledWith(res.send as sinon.SinonStub, "error updating building");
        });

    });

    describe('listAllbuildings', () => {
        it('should return a 200 status code and the list of buildings when successful', async () => {
            const buildingDTOs = [{
                code: "Edif",
                name: "ForTest",
                description: "Unity Test Building",
                width: 20,
                length: 10,
            }, 
            {
                code: "Edif2",
                name: "ForTest",
                description: "Unity Test Building",
                width: 20,
                length: 10,
            }];

            let req: Partial<Request> = {
                body: {},
                token: { role: "5d81e810-5fdd-4e0f-8b80-5cd97198a145" }
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            (buildingService.listAllBuildings as sinon.SinonStub).resolves(Result.ok<IBuildingDTO[]>(buildingDTOs));

            // Act
            await buildingController.listAllbuildings(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        });

        it('should return a 400 status code and the error message when the building list fails', async () => {
            let req: Partial<Request> = {
                body: {},
                token: { role: "5d81e810-5fdd-4e0f-8b80-5cd97198a145" }
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            (buildingService.listAllBuildings as sinon.SinonStub).resolves(Result.fail<IBuildingDTO[]>("There are no buildings"));

            // Act
            await buildingController.listAllbuildings(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
            sinon.assert.calledWith(res.send as sinon.SinonStub, "There are no buildings");
        });

    });

    describe('listBuildingsWithFloorRange', () => {
        it('should return a 200 status code and the list of buildings when successful', async () => {
            // Arrange
            let requestQuery = {
                "min": "1",
                "max": "2",
            };

            let req: Partial<Request> = {
                query: requestQuery,
                token: { role: "5d81e810-5fdd-4e0f-8b80-5cd97198a145" }
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            }
            const buildingDTOs = [{
                code: "Edif",
                name: "ForTest",
                description: "Unity Test Building",
                width: 20,
                length: 10,
            }, 
            {
                code: "Edif2",
                name: "ForTest",
                description: "Unity Test Building",
                width: 20,
                length: 10,
            }];

            (buildingService.listBuildingsWithFloorsInRange as sinon.SinonStub).resolves(Result.ok<IBuildingDTO[]>(buildingDTOs));

            // Act
            await buildingController.listBuildingsWithFloorRange(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        });
        
        it('should return a 400 status code and an error message when the min and max values are not provided', async () => {
            // Arrange
            let req: Partial<Request> = {
                query: {},
                token: { role: "5d81e810-5fdd-4e0f-8b80-5cd97198a145" }
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            }
            const buildingDTOs = [{
                code: "Edif",
                name: "ForTest",
                description: "Unity Test Building",
                width: 20,
                length: 10,
            }, 
            {
                code: "Edif2",
                name: "ForTest",
                description: "Unity Test Building",
                width: 20,
                length: 10,
            }];

            (buildingService.listBuildingsWithFloorsInRange as sinon.SinonStub).resolves(Result.fail<IBuildingDTO[]>("Both min and max values are required in the query parameters."));

            // Act
            await buildingController.listBuildingsWithFloorRange(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
            sinon.assert.calledWith(res.json as sinon.SinonStub, { error: 'Both min and max values are required in the query parameters.' });
        });
        
        it('should return a 400 status code and an error message when the min and max values are not valid numbers', async () => {
            // Arrange
            let requestQuery = {
                "min": "abc",
                "max": "def",
            };

            let req: Partial<Request> = {
                query: requestQuery,
                token: { role: "5d81e810-5fdd-4e0f-8b80-5cd97198a145" }
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            }
            const buildingDTOs = [{
                code: "Edif",
                name: "ForTest",
                description: "Unity Test Building",
                width: 20,
                length: 10,
            }, 
            {
                code: "Edif2",
                name: "ForTest",
                description: "Unity Test Building",
                width: 20,
                length: 10,
            }];

            (buildingService.listBuildingsWithFloorsInRange as sinon.SinonStub).resolves(Result.fail<IBuildingDTO[]>("min and max should be valid numbers."));

            // Act
            await buildingController.listBuildingsWithFloorRange(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
            sinon.assert.calledWith(res.json as sinon.SinonStub, { error: 'min and max should be valid numbers.' });
        });
        
        it('should return a 400 status code and the error message when the building list fails', async () => {
            // Arrange
            let requestQuery = {
                "min": "1",
                "max": "2",
            };

            let req: Partial<Request> = {
                query: requestQuery,
                token: { role: "5d81e810-5fdd-4e0f-8b80-5cd97198a145" }
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            }
            const buildingDTOs = [{
                code: "Edif",
                name: "ForTest",
                description: "Unity Test Building",
                width: 20,
                length: 10,
            }, 
            {
                code: "Edif2",
                name: "ForTest",
                description: "Unity Test Building",
                width: 20,
                length: 10,
            }];

            (buildingService.listBuildingsWithFloorsInRange as sinon.SinonStub).resolves(Result.fail<IBuildingDTO[]>("Bad range of floors."));

            // Act
            await buildingController.listBuildingsWithFloorRange(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
            sinon.assert.calledWith(res.send as sinon.SinonStub, "Bad range of floors.");
        });
        
    });

    /*describe('listBuildingFloors', () => {
        it('should return a 201 status code and the list of floors when successful', async () => {
            // Arrange
            let requestQuery = {
                "code": "Edif"
            };

            let req: Partial<Request> = {
                query: requestQuery,
                token: { role: "5d81e810-5fdd-4e0f-8b80-5cd97198a145" }
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            }

            const buildingDTO = {
                code: "Edif",
                name: "ForTest",
                description: "Unity Test Building",
                width: 10,
                length: 10,
            };

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
        
            (buildingService.listBuildingFloors as sinon.SinonStub).resolves(Result.ok<IFloorDTO[]>(floorDTOs));

            // Act
            await buildingController.listBuildingFloors(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        });*/

        it('should return a 400 status code and the error message when the floor list fails', async () => {
            // Arrange
            let requestQuery = {
                "code": "Edif"
            };

            let req: Partial<Request> = {
                query: requestQuery,
                token: { role: "5d81e810-5fdd-4e0f-8b80-5cd97198a145" }
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            }

            const buildingDTO = {
                code: "Edif",
                name: "ForTest",
                description: "Unity Test Building",
                width: 10,
                length: 10,
            };

            const floorDTOs = [
                {
                    name: 'Floor1',
                    description: 'Description',
                    buildingCode: "Edif",
                    level: '1',
                    width: '10',
                    length: '10',
                    rooms: [],
                    plant: [[]],
                },
                {
                    name: 'Floor2',
                    description: 'Description',
                    buildingCode: "Edif",
                    level: '2',
                    width: '10',
                    length: '10',
                    rooms: [],
                    plant: [[]],
                },
            ];
        
            (buildingService.listBuildingFloors as sinon.SinonStub).resolves(Result.fail<IFloorDTO[]>("Building not found"));

            // Act
            await buildingController.listBuildingFloors(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
            sinon.assert.calledWith(res.send as sinon.SinonStub, "Building not found");
        });
        
    });

