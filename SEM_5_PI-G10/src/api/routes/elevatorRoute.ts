import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IElevatorController from '../../controllers/IControllers/IElevatorController'; 
import isAuth from '../middlewares/isAuth';

import config from "../../../config";


const route = Router();

export default (app: Router) => {
  app.use('/elevator', route);

  const ctrl = Container.get(config.controllers.elevator.name) as IElevatorController;


  route.post('/createElevator',isAuth,
    celebrate({
      body: Joi.object({
        BuildingCode: Joi.string().required(),
        ElevatorCode: Joi.string().required(),
        FloorsAttended: Joi.array().items(Joi.number()).required(),
        ElevatorType: Joi.object(),
        NumSerie: Joi.string(),
        Description: Joi.string()
      })
    }),
    (req, res, next) => ctrl.createElevator(req, res, next) );

    route.patch('/updateElevator',isAuth,
    celebrate({
      body: Joi.object({
        BuildingCode: Joi.string().required(),
        ElevatorCode: Joi.string(),
        FloorsAttended: Joi.array().items(Joi.number()),
        ElevatorType: Joi.object(),
        NumSerie: Joi.string(),
        Description: Joi.string()
      })
    }),
    (req, res, next) => ctrl.updateElevator(req, res, next) );

    route.get('/getElevator',isAuth,
    celebrate({
      query: Joi.object({
        BuildingCode: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.listElevators(req, res, next) );

    route.get('/getElevators',isAuth,
    (req, res, next) => ctrl.listAllElevators(req, res, next) );

    route.get('/getBuildingWithoutElevators',isAuth,
    (req, res, next) => ctrl.listBuildingWithoutElevators(req, res, next) );

  
};