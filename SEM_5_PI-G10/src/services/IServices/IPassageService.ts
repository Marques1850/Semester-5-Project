import { Result } from "../../core/logic/Result";
import IPassageDTO from '../../dto/IPassageDTO';
import IFloorDTO from '../../dto/IFloorDTO';


export default interface IPassageService {
  createPassage(passage: IPassageDTO): Promise<Result<IPassageDTO>>;
  listAllFloorsWithPassage(): Promise<Result<IFloorDTO[]>> ;
  getPassagesBuilding(codeb1:string,codeb2:string): Promise<Result<IPassageDTO[]>> ;
  updatePassage(passage: IPassageDTO): Promise<Result<IPassageDTO>>;
  getAllPassages(): Promise<Result<IPassageDTO[]>>;
}
