import { Service, Inject } from 'typedi';
import { Document, FilterQuery, Model } from 'mongoose';
import { ITaskPersistence } from '../dataschema/ITaskPersistence';
import { IDeliveryTaskPersistence } from '../dataschema/IDeliveryTaskPersistence';
import { IVigilanceTaskPersistence } from '../dataschema/IVigilanceTaskPersistence';
import { TaskId } from '../domain/taskId';
import { DeliveryTask } from '../domain/deliveryTask';
import { VigilanceTask } from '../domain/vigilanceTask';
import ITaskRepo from '../services/IRepos/ITaskRepo';
import { TaskMap } from '../mappers/TaskMap';
import { Task } from '../domain/task';


@Service()
export default class taskRepo implements ITaskRepo {
  private models: any;

  constructor(
    @Inject('taskSchema') private taskSchema : Model<ITaskPersistence & Document>,
    @Inject('deliveryTaskSchema') private deliveryTaskSchema : Model<IDeliveryTaskPersistence & Document>,
    @Inject('vigilanceTaskSchema') private vigilanceTaskSchema : Model<IVigilanceTaskPersistence & Document>,
    //@Inject('logger') private logger
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(code: TaskId | string): Promise<boolean> {
    
    const idX = TaskId instanceof TaskId ? (<TaskId>code).id.toValue : code;

    const query = { domainId: idX}; 
    const buildingDocument = await this.taskSchema.findOne( query );

    return !!buildingDocument === true;
  }

  public async save (task: DeliveryTask | VigilanceTask): Promise<DeliveryTask | VigilanceTask> {
    const query = { code: task.code}; 
    
    const taskDocument = await this.taskSchema.findOne( query );

    try {
      if (taskDocument === null ) {
        const rawTask: any = TaskMap.toPersistence(task);
        let taskCreated;
        if ( task instanceof DeliveryTask ) {
          taskCreated = await this.deliveryTaskSchema.create(rawTask);
        } else if ( task instanceof VigilanceTask ){
          taskCreated = await this.vigilanceTaskSchema.create(rawTask);
        }
        return TaskMap.toDomain(taskCreated);
      } else {
        
        await taskDocument.save();
        return task;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findAll(): Promise<Task[]> {

    const deliveryTasksRecords = await this.deliveryTaskSchema.find();
    const vigilanceTasksRecords = await this.vigilanceTaskSchema.find();
    const tasksRecords = await this.taskSchema.find();

    const deliveryTasks = deliveryTasksRecords.map(taskRecord =>
      TaskMap.toDomainTask(taskRecord)
    );

    const vigilanceTasks = vigilanceTasksRecords.map(taskRecord =>
      TaskMap.toDomainTask(taskRecord)
    );

    const tasksMain = tasksRecords.map(taskRecord =>
      TaskMap.toDomainTask(taskRecord)
    );

    const allTasks = deliveryTasks.concat(vigilanceTasks).concat(tasksMain);

    console.log("allTasks",allTasks);
    return allTasks;
  }

  public async findByTaskCode(code: TaskId | string): Promise<Task> {
    const idX = TaskId instanceof TaskId ? (<TaskId>code).id.toValue : code;

    const query = { domainId: idX}; 
    const taskRecord = await this.taskSchema.findOne( query );   //TODO: Fix não encontra 

    if (taskRecord != null) {
      return TaskMap.toDomainTask(taskRecord);
    } else {
      return null;
    }
  }
  
}
    