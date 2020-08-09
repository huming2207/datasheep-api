import { FastifySchema } from "fastify";
import { SuccessResponseSchema } from "../responses/SuccessResponseSchema";
import { ErrorSchema } from "../responses/ErrorResponseSchema";

export const CreateProjectSchema: FastifySchema = {
    body: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1, maxLength: 30 },
            description: { type: "string", maxLength: 100 },
        },
        required: ["name", "description"],
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Create a new project",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const ModifyProjectSchema: FastifySchema = {
    params: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1, maxLength: 30 },
        },
        required: ["name"],
    },
    body: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1, maxLength: 30, optional: true },
            description: { type: "string", maxLength: 100, optional: true },
        },
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Modify a project",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const GetAllProjectsSchema: FastifySchema = {
    produces: ["application/json"],
    description: "Get all projects",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const GetOneProjectSchema: FastifySchema = {
    params: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1, maxLength: 30 },
        },
        required: ["name"],
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Get one project",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const GetRelatedListsSchema: FastifySchema = {
    params: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1, maxLength: 30 },
        },
        required: ["name"],
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Get all related lists in one project",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const DeleteOneProjectSchema: FastifySchema = {
    params: {
        type: "object",
        properties: {
            name: { type: "string", minLength: 1, maxLength: 30 },
        },
        required: ["name"],
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Delete one project",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const AddListSchema: FastifySchema = {
    params: {
        type: "object",
        properties: {
            name: { type: "string" },
        },
        required: ["name"],
    },
    body: {
        type: "object",
        properties: {
            id: { type: "string" },
        },
        required: ["id"],
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Add a list to a project",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};
