import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener'
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@d-ticket/common';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';

const setup = async ()=>{
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'one-piece',
    price: 30,
    userId: new mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 15 * 60);

  const data: OrderCreatedEvent['data']= {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    expiresAt: expiration.toISOString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    ticket : {
      id: ticket.id,
      price: ticket.price
    }
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener,ticket, data, msg}
}
it('listenes and updates ticket', async ()=>{
  const { listener, data, ticket, msg} = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toBeDefined();
  expect(updatedTicket!.orderId?.toString()).toEqual(data.id);
});

it('acks the event',async ()=>{
  const { listener, data,ticket, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalled();
});

it('publishes ticket updated event', async ()=>{
  const { listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[2][1]
    );
    
    // @ts-ignore
    // console.log(data, natsWrapper.client.publish!.mock.calls)
  expect(data.id).toEqual(ticketUpdatedData.orderId)
})