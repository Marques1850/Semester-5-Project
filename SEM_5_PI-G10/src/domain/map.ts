import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { ValueObject } from "../core/domain/ValueObject";

interface MazeProps {
  size: [number, number];
  map: string [][];
  exits: Array<[number, number]>;
  elevators: Array<[number, number]>;
  exitLocation: Array<[number, number]>;
  exitFloor: Array<string>;
  rooms: Array<roomProps>;
 
}

interface roomProps{
  nome: string;
  x: number;
  y: number;
}

interface GroundProps {
  size: { width: number, height: number, depth: number };
  segments: { width: number, height: number };
  primaryColor: string;
  maps: {
    color: { url: string };
    ao: { url: string, intensity: number };
    displacement: { url: string, scale: number, bias: number };
    normal: { url: string, type: number, scale: { x: number, y: number } };
    bump: { url: string, scale: number };
    roughness: { url: string, rough: number };
  };
  wrapS: number;
  wrapT: number;
  repeat: { u: number, v: number };
  magFilter: number;
  minFilter: number;
  secondaryColor: string;
}

interface WallProps {
  segments: { width: number, height: number };
  primaryColor: string;
  maps: {
    color: { url: string };
    ao: { url: string, intensity: number };
    displacement: { url: string, scale: number, bias: number };
    normal: { url: string, type: number, scale: { x: number, y: number } };
    bump: { url: string, scale: number };
    roughness: { url: string, rough: number };
  };
  wrapS: number;
  wrapT: number;
  repeat: { u: number, v: number };
  magFilter: number;
  minFilter: number;
  secondaryColor: string;
}

interface GroundProps {
  size: { width: number, height: number, depth: number };
  segments: { width: number, height: number };
  primaryColor: string;
  maps: {
    color: { url: string };
    ao: { url: string, intensity: number };
    displacement: { url: string, scale: number, bias: number };
    normal: { url: string, type: number, scale: { x: number, y: number } };
    bump: { url: string, scale: number };
    roughness: { url: string, rough: number };
  };
  wrapS: number;
  wrapT: number;
  repeat: { u: number, v: number };
  magFilter: number;
  minFilter: number;
  secondaryColor: string;
}

interface PlayerProps {
  initialPosition: [number, number];
  initialDirection: number;
}


interface MapProps {
  maze: MazeProps; 
  ground: GroundProps;
  wall: WallProps;
  player: PlayerProps;
}

export class Map extends ValueObject<MapProps> {

  get maze (): MazeProps {
    return this.props.maze;
  }

  get ground (): GroundProps {
    return this.props.ground;
  }
 
  get wall (): WallProps {
    return this.props.wall;
  }

  get player (): PlayerProps {
    return this.props.player;
  }

  private constructor (props: MapProps) {
    super(props);
  }

  public static create (props: MapProps, id?: UniqueEntityID): Result<Map> {
    const guardedProps = [
      { argument: props.maze, argumentName: 'maze' },
      { argument: props.ground, argumentName: 'ground' },
      { argument: props.wall, argumentName: 'wall' },
      { argument: props.player, argumentName: 'player' }
    ];
    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Map>(guardResult.message)
    } else {
        const map = new Map({
          ...props
        });

      return Result.ok<Map>(map);
    }
  }
}
