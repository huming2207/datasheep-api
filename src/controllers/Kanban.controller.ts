import { Controller, GET, POST, PUT, DELETE } from "fastify-decorators";
import { ServerRequest, ServerReply } from "fastify";
import { getUserFromReq } from "../common/UserFetcher";
import Kanban, { KanbanDoc } from "../models/KanbanModel";

@Controller({ route: "/api/kanban" })
export default class KanbanController {
    @GET({ url: "/" })
    getAllKanbans = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        const user = await getUserFromReq(req);
        const kanbans = await Kanban.find({ owner: user }).select(
            "_id title description owner project -__v -events", // Filter out events (or it will be a super long response...)
        );

        reply.code(200).send({
            message: "OK",
            data: {
                kanbans,
            },
        });
    };

    @GET({ url: "/:kanbanId" })
    getOneKanban = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        const user = await getUserFromReq(req);
        const id = req.params["kanbanId"] as string;
        const kanban = await Kanban.findOne({ owner: user, _id: id }).select(
            "_id title description owner project events -__v",
        );

        reply.code(200).send({
            message: "OK",
            data: {
                kanban,
            },
        });
    };

    @POST({ url: "/" })
    createKanban = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        const user = await getUserFromReq(req);
    };

    @PUT({ url: "/:kanbanId" })
    modifyKanban = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        const user = await getUserFromReq(req);
    };

    @DELETE({ url: "/:kanbanId" })
    deleteKanban = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        const user = await getUserFromReq(req);
    };
}
