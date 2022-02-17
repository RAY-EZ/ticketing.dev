import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@d-ticket/common';
import express, {NextFunction, Request, Response} from 'express';
import { body} from 'express-validator';
import mongoose  from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper'

const router = express.Router();

const EXPIRATION_SECONDS = 1*60;

router.post('/',
 requireAuth,
 [
   body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string)=> mongoose.Types.ObjectId.isValid(input))
    .withMessage('Ticket must be provided')
 ],
 validateRequest,
 async (req: Request, res: Response, next: NextFunction)=>{
   const { ticketId } = req.body;
   // Find the ticket user is trying to order in the database
   const ticket = await Ticket.findById(ticketId);
   if(!ticket){
     return next(new NotFoundError());
   }
   // Making sure ticket isn't already reserved
   // Run query to look at all orders. find order that has the ticket matches 
   // with the ticket we have found & the order status isn't cancelled
   // Order status except cancelled will be reserved
   const isReserved = await ticket.isReserved();
   if(isReserved){
     return next(new BadRequestError('Ticket is already reserved'));
   }

   // Build the order and save it to the database
   const expiration = new Date();
   expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS);

   // Publish an event saying that an ordre was created
   const order = Order.build({
     userId: req.currentUser!.id,
     status: OrderStatus.Created,
     expiresAt: expiration,
     ticket
   });

   await order.save();

   await new OrderCreatedPublisher(natsWrapper.client).publish({
     id: order.id,
     status: order.status,
     userId: order.userId,
     expiresAt: order.expiresAt.toISOString(),
     version: order.version,
     ticket: {
       id: ticket.id,
       price: ticket.price
     }
   })

  res.status(201).send(order);
})

export { router as newOrderRouter } ;