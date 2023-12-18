import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IBuildingController from '../../controllers/IControllers/IBuildingController'; 

import config from "../../../config";
import isAuth from '../middlewares/isAuth';
declare module 'express-serve-static-core' {
  interface Request {
    token?: any;
  }
}


const route = Router();

export default (app: Router) => {
  app.use('/building', route);

  const ctrl = Container.get(config.controllers.building.name) as IBuildingController;

  route.post('/createBuilding',isAuth,
    celebrate({
      body: Joi.object({
        code: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().max(255).required(),
        width: Joi.string().required(),
        length: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.createBuilding(req, res, next) );

  route.get('/buildingsList',isAuth,
    (req, res, next) => ctrl.listAllbuildings(req, res, next) );

  route.put('/updateBuilding',isAuth,
    celebrate({
      body: Joi.object({
        code: Joi.string().required(),
        name: Joi.string(),
        description: Joi.string(),
        width: Joi.string(),
        length: Joi.string()
      }),
    }),
    (req, res, next) => ctrl.updateBuilding(req, res, next) );

  route.get('/listBuildingsWithFloorRange',isAuth,
    celebrate({
      query: Joi.object({
        min: Joi.number().required(),
        max: Joi.number().required()
      })
    }),
    (req, res, next) => ctrl.listBuildingsWithFloorRange(req, res, next)
  );

  route.get('/getBuildingFloors',isAuth,
    celebrate({
      query: Joi.object({
        code: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.listBuildingFloors(req, res, next)
  );
}