import { UserDoc, UserData } from "./UserModel";
import { FileDoc, FileData } from "./FileModel";
import { ListDoc } from "./ListModel";

import { prop, getModelForClass, DocumentType } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class EventData extends TimeStamps {
    @prop({ required: true })
    public title!: string;

    @prop({ required: true })
    public content!: string;

    @prop()
    public color?: number;

    @prop()
    public due?: Date;

    @prop({ ref: UserData })
    public owner?: UserDoc;

    @prop({ ref: UserData })
    public assignedTo?: UserDoc[];

    @prop({ required: true, ref: UserData })
    public list!: ListDoc;

    @prop({ ref: FileData })
    public attachments?: FileDoc[];
}

export type EventDoc = DocumentType<EventData>;
export const EventModel = getModelForClass(EventData, { schemaOptions: { timestamps: true } });
export default EventModel;
