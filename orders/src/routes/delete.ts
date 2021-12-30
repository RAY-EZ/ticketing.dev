import { NotAuthorizedError, NotFoundError, requireAuth } from '@d-ticket/common';
import express, {NextFunction, Request, Response} from 'express';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { Order, OrderStatus } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/:orderId',requireAuth, async (req: Request, res: Response, next: NextFunction)=>{
  const order = await Order.findOne({ id : req.params.id}).populate('ticket');
  
  if(!order){
    return next(new NotFoundError());
  }
  if(order.userId !== req.currentUser!.id){
    return next(new NotAuthorizedError());
  }

  order.status = OrderStatus.Cancelled;
  order.save();

  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id
    }
  })

  res.status(204).send(order);
})

export { router as deleteOrderRouter } ;