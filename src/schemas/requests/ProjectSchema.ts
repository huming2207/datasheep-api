import { RouteSchema } from "fastify";
import { SuccessResponseSchema } from "../responses/SuccessResponseSchema";
import { ErrorSchema } from "../responses/ErrorResponseSchema";

export const CreateProjectSchema: RouteSchema = {
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

export const ModifyProjectSchema: RouteSchema = {
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
        required: ["username", "password"],
    },
    consumes: ["application/x-www-form-urlencoded"],
    produces: ["application/json"],
    description: "Modify a project",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const GetAllProjectsSchema: RouteSchema = {
    produces: ["application/json"],
    description: "Get all projects",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const GetOneProjectSchema: RouteSchema = {
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

export const DeleteOneProjectSchema: RouteSchema = {
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
