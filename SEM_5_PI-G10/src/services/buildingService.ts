import { Service, Inject } from 'typedi';
import config from "../../config";
import  IBuildingDTO from '../dto/IBuildingDTO';
import IFloorDTO from '../dto/IFloorDTO';
import { Building } from "../domain/building";
import IBuildingRepo from '../services/IRepos/IBuildingRepo';
import IBuildingService from './IServices/IBuildingService';
import { Result } from "../core/logic/Result";
import { BuildingMap } from "../mappers/BuildingMap";
import { FloorMap } from "../mappers/FloorMap";
import { Floor } from "../domain/floor";
import IFloorRepo from './IRepos/IFloorRepo';
import { BuildingCode } from '../domain/buildingcode';

@Service()
export default class buildingService implements IBuildingService {
  constructor(
      @Inject(config.repos.building.name) private BuildingRepo : IBuildingRepo,
      @Inject(config.repos.floor.name) private FloorRepo : IFloorRepo,
      //@Inject('logger') private logger,
  ) {}


  public async createBuilding(buildingDTO: IBuildingDTO): Promise<Result<IBuildingDTO>> {
    try {
      const buildingDocument = await this.BuildingRepo.findByBuildingCode( buildingDTO.code);
      const found = !!buildingDocument;
  
      if (found) {
        return Result.fail<IBuildingDTO>("Building already exists with code=" + buildingDTO.code);
      }

      const buildingOrError = await Building.create({ 
        code: BuildingCode.create({code: buildingDTO.code}).getValue(), 
        name: buildingDTO.name, description: buildingDTO.description, 
        width: buildingDTO.width, 
        length: buildingDTO.length
      });

      if (buildingOrError.isFailure) {
        return Result.fail<IBuildingDTO>(buildingOrError.errorValue());
      }

      const buildingResult = buildingOrError.getValue();

      await this.BuildingRepo.save(buildingResult);

      const buildingDTOResult = BuildingMap.toDTO(buildingResult) as IBuildingDTO;
      return Result.ok<IBuildingDTO>( buildingDTOResult )
    } catch (e) {
      throw e;
    }
  }
  
  public async updateBuilding(buildingDTO: IBuildingDTO): Promise<Result<IBuildingDTO>> {
    try {
        const buildingDocument = await this.BuildingRepo.findByBuildingCode( buildingDTO.code);
        const found = !!buildingDocument;
        if(!found){
          return Result.fail<IBuildingDTO>("Building does not exist");
        }
        const building = await this.BuildingRepo.changeBuilding(buildingDTO.code, buildingDTO.name, buildingDTO.description, buildingDTO.width, buildingDTO.length);
        if (building === null) {
          return Result.fail<IBuildingDTO>("error updating building");
        }
        else {
          const buildingDTOResult = BuildingMap.toDTO(building) as IBuildingDTO;
          return Result.ok<IBuildingDTO>(buildingDTOResult);
        }
    } catch (e) {
      throw e;
    }
  }

  public async listAllBuildings(): Promise<Result<IBuildingDTO[]>> {
    try {
      const buildings = await this.BuildingRepo.findAll();

      if (!buildings || buildings.length === 0) {
        return Result.fail<IBuildingDTO[]>("There are no buildings");
      } else {
        const buildingsDTO: IBuildingDTO[] = [];
        for( let building of buildings) {
          buildingsDTO.push(BuildingMap.toDTO(building));
        }
        return Result.ok<IBuildingDTO[]>(buildingsDTO);
      }
    } catch (error) {
      // Handle errors, such as database connection issues
      throw error;
    }
  }

  public async listBuildingsWithFloorsInRange(minFloors: number, maxFloors: number): Promise<Result<IBuildingDTO[]>> {
    try {
      if (minFloors < 0 || maxFloors < 0 || minFloors > maxFloors) {
        return Result.fail<IBuildingDTO[]>("Bad range of floors.");
      }
      
      const buildings:Building[] = await this.BuildingRepo.findAll();
   
      for (let i = 0; i < buildings.length; i++) {
        const building = buildings.at(i);
        const floorsArray:Floor[] = await this.FloorRepo.findByBuildingCode(building.props.code.toString());
        if (floorsArray === null || floorsArray === undefined) {
          buildings.splice(i, 1);
          i--;
        } else {
          if (floorsArray.length < minFloors || floorsArray.length > maxFloors) {
            buildings.splice(i, 1);
            i--;
          }
        }
      }
      
      if (!buildings || buildings.length === 0) {
        return Result.fail<IBuildingDTO[]>("There are no buildings with the specified number of floors.");
      } else {
        const buildingsDTO: IBuildingDTO[] = [];
        for( let building of buildings) {
          buildingsDTO.push(BuildingMap.toDTO(building));
        }
        return Result.ok<IBuildingDTO[]>(buildingsDTO);
      }
    } catch (error) {
      throw error;
    }
  };

  public async listBuildingFloors(buildingCode: string): Promise<Result<IFloorDTO[]>> {
    try {
      const building = await this.BuildingRepo.findByBuildingCode(buildingCode);
      if (building === null || building === undefined) {
        return Result.fail<IFloorDTO[]>("Building not found");
      }
      const listFloors : Floor[] = await this.FloorRepo.findByBuildingCode(buildingCode);
      if( listFloors === null || listFloors === undefined || listFloors.length === 0){
        return Result.fail<IFloorDTO[]>("Building has no floors");
      }
  
      const floorsDTO: IFloorDTO[] = [];
      for( let floor of listFloors) {
        const floorDTO = FloorMap.toDTO(floor);
        floorsDTO.push(floorDTO);
      }
      
      return Result.ok<IFloorDTO[]>(floorsDTO);
    } catch (error) {
      // Handle errors, such as database connection issues
      throw error;
    }
  };

}
