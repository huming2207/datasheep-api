import fastify, { FastifyInstance } from "fastify";
import pino from "pino";
import FastifyOas from "fastify-oas";
import FastifyFormBody from "fastify-formbody";
import FastifyJwt from "fastify-jwt";
import Middie from "middie";
import AuthHandler from "../handlers/AuthHandler";
import ProtectedRequests from "../handlers/ProtectedRequests";

export const buildServer = (): FastifyInstance => {
    const logger = pino({
        level: process.env.DS_LOG_LEVEL || "warn",
        prettyPrint: process.env.DS_LOG_PRETTY === "true" ? { colorize: true, crlf: false } : false,
        name: "ds-api",
    });

    const server = fastify({
        logger,
    });

    if (process.env.DS_DISABLE_SWAGGER !== "true") {
        server.register(FastifyOas, {
            routePrefix: "/api/documentation",
            exposeRoute: true,
            swagger: {
                info: {
                    title: "Datasheep",
                    description: "Embedded software development helper",
                    version: "0.1.0",
                },
                servers: [
                    {
                        url: "http://127.0.0.1:3000",
                        description: "Dev server",
                    },
                ],
                definitions: {},
                securityDefinitions: {
                    JWT: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
        });
    }

    server.register(Middie);
    server.register(FastifyFormBody);
    server.register(FastifyJwt, {
        secret: process.env.PP_JWT_SECRET ? process.env.PP_JWT_SECRET : "jwtTestToken",
        sign: {
            algorithm: "HS512",
            expiresIn: "1h",
        },
    });

    server.register(AuthHandler, { prefix: "/api" });
    server.register(ProtectedRequests, { prefix: "/api" });

    return server;
};
