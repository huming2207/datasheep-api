import { Types } from "mongoose";
import { UserDoc, UserData } from "./UserModel";
import { prop, getModelForClass, DocumentType } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class FileData extends TimeStamps {
    @prop({ required: true })
    public name!: string;

    @prop({ required: true })
    public type!: string;

    @prop({ required: true })
    public size!: number;

    @prop({ required: true })
    public storeId!: Types.ObjectId;

    @prop({ required: true, ref: UserData })
    public owner!: UserDoc;
}

export type FileDoc = DocumentType<FileData>;
export const FileModel = getModelForClass(FileData, { schemaOptions: { timestamps: true } });
export default FileModel;
