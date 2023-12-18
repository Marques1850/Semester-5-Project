import { Result } from "../../core/logic/Result";
import IFloorDTO from '../../dto/IFloorDTO';


export default interface IFloorService {
  createFloor(elevator: IFloorDTO): Promise<Result<IFloorDTO>>;
  listBuildingFloors(buildingCode: string) : Promise<Result<IFloorDTO[]>>;
  updateFloor(floorDTO: IFloorDTO): Promise<Result<IFloorDTO>>;
  uploadFloorMap(floorname: string, fileData: string): Promise<Result<IFloorDTO>>;
  getPlant(buildingCode: string, floorName: string): Promise<Result<IFloorDTO>>;
  getAllFloors(): Promise<Result<IFloorDTO[]>>;
  uniao(floor1: string, floor2: string): Promise<Result<String>>;
  editPlayerPosition(buildingCode: string, floorName: string, x:Number,y:Number,orientation:Number): Promise<Result<IFloorDTO>>;
}