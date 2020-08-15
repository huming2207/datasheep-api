import { User } from "./UserModel";
import { File } from "./FileModel";
import { List } from "./ListModel";
import { prop, getModelForClass, DocumentType, Ref } from "@typegoose/typegoose";
import { BaseModel } from "./BaseModel";

export class Event extends BaseModel {
    @prop({ required: true })
    public title!: string;

    @prop({ required: true })
    public content!: string;

    @prop()
    public color?: number;

    @prop()
    public due?: Date;

    @prop({ ref: () => User })
    public owner?: Ref<User>;

    @prop({ ref: () => [User] })
    public assignedTo?: Ref<User>[];

    @prop({ required: true, ref: () => List })
    public list!: Ref<List>;

    @prop({ ref: () => [File] })
    public attachments?: Ref<File>[];
}

export type EventDoc = DocumentType<Event>;
export const EventModel = getModelForClass(Event, { schemaOptions: { timestamps: true } });
export default EventModel;
