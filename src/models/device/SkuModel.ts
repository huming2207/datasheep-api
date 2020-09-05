import { BaseModel } from "../BaseModel";
import { prop, DocumentType, getModelForClass } from "@typegoose/typegoose";

export class Sku extends BaseModel {
    @prop({ required: true })
    public name: string;

    @prop({ required: true })
    public partNum: string;
}

export type SkuDoc = DocumentType<Sku>;
export const SkuModel = getModelForClass(Sku, { schemaOptions: { timestamps: true } });
