import fastify, { FastifyInstance } from "fastify";
import pino from "pino";
import FastifyOas from "fastify-oas";
import FastifyFormBody from "fastify-formbody";
import FastifyJwt from "fastify-jwt";
import Middie from "middie";
import AuthHandler from "../handlers/AuthHandler";
import ProtectedRequests from "../handlers/ProtectedRequests";
import { connectToDb } from "./Database";

export const buildFastify = async (): Promise<FastifyInstance> => {
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
                        url: "http://127.0.0.1:5000",
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

    await server.register(Middie);
    await server.register(FastifyFormBody);
    await server.register(FastifyJwt, {
        secret: process.env.PP_JWT_SECRET ? process.env.PP_JWT_SECRET : "jwtTestToken",
        sign: {
            algorithm: "HS512",
            expiresIn: "1h",
        },
    });

    await server.register(AuthHandler, { prefix: "/api" });
    await server.register(ProtectedRequests, { prefix: "/api" });

    return server;
};

export const buildServer = async (): Promise<void> => {
    try {
        await connectToDb();
        console.log("Database connected, starting Fastify...");

        const fastify = await buildFastify();

        await fastify.listen(
            parseInt(process.env.DS_PORT || "5000"),
            process.env.DS_ADDR || "localhost",
        );

        fastify.log.info("Fastify is started.");
        fastify.ready((err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            if (process.env.DS_DISABLE_SWAGGER !== "true") fastify.oas();
        });
    } catch (err) {
        console.error(`Failed when starting API server: ${err}`);
        process.exit(1);
    }
};
