import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';

import IFloorDto from "../dto/IFloorDTO";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Floor } from "../domain/floor";

export class FloorMap extends Mapper<Floor> {
  
  public static toDTO(floor: Floor): IFloorDto {
    return {          
      name: floor.props.name,
      description: floor.props.description,
      buildingCode: floor.props.buildingCode,
      level: floor.props.level.toString(),
      width: floor.props.width.toString(),
      length: floor.props.length.toString(),
      plant: floor.props.plant,
      rooms: ( floor.rooms ? floor.rooms.map(room => room.toString()) : null )
    };
  }
  
  public static async toDomain(floor: any): Promise<Floor> {
    const floorOrError = Floor.create({ 
      name: floor.name,
      description: floor.description,
      buildingCode: floor.buildingCode,
      level: Number(floor.level),
      width: Number(floor.width),
      length: Number(floor.length),
      plant: floor.plant,
      rooms: floor.rooms
    } );
    if (floorOrError.isFailure) {
      console.log(floorOrError.error);
    }
  
    return floorOrError.isSuccess ? floorOrError.getValue() : null;
  }
  
  public static toPersistence (floor: Floor): any {
    const a = {
      name: floor.name,
      description: floor.description,
      buildingCode: floor.buildingCode,
      level: floor.level.toString(),
      width: floor.width.toString(),
      length: floor.length.toString(),
      plant: floor.plant,
      rooms: floor.rooms
    }
    return a;
  }
  
}