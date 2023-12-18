import { IBuildingPersistence } from '../../dataschema/IBuildingPersistence';
import mongoose from 'mongoose';

const Building = new mongoose.Schema(
  {
    domainId: { 
      type: String,
      unique: true
    },
    code: { type: String, unique: true },
    name: { type: String },
    description: { type: String },
    width: { type: Number },
    length: { type: Number },
  },
  {
    timestamps: true
  },
);

export default mongoose.model<IBuildingPersistence & mongoose.Document>('Building', Building);
