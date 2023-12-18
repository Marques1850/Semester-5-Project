import { Service, Inject } from 'typedi';
import config from "../../config";
import  IFloorDTO from '../dto/IFloorDTO';
import { Floor } from "../domain/floor";
import IFloorRepo from '../services/IRepos/IFloorRepo';
import IBuildingRepo from './IRepos/IBuildingRepo';
import IFloorService from './IServices/IFloorService';
import { Result } from "../core/logic/Result";
import { FloorMap } from "../mappers/FloorMap";
import { List } from 'immutable';
import buildingRepo from '../repos/BuildingRepo';
import { Map } from '../domain/map';
import fs from 'fs';
import path from 'path';
import { map } from 'lodash';


@Service()
export default class FloorService implements IFloorService {
  constructor(
      @Inject(config.repos.floor.name) private FloorRepo : IFloorRepo,
      @Inject(config.repos.building.name) private BuildingRepo : IBuildingRepo,
      //@Inject('logger') private logger,
  ) {}


  public async createFloor(floorDTO: IFloorDTO): Promise<Result<IFloorDTO>> {
    try {
      const bool = await this.checkIfBuildingExists(floorDTO.buildingCode);
      if (!bool) {
        return Result.fail<IFloorDTO>("That building does not exist");
      }
      const checkName = await this.FloorRepo.findFloor(floorDTO.name);
      if (checkName != null) {
        return Result.fail<IFloorDTO>("That floor name already exists");
      }

      const buil = await this.BuildingRepo.findByBuildingCode(floorDTO.buildingCode);
      //Check floor level
      const buildingFloorList = await this.FloorRepo.findByBuildingCode(floorDTO.buildingCode);
      //Check if building has any floors
      if (buildingFloorList === null || buildingFloorList.length == 0 && Number(floorDTO.level) > 0) {
        return Result.fail<IFloorDTO>("Building has no floors");
      }else {
        //Check if floor level is the highest
        if (Number(floorDTO.level) > 0 ) {
          let highestFloor = 0;
          buildingFloorList.forEach(element => {
            if (element.level > highestFloor) {
              highestFloor = element.level;
            }
          });
          if (Number(floorDTO.level) != highestFloor + 1) {
            return Result.fail<IFloorDTO>("Floor level is not the highest");
          }
        //Check if floor level is the lowest
        } else if(Number(floorDTO.level) < 0) {
          let lowestFloor = 0;
          buildingFloorList.forEach(element => {
            if (element.level < lowestFloor) {
              lowestFloor = element.level;
            }
          });
          if (Number(floorDTO.level) != lowestFloor - 1) {
            return Result.fail<IFloorDTO>("Floor level is not the lowest");
          }
        }

      }

      if(buil.width < Number(floorDTO.width) || Number(floorDTO.length) > buil.length){
        return Result.fail<IFloorDTO>("Floor dimensions are bigger than building dimensions");
      }

      const floorOrError = await Floor.create({
        name: floorDTO.name,
        description: floorDTO.description,
        buildingCode: floorDTO.buildingCode,
        level: Number(floorDTO.level),
        width: Number(floorDTO.width),
        length: Number(floorDTO.length),
        plant: null,
        rooms: []
      });
     
      
      
      if (floorOrError.isFailure) {
        return Result.fail<IFloorDTO>(floorOrError.errorValue());
      }
      
      const floorResult: Floor = floorOrError.getValue();

      
      await this.FloorRepo.save(floorResult);
      
      const floorDTOResult = FloorMap.toDTO(floorResult) as IFloorDTO;

      return Result.ok<IFloorDTO>(floorDTOResult);
    } catch (e) {
      throw e;
    }
  }

