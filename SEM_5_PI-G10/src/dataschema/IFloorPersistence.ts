import { room } from "../domain/room";
import { Map } from "../domain/map";

export interface IFloorPersistence {
  name: string;
  description: string;
  buildingCode: string;
  level: number;
  width: number;
  length: number;
  rooms: room[];
  plant: Map;
}