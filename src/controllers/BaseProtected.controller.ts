import { Hook, Controller } from "fastify-decorators";
import { ServerRequest, ServerReply } from "fastify";

@Controller()
export default class BaseProtectedController {
    @Hook("onRequest")
    protected async onProtectedRequest(req: ServerRequest, reply: ServerReply): Promise<void> {
        try {
            await req.jwtVerify();
            const userId = (req.user as any)["id"];
            if (!userId) {
                reply.code(401).send({ message: "Invalid JWT token" });
                return;
            }
        } catch (err) {
            reply.code(401).send({
                message: "You are not logged in",
                data: err,
            });
        }
    }
}
