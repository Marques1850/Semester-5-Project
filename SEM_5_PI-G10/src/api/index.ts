import { Router } from 'express';
import auth from './routes/userRoute';
import user from './routes/userRoute';
import role from './routes/roleRoute';
import elevator from './routes/elevatorRoute';
import building from './routes/buildingRoute';
import floor from './routes/floorRoute';
import room from './routes/roomRoute';
import passage from './routes/passageRoute';
import robot from './routes/robotRoute';
import robotType from './routes/robotTypeRoute';
import task from './routes/taskRoute';


export default () => {
	const app = Router();

	auth(app);
	user(app);
	role(app);
	building(app);
	elevator(app);
	floor(app);
	room(app);
	passage(app);
	robot(app);
	robotType(app);
	task(app)
	
	return app
}