import 'reflect-metadata';
import sinon from 'sinon';
import { Request, Response } from 'express';
import { Result } from '../../../src/core/logic/Result';
import { Container } from 'typedi';
import RobotService from '../../../src/services/robotService';
import RobotTypeService from '../../../src/services/robotTypeService';
import RobotController from '../../../src/controllers/robotController';
import IRobotDTO from '../../../src/dto/IRobotDTO';
import { RobotStatus } from '../../../src/domain/robotStatus';
import IRobotTypeDTO from '../../../src/dto/IRobotTypeDTO';

declare module 'express-serve-static-core' {
    interface Request {
      token?: any;
    }
  }

describe('RobotController', function () {
	let robotService: RobotService;
  	let robotTypeService: RobotTypeService;
	let robotController: RobotController;

	beforeEach(function() {
		robotService = sinon.createStubInstance(RobotService);
    	robotTypeService = sinon.createStubInstance(RobotTypeService);
		robotController = new RobotController(robotService, robotTypeService);
	});

	describe('createRobot', () => {
		it('should return a 201 status code and the created robot when successful', async function () {
			// Arrange
			let requestBody = {
				code: 'RBT001',
        		nickname: 'Robo',
        		robotTypeCode: 'RT001',
        		serialNumber: 'SN001',
        		description: 'Arobot',
        		status: 'Active'
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

			const robotDTO = {
				code: 'RBT001',
        		nickname: 'Robo',
        		robotTypeCode: 'RT001',
        		serialNumber: 'SN001',
        		description: 'Arobot',
        		status: RobotStatus.Active
			};

			(robotService.createRobot as sinon.SinonStub).resolves(Result.ok<IRobotDTO>(robotDTO));

			// Act
			await robotController.createRobot(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
		});
    
		it('should return a 400 status code and the error message when the robot creation fails', async function () {	
			// Arrange
			let requestBody = {
				code: 'RBT001',
        		nickname: 'Robo',
        		robotTypeCode: 'RT001',
        		serialNumber: 'SN001',
        		description: 'Arobot',
        		status: 'Active'
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

			const robotDTO = {
				code: 'RBT001',
        		nickname: 'Robo',
        		robotTypeCode: 'RT001',
        		serialNumber: 'SN001',
        		description: 'Arobot',
        		status: RobotStatus.Active
			};

			(robotService.createRobot as sinon.SinonStub).resolves(Result.fail<IRobotDTO>("Robot not created"));

			// Act
			await robotController.createRobot(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
			sinon.assert.calledWith(res.send as sinon.SinonStub, "Robot not created");
		});
  	});

	describe('getRobots', () => {
		it('should return a 200 status code and the list of robots when successful', async function () {
			// Arrange
			let req: Partial<Request> = {
				body: {},
				token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
			};

			let res: Partial<Response> = {
				json: sinon.stub(),
				status: sinon.stub().returnsThis(),
				send: sinon.stub()
			}

			const robotDTOs = [{
				code: 'RBT001',
        		nickname: 'Robo',
        		robotTypeCode: 'RT001',
        		serialNumber: 'SN001',
        		description: 'Arobot',
        		status: RobotStatus.Active
			},
			{
				code: 'RBT002',
				nickname: 'Robo2',
				robotTypeCode: 'RT002',
				serialNumber: 'SN002',
				description: 'Arobot2',
				status: RobotStatus.Active
			}];

			(robotService.getRobots as sinon.SinonStub).resolves(Result.ok<IRobotDTO[]>(robotDTOs));

			// Act
			await robotController.getRobots(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
		});
    
		it('should return a 400 status code and the error message when do not exist robots', async function () {	
			// Arrange
			let req: Partial<Request> = {
				body: {},
				token: {role:"5d81e810-5fdd-4e0f-8b80-5cd97198a145"}
			};

			let res: Partial<Response> = {
				json: sinon.stub(),
				status: sinon.stub().returnsThis(),
				send: sinon.stub()
			}

			const robotDTO = {
				code: 'RBT001',
        		nickname: 'Robo',
        		robotTypeCode: 'RT001',
        		serialNumber: 'SN001',
        		description: 'Arobot',
        		status: RobotStatus.Active
			};

			(robotService.getRobots as sinon.SinonStub).resolves(Result.fail<IRobotDTO[]>("No robots found"));

			// Act
			await robotController.getRobots(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
			sinon.assert.calledWith(res.send as sinon.SinonStub, "No robots found");
		});
  	});

	describe('inhibitRobot', () => {
		it('should return a 200 status code and change robot status to inhibit when successful', async function () {
			// Arrange
			let requestBody = {
				"code": 'RBT001',
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

			const robotDTO = {
				code: 'RBT001',
        		nickname: 'Robo',
        		robotTypeCode: 'RT001',
        		serialNumber: 'SN001',
        		description: 'Arobot',
        		status: RobotStatus.Inactive
			};

			(robotService.inhibitRobot as sinon.SinonStub).resolves(Result.ok<IRobotDTO>(robotDTO));

			// Act
			await robotController.inhibitRobot(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
		});
    
		it('should return a 400 status code and the error message when robot does not exist', async function () {	
			// Arrange
			let requestBody = {
				"code": 'RBT001',
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

			const robotDTO = {
				code: 'RBT001',
        		nickname: 'Robo',
        		robotTypeCode: 'RT001',
        		serialNumber: 'SN001',
        		description: 'Arobot',
        		status: RobotStatus.Active
			};

			(robotService.inhibitRobot as sinon.SinonStub).resolves(Result.fail<IRobotDTO[]>("Robot does not exist with code=" + robotDTO.code));

			// Act
			await robotController.inhibitRobot(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
			sinon.assert.calledWith(res.send as sinon.SinonStub, "Robot does not exist with code=" + robotDTO.code);
		});
  	});

	describe('getRobotsByTask', () => {
		it('should return a 200 status code and the robot when successful', async function () {
			// Arrange
			let requestBody = {
				"code": 'RBT001',
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

			const robotDTOs = [{
				code: 'RBT001',
        		nickname: 'Robo',
        		robotTypeCode: 'RT001',
        		serialNumber: 'SN001',
        		description: 'Arobot',
        		status: RobotStatus.Active
			}];

			(robotTypeService.getRobotTypesByTask as sinon.SinonStub).resolves(Result.ok<IRobotDTO[]>(robotDTOs));
			(robotService.getRobotsByRobotTypes as sinon.SinonStub).resolves(Result.ok<IRobotDTO[]>(robotDTOs));

			// Act
			await robotController.getRobotsByTask(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
		});
    
		it('should return a 400 status code and the error message when do not exist robots', async function () {	
			// Arrange
			let requestBody = {
				"code": 'RBT001',
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

			const robotDTO = {
				code: 'RBT001',
        		nickname: 'Robo',
        		robotTypeCode: 'RT001',
        		serialNumber: 'SN001',
        		description: 'Arobot',
        		status: RobotStatus.Active
			};

			(robotTypeService.getRobotTypesByTask as sinon.SinonStub).resolves(Result.fail<IRobotTypeDTO[]>("No robotTypes found for taskCode=" + robotDTO.code));
			(robotService.getRobotsByRobotTypes as sinon.SinonStub).resolves(Result.fail<IRobotDTO[]>("No robots found"));

			// Act
			await robotController.getRobotsByTask(req as Request, res as Response, () => {});

			// Assert
			sinon.assert.calledOnce(res.status as sinon.SinonStub);
			sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
			sinon.assert.calledWith(res.send as sinon.SinonStub, "No robotTypes found for taskCode=" + robotDTO.code);
		});
  	});

});
