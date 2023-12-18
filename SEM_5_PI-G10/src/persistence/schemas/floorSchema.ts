import { IFloorPersistence } from '../../dataschema/IFloorPersistence';

import mongoose from 'mongoose';

var MazeSchema = new mongoose.Schema({
  size: {
    width: { type: Number, required: true },
    depth: { type: Number, required: true }
  },
  map: { type: Array, required: true },
  exits: { type: Array, required: true },
  elevators: { type: Array, required: true },
  exitLocation: { type: Array, required: true },
  exitFloor: { type: Array, required: true },
  rooms: { type: Array, required: true },
});

var groundSchema = new mongoose.Schema({
  size: { type: Object, unique: false },
  segments: { type: Object, unique: false },
  primaryColor: { type: String, unique: false },
  maps: { type: Object, unique: false },
  wrapS: { type: Number, unique: false },
  wrapT: { type: Number, unique: false },
  repeat: { type: Object, unique: false },
  magFilter: { type: Number, unique: false },
  minFilter: { type: Number, unique: false },
  secondaryColor: { type: String, unique: false },
});

var wallSchema = new mongoose.Schema({
  segments: { type: Object, unique: false },
  primaryColor: { type: String, unique: false },
  maps: { type: Object, unique: false },
  wrapS: { type: Number, unique: false },
  wrapT: { type: Number, unique: false },
  repeat: { type: Object, unique: false },
  magFilter: { type: Number, unique: false },
  minFilter: { type: Number, unique: false },
  secondaryColor: { type: String, unique: false },
});

var PlayerSchema = new mongoose.Schema({
  initialPosition: { type: [Number], required: true },
  initialDirection: { type: Number, required: true },
});

var mapfloor = new mongoose.Schema({
  maze: { type: MazeSchema, unique: false },
  ground: { type: groundSchema, unique: false },
  wall: { type: wallSchema, unique: false },
  player: { type: PlayerSchema, unique: false },
});

const Floor = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    description: { type: String, unique: false },
    buildingCode: { type: String, unique: false },
    level: { type:  Number, unique: false },
    width: { type: Number, unique: false },
    length: { type: Number, unique: false },
    plant: { type: mapfloor, unique: false },
    rooms: { type: Array, unique: false },
  },
  {
    timestamps: true
  },
);

export default mongoose.model<IFloorPersistence & mongoose.Document>('Floor', Floor);
