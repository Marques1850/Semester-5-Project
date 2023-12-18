import { Service, Inject } from 'typedi';

import IElevatorRepo from "../services/IRepos/IElevatorRepo";
import { Elevator } from "../domain/elevator";
import {elevatorID } from "../domain/elevatorID";
import { ElevatorMap } from "../mappers/ElevatorMap";

import { Document, FilterQuery, Model } from 'mongoose';
import {IElevatorPersistence } from '../dataschema/IElevatorPersistence';
import IElevatorDTO from '../dto/IElevatorDTO';
import elevatorSchema from '../persistence/schemas/elevatorSchema';
import { elevatorType } from '../domain/elevatorType';

@Service()
export default class ElevatorRepo implements IElevatorRepo {
  private models: any;

  constructor(
    @Inject('elevatorSchema') private elevatorSchema : Model<IElevatorPersistence & Document>,
    @Inject('logger') private logger
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(elevatorId: elevatorID | string): Promise<boolean> {
    
    const idX = elevatorID instanceof elevatorID ? (<elevatorID>elevatorId).id.toValue : elevatorId;

    const query = { domainId: idX}; 
    const elevatorDocument = await this.elevatorSchema.findOne( query );

    return !!elevatorDocument === true;
  }

  public async save (elevator: Elevator): Promise<Elevator> {
    const query = { domainId: elevator.id.toString()}; 
  
    const elevatorDocument = await this.elevatorSchema.findOne( query );

    try {
      if (elevatorDocument === null ) {
      
       
        const rawelevator: any = ElevatorMap.toPersistence(elevator);
     
        const elevatorCreated = await this.elevatorSchema.create(rawelevator);

      
        return ElevatorMap.toDomain(elevatorCreated);
      } 
    } catch (err) {
      throw err;
    }
  }

  public async  replaceByBuildingCode  (dto:IElevatorDTO): Promise<Elevator> {
    
    const query = { BuildingCode: dto.BuildingCode};
    let type;
       console.log(dto);

    const elevatorRecord = await this.elevatorSchema.findOneAndUpdate( query , {ElevatorCode: dto.ElevatorCode,
      FloorsAttended:dto.FloorsAttended,ElevatorType:dto.ElevatorType,NumSerie:dto.NumSerie
      ,Description:dto.Description}, {new: true} );
      
    return ElevatorMap.toDomain(elevatorRecord);
  }


  public async  findByBuildingCode  (code:string): Promise<Elevator | null> {
    const query = { BuildingCode: code};
    const elevatorRecord = await this.elevatorSchema.findOne( query );
    if(elevatorRecord === null) return null;
    return ElevatorMap.toDomain(elevatorRecord);
  }

  public async findAll(): Promise<Elevator[]> {
    const elevatorRecords = await this.elevatorSchema.find();

    const elevators: Elevator[] = await Promise.all(elevatorRecords.map(async (elevatorRecord) =>
      ElevatorMap.toDomain(elevatorRecord)
    ));

    return elevators;
  }


}