import { Document, Schema, model, Types } from "mongoose";
import { UserDoc } from "./UserModel";
import { KanbanDoc } from "./KanbanModel";

export interface ProjectDoc extends Document {
    name: string;
    description: string;
    owner: UserDoc;
    members: UserDoc[];
    kanbans: KanbanDoc[];
    created: Date;
    updated: Date;
}

export const ProjectSchema = new Schema(
    {
        name: { type: String, unique: true },
        description: { type: String },
        owner: { type: Types.ObjectId, ref: "User" },
        members: [{ type: Types.ObjectId, ref: "User" }],
        kanbans: [{ type: Types.ObjectId, ref: "Kanban" }],
    },
    { timestamps: { createdAt: "created", updatedAt: "updated" } },
);

export default model<ProjectDoc>("Project", ProjectSchema);
