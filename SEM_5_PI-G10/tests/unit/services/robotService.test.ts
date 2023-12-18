// Import necessary packages
import { when, mock, instance, verify } from 'ts-mockito';
import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { expect } from 'chai';
import config from "../../../config";
import { Result } from '../../../src/core/logic/Result';
import IRobotRepo from '../../../src/services/IRepos/IRobotRepo';
import IRobotTypeRepo from '../../../src/services/IRepos/IRobotTypeRepo';
import IRobotService from '../../../src/services/IServices/IRobotService';
import RobotService from '../../../src/services/robotService';
import { Robot } from '../../../src/domain/robot';
import { RobotStatus } from '../../../src/domain/robotStatus';
import { RobotType } from '../../../src/domain/robotType';
import { RobotTypeCode } from '../../../src/domain/robotTypecode';

describe('BuildingService', function () {
	let robotRepo: IRobotRepo;
	let robotTypeRepo: IRobotTypeRepo;
	let robotService: IRobotService;

	beforeEach(function () {
		robotRepo = mock<IRobotRepo>();
		robotTypeRepo = mock<IRobotTypeRepo>();
		robotService = new RobotService(instance(robotRepo), instance(robotTypeRepo));
	});

	afterEach(function () {
		//sandbox.restore();
	});

	describe('getRobots', async function () {
		it('should return a list of robots', async function () {
			// Arrange
			const robot1 = Robot.create({
				code: "R001",
				nickname: "buddy1",
				robotTypeCode: "type1",
				serialNumber: "123",
				description: "robot1",
				status: RobotStatus.Active
			}).getValue();

			const robot2 = Robot.create({
				code: "R002",
				nickname: "buddy2",
				robotTypeCode: "type2",
				serialNumber: "456",
				description: "robot2",
				status: RobotStatus.Active
			}).getValue();

			const robot3 = Robot.create({
				code: "R003",
				nickname: "buddy3",
				robotTypeCode: "type2",
				serialNumber: "789",
				description: "robot3",
				status: RobotStatus.Active
			}).getValue();

			const robot4 = Robot.create({
				code: "R004",
				nickname: "buddy4",
				robotTypeCode: "type4",
				serialNumber: "101",
				description: "robot4",
				status: RobotStatus.Active
			}).getValue();

			const robots = [robot1, robot2, robot3, robot4];

			when(robotRepo.findAll()).thenReturn(Promise.resolve(robots));

			// Act
			const result = await robotService.getRobots();

			// Assert
			expect(result.isSuccess).to.be.true;
			expect(result.getValue()).to.deep.equal([
				{
					code: "R001",
					nickname: "buddy1",
					robotTypeCode: "type1",
					serialNumber: "123",
					description: "robot1",
					status: RobotStatus.Active
				},
				{
					code: "R002",
					nickname: "buddy2",
					robotTypeCode: "type2",
					serialNumber: "456",
					description: "robot2",
					status: RobotStatus.Active
				},
				{
					code: "R003",
					nickname: "buddy3",
					robotTypeCode: "type2",
					serialNumber: "789",
					description: "robot3",
					status: RobotStatus.Active
				},
				{
					code: "R004",
					nickname: "buddy4",
					robotTypeCode: "type4",
					serialNumber: "101",
					description: "robot4",
					status: RobotStatus.Active
				}]);
		});

		it('should return a failure result when there are no robots', async function () {
			// Arrange
			when(robotRepo.findAll()).thenReturn(Promise.resolve([]));

			// Act
			const result = await robotService.getRobots();

			// Assert
			expect(result.isFailure).to.be.true;
			expect(result.error).to.equal('No robots found');
		});
	});

	it('should return a failure result when robot already exists', async function () {
		// Arrange
		const robotDTO = {
			code: "a1f",
			nickname: "buddy",
			robotTypeCode: "a1f", serialNumber: "a1f", description: "a1f", status: RobotStatus.Active

		};

		const robot = Robot.create({ code: "a1f", nickname: "buddy", robotTypeCode: "a1f", serialNumber: "a1f", description: "a1f", status: RobotStatus.Active }).getValue();
		when(robotRepo.findByCode(robotDTO.code)).thenReturn(Promise.resolve(robot));

		// Act
		const result = await robotService.createRobot(robotDTO);

		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('Robot already exists with code=a1f');
		verify(robotRepo.findByCode(robotDTO.code)).once();

	});

	it('should return a failure result when robotType does not exist', async function () {
		// Arrange
		const robotDTO = {
			code: "a1f",
			nickname: "buddy",
			robotTypeCode: "a1f", serialNumber: "a1f", description: "a1f", status: RobotStatus.Active

		};

		const robot = Robot.create({ code: "a1f", nickname: "buddy", robotTypeCode: "a1f", serialNumber: "a1f", description: "a1f", status: RobotStatus.Active }).getValue();
		when(robotRepo.findByCode(robotDTO.code)).thenReturn(Promise.resolve(null));
		when(robotTypeRepo.findByCode(robotDTO.robotTypeCode)).thenReturn(Promise.resolve(null));

		// Act
		const result = await robotService.createRobot(robotDTO);

		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('Robot type does not exist with code=a1f');
		verify(robotRepo.findByCode(robotDTO.code)).once();
		verify(robotTypeRepo.findByCode(robotDTO.robotTypeCode)).once();

	});

	it('should return a failure result when serial number already exists', async function () {
		// Arrange
		const robotDTO = {
			code: "a1f",
			nickname: "buddy",
			robotTypeCode: "a1f", serialNumber: "a1f", description: "a1f", status: RobotStatus.Active

		};

		let robotType = RobotType.create({ code:RobotTypeCode.create({code: "a1f"}).getValue(), description: "best type", tasksCode: ["andar", "limpar"] }).getValue();

		const robot = Robot.create({ code: "a1f", nickname: "buddy", robotTypeCode: "a1f", serialNumber: "a1f", description: "a1f", status: RobotStatus.Active }).getValue();
		when(robotRepo.findByCode(robotDTO.code)).thenReturn(Promise.resolve(null));
		when(robotTypeRepo.findByCode(robotDTO.robotTypeCode)).thenReturn(Promise.resolve(robotType));
		when(robotRepo.findBySerialNumber(robotDTO.serialNumber)).thenReturn(Promise.resolve(robot));


		// Act
		const result = await robotService.createRobot(robotDTO);

		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('Robot serial number already exists');
		verify(robotRepo.findByCode(robotDTO.code)).once();
		verify(robotTypeRepo.findByCode(robotDTO.robotTypeCode)).once();
		verify(robotRepo.findBySerialNumber(robotDTO.serialNumber)).once();


	});

	it('should return sucess when all data is valid', async function () {
		// Arrange
		const robotDTO = {
			code: "a1f",
			nickname: "buddy",
			robotTypeCode: "a1f", serialNumber: "a1f", description: "a1f", status: RobotStatus.Active

		};

		let robotType = RobotType.create({ code:RobotTypeCode.create({code: "a1f"}).getValue(), description: "best type", tasksCode: ["andar", "limpar"] }).getValue();

		const robot = Robot.create({ code: "a1f", nickname: "buddy", robotTypeCode: "a1f", serialNumber: "a1f", description: "a1f", status: RobotStatus.Active }).getValue();
		when(robotRepo.findByCode(robotDTO.code)).thenReturn(Promise.resolve(null));
		when(robotTypeRepo.findByCode(robotDTO.robotTypeCode)).thenReturn(Promise.resolve(robotType));
		when(robotRepo.findBySerialNumber(robotDTO.serialNumber)).thenReturn(Promise.resolve(null));

		// Act
		const result = await robotService.createRobot(robotDTO);
		const robotResult = result.getValue();

		// Assert
		expect(result.isFailure).to.be.false;
		expect(robotResult.code).to.equal(robotDTO.code);
		expect(robotResult.nickname).to.equal(robotDTO.nickname);
		expect(robotResult.robotTypeCode).to.equal(robotDTO.robotTypeCode);
		expect(robotResult.serialNumber).to.equal(robotDTO.serialNumber);
		expect(robotResult.description).to.equal(robotDTO.description);
		expect(robotResult.status).to.equal(robotDTO.status);
		verify(robotRepo.findByCode(robotDTO.code)).once();
		verify(robotTypeRepo.findByCode(robotDTO.robotTypeCode)).once();
		verify(robotRepo.findBySerialNumber(robotDTO.serialNumber)).once();

	});


	it('should return a list of robots when given a list of robot types', async function () {
		// Arrange
		const robotTypeDTOs = [
			{ code: 'type1', description: 'type 1', tasksCode: ['task1', 'task2'] },
			{ code: 'type2', description: 'type 2', tasksCode: ['task1', 'task2'] }
		];

		const robots = [
			Robot.create({ code: 'robot1', nickname: 'buddy1', robotTypeCode: 'type1', serialNumber: '123', description: 'robot1', status: RobotStatus.Active }).getValue(),
			Robot.create({ code: 'robot2', nickname: 'buddy2', robotTypeCode: 'type2', serialNumber: '456', description: 'robot2', status: RobotStatus.Active }).getValue(),
			Robot.create({ code: 'robot3', nickname: 'buddy3', robotTypeCode: 'type2', serialNumber: '789', description: 'robot3', status: RobotStatus.Active }).getValue(),
			Robot.create({ code: 'robot4', nickname: 'buddy4', robotTypeCode: 'type4', serialNumber: '101', description: 'robot4', status: RobotStatus.Active }).getValue(),
		];

		when(robotRepo.findByTypeCode('type1')).thenReturn(Promise.resolve(robots.slice(0, 1)));
		when(robotRepo.findByTypeCode('type2')).thenReturn(Promise.resolve(robots.slice(1, 3)));


		// Act
		const result = await robotService.getRobotsByRobotTypes(robotTypeDTOs);

		// Assert
		expect(result.isSuccess).to.be.true;
		expect(result.getValue()).to.deep.equal([
			{ code: 'robot1', nickname: 'buddy1', robotTypeCode: 'type1', serialNumber: '123', description: 'robot1', status: RobotStatus.Active },
			{ code: 'robot2', nickname: 'buddy2', robotTypeCode: 'type2', serialNumber: '456', description: 'robot2', status: RobotStatus.Active },
			{ code: 'robot3', nickname: 'buddy3', robotTypeCode: 'type2', serialNumber: '789', description: 'robot3', status: RobotStatus.Active }
		]);

		verify(robotRepo.findByTypeCode('type1')).once();
		verify(robotRepo.findByTypeCode('type2')).once();

	});

	it('should inhibit an existing robot and return a success result', async () => {
		// Arrange
		const robotDTO = {
			code: 'R001',
			nickname: 'buddy1',
			robotTypeCode: 'type1',
			serialNumber: '123',
			description: 'robot1',
			status: RobotStatus.Active
		};
		const robotDTOResult = {
			code: 'R001',
			nickname: 'buddy1',
			robotTypeCode: 'type1',
			serialNumber: '123',
			description: 'robot1',
			status: RobotStatus.Inactive
		};

		const robot = Robot.create(robotDTO).getValue();
		const robotResult = Robot.create(robotDTOResult).getValue();
		when(robotRepo.findByCode(robotDTO.code)).thenReturn(Promise.resolve(robot));
		when(robotRepo.inhibitRobot(robotDTO.code)).thenReturn(Promise.resolve(robotResult));

		// Act
		const result = await robotService.inhibitRobot(robotDTO);

		// Assert
		expect(result.isSuccess).to.be.true;
		expect(result.getValue()).to.deep.equal({
			code: 'R001',
			nickname: 'buddy1',
			robotTypeCode: 'type1',
			serialNumber: '123',
			description: 'robot1',
			status: RobotStatus.Inactive
		});
	});

	it('should return a failure result when robot does not exist', async () => {
		// Arrange
		const robotDTO = {
			code: 'R001',
			nickname: 'buddy1',
			robotTypeCode: 'type1',
			serialNumber: '123',
			description: 'robot1',
			status: RobotStatus.Active
		};

		when(robotRepo.findByCode(robotDTO.code)).thenReturn(Promise.resolve(null));

		// Act
		const result = await robotService.inhibitRobot(robotDTO);

		// Assert
		expect(result.isFailure).to.be.true;
		expect(result.error).to.equal('Robot does not exist with code=R001');
	});


});



