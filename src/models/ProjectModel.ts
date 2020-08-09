import { Document, Schema, model, Types } from "mongoose";
import { UserDoc } from "./UserModel";
import { ListDoc } from "./ListModel";

export interface ProjectDoc extends Document {
    name: string;
    description: string;
    owner: UserDoc;
    members: UserDoc[];
    lists: ListDoc[];
    created: Date;
    updated: Date;
}

export const ProjectSchema = new Schema(
    {
        name: { type: String, unique: true },
        description: { type: String },
        owner: { type: Types.ObjectId, ref: "User" },
        members: [{ type: Types.ObjectId, ref: "User" }],
        lists: [{ type: Types.ObjectId, ref: "List" }],
    },
    { timestamps: { createdAt: "created", updatedAt: "updated" } },
);

export default model<ProjectDoc>("Project", ProjectSchema);
