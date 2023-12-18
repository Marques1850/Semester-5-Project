import { Repo } from "../../core/infra/Repo";
import { Building } from "../../domain/building";

export default interface IBuildingRepo extends Repo<Building> {
  save(Building: Building): Promise<Building>;
  changeBuilding (codigo1: string, name1: string, description1: string, width1: number, length1: number): Promise<Building>;
  findAll(): Promise<Building[]>;
  findByBuildingCode(buildingCode: string): Promise<Building | null>;
}