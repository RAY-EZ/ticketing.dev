import { Subjects, Publisher, ExprationCompleteEvent as ExpirationCompleteEvent } from "@d-ticket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  subject: ExpirationCompleteEvent['subject']= Subjects.ExpirationComplete;
}