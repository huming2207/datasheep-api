import { prop, getModelForClass, DocumentType, Ref } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { Device } from "./DeviceModel";
import { generateAuthToken } from "../../common/TokenGenerator";

export class DeviceAuth extends Base {
    @prop({ default: generateAuthToken(), index: true, unique: true })
    public authToken: string;

    @prop({ type: Date, default: Date.now, expires: 120 })
    public expireAt: Date;

    @prop({ ref: () => Device })
    public device: Ref<Device>;
}

export type DeviceAuthDoc = DocumentType<DeviceAuth>;
export const DeviceAuthModel = getModelForClass(DeviceAuth);
