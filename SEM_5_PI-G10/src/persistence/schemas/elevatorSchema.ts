import { IElevatorPersistence } from '../../dataschema/IElevatorPersistence';

import mongoose from 'mongoose';
import { elevatorType } from '../../domain/elevatorType';
var typeType=new mongoose.Schema({marca:String,modelo:String},{_id:false});
const Elevator = new mongoose.Schema(
  {
    domainId: { 
      type: String,
      unique: true
    },
    BuildingCode: { type: String, unique: true },
    ElevatorCode: { type: String, unique: true },
    FloorsAttended: { type: Array },
    ElevatorType: { type:typeType ,required: false },
    NumSerie: { type: String,required: false },
    Description: { type: String,required: false }
   
  },
  {
    timestamps: true
  },
);

export default mongoose.model<IElevatorPersistence & mongoose.Document>('Elevator', Elevator);
