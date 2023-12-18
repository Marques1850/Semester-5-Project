import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IElevatorController from "./IControllers/IElevatorController";
import IElevatorService from '../services/IServices/IElevatorService';
import IElevatorDTO from '../dto/IElevatorDTO';

import { Result } from "../core/logic/Result";
import IBuildingDTO from '../dto/IBuildingDTO';

@Service()
export default class ElevatorController implements IElevatorController {
  constructor(
      @Inject(config.services.elevator.name) private ElevatorServiceInstance : IElevatorService
  ) {}

  public async createElevator(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }
     
      const ElevatorOrError = await this.ElevatorServiceInstance.createElevator(req.body as IElevatorDTO) as Result<IElevatorDTO>;

      if (ElevatorOrError.isFailure) {
        res.status(400).send(ElevatorOrError.errorValue());
      } else {
        const ElevatorDTO = ElevatorOrError.getValue();
        res.status(201).json(ElevatorDTO);
      }
    } catch (e) {
      next(e);
    }
  };

  public async updateElevator(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }
      const ElevatorOrError = await this.ElevatorServiceInstance.updateElevator(req.body as IElevatorDTO) as Result<IElevatorDTO>;
         
      if (ElevatorOrError.isFailure) {
        res.status(400).send(ElevatorOrError.errorValue());
      } else {
        const ElevatorDTO = ElevatorOrError.getValue();
        res.status(201).json(ElevatorDTO);
      }
    } catch (e) {
      next(e);
    }
  };

    public async listElevators(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          if(!this.checkPermissions((<any>req).token)){
            res.status(401).send("Unauthorized");
            return;
         }
        const ElevatorOrError = await this.ElevatorServiceInstance.listElevatorsInBuilding(req.query.BuildingCode as string) as Result<IElevatorDTO>;
    
        if (ElevatorOrError.isFailure) {
            res.status(400).send(ElevatorOrError.errorValue());
        } else {
            const ElevatorDTO = ElevatorOrError.getValue();
            res.status(201).json(ElevatorDTO);
        }
        } catch (e) {
        next(e);
        }
    };

    public async listAllElevators(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          if(!this.checkPermissions((<any>req).token)){
            res.status(401).send("Unauthorized");
            return;
         }
        const ElevatorOrError = await this.ElevatorServiceInstance.listAllElevators() as Result<IElevatorDTO[]>;
    
        if (ElevatorOrError.isFailure) {
            res.status(400).send(ElevatorOrError.errorValue());
        } else {
            const ElevatorDTO = ElevatorOrError.getValue();
            res.status(201).json(ElevatorDTO);
        }
        } catch (e) {
        next(e);
        }
    };

    public async listBuildingWithoutElevators(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          if(!this.checkPermissions((<any>req).token)){
            res.status(401).send("Unauthorized");
            return;
         }
        const ElevatorOrError = await this.ElevatorServiceInstance.listBuildingWithoutElevators() as Result<IBuildingDTO[]>;
    
        if (ElevatorOrError.isFailure) {
            res.status(400).send(ElevatorOrError.errorValue());
        } else {
            const ElevatorDTO = ElevatorOrError.getValue();
            res.status(201).json(ElevatorDTO);
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
