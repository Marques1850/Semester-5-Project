import { Container } from 'typedi';

import { Mapper } from "../core/infra/Mapper";

import {IUserDTO} from "../dto/IUserDTO";

import { User } from "../domain/user";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { UserEmail } from "../domain/userEmail";
import { UserPassword } from "../domain/userPassword";

import RoleRepo from "../repos/roleRepo";

export class UserMap extends Mapper<User> {

  public static toDTO( user: User): IUserDTO {
    return {
      //id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      taxpayerNumber: user.taxpayerNumber,
      email: user.email.value,
      password: "",
      role: user.role.name,
      estado: user.estado
    } as IUserDTO;
  }

  public static toDTO2( user: User): IUserDTO {
    return {
      //id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      taxpayerNumber: user.taxpayerNumber,
      email: user.email.value,
      password: "",
      role: user.role.name,
      estado: user.estado
    } as IUserDTO;
  }

  public static toDTOArray( users: User[]): IUserDTO[] {
    let usersDTO: IUserDTO[] = [];
    for(let user of users){
      usersDTO.push(this.toDTO(user));
    }
    return usersDTO;
  }

  public static async toDomain (raw: any): Promise<User> {
    const userEmailOrError = UserEmail.create(raw.email);
    const userPasswordOrError = UserPassword.create({value: raw.password, hashed: true});
    const repo = Container.get(RoleRepo);
    const role = await repo.findByDomainId(raw.role);

    const userOrError = User.create({
      firstName: raw.firstName,
      lastName: raw.lastName,
      phoneNumber: raw.phoneNumber,
      taxpayerNumber: raw.taxpayerNumber,
      email: userEmailOrError.getValue(),
      password: userPasswordOrError.getValue(),
      role: role,
      estado: raw.estado
    }, new UniqueEntityID(raw.domainId))

    userOrError.isFailure ? console.log(userOrError.error) : '';
    
    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  public static toPersistence (user: User): any {
    const a = {
      domainId: user.id.toString(),
      email: user.email.value,
      password: user.password.value,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role.id.toValue(),
      phoneNumber: user.phoneNumber,
      taxpayerNumber: user.taxpayerNumber,
      estado: user.estado
    }
    return a;
  }

  public static async toDomainArray (raw: any[]): Promise<User[]> {
    let users: User[] = [];
    for(let user of raw){
      users.push(await this.toDomain(user));
    }
    return users;
  }

}