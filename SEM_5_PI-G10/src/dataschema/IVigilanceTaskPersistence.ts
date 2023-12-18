import { ITaskPersistence } from "./ITaskPersistence";

export interface IVigilanceTaskPersistence extends ITaskPersistence {
    name: string;
    floorToMonitor: string;
    emergencyNumber: number;
}