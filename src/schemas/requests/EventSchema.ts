import { FastifyOasSchema } from "fastify";
import { SuccessResponseSchema } from "../responses/SuccessResponseSchema";
import { ErrorSchema } from "../responses/ErrorResponseSchema";

export const CreateEventSchema: FastifyOasSchema = {
    body: {
        type: "object",
        properties: {
            title: { type: "string", minLength: 1, maxLength: 30 },
            content: { type: "string", optional: true },
            due: { type: "string", format: "date-time", optional: true },
            color: { type: "integer", minimum: 0, maximum: 0xffffffff, optional: true }, // RGBA, 32-bit
        },
        required: ["title"],
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Create a new event",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const GetOneEventSchema: FastifyOasSchema = {
    params: {
        type: "object",
        properties: {
            id: { type: "string" },
        },
        required: ["id"],
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Get one event by ID",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const ModifyEventSchema: FastifyOasSchema = {
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
            title: { type: "string", minLength: 1, maxLength: 30, optional: true },
            content: { type: "string", optional: true },
            due: { type: "string", format: "date-time", optional: true },
            color: { type: "integer", minimum: 0, maximum: 0xffffffff, optional: true }, // RGBA, 32-bit
        },
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Modify an event",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const DeleteEventSchema: FastifyOasSchema = {
    params: {
        type: "object",
        properties: {
            id: { type: "string" },
        },
        required: ["id"],
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Delete one event by ID",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};
