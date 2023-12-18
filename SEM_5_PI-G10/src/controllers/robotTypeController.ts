import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IRobotTypeController from "./IControllers/IRobotTypeController";
import IRobotTypeService from '../services/IServices/IRobotTypeService';
import IRobotTypeDTO from '../dto/IRobotTypeDTO';

import { Result } from "../core/logic/Result";

@Service()
export default class robotTypeController implements IRobotTypeController {
  constructor(
      @Inject(config.services.robotType.name) private robotTypeServiceInstance : IRobotTypeService,
  ) {}

  public async createRobotType(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }

      const robotTypeOrError = await this.robotTypeServiceInstance.createRobotType(req.body as IRobotTypeDTO) as Result<IRobotTypeDTO>;

      if (robotTypeOrError.isFailure) {
        res.status(400).send(robotTypeOrError.errorValue());
      } else {
        const robotTypeDTO = robotTypeOrError.getValue();
        res.status(201).json(robotTypeDTO);
      }
    } catch (e) {
      next(e);
    }
  };

  public async getRobotTypes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }

      const robotTypesOrError = await this.robotTypeServiceInstance.getRobotTypes() as Result<IRobotTypeDTO[]>;

      if (robotTypesOrError.isFailure) {
        res.status(400).send(robotTypesOrError.errorValue());
      } else {
        const robotTypesDTO = robotTypesOrError.getValue();
        res.status(200).json(robotTypesDTO);
      }
    } catch (e) {
      next(e);
    }
  }

  public checkPermissions(token:any){
    const userRole = token['http://localhost:4200/startMenuuserRole'];
    if(userRole == "Admin" || userRole== "FleetManager"){//admin or campus manager
      return true;
    }
    return false;
  }

}
