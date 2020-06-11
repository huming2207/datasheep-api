import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import User, { UserDoc } from '../models/UserModel';
import { Controller, POST } from 'fastify-decorators';
import { ServerRequest, ServerReply } from 'fastify';
import { BadRequestError, UnauthorisedError } from '../common/Errors';
import { InternalError } from '../common/Errors';
import { LoginFormSchema, RegisterFormSchema } from '../schemas/requests/UserAuthSchema';

@Controller({ route: '/api/auth' })
export class AuthController {
    @POST({ url: '/register', options: { schema: RegisterFormSchema } })
    userRegister = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        const username = req.body['username'] as string;
        const password = req.body['password'] as string;
        const email = req.body['email'] as string;

        try {
            const createdUser = await User.create<{
                username: string;
                password: string;
                email: string;
            }>({
                username,
                password: await argon2.hash(password),
                email,
            });

            if (!createdUser) throw new InternalError('Failed to create user');

            reply.code(200).send({
                message: 'User created',
                data: {
                    userName: createdUser.username,
                    email: createdUser.email,
                    id: createdUser.id,
                },
            });
        } catch (err) {
            const msg: string = err.message;
            if (msg.includes('duplicate key')) {
                throw new BadRequestError('User already exists, try another username/email');
            } else {
                throw err;
            }
        }
    };

    @POST({ url: '/login', options: { schema: LoginFormSchema } })
    userLogin = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        const username = req.body['username'] as string;
        const password = req.body['password'] as string;

        let user: UserDoc | null;
        try {
            user = await User.findOne({ $or: [{ username }, { email: username }] });
            if (!user || !(await argon2.verify(user.password, password))) {
                throw new UnauthorisedError('Username or password is incorrect, try again');
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
                process.env.DS_JWT_TOKEN || 'jwtTestToken',
                {
                    algorithm: 'HS512',
                    expiresIn: '1h',
                },
            );

            reply.code(200).send({
                message: 'Done',
                data: { token },
            });
        } catch (err) {
            throw new UnauthorisedError('Username or password is incorrect, try again');
        }
    };
}
