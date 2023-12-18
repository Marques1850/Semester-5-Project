import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { room } from "./room";

const alphanumericRegex = /^[ a-zA-Z0-9]+$/;

interface elevatorTypeProps {
  marca: string;
  modelo: string;
}

export class elevatorType extends ValueObject<elevatorTypeProps> {

  
  private constructor (props: elevatorTypeProps, id?: UniqueEntityID) {
    super(props);
  }

  public static create(props: elevatorTypeProps , id?: UniqueEntityID): Result<elevatorType> {
    const guardedProps = [
      { argument: props.marca, argumentName: 'marca' },
      { argument: props.modelo, argumentName:'modelo' },
    ];
    
    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    
    if (!guardResult.succeeded) {
      return Result.fail<elevatorType>(guardResult.message)
    } else if (alphanumericRegex.test(props.marca) == false) {
        return Result.fail<elevatorType>("Marca must be alphanumeric");
    }else if (alphanumericRegex.test(props.modelo) == false) {
        return Result.fail<elevatorType>("Modelo must be alphanumeric");
    }else if (props.marca.length < 1 || props.marca.length > 50) {
        return Result.fail<elevatorType>('Marca must be between 1 and 50 characters.');
    }else if (props.modelo.length < 1 || props.modelo.length > 50) {
        return Result.fail<elevatorType>('Modelo must be between 1 and 50 characters.');
    }else {
      
      const floor = new elevatorType({
        ...props
      }, id);

      return Result.ok<elevatorType>(floor);

  }
}


  get marca (): string {
    return this.props.marca;
  }
  get modelo (): string {
    return this.props.modelo;
  }

  public equals(vo?: ValueObject<elevatorTypeProps>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (!(vo instanceof elevatorType)) {
      return false;
    }
    return this.props.marca === vo.props.marca && this.props.modelo === vo.props.modelo;
  }


}
