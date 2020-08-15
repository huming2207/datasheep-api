import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";
import { prop } from "@typegoose/typegoose";

export class BaseModel extends TimeStamps {
    @prop({ type: Types.ObjectId })
    public _id!: Types.ObjectId;

    @prop({ type: Number })
    __v?: number;

    @prop({ type: String })
    __t?: string | number;
}
