import { Repo } from "../../core/infra/Repo";
import { Robot } from "../../domain/robot";

export default interface IRobotRepo extends Repo<Robot> {
  save(robot: Robot): Promise<Robot>;
  findByCode(code: string): Promise<Robot|null>;
  findBySerialNumber(serialNumber: string): Promise<Robot|null>;
  findAll(): Promise<Robot[]>;
  inhibitRobot (robotTypeCode: string): Promise<Robot>;
  findByTypeCode(robotTypeCode: string): Promise<Robot[]>;
}