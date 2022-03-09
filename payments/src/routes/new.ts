import  express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { 
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus
} from '@d-ticket/common';
import {stripe} from '../stripe'
import { Order} from '../models/order';
import { PaymentCompletePublisher } from '../events/publishers/payment-complete-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Payment } from '../models/payment'
const router = express.Router();

router.post('/api/payments',
  requireAuth,
  [
    body('token')
    .not()
    .isEmpty()
    .withMessage('token required'),
    body('orderId')
    .not()
    .isEmpty()
    .withMessage('orderid required')
  ],
  validateRequest,
  async (req: Request, res: Response)=> {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if(!order){
      throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id ){
      throw new NotAuthorizedError();
    }

    if(order.status === OrderStatus.Cancelled){
      throw new BadRequestError('cannot pay for cancelled order');
    }

    let stripeCharge = await stripe.paymentIntents.create({
      currency: 'inr',
      amount: order.price * 100,
      payment_method_types: ['card']
    })
   
    const payment = Payment.build({
      orderId,
      stripeId: stripeCharge.id
    })
    await payment.save();
    console.log(stripeCharge, payment);
    await new PaymentCompletePublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    })
    res.send({ success: true });
  }
)

export { router as createChargeRouter };
