import { UserDoc } from "../models/UserModel";
import Project from "../models/ProjectModel";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import {
    CreateProjectSchema,
    ModifyProjectSchema,
    GetOneProjectSchema,
    GetAllProjectsSchema,
    DeleteOneProjectSchema,
    GetRelatedKanbansSchema,
} from "../schemas/requests/ProjectSchema";
import { getUserFromReq } from "../common/UserFetcher";
import { NotFoundError } from "../common/Errors";

const createNewProject = async (
    req: FastifyRequest<{ Body: { name: string; description: string } }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await getUserFromReq(req);
    const name = req.body.name;
    const description = req.body.description;

    const project = await Project.create<{ name: string; description: string; owner: UserDoc }>({
        name,
        description,
        owner: user,
    });

    reply.code(200).send({
        message: "Project created",
        data: {
            name,
            description,
            owner: user._id,
            id: project._id,
        },
    });
};

const modifyProject = async (
    req: FastifyRequest<{
        Params: { nameOrId: string };
        Body: { name?: string; description?: string };
    }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await getUserFromReq(req);
    const nameOrId = req.params.nameOrId;
    const project = await Project.findOne({
        owner: user,
        $or: [{ id: nameOrId }, { name: nameOrId }],
    });

    if (!project) throw new NotFoundError("Project not found");

    await Project.updateOne(project, {
        name: req.body.name || project.name,
        description: req.body.description || project.description,
    });

    reply.code(200).send({
        message: "Project updated",
        data: {
            id: project._id,
            name: req.body.name,
            description: req.body.description,
        },
    });
};

const getAllProjects = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = await getUserFromReq(req);
    const projects = await Project.find({ owner: user }).select(
        "name description owner members -__v",
    );

    if (!projects) throw new NotFoundError("No project was created");

    reply.code(200).send({
        message: "OK",
        data: {
            projects,
        },
    });
};

const getOneProject = async (
    req: FastifyRequest<{ Params: { nameOrId: string } }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await getUserFromReq(req);
    const nameOrId = req.params.nameOrId;
    const project = await Project.findOne({
        owner: user,
        $or: [{ id: nameOrId }, { name: nameOrId }],
    }).select("_id name description owner members kanbans -__v");

    reply.code(200).send({
        message: "OK",
        data: {
            project,
        },
    });
};

const getRelatedKanbans = async (
    req: FastifyRequest<{ Params: { name: string } }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await getUserFromReq(req);
    const name = req.params.name;
    const project = await Project.findOne({ owner: user, name }).populate({
        path: "kanbans",
        select: "_id title description createdBy project events -__v",
    });

    if (!project) throw new NotFoundError(`Project "${name}" not found`);

    reply.code(200).send({
        message: "OK",
        data: {
            kanbans: project.kanbans,
        },
    });
};

const deleteOneProject = async (
    req: FastifyRequest<{ Params: { nameOrId: string } }>,
    reply: FastifyReply,
): Promise<void> => {
    const user = await getUserFromReq(req);
    const nameOrId = req.params.nameOrId;
    const project = await Project.findOne({
        owner: user,
        $or: [{ id: nameOrId }, { name: nameOrId }],
    });

    if (!project) throw new NotFoundError(`Project "${nameOrId}" not found`);

    await Project.deleteOne(project);

    reply.code(200).send({
        message: "Project deleted",
        data: {},
    });
};

export default async function bootstrap(instance: FastifyInstance): Promise<void> {
    instance.post("/project", { schema: CreateProjectSchema }, createNewProject);
    instance.put("/project/:name", { schema: ModifyProjectSchema }, modifyProject);
    instance.get("/project", { schema: GetAllProjectsSchema }, getAllProjects);
    instance.get("/project/:name", { schema: GetOneProjectSchema }, getOneProject);
    instance.delete("/project/:name", { schema: DeleteOneProjectSchema }, deleteOneProject);
    instance.get("/project/:name/kanban", { schema: GetRelatedKanbansSchema }, getRelatedKanbans);
}
