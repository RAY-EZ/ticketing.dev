import { Subjects, Listener, ExprationCompleteEvent as ExpirationCompleteEvent, ExprationCompleteEvent, OrderStatus } from "@d-ticket/common";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../nats-wrapper";
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { QueueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName = QueueGroupName;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  async onMessage(data: ExprationCompleteEvent['data'], msg: Message){
    const order = await Order.findById(data.orderId);
    
    if(!order) {
      throw new Error('Order not found');
    }
    if(order.status === OrderStatus.Complete){
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    console.log(order);

    const publish = {
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.toString()
      }
    };
    console.log('publish', publish)
    new OrderCancelledPublisher(natsWrapper.client).publish(publish)

    msg.ack();
  }
}