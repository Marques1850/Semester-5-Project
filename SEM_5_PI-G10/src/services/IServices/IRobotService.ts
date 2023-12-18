import { Result } from "../../core/logic/Result";
import IRobotDTO from '../../dto/IRobotDTO';
import IRobotTypeDTO from '../../dto/IRobotTypeDTO';


export default interface IRobotService {
    createRobot(robot: IRobotDTO): Promise<Result<IRobotDTO>>;
    getRobots(): Promise<Result<IRobotDTO[]>>;
    inhibitRobot(robot: IRobotDTO): Promise<Result<IRobotDTO>>;
    getRobotsByRobotTypes(robotTypeDTOs :IRobotTypeDTO[] ): Promise<Result<IRobotDTO[]>>;
}
