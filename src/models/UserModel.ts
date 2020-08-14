import { prop, getModelForClass, DocumentType } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class UserData extends TimeStamps {
    @prop({ required: true })
    public username!: string;

    @prop({ required: true })
    public password!: string;

    @prop({ required: true })
    public email!: string;
}

export type UserDoc = DocumentType<UserData>;
export const UserModel = getModelForClass(UserData, { schemaOptions: { timestamps: true } });
export default UserModel;
