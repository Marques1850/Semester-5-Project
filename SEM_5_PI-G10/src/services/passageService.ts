import { Service, Inject } from 'typedi';
import config from "../../config";
import  IPassageDTO from '../dto/IPassageDTO';
import { Passage } from "../domain/passage";
import IPassageRepo from '../services/IRepos/IPassageRepo';
import IPassageService from './IServices/IPassageService';
import { Result } from "../core/logic/Result";
import { PassageMap } from "../mappers/PassageMap";
import IBuildingRepo from '../services/IRepos/IBuildingRepo';
import IFloorDTO from '../dto/IFloorDTO';
import IFloorRepo from '../services/IRepos/IFloorRepo';
import { Floor } from '../domain/floor';
import { FloorMap } from '../mappers/FloorMap';
import { PassageCode } from '../domain/passagecode';

@Service()
export default class passageService implements IPassageService {
  constructor(
      @Inject(config.repos.passage.name) private PassageRepo : IPassageRepo,
      @Inject(config.repos.building.name) private BuildingRepo : IBuildingRepo,
      @Inject(config.repos.floor.name) private FloorRepo : IFloorRepo,
      //@Inject('logger') private logger,
  ) {}


  public async createPassage(passageDTO: IPassageDTO): Promise<Result<IPassageDTO>> {
    try {

      if(await this.BuildingRepo.findByBuildingCode(passageDTO.codeBuilding1) === null){
        return Result.fail<IPassageDTO>("Building 1 does not exist");
      }

      if(await this.BuildingRepo.findByBuildingCode(passageDTO.codeBuilding2) === null){
        return Result.fail<IPassageDTO>("Building 2 does not exist");
      }
    
      const floor1 = await this.FloorRepo.findFloor(passageDTO.FloorBuilding1Name);
      const floor2 = await this.FloorRepo.findFloor(passageDTO.FloorBuilding2Name);
  

      if(floor1 === null){
        return Result.fail<IPassageDTO>("Floor 1 does not exist");
      }

      if(floor2 === null){
        return Result.fail<IPassageDTO>("Floor 2 does not exist");
      }

      if(floor1.buildingCode !== passageDTO.codeBuilding1){
        return Result.fail<IPassageDTO>("Floor 1 does not belong to building 1");
      }

      if(floor2.buildingCode !== passageDTO.codeBuilding2){
        return Result.fail<IPassageDTO>("Floor 2 does not belong to building 2");
      }

      
      
      const passageDocument = await this.PassageRepo.findByPassageCode( passageDTO.codigo );
      const found = !!passageDocument;
      
      if (found) {
        return Result.fail<IPassageDTO>("Passage already exists");
      }

      const passageOrError = await Passage.create({ codigo:PassageCode.create( {code:passageDTO.codigo}).getValue(), codeBuilding1: passageDTO.codeBuilding1, codeBuilding2: passageDTO.codeBuilding2, FloorBuilding1Name: passageDTO.FloorBuilding1Name, FloorBuilding2Name: passageDTO.FloorBuilding2Name });
  
      if (passageOrError.isFailure) {
        return Result.fail<IPassageDTO>(passageOrError.errorValue());
      }

      const passageResult = passageOrError.getValue();
  
      await this.PassageRepo.save(passageResult);
     

      const passageDTOResult = PassageMap.toDTO(passageResult) as IPassageDTO;
      return Result.ok<IPassageDTO>( passageDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async listAllFloorsWithPassage(): Promise<Result<IFloorDTO[]>> {
    
    try {
      const passages = await this.PassageRepo.findAll();
      if (passages.length == 0) {
        return Result.fail<IFloorDTO[]>("No floors with passages found");
      }
      const floors: IFloorDTO[] = [];
      for (const passage of passages) {
        const floor1 = await this.FloorRepo.getFloorByName(passage.FloorBuilding1Name);
        if (floor1) {
          floors.push(FloorMap.toDTO(floor1));
        }
        const floor2 = await this.FloorRepo.getFloorByName(passage.FloorBuilding2Name);
        if (floor2) {
          floors.push(FloorMap.toDTO(floor2));
        }
      }

      return Result.ok<IFloorDTO[]>(floors);
    
    } catch (e) {
      throw e;
    }
  }

  public async getPassagesBuilding(codeb1: string, codeb2: string): Promise<Result<IPassageDTO[]>> {
    try {
      // check if building codes exists
      const building1 = await this.BuildingRepo.findByBuildingCode(codeb1);
      const building2 = await this.BuildingRepo.findByBuildingCode(codeb2);
      if (building2 === null || building1 === null) {
        return Result.fail<IPassageDTO[]>("Invalid building code");
      }
      const passages = await this.PassageRepo.findByBuildingCodes(codeb1, codeb2);
      if (passages.length == 0) {
        return Result.fail<IPassageDTO[]>("No passages in building found");
      }else
      {
        let passagesDTO:IPassageDTO[] = [];
        for (let passage of passages) {
          passagesDTO.push(PassageMap.toDTO(passage));
        }
        return Result.ok<IPassageDTO[]>(passagesDTO);
    
      }
    } catch (e) {
      throw e;
    }
  }

  public async updatePassage(passageDTO: IPassageDTO): Promise<Result<IPassageDTO>> {
    try {
      const building1 = await this.BuildingRepo.findByBuildingCode(passageDTO.codeBuilding1);
      const building2 = await this.BuildingRepo.findByBuildingCode(passageDTO.codeBuilding2);
      const floor1 = await this.FloorRepo.findFloor(passageDTO.FloorBuilding1Name);
      const floor2 = await this.FloorRepo.findFloor(passageDTO.FloorBuilding2Name);
      if (building1 === null) {
        return Result.fail<IPassageDTO>("Building 1 not found");
      }
      if (building2 === null) {
        return Result.fail<IPassageDTO>("Building 2 not found");
      }
      if (floor1 === null) {
        return Result.fail<IPassageDTO>("Floor 1 not found");
      }
      if (floor2 === null) {
        return Result.fail<IPassageDTO>("Floor 2 not found");
      }
      if(floor1.buildingCode === floor2.buildingCode){
        return Result.fail<IPassageDTO>("Floors belong to the same building");
      }
      if(building1.props.code === building2.props.code){
        return Result.fail<IPassageDTO>("Buildings are the same");
      }
      if(floor1.buildingCode !== passageDTO.codeBuilding1){
        return Result.fail<IPassageDTO>("Floor 1 does not belong to building 1");
      }
      if(floor2.buildingCode !== passageDTO.codeBuilding2){
        return Result.fail<IPassageDTO>("Floor 2 does not belong to building 2");
      }
      const passage = await this.PassageRepo.changePassage(passageDTO.codigo, passageDTO.codeBuilding1, passageDTO.codeBuilding2, passageDTO.FloorBuilding1Name, passageDTO.FloorBuilding2Name);
      if (passage === null) {
        return Result.fail<IPassageDTO>("Passage not found");
      }
      else{
        const passageDtoResult = PassageMap.toDTO(passage) as IPassageDTO;
        return Result.ok<IPassageDTO>(passageDtoResult);
      }
    } catch (e) {
      throw e;
    }
  }

  public async getAllPassages(): Promise<Result<IPassageDTO[]>> {
      try {
     
        const passages= await this.PassageRepo.findAll();
   
        if (passages.length == 0) {
          return Result.fail<IPassageDTO[]>("No passages found");
        }
       
         let passagesDTO:IPassageDTO[] = [];
         
        for (let passage of passages) {
          
          passagesDTO.push(PassageMap.toDTO(passage));
          
        }
        console.log(passagesDTO);
        return Result.ok<IPassageDTO[]>(passagesDTO);
      } catch (e) {
        throw e;
      }
  }

}
