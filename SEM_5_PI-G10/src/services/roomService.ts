import { Service, Inject } from 'typedi';
import config from "../../config";
import  IRoomDTO from '../dto/IRoomDTO';
import { room } from "../domain/room";

import IFloorRepo from './IRepos/IFloorRepo';
import IRoomService from './IServices/IRoomService';
import { Result } from "../core/logic/Result";
import { RoomMap } from "../mappers/RoomMap";
import { List } from 'immutable';
import { Floor } from '../domain/floor';
import { Roomtype } from '../domain/roomtype';


@Service()
export default class RoomService implements IRoomService {
  constructor(
    @Inject(config.repos.floor.name) private FloorRepo : IFloorRepo,
    //@Inject('logger') private logger,
  ) {}


  public async createRoom(floorName:string,roomDTO: IRoomDTO, ): Promise<Result<IRoomDTO>> {
    try {

      const floor = await this.FloorRepo.findFloor(floorName);
      if(!floor) return Result.fail<IRoomDTO>("Floor not found");

      const roomOrError = await room.create({
        name: roomDTO.name,
        description: roomDTO.description,
        roomtype:Roomtype[(roomDTO.roomtype.charAt(0).toUpperCase() + roomDTO.roomtype.slice(1)) as keyof typeof Roomtype],
      });
   
      if (roomOrError.isFailure) {
        return Result.fail<IRoomDTO>(roomOrError.errorValue());
      }
            
      const roomResult: room = roomOrError.getValue();

      const roomDTOResult = RoomMap.toDTO(roomResult) as IRoomDTO;

      await this.FloorRepo.addRoomtoFloor(floorName,roomResult);

      return Result.ok<IRoomDTO>(roomDTOResult);
    } catch (e) {
      throw e;
    }
  }

}
