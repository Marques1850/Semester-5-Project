import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IRoomController from "./IControllers/IRoomController";
import IRoomService from '../services/IServices/IRoomService';
import IRoomDTO from '../dto/IRoomDTO';

import { Result } from "../core/logic/Result";

@Service()
export default class RoomController implements IRoomController {
  constructor(
      @Inject(config.services.room.name) private RoomServiceInstance : IRoomService
  ) {}

  public async createRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }
      const RoomOrError = await this.RoomServiceInstance.createRoom(req.body.floorName as string ,req.body as IRoomDTO) as Result<IRoomDTO>;

      if (RoomOrError.isFailure) {
        res.status(400).send(RoomOrError.errorValue());
      } else {
        const RoomDTO = RoomOrError.getValue();
        res.status(201).json(RoomDTO);
      }
    } catch (e) {
      next(e);
    }
  };

  public checkPermissions(token:any){
    const userRole = token['http://localhost:4200/startMenuuserRole'];
    if(userRole == "Admin" || userRole== "CampusManager"){//admin or campus manager
      return true;
    }
    return false;
  }
  
}
