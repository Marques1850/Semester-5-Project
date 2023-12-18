import { BuildingCode } from "../domain/buildingcode";

export interface IBuildingPersistence {
  _id: string;
  code: string;
  name: string;
  description: string;
  width: number;
  length: number;
}