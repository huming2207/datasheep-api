import { UserDoc } from "../models/UserModel";
import Project from "../models/ProjectModel";
import { Controller, POST, PUT, GET, DELETE } from "fastify-decorators";
import { FastifyRequest, FastifyReply } from "fastify";
import {
    CreateProjectSchema,
    ModifyProjectSchema,
    GetOneProjectSchema,
    GetAllProjectsSchema,
    DeleteOneProjectSchema,
} from "../schemas/requests/ProjectSchema";
import BaseProtectedController from "./BaseProtected.controller";
import { getUserFromReq } from "../common/UserFetcher";
import { NotFoundError } from "../common/Errors";

@Controller("/api/project")
export default class ProjectController extends BaseProtectedController {
    @POST({ url: "/", options: { schema: CreateProjectSchema } })
    createNewProject = async (
        req: FastifyRequest<{ Body: { name: string; description: string } }>,
        reply: FastifyReply,
    ): Promise<void> => {
        const user = await getUserFromReq(req);
        const name = req.body.name;
        const description = req.body.description;

        const project = await Project.create<{ name: string; description: string; owner: UserDoc }>(
            {
                name,
                description,
                owner: user,
            },
        );

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

    @PUT({ url: "/:name", options: { schema: ModifyProjectSchema } })
    modifyProject = async (
        req: FastifyRequest<{
            Params: { name: string };
            Body: { name?: string; description?: string };
        }>,
        reply: FastifyReply,
    ): Promise<void> => {
        const user = await getUserFromReq(req);
        const name = req.params.name;

        const project = await Project.findOne({ owner: user, name });
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

    @GET({ url: "/", options: { schema: GetAllProjectsSchema } })
    getAllProjects = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const user = await getUserFromReq(req);
        const projects = await Project.find({ owner: user }).select(
            "name description owner members -__v",
        );

        reply.code(200).send({
            message: "OK",
            data: {
                projects,
            },
        });
    };

    @GET({ url: "/:name", options: { schema: GetOneProjectSchema } })
    getOneProject = async (
        req: FastifyRequest<{ Params: { name: string } }>,
        reply: FastifyReply,
    ): Promise<void> => {
        const user = await getUserFromReq(req);
        const name = req.params.name;
        const project = await Project.findOne({ owner: user, name }).select(
            "_id name description owner members kanbans -__v",
        );

        reply.code(200).send({
            message: "OK",
            data: {
                project,
            },
        });
    };

    @GET({ url: "/:name/kanbans" })
    getAllKanbanInProject = async (
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

    @DELETE({ url: "/:name", options: { schema: DeleteOneProjectSchema } })
    deleteOneProject = async (
        req: FastifyRequest<{ Params: { name: string } }>,
        reply: FastifyReply,
    ): Promise<void> => {
        const user = await getUserFromReq(req);
        const name = req.params.name;
        const project = await Project.findOne({ owner: user, name });
        if (!project) throw new NotFoundError(`Project "${name}" not found`);

        await Project.deleteOne({ owner: user, name });

        reply.code(200).send({
            message: "Project deleted",
            data: {},
        });
    };
}
