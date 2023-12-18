import sinon from 'sinon';
import IRobotTypeDTO from '../../../src/dto/IRobotTypeDTO';
import { Request, Response } from 'express';
import { Result } from '../../../src/core/logic/Result';
import RobotTypeController from '../../../src/controllers/robotTypeController';
import RobotTypeService from '../../../src/services/robotTypeService';
declare module 'express-serve-static-core' {
    interface Request {
      token?: any;
    }
  }

describe('RobotTypeController', () => {
  let robotTypeService: RobotTypeService;
  let robotTypeController: RobotTypeController;
  


    beforeEach( function() {
        robotTypeService = sinon.createStubInstance(RobotTypeService);
        robotTypeController = new RobotTypeController(robotTypeService);
    });

    describe('createRobotType', () => {
        it('should return a 201 status code and the created robot type when successful', async () => {
            // Arrange
            let requestBody = {
                "code": "Test1",
                "description": "ForTest",
                "tasksCode": "[TestTask]",
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

            const robotTypeDTO = {
                code: "Test1",
                description: "ForTest",
                tasksCode: ["TestTask"],
            };
    
            (robotTypeService.createRobotType as sinon.SinonStub).resolves(Result.ok<IRobotTypeDTO>(robotTypeDTO));
    
            // Act
            await robotTypeController.createRobotType(req as Request, res as Response, () => {});
    
            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
        });
        
        it('should return a 400 status code and the error message when the robot type creation fails', async () => {
            // Arrange
            let requestBody = {
                "code": "Test1",
                "description": "ForTest",
                "tasksCode": "[TestTask]",
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

            const robotTypeDTO = {
                code: "Test1",
                description: "ForTest",
                tasksCode: ["TestTask"],
            };
    
            (robotTypeService.createRobotType as sinon.SinonStub).resolves(Result.fail<IRobotTypeDTO>("RobotType already exists with code=" + robotTypeDTO.code));
    
            // Act
            await robotTypeController.createRobotType(req as Request, res as Response, () => {});
    
            // Assert
            sinon.assert.calledOnce(res.status as sinon.SinonStub);
            sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
            sinon.assert.calledWith(res.send as sinon.SinonStub, "RobotType already exists with code=" + robotTypeDTO.code);
        });
        
    });


});