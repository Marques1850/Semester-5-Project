import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IBuildingController from "./IControllers/IBuildingController";
import IBuildingService from '../services/IServices/IBuildingService';
import IFloorService from '../services/IServices/IFloorService';
import IBuildingDTO from '../dto/IBuildingDTO';
import IFloorDTO from '../dto/IFloorDTO';

import { Result } from "../core/logic/Result";

@Service()
export default class BuildingController implements IBuildingController {
  constructor(
      @Inject(config.services.building.name) private buildingServiceInstance : IBuildingService,
      @Inject(config.services.floor.name) private floorServiceInstance : IFloorService
  ) {}

  public async createBuilding(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if(!this.checkPermissions((<any>req).token)){
        res.status(400).send("Your role doesn't have permissions");
        return;
     }
      const buildingOrError = await this.buildingServiceInstance.createBuilding(req.body as IBuildingDTO) as Result<IBuildingDTO>;

      if (buildingOrError.isFailure) {
        res.status(400).send(buildingOrError.errorValue());
      } else {
        const buildingDTO = buildingOrError.getValue();
        res.status(201).json(buildingDTO);
      }
    } catch (e) {
      next(e);
    }
  };

  public async updateBuilding(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Your role doesn't have permissions");
        return;
     }
      const buildingOrError = await this.buildingServiceInstance.updateBuilding(req.body as IBuildingDTO) as Result<IBuildingDTO>;

      if (buildingOrError.isFailure) {
        res.status(400).send(buildingOrError.errorValue());
      } else {
        const buildingDTO = buildingOrError.getValue();
        res.status(201).json(buildingDTO);
      }
    } catch (e) {
      next(e);
    }
  };

  public async listAllbuildings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRole = (<any>req).token['http://localhost:4200/startMenuuserRole'];

      if(!this.checkPermissions((<any>req).token) &&userRole!= "TaskManager" && userRole != "FleetManager"){
        res.status(401).send("Your role doesn't have permissions");
        return;
     }
     
      const buildingOrError = await this.buildingServiceInstance.listAllBuildings() as Result<IBuildingDTO[]>;
      if (buildingOrError.isFailure) {
        res.status(400).send(buildingOrError.errorValue());
      } else {
        const buildingDTOs = buildingOrError.getValue();
        res.status(200).json(buildingDTOs);
      }
    } catch (e) {
      next(e);
    }
  }

  public async listBuildingsWithFloorRange(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).json("Your role doesn't have permissions");
        return;
      }
      
      const min = req.query.min;
      const max = req.query.max;
      if (min == null || max == null ) {
        res.status(400).json({ error: 'Both min and max values are required in the query parameters.' });
        return;
      }

      const minFloors = parseInt(min as string, 10);
      const maxFloors = parseInt(max as string, 10);

      if (isNaN(minFloors) || isNaN(maxFloors)) {
        res.status(400).json({ error: 'min and max should be valid numbers.' });
        return;
      }
      const buildingOrError = await this.buildingServiceInstance.listBuildingsWithFloorsInRange(minFloors, maxFloors) as Result<IBuildingDTO[]>;
      if (buildingOrError.isFailure) {
        res.status(400).send(buildingOrError.errorValue()); // BAD REQUEST
      } else {
        const buildingDTOs = buildingOrError.getValue();
        res.status(200).json(buildingDTOs);
      }

    } catch (e) {
      next(e);
    }
  
  };

  public async listBuildingFloors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { const userRole = (<any>req).token['http://localhost:4200/startMenuuserRole'];
     if(!this.checkPermissions((<any>req).token) &&userRole!= "TaskManager" && userRole != "FleetManager"){
     
        res.status(401).send("Your role doesn't have permissions");
        return;
     }
      
      const code = req.query.code;
      if ( code == null ) {
        res.status(400).json({ error: 'Building code is required in the query parameters.' });
        return;
      }
      const codeStr = code.toString();

      const FloorsOrError = await this.buildingServiceInstance.listBuildingFloors( codeStr ) as Result<IFloorDTO[]>;
      if (FloorsOrError.isFailure) {
        res.status(400).send(FloorsOrError.errorValue());
      } else {
        const FloorDTO = FloorsOrError.getValue();
        res.status(201).json(FloorDTO);
      }
    } catch (e) {
      next(e);
    }
  };

  public checkPermissions(token:any){
    try{
      
       const userRole = token['http://localhost:4200/startMenuuserRole'];
      if(userRole == "Admin" || userRole == "CampusManager"){//admin or campus manager
        return true;
      }
      return false;
    }catch(e){
      return false;
    }
  }
}
