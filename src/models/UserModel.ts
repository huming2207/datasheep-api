import { prop, getModelForClass, DocumentType } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

export class User extends Base<Types.ObjectId> {
    @prop({ required: true })
    public username!: string;

    @prop({ required: true })
    public password!: string;

    @prop({ required: true })
    public email!: string;
}

export type UserDoc = DocumentType<User>;
export const UserModel = getModelForClass(User, { schemaOptions: { timestamps: true } });
export default UserModel;
