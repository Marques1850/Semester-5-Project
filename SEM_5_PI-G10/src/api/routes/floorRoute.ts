import { Request,Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IFloorController from '../../controllers/IControllers/IFloorController'; 

import config from "../../../config";
import multer from 'multer';
import isAuth from '../middlewares/isAuth';

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

const route = Router();
interface MulterRequest extends Request {
  file: any;
}

export default (app: Router) => {
  app.use('/floor', route);

  const ctrl = Container.get(config.controllers.floor.name) as IFloorController;

  route.get('/getFloorsElevator',isAuth,
  (req, res, next) => ctrl.listAllFloorsElevators(req, res, next) );
  route.get('/getFloors',isAuth,
  (req, res, next) => ctrl.listAllFloors(req, res, next) );

  route.get('/uniao',isAuth,
  celebrate({
    query: Joi.object({
      floor1: Joi.string().required(),
      floor2: Joi.string().required(),
    })
  }),
  (req, res, next) => ctrl.uniao(req, res, next) );

  route.post('/createFloor',isAuth,
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        buildingCode: Joi.string().required(),
        level: Joi.number().required(),
        width: Joi.string().required(),
        length: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.createFloor(req, res, next) );
  
    route.get('/listFloorsWithElevators',isAuth,
    celebrate({
      query: Joi.object({
        buildingCode: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.listFloorsWithElevators(req, res, next) );

    route.patch('/updateFloor',isAuth,
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string(),
        buildingCode: Joi.string().required(),
        level: Joi.number(),
        width: Joi.string(),
        length: Joi.string(),
      })
    }),
    (req, res, next) => ctrl.updateFloor(req, res, next) );

    route.get('/getPlant',isAuth,
    celebrate({
      query: Joi.object({
        buildingCode: Joi.string().required(),
        floorName: Joi.string().required(),
      })
    }),
    (req, res, next) => ctrl.getPlant(req, res, next) );

    route.patch('/uploadMap',isAuth,
    upload.single('plant'),
    celebrate({
      body: Joi.object({
        name: Joi.string().optional(),
      })
    }),
    (MulterRequest, res, next) => {
      if (!MulterRequest.file) {
        res.status(400).send({ error: "'plant' field is required" });
      } else {
        ctrl.uploadFloorMap(MulterRequest, res, next);
      }
    }
  );
   
  route.get('/editPlayerPosition',
  celebrate({
    query: Joi.object({
      buildingCode: Joi.string().required(),
      floorName: Joi.string().required(),
      X: Joi.number().required(),
      Y: Joi.number().required(),
      orientation: Joi.number().required(),
    })
  }),
  (req, res, next) => ctrl.editPlayerPosition(req, res, next));
  
  
};