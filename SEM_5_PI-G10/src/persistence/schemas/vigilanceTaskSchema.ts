import mongoose from 'mongoose';
import { TypeTask } from '../../domain/typeTask';
import { TaskModel } from './taskSchema';
import { IVigilanceTaskPersistence } from '../../dataschema/IVigilanceTaskPersistence';

const VigilanceTaskModel = TaskModel.discriminator(
    TypeTask.VIGILANCE, 
    new mongoose.Schema({
        name: { type: String },
        floorToMonitor: { type: String },
        emergencyNumber: { type: Number },
    })
);

export default mongoose.model<IVigilanceTaskPersistence & mongoose.Document>('VigilanceTask', VigilanceTaskModel.schema);
