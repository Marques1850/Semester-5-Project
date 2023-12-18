import { Result } from "../../core/logic/Result";
import IRoomDTO from '../../dto/IRoomDTO';


export default interface IFloorService {
  createRoom( floorName:string,room: IRoomDTO): Promise<Result<IRoomDTO>>;
  
}