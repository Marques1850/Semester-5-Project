import { elevatorType } from "../domain/elevatorType";

export interface IElevatorPersistence {
  _id: string;
  BuildingCode: string;
  ElevatorCode: string;
  FloorsAttended: number[];
  ElevatorType?: elevatorType;
  NumSerie?: string;
  Description?: string;

}