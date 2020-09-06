import { FastifySchema } from "fastify";
import { SuccessResponseSchema } from "../responses/SuccessResponseSchema";
import { ErrorSchema } from "../responses/ErrorResponseSchema";

export const RegisterDeviceSchema: FastifySchema = {
    body: {
        type: "object",
        properties: {
            chipId: { type: "string", minLength: 8, maxLength: 30 },
            sku: { type: "string" },
            firmware: { type: "string" },
        },
        required: ["chipId", "sku", "firmware"],
    },
    consumes: ["application/x-www-form-urlencoded", "application/json"],
    produces: ["application/json"],
    description: "Register a new device",
    response: { 200: SuccessResponseSchema, ...ErrorSchema },
};
