import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import PendingDeliveriesController from './app/controllers/PendingDeliveriesController';
import CompletedDeliveriesController from './app/controllers/CompletedDeliveriesController';
import WithdrawalDeliveryController from './app/controllers/WithdrawalDeliveryController';
import FinalizeDeliveryController from './app/controllers/FinalizeDeliveryController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';

// middlewares
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// admin users
routes.post('/users', UserController.store);

// start a session
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // defining by global form. The execution if sequential

// user after authentication
routes.put('/users', UserController.update);

// recipients
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

// deliverymen
routes.get('/deliverymen', DeliverymanController.index);
routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

// deliveries
routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

// deliveryman deliveries
routes.get('/deliverymen/:id/deliveries', PendingDeliveriesController.index);
routes.get(
  '/deliverymen/:id/completed-deliveries',
  CompletedDeliveriesController.index
);

// withdraw a delivery and set a start_date by a deliveryman
routes.put(
  '/deliveries/withdraw/:deliveryman_id/:delivery_id',
  WithdrawalDeliveryController.update
);

// finalize a delivery and set a end_date
routes.put(
  '/deliveries/finalize/:deliveryman_id/:delivery_id',
  upload.single('file'),
  FinalizeDeliveryController.update
);

// list and create delivery problems
routes.get('/delivery/problems', DeliveryProblemsController.index);
routes.get('/delivery/:delivery_id/problems', DeliveryProblemsController.show);
routes.post(
  '/delivery/:delivery_id/problems',
  DeliveryProblemsController.store
);
// cancel a delivery based on the problem ID
routes.delete(
  '/problem/:problem_id/cancel-delivery',
  DeliveryProblemsController.delete
);

// file (avatar and delivery signature)
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
