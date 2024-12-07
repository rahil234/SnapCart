import { Schema, model } from 'mongoose';
import { IOffer } from 'shared/types';

const offerSchema = new Schema<IOffer>(
  {
    title: { type: String, validate: /^[a-zA-Z0-9\s]*$/ },
    type: { type: String },
    discount: { type: Number },
    maxDiscount: { type: Number },
    startDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,

      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    limit: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);
const OfferModel = model<IOffer>('Offer', offerSchema);

export default OfferModel;
