import { TicketUpdatedEvent } from "@d-ticket/common";
import { Message} from 'node-nats-streaming';
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from 'mongoose';
import { Ticket } from "../../../models/ticket";

const setup = async ()=>{
  const listener =new TicketUpdatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'one-piece',
    price: 30,
  })
  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'singeki no kyojin',
    price: 30,
    userId: '1234',
    version: 1
  }
 // @ts-ignore
  const msg: Message= {
    ack: jest.fn()
  }
  return { listener, data, msg}
}

it('finds, updates, and saves a ticket', async ()=>{
  const { listener, msg, data} = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket!.version).toEqual(1);
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
})

it('acks the message' , async ()=>{
  const { listener, msg, data} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalled();
})