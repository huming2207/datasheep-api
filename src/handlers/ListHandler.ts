import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import Event from "../models/EventModel";
import List from "../models/ListModel";
import User, { UserDoc } from "../models/UserModel";
import { NotFoundError } from "../common/Errors";
import {
    GetAllListSchema,
    GetOneListSchema,
    CreateListSchema,
    AddEventToListSchema,
    ModifyListSchema,
    DeleteOneListSchema,
} from "../schemas/requests/ListSchema";

const getAllLists = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = await User.fromReq(req);
    const lists = await List.find({ owner: user }).select(
        "_id title description owner project -__v -events", // Filter out events (or it will be a super long response...)
    );

    reply.code(200).send({
        message: "OK",
        data: {
            lists,
        },
    });
};

const getOneList = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await User.fromReq(req);
    const id = req.params.id;
    const list = await List.findOne({ owner: user, _id: id }).select(
        "_id title description owner project events -__v",
    );

    reply.code(200).send({
        message: "OK",
        data: {
            list,
        },
    });
};

const createList = async (
    req: FastifyRequest<{ Body: { color?: number; title: string } }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await User.fromReq(req);
    const color = req.body.color || 0;
    const title = req.body.title;
    const list = await List.create<{ title: string; color: number; owner: UserDoc }>({
        title,
        color,
        owner: user,
    });

    reply.code(200).send({
        message: "OK",
        data: {
            list,
        },
    });
};

const addList = async (
    req: FastifyRequest<{ Params: { id: string }; Body: { event: string; idx: number } }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await User.fromReq(req);
    const listId = req.params.id;
    const eventId = req.body.event;

    // Check if this event exists...
    const event = await Event.findOne({ id: eventId, owner: user }).populate("list");
    if (!event) throw new NotFoundError("Event not found");

    // If event is valid (exist), continue to add
    const list = await List.findOne({ id: listId, owner: user });
    if (!list) throw new NotFoundError("List not found");

    // If it's a new event (original list does not exist), just add it
    // Otherwise, perform a splice, remove from the old one and insert to the new one
    if (event.list) {
        await List.updateOne(event.list, { $pull: { events: event } });
    }

    if (list.events) {
        list.events.splice(req.body.idx, 0, event);
    } else {
        list.events = [];
        list.events.push(event);
    }

    await list.save();

    await Event.updateOne(event, { list });

    reply.code(200).send({
        message: "Event added",
        data: {
            event,
            list,
        },
    });
};

const modifyList = async (
    req: FastifyRequest<{
        Params: { id: string };
        Body: { title?: string; description?: string; color?: number };
    }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await User.fromReq(req);
    const id = req.params["id"] as string;

    const list = await List.findOne({ id, owner: user });
    if (!list) throw new NotFoundError("List not found");
    await List.updateOne(list, {
        title: req.body.title || list.title,
        description: req.body.description || list.description,
        color: req.body.color || list.color,
    });

    reply.code(200).send({
        message: "List modified",
        data: {
            id: list._id,
        },
    });
};

const deleteList = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await User.fromReq(req);
    const id = req.params.id;
    const list = await List.findOne({ id, owner: user });
    if (!list) throw new NotFoundError("List not found");
    await List.deleteOne({ id, owner: user });
    reply.code(200).send({
        message: "List deleted",
        data: {
            id: list._id,
        },
    });
};

export default async function bootstrap(instance: FastifyInstance): Promise<void> {
    instance.get("/list", { schema: GetAllListSchema }, getAllLists);
    instance.get("/list/:id", { schema: GetOneListSchema }, getOneList);
    instance.post("/list", { schema: CreateListSchema }, createList);
    instance.post("/list/:id/add", { schema: AddEventToListSchema }, addList);
    instance.put("/list/:id", { schema: ModifyListSchema }, modifyList);
    instance.delete("/list/:id", { schema: DeleteOneListSchema }, deleteList);
}
