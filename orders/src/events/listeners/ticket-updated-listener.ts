import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent} from '@d-ticket/common';
import { Ticket } from '../../models/ticket';
import { QueueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener< TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

  queueGroupName = QueueGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], message: Message){
    const ticket = await Ticket.findByIdV(data);

    if(!ticket) throw new Error('ticket not found');

    const { title, price, orderId } = data
    console.log(orderId)
    ticket.set({ title, price, orderId})
    await ticket.save();

    // ticket.update doesn't not trigget middlewares as updateIfCurrent works on pre-save middleware to catch 
    // and which updates to reject
    // even better --- `Pre and post save() hooks are not executed on update(), findOneAndUpdate(), etc.`
    
    // await ticket.update({ title, price });
    message.ack();
  }
}