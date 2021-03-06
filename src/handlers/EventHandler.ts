import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { EventModel } from "../models/EventModel";
import { UserModel } from "../models/UserModel";
import { NotFoundError } from "../common/Errors";
import {
    GetOneEventSchema,
    CreateEventSchema,
    ModifyEventSchema,
    DeleteEventSchema,
    MoveEventSchema,
} from "../schemas/requests/EventSchema";
import { ListModel } from "../models/ListModel";

const getOneEvent = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await UserModel.fromReq(req);
    const id = req.params.id;
    const event = await EventModel.findOne({ owner: user, id });

    if (!event) throw new NotFoundError("Event not found");

    reply.code(200).send({
        message: "OK",
        data: {
            event,
        },
    });
};

const createEvent = async (
    req: FastifyRequest<{
        Body: { color?: number; content?: string; title: string; list: string };
    }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await UserModel.fromReq(req);
    const color = req.body.color || 0;
    const content = req.body.content || "";
    const title = req.body.title;

    const list = await ListModel.findById(req.body.list);
    if (!list) throw new NotFoundError(`List ${req.body.list} not found!`);

    const event = await EventModel.create({
        owner: user,
        color,
        content,
        title,
        list: list._id,
    });

    await ListModel.updateOne(list, { $push: { events: event } });

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
    const user = await UserModel.fromReq(req);
    const id = req.params.id;
    const event = await EventModel.findOne({ owner: user, id });
    if (!event) throw new NotFoundError("Event not found");

    await EventModel.updateOne(event, {
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
    const user = await UserModel.fromReq(req);
    const id = req.params.id;

    const event = await EventModel.findOne({ owner: user, id });
    if (!event) throw new NotFoundError("Event not found");

    await EventModel.deleteOne(event);
    reply.code(200).send({
        message: "Event updated",
        data: {
            id: event.id,
        },
    });
};

const moveEvent = async (
    req: FastifyRequest<{
        Params: { id: string };
        Body: { srcList: string; dstList: string; idx: number };
    }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await UserModel.fromReq(req);
    const eventId = req.params.id;
    const srcListId = req.body.srcList;
    const dstListId = req.body.dstList;

    const srcList = await ListModel.findOne({ _id: srcListId, owner: user });
    if (!srcList) throw new NotFoundError(`Source list ${srcListId} not found`);

    const event = await EventModel.findOne({ _id: eventId, owner: user, list: srcList });
    if (!event) throw new NotFoundError(`Event ${eventId} not found`);

    // Remove event from its old place
    await ListModel.updateOne(srcList, { $pull: { events: event } });

    // Adds it to the new place
    const dstList = await ListModel.findOne({ _id: dstListId, owner: user }).populate("events");
    if (!dstList) throw new NotFoundError(`Destination list ${dstListId} not found`);
    if (!dstList.events) dstList.events = [];

    dstList.events.splice(req.body.idx, 0, event);
    await dstList.save();

    if (srcListId !== dstListId) await EventModel.updateOne(event, { list: dstList });

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
    instance.put("/event/:id/move", { schema: MoveEventSchema }, moveEvent);
    instance.delete("/event/:id", { schema: DeleteEventSchema }, deleteEvent);
}
