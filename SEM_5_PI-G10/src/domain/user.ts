import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { UserId } from "./userId";
import { UserEmail } from "./userEmail";
import { Role } from "../domain/role";
import { UserPassword } from "./userPassword";
import { Guard } from "../core/logic/Guard";


interface UserProps {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  taxpayerNumber?: string;
  email: UserEmail;
  password: UserPassword;
  role: Role;
  estado:string;
}

export class User extends AggregateRoot<UserProps> {
  get id (): UniqueEntityID {
    return this._id;
  }

  get userId (): UserId {
    return UserId.caller(this.id)
  }

  get estado (): string {
    return this.props.estado;
  }

  set estado (value: string) {
    this.props.estado = value;
  }

  get email (): UserEmail {
    return this.props.email;
  }

  get firstName (): string {
    return this.props.firstName
  }

  get lastName (): string {
    return this.props.lastName;
  }

  get password (): UserPassword {
    return this.props.password;
  }

  get role (): Role {
    return this.props.role;
  }
  
  set role (value: Role) {
      this.props.role = value;
  }

  get taxpayerNumber (): string {
    return this.props.taxpayerNumber;
  }

  set taxpayerNumber (value: string) {
    this.props.taxpayerNumber = value;
  }

  get phoneNumber (): string {
    return this.props.phoneNumber;
  }

  set phoneNumber (value: string) {
    this.props.phoneNumber = value;
  }

  private constructor (props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create (props: UserProps, id?: UniqueEntityID): Result<User> {

    const guardedProps = [
      { argument: props.firstName, argumentName: 'firstName' },
      { argument: props.lastName, argumentName: 'lastName' },
      { argument: props.phoneNumber, argumentName: 'phoneNumber' },
      { argument: props.email, argumentName: 'email' },
      { argument: props.role, argumentName: 'role' },
      { argument: props.estado, argumentName: 'estado' }

    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message)
    }     
    else {
      const user = new User({
        ...props
      }, id);

      return Result.ok<User>(user);
    }
  }
}