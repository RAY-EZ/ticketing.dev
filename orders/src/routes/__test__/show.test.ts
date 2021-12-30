import  request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'

it('fetches the order detail', async ()=>{
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'one-piece',
    price: 20
  })
  await ticket.save();
  const user = global.signin();
  const {body: order} = await request(app)
    .post(`/api/orders`)
    .set('Cookie', user)
    .send({
      ticketId: ticket.id
    })
    .expect(201)

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send({})
    .expect(200)
})

it('returns error if one user tries to fetch other users order', async ()=>{
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'one-piece',
    price: 20
  })
  await ticket.save();
  const {body: order} = await request(app)
    .post(`/api/orders`)
    .set('Cookie', global.signin())
    .send({
      ticketId: ticket.id
    })
    .expect(201)

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send({})
    .expect(401)
})