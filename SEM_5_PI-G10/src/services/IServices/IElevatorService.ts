import { Result } from "../../core/logic/Result";
import IBuildingDTO from "../../dto/IBuildingDTO";
import IElevatorDTO from '../../dto/IElevatorDTO';


export default interface IElevatorService {
  createElevator(elevator: IElevatorDTO): Promise<Result<IElevatorDTO>>;
  updateElevator(elevator: IElevatorDTO): Promise<Result<IElevatorDTO>>;
  listElevatorsInBuilding(BuildingCode: string): Promise<Result<IElevatorDTO>>;
  listAllElevators(): Promise<Result<IElevatorDTO[]>>;
  listBuildingWithoutElevators(): Promise<Result<IBuildingDTO[]>>;
}
