import { UserDoc, UserData } from "./UserModel";
import { ListDoc, ListData } from "./ListModel";
import { prop, getModelForClass, DocumentType } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class ProjectData extends TimeStamps {
    @prop({ required: true })
    public name!: string;

    @prop()
    public description?: string;

    @prop({ required: true, ref: UserData })
    public owner!: UserDoc;

    @prop({ ref: UserData })
    public members?: UserDoc[];

    @prop({ ref: ListData })
    public lists?: ListDoc[];
}

export type ProjectDoc = DocumentType<ProjectData>;
export const ProjectModel = getModelForClass(ProjectData, { schemaOptions: { timestamps: true } });
export default ProjectModel;
