import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { UserModel } from "../models/UserModel";
import { SkuModel } from "../models/device/SkuModel";
import { DeviceModel } from "../models/device/DeviceModel";
import { BadRequestError, InternalError } from "../common/Errors";

export const registerDevice = async (
    req: FastifyRequest<{ Body: { chipId: string; firmware: string; sku: string } }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await UserModel.fromReq(req);

    const currDev = await DeviceModel.findOne({ chipId: req.body.chipId });
    if (!currDev) throw new BadRequestError(`Device with chip ID ${req.body.chipId}`);

    let sku = await SkuModel.findOne({ name: req.body.sku });
    if (!sku) sku = await SkuModel.create({ name: req.body.sku });

    const device = await DeviceModel.create<{
        chipId: string;
        sku: string;
        firmware: string;
        owner: string;
    }>({
        chipId: req.body.chipId,
        sku: sku._id,
        owner: user._id.toHexString(),
        firmware: req.body.firmware,
    });

    reply.code(200).send({
        message: "Device created",
        data: {
            id: device.id,
        },
    });
};

export default async function bootstrap(instance: FastifyInstance): Promise<void> {
}
