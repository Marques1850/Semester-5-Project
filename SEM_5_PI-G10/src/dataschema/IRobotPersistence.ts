import { RobotStatus } from "../domain/robotStatus";

export interface IRobotPersistence {
    _id: string;
    code: string;
    nickname: string;
    robotTypeCode: string;
    serialNumber: string;
    description: string;
    status: RobotStatus;
  }