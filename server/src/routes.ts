import express from 'express';

import PointController from './controllers/PointsController';
import ItemController from './controllers/ItemsController';

const pointController = new PointController()
const itemController = new ItemController()

const routes = express.Router();

routes.get('/items', itemController.index);

routes.get('/points', pointController.index);
routes.post('/points', pointController.create);
routes.get('/points/:id', pointController.show);

export default routes;
