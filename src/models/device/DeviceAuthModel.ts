import { prop, getModelForClass, DocumentType, Ref } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { Device } from "./DeviceModel";

export class DeviceAuth extends Base {
    @prop()
    public authToken: string;

    @prop({ type: Date, default: Date.now, expires: 120 })
    public expireAt: Date;

    @prop({ ref: () => Device })
    public device: Ref<Device>;
}

export type DeviceAuthDoc = DocumentType<DeviceAuth>;
export const DeviceAuthModel = getModelForClass(DeviceAuth);
