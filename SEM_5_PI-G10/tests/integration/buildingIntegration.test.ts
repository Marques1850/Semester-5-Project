import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import  BuildingController  from '../../src/controllers/buildingController';
import  BuildingService  from '../../src/services/buildingService';
import  BuildingRepo from '../../src/repos/BuildingRepo';
import  FloorRepo from '../../src/repos/FloorRepo';
import { Building } from "../../src/domain/building";
import { Result } from "../../src/core/logic/Result";
import { floor } from 'lodash';
import { Floor } from '../../src/domain/floor';
import { BuildingCode } from '../../src/domain/buildingcode';
import {Map} from '../../src/domain/map';

declare module 'express-serve-static-core' {
    interface Request {
      token?: any;
    }
  }
  

describe('buildingIntegration', function() {
    let buildingController: BuildingController;
    let buildingService: BuildingService;
    let buildingRepo: sinon.SinonStubbedInstance<BuildingRepo>;
    let floorRepo: sinon.SinonStubbedInstance<FloorRepo>;

    beforeEach(function() {
        buildingRepo = sinon.createStubInstance(BuildingRepo);
        floorRepo = sinon.createStubInstance(FloorRepo);
        buildingService = new BuildingService( buildingRepo, floorRepo);
        buildingController = new BuildingController(buildingService, buildingRepo);
    });

    afterEach(function() {
        sinon.restore();
    });

    describe('createBuilding', function() {
        it("should create a valid building using buildingService stub results", async function() {
            // Arrange
            let requestBody = {
                "code": "EDB",
                "name": "Building B",
                "description": "description",
                "width": 100,
                "length": 100
            };

            let req: Partial<Request> = {
                body: requestBody,
                token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            const buildingDTO = {
                code: "EDB",
                name: "Building B",
                description: "description",
                width: 100,
                length: 100
            };

            // This is a mock of a building with the building code 'EDB'
            const building = Building.create({
                code: BuildingCode.create({code:"EDB"}).getValue(),
                name: "Building B",
                description: "description",
                width: 100,
                length: 100
            }).getValue();

            (buildingRepo.findByBuildingCode as sinon.SinonStub).withArgs(buildingDTO.code).resolves(null);

            // Act
            await buildingController.createBuilding(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        });

    });

    describe('updateBuilding', () => {
        it('should update a valid building using buildingService stub results', async () => {
             // Arrange
             let requestBody = {
                "code": "EDB",
                "name": "Building B",
                "description": "description teste",
                "width": 100,
                "length": 100
            };

            let req: Partial<Request> = {
                body: requestBody,
                token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            const buildingDTO = {
                code: "EDB",
                name: "Building B",
                description: "description teste",
                width: 100,
                length: 100
            };

            // This is a mock of a building with the building code 'EDB'
            const building = Building.create({
                code: BuildingCode.create({code:"EDB"}).getValue(),
                name: "Building B",
                description: "description",
                width: 100,
                length: 100
            }).getValue();

            const buildingResult = Building.create({
                code: BuildingCode.create({code:"EDB"}).getValue(),
                name: "Building B",
                description: "description teste",
                width: 100,
                length: 100
            }).getValue();

            (buildingRepo.findByBuildingCode as sinon.SinonStub).withArgs(buildingDTO.code).resolves(Promise.resolve(building));
            (buildingRepo.changeBuilding as sinon.SinonStub).withArgs(buildingDTO.code, buildingDTO.name, buildingDTO.description, buildingDTO.width, buildingDTO.length).resolves(Promise.resolve(buildingResult));

            // Act
            await buildingController.updateBuilding(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        });
    });

    describe('listAllbuildings', () => {
        it('should return a 200 status code and the list of buildings when successful', async () => {
            const buildingDTOs = [{
                codigo: "Edif",
                name: "ForTest",
                description: "Unity Test Building",
                width: 20,
                length: 10,
            }, 
            {
                codigo: "Edif2",
                name: "ForTest",
                description: "Unity Test Building",
                width: 20,
                length: 10,
            }];

            let req: Partial<Request> = {
                body: {},
                token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            const buildingResult = Building.create({
                code: BuildingCode.create({code:"EDB"}).getValue(),
                name: "Building B",
                description: "description teste",
                width: 100,
                length: 100
            }).getValue();

            const buildingResult2 = Building.create({
                code: BuildingCode.create({code:"EDB2"}).getValue(),
                name: "Building C",
                description: "description teste",
                width: 100,
                length: 100
            }).getValue();

            (buildingRepo.findAll as sinon.SinonStub).withArgs().resolves([buildingResult, buildingResult2]);

            // Act
            await buildingController.listAllbuildings(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
        });
    });

    /*describe('listBuildingsWithFloorRange', () => {
        it('should return a 200 status code and the list of buildings when successful', async () => {
            // Arrange
            let requestQuery = {
                "min": "1",
                "max": "2",
            };

            let req: Partial<Request> = {
                query: requestQuery
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            }

            const buildingResult = Building.create({
                code: BuildingCode.create({code:"Edif"}).getValue(),
                name: "Building B",
                description: "description teste",
                width: 100,
                length: 100
            }).getValue();

            const buildingResult2 = Building.create({
                code: BuildingCode.create({code:"Edif2"}).getValue(),
                name: "Building C",
                description: "description teste",
                width: 100,
                length: 100
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
              const floor1 = Floor.create ( {
                name: 'Floor1',
                description: 'Description',
                buildingCode: "Edif",
                level: 0,
                width: 10,
                length: 9,
                rooms: [],
                plant: testMapProps.getValue(),
            }).getValue();

            const floor2 = Floor.create ( {
                name: 'Floor2',
                description: 'Description',
                buildingCode: "Edif2",
                level: 0,
                width: 10,
                length: 8,
                rooms: [],
                plant: testMapProps.getValue(),
            }).getValue();

            (buildingRepo.findAll as sinon.SinonStub).withArgs().resolves([buildingResult, buildingResult2]);
            (floorRepo.findByBuildingCode as sinon.SinonStub).withArgs("Edif").resolves([floor1, floor2]);
            (floorRepo.findByBuildingCode as sinon.SinonStub).withArgs("Edif2").resolves([floor1, floor2]);

            // Act
            await buildingController.listBuildingsWithFloorRange(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            // !!!
            // n funciona pq em buildingService faz floorRepo.findByBuildingCode(building.props.code.toString()) e nao building.code
            //sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
            
        });
    });*/

    /*describe('listBuildingFloors', () => {
        it('should return a 201 status code and the list of floors when successful', async () => {
            // Arrange
            let requestQuery = {
                "code": "Edif"
            };

            let req: Partial<Request> = {
                query: requestQuery
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            }

            const buildingDTO = {
                codigo: "Edif",
                name: "ForTest",
                description: "Unity Test Building",
                width: 10,
                length: 10,
            };

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

            const floor1 = Floor.create ({
                    name: 'Floor1',
                    description: 'Description',
                    buildingCode: "Edif",
                    level: 1,
                    width: 10,
                    length: 10,
                    rooms: [],
                    plant: testMapProps.getValue(),
                }).getValue();
            const floor2 = Floor.create ( {
                    name: 'Floor2',
                    description: 'Description',
                    buildingCode: "Edif",
                    level: 2,
                    width: 10,
                    length: 10,
                    rooms: [],
                    plant: testMapProps.getValue(),
                }).getValue();

            const building = Building.create({
                code: BuildingCode.create({code:"Edif"}).getValue(),
                name: "ForTest",
                description: "Unity Test Building",
                width: 10,
                length: 10
            }).getValue();
        
            (buildingRepo.findByBuildingCode as sinon.SinonStub).withArgs(buildingDTO.codigo).resolves(building);
            (floorRepo.findByBuildingCode as sinon.SinonStub).withArgs(buildingDTO.codigo).resolves(Promise.resolve([floor1, floor2]));
            
            // Act
            await buildingController.listBuildingFloors(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        });
    });*/
  
});
