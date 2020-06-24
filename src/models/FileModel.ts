import { Document, Schema, model, Types } from "mongoose";
import { UserDoc } from "./UserModel";

export interface FileDoc extends Document {
    name: string;
    type: string;
    size: number;
    storeId: Types.ObjectId;
    owner: UserDoc;
    created: Date;
    updated: Date;
}

export const FileSchema = new Schema(
    {
        name: { type: String },
        type: { type: String },
        size: { type: Number },
        storeId: { type: Types.ObjectId },
        owner: { type: Types.ObjectId, ref: "User" },
        created: { type: Date },
        updated: { type: Date },
    },
    { timestamps: { createdAt: "created", updatedAt: "updated" } },
);

export default model<FileDoc>("File", FileSchema);
