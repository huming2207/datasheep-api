import { JSONSchema7 } from "json-schema";
import { FastifySchema } from "fastify";
import { SuccessResponseSchema } from "../responses/SuccessResponseSchema";
import { ErrorSchema } from "../responses/ErrorResponseSchema";

const LoginFormSchema: JSONSchema7 = {
    $id: "#loginForm",
    type: "object",
    properties: {
        username: { type: "string", minLength: 3, maxLength: 60 },
        password: { type: "string", minLength: 8, maxLength: 20 },
    },
    required: ["username", "password"],
};

const RegisterFormSchema: JSONSchema7 = {
    $id: "#regForm",
    type: "object",
    properties: {
        username: { type: "string", minLength: 3, maxLength: 60, not: { format: "email" } },
        password: { type: "string", minLength: 8, maxLength: 20 },
        email: { type: "string", format: "email" },
    },
    required: ["username", "password", "email"],
};

export const UserLoginSchema: FastifySchema = {
    body: LoginFormSchema,
    consumes: ["application/x-www-form-urlencoded", "application/json"],
    produces: ["application/json"],
    description: "Register a new user",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};

export const UserRegisterSchema: FastifySchema = {
    body: RegisterFormSchema,
    consumes: ["application/x-www-form-urlencoded", "application/json"],
    produces: ["application/json"],
    description: "User login, and get a new JWT token",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};
