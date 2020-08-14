import { UserDoc, UserData } from "./UserModel";
import { ProjectDoc, ProjectData } from "./ProjectModel";
import { EventDoc, EventData } from "./EventModel";
import { prop, getModelForClass, DocumentType } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class ListData extends TimeStamps {
    @prop({ required: true })
    public title!: string;

    @prop()
    public color?: number;

    @prop()
    public description?: string;

    @prop({ required: true, ref: UserData })
    public owner!: UserDoc;

    @prop({ required: true, ref: ProjectData })
    public project!: ProjectDoc;

    @prop({ ref: EventData })
    public events?: EventDoc[];
}

export type ListDoc = DocumentType<ListData>;
export const ListModel = getModelForClass(ListData, { schemaOptions: { timestamps: true } });
export default ListModel;
