import { Publisher, OrderCreatedEvent, Subjects } from "@d-ticket/common";

export class OrderCreatedPublisher extends Publisher< OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}