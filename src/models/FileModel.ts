import { Types } from "mongoose";
import { UserDoc } from "./UserModel";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop, getModelForClass } from "@typegoose/typegoose";

export class FileDoc extends TimeStamps {
    @prop({ required: true })
    public name!: string;

    @prop({ required: true })
    public type!: string;

    @prop({ required: true })
    public size!: number;

    @prop({ required: true })
    public storeId!: Types.ObjectId;

    @prop({ required: true, ref: UserDoc })
    public owner!: UserDoc;
}

export const FileModel = getModelForClass(FileDoc);
