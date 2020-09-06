import { BaseModel } from "../BaseModel";
import { prop, DocumentType, getModelForClass } from "@typegoose/typegoose";

export class Sku extends BaseModel {
    @prop({ required: true, index: true, unique: true })
    public name: string;
}

export type SkuDoc = DocumentType<Sku>;
export const SkuModel = getModelForClass(Sku, { schemaOptions: { timestamps: true } });
