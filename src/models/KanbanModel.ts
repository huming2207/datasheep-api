import { Document, Schema, model, Types } from "mongoose";
import { UserDoc } from "./UserModel";
import { ProjectDoc } from "./ProjectModel";
import { EventDoc } from "./EventModel";

export interface KanbanDoc extends Document {
    title: string;
    description: string;
    createdBy: UserDoc;
    project: ProjectDoc;
    events: EventDoc[];
}

export const KanbanSchema = new Schema({
    title: { type: String, unique: true },
    description: { type: String },
    createdBy: { type: Types.ObjectId, ref: "User" },
    project: { type: Types.ObjectId, ref: "Project" },
    events: [{ type: Types.ObjectId, ref: "Event" }],
});

export default model<KanbanDoc>("Kanban", KanbanSchema);
