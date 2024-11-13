import { model, Schema, Document } from 'mongoose';

interface IWalletTransaction extends Document {
  userId: string;
  amount: number;
  type: 'debit' | 'credit';
}

const walletSchama: Schema = new Schema({
  userId: Schema.Types.ObjectId,
  amount: Number,
  type: { enum: ['debit', 'credit'], type: String },
});

const walletModel = model<IWalletTransaction>('Wallet', walletSchama);

export default walletModel;
