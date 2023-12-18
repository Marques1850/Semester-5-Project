import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IPassageController from "./IControllers/IPassageController";
import IPassageService from '../services/IServices/IPassageService';
import IPassageDTO from '../dto/IPassageDTO';


import { Result } from "../core/logic/Result";
import IFloorDTO from '../dto/IFloorDTO';

@Service()
export default class PassageController implements IPassageController {
  constructor(
      @Inject(config.services.passage.name) private passageServiceInstance : IPassageService
  ) {}

  public async createPassage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }
      const passageOrError = await this.passageServiceInstance.createPassage(req.body as IPassageDTO) as Result<IPassageDTO>;

      if (passageOrError.isFailure) {
        res.status(400).send(passageOrError.errorValue());
      } else {
        const passageDTO = passageOrError.getValue();
        res.status(201).json(passageDTO);
      }
    } catch (e) {
      next(e);
    }
  };

  public async getFloorsWithPassage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }
      const floorsOrError = await this.passageServiceInstance.listAllFloorsWithPassage() as Result<IFloorDTO[]>;
      if(floorsOrError.isFailure){
        res.status(400).send(floorsOrError.errorValue());
      } else {
        const floorsDTO = floorsOrError.getValue();
        res.status(200).json(floorsDTO);
      }
    }catch (e) {
      next(e);
    }
  }

  public async getPassagesBuilding(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }
      const building1= req.query.codeBuilding1 as string;
      const building2 = req.query.codeBuilding2 as string;
      if (building1===null || building2===null) {
        res.status(400).json({ error: 'building 1 and 2 should not benull.' });
        return;
      }
      const passagesOrError = await this.passageServiceInstance.getPassagesBuilding(building1 ,building2) as Result<IPassageDTO[]>;
      if(passagesOrError.isFailure){
        res.status(400).send(passagesOrError.errorValue());
      } else {
        const passagesDTO = passagesOrError.getValue();
        res.status(200).json(passagesDTO);
      }
    }catch (e) {
      next(e);
    }
  }

  public async updatePassage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }
      const passagesOrError = await this.passageServiceInstance.updatePassage(req.body as IPassageDTO) as Result<IPassageDTO>;
      if (passagesOrError.isFailure) {
        res.status(400).send(passagesOrError.errorValue());
      } else {
        const passagesDTO = passagesOrError.getValue();
        res.status(200).json(passagesDTO);
      }
    }catch (e) {
      next(e);
    }
  }

  public  async getAllPassages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }
      const passagesOrError = await this.passageServiceInstance.getAllPassages() as Result<IPassageDTO[]>;
      if (passagesOrError.isFailure) {
        res.status(400).send(passagesOrError.errorValue());
      } else {
        const passagesDTO = passagesOrError.getValue();
        res.status(200).json(passagesDTO);
      }
    }catch (e) {
      next(e);
    }
      
  }

  public checkPermissions(token:any){
      const userRole = token['http://localhost:4200/startMenuuserRole'];
      if(userRole == "Admin" || userRole== "CampusManager"){//admin or campus manager
        return true;
      }
      return false;
    }
  }


