import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IFloorController from "./IControllers/IFloorController";
import IFloorService from '../services/IServices/IFloorService';
import IFloorDTO from '../dto/IFloorDTO';

import { Result } from "../core/logic/Result";
import { Elevator } from '../domain/elevator';
import { Container } from 'typedi';
import IElevatorController from './IControllers/IElevatorController';
import IElevatorService from '../services/IServices/IElevatorService';
import IElevatorDTO from '../dto/IElevatorDTO';
import IBuildingService from '../services/IServices/IBuildingService';
import { floor } from 'lodash';


@Service()
export default class FloorController implements IFloorController {
  constructor(
      @Inject(config.services.floor.name) private FloorServiceInstance : IFloorService,
      @Inject(config.services.elevator.name) private ElevatorServiceInstance : IElevatorService,
      @Inject(config.services.building.name) private buildingServiceInstance : IBuildingService
  ) {}

  public async createFloor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }
      const FloorOrError = await this.FloorServiceInstance.createFloor(req.body as IFloorDTO) as Result<IFloorDTO>;

      if (FloorOrError.isFailure) {
        res.status(400).send(FloorOrError.errorValue());
      } else {
        const FloorDTO = FloorOrError.getValue();
        res.status(201).json(FloorDTO);
      }
    } catch (e) {
      next(e);
    }
  };

  public async updateFloor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }
      const FloorOrError = await this.FloorServiceInstance.updateFloor(req.body as IFloorDTO) as Result<IFloorDTO>;

      if (FloorOrError.isFailure) {
        res.status(400).send(FloorOrError.errorValue());
      } else {
        const FloorDTO = FloorOrError.getValue();
        res.status(201).json(FloorDTO);
      }
    } catch (e) {
      next(e);
    }
  };

  public async listFloorsWithElevators(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{ 
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }
      const ElevatorOrError = await this.ElevatorServiceInstance.listElevatorsInBuilding(req.query.buildingCode as string) as Result<IElevatorDTO>; //ElevatorOrError guarda o array de elevadores do edificio
       

      if(ElevatorOrError.isFailure){
        res.status(400).send(ElevatorOrError.errorValue());}
        const floorsElevator= ElevatorOrError.getValue().FloorsAttended;//floorsElevator.floorsAttended guarda o numero dos pisos do elevador

      const BuildingFloors = await this.FloorServiceInstance.listBuildingFloors(req.query.buildingCode as string) as Result<IFloorDTO[]>; //BuildingFloors guarda o array de pisos do edificio
      if(BuildingFloors.isFailure){
        res.status(400).send(BuildingFloors.errorValue());}

      const floorsDto = BuildingFloors.getValue();

      let constFinalFloorsDto = [];
      
      for (let i = 0; i < floorsDto.length; i++) { 
        if(floorsElevator.includes(parseInt(floorsDto[i].level))){
          constFinalFloorsDto.push(floorsDto[i]);
        }
        }
            
        res.status(201).json(constFinalFloorsDto); //devolve o array de pisos do edificio que o elevador vai
      }catch (e) {
      next(e);
      }
  };

  public async uploadFloorMap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }
      let buffer: Buffer = req.file.buffer;
     
      let str: string = buffer.toString('utf-8');
      
      const FloorOrError = await this.FloorServiceInstance.uploadFloorMap(req.body.name as string, str ) as Result<IFloorDTO>;

      if (FloorOrError.isFailure) {
        res.status(400).send(FloorOrError.errorValue());
      } else {
        const FloorDTO = FloorOrError.getValue();
        res.status(201).json(FloorDTO);
      }
    } catch (e) {
      next(e);
    }
  }

  public async getPlant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRole = (<any>req).token['http://localhost:4200/startMenuuserRole'];
      if(!this.checkPermissions((<any>req).token) &&userRole!= "TaskManager" && userRole != "FleetManager"){
        res.status(401).send("Unauthorized");
        return;
     }
      const FloorOrError = await this.FloorServiceInstance.getPlant(req.query.buildingCode as string, req.query.floorName as string) as Result<IFloorDTO>;

      if (FloorOrError.isFailure) {
        res.status(400).send(FloorOrError.errorValue());
      } else {
        const FloorDTO = FloorOrError.getValue();
        res.status(201).json(FloorDTO);
      }
    } catch (e) {
      next(e);
    }
  }

  public async uniao(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const FloorOrError = await this.FloorServiceInstance.uniao(req.query.floor1 as string, req.query.floor2 as string) as Result<String>;

      if (FloorOrError.isFailure) {
        res.status(400).send(FloorOrError.errorValue());
      } else {
        const FloorDTO = FloorOrError.getValue();
        res.status(201).json(FloorDTO);
      }
    } catch (e) {
      next(e);
    }
  }

  public async listAllFloorsElevators(req: Request, res: Response, next: NextFunction): Promise<void> {
    if(!this.checkPermissions((<any>req).token)){
      res.status(401).send("Unauthorized");
      return;
   }
    try{ 
      const FloorsOrError = await this.FloorServiceInstance.getAllFloors() as Result<IFloorDTO[]>;
      if(FloorsOrError.isFailure){
        res.status(400).send(FloorsOrError.errorValue());
      }
        const floors= FloorsOrError.getValue();;


        const ElevatorOrError = await this.ElevatorServiceInstance.listAllElevators() as Result<IElevatorDTO[]>;
        if(ElevatorOrError.isFailure){
          res.status(400).send(ElevatorOrError.errorValue());
        }
          const Elevators= ElevatorOrError.getValue();
          
          let constFinalFloorsDto = [];

          floors.forEach(element => {if(Elevators.some(e=>e.FloorsAttended.includes(Number(element.level) ) && e.BuildingCode==element.buildingCode))constFinalFloorsDto.push(element)});
          
          res.status(201).json(constFinalFloorsDto);    
    }catch (e) {
      next(e);
    }
  }

  public async listAllFloors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{ 
      if(!this.checkPermissions((<any>req).token)){
        res.status(401).send("Unauthorized");
        return;
     }
      const FloorsOrError = await this.FloorServiceInstance.getAllFloors() as Result<IFloorDTO[]>;
      if(FloorsOrError.isFailure){
        res.status(400).send(FloorsOrError.errorValue());
      }
        const floors= FloorsOrError.getValue();;
        res.status(201).json(floors);    
    }catch (e) {
      next(e);
    }
  }
  public async editPlayerPosition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
       
      const FloorOrError = await this.FloorServiceInstance.editPlayerPosition(req.query.buildingCode as string, req.query.floorName as string
        ,Number(req.query.X),Number(req.query.Y),Number(req.query.orientation)) as Result<IFloorDTO>;

      if (FloorOrError.isFailure) {
        res.status(400).send(FloorOrError.errorValue());
      } else {
        const FloorDTO = FloorOrError.getValue();
        res.status(201).json(FloorDTO);
      }
    } catch (e) {
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

