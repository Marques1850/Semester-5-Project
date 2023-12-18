import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';

import IRoomDto from "../dto/IRoomDTO";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { room } from "../domain/room";

export class RoomMap extends Mapper<room> {
  
  public static toDTO(room: room): IRoomDto {
    return {
      name: room.name,
      description: room.description,
      roomtype: room.roomtype.toString()

    };
  }
  
  public static async toDomain(room: any): Promise<room> {
    const roomOrError = room.create({ 
      name: room.name,
      description: room.description,
      roomtype: room.roomtype
    } );
    if (roomOrError.isFailure) {
      console.log(roomOrError.error);
    }
  
    return roomOrError.isSuccess ? roomOrError.getValue() : null;
  }
  
  public static toPersistence (room: room): any {
    const a = {
      name: room.name,  
      description: room.description,
      roomtype: room.roomtype
      
    }
    return a;
  }
  
}