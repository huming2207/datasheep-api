import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import List from "../models/ListModel";
import User, { UserDoc } from "../models/UserModel";
import { NotFoundError } from "../common/Errors";
import {
    GetAllListSchema,
    GetOneListSchema,
    CreateListSchema,
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
    instance.put("/list/:id", { schema: ModifyListSchema }, modifyList);
    instance.delete("/list/:id", { schema: DeleteOneListSchema }, deleteList);
}
