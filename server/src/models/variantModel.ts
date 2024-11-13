import { Schema, model, Document } from 'mongoose';

interface IVariantGroup extends Document {
  name: string;
  products: string[];
  sellerId: Schema.Types.ObjectId;
}

const variantGroupSchema = new Schema<IVariantGroup>({
  name: { type: String, required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: 'Seller' },
});

const variantGroup = model<IVariantGroup>('VariantGroup', variantGroupSchema);

export default variantGroup;
