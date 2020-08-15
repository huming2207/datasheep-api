import { User } from "./UserModel";
import { List } from "./ListModel";
import { prop, getModelForClass, DocumentType, Ref } from "@typegoose/typegoose";
import { BaseModel } from "./BaseModel";

export class Project extends BaseModel {
    @prop({ required: true })
    public name!: string;

    @prop()
    public description?: string;

    @prop({ required: true, ref: () => User })
    public owner!: Ref<User>;

    @prop({ ref: () => [User] })
    public members?: Ref<User>[];

    @prop({ ref: () => [List] })
    public lists?: Ref<List>[];
}

export type ProjectDoc = DocumentType<Project>;
export const ProjectModel = getModelForClass(Project, { schemaOptions: { timestamps: true } });
export default ProjectModel;
