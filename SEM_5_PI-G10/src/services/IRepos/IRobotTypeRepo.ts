import { Repo } from "../../core/infra/Repo";
import { RobotType } from "../../domain/robotType";

export default interface IRobotTypeRepo extends Repo<RobotType> {
  save(RobotType: RobotType): Promise<RobotType>;
  findByCode(code: string): Promise<RobotType|null>;
  findByTaskCode (tasksCode: string): Promise<RobotType[]>;
  findAll(): Promise<RobotType[]>;
}