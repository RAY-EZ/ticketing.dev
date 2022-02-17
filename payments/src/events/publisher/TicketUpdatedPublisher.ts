import { Publisher, Subjects, TicketUpdatedEvent } from "@d-ticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}