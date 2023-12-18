import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IBuildingPersistence } from '../dataschema/IBuildingPersistence';

import IBuildingDto from "../dto/IBuildingDTO";
import { Building } from "../domain/building";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { List } from "immutable";
import { BuildingCode } from "../domain/buildingcode";

export class BuildingMap extends Mapper<Building> {
  
  public static toDTO(building: Building): IBuildingDto {
    return {
      code: building.props.code.toString(),
      name: building.name,
      description: building.description,
      width: building.width,
      length: building.length,
    };
  }

  public static async toDomain(building: any): Promise<Building> {
    const buildingOrError = Building.create(
      {
        code: building.code,
        name: building.name,
        description: building.description,
        width: building.width,
        length: building.length,
      },
      new UniqueEntityID(building.BuildingID)
    );

    if (buildingOrError.isFailure) {
      console.log(buildingOrError.error);
    }

    return buildingOrError.isSuccess ? buildingOrError.getValue() : null;
  }

  public static toPersistence (Building: Building): any {
    const a = {
      domainId: Building.id.toString(),
      code: Building.code,
      name: Building.name,
      description: Building.description,
      width: Building.width,
      length: Building.length,
    }
    return a;
  }
}