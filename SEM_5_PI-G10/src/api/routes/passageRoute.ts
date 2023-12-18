import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IPassageController from '../../controllers/IControllers/IPassageController';

import config from "../../../config";
import isAuth from '../middlewares/isAuth';

const route = Router();

export default (app: Router) => {
  app.use('/passage', route);

  const ctrl = Container.get(config.controllers.passage.name) as IPassageController;

  route.post('/createPassage',isAuth,
    celebrate({
      body: Joi.object({
        codigo: Joi.string().required(),
        codeBuilding1: Joi.string().required(),
        codeBuilding2: Joi.string().required(),
        FloorBuilding1Name: Joi.string().required(),
        FloorBuilding2Name: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.createPassage(req, res, next));

  route.get('/getFloorsWithPassage',isAuth,
    (req, res, next) => ctrl.getFloorsWithPassage(req, res, next));
  
  route.get('/getAllPassages',isAuth,
  (req, res, next) => ctrl.getAllPassages(req, res, next));  

  route.get('/getPassagesBuildings',isAuth,
    celebrate({
      query: Joi.object({
        codeBuilding1: Joi.string().required(),
        codeBuilding2: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.getPassagesBuilding(req, res, next));

  route.put('/updatePassage',isAuth,
  celebrate({
    body: Joi.object({
      codigo: Joi.string().required(),
      codeBuilding1: Joi.string().required(),
      codeBuilding2: Joi.string().required(),
      FloorBuilding1Name: Joi.string().required(),
      FloorBuilding2Name: Joi.string().required()
    })
  }),
  (req, res, next) => ctrl.updatePassage(req, res, next));
}