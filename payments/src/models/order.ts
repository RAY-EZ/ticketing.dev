import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus} from '@d-ticket/common'

// Attrs Having id-- Payments service has indirect access to OrderAttrs 
// Properties must be corresponding those in Original Orders Doc
interface OrderAttrs {
  id: string;
  price: number;
  status: OrderStatus;
  userId: string;
  version: number;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true
  }
},{
  toJSON: {

    transform(doc, ret){
      ret.id = ret._id;
      delete ret._id
    }
  }
})
orderSchema.set('versionKey', 'version');
orderSchema.statics.build = (attrs: OrderAttrs)=>{
  console.log('arttrs: ',attrs)
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status
  })
}
orderSchema.plugin(updateIfCurrentPlugin);
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };