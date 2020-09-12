import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { UserDoc, UserModel } from "../models/UserModel";
import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { BadRequestError, UnauthorisedError } from "../common/Errors";
import { InternalError } from "../common/Errors";
import { UserLoginSchema, UserRegisterSchema } from "../schemas/requests/UserAuthSchema";

const userRegister = async (
    req: FastifyRequest<{ Body: { username: string; password: string; email: string } }>,
    reply: FastifyReply,
): Promise<void> => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    try {
        const createdUser = await UserModel.create({
            username,
            password: await argon2.hash(password),
            email,
        });

        if (!createdUser) throw new InternalError("Failed to create user");

        reply.code(200).send({
            message: "User created",
            data: {
                userName: createdUser.username,
                email: createdUser.email,
                id: createdUser.id,
            },
        });
    } catch (err) {
        const msg: string = err.message;
        if (msg.includes("duplicate key")) {
            throw new BadRequestError("User already exists, try another username/email");
        } else {
            throw err;
        }
    }
};

const userLogin = async (
    req: FastifyRequest<{ Body: { username: string; password: string } }>,
    reply: FastifyReply,
): Promise<void> => {
    const username = req.body.username;
    const password = req.body.password;

    let user: UserDoc | null;
    try {
        user = await UserModel.findOne({ $or: [{ username }, { email: username }] }).select(
            "+password",
        );
        if (!user || !(await argon2.verify(user.password, password))) {
            throw new UnauthorisedError("Username or password is incorrect, try again");
        }

        if (!process.env.DS_JWT_SECRET) throw new InternalError("JWT secret is not set");

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            process.env.DS_JWT_SECRET,
            {
                algorithm: "HS512",
                expiresIn: "1h",
            },
        );

        reply.code(200).send({
            message: "Done",
            data: { token },
        });
    } catch (err) {
        throw new UnauthorisedError("Username or password is incorrect, try again");
    }
};

export default async function bootstrap(server: FastifyInstance): Promise<void> {
    server.post("/auth/register", { schema: UserRegisterSchema }, userRegister);
    server.post("/auth/login", { schema: UserLoginSchema }, userLogin);
}
