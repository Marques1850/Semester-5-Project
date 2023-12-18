import { Repo } from "../../core/infra/Repo";
import { VigilanceTask } from "../../domain/vigilanceTask";
import { DeliveryTask } from "../../domain/deliveryTask";
import { Task } from "../../domain/task";
import { TaskId } from "../../domain/taskId";


export default interface ITaskRepo extends Repo<Task> {
  save(task: DeliveryTask | VigilanceTask): Promise<DeliveryTask | VigilanceTask>;
  findAll(): Promise<Task[]>;
  findByTaskCode(code: TaskId | string): Promise<Task>;
}