import { expect } from 'chai';
import sinon from 'sinon';
import elevatorController from '../../../src/controllers/elevatorController';
import IElevatorDTO from '../../../src/dto/IElevatorDTO';
import ElevatorService from '../../../src/services/elevatorService';
import { Request, Response } from 'express';
import { Result } from '../../../src/core/logic/Result';
import ElevatorController from '../../../src/controllers/elevatorController';
import {elevatorType} from '../../../src/domain/elevatorType';
import { Query } from 'mongoose';
declare module 'express-serve-static-core' {
  interface Request {
    token?: any;
  }
}


describe('elevatorController', () => {
  let elevatorService: ElevatorService;
 
  let elevatorController: elevatorController;


    beforeEach( function() {
        elevatorService = sinon.createStubInstance(ElevatorService);
        elevatorController = new ElevatorController(elevatorService);
    });

describe('create Elevator', () => {
    it('should return a 201 status code and the created Elevator when successful', async () => {
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
        }

        const elevatorDTO = {
          BuildingCode: "J1",
          ElevatorCode: "E1",
          FloorsAttended: [0,1,2],
          ElevatorType: elevatorType.create({"marca":"cringe","modelo":"jump"}).getValue(),
          NumSerie: "123456789",
          Description: "Elevator for test"
        };
  
        (elevatorService.createElevator as sinon.SinonStub).resolves(Result.ok<IElevatorDTO>(elevatorDTO));
  
        // Act
        await elevatorController.createElevator(req as Request, res as Response, () => {});
  
        // Assert
        sinon.assert.calledWith(res.json as sinon.SinonStub, elevatorDTO);
        sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
      
    });
    
    it('should return a 400 status code and the error message when the elevator creation fails', async () => {
      
      let requestBody = {
        "BuildingCode": null,
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
      }

      const elevatorDTO = {
        BuildingCode: null,
        ElevatorCode: "E1",
        FloorsAttended: [0,1,2],
        ElevatorType: elevatorType.create({"marca":"cringe","modelo":"jump"}).getValue(),
        NumSerie: "123456789",
        Description: "Elevator for test"
      };
      
      const errorMessage = 'Error creating building';
      const expectedResult = Result.fail<IElevatorDTO>(errorMessage);
      (elevatorService.createElevator as sinon.SinonStub).resolves(expectedResult);

      await elevatorController.createElevator(req as Request, res as Response, () => {});

      sinon.assert.calledWith(res.status, 400);
      sinon.assert.calledWith(res.send, errorMessage);
    });
      });

  describe('update Elevator', () => {
    it('should return a 201 status code and the updated Elevator when successful', async () => {
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
      }

      const elevatorDTO = {
        BuildingCode: "J1",
        ElevatorCode: "E1",
        FloorsAttended: [0,1,2],
        ElevatorType: elevatorType.create({"marca":"cringe","modelo":"jump"}).getValue(),
        NumSerie: "123456789",
        Description: "Elevator for test"
      };
      const expectedResult = Result.ok<IElevatorDTO>(elevatorDTO);
       (elevatorService.updateElevator as sinon.SinonStub).resolves(expectedResult);

       await elevatorController.updateElevator(req as Request, res as Response, () => {});

      sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
      sinon.assert.calledWith(res.json as sinon.SinonStub, elevatorDTO);
    });

 

    it('should return a 400 status code and the error message when the Elevator update fails', async () => {
      
      let requestBody = {
        "BuildingCode": "J1",
        "ElevatorCode": null,
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
      }

      const elevatorDTO = {
        BuildingCode: "J1",
        ElevatorCode: null,
        FloorsAttended: [0,1,2],
        ElevatorType: elevatorType.create({"marca":"cringe","modelo":"jump"}).getValue(),
        NumSerie: "123456789",
        Description: "Elevator for test"
      };
      const expectedResult = Result.fail<IElevatorDTO>("elevator not found");
       (elevatorService.updateElevator as sinon.SinonStub).resolves(expectedResult);

       await elevatorController.updateElevator(req as Request, res as Response, () => {});

      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
      sinon.assert.calledWith(res.send as sinon.SinonStub,"elevator not found");
    });
   

  
  });
  
  describe('list Elevator', () => {
    it('should return a 200 status code and the Elevatorwhen successful', async () => {
      let querybody = {
        "BuildingCode": "J1",
    
      };

      let req: Partial<Request> = {
          query: querybody,
          token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
      };

      let res: Partial<Response> = {
          json: sinon.stub(),
          status: sinon.stub().returnsThis(),
          send: sinon.stub()
      }

      const elevatorDTO = {
        BuildingCode: "J1",
        ElevatorCode: "E1",
        FloorsAttended: [0,1,2],
        ElevatorType: elevatorType.create({"marca":"cringe","modelo":"jump"}).getValue(),
        NumSerie: "123456789",
        Description: "Elevator for test"
      };
      const expectedResult = Result.ok<IElevatorDTO>(elevatorDTO);
    
       (elevatorService.listElevatorsInBuilding as sinon.SinonStub).resolves(expectedResult);

       await elevatorController.listElevators(req as Request, res as Response, () => {});

      sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
      sinon.assert.calledWith(res.json as sinon.SinonStub, elevatorDTO);
    });

    it('should return a 400 status code and the error message when the building code has no elevators', async () => {
      
      let requestBody = {
        "BuildingCode": "J1",
    
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

      const elevatorDTO = {
        BuildingCode: "J1",
        ElevatorCode: "E1",
        FloorsAttended: [0,1,2],
        ElevatorType: elevatorType.create({"marca":"cringe","modelo":"jump"}).getValue(),
        NumSerie: "123456789",
        Description: "Elevator for test"
      };

      const expectedResult = Result.fail<IElevatorDTO>("elevators not found");
       (elevatorService.updateElevator as sinon.SinonStub).resolves(expectedResult);

       await elevatorController.updateElevator(req as Request, res as Response, () => {});

      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
      sinon.assert.calledWith(res.send as sinon.SinonStub,"elevators not found");
    });

  
  });

});