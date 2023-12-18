import { Request, Response, NextFunction } from 'express';
import { Result } from '../../core/logic/Result';

export default interface IUserController {
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  downloadUserData(req: Request, res: Response, next: NextFunction): Promise<void>;
  listAllPendingUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  approveUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  disapproveUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  cancelAccount(req: Request, res: Response, next: NextFunction): Promise<void>;
}
