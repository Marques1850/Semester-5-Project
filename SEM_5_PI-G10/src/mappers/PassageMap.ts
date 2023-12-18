import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IBuildingPersistence } from '../dataschema/IBuildingPersistence';

import IPassageDto from "../dto/IPassageDTO";
import { Passage } from "../domain/passage";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { List } from "immutable";

export class PassageMap extends Mapper<Passage> {
  
  public static toDTO(passage: Passage): IPassageDto {
    return {
      codigo: passage.props.codigo.toString(),
      codeBuilding1: passage.codeBuilding1,
      codeBuilding2: passage.codeBuilding2,
      FloorBuilding1Name: passage.props.FloorBuilding1Name,
      FloorBuilding2Name: passage.props.FloorBuilding2Name,
    };
  }

  public static async toDomain(passage: any): Promise<Passage> {
    const passageOrError = Passage.create(
      {
        codigo: passage.codigo,
        codeBuilding1: passage.codeBuilding1,
        codeBuilding2: passage.codeBuilding2,
        FloorBuilding1Name: passage.FloorBuilding1Name,
        FloorBuilding2Name: passage.FloorBuilding2Name,
      },
      new UniqueEntityID(passage.PassageID)
    );

    if (passageOrError.isFailure) {
      console.log(passageOrError.error);
    }

    return passageOrError.isSuccess ? passageOrError.getValue() : null;
  }

  public static toPersistence (passage: Passage): any {
    const a = {
      domainId: passage.id.toString(),
      codigo: passage.props.codigo.code,
      codeBuilding1: passage.codeBuilding1,
      codeBuilding2: passage.codeBuilding2,
      FloorBuilding1Name: passage.props.FloorBuilding1Name,
      FloorBuilding2Name: passage.props.FloorBuilding2Name,
    }
    return a;
  }
}