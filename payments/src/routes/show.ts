import { NotFoundError } from '@d-ticket/common';
import express, {NextFunction, Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response, next: NextFunction)=>{
  let ticket;
  if(req.params.id){
    // but works
    ticket = await Ticket.findOne({id: req.params.id})
    // console.log(ticket, req.params.id)
  }
  

  if(!ticket){
    return next(new NotFoundError());
  }

  res.send(ticket);
})

export { router as showTicketRouter };