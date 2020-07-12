import "./typings/FastifyTypes";
import dotenv from "dotenv";
import { connectToDb } from "./common/Database";
import { buildServer } from "./common/Server";

dotenv.config();

console.log("Starting with config:");
console.log(process.env);

const server = buildServer();

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
