import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IRobotTypeController from '../../controllers/IControllers/IRobotTypeController'; 

import config from "../../../config";
import isAuth from '../middlewares/isAuth';

const route = Router();

export default (app: Router) => {
  app.use('/robotType', route);

  const ctrl = Container.get(config.controllers.robotType.name) as IRobotTypeController;

  route.post('/createRobotType',isAuth,
    celebrate({
      body: Joi.object({
        code: Joi.string().required(),
        description: Joi.string().required(),
        tasksCode: Joi.array().items(Joi.string()).required(),
      })
    }),
    (req, res, next) => ctrl.createRobotType(req, res, next) );

  route.get('/getRobotTypes',isAuth,
    (req, res, next) => ctrl.getRobotTypes(req, res, next) );
}