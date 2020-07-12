import { SuccessResponseSchema } from "../responses/SuccessResponseSchema";
import { ErrorSchema } from "../responses/ErrorResponseSchema";
import { FastifyOasSchema } from "fastify";

export const CreateKanbanSchema: FastifyOasSchema = {
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

export const ModifyKanbanSchema: FastifyOasSchema = {
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

export const GetAllKanbanSchema: FastifyOasSchema = {
    produces: ["application/json"],
    description: "Get all kanbans",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const GetOneKanbanSchema: FastifyOasSchema = {
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

export const AddEventSchema: FastifyOasSchema = {
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
    description: "Add an event to kanban",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const DeleteOneKanbanSchema: FastifyOasSchema = {
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
