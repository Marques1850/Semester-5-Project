import { IRobotPersistence } from '../../dataschema/IRobotPersistence';
import mongoose from 'mongoose';

const Robot = new mongoose.Schema(
  {
    domainId: { type: String, unique: true },
    code: { type: String, unique: true },
    nickname: { type: String },
    robotTypeCode: { type: String },
    serialNumber: { type: String },
    description: { type: String, required: false },
    status: { type: String }
  },
  {
    timestamps: true
  },
);

export default mongoose.model<IRobotPersistence & mongoose.Document>('Robot', Robot);
