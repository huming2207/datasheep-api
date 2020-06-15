import { ServerRequest } from 'fastify';
import User, { UserDoc } from '../models/UserModel';
import { UnauthorisedError } from './Errors';

export async function getUserFromReq(req: ServerRequest): Promise<UserDoc> {
    const userId = (req.user as any)['id'];
    const user = await User.findById(userId);
    if (!user) throw new UnauthorisedError('Cannot load current user');
    return user;
}
