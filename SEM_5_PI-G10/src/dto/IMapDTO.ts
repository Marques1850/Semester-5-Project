interface MazeProps {
  size: [number, number];
  map: string [][];
  exits: Array<[number, number]>;
  elevators: Array<[number, number]>;
  exitLocation: Array<[number, number]>;
  exitFloor: Array<string>;
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

export default interface IMapDTO {
    maze: MazeProps;
    ground: GroundProps;
    wall: WallProps;
    player: PlayerProps;
}