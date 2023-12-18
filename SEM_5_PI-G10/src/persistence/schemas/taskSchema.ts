import { ITaskPersistence } from '../../dataschema/ITaskPersistence';
import mongoose from 'mongoose';
import { TypeTask } from '../../domain/typeTask';


const taskSchema = new mongoose.Schema({
    domainId: { type: String, unique: true },
    code: { type: String, unique: true },
    typeTask: { type: String, enum: [TypeTask.DELIVERY, TypeTask.VIGILANCE] },
    description: { type: String },
}, {
    discriminatorKey: 'type', // Define a discriminator key
    timestamps: true,
});

export const TaskModel = mongoose.model('Task', taskSchema);

export default mongoose.model<ITaskPersistence & mongoose.Document>('Task', taskSchema);