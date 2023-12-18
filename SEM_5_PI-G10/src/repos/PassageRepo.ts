import { Service, Inject } from 'typedi';

import IPassageRepo from "../services/IRepos/IPassageRepo";
import { Passage } from "../domain/passage";
import { PassageId } from "../domain/passageId";
import { PassageMap } from "../mappers/PassageMap";
import { Document, FilterQuery, Model } from 'mongoose';
import { IPassagePersistence } from '../dataschema/IPassagePersistence';

@Service()
export default class passageRepo implements IPassageRepo {
  private models: any;

  constructor(
    @Inject('passageSchema') private passageSchema : Model<IPassagePersistence & Document>,
    //@Inject('logger') private logger
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(passageId: PassageId | string): Promise<boolean> {
    
    const idX = PassageId instanceof PassageId ? (<PassageId>passageId).id.toValue : passageId;

    const query = { domainId: idX}; 
    const passageDocument = await this.passageSchema.findOne( query );

    return !!passageDocument === true;
  }

  public async save (passage: Passage): Promise<Passage> {
    const query = { domainId: passage.id.toString()}; 

    const passageDocument = await this.passageSchema.findOne( query );
    try {
      if (passageDocument === null ) {
        const rawpassage: any = PassageMap.toPersistence(passage);
   
        const passageCreated = await this.passageSchema.create(rawpassage);
        return PassageMap.toDomain(passageCreated);
      } else {
        passageDocument.codigo = passage.code;
        await passageDocument.save();

        return passage;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByPassageCode(PassageCode: string): Promise<Passage> {
    const query = { codigo: PassageCode }; 
    const passageDocument = await this.passageSchema.findOne( query );

    if (passageDocument == null) {
      return null;
    }

    return PassageMap.toDomain(passageDocument);
  }

  public async findAll(): Promise<Passage[]> {
    const passageRecords = await this.passageSchema.find();

    const buildings: Passage[] = await Promise.all(passageRecords.map(async (passageRecord) =>
      PassageMap.toDomain(passageRecord)
    ));

    return buildings;
  }
  public async findByBuildingCodes(codeBuilding1: string, codeBuilding2: string): Promise<Passage[]> {
    const query = { codeBuilding1: codeBuilding1, codeBuilding2: codeBuilding2 }; 
    const query2 = { codeBuilding1: codeBuilding2, codeBuilding2: codeBuilding1 };
    const passageRecords = await this.passageSchema.find( query );
    const passageRecords2 = await this.passageSchema.find( query2 );

    const passages1 = passageRecords.map((passageRecord) => PassageMap.toDomain(passageRecord));
    const passages2 = passageRecords2.map((passageRecord) => PassageMap.toDomain(passageRecord));

    return Promise.all(passages1.concat(passages2));
  }

  public async changePassage (cod: string, codeBuilding1: string, codeBuilding2: string, FloorBuilding1Name: string, FloorBuilding2Name: string): Promise<Passage> {
    const query = { codigo: cod.toString()};
    const passageRecord = await this.passageSchema.findOneAndUpdate( query , {codeBuilding1: codeBuilding1, codeBuilding2: codeBuilding2, FloorBuilding1Name: FloorBuilding1Name, FloorBuilding2Name: FloorBuilding2Name.toString()}, {new: true} );
    return PassageMap.toDomain(passageRecord);
  }
  
}
    