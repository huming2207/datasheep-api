import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { getUserFromReq } from "../common/UserFetcher";
import Event from "../models/EventModel";
import Kanban from "../models/KanbanModel";
import { UserDoc } from "../models/UserModel";
import { NotFoundError } from "../common/Errors";
import {
    GetAllKanbanSchema,
    GetOneKanbanSchema,
    CreateKanbanSchema,
    AddEventSchema,
    ModifyKanbanSchema,
    DeleteOneKanbanSchema,
} from "../schemas/requests/KanbanSchema";

const getAllKanbans = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
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

const getOneKanban = async (
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

const createKanban = async (
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

const addEvent = async (
    req: FastifyRequest<{ Params: { id: string }; Body: { event: string; idx: number } }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await getUserFromReq(req);
    const kanbanId = req.params.id;
    const eventId = req.body.event;

    // Check if this event exists...
    const event = await Event.findOne({ id: eventId, owner: user }).populate("kanban");
    if (!event) throw new NotFoundError("Event not found");

    // If event is valid (exist), continue to add
    const kanban = await Kanban.findOne({ id: kanbanId, owner: user });
    if (!kanban) throw new NotFoundError("Kanban not found");

    // Remove from original kanban (if exist)
    const origKanban = event.kanban;

    // If it's a new event (original kanban does not exist), just add it
    // Otherwise, perform a splice, remove from the old one and insert to the new one
    if (origKanban) {
        await Kanban.updateOne(origKanban, { $pull: { events: event } });
    }

    kanban.events.splice(req.body.idx, 0, event);
    await kanban.save();

    event.kanban = kanban;
    await event.save();

    reply.code(200).send({
        message: "Event added",
        data: {
            event,
            kanban,
        },
    });
};

const modifyKanban = async (
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

const deleteKanban = async (
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

export default async function bootstrap(instance: FastifyInstance): Promise<void> {
    instance.get("/kanban", { schema: GetAllKanbanSchema }, getAllKanbans);
    instance.get("/kanban/:id", { schema: GetOneKanbanSchema }, getOneKanban);
    instance.post("/kanban", { schema: CreateKanbanSchema }, createKanban);
    instance.post("/kanban/:id/add", { schema: AddEventSchema }, addEvent);
    instance.put("/kanban/:id", { schema: ModifyKanbanSchema }, modifyKanban);
    instance.delete("/kanban/:id", { schema: DeleteOneKanbanSchema }, deleteKanban);
}
