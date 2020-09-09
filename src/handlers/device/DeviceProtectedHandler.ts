import { FastifyRequest, FastifyInstance } from "fastify";
import { UnauthorisedError } from "../../common/Errors";
import { DeviceAuthModel } from "../../models/device/DeviceAuthModel";

const onProtectedRequest = async (req: FastifyRequest): Promise<void> => {
    const header = req.raw.headers.authorization;
    if (!header || !header.startsWith("Bearer")) {
        throw new UnauthorisedError("Invalid token provided");
    }

    const token = header.substring("Bearer".length).trim();
    const auth = await DeviceAuthModel.findOne({ authToken: token });
    if (!auth) throw new UnauthorisedError("Token expired");
    if (auth.expireAt.getTime() + 120 * 1000 < Date.now()) {
        throw new UnauthorisedError("Token expired");
    }

    const deviceId = auth.populated("device");
    if (!deviceId) {
        req.deviceId = auth.device; // Device is unpopulated
    } else {
        req.deviceId = deviceId;
    }
};

export default async function bootstrap(instance: FastifyInstance): Promise<void> {
    instance.addHook("onRequest", onProtectedRequest);
}
