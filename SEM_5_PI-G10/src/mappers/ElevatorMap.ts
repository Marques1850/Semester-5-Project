import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';

import IElevatorDto from "../dto/IElevatorDTO";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Elevator } from "../domain/elevator";
import { elevatorType } from "../domain/elevatorType";

export class ElevatorMap extends Mapper<Elevator> {
  
  public static toDTO(elevator: Elevator): IElevatorDto {
    

    const dto:IElevatorDto= {
      BuildingCode: elevator.Buildingcode,
      ElevatorCode: elevator.ElevatorCode,
      FloorsAttended: elevator["FloorsAttended"] ? elevator["FloorsAttended"].slice(0) : [],
      ElevatorType: elevator.ElevatorType,
      NumSerie: elevator.NumSerie,
      Description: elevator.Description,
    }
      return dto;
    
  }
  
  public static async toDomain(elevator: any): Promise<Elevator> {

    const elevatorOrError = Elevator.create(
      {
        BuildingCode: elevator["BuildingCode"],
        ElevatorCode: elevator["ElevatorCode"],
        FloorsAttended: elevator["FloorsAttended"] ? elevator["FloorsAttended"].slice(0) : [],
        ElevatorType: elevator["ElevatorType"],
        NumSerie: elevator["NumSerie"],
        Description: elevator["Description"],

      },
      new UniqueEntityID(elevator.ElevatorID)
    );
  
  
    if (elevatorOrError.isFailure) {
      console.log(elevatorOrError.error);
    }
  
    return elevatorOrError.isSuccess ? elevatorOrError.getValue() : null;
  }
  
  public static toPersistence (elevator: Elevator): any {
    console.log(elevator);
    const a = {
      domainId: elevator.id.toString(),
      BuildingCode: elevator.Buildingcode,
      ElevatorCode: elevator.ElevatorCode,
      FloorsAttended: elevator["FloorsAttended"] ? elevator["FloorsAttended"].slice() : [],
      ElevatorType: elevator.ElevatorType,
      NumSerie: elevator.NumSerie,
      Description: elevator.Description,
    }
    return a;
  }
  
}