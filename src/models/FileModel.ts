import { Types } from "mongoose";
import { User } from "./UserModel";
import { prop, getModelForClass, DocumentType, Ref } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class File extends TimeStamps {
    @prop({ required: true })
    public name!: string;

    @prop({ required: true })
    public type!: string;

    @prop({ required: true })
    public size!: number;

    @prop({ required: true })
    public storeId!: Types.ObjectId;

    @prop({ required: true, ref: () => User })
    public owner!: Ref<User>;
}

export type FileDoc = DocumentType<File>;
export const FileModel = getModelForClass(File, { schemaOptions: { timestamps: true } });
export default FileModel;
