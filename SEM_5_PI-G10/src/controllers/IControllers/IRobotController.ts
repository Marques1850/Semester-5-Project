import { Request, Response, NextFunction } from 'express';

export default interface IRobotController {
    createRobot(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRobots(req: Request, res: Response, next: NextFunction): Promise<void>;
    inhibitRobot(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRobotsByTask(req: Request, res: Response, next: NextFunction): Promise<void>;
}