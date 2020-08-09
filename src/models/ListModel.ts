import { Document, Schema, model, Types } from "mongoose";
import { UserDoc } from "./UserModel";
import { ProjectDoc } from "./ProjectModel";
import { EventDoc } from "./EventModel";

export interface ListDoc extends Document {
    title: string;
    color: number;
    description: string;
    owner: UserDoc;
    project: ProjectDoc;
    events: EventDoc[];
    created: Date;
    updated: Date;
}

export const ListSchema = new Schema(
    {
        title: { type: String, unique: true, required: true },
        color: { type: Number },
        description: { type: String },
        owner: { type: Types.ObjectId, ref: "User" },
        project: { type: Types.ObjectId, ref: "Project" },
        events: [{ type: Types.ObjectId, ref: "Event" }],
    },
    { timestamps: { createdAt: "created", updatedAt: "updated" } },
);

export default model<ListDoc>("List", ListSchema);
