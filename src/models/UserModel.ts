import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop, getModelForClass } from "@typegoose/typegoose";

export class UserDoc extends TimeStamps {
    @prop({ required: true })
    public username!: string;

    @prop({ required: true })
    public password!: string;

    @prop({ required: true })
    public email!: string;
}

export const UserModel = getModelForClass(UserDoc);
