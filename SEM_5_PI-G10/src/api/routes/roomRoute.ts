import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IRoomController from '../../controllers/IControllers/IRoomController'; 

import config from "../../../config";
import isAuth from '../middlewares/isAuth';


const route = Router();

export default (app: Router) => {
  app.use('/room', route);

  const ctrl = Container.get(config.controllers.room.name) as IRoomController;

  route.post('/createRoom',isAuth,
    celebrate({
      body: Joi.object({
        floorName: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        roomtype: Joi.string().required()
       
      })
    }),
    (req, res, next) => ctrl.createRoom(req, res, next) );

  
};