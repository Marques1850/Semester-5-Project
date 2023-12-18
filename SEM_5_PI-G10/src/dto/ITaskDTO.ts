

export interface IDeliveryTaskDTO {
    code: string;
    typeTask: string;
    description: string;

    pickUpRoom: string;
    deliveryRoom: string;
    pickUpContactName: string;
    deliveryContactName: string;
    pickUpContactPhone: number;
    deliveryContactPhone: number;
}

export interface IVigilanceTaskDTO {
    code: string;
    typeTask: string;
    description: string;

    name: string;
    floorToMonitor: string;
    emergencyNumber: number;
}
