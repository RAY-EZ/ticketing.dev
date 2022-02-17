import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { OrderStatus, ExprationCompleteEvent as ExpirationCompleteEvent} from "@d-ticket/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from 'mongoose'
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';

const setup = async ()=> {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'one-piece',
    price: 20
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asdfsdf',
    expiresAt: new Date(),
    ticket
  });

  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
}