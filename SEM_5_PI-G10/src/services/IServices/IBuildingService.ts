import { Result } from "../../core/logic/Result";
import IBuildingDTO from '../../dto/IBuildingDTO';
import IFloorDTO from '../../dto/IFloorDTO';


export default interface IBuildingService {
  createBuilding(building: IBuildingDTO): Promise<Result<IBuildingDTO>>;
  updateBuilding(building: IBuildingDTO);
  listAllBuildings(): Promise<Result<IBuildingDTO[]>>;
  listBuildingsWithFloorsInRange(minFloors: number, maxFloors: number): Promise<Result<IBuildingDTO[]>>;
  listBuildingFloors(buildingCode: string): Promise<Result<IFloorDTO[]>>;
}
