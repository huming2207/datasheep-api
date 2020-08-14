import { UserDoc } from "./UserModel";
import { ListDoc } from "./ListModel";
import { prop, getModelForClass, DocumentType, Ref } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class Project extends TimeStamps {
    @prop({ required: true })
    public name!: string;

    @prop()
    public description?: string;

    @prop({ required: true, ref: "User" })
    public owner!: Ref<UserDoc>;

    @prop({ ref: "User" })
    public members?: Ref<UserDoc>[];

    @prop({ ref: "List" })
    public lists?: Ref<ListDoc>[];
}

export type ProjectDoc = DocumentType<Project>;
export const ProjectModel = getModelForClass(Project, { schemaOptions: { timestamps: true } });
export default ProjectModel;
