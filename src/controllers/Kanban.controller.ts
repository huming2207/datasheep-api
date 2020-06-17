import { Controller, GET, POST, PUT, DELETE } from 'fastify-decorators';
import { ServerRequest, ServerReply } from 'fastify';

@Controller({ route: '/api/kanban' })
export default class KanbanController {
    @GET({ url: '/' })
    getAllKanbans = async (req: ServerRequest, reply: ServerReply): Promise<void> => {

    }

    @GET({ url: '/:kanbanId' })
    getOneKanban = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        
    }

    @POST({ url: '/' })
    createKanban = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        
    }

    @PUT({ url: '/:kanbanId' })
    modifyKanban = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        
    }

    @DELETE({ url: '/:kanbanId' })
    deleteKanban = async (req: ServerRequest, reply: ServerReply): Promise<void> => {
        
    }
}