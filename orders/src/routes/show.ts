import { NotAuthorizedError, NotFoundError, requireAuth } from '@d-ticket/common';
import express, {NextFunction, Request, Response} from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/:orderId',requireAuth ,async (req: Request, res: Response, next: NextFunction)=>{
  const order =await Order.findOne({id: req.params.orderId}).populate('ticket');

  if(!order){
    return next(new NotFoundError());
  }
  if(order.userId !== req.currentUser!.id){
    return next(new NotAuthorizedError());
  }
  res.send(order);
})

export { router as showOrderRouter } ;