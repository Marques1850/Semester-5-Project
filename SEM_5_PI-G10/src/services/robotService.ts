import { Service, Inject } from 'typedi';
import config from "../../config";
import  IRobotDTO from '../dto/IRobotDTO';
import { Robot } from "../domain/robot";
import IRobotRepo from '../services/IRepos/IRobotRepo';
import IRobotTypeRepo from '../services/IRepos/IRobotTypeRepo';
import IRobotService from './IServices/IRobotService';
import { Result } from "../core/logic/Result";
import { RobotMap } from "../mappers/RobotMap";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { RobotStatus } from '../domain/robotStatus';
import IRobotTypeDTO from '../dto/IRobotTypeDTO';




@Service()
export default class robotService implements IRobotService {
  constructor(
      @Inject(config.repos.robot.name) private RobotRepo : IRobotRepo,
      @Inject(config.repos.robotType.name) private RobotTypeRepo : IRobotTypeRepo,
     // @Inject('logger') private logger,
  ) {}


  public async createRobot(robotDTO: IRobotDTO): Promise<Result<IRobotDTO>> {
    try {

      const robotDocument = await this.RobotRepo.findByCode( robotDTO.code );
      const foundRobot = !!robotDocument;
      if (foundRobot) {
        return Result.fail<IRobotDTO>("Robot already exists with code=" + robotDTO.code);
      }
      const robotTypeDocument = await this.RobotTypeRepo.findByCode( robotDTO.robotTypeCode );
      const foundType = !!robotTypeDocument;
      if (!foundType) {
        return Result.fail<IRobotDTO>("Robot type does not exist with code=" + robotDTO.robotTypeCode);
      }

      //Check if serial number is unique for each type of robot
      const robotSerialNumberDocument = await this.RobotRepo.findBySerialNumber( robotDTO.serialNumber );
      const foundSerialNumber = !!robotSerialNumberDocument;
      if (foundSerialNumber) {
        return Result.fail<IRobotDTO>("Robot serial number already exists");
      }


      const robotOrError = await Robot.create({ 
              code: robotDTO.code, 
              nickname: robotDTO.nickname,
              robotTypeCode: robotDTO.robotTypeCode,
              serialNumber: robotDTO.serialNumber,
              description: robotDTO.description,
              status: robotDTO.status as RobotStatus
            });

      
      if (robotOrError.isFailure) {
        return Result.fail<IRobotDTO>(robotOrError.errorValue());
      }

      const robotResult = robotOrError.getValue();

      await this.RobotRepo.save(robotResult);
      const buildingDTOResult = RobotMap.toDTO(robotResult) as IRobotDTO;
      return Result.ok<IRobotDTO>( buildingDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async getRobots(): Promise<Result<IRobotDTO[]>> {
    try {
      const robotsOrError = await this.RobotRepo.findAll();
      if (robotsOrError.length == 0) {
        return Result.fail<IRobotDTO[]>("No robots found");
      }
      const robotDTOResult = robotsOrError.map((robot) => {
        return RobotMap.toDTO(robot) as IRobotDTO;
      });
      return Result.ok<IRobotDTO[]>(robotDTOResult);
    } catch (e) {
      throw e;
    }
  }

  public async inhibitRobot(robotDTO: IRobotDTO): Promise<Result<IRobotDTO>> {
    try {
      const robotDocument = await this.RobotRepo.findByCode( robotDTO.code );
      const foundRobot = !!robotDocument;
      if (!foundRobot) {
        return Result.fail<IRobotDTO>("Robot does not exist with code=" + robotDTO.code);
      }

      const robotResult = await this.RobotRepo.inhibitRobot(robotDTO.code);
      const buildingDTOResult = RobotMap.toDTO(robotResult) as IRobotDTO;
      return Result.ok<IRobotDTO>( buildingDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async getRobotsByRobotTypes(robotTypeDTOs :IRobotTypeDTO[] ): Promise<Result<IRobotDTO[]>> {
    try {
      let robotsDTO: IRobotDTO[] = [];
      let robots: Robot[] = [];
      for (let robotTypeDTO of robotTypeDTOs) {
        const robotsOrError = await this.RobotRepo.findByTypeCode(robotTypeDTO.code);
        robots.push(...robotsOrError);
      }
      if (robots.length == 0) {
        return Result.fail<IRobotDTO[]>("No robots found");
      }
      const robotDTOResult = robots.map((robot) => {
        return RobotMap.toDTO(robot) as IRobotDTO;
      });
      
      robotsDTO = robotsDTO.concat(robotDTOResult);
      return Result.ok<IRobotDTO[]>(robotsDTO);
    }
    catch (e) {
      throw e;
    }
  }


}
