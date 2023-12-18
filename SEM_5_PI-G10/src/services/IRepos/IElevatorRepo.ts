import { Repo } from "../../core/infra/Repo";
import { Elevator } from "../../domain/elevator";
import IElevatorDTO from "../../dto/IElevatorDTO";

export default interface IElevatorRepo extends Repo<Elevator> {
  save(Elevator: Elevator): Promise<Elevator>;
  findByBuildingCode (code:string): Promise<Elevator | null>;
  replaceByBuildingCode (dto:IElevatorDTO): Promise<Elevator>;
  findAll(): Promise<Elevator[]>;
}