import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import ITaskController from "./IControllers/ITaskController";
import ITaskService from '../services/IServices/ITaskService';


import { Result } from "../core/logic/Result";
import { IVigilanceTaskDTO, IDeliveryTaskDTO } from "../dto/ITaskDTO";

@Service()
export default class taskController implements ITaskController {
  constructor(
      @Inject(config.services.task.name) private taskServiceInstance : ITaskService,
  ) {}

  public async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const taskOrError = await this.taskServiceInstance.createTask(req) as Result<IVigilanceTaskDTO | IDeliveryTaskDTO>;

      if (taskOrError.isFailure) {
        res.status(402).send(taskOrError.errorValue());
      } else {
        const taskDTO = taskOrError.getValue();
        res.json(taskDTO).status(201);
      }
    } catch (e) {
      next(e);
    }
  };

  public async getAllTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasksOrError = await this.taskServiceInstance.getAllTasks() as Result<Array<IVigilanceTaskDTO | IDeliveryTaskDTO>>;

      if (tasksOrError.isFailure) {
        res.status(402).send(tasksOrError.errorValue());
      } else {
        const tasksDTO = tasksOrError.getValue();
        res.json(tasksDTO).status(200);
      }
    } catch (e) {
      next(e);
    }
  }

}
