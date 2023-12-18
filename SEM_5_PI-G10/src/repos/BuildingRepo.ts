import { Service, Inject } from 'typedi';

import IBuildingRepo from "../services/IRepos/IBuildingRepo";
import { Building } from "../domain/building";
import { BuildingId } from "../domain/buildingId";
import { BuildingMap } from "../mappers/BuildingMap";
import { Document, FilterQuery, Model } from 'mongoose';
import { IBuildingPersistence } from '../dataschema/IBuildingPersistence';
import { BuildingCode } from '../domain/buildingcode';

@Service()
export default class buildingRepo implements IBuildingRepo {
  private models: any;

  constructor(
    @Inject('buildingSchema') private buildingSchema : Model<IBuildingPersistence & Document>,
    //@Inject('logger') private logger
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(buildingId: BuildingId | string): Promise<boolean> {
    
    const idX = BuildingId instanceof BuildingId ? (<BuildingId>buildingId).id.toValue : buildingId;

    const query = { domainId: idX}; 
    const buildingDocument = await this.buildingSchema.findOne( query );

    return !!buildingDocument === true;
  }

  public async save (building: Building): Promise<Building> {
    const query = { domainId: building.id.toString()}; 

    const buildingDocument = await this.buildingSchema.findOne( query );

    try {
      if (buildingDocument === null ) {
        const rawbuilding: any = BuildingMap.toPersistence(building);

        const buildingCreated = await this.buildingSchema.create(rawbuilding);

        return BuildingMap.toDomain(buildingCreated);
      } else {
        buildingDocument.name = building.name;
        await buildingDocument.save();

        return building;
      }
    } catch (err) {
      throw err;
    }
  }

  public async changeBuilding (code1: string, name1: string, description1: string, width1: number, length1: number): Promise<Building> {
    const code = BuildingCode.create({code: code1}).getValue();
    const query = { code: code.code };
    const buildingRecord = await this.buildingSchema.findOneAndUpdate(query, {name: name1, description: description1, width: width1, length: length1}, {new: true});
    if (buildingRecord === null ) {
      return null;
    }
    return BuildingMap.toDomain(buildingRecord);
  }

  public async findAll(): Promise<Building[]> {
    const buildingRecords = await this.buildingSchema.find();

    const buildings: Building[] = await Promise.all(buildingRecords.map(async (buildingRecord) =>
      BuildingMap.toDomain(buildingRecord)
    ));

    return buildings;
  }

  public async findByBuildingCode(buildingCode: string): Promise<Building | null> {
    let buildingRecord = null;
    try{
      const query = { code: BuildingCode.create({code: buildingCode}).getValue().code}; 
      buildingRecord = await this.buildingSchema.findOne( query );
    } catch (e) {
      return null;
    }
    if (buildingRecord != null) {
      return BuildingMap.toDomain(buildingRecord);
    }
    return null;
  }
  
}
    