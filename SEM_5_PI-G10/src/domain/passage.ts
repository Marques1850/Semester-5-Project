import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import {Floor} from "./floor";
import {PassageId} from "./passageId";
import { PassageCode } from "./passagecode";

interface PassageProps {
  codigo: PassageCode;
  codeBuilding1: string;
  codeBuilding2: string;
  FloorBuilding1Name: string;
  FloorBuilding2Name: string;
}

export class Passage extends AggregateRoot<PassageProps> {
  get id (): UniqueEntityID {
    return this._id;
  }

  get passageId (): PassageId {
    return PassageId.caller(this.id)
  }

  get code (): string {
    return this.props.codigo.props.code;
  }

  get codigo(): PassageCode {
    return this.props.codigo;
  }

  get codeBuilding1 (): string {
    return this.props.codeBuilding1;
  }

  get codeBuilding2 (): string {
    return this.props.codeBuilding2;
  }

  get FloorBuilding1Name (): string {
    return this.props.FloorBuilding1Name;
  }

  get FloorBuilding2Name (): string {
    return this.props.FloorBuilding2Name;
  }

  private constructor (props: PassageProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: PassageProps, id?: UniqueEntityID): Result<Passage> {
    const guardedProps = [
      { argument: props.codigo, argumentName: 'codigo'},
      { argument: props.codeBuilding1, argumentName: 'codeBuilding1' },
      { argument: props.codeBuilding2, argumentName: 'codeBuilding2' },
      { argument: props.FloorBuilding1Name, argumentName: 'FoorBuilding1Name' },
      { argument: props.FloorBuilding2Name, argumentName: 'FoorBuilding2Name' }
    ];
    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
    
    if (!guardResult.succeeded) {
      return Result.fail<Passage>(guardResult.message);
    } else {
        const passage = new Passage({
          ...props
        }, id);

      return Result.ok<Passage>(passage);
    }
  }
}
