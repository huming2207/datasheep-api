import { User } from "../UserModel";
import { prop, getModelForClass, DocumentType, Ref } from "@typegoose/typegoose";
import { BaseModel } from "../BaseModel";
import { DeviceAuth } from "./DeviceAuthModel";
import { Sku } from "./SkuModel";

export class Device extends BaseModel {
    @prop()
    public name?: string;

    @prop({ required: true, index: true })
    public chipId: string;

    @prop()
    public devToken?: string;

    @prop({ ref: () => DeviceAuth })
    public authToken?: Ref<DeviceAuth>;

    @prop({ ref: () => User })
    public owner?: Ref<User>;

    @prop({ required: true, ref: () => Sku })
    public sku: Ref<Sku>;

    @prop({ required: true })
    public firmware: string;
}

export type DeviceDoc = DocumentType<Device>;
export const DeviceModel = getModelForClass(Device, { schemaOptions: { timestamps: true } });
