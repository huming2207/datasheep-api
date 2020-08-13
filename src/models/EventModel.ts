import { UserDoc } from "./UserModel";
import { FileDoc } from "./FileModel";
import { ListDoc } from "./ListModel";

import { prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class EventDoc extends TimeStamps {
    @prop({ required: true })
    public title!: string;

    @prop({ required: true })
    public content!: string;

    @prop()
    public color?: number;

    @prop()
    public due?: Date;

    @prop({ ref: UserDoc })
    public owner?: UserDoc;

    @prop({ ref: UserDoc })
    public assignedTo?: UserDoc[];

    @prop({ required: true, ref: ListDoc })
    public list!: ListDoc;

    @prop({ ref: FileDoc })
    public attachments?: FileDoc[];
}
