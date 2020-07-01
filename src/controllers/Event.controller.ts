import { Controller, GET, POST, PUT, DELETE } from "fastify-decorators";
import { ServerRequest, ServerReply } from "fastify";
import BaseProtectedController from "./BaseProtected.controller";
import { getUserFromReq } from "../common/UserFetcher";
import Event from "../models/EventModel";
import { UserDoc } from "../models/UserModel";
import { NotFoundError } from "../common/Errors";

@Controller({ route: "/api/event" })
export default class EventController extends BaseProtectedController {
    @GET({ url: "/:id" })
    getOneEvent = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        const user = await getUserFromReq(req);
        const id = req.params["id"] as string;
        const event = await Event.findOne({ owner: user, id });

        if (!event) throw new NotFoundError("Event not found");

        reply.code(200).send({
            message: "OK",
            data: {
                event,
            },
        });
    };

    @POST({ url: "/" })
    createEvent = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        const user = await getUserFromReq(req);
        const color = req.body["color"] ? parseInt(req.body["color"]) : 0;
        const content = req.body["content"] as string;
        const title = req.body["title"] as string;
        const event = await Event.create<{
            owner: UserDoc;
            color: number;
            content: string;
            title: string;
        }>({
            owner: user,
            color,
            content,
            title,
        });

        reply.code(200).send({
            message: "Event created",
            data: {
                event,
            },
        });
    };

    @PUT({ url: "/:id" })
    modifyEvent = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        const user = await getUserFromReq(req);
        const id = req.params["id"] as string;
        const event = await Event.findOne({ owner: user, id });
        if (!event) throw new NotFoundError("Event not found");

        await Event.updateOne(event, {
            title: req.body["title"] || event.title,
            content: req.body["content"] || event.content,
            color: req.body["color"] ? parseInt(req.body["color"]) : event.color,
        });

        reply.code(200).send({
            message: "Event updated",
            data: {
                id: event.id,
            },
        });
    };

    @DELETE({ url: "/:id" })
    deleteEvent = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        const user = await getUserFromReq(req);
        const id = req.params["id"] as string;

        const event = await Event.findOne({ owner: user, id });
        if (!event) throw new NotFoundError("Event not found");

        await Event.deleteOne(event);
        reply.code(200).send({
            message: "Event updated",
            data: {
                id: event.id,
            },
        });
    };
}
