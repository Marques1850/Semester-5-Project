import { RobotType, robotTypeProps } from './../../../src/domain/robotType';
import { UniqueEntityID } from "./../../../src/core/domain/UniqueEntityID";
import { expect } from 'chai';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import { RobotTypeCode } from '../../../src/domain/robotTypecode';

describe('RobotType', () => {
  it('should create a valid RobotType', () => {
    // Arrange
    const validProps: robotTypeProps = {
      code:RobotTypeCode.create({code:'RT001'}).getValue() ,
      description: 'Test Robot Type',
      tasksCode: ['TASK001', 'TASK002'],
    };

    // Act
    const robotTypeResult: Result<RobotType> = RobotType.create(validProps, new UniqueEntityID());

    // Assert
    expect(robotTypeResult.isSuccess).to.be.true;
    const robotType = robotTypeResult.getValue();
    expect(robotType.code).to.equal('RT001');
    expect(robotType.description).to.equal('Test Robot Type');
    expect(robotType.tasksCode).to.deep.equal(['TASK001', 'TASK002']);
  });

});