import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { BuildingId } from "./buildingId";
import { Guard } from "../core/logic/Guard";
import { BuildingCode } from "./buildingcode";

interface BuildingProps {
  code: BuildingCode;  
  name: string;
  description: string;
  width: number;
  length: number;
}

export class Building extends AggregateRoot<BuildingProps> {
  get id (): UniqueEntityID {
    return this._id;
  }

  get code (): string {
    return this.props.code.code;
  }

  get buildingId (): BuildingId {
    return BuildingId.caller(this.id)
  }

  get name (): string {
    return this.props.name
  }

  get description (): string {
    return this.props.description
  }

  get width (): number {
    return this.props.width
  }

  get length (): number {
    return this.props.length
  }

  set description (description: string) {
    this.props.description = description
  }

  private constructor (props: BuildingProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create (props: BuildingProps, id?: UniqueEntityID): Result<Building> {
    const guardedProps = [
      { argument: props.code, argumentName: 'code'},
      { argument: props.name, argumentName: 'name' },
      { argument: props.description, argumentName: 'description' },
      { argument: props.width, argumentName: 'width' },
      { argument: props.length, argumentName: 'length' }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Building>(guardResult.message)
    } else if (props.name.length < 1 || props.name.length > 50) {
      return Result.fail<Building>('Name must be between 1 and 50 characters.')
    } else if (props.description.length < 1 || props.description.length > 250) { 
      return Result.fail<Building>('Description must be between 1 and 250 characters.')
    } else {
        const building = new Building({
          ...props
        }, id);

      return Result.ok<Building>(building);
    }
  }
}
