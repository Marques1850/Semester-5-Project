import { IRobotTypePersistence } from '../../dataschema/IRobotTypePersistence';
import {Floor} from "../../domain/floor";
import {List} from "immutable";
import mongoose from 'mongoose';

const robotTypeSchema = new mongoose.Schema(
  {
    domainId: { type: String, unique: true },
    code: { type: String, unique: true },
    description: { type: String, unique: false },
    tasksCode: { type: Array, unique: false },
  },
  {
    timestamps: true
  },
);

export default mongoose.model<IRobotTypePersistence & mongoose.Document>('RobotType', robotTypeSchema);
