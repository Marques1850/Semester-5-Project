import { Repo } from "../../core/infra/Repo";
import { Floor } from "../../domain/floor";
import IFloorDTO from "../../dto/IFloorDTO";
import { room } from "../../domain/room";
import { Map } from "../../domain/map";

export default interface IFloorRepo extends Repo<Floor> {
  save(Floor: Floor): Promise<Floor>;
  updateFloor(floor: Floor): Promise<Floor>;
  getFloorByName(floorName: string): Promise<Floor>;
  findAll(): Promise<Floor[]>;
  exists(floorName: string | Floor): Promise<boolean>;
  findFloor(floorName: string): Promise<Floor|null>;
  uploadMapFloorinBuilding(floorName:string , map:Map): Promise<Floor>;
  findByBuildingCode(buildingCodigo: string): Promise<Floor[]>;
  addRoomtoFloor(floorName:string,room:room): Promise<void>;
  getAllFloors(): Promise<Floor[]>;
}