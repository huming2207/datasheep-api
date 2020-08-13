import { UserDoc } from "./UserModel";
import { ProjectDoc } from "./ProjectModel";
import { EventDoc } from "./EventModel";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose";

export class ListDoc extends TimeStamps {
    @prop({ required: true })
    public title!: string;

    @prop()
    public color?: number;

    @prop()
    public description?: string;

    @prop({ required: true, ref: UserDoc })
    public owner!: UserDoc;

    @prop({ required: true, ref: ProjectDoc })
    public project!: ProjectDoc;

    @prop({ ref: EventDoc })
    public events?: EventDoc[];
}
