import { Robot } from './../../../src/domain/robot';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { expect } from 'chai';
import { Result } from '../../../src/core/logic/Result';
import { RobotStatus } from '../../../src/domain/robotStatus';

describe('Robot', () => {
  it('should create a robot with valid properties', () => {
    const robotProps = {
      code: 'RBT001',
      nickname: 'Robo',
      robotTypeCode: 'RT001',
      serialNumber: 'SN001',
      description: 'Arobot',
      status: RobotStatus.Active
    };
    const robot = Robot.create(robotProps);
    expect(robot.isSuccess).to.be.true;
    expect(robot.getValue().code).to.equal(robotProps.code);
    expect(robot.getValue().nickname).to.equal(robotProps.nickname);
    expect(robot.getValue().robotTypeCode).to.equal(robotProps.robotTypeCode);
    expect(robot.getValue().serialNumber).to.equal(robotProps.serialNumber);
    expect(robot.getValue().description).to.equal(robotProps.description);
    expect(robot.getValue().status).to.equal(robotProps.status);
  });

  it('should fail to create a robot with invalid code lenght', () => {
    const robotProps = {
      code: '',
      nickname: 'Robo',
      robotTypeCode: 'RT001',
      serialNumber: 'SN001',
      description: 'A robot',
      status: RobotStatus.Active,
    };
    const robot = Robot.create(robotProps);
    expect(robot.isFailure).to.be.true;
    expect(robot.error).to.equal('Robot code must be between 1 and 30 characters');
  });

  it('should fail to create a robot with not alphanumeric code', () => {
    const robotProps = {
      code: '!!!',
      nickname: 'Robo',
      robotTypeCode: 'RT001',
      serialNumber: 'SN001',
      description: 'A robot',
      status: RobotStatus.Active,
    };
    const robot = Robot.create(robotProps);
    expect(robot.isFailure).to.be.true;
    expect(robot.error).to.equal('Robot code must be alphanumeric');
  });

  it('should fail to create a robot with invalid nickname lenght', () => {
    const robotProps = {
      code: 'RBT001',
      nickname: '',
      robotTypeCode: 'RT001',
      serialNumber: 'SN001',
      description: 'A robot',
      status: RobotStatus.Active,
    };
    const robot = Robot.create(robotProps);
    expect(robot.isFailure).to.be.true;
    expect(robot.error).to.equal('Robot nickname must be between 1 and 30 characters');
  });

  it('should fail to create a robot with not alphanumeric nickname', () => {
    const robotProps = {
      code: 'RBT001',
      nickname: '!!!',
      robotTypeCode: 'RT001',
      serialNumber: 'SN001',
      description: 'A robot',
      status: RobotStatus.Active,
    };
    const robot = Robot.create(robotProps);
    expect(robot.isFailure).to.be.true;
    expect(robot.error).to.equal('Robot nickname must be alphanumeric');
  });



  it('should fail to create a robot with SERIAL number not alphanumeric', () => {
    const robotProps = {
      code: 'RBT001',
      nickname: 'Robo',
      robotTypeCode: 'RT001',
      serialNumber: '',
      description: 'A robot',
      status: RobotStatus.Active
    };
    const robot = Robot.create(robotProps);
    expect(robot.isFailure).to.be.true;
    expect(robot.error).to.equal('Robot serial number must be alphanumeric');
  });

  it('should fail to create a robot with invalid SERIAL number lenght', () => {
    const robotProps = {
      code: 'RBT001',
      nickname: 'Robo',
      robotTypeCode: 'RT001',
      serialNumber: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      description: 'A robot',
      status: RobotStatus.Active
    };
    const robot = Robot.create(robotProps);
    expect(robot.isFailure).to.be.true;
    expect(robot.error).to.equal('Robot serial number must be between 1 and 50 characters');
  });
  it('should fail to create a robot with not alphanumeric description', () => {
    const robotProps = {
      code: 'RBT001',
      nickname: 'Robo',
      robotTypeCode: 'RT001',
      serialNumber: 'SN001',
      description: 'A robot!',
      status: RobotStatus.Active,
    };
    const robot = Robot.create(robotProps);
    expect(robot.isFailure).to.be,true;
    expect(robot.error).to.equal('Robot description must be alphanumeric');
  });
    it('should fail to create a robot with invalid description lenght', () => {
        const robotProps = {
        code: 'RBT001',
        nickname: 'Robo',
        robotTypeCode: 'RT001',
        serialNumber: 'SN001',
        description: 'BigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescriptionBigDescription',
        status: RobotStatus.Active,
        };
        const robot = Robot.create(robotProps);
        expect(robot.isFailure).to.be.true;
        expect(robot.error).to.equal('Robot description must be less than 250 characters');
    });
});