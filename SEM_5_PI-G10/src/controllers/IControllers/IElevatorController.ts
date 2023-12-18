import { Request, Response, NextFunction } from 'express';

export default interface IElevatorController {
  createElevator(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateElevator(req: Request, res: Response, next: NextFunction): Promise<void>;
  listElevators(req: Request, res: Response, next: NextFunction): Promise<void>;
  listAllElevators(req: Request, res: Response, next: NextFunction): Promise<void>;
  listBuildingWithoutElevators(req: Request, res: Response, next: NextFunction): Promise<void>;
}
