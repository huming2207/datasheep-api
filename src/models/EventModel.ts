import { UserDoc } from "./UserModel";
import { FileDoc } from "./FileModel";
import { ListDoc } from "./ListModel";

import { prop, getModelForClass, DocumentType, Ref } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class Event extends TimeStamps {
    @prop({ required: true })
    public title!: string;

    @prop({ required: true })
    public content!: string;

    @prop()
    public color?: number;

    @prop()
    public due?: Date;

    @prop({ ref: "User" })
    public owner?: Ref<UserDoc>;

    @prop({ ref: "User" })
    public assignedTo?: Ref<UserDoc>[];

    @prop({ required: true, ref: "User" })
    public list!: Ref<ListDoc>;

    @prop({ ref: "File" })
    public attachments?: Ref<FileDoc>[];
}

export type EventDoc = DocumentType<Event>;
export const EventModel = getModelForClass(Event, { schemaOptions: { timestamps: true } });
export default EventModel;
