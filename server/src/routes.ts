import express from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import PointController from './controllers/PointsController';
import ItemController from './controllers/ItemsController';

const pointController = new PointController()
const itemController = new ItemController()

const routes = express.Router();
const upload = multer(multerConfig)

routes.get('/items', itemController.index);
routes.get('/points', pointController.index);

routes.post('/points' , upload.single('image') , pointController.create);


routes.get('/points/:id', pointController.show);

export default routes;
