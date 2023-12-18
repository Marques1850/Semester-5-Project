import { AggregateRoot } from "../core/domain/AggregateRoot";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { room } from "./room";
import { FloorId } from "./floorId";
import { Map } from "./map";

interface floorProps {
  name: string;
  description: string;
  buildingCode: string;
  level: number;
  width: number;
  length: number;
  rooms: room[]; // cada sala é inicializada com um array de strings vazio
  plant: Map;
}

export class Floor extends AggregateRoot<floorProps> {

  get id (): UniqueEntityID {
    return this._id;
  }

  get floorId (): FloorId {
    return FloorId.caller(this.id)
  }
  
  private constructor (props: floorProps, id?: UniqueEntityID) {
    super(props);
  }

  public static create(props: floorProps , id?: UniqueEntityID): Result<Floor> {
    const guardedProps = [
      { argument: props.name, argumentName: 'name' },
      { argument: props.description, argumentName:'description' },
      { argument: props.width, argumentName:'width' },
      { argument: props.length, argumentName: 'length' }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
    
    if (!guardResult.succeeded) {
      return Result.fail<Floor>(guardResult.message);
    } else {
      if(props.plant){
      if (props.plant.maze.size[0] > props.length || props.plant.maze.size[1] > props.width) {
        return Result.fail<Floor>("Plant dimensions exceed floor dimensions");
      }
    }
      const floor = new Floor({
        ...props
      }, id);
      return Result.ok<Floor>(floor);
  }
}

  
  public setCellDefault(x: number, y: number, String): boolean { //Metodo para definir celulas que não elevadores/passagens
    if (
      x >= 1 && // 1 e max-1 para corredores e elevadores
      x <= this.props.length-1 &&
      y >= 1 &&
      y <= this.props.width-1
    ) {
      this.props.plant[x][y] = String;
      return true; //retorna true se a celula foi definida
    }else{
      return false; //retorna false se a celula não foi definida
    }
  }
  public setCellElevatorCorridor(x: number, y: number, String): boolean { //Metodo para definir celulas que são elevadores/passagens. IF NÃO ESTA CORRETO
    if (
      ((x ==0 || x== this.props.length) && y<= this.props.width && y>= 0) || // 0 e max para corredores e elevadores
      ((y==0 || y== this.props.width) && x<= this.props.length && x>= 0)) {
      this.props.plant[x][y] = String;
      return true; //retorna true se a celula foi definida
    }else{
      return false; //retorna false se a celula não foi definida
    }
   } //Metodo para definir celulas que são elevadores/passagens

  get name (): string {
    return this.props.name;
  }
  get description (): string {
    return this.props.description;
  }
  get width (): number {
    return this.props.width;
  }
  get length (): number {
    return this.props.length;
  }
  get plant (): Map {
    return this.props.plant;
  }
  get rooms (): room[] {
    return this.props.rooms;
  }
  get level (): number {
    return this.props.level;
  }
  get buildingCode (): string {
    return this.props.buildingCode;
  }

}
