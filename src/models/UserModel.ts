import { Document, Schema, model } from 'mongoose';

export interface UserDoc extends Document {
    username: string;
    password: string;
    email: string;
}

export const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String },
    email: { type: String, unique: true },
});

export default model<UserDoc>('User', UserSchema);
