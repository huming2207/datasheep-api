import {
    FastifySchema,
    RawServerBase,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
} from "fastify";

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

    export type HandlerInstance = FastifyInstance<
        RawServerBase,
        RawRequestDefaultExpression<RawServerBase>,
        RawReplyDefaultExpression<RawServerBase>
    >;
}
