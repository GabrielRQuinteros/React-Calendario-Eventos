import mongoose, { Schema, Document } from 'mongoose';

export interface IAccessToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  revoked: boolean;
}

const AccessTokenSchema = new Schema<IAccessToken>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false }
});

export const AccessTokenModel = mongoose.model<IAccessToken>('AccessToken', AccessTokenSchema);