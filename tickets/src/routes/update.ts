import express, { Request, Response, NextFunction} from 'express';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publisher/TicketUpdatedPublisher';
import { natsWrapper } from '../nats-wrapper';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError
} from '@d-ticket/common';

import { Ticket } from '../models/ticket';

const router = express.Router();

router.put('/:id', requireAuth,[
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0})
    .withMessage('Price must be greater than 0')
],
validateRequest,
async(
  req: Request,
  res: Response,
  next: NextFunction
)=>{
  const ticket = await Ticket.findOne({id: req.params.id})

  if(!ticket){
    return next(new NotFoundError());
  }

  if(ticket.userId !== req.currentUser!.id){
    return next(new NotAuthorizedError());
  }

  ticket.set({
    title: req.body.title,
    price: req.body.price
  });
  await ticket.save();

  await new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    userId: ticket.userId,
    price: ticket.price,
    version: ticket.version,
    orderId: ticket.orderId
  })
  res.send(ticket);
})

export { router as updateTicketRouter };