import { Service, Inject } from 'typedi';
import config from "../../config";
import  IElevatorDTO from '../dto/IElevatorDTO';
import { Elevator } from "../domain/elevator";
import IElevatorRepo from '../services/IRepos/IElevatorRepo';
import IElevatorService from './IServices/IElevatorService';
import { Result } from "../core/logic/Result";
import { ElevatorMap } from "../mappers/ElevatorMap";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { elevatorType } from '../domain/elevatorType';
import { Building } from '../domain/building';
import buildingRepo from '../repos/BuildingRepo';
import IBuildingRepo from './IRepos/IBuildingRepo';

@Service()
export default class ElevatorService implements IElevatorService {
  constructor(
      @Inject(config.repos.elevator.name) private ElevatorRepo : IElevatorRepo,
      @Inject(config.repos.building.name) private BuildingRepo : IBuildingRepo,
      //@Inject('logger') private logger,
  ) {}


  public async createElevator(elevatorDTO: IElevatorDTO): Promise<Result<IElevatorDTO>> {
    try {
     const building= await this.BuildingRepo.findByBuildingCode(elevatorDTO.BuildingCode);
      if (building === null || building === undefined) {
        return Result.fail<IElevatorDTO>("building not found");
      }

         
      const elevator= await this.ElevatorRepo.findByBuildingCode(elevatorDTO.BuildingCode);
      if (elevator != null || elevator != undefined) {
        return Result.fail<IElevatorDTO>("building already has elevator");
      }

      const elevatorOrError = await Elevator.create({ BuildingCode: elevatorDTO.BuildingCode, ElevatorCode: elevatorDTO.ElevatorCode, FloorsAttended:elevatorDTO.FloorsAttended, ElevatorType: elevatorDTO.ElevatorType, NumSerie: elevatorDTO.NumSerie, Description: elevatorDTO.Description});
      if (elevatorOrError.isFailure) {
        return Result.fail<IElevatorDTO>(elevatorOrError.errorValue());
      }
       
      const elevatorResult = elevatorOrError.getValue();
 
      await this.ElevatorRepo.save(elevatorResult);
   

      const elevatorDTOResult = ElevatorMap.toDTO(elevatorResult) as IElevatorDTO;
      return Result.ok<IElevatorDTO>( elevatorDTOResult )
    } catch (e) {
      throw e;
    }
  }
  
  public async updateElevator(elevatorDTO: IElevatorDTO): Promise<Result<IElevatorDTO>> {
    try {
    
      
        const elevator = await this.ElevatorRepo.replaceByBuildingCode(elevatorDTO);
        
       
        if (elevator === null || elevator === undefined) {
          return Result.fail<IElevatorDTO>("elevator not found");
        }
        else {
     
          const elevatorDTOResult = ElevatorMap.toDTO(elevator) as IElevatorDTO;
       
          return Result.ok<IElevatorDTO>(elevatorDTOResult);
        }
    } catch (e) {
      throw e;
    }
  }

  public async  listElevatorsInBuilding(BuildingCode: string): Promise<Result<IElevatorDTO>>{
    
    try {
        const elevator = await this.ElevatorRepo.findByBuildingCode(BuildingCode);
        if (elevator === null) {
          return Result.fail<IElevatorDTO>("elevators not found");
        }
        else {
          const elevatorDTOResult = ElevatorMap.toDTO(elevator) as IElevatorDTO;
          return Result.ok<IElevatorDTO>(elevatorDTOResult);
        }
    } catch (e) {
      throw e;
    }
    

  }
   
  public async listAllElevators(): Promise<Result<IElevatorDTO[]>> {
    try {
      const elevators = await this.ElevatorRepo.findAll();
      if (elevators === null || elevators === undefined || elevators.length === 0) {
        return Result.fail<IElevatorDTO[]>("elevators not found");
      }
      else {
        const elevatorsDTO: IElevatorDTO[] = [];
        for( let elevator of elevators) {
          elevatorsDTO.push(ElevatorMap.toDTO(elevator));
        }
        return Result.ok<IElevatorDTO[]>(elevatorsDTO);
      }
  } catch (e) {
    throw e;
  }




  }

  public async listBuildingWithoutElevators(): Promise<Result<Building[]>> {
    try {
      const buildings = await this.BuildingRepo.findAll();
      if (buildings === null || buildings === undefined || buildings.length === 0) {
        return Result.fail<Building[]>("buildings not found");
      }
      else {
        const buildingsWithoutElevators: Building[] = [];
        for( let building of buildings) {
          
          const elevator = await this.ElevatorRepo.findByBuildingCode(building.props.code.toString());
          if (elevator === null || elevator === undefined) {
            buildingsWithoutElevators.push(building);
          }
        }
        return Result.ok<Building[]>(buildingsWithoutElevators);
      }
  } catch (e) {
    throw e;
  }
  }

 

}
