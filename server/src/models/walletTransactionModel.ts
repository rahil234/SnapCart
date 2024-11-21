import { model, Schema, Document } from 'mongoose';

interface IWalletTransaction extends Document {
  userId: string;
  amount: number;
  description: string;
  date: Date;
  type: 'debit' | 'credit';
}

const walletSchama: Schema = new Schema({
  userId: Schema.Types.ObjectId,
  amount: Number,
  description: String,
  date: { type: Date, default: Date.now() },
  type: { enum: ['debit', 'credit'], type: String },
});

const walletModel = model<IWalletTransaction>('Wallet', walletSchama);

export default walletModel;
