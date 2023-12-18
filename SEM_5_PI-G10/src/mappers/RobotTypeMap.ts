import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IRobotTypePersistence } from '../dataschema/IRobotTypePersistence';

import IRobotTypeDto from "../dto/IRobotTypeDTO";
import { RobotType } from "../domain/robotType";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { RobotTypeCode } from "../domain/robotTypecode";

export class RobotTypeMap extends Mapper<RobotType> {
  
  public static toDTO(robotType: RobotType): IRobotTypeDto {
    return {
        code: robotType.code,
        description: robotType.description,
        tasksCode: robotType.tasksCode,
    };
  }

  public static async toDomain(robotType: any): Promise<RobotType> {
    const buildingOrError = RobotType.create(
      {
        code: RobotTypeCode.create({code:robotType.code}).getValue() ,
        description: robotType.description,
        tasksCode: robotType.tasksCode,
      },
      new UniqueEntityID(robotType.RobotTypeID)
    );

    if (buildingOrError.isFailure) {
      console.log(buildingOrError.error);
    }

    return buildingOrError.isSuccess ? buildingOrError.getValue() : null;
  }

  public static toPersistence (robotType: RobotType): any {
    const a = {
      domainId: robotType.id.toString(),
      code: robotType.code,
      description: robotType.description,
      tasksCode: robotType.tasksCode,
    }
    return a;
  }
}