import { Request, Response, NextFunction } from 'express';

export default interface IPassageController {
  createPassage(req: Request, res: Response, next: NextFunction): Promise<void>;
  getFloorsWithPassage(req: Request, res: Response, next: NextFunction): Promise<void>;
  getPassagesBuilding(req: Request, res: Response, next: NextFunction): Promise<void>;
  updatePassage(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllPassages(req: Request, res: Response, next: NextFunction): Promise<void>;
}

