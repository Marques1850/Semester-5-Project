import { Service, Inject } from 'typedi';

import IRobotTypeRepo from "../services/IRepos/IRobotTypeRepo";
import { RobotType } from "../domain/robotType";
import { RobotTypeId } from "../domain/robotTypeId";
import { RobotTypeMap } from "../mappers/RobotTypeMap";
import { Document, FilterQuery, Model } from 'mongoose';
import { IRobotTypePersistence } from '../dataschema/IRobotTypePersistence';

@Service()
export default class robotTypeRepo implements IRobotTypeRepo {
  private models: any;

  constructor(
    @Inject('robotTypeSchema') private robotTypeSchema : Model<IRobotTypePersistence & Document>,
    @Inject('logger') private logger
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(robotTypeId: RobotTypeId | string): Promise<boolean> {
    
    const idX = RobotTypeId instanceof RobotTypeId ? (<RobotTypeId>robotTypeId).id.toValue : robotTypeId;

    const query = { domainId: idX}; 
    const robotTypeDocument = await this.robotTypeSchema.findOne( query );

    return !!robotTypeDocument === true;
  }

  public async save (robotType: RobotType): Promise<RobotType> {
    const query = { domainId: robotType.id.toString()}; 
    
    const robotTypeDocument = await this.robotTypeSchema.findOne( query );
    try {
      if (robotTypeDocument === null ) {
        const rawrobotType: any = RobotTypeMap.toPersistence(robotType);

        const robotTypeCreated = await this.robotTypeSchema.create(rawrobotType);

        return RobotTypeMap.toDomain(robotTypeCreated);
      } else {
        robotTypeDocument.code = robotType.code;
        await robotTypeDocument.save();

        return robotType;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByCode (code: string): Promise<RobotType> {
    const query = { code }; 
    const robotTypeRecord = await this.robotTypeSchema.findOne( query );

    if (robotTypeRecord != null) {
      return RobotTypeMap.toDomain(robotTypeRecord);
    }
    return null;
  }

  public async findByTaskCode (tasksCodefind: string): Promise<RobotType[]> {
    const query = { tasksCode:{ $in: [tasksCodefind]} };
    const robotTypeRecords = await this.robotTypeSchema.find( query );
    if (robotTypeRecords != null) {
      const robotTypes = await Promise.all(
        robotTypeRecords.map(async (robotType) => await RobotTypeMap.toDomain(robotType))
      )
      return robotTypes;
    }
    return null;
  }

  public async findAll(): Promise<RobotType[]> {
    const robotTypeRecords = await this.robotTypeSchema.find({});
    if (robotTypeRecords != null) {
      const robotTypes = await Promise.all(
        robotTypeRecords.map(async (robotType) => await RobotTypeMap.toDomain(robotType))
      )
      return robotTypes;
    }
    return null;
  }
  
}
    