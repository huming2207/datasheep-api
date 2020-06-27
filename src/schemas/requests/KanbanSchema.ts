import { SuccessResponseSchema } from "../responses/SuccessResponseSchema";
import { ErrorSchema } from "../responses/ErrorResponseSchema";
import { RouteSchema } from "fastify";

export const CreateKanbanSchema: RouteSchema = {
    body: {
        type: "object",
        properties: {
            title: { type: "string", minLength: 1, maxLength: 30 },
            color: { type: "integer", minimum: 0, maximum: 0xffffffff, optional: true }, // RGBA, 32-bit
        },
        required: ["title"],
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Create a new kanban",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const ModifyKanbanSchema: RouteSchema = {
    params: {
        type: "object",
        properties: {
            id: { type: "string" },
        },
        required: ["id"],
    },
    body: {
        type: "object",
        properties: {
            color: { type: "integer", minimum: 0, maximum: 0xffffffff, optional: true }, // RGBA, 32-bit
            description: { type: "string", maxLength: 100, optional: true },
        },
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Modify a kanban",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const GetAllKanbanSchema: RouteSchema = {
    produces: ["application/json"],
    description: "Get all kanbans",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const GetOneKanbanSchema: RouteSchema = {
    params: {
        type: "object",
        properties: {
            id: { type: "string" },
        },
        required: ["id"],
    },
    body: {
        type: "object",
        properties: {
            event: { type: "string" },
        },
        required: ["event"],
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Get one kanban",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const AddEventSchema: RouteSchema = {
    params: {
        type: "object",
        properties: {
            id: { type: "string" },
        },
        required: ["id"],
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Add an event to kanban",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const DeleteOneProjectSchema: RouteSchema = {
    params: {
        type: "object",
        properties: {
            id: { type: "string" },
        },
        required: ["id"],
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Delete one kanban",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};
