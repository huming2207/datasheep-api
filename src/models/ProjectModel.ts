import { Document, Schema, model, Types } from "mongoose";
import { UserDoc } from "./UserModel";
import { ListDoc } from "./ListModel";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose";

export class ProjectDoc extends TimeStamps {
    @prop({ required: true })
    public name!: string;

    @prop()
    public description?: string;

    @prop({ required: true, ref: UserDoc })
    public owner!: UserDoc;

    @prop({ ref: UserDoc })
    public members?: UserDoc[];

    @prop({ ref: ListDoc })
    public lists?: ListDoc[];
}
