import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import ITaskController from '../../controllers/IControllers/ITaskController'; 

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/task', route);

  const ctrl = Container.get(config.controllers.task.name) as ITaskController;

  route.post('/createVigilanceTask',
    celebrate({
      body: Joi.object({
        code: Joi.string().required(), 
        typeTask: Joi.string().required(),
        description: Joi.string().required(),
        name: Joi.string().required(),
        floorToMonitor: Joi.string().required(),
        emergencyNumber: Joi.number().required(),
      })
    }),
    (req, res, next) => ctrl.createTask(req, res, next) );
    
    route.post('/createDeliveryTask',
    celebrate({
      body: Joi.object({
        code: Joi.string().required(), 
        typeTask: Joi.string().required(),
        description: Joi.string().required(),
        pickUpRoom: Joi.string().required(),
        deliveryRoom: Joi.string().required(),
        deliveryContactName: Joi.string().required(),
        pickUpContactPhone: Joi.number().required(),
        deliveryContactPhone: Joi.number().required(),
      })
    }),
    (req, res, next) => ctrl.createTask(req, res, next) );

  route.get('/getAllTasks', (req, res, next) => ctrl.getAllTasks(req, res, next) );
}