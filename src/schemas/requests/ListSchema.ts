import { SuccessResponseSchema } from "../responses/SuccessResponseSchema";
import { ErrorSchema } from "../responses/ErrorResponseSchema";
import { FastifySchema } from "fastify";

export const CreateListSchema: FastifySchema = {
    body: {
        type: "object",
        properties: {
            title: { type: "string", minLength: 1, maxLength: 30 },
            color: { type: "integer", minimum: 0, maximum: 0xffffffff, optional: true }, // RGBA, 32-bit
            project: { type: "string", minLength: 1 },
        },
        required: ["title", "project"],
    },
    consumes: ["application/x-www-form-urlencoded", "application/json"],
    produces: ["application/json"],
    description: "Create a new list",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const ModifyListSchema: FastifySchema = {
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
    consumes: ["application/x-www-form-urlencoded", "application/json"],
    produces: ["application/json"],
    description: "Modify a list",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const GetAllListSchema: FastifySchema = {
    produces: ["application/json"],
    description: "Get all lists",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const GetOneListSchema: FastifySchema = {
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
    consumes: ["application/x-www-form-urlencoded", "application/json"],
    produces: ["application/json"],
    description: "Get one list",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const ModifyEventInListSchema: FastifySchema = {
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
            idx: { type: "integer", minimum: 0 },
        },
        required: ["event"],
    },
    consumes: ["application/x-www-form-urlencoded", "application/json"],
    produces: ["application/json"],
    description: "Add an event to list",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const DeleteOneListSchema: FastifySchema = {
    params: {
        type: "object",
        properties: {
            id: { type: "string" },
        },
        required: ["id"],
    },
    consumes: ["application/x-www-form-urlencoded", "application/json"],
    produces: ["application/json"],
    description: "Delete one list",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};
