import { Response, Request, NextFunction } from 'express';

import { Inject, Service } from 'typedi';

import config from '../../config';

import IUserRepo from '../services/IRepos/IUserRepo';

import { UserMap } from "../mappers/UserMap";
import { IUserDTO } from '../dto/IUserDTO';
import  IUserController from './IControllers/IUserController';
import  IUserService  from '../services/IServices/IUserService';

import { Result } from "../core/logic/Result";

@Service()
export default class UserController implements IUserController{
  constructor(
      @Inject(config.services.user.name) private userServiceInstance : IUserService,
  ) {}


  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userOrError = await this.userServiceInstance.createUser(req.body as IUserDTO) as Result<IUserDTO>;

      if (userOrError.isFailure) {
        res.status(400).send(userOrError.errorValue());
      } else {
        const userDTO = userOrError.getValue();
        res.status(201).json(userDTO);
      }
    } catch (e) {
      next(e);
    }
  };

  public async downloadUserData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const dataOrError = await this.userServiceInstance.downloadUserData(req.query.email as string) as Result<IUserDTO>;

      if (dataOrError.isFailure) {
        res.status(400).send(dataOrError.errorValue());
      } else {
        const userDTO = dataOrError.getValue();
        res.status(201).json(userDTO);
      }
    } catch (e) {
      next(e);
    }
  }
  public async listAllPendingUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const dataOrError = await this.userServiceInstance.listAllPendingUsers() as Result<Array<IUserDTO>>;

      if (dataOrError.isFailure) {
        res.status(400).send(dataOrError.errorValue());
      } else {
        const userDTO = dataOrError.getValue();
        res.status(201).json(userDTO);
      }
    } catch (e) {
      next(e);
    }
  }

  public async approveUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const dataOrError = await this.userServiceInstance.approveUser(req.body.email) as Result<IUserDTO>;

      if (dataOrError.isFailure) {
        res.status(400).send(dataOrError.errorValue());
      } else {
        const userDTO = dataOrError.getValue();
        res.status(201).json(userDTO);
      }
    } catch (e) {
      next(e);
    }
  }
  public async disapproveUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const dataOrError = await this.userServiceInstance.disapproveUser(req.body.email) as Result<IUserDTO>;

      if (dataOrError.isFailure) {
        res.status(400).send(dataOrError.errorValue());
      } else {
        const userDTO = dataOrError.getValue();
        res.status(201).json(userDTO);
      }
    } catch (e) {
      next(e);
    }
  
  }
  public async cancelAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const dataOrError = await this.userServiceInstance.cancelAccount(req.body.email);

      if (dataOrError == false) {
        res.status(400).send(false);
      } else {
        res.status(201).json(true);
      }
    } catch (e) {
      next(e);
    }
  }


}
/*
exports.getMe = async function(req, res: Response) {
  
    // NB: a arquitetura ONION não está a ser seguida aqui

    const userRepo = Container.get(config.repos.user.name) as IUserRepo

    if( !req.token || req.token == undefined )
        return res.json( new Error("Token inexistente ou inválido")).status(401);

    const user = await userRepo.findById( req.token.id );
    if (!user)
        return res.json( new Error("Utilizador não registado")).status(401);

    const userDTO = UserMap.toDTO( user ) as IUserDTO;
    return res.json( userDTO ).status(200);
}
*/