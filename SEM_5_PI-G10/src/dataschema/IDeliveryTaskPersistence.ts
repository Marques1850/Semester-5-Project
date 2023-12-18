import { ITaskPersistence } from "./ITaskPersistence";

export interface IDeliveryTaskPersistence extends ITaskPersistence {
    pickUpRoom: string;
    deliveryRoom: string;
    pickUpContactName: string;
    deliveryContactName: string;
    pickUpContactPhone: number;
    deliveryContactPhone: number;
}