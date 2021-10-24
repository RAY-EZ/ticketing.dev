import { Publisher, Subjects, TicketCreatedEvent } from "@d-ticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}