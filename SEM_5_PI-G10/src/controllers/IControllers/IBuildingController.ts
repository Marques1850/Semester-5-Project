import { Request, Response, NextFunction } from 'express';

export default interface IBuildingController {
  createBuilding(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateBuilding(req: Request, res: Response, next: NextFunction): Promise<void>;
  listAllbuildings(req: Request, res: Response, next: NextFunction): Promise<void>;
  listBuildingsWithFloorRange(req: Request, res: Response, next: NextFunction): Promise<void>;
  listBuildingFloors(req: Request, res: Response, next: NextFunction): Promise<void>;
}
