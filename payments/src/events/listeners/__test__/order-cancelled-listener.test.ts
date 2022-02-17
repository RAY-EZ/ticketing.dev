import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener'
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from '@d-ticket/common';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';

const setup = async ()=>{
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'one-piece',
    price: 30,
    userId: new mongoose.Types.ObjectId().toHexString()
  });
  ticket.orderId = new mongoose.Types.ObjectId().toHexString();

  await ticket.save();

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 15 * 60);

  const data: OrderCancelledEvent['data']= {
    id: ticket.orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener,ticket, data, msg}
}
it('listenes and cancels the ticket', async ()=>{
  const { listener, data, ticket, msg} = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
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

  expect(ticketUpdatedData.orderId).toBeUndefined();
})