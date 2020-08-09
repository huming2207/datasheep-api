import { Document, Schema, model, Types } from "mongoose";
import { UserDoc } from "./UserModel";
import { FileDoc } from "./FileModel";
import { ListDoc } from "./ListModel";

export interface EventDoc extends Document {
    title: string;
    content: string;
    color: number;
    due: Date;
    owner: UserDoc;
    assignedTo: UserDoc[];
    list: ListDoc;
    attachments: FileDoc[];
    created: Date;
    updated: Date;
}

export const EventSchema = new Schema(
    {
        title: { type: String, unique: true },
        content: { type: String },
        color: { type: Number },
        due: { type: Date },
        owner: { type: Types.ObjectId, ref: "User" },
        assignedTo: [{ type: Types.ObjectId, ref: "User" }],
        list: { type: Types.ObjectId, ref: "List" },
        attachments: [{ type: Types.ObjectId, ref: "File" }],
    },
    { timestamps: { createdAt: "created", updatedAt: "updated" } },
);

export default model<EventDoc>("Event", EventSchema);
