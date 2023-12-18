import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import  ElevatorController  from '../../src/controllers/elevatorController';
import  ElevatorService  from '../../src/services/elevatorService';
import  ElevatorRepo from '../../src/repos/ElevatorRepo';
import  FloorRepo from '../../src/repos/FloorRepo';
import { Elevator } from "../../src/domain/elevator";
import { elevatorType } from '../../src/domain/elevatorType';
import BuildingRepo from '../../src/repos/BuildingRepo';

declare module 'express-serve-static-core' {
    interface Request {
      token?: any;
    }
  }

describe('elevator Integration', function() {
    let elevatorController: ElevatorController;
    let elevatorService: ElevatorService;
    let elevatorRepo: sinon.SinonStubbedInstance<ElevatorRepo>;
    let buildingRepo: sinon.SinonStubbedInstance<BuildingRepo>;

    beforeEach(function() {
        elevatorRepo = sinon.createStubInstance(ElevatorRepo);
        buildingRepo = sinon.createStubInstance(BuildingRepo);
        elevatorService = new ElevatorService( elevatorRepo, buildingRepo);
        elevatorController = new ElevatorController(elevatorService);
    });

    afterEach(function() {
        sinon.restore();
    });

    describe('create Elevator', function() {
        it("should create a valid elevator using elevatorService stub results", async function() {
            // Arrange
            let requestBody = {
                "BuildingCode": "J1",
                "ElevatorCode": "E1",
                "FloorsAttended": [0,1,2],
                "ElevatorType:" :{"marca":"cringe","modelo":"jump"},
                "NumSerie": "123456789",
                "Description": "Elevator for test"
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

            const elevatorDTO = {
                BuildingCode: "J1",
                ElevatorCode: "E1",
                FloorsAttended: [0,1,2],
                ElevatorType: elevatorType.create({"marca":"cringe","modelo":"jump"}).getValue(),
                NumSerie: "123456789",
                Description: "Elevator for test"
              };
        

            
            const elevator = Elevator.create({
                    BuildingCode: "J1",
                    ElevatorCode: "E1",
                    FloorsAttended: [0,1,2],
                    ElevatorType: elevatorType.create({"marca":"cringe","modelo":"jump"}).getValue(),
                    NumSerie: "123456789",
                    Description: "Elevator for test"
                  
            
            }).getValue();

            (elevatorRepo.findByBuildingCode as sinon.SinonStub).withArgs(elevatorDTO.BuildingCode).resolves(null);
            (buildingRepo.findByBuildingCode as sinon.SinonStub).withArgs(elevatorDTO.BuildingCode).resolves(true);

            // Act
            await elevatorController.createElevator(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        });

    });

    describe('update Elevator', function() {
        it("should try and failt  update a  elevator due to invalid Data", async function() {
            // Arrange
            let requestBody = {
                "BuildingCode": "J1",
                "ElevatorCode": "E1",
                "FloorsAttended": [0,1,2],
                "ElevatorType:" :{"marca":"cringe","modelo":"jump"},
                "NumSerie": "123456789",
                "Description": "Elevator for test"
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

            const elevatorDTO = {
                BuildingCode: "J1",
                ElevatorCode: "E1",
                FloorsAttended: [0,1,2],
                ElevatorType: elevatorType.create({"marca":"cringe","modelo":"jump"}).getValue(),
                NumSerie: "123456789",
                Description: "Elevator for test"
              };
        

         
            const elevator = Elevator.create({
                    BuildingCode: "J1",
                    ElevatorCode: "E1",
                    FloorsAttended: [0,1,2],
                    ElevatorType: elevatorType.create({"marca":"cringe","modelo":"jump"}).getValue(),
                    NumSerie: "123456789",
                    Description: "Elevator for test"
                  
            
            }).getValue();

            (elevatorRepo.replaceByBuildingCode as sinon.SinonStub).withArgs(elevatorDTO).resolves(null);
            // Act
            await elevatorController.updateElevator(req as Request, res as Response, () => {});

            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
        });



    });

    describe('list Elevators', function() {
        it("should list all elevators in a building", async function() {
            // Arrange
            let requestBody = {
                "BuildingCode": "J1",
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

            const elevatorDTO = {
                BuildingCode: "J1",
                ElevatorCode: "E1",
                FloorsAttended: [0,1,2],
                ElevatorType: elevatorType.create({"marca":"cringe","modelo":"jump"}).getValue(),
                NumSerie: "123456789",
                Description: "Elevator for test"
              };
        

         
            const elevator = Elevator.create({
                    BuildingCode: "J1",
                    ElevatorCode: "E1",
                    FloorsAttended: [0,1,2],
                    ElevatorType: elevatorType.create({"marca":"cringe","modelo":"jump"}).getValue(),
                    NumSerie: "123456789",
                    Description: "Elevator for test"
                  
            
            }).getValue();

            (elevatorRepo.findByBuildingCode as sinon.SinonStub).withArgs(elevatorDTO.BuildingCode).resolves(Promise.resolve(elevator));
            // Act
            await elevatorController.listElevators(req as Request, res as Response, () => {});
            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        });

        

    });
  
});
