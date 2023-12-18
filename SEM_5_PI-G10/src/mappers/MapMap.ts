import { Mapper } from "../core/infra/Mapper";
import IMapDto from "../dto/IMapDTO";
import { Map } from "../domain/map";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";


export class MapMap extends Mapper<Map> {
  
  public static toDTO(map: Map): IMapDto {
    return {
        maze: map.maze,
        ground: map.ground,
        wall: map.wall,
        player: map.player
    };
  }

  public static async toDomain(map: any): Promise<Map> {
    const mapOrError = Map.create(
      {
        maze: map.maze,
        ground: map.ground,
        wall: map.wall,
        player: map.player
      }
    );

    if (mapOrError.isFailure) {
      console.log(mapOrError.error);
    }

    return mapOrError.isSuccess ? mapOrError.getValue() : null;
  }

  public static toPersistence (map: Map): any {
    const a = {
        maze: map.maze,
        ground: map.ground,
        wall: map.wall,
        player: map.player
    }
    return a;
  }
}