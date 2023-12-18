import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import FloorController from '../../src/controllers/floorController';
import  BuildingService  from '../../src/services/buildingService';
import  ElevatorService  from '../../src/services/elevatorService';
import  FloorService  from '../../src/services/floorService';
import  BuildingRepo from '../../src/repos/BuildingRepo';
import  FloorRepo from '../../src/repos/FloorRepo';
import  ElevatorRepo from '../../src/repos/ElevatorRepo';
import { Building } from "../../src/domain/building";
import { Result } from "../../src/core/logic/Result";
import { floor } from 'lodash';
import { Floor } from '../../src/domain/floor';
import { Map } from '../../src/domain/map';
import { Readable } from 'stream';

declare module 'express-serve-static-core' {
    interface Request {
      token?: any;
    }
  }



describe('floorIntegration', function() {
    let floorController: FloorController;
    let buildingService: BuildingService;
    let floorService: FloorService;
    let elevatorService: ElevatorService;
    let buildingRepo: sinon.SinonStubbedInstance<BuildingRepo>;
    let floorRepo: sinon.SinonStubbedInstance<FloorRepo>;
    let elevatorRepo: sinon.SinonStubbedInstance<ElevatorRepo>;

    beforeEach(function() {
        buildingRepo = sinon.createStubInstance(BuildingRepo);
        floorRepo = sinon.createStubInstance(FloorRepo);
        elevatorRepo = sinon.createStubInstance(ElevatorRepo);
        buildingService = new BuildingService( buildingRepo, floorRepo);
        floorService = new FloorService(floorRepo, buildingRepo);
        elevatorService = new ElevatorService(elevatorRepo,buildingRepo);
        floorController = new FloorController(floorService, elevatorService, buildingService);
    });

    afterEach(function() {
        sinon.restore();
    });

    describe('createFloor', function() {
        it("should fail to create a floor with non existing buildingCode using floorService stub results", async function() {
            // Arrange
            let requestBody = {
                "name":"F1",
                "description": "Floor for test",
                "buildingCode": "J1",
                "level": 0,
                "width": "10",	
                "length": "10"
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

            (buildingRepo.findByBuildingCode as sinon.SinonStub).withArgs("J1").resolves(null);

            // Act
            await floorController.createFloor(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
        });

    });

    describe('updateFloor', function() {
        it("should fail to update a floor with non existing buildingCode using floorService stub results", async function() {
            // Arrange
            let requestBody = {
                "name":"F1",
                "description": "Floor for test",
                "buildingCode": "INVALID",
                "level": 0,
                "width": "10",	
                "length": "10"
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

            const floor = Floor.create({
				name: "Floor1Edif2",
				description: "Bug testing",
				buildingCode: "Edif2",
				level: 0,
				width: 10,
				length: 10,
				plant: testMapProps.getValue(),
				rooms: []
			}).getValue();

            (floorRepo.findFloor as sinon.SinonStub).withArgs("F1").resolves(floor);

            // Act
            await floorController.updateFloor(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
        });

    });

    describe('listFloorsWithElevators', function() {
        it("should fail to list floors with elevator if building doesnt have elevators using elevatorService stub results", async function() {
            // Arrange
            let requestBody = {
                "buildingCode": "J1"
            };

            let req: Partial<Request> = {
                query: requestBody,
                token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            (elevatorRepo.findByBuildingCode as sinon.SinonStub).withArgs("J1").resolves(null);

            // Act
            await floorController.listFloorsWithElevators(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
        });

    });

    describe('uploadFloorMap', function() {
        it("should fail to upload a floor map for a floor that doesnt exist using floorService stub results", async function() {
            // Arrange
            let requestBody = {
                "name":"F1",
                "plant": [["N","N","N","N","N","N","N","N","N","N"]]
            };
            let buffer=new Buffer("123");

            let req: Partial<Request> = {
                body: requestBody,
                file:{
                    buffer,
                    fieldname: '',
                    originalname: '',
                    encoding: '',
                    mimetype: '',
                    size: 0,
                    stream: new Readable,
                    destination: '',
                    filename: '',
                    path: ''
                },
                token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
            };

            let res: Partial<Response> = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            (floorRepo.findFloor as sinon.SinonStub).withArgs("F1","123").resolves(null);

            // Act
            await floorController.uploadFloorMap(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
        });

    });




  
});
