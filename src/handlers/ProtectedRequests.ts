import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import EventHandler from "./EventHandler";
import KanbanHandler from "./KanbanHandler";
import ProjectHandler from "./ProjectHandler";

const onProtectedRequest = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
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
};

export default function bootstrap(instance: FastifyInstance): void {
    instance.addHook("onRequest", onProtectedRequest);
    instance.register(EventHandler);
    instance.register(ProjectHandler);
    instance.register(KanbanHandler);
}
