import { Document, Schema, model, Types } from "mongoose";
import { UserDoc } from "./UserModel";
import { ProjectDoc } from "./ProjectModel";

export interface EventDoc extends Document {
    title: string;
    content: string;
    color: number;
    owner: UserDoc;
    assignedTo: UserDoc[];
    project: ProjectDoc;
}

export const EventSchema = new Schema({
    title: { type: String, unique: true },
    content: { type: String },
    color: { type: Number },
    owner: { type: Types.ObjectId, ref: "User" },
    assignedTo: [{ type: Types.ObjectId, ref: "User" }],
    project: { type: Types.ObjectId, ref: "Project" },
});

export default model<EventDoc>("Event", EventSchema);
