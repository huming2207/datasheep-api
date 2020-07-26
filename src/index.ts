import dotenv from "dotenv";
import { buildServer } from "./common/Server";

dotenv.config();

buildServer().then(() => {
    console.log("Starting with config:");
    console.log(process.env);
});
