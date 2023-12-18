import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { Task, taskProps } from "./task";

export interface DeliveryProps extends taskProps{
  pickUpRoom: string;
  deliveryRoom: string;
  pickUpContactName: string;
  deliveryContactName: string;
  pickUpContactPhone: number;
  deliveryContactPhone: number;
}

export class DeliveryTask extends Task {
  private pickUpRoom: string;
  private deliveryRoom: string;
  private pickUpContactName: string;
  private deliveryContactName: string;
  private pickUpContactPhone: number;
  private deliveryContactPhone: number;
  
  get id (): UniqueEntityID {
    return super.id;
  }

  private constructor (props: DeliveryProps, id?: UniqueEntityID) {
    super(props, id);
    this.pickUpRoom = props.pickUpRoom;
    this.deliveryRoom = props.deliveryRoom;
    this.pickUpContactName = props.pickUpContactName;
    this.deliveryContactName = props.deliveryContactName;
    this.pickUpContactPhone = props.pickUpContactPhone;
    this.deliveryContactPhone = props.deliveryContactPhone;
  }

  public static create(props: DeliveryProps, id?: UniqueEntityID): Result<DeliveryTask> {
    const guardedProps = [
      { argument: props.pickUpRoom, argumentName: 'pickUpRoom' },
      { argument: props.deliveryRoom, argumentName: 'deliveryRoom' },
      { argument: props.pickUpContactName, argumentName: 'pickUpContactName' },
      { argument: props.deliveryContactName, argumentName: 'deliveryContactName' },
      { argument: props.pickUpContactPhone, argumentName: 'pickUpContactPhone' },
      { argument: props.deliveryContactPhone, argumentName: 'deliveryContactPhone' }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<DeliveryTask>(guardResult.message);
    } else {
      const vigilanceTask = new DeliveryTask(props, id);
      return Result.ok<DeliveryTask>(vigilanceTask);
    }
  }

  get getPickUpRoom (): string {
    return this.pickUpRoom;
  }

  get getDeliveryRoom (): string {
    return this.deliveryRoom;
  }

  get getPickUpContactName (): string {
    return this.pickUpContactName;
  }

  get getDeliveryContactName (): string {
    return this.deliveryContactName;
  }

  get getPickUpContactPhone (): number {
    return this.pickUpContactPhone;
  }

  get getDeliveryContactPhone (): number {
    return this.deliveryContactPhone;
  }
}