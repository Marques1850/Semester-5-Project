import { Service, Inject } from 'typedi';
import config from "../../config";
import ITaskService from './IServices/ITaskService';
import { Result } from "../core/logic/Result";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { IVigilanceTaskDTO, IDeliveryTaskDTO } from "../dto/ITaskDTO";
import { Request} from 'express';
import ITaskRepo from './IRepos/ITaskRepo';
import { TypeTask } from '../domain/typeTask';
import { DeliveryTask } from '../domain/deliveryTask';
import { VigilanceTask } from '../domain/vigilanceTask';
import { TaskMap } from '../mappers/TaskMap';

@Service()
export default class taskService implements ITaskService {
  constructor(
      @Inject(config.repos.task.name) private TaskRepo : ITaskRepo,
      @Inject('logger') private logger,
  ) {}


  public async createTask(req: Request): Promise<Result<IVigilanceTaskDTO | IDeliveryTaskDTO>> {
    try {
      if( req.body.typeTask !== TypeTask.DELIVERY && req.body.typeTask !== TypeTask.VIGILANCE ) {
        return Result.fail<IVigilanceTaskDTO | IDeliveryTaskDTO>("TypeTask not valid");
      }
      const taskDoc = await this.TaskRepo.findByTaskCode(req.body.code);
      const found = !!taskDoc;
      if (found) {
        return Result.fail<IVigilanceTaskDTO | IDeliveryTaskDTO>("Task already exists with that code");
      }
      
      let taskOrError;
      if( req.body.typeTask == TypeTask.DELIVERY ) {
        taskOrError = DeliveryTask.create(req.body as IDeliveryTaskDTO);
      }
      if( req.body.typeTask == TypeTask.VIGILANCE ) {
        const data : IVigilanceTaskDTO = req.body;
        taskOrError = VigilanceTask.create(req.body as IVigilanceTaskDTO);
      }
      if (taskOrError.isFailure) {
        return Result.fail<IVigilanceTaskDTO | IDeliveryTaskDTO>(taskOrError.errorValue());
      }

      const taskResult = taskOrError.getValue();
      const final = await this.TaskRepo.save(taskResult);
      return Result.ok<IVigilanceTaskDTO | IDeliveryTaskDTO>(TaskMap.toDTO(final));
     
    } catch (e) {
      throw e;
    }
  }

  public async getAllTasks(): Promise<Result<Array<IVigilanceTaskDTO | IDeliveryTaskDTO>>> {
    try {
      const tasks = await this.TaskRepo.findAll();
      console.log("heyy",tasks);
      const tasksDTO = tasks.map((task) => TaskMap.toDTO(task));
      return Result.ok<Array<IVigilanceTaskDTO | IDeliveryTaskDTO>>(tasksDTO);
    } catch (e) {
      throw e;
    }
  }

}
