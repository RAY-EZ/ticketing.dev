import request from "supertest";
import { app } from '../../app';
import mongoose from "mongoose";
import { OrderStatus } from "@d-ticket/common";
import { Order } from '../../models/order'

jest.mock('../../stripe');

it('returns 204 with valid input', async ()=>{
  const userId = new mongoose.Types.ObjectId();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toString(),
    price: 20,
    status: OrderStatus.Created,
    userId: userId.toString(),
    version: 0
  })
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_in',
      orderId: order.id
    })
    .expect(503)
   
})