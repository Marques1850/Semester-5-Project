import { Service, Inject } from 'typedi';
import config from "../../config";
import  IRobotTypeDTO from '../dto/IRobotTypeDTO';
import { RobotType } from "../domain/robotType";
import IRobotTypeRepo from '../services/IRepos/IRobotTypeRepo';
import IRobotTypeService from './IServices/IRobotTypeService';
import { Result } from "../core/logic/Result";
import { RobotTypeMap } from "../mappers/RobotTypeMap";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { RobotTypeCode } from '../domain/robotTypecode';

@Service()
export default class robotTypeService implements IRobotTypeService {
  constructor(
      @Inject(config.repos.robotType.name) private RobotTypeRepo : IRobotTypeRepo,
     // @Inject('logger') private logger,
  ) {}


  public async createRobotType(robotTypeDTO: IRobotTypeDTO): Promise<Result<IRobotTypeDTO>> {
    try {
      const robotTypeDocument = await this.RobotTypeRepo.findByCode( robotTypeDTO.code );
      const found = !!robotTypeDocument;
      
      if (found) {
        return Result.fail<IRobotTypeDTO>("RobotType already exists with code=" + robotTypeDTO.code);
      }
      
      const robotTypeOrError = await RobotType.create({ code:RobotTypeCode.create({code:robotTypeDTO.code}).getValue() , description: robotTypeDTO.description, tasksCode: robotTypeDTO.tasksCode });

      if (robotTypeOrError.isFailure) {
        return Result.fail<IRobotTypeDTO>(robotTypeOrError.errorValue());
      }
      
      const robotTypeResult = robotTypeOrError.getValue();
      
      await this.RobotTypeRepo.save(robotTypeResult);
      
      const buildingDTOResult = RobotTypeMap.toDTO(robotTypeResult) as IRobotTypeDTO;
      return Result.ok<IRobotTypeDTO>( buildingDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async getRobotTypesByTask(code: string): Promise<Result<IRobotTypeDTO[]>> {
    try {
      const robotTypes = await this.RobotTypeRepo.findByTaskCode(code);
      if (robotTypes.length == 0) {
        return Result.fail<IRobotTypeDTO[]>("No robotTypes found for taskCode=" + code);
      }
      const robotTypesDTO: IRobotTypeDTO[] = [];
      for(let robotType of robotTypes) {
        robotTypesDTO.push(RobotTypeMap.toDTO(robotType));
      }
      return Result.ok<IRobotTypeDTO[]>(robotTypesDTO);
    } catch (e) {
      throw e;
    }
  }

  public async getRobotTypes(): Promise<Result<IRobotTypeDTO[]>> {
    try {
      const robotTypes = await this.RobotTypeRepo.findAll();
      if (robotTypes.length == 0) {
        return Result.fail<IRobotTypeDTO[]>("No robotTypes found");
      }
      const robotTypesDTO: IRobotTypeDTO[] = [];
      for(let robotType of robotTypes) {
        robotTypesDTO.push(RobotTypeMap.toDTO(robotType));
      }
      return Result.ok<IRobotTypeDTO[]>(robotTypesDTO);
    } catch (e) {
      throw e;
    }
  }


}
