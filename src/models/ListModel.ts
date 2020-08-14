import { UserDoc } from "./UserModel";
import { ProjectDoc } from "./ProjectModel";
import { EventDoc } from "./EventModel";
import { prop, getModelForClass, DocumentType, Ref } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class List extends TimeStamps {
    @prop({ required: true })
    public title!: string;

    @prop()
    public color?: number;

    @prop()
    public description?: string;

    @prop({ required: true, ref: "User" })
    public owner!: Ref<UserDoc>;

    @prop({ required: true, ref: "Project" })
    public project!: Ref<ProjectDoc>;

    @prop({ ref: "Event" })
    public events?: Ref<EventDoc>[];
}

export type ListDoc = DocumentType<List>;
export const ListModel = getModelForClass(List, { schemaOptions: { timestamps: true } });
export default ListModel;
