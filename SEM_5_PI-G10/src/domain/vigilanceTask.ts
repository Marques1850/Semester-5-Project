import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { Task, taskProps } from "./task";


export interface VigilanceTaskProps extends taskProps{
  name: string;
  floorToMonitor: string;
  emergencyNumber: number;
}

export class VigilanceTask extends Task {
  private name: string;
  private floorToMonitor: string;
  private emergencyNumber: number;

  get id (): UniqueEntityID {
    return super.id;
  }

  private constructor (props: VigilanceTaskProps, id?: UniqueEntityID) {
    super(props, id);
    this.name = props.name;
    this.floorToMonitor = props.floorToMonitor;
    this.emergencyNumber = props.emergencyNumber;
  }

  public static create(props: VigilanceTaskProps, id?: UniqueEntityID): Result<VigilanceTask> {
    const guardedProps = [
      { argument: props.name, argumentName: 'name' },
      { argument: props.floorToMonitor, argumentName: 'floorToMonitor' },
      { argument: props.emergencyNumber, argumentName: 'emergencyNumber' }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<VigilanceTask>(guardResult.message);
    } else {
      const vigilanceTask = new VigilanceTask(props, id);
      return Result.ok<VigilanceTask>(vigilanceTask);
    }
  }

  get getName (): string {
    return this.name;
  }

  get getFloorToMonitor (): string {
    return this.floorToMonitor;
  }

  get getEmergencyNumber (): number {
    return this.emergencyNumber;
  }
}