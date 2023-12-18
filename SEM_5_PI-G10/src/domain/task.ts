import { AggregateRoot } from "../core/domain/AggregateRoot";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { TypeTask } from "./typeTask";
import { TaskId } from "./taskId";

export interface taskProps {
  code: string;
  typeTask: string;
  description: string;
}

export class Task extends AggregateRoot<taskProps> {

  get id (): UniqueEntityID {
    return this._id;
  }

  get taskId (): TaskId {
    return TaskId.caller(this.id)
  }
  
  protected constructor (props: taskProps, id?: UniqueEntityID) {
    super(props);
  }

  public static create(props: taskProps , id?: UniqueEntityID): Result<Task> {
    const guardedProps = [
      { argument: props.code, argumentName: 'code' },
      { argument: props.typeTask, argumentName:'typeTask' },
      { argument: props.description, argumentName:'description'}
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
    
    if (!guardResult.succeeded) {
      return Result.fail<Task>(guardResult.message);
    } else {
      if (props.typeTask !== TypeTask.DELIVERY && props.typeTask !== TypeTask.VIGILANCE){
          return Result.fail<Task>('Invalid typeTask');
      } 
      const floor = new Task({
          ...props
      }, id);
      return Result.ok<Task>(floor);
    }
  }

  get code (): string {
    return this.props.code;
  }

  get typeTask (): string {
    return this.props.typeTask;
  }
  
  get description (): string {
    return this.props.description;
  }
}
