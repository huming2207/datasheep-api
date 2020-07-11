import {
    FastifySchema,
    RawServerBase,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyLoggerInstance,
    RawServerDefault,
} from "fastify";

import http from "http";

declare module "fastify" {
    export interface FastifyOasSchema extends FastifySchema {
        hide?: boolean;
        tags?: string[];
        description?: string;
        summary?: string;
        consumes?: string[];
        produces?: string[];
        security?: Array<{ [securityLabel: string]: string[] }>;
    }
}
