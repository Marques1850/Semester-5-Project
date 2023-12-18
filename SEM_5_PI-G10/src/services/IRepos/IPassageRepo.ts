import { Repo } from "../../core/infra/Repo";
import { Passage } from "../../domain/passage";
import { PassageId } from "../../domain/passageId";

export default interface IPassageRepo extends Repo<Passage> {
  save(Passage: Passage): Promise<Passage>;
  findByPassageCode(PassageCode: string): Promise<Passage|null>;
  findAll(): Promise<Passage[]>;
  findByBuildingCodes(codeBuilding1: string,codeBuilding2:string): Promise<Passage[]>;
  changePassage(cod: string, codeBuilding1: string, codeBuilding2: string, FloorBuilding1Name: string, FloorBuilding2Name: string): Promise<Passage>;
  
}