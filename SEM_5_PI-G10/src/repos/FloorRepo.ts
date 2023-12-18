import { Service, Inject } from 'typedi';

import IFloorRepo from "../services/IRepos/IFloorRepo";
import { Floor } from "../domain/floor";
import { FloorMap } from "../mappers/FloorMap";

import { Document, FilterQuery, Model } from 'mongoose';
import {IFloorPersistence } from '../dataschema/IFloorPersistence';
import IFloorDTO from '../dto/IFloorDTO';
import { raw } from 'body-parser';
import { room } from '../domain/room';
import { Map } from '../domain/map';

@Service()
export default class FloorRepo implements IFloorRepo {
  private models: any;

  constructor(
    @Inject('floorSchema') private floorSchema : Model<IFloorPersistence & Document>,
    @Inject('logger') private logger
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(floorName: string): Promise<boolean> {
    
    const idX = floorName;

    const query = { name: idX}; 
    const floorDocument = await this.floorSchema.findOne( query );

    return !!floorDocument === true;
  }

  public async save (floor: Floor): Promise<Floor> {
    const query = { name: floor.name.toString() }; 
   
    const floorDocument = await this.floorSchema.findOne( query );

    try {
      if (floorDocument === null ) {
      
        const rawfloor: any = FloorMap.toPersistence(floor);
        console.log(JSON.stringify(rawfloor.plant));
        const floorCreated = await this.floorSchema.create(rawfloor);
        console.log(JSON.stringify(floorCreated.plant));
        
        return FloorMap.toDomain(floorCreated);
      } else {
        floorDocument.name = floor.name;
        await floorDocument.save();

        return floor;
      }
    } catch (err) {
      throw err;
    }
  }

  public async updateFloor(floor: Floor): Promise<Floor> {
    const query = { name: floor.name.toString() };
    const rawfloor: any = FloorMap.toPersistence(floor);
    const floorUpdated = await this.floorSchema.updateOne(query, rawfloor);
    return FloorMap.toDomain(floorUpdated);
  }

  public async getFloorByName(floorName: string): Promise<Floor> {
    const query = { name: floorName}; 
    const floorRecord = await this.floorSchema.findOne( query );

    if (floorRecord != null ) {
      return FloorMap.toDomain(floorRecord);
    }
    return null;
  }


  public async findAll(): Promise<Floor[]> {
    const floorRecords = await this.floorSchema.find();

    const floors: Floor[] = await Promise.all(floorRecords.map(async (floorRecord) =>
      FloorMap.toDomain(floorRecord)
    ));

    return floors;
  }

  public async findFloor(floorName: string): Promise<Floor | null> {
    const query = { name: floorName}; 
    const floorRecord = await this.floorSchema.findOne( query );

    if (floorRecord != null ) {
      return FloorMap.toDomain(floorRecord);
    }
    return null;
  }

  public async findByBuildingCode(buildingCodigo: string): Promise<Floor[]> {
    const query = { buildingCode: buildingCodigo}; 
    const floorRecords = await this.floorSchema.find( query );
    const floors: Floor[] = await Promise.all(floorRecords.map(async (floorRecord) =>
      FloorMap.toDomain(floorRecord)
    ));
    return floors;
  }

  public async uploadMapFloorinBuilding(floorName:string , map: Map): Promise<Floor> {
    try {
      const query = { name: floorName};
      const buildingRecord = await this.floorSchema.findOneAndUpdate(query, {plant:{maze: map.maze, ground: map.ground, wall: map.wall, player: map.player}}, {new: true});
      return FloorMap.toDomain(buildingRecord);
    } catch (error) {
      throw error;
    }
   
  }

  public async addRoomtoFloor( floorName:string , room1:room): Promise<void> {
    try {
      const query = { name: floorName};
      
      const FloorRecord = await this.floorSchema.findOne(query);
      let roooms:room[] = FloorRecord.rooms;
      if (FloorRecord) {
        roooms.push(room1);
      }
     
      await this.floorSchema.findOneAndUpdate( query , { rooms: roooms} , {new: true});
    } catch (error) {
      throw error;
    }
   
  }

  public async getAllFloors(): Promise<Floor[]> {
    const floorRecords = await this.floorSchema.find();

    const floors: Floor[] = await Promise.all(floorRecords.map(async (floorRecord) =>
      FloorMap.toDomain(floorRecord)
    ));

    return floors;
  }

}