import { Request, Response, NextFunction } from 'express';

export default interface IFloorController {
  createFloor(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateFloor(req: Request, res: Response, next: NextFunction): Promise<void>;
  listFloorsWithElevators(req: Request, res: Response, next: NextFunction): Promise<void>;
  uploadFloorMap(req: Request, res: Response, next: NextFunction): Promise<void>;
  getPlant(req: Request, res: Response, next: NextFunction): Promise<void>;
  listAllFloorsElevators(req: Request, res: Response, next: NextFunction): Promise<void>;
  listAllFloors(req: Request, res: Response, next: NextFunction): Promise<void>;
  uniao(req: Request, res: Response, next: NextFunction): Promise<void>;
  editPlayerPosition(req: Request, res: Response, next: NextFunction): Promise<void>;
}
