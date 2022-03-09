import mongoose from 'mongoose';

export interface PaymentAttrs{
  orderId: string;
  stripeId: string;
  version?: number;
}

interface PaymentDoc extends mongoose.Document{
  orderId: string;
  stripeId: string;
  version?: number;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc
}

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  stripeId: {
    type: String,
    required: true
  },
  version: {
    type: Number
  }
},{
  toJSON : {

    transform(doc, ret){
      ret.id = ret._id;
      delete ret._id
    }
  }
})
paymentSchema.set('versionKey', 'version');
paymentSchema.statics.build = (attrs: PaymentAttrs)=>{
  return new Payment({
    orderId: attrs.orderId,
    stripeId: attrs.stripeId
  })
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema)

export { Payment }