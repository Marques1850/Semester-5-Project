import MapDTO from "./IMapDTO";

export default interface IFloorDTO {
    name: string;
    description: string;
    buildingCode: string;
    level: string;
    width: string;
    length: string;
    rooms: String[];
    plant: MapDTO;
}
  