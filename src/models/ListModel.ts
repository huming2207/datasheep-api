import { User } from "./UserModel";
import { Project } from "./ProjectModel";
import { Event } from "./EventModel";
import { prop, getModelForClass, DocumentType, Ref } from "@typegoose/typegoose";
import { BaseModel } from "./BaseModel";
import { Types } from "mongoose";

export class List extends BaseModel {
    @prop({ required: true })
    public title: string;

    @prop()
    public color?: number;

    @prop()
    public description?: string;

    @prop({ required: true, ref: () => User })
    public owner: Ref<User>;

    @prop({ required: true, ref: () => Project })
    public project: Ref<Project, Types.ObjectId>;

    @prop({ ref: () => [Event] })
    public events?: Ref<Event>[];
}

export type ListDoc = DocumentType<List>;
export const ListModel = getModelForClass(List, { schemaOptions: { timestamps: true } });
