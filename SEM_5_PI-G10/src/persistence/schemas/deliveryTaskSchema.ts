import mongoose from 'mongoose';
import { TypeTask } from '../../domain/typeTask';
import { TaskModel } from './taskSchema';
import { IDeliveryTaskPersistence } from '../../dataschema/IDeliveryTaskPersistence';

const DeliveryTaskModel = TaskModel.discriminator(
    TypeTask.DELIVERY, 
    new mongoose.Schema({
        pickUpRoom: { type: String },
        deliveryRoom: { type: String },
        pickUpContactName: { type: String },
        deliveryContactName: { type: String },
        pickUpContactPhone: { type: Number },
        deliveryContactPhone: { type: Number },
    })
);

export default mongoose.model<IDeliveryTaskPersistence & mongoose.Document>('DeliveryTask', DeliveryTaskModel.schema);