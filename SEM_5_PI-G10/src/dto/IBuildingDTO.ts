import {Floor} from "../domain/floor";
import {List} from "immutable";

export default interface IBuildingDTO {
    code: string;
    name: string;
    description: string;
    width: number;
    length: number;
}
  