import { Listener, OrderCancelledEvent, Subjects } from "@d-ticket/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/TicketUpdatedPublisher";
import { QueueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: OrderCancelledEvent['subject'] = Subjects.OrderCancelled;

  queueGroupName= QueueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message){
    // finding the ticket with id
    const ticket = await Ticket.findById(data.ticket.id);

    if(!ticket) {
      throw new Error('Ticket not found');
    }
    // making chnages to orderId property of of the ticket
    ticket.set({orderId: undefined})
    // saving the ticket 
    await ticket.save();
    // acknowledging the message
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      version: ticket.version,
      userId: ticket.userId,
      price: ticket.price,
    })
    msg.ack();
  }
} 