import { elevatorType } from "../domain/elevatorType";

export default interface IElevatorDTO {
    BuildingCode: string;
    ElevatorCode: string;
    FloorsAttended:number[];
    ElevatorType?: elevatorType;
    NumSerie?: string;
    Description?: string;
}
  