import { Document, Schema, model, Types } from 'mongoose';
import { UserDoc } from './UserModel';

export interface ProjectDoc extends Document {
    name: string;
    description: string;
    owner: UserDoc;
    members: UserDoc[];
}

export const ProjectSchema = new Schema({
    name: { type: String, unique: true },
    description: { type: String },
    owner: { type: Types.ObjectId, ref: 'User' },
    members: [{ type: Types.ObjectId, ref: 'User' }],
});

export default model<ProjectDoc>('Project', ProjectSchema);
