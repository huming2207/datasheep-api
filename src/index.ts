import "./typings/FastifyTypes";
import fastify from "fastify";
import dotenv from "dotenv";
import FastifyOas from "fastify-oas";
import FastifyFormBody from "fastify-formbody";
import FastifyJwt from "fastify-jwt";
import { connectToDb } from "./common/Database";
import { bootstrap } from "fastify-decorators";
import { resolve } from "path";

dotenv.config();

const server = fastify({
    logger: {
        level: process.env.DS_LOG_LEVEL || "warn",
        prettyPrint: process.env.DS_LOG_PRETTY === "true" ? { colorize: true } : false,
        sync: process.env.DS_LOG_SYNC === "true",
    },
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

server.register(FastifyFormBody);
server.register(FastifyJwt, {
    secret: process.env.PP_JWT_SECRET ? process.env.PP_JWT_SECRET : "jwtTestToken",
    sign: {
        algorithm: "HS512",
        expiresIn: "1h",
    },
});

server.register(bootstrap, {
    directory: resolve(__dirname, `controllers`),
    mask: /\.controller\./,
});

console.log("Starting with config:");
console.log(process.env);

connectToDb()
    .then(() => {
        console.log("Database connected, starting Fastify...");
        server.listen(
            parseInt(process.env.DS_PORT || "3000"),
            process.env.DS_ADDR || "localhost",
            (err, address) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }

                server.ready((err) => {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    if (process.env.DS_DISABLE_SWAGGER !== "true") server.oas();
                });
                console.log(`Fastify is listening at ${address}`);
            },
        );
    })
    .catch((err: any) => {
        console.error(`Failed to connect MongoDB: ${err}`);
        process.exit(1);
    });
