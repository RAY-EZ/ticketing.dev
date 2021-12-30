import  request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket doesn\'t exist', async ()=>{
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId})
    .expect(404);
})

it('returns an error if the ticket is already reserved', async ()=>{
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'one-piece',
    price: 30
  });
  await ticket.save();
  // console.log(ticket);
  const order = Order.build({
    ticket,
    userId: 'asdfsadfasljls',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticket.id
    })
    .expect(400)
});

it('reserves a ticket', async ()=>{
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'one-piece',
    price: 20
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticket.id
    })
    .expect(201)
});

it('emits event order created' ,async ()=> {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'singeki no kyojin',
    price: 20
  });

  await ticket.save();

  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({
    ticketId: ticket.id
  })
  .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})