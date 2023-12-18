import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { RobotTypeId } from "./robotTypeId";
import { Guard } from "../core/logic/Guard";
import { RobotTypeCode } from "./robotTypecode";

export interface robotTypeProps {
  code: RobotTypeCode;
  description: string;
  tasksCode: string[];
}

export class RobotType extends AggregateRoot<robotTypeProps> {
  get id (): UniqueEntityID {
    return this._id;
  }

  get robotTypeId (): RobotTypeId {
    return RobotTypeId.caller(this.id)
  }

  get code (): string {
    return this.props.code.code
  }
  get RobotTypeCode (): RobotTypeCode {
    return this.props.code
  }

  get description (): string {
    return this.props.description
  }

  set description (description: string) {
    this.props.description = description
  }

  get tasksCode (): string[] {
    return this.props.tasksCode
  }

  protected constructor (props: robotTypeProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create (props: robotTypeProps, id?: UniqueEntityID): Result<RobotType> {
    const guardedProps = [
      { argument: props.code, argumentName: 'code'},
      { argument: props.description, argumentName: 'description' },
      { argument: props.tasksCode, argumentName: 'tasksCode'}
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<RobotType>(guardResult.message)
    } else if (props.code.code.length < 1 || props.code.code.length > 50) {
      return Result.fail<RobotType>('Name must be between 1 and 50 characters.')
    } else {
        const robotType = new RobotType({
          ...props
        }, id);

      return Result.ok<RobotType>(robotType);
    }
  }
}
