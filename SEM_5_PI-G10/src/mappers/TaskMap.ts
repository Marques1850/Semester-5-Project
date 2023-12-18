import { Mapper } from "../core/infra/Mapper";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { DeliveryTask, DeliveryProps } from "../domain/deliveryTask";
import { VigilanceTask, VigilanceTaskProps } from "../domain/vigilanceTask";
import { Task } from "../domain/task";
import { IVigilanceTaskDTO } from "../dto/ITaskDTO";
import { IDeliveryTaskDTO } from "../dto/ITaskDTO";
import { TypeTask } from "../domain/typeTask";


export class TaskMap implements Mapper<Task> {

    public static toDTO(task: Task): IDeliveryTaskDTO | IVigilanceTaskDTO {
        if ( task.typeTask == TypeTask.DELIVERY ) {
            return this.toDeliveryDTO(task as DeliveryTask);
        }
        if ( task.typeTask == TypeTask.VIGILANCE ) {
            return this.toVigilanceDTO(task as VigilanceTask);
        }
    }

    public static toDeliveryDTO(deliveryTask: DeliveryTask): IDeliveryTaskDTO {
        return {
            code: deliveryTask.code,
            typeTask: deliveryTask.typeTask,
            description: deliveryTask.description,
            pickUpRoom: deliveryTask.getPickUpRoom,
            deliveryRoom: deliveryTask.getDeliveryRoom,
            pickUpContactName: deliveryTask.getPickUpContactName,
            deliveryContactName: deliveryTask.getDeliveryContactName,
            pickUpContactPhone: deliveryTask.getPickUpContactPhone,
            deliveryContactPhone: deliveryTask.getDeliveryContactPhone,
        };
    }

    public static toVigilanceDTO(vigilanceTask: VigilanceTask): IVigilanceTaskDTO {
        return {
            code: vigilanceTask.code,
            typeTask: vigilanceTask.typeTask,
            description: vigilanceTask.description,
            name: vigilanceTask.getName,
            floorToMonitor: vigilanceTask.getFloorToMonitor,
            emergencyNumber: vigilanceTask.getEmergencyNumber,
        };
    }

    public static toDomainTask(raw: any): Task {
        const taskOrError = Task.create(
            {
                code: raw.code,
                typeTask: raw.typeTask,
                description: raw.description,
            },
            new UniqueEntityID(raw.id)
        );

        if (taskOrError.isFailure) {
            console.log(taskOrError.error);
        }

        return taskOrError.isSuccess ? taskOrError.getValue() : null
    }

    public static async toDomain(raw: any): Promise<VigilanceTask | DeliveryTask > {
        const deliveryOrVigilanceTask = raw.typeTask == TypeTask.DELIVERY ? await this.toDeliveryDomain(raw) : await this.toVigilanceDomain(raw);
        return deliveryOrVigilanceTask;
    }

    public static async toDeliveryDomain(raw: any): Promise<DeliveryTask> {
        const deliveryTaskOrError = DeliveryTask.create(
            {
                code: raw.code,
                typeTask: raw.typeTask,
                description: raw.description,
                pickUpRoom: raw.pickUpRoom,
                deliveryRoom: raw.deliveryRoom,
                pickUpContactName: raw.pickUpContactName,
                deliveryContactName: raw.deliveryContactName,
                pickUpContactPhone: raw.pickUpContactPhone,
                deliveryContactPhone: raw.deliveryContactPhone,
            },
            new UniqueEntityID(raw.id)
        );
        
        if (deliveryTaskOrError.isFailure) {
            console.log(deliveryTaskOrError.error);
        }

        return deliveryTaskOrError.isSuccess ? deliveryTaskOrError.getValue() : null;
    }

    public static async toVigilanceDomain(raw: any): Promise<VigilanceTask> {
        const vigilanceTaskOrError = VigilanceTask.create(
            {
                code: raw.code,
                typeTask: raw.typeTask,
                description: raw.description,
                name: raw.name,
                floorToMonitor: raw.floorToMonitor,
                emergencyNumber: raw.emergencyNumber,
            },
            new UniqueEntityID(raw.id)
        );
        
        if (vigilanceTaskOrError.isFailure) {
            console.log(vigilanceTaskOrError.error);
        }

        return vigilanceTaskOrError.isSuccess ? vigilanceTaskOrError.getValue() : null;
    }




    public static toPersistence(task: Task): any {
        if ( task.typeTask == TypeTask.DELIVERY ) {
            return this.toDeliveryPersistence(task as DeliveryTask);
        }
        if ( task.typeTask == TypeTask.VIGILANCE ) {
            return this.toVigilancePersistence(task as VigilanceTask);
        }
    }

    public static toDeliveryPersistence(deliveryTask: DeliveryTask): any {
        return {
            domainId: deliveryTask.id.toString(),
            code: deliveryTask.code,
            typeTask: deliveryTask.typeTask,
            description: deliveryTask.description,
            pickUpRoom: deliveryTask.getPickUpRoom,
            deliveryRoom: deliveryTask.getDeliveryRoom,
            pickUpContactName: deliveryTask.getPickUpContactName,
            deliveryContactName: deliveryTask.getDeliveryContactName,
            pickUpContactPhone: deliveryTask.getPickUpContactPhone,
            deliveryContactPhone: deliveryTask.getDeliveryContactPhone,
        };
    }

    public static toVigilancePersistence(vigilanceTask: VigilanceTask): any {
        return {
            domainId: vigilanceTask.id.toString(),
            code: vigilanceTask.code,
            typeTask: vigilanceTask.typeTask,
            description: vigilanceTask.description,
            name: vigilanceTask.getName,
            floorToMonitor: vigilanceTask.getFloorToMonitor,
            emergencyNumber: vigilanceTask.getEmergencyNumber,
        };
    }



    
}