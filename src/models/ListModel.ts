import { User } from "./UserModel";
import { Project } from "./ProjectModel";
import { EventDoc, Event } from "./EventModel";
import { prop, getModelForClass, DocumentType, Ref } from "@typegoose/typegoose";
import { BaseModel } from "./BaseModel";

export class List extends BaseModel {
    @prop({ required: true })
    public title!: string;

    @prop()
    public color?: number;

    @prop()
    public description?: string;

    @prop({ required: true, ref: () => User })
    public owner!: Ref<User>;

    @prop({ required: true, ref: () => Project })
    public project!: Ref<Project>;

    @prop({ ref: () => [Event] })
    public events?: Ref<EventDoc>[];
}

export type ListDoc = DocumentType<List>;
export const ListModel = getModelForClass(List, { schemaOptions: { timestamps: true } });
export default ListModel;
