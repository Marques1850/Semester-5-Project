import { Service, Inject } from 'typedi';

import IRobotRepo from "../services/IRepos/IRobotRepo";
import { Robot } from "../domain/robot";
import { RobotId } from "../domain/robotId";
import { RobotMap } from "../mappers/RobotMap";
import { Document, FilterQuery, Model } from 'mongoose';
import { IRobotPersistence } from '../dataschema/IRobotPersistence';
import { RobotStatus } from '../domain/robotStatus';

@Service()
export default class robotRepo implements IRobotRepo {
  private models: any;

  constructor(
    @Inject('robotSchema') private robotSchema : Model<IRobotPersistence & Document>,
    @Inject('logger') private logger
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(robotId: RobotId | string): Promise<boolean> {
    
    const idX = RobotId instanceof RobotId ? (<RobotId>robotId).id.toValue : robotId;

    const query = { domainId: idX}; 
    const robotDocument = await this.robotSchema.findOne( query );

    return !!robotDocument === true;
  }

  public async save (robot: Robot): Promise<Robot> {
    const query = { domainId: robot.id.toString()}; 
    
    const robotDocument = await this.robotSchema.findOne( query );

    try {
      if (robotDocument === null ) {
        const rawrobot: any = RobotMap.toPersistence(robot);
        const robotCreated = await this.robotSchema.create(rawrobot);

        return RobotMap.toDomain(robotCreated);
      } else {
        robotDocument.code = robot.code;
        await robotDocument.save();

        return robot;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByCode (code: string): Promise<Robot> {
    const query = { code: code }; 
    const robotRecord = await this.robotSchema.findOne( query );

    if (robotRecord != null) {
      return RobotMap.toDomain(robotRecord);
    }
    return null;
  }

  public async findBySerialNumber (serialNumber: string): Promise<Robot> {
    const query = { serialNumber: serialNumber }; 
    const robotRecord = await this.robotSchema.findOne( query );

    if (robotRecord != null) {
      return RobotMap.toDomain(robotRecord);
    }
    return null;

  }

  public async inhibitRobot (robotTypeCode: string): Promise<Robot> {
    const query = { code: robotTypeCode };
    const robotDocument = await this.robotSchema.findOneAndUpdate(query, { status: RobotStatus.Inhibited }, { new: true });

    if (robotDocument != null) {
      return RobotMap.toDomain(robotDocument);
    }
    return null;
  }

  public async findAll(): Promise<Robot[]> {
    const robotRecords = await this.robotSchema.find();

    const robots: Robot[] = await Promise.all(robotRecords.map(async (robotRecord) =>
      RobotMap.toDomain(robotRecord)
    ));

    return robots;
  }

  public async findByTypeCode(robotTypecode: string): Promise<Robot[]> {
    const query = { robotTypeCode: robotTypecode };
    const robotRecords = await this.robotSchema.find( query );
    const robots: Robot[] = await Promise.all(robotRecords.map(async (robotRecord) =>
      RobotMap.toDomain(robotRecord)
    ));
    return robots;
  }
}
    