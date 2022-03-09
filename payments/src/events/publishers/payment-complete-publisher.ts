import { Publisher, Subjects, PaymentCompleteEvent  } from "@d-ticket/common";

export class PaymentCompletePublisher extends Publisher<PaymentCompleteEvent> {
  subject: Subjects.PaymentComplete = Subjects.PaymentComplete;
}