  public async uniao(floor1: string, floor2: string): Promise<Result<string>> {
    const http = require('http');

    return new Promise<Result<string>>((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/uniao?param1=${floor1}&param2=${floor2}`,
            method: 'GET'
        };

        const req = http.request(options, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(Result.ok<string>(data.slice(1, -1)));
            });
        });

        req.on('error', error => {
            reject(Result.fail<string>(error.message));
        });

        req.end();
    });
  }

  public async updateFloor(floorDTO: IFloorDTO): Promise<Result<IFloorDTO>> {
    try {
      const floor = await this.FloorRepo.findFloor(floorDTO.name);
      if (floor === null) {
        return Result.fail<IFloorDTO>("Floor not found");
      }
      if (floorDTO.buildingCode != floor.buildingCode) {
        return Result.fail<IFloorDTO>("Cannot change building code");
      }
      if ( floorDTO.level != undefined || floorDTO.level != null ) {
        if (Number(floorDTO.level) != floor.level) {
          return Result.fail<IFloorDTO>("Cannot change floor level");
        }
      }
      let descriptionToUpdt;
      if (floorDTO.description === undefined || floorDTO.description === null) {
        descriptionToUpdt = floor.description;
      } else {
        descriptionToUpdt = floorDTO.description;
      }
      let widthToUpdt;
      let lengthToUpdt;
      const buildingOfFloor = await this.BuildingRepo.findByBuildingCode(floorDTO.buildingCode);
      if (floorDTO.width === undefined || floorDTO.width === null) {
        widthToUpdt = floor.width;
      } else {
        widthToUpdt = floorDTO.width;
      }
      if (buildingOfFloor.width < widthToUpdt) {
        return Result.fail<IFloorDTO>("Width of floor cannot be bigger than width of building");
      }
      if (floorDTO.length === undefined || floorDTO.length === null) {
        lengthToUpdt = floor.length;
      } else {
        lengthToUpdt = floorDTO.length;
      }
      if (buildingOfFloor.length < lengthToUpdt) {
        return Result.fail<IFloorDTO>("Length of floor cannot be bigger than length of building");
      }
      
      const floorOrError = await Floor.create({
        name: floor.name,
        description: descriptionToUpdt,
        buildingCode: floor.buildingCode,
        level: floor.level,
        width: widthToUpdt,
        length: lengthToUpdt,
        plant: floor.plant,
        rooms: floor.rooms
      });
      
      if (floorOrError.isFailure) {
        return Result.fail<IFloorDTO>(floorOrError.errorValue());
      }
      const floorResult: Floor = floorOrError.getValue();
      await this.FloorRepo.updateFloor(floorResult);

      return Result.ok<IFloorDTO>(FloorMap.toDTO(floorResult));
    } catch (e) {
      throw e;
    }
  }

  public async listBuildingFloors(buildingCode: string) : Promise<Result<IFloorDTO[]>>{
    try{
      if (( await this.checkIfBuildingExists(buildingCode)) == false) {
        return Result.fail<IFloorDTO[]>("That building does not exist");
      }
      const listFloors : Floor[] = await this.FloorRepo.findByBuildingCode(buildingCode);

      if( listFloors === null || listFloors === undefined){
        return Result.fail<IFloorDTO[]>("Building not found");
      }
      const listFloorsDTO : IFloorDTO[] = [];
      listFloors.forEach(element => {
        listFloorsDTO.push(FloorMap.toDTO(element));
      });
      
      return Result.ok<IFloorDTO[]>(listFloorsDTO);
    }catch(e){
      throw e;
    }
  }
  

  public async uploadFloorMap(floorname: string, fileData: string): Promise<Result<IFloorDTO>> {
    try {
      const floor = await this.FloorRepo.findFloor(floorname);
          
      if(floor === null || floor === undefined){
        return Result.fail<IFloorDTO>("Floor not found");
      }
      const building = await this.BuildingRepo.findByBuildingCode(floor.buildingCode);
  
      if(building === null || building === undefined){
        return Result.fail<IFloorDTO>("Building not found");
      }
  
      const data = JSON.parse(fileData);

      // Create the MapProps object
      const mapProps = {
        maze: data.maze,
        ground: data.ground,
        wall: data.wall,
        player: data.player
      };

    
      mapProps.ground.maps.color.url=mapProps.ground.maps.color.url.replace("./textures", "./../../assets/textures");
      mapProps.ground.maps.ao.url=mapProps.ground.maps.ao.url.replace("./textures", "./../../assets/textures");
      mapProps.ground.maps.normal.url=mapProps.ground.maps.normal.url.replace("./textures", "./../../assets/textures");
      mapProps.ground.maps.roughness.url=mapProps.ground.maps.roughness.url.replace("./textures", "./../../assets/textures");

      mapProps.wall.maps.color.url=mapProps.wall.maps.color.url.replace("./textures", "./../../assets/textures");
      mapProps.wall.maps.ao.url=mapProps.wall.maps.ao.url.replace("./textures", "./../../assets/textures");
      mapProps.wall.maps.normal.url=mapProps.wall.maps.normal.url.replace("./textures", "./../../assets/textures");
      mapProps.wall.maps.roughness.url=mapProps.wall.maps.roughness.url.replace("./textures", "./../../assets/textures");
      if(floor.width < mapProps.maze.size.with || floor.length < mapProps.maze.size.length){
        return Result.fail<IFloorDTO>("Map dimensions are bigger than floor dimensions");
      }
     

      const mapOrError = Map.create(mapProps);
      const floorResult = await this.FloorRepo.uploadMapFloorinBuilding(floorname, mapOrError.getValue());
   
      return Result.ok<IFloorDTO>(FloorMap.toDTO(floorResult));
    } catch (e) {
      throw e;
    }
  }
  
  
  private async checkIfBuildingExists( buildingCode: string): Promise<boolean> {
    const building = await this.BuildingRepo.findByBuildingCode(buildingCode);
    const found = !!building;
    return found;
  }

  public async getPlant(buildingCode: string, floorName: string): Promise<Result<IFloorDTO>> {
    try {
      const floor = await this.FloorRepo.findFloor(floorName);
          
      if(floor === null || floor === undefined){
        return Result.fail<IFloorDTO>("Floor not found");
      }

      const building = await this.BuildingRepo.findByBuildingCode(buildingCode);
  
      if(building === null || building === undefined){
        return Result.fail<IFloorDTO>("Building not found");
      }

      const jsonString = JSON.stringify(floor.props.plant, null, 2);

      const dirPath = path.join(__dirname, '..', '..', '..', 'my-app', 'src', 'assets', 'mazes');

      let jname =floor.name+".json";

      fs.writeFile(path.join(dirPath,jname), jsonString, (err) => {
        if (err) {
            console.log('Error writing file', err);
        } else {
            console.log('Successfully wrote file');
        }
      }
      );

      return Result.ok<IFloorDTO>(FloorMap.toDTO(floor));
    } catch (e) {
      throw e;
    }
  }

  public async getAllFloors(): Promise<Result<IFloorDTO[]>> {
    try {
      const floors = await this.FloorRepo.getAllFloors();
      if (floors === null || floors === undefined) {
        return Result.fail<IFloorDTO[]>("No floors found");
      }
      const floorsDTO: IFloorDTO[] = [];
      floors.forEach(element => {
        floorsDTO.push(FloorMap.toDTO(element));
      });
      return Result.ok<IFloorDTO[]>(floorsDTO);
    } catch (e) {
      throw e;
    }
  }

  public async editPlayerPosition(buildingCode: string, floorName: string,x:number,y:number,orientation:number): Promise<Result<IFloorDTO>> {
    try {
      const floor = await this.FloorRepo.findFloor(floorName);
          
      if(floor === null || floor === undefined){
        return Result.fail<IFloorDTO>("Floor not found");
      }

      const building = await this.BuildingRepo.findByBuildingCode(buildingCode);
  
      if(building === null || building === undefined){
        return Result.fail<IFloorDTO>("Building not found");
      }
      floor.props.plant.player.initialPosition[0] = x;
      floor.props.plant.player.initialPosition[1] = y;
      floor.props.plant.player.initialDirection = orientation;

      const jsonString = JSON.stringify(floor.props.plant, null, 2);

      const dirPath = path.join(__dirname, '..', '..', '..', 'my-app', 'src', 'assets', 'mazes');

      let jname =floor.name+".json";

      fs.writeFile(path.join(dirPath,jname), jsonString, (err) => {
        if (err) {
            console.log('Error writing file', err);
        } else {
            console.log('Successfully wrote file');
        }
      }
      );
      return Result.ok<IFloorDTO>(FloorMap.toDTO(floor));
    } catch (e) {
      throw e;
    }
  }

}
