import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IRobotController from '../../controllers/IControllers/IRobotController'; 

import config from "../../../config";
import isAuth from '../middlewares/isAuth';

const route = Router();

export default (app: Router) => {
  app.use('/robot', route);

  const ctrl = Container.get(config.controllers.robot.name) as IRobotController;

  route.patch('/inhibitRobot',isAuth,
  celebrate({
    body: Joi.object({
      code: Joi.string().required()
    })
  }),
  (req, res, next) => ctrl.inhibitRobot(req, res, next) );

  route.post('/createRobot',isAuth,
    celebrate({
      body: Joi.object({
        code: Joi.string().required(),
        nickname: Joi.string().required(),
        robotTypeCode: Joi.string().required(),
        serialNumber: Joi.string().required(),
        description: Joi.string(),
        status: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.createRobot(req, res, next) );

    route.get('/getRobots',isAuth,
    (req, res, next) => ctrl.getRobots(req, res, next) );

    route.get('/getRobotsByTask',isAuth,
    celebrate({
      query: Joi.object({
        tasksCode: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.getRobotsByTask(req, res, next) );
}