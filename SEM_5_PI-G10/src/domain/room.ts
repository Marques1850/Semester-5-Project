import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import {Roomtype} from "./roomtype";

export interface roomProps {
  name: string;
  description:string;
  roomtype: Roomtype;
  
}

export class room extends ValueObject<roomProps> {
  get name (): string {
    return this.props.name;
  }
  
  get roomtype (): Roomtype {
    return this.props.roomtype;
  }

  get description (): string {
    return this.props.description;
  }

  private constructor (props: roomProps) {
    super(props);
  }
 

  public static create (props: roomProps): Result<room> {
    const guardedProps = [
      { argument: props.name, argumentName: 'name'},
      { argument: props.roomtype, argumentName: 'type'},
      { argument: props.description, argumentName: 'description'}
    ];
    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
    if (!guardResult.succeeded) {
      return Result.fail<room>(guardResult.message)
    }     
    else {
      const roomEx = new room({
        ...props
      });

      return Result.ok<room>(roomEx);
    }
  }
}