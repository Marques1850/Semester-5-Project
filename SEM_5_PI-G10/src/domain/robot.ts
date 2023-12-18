import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { RobotId } from "./robotId";
import { Guard } from "../core/logic/Guard";
import { RobotStatus } from "./robotStatus";

function isAlphanumeric(str : string) {
  return /^[ a-zA-Z0-9]+$/.test(str);
}

export interface robotProps {
  code: string;
  nickname: string;
  robotTypeCode: string;
  serialNumber: string;
  description: string;
  status: RobotStatus;
}

export class Robot extends AggregateRoot<robotProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get robotId(): RobotId {
    return RobotId.caller(this.id)
  }

  get code(): string {
    return this.props.code
  }

  get nickname(): string {
    return this.props.nickname
  }

  get serialNumber(): string {
    return this.props.serialNumber
  }

  get robotTypeCode(): string {
    return this.props.robotTypeCode
  }

  get description(): string {
    return this.props.description
  }

  get status (): RobotStatus {
    return this.props.status
  }

  set description (description: string) {
    this.props.description = description
  }


  protected constructor(props: robotProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: robotProps, id?: UniqueEntityID): Result<Robot> {
    const guardedProps = [
      { argument: props.code, argumentName: 'code' },
      { argument: props.nickname, argumentName: 'nickname' },
      { argument: props.robotTypeCode, argumentName: 'robotTypeId' },
      { argument: props.serialNumber, argumentName: 'serialNumber' },
      //{ argument: props.description, argumentName: 'description' },
      { argument: props.status, argumentName: 'status'}
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
    if (!guardResult.succeeded) {
      return Result.fail<Robot>(guardResult.message);
    }

    //Check if robot code is alphanumeric and length is less than 30 characters
    if (props.code.length < 1 || props.code.length > 30) {
      return Result.fail<Robot>("Robot code must be between 1 and 30 characters");
    }
    if (!isAlphanumeric(props.code)) {
      return Result.fail<Robot>("Robot code must be alphanumeric");
    }

    //Check if robot nickname is alphanumeric and length is less than 30 characters
    if (props.nickname.length < 1 || props.nickname.length > 30) {
      return Result.fail<Robot>("Robot nickname must be between 1 and 30 characters");
    }
    if (!isAlphanumeric(props.nickname)) {
      return Result.fail<Robot>("Robot nickname must be alphanumeric");
    }

    //Check is robot serial number is alphanumeric and length is less than 50 characters´
    if (props.serialNumber.length > 50) {
      return Result.fail<Robot>("Robot serial number must be between 1 and 50 characters");
    }
    if (!isAlphanumeric(props.serialNumber)) {
      return Result.fail<Robot>("Robot serial number must be alphanumeric");
    }

    //Check is descripting is alphanumeric and length is less than 250 characters
    if (!!props.description) {
      if (props.description.length > 250) {
        return Result.fail<Robot>("Robot description must be less than 250 characters");
      }
      if (!isAlphanumeric(props.description)) {
        return Result.fail<Robot>("Robot description must be alphanumeric");
      }
    }

    const robotType = new Robot({
      ...props
    }, id);

    return Result.ok<Robot>(robotType);

  }

  /* For future use
  public performTask(task: Task): Result<Task> {
    if (this.status === RobotStatus.Inhibited) {
      return Result.fail<Task>('Robot is inhibited and cannot perform tasks.');
    }
  }
  */
}
