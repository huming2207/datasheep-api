import { prop, getModelForClass, DocumentType } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";
import { FastifyRequest } from "fastify";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { UnauthorisedError } from "../common/Errors";

export class User extends Base<Types.ObjectId> {
    @prop({ required: true, unique: true })
    public username!: string;

    @prop({ required: true, select: false })
    public password!: string;

    @prop({ required: true, unique: true })
    public email!: string;

    public static async fromReq(this: ModelType<User>, req: FastifyRequest): Promise<UserDoc> {
        const userId = (req.user as any)["id"];
        const user = await this.findById(userId);
        if (!user) throw new UnauthorisedError("Cannot load current user");
        return user;
    }
}

export type UserDoc = DocumentType<User>;
export const UserModel = getModelForClass(User, { schemaOptions: { timestamps: true } });
