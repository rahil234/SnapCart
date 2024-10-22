import { Schema, model, Document } from 'mongoose';

interface IBanner extends Document {
  image: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    image: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const bannerModel = model<IBanner>('Banner', bannerSchema);

export default bannerModel;
