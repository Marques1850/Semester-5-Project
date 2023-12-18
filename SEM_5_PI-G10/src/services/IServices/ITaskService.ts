import { Result } from "../../core/logic/Result";
import { Request, Response, NextFunction } from 'express';
import { IVigilanceTaskDTO } from "../../dto/ITaskDTO";
import { IDeliveryTaskDTO } from "../../dto/ITaskDTO";


export default interface ITaskService {
    createTask(req: Request): Promise<Result<IVigilanceTaskDTO | IDeliveryTaskDTO>>;
    getAllTasks(): Promise<Result<Array<IVigilanceTaskDTO | IDeliveryTaskDTO>>>;
}
