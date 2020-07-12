import { Document, Schema, model, Types } from "mongoose";
import { UserDoc } from "./UserModel";
import { FileDoc } from "./FileModel";
import { KanbanDoc } from "./KanbanModel";

export interface EventDoc extends Document {
    title: string;
    content: string;
    color: number;
    owner: UserDoc;
    assignedTo: UserDoc[];
    kanban: KanbanDoc;
    attachments: FileDoc[];
    created: Date;
    updated: Date;
}

export const EventSchema = new Schema(
    {
        title: { type: String, unique: true },
        content: { type: String },
        color: { type: Number },
        owner: { type: Types.ObjectId, ref: "User" },
        assignedTo: [{ type: Types.ObjectId, ref: "User" }],
        kanban: { type: Types.ObjectId, ref: "Kanban" },
        attachments: [{ type: Types.ObjectId, ref: "File" }],
    },
    { timestamps: { createdAt: "created", updatedAt: "updated" } },
);

export default model<EventDoc>("Event", EventSchema);
