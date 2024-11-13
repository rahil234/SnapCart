import { Schema, model, Document } from 'mongoose';

interface IOffer extends Document {
  title: string;
  description: string;
  discount: number;
  minPrice: number;
  startDate: Date;
  endDate: Date;
  products: string[];
  validUntil: Date;
  status: string;
}

const offerSchema = new Schema<IOffer>(
  {
    title: { type: String },
    discount: { type: Number },
    minPrice: { type: Number },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  {
    timestamps: true,
  }
);

const Offer = model<IOffer>('Offer', offerSchema);

export default Offer;
