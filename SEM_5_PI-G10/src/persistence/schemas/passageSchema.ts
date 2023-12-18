import { IPassagePersistence } from '../../dataschema/IPassagePersistence';
import mongoose from 'mongoose';

const Passage = new mongoose.Schema(
  {
    domainId: { type: String, unique: true},
    codigo: { type: String, unique: true },
    codeBuilding1: { type: String, unique: false },
    codeBuilding2: { type: String, unique: false },
    FloorBuilding1Name: { type: String, unique: false },
    FloorBuilding2Name: { type: String, unique: false },
  },
  {
    timestamps: true
  },
);

export default mongoose.model<IPassagePersistence & mongoose.Document>('Passage', Passage);
