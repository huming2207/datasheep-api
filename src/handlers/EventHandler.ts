import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { getUserFromReq } from "../common/UserFetcher";
import Event from "../models/EventModel";
import { UserDoc } from "../models/UserModel";
import { NotFoundError } from "../common/Errors";
import {
    GetOneEventSchema,
    CreateEventSchema,
    ModifyEventSchema,
    DeleteEventSchema,
} from "../schemas/requests/EventSchema";

const getOneEvent = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await getUserFromReq(req);
    const id = req.params.id;
    const event = await Event.findOne({ owner: user, id });

    if (!event) throw new NotFoundError("Event not found");

    reply.code(200).send({
        message: "OK",
        data: {
            event,
        },
    });
};

const createEvent = async (
    req: FastifyRequest<{ Body: { color?: number; content?: string; title: string } }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await getUserFromReq(req);
    const color = req.body.color || 0;
    const content = req.body.content || "";
    const title = req.body.title;
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

const modifyEvent = async (
    req: FastifyRequest<{
        Params: { id: string };
        Body: { title?: string; content?: string; color?: number };
    }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await getUserFromReq(req);
    const id = req.params["id"] as string;
    const event = await Event.findOne({ owner: user, id });
    if (!event) throw new NotFoundError("Event not found");

    await Event.updateOne(event, {
        title: req.body.title || event.title,
        content: req.body.content || event.content,
        color: req.body.color || event.color,
    });

    reply.code(200).send({
        message: "Event updated",
        data: {
            id: event.id,
        },
    });
};

const deleteEvent = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
): Promise<void> => {
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

export default async function bootstrap(instance: FastifyInstance): Promise<void> {
    instance.post("/event/:id", { schema: GetOneEventSchema }, getOneEvent);
    instance.post("/event", { schema: CreateEventSchema }, createEvent);
    instance.put("/event/:id", { schema: ModifyEventSchema }, modifyEvent);
    instance.delete("/event/:id", { schema: DeleteEventSchema }, deleteEvent);
}
