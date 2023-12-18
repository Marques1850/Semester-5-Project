import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IRobotController from "./IControllers/IRobotController";
import IRobotService from '../services/IServices/IRobotService';
import IRobotDTO from '../dto/IRobotDTO';

import IRobotTypeService from '../services/IServices/IRobotTypeService';

import { Result } from "../core/logic/Result";
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import IRobotTypeDTO from '../dto/IRobotTypeDTO';

@Service()
export default class robotController implements IRobotController {
  constructor(
      @Inject(config.services.robot.name) private robotServiceInstance : IRobotService,
      @Inject(config.services.robotType.name) private robotTypeServiceInstance : IRobotTypeService,
  ) {}

  public async createRobot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }

      const robotOrError = await this.robotServiceInstance.createRobot(req.body as IRobotDTO) as Result<IRobotDTO>;

      if (robotOrError.isFailure) {
        res.status(400).send(robotOrError.errorValue());
      } else {
        const robotDTO = robotOrError.getValue();
        res.status(201).json(robotDTO);
      }
    } catch (e) {
      next(e);
    }
  };

  public async getRobots(req: Request,res:Response, next: NextFunction): Promise<void> {
    try {

      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }

      const robotsOrError = await this.robotServiceInstance.getRobots() as Result<IRobotDTO[]>;

      if (robotsOrError.isFailure) {
        res.status(400).send(robotsOrError.errorValue());
      } else {
        const robotDTO = robotsOrError.getValue();
        res.status(200).json(robotDTO);
      }
    } catch (e) {
      next(e);
    }
  };

  public async inhibitRobot(req: Request,res:Response, next: NextFunction): Promise<void> {
    try {

      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }

      const robotOrError = await this.robotServiceInstance.inhibitRobot(req.body as IRobotDTO) as Result<IRobotDTO>;

      if (robotOrError.isFailure) {
        res.status(400).send(robotOrError.errorValue());
      } else {
        const robotDTO = robotOrError.getValue();
        res.status(200).json(robotDTO);
      }
    } catch (e) {
      next(e);
    }
  };

  public async getRobotsByTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{

      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }

      const robotTypesOrError = await this.robotTypeServiceInstance.getRobotTypesByTask(req.query.tasksCode as string) as Result<IRobotTypeDTO[]>;
      if (robotTypesOrError.isFailure) {
        res.status(400).send(robotTypesOrError.errorValue());
      } else {
        const robotTypesDTOs = robotTypesOrError.getValue();
        const robotsOrError = await this.robotServiceInstance.getRobotsByRobotTypes(robotTypesDTOs) as Result<IRobotDTO[]>;
        if (robotsOrError.isFailure) {
          res.status(400).send(robotsOrError.errorValue());
        } else {
          const robotDTOs = robotsOrError.getValue();
          res.status(200).json(robotDTOs);
        }
      }
    } catch (e) {
      next(e);
    }

  };

  public checkPermissions(token:any){
    const userRole = token['http://localhost:4200/startMenuuserRole'];
    if(userRole == "Admin" || userRole== "FleetManager"){//admin or campus manager
      return true;
    }
    return false;
  }
  
}
