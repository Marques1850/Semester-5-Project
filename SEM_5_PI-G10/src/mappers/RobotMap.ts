import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IRobotPersistence } from '../dataschema/IRobotPersistence';

import IRobotDto from "../dto/IRobotDTO";
import { Robot } from "../domain/robot";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class RobotMap extends Mapper<Robot> {
  
  public static toDTO(robot: Robot): IRobotDto {
    return {
        code: robot.code,
        nickname: robot.nickname,
        robotTypeCode: robot.robotTypeCode,
        serialNumber: robot.serialNumber,
        description: robot.description,
        status: robot.status
    };
  }

  public static async toDomain(robot: any): Promise<Robot> {
    const buildingOrError = Robot.create(
      {
        code: robot.code,
        nickname: robot.nickname,
        robotTypeCode: robot.robotTypeCode,
        serialNumber: robot.serialNumber,
        description: robot.description,
        status: robot.status
      },
      new UniqueEntityID(robot.RobotID)
    );

    if (buildingOrError.isFailure) {
      console.log(buildingOrError.error);
    }

    return buildingOrError.isSuccess ? buildingOrError.getValue() : null;
  }

  public static toPersistence (robot: Robot): any {
    const a = {
      domainId: robot.id.toString(),
      code: robot.code,
      nickname: robot.nickname,
      robotTypeCode: robot.robotTypeCode,
      serialNumber: robot.serialNumber,
      description: robot.description,
      status: robot.status
    }
    return a;
  }
}