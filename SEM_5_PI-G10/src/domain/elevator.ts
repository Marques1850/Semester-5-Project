import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { elevatorID } from "./elevatorID";
import { Guard } from "../core/logic/Guard";
import { elevatorType } from "./elevatorType";


interface ElevatorProps {
    BuildingCode: string;
    ElevatorCode:string;
    FloorsAttended:number[];
    ElevatorType?: elevatorType;
    NumSerie?:string;
    Description?:string;

}

export class Elevator extends AggregateRoot<ElevatorProps> {
  get id (): UniqueEntityID {
    return this._id;
  }

  get ElevatorCode (): string {
    return this.props.ElevatorCode
  }

  get ElevatorId (): elevatorID {
    return elevatorID.caller(this.id)
  }

  get Buildingcode (): string {
    return this.props.BuildingCode
  }

  get FloorsAttended (): number[] {

    return this.props.FloorsAttended.slice(0);
  }
  
  addfloors (floor: number): void {
   this.props.FloorsAttended.push(floor);
  }

  get ElevatorType (): elevatorType {
    return this.props.ElevatorType
  }

  get NumSerie (): string {
    return this.props.NumSerie
  }

  get Description (): string {
    return this.props.Description
  }

  private constructor (props: ElevatorProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create (props: ElevatorProps, id?: UniqueEntityID): Result<Elevator> {
    const guardedProps = [
      { argument: props.BuildingCode, argumentName:'BuildingCode' },
      { argument: props.ElevatorCode, argumentName:'ElevatorCode' },
      { argument: props.FloorsAttended, argumentName: 'FloorsAttended' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Elevator>(guardResult.message)
    } else if((props.NumSerie!=undefined) && (props.NumSerie.length < 1 || props.NumSerie.length > 50)) {
        return Result.fail<Elevator>('NumSerie must be between 1 and 50 characters.');
    }else if((props.Description!=undefined) && (props.Description.length < 1 || props.Description.length > 250)) {
        return Result.fail<Elevator>('Description must be between 1 and 250 characters.');
    }else{   
      const elevator = new Elevator({
        ...props
      }, id);

      return Result.ok<Elevator>(elevator);
    }
  }
}
