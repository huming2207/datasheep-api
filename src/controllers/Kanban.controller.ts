import { Controller, GET, POST, PUT, DELETE } from "fastify-decorators";
import { FastifyRequest, FastifyReply } from "fastify";
import { getUserFromReq } from "../common/UserFetcher";
import Event from "../models/EventModel";
import Kanban from "../models/KanbanModel";
import { UserDoc } from "../models/UserModel";
import { NotFoundError } from "../common/Errors";
import BaseProtectedController from "./BaseProtected.controller";

@Controller({ route: "/api/kanban" })
export default class KanbanController extends BaseProtectedController {
    @GET({ url: "/" })
    getAllKanbans = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
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

    @GET({ url: "/:id" })
    getOneKanban = async (
        req: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ): Promise<void> => {
        const user = await getUserFromReq(req);
        const id = req.params.id;
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
    createKanban = async (
        req: FastifyRequest<{ Body: { color?: number; title: string } }>,
        reply: FastifyReply,
    ): Promise<void> => {
        const user = await getUserFromReq(req);
        const color = req.body.color || 0;
        const title = req.body.title;
        const kanban = await Kanban.create<{ title: string; color: number; owner: UserDoc }>({
            title,
            color,
            owner: user,
        });

        reply.code(200).send({
            message: "OK",
            data: {
                kanban,
            },
        });
    };

    @POST({ url: "/:id/event" })
    addEvent = async (
        req: FastifyRequest<{ Params: { id: string }; Body: { event: string } }>,
        reply: FastifyReply,
    ): Promise<void> => {
        const user = await getUserFromReq(req);
        const id = req.params.id;
        const eventId = req.body.event;

        // Check if this event exists...
        const event = await Event.findOne({ id: eventId, owner: user });
        if (!event) throw new NotFoundError("Event not found");

        // If event is valid (exist), continue to add
        const kanban = await Kanban.findOne({ id, owner: user });
        if (!kanban) throw new NotFoundError("Kanban not found");

        await Kanban.updateOne(kanban, { $push: { events: event } });
        reply.code(200).send({
            message: "Event added",
            data: {
                event,
                kanban,
            },
        });
    };

    @PUT({ url: "/:id" })
    modifyKanban = async (
        req: FastifyRequest<{
            Params: { id: string };
            Body: { title?: string; description?: string; color?: number };
        }>,
        reply: FastifyReply,
    ): Promise<void> => {
        const user = await getUserFromReq(req);
        const id = req.params["id"] as string;

        const kanban = await Kanban.findOne({ id, owner: user });
        if (!kanban) throw new NotFoundError("Kanban not found");
        await Kanban.updateOne(kanban, {
            title: req.body.title || kanban.title,
            description: req.body.description || kanban.description,
            color: req.body.color || kanban.color,
        });

        reply.code(200).send({
            message: "Kanban modified",
            data: {
                id: kanban.id,
            },
        });
    };

    @DELETE({ url: "/:id" })
    deleteKanban = async (
        req: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ): Promise<void> => {
        const user = await getUserFromReq(req);
        const id = req.params.id;
        const kanban = await Kanban.findOne({ id, owner: user });
        if (!kanban) throw new NotFoundError("Kanban not found");
        await Kanban.deleteOne({ id, owner: user });
        reply.code(200).send({
            message: "Kanban deleted",
            data: {
                id: kanban.id,
            },
        });
    };
}
