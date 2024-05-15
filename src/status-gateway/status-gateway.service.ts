import { Body, Injectable, OnModuleDestroy, OnModuleInit, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server, Socket} from 'socket.io';
import { Authentication } from "src/auth/entity/auth.entity";
import { Repository } from "typeorm";


@WebSocketGateway()
@Injectable()
export class StatusGateway implements OnGatewayInit {

    constructor(@InjectRepository(Authentication) private readonly authRepository: Repository<Authentication>) {}
    afterInit(server: Server) {
        server.on('connection',(socket)=>{
            console.log("New user connected");
            console.log(socket.id);
        })
    }

    @WebSocketServer()
    server: Server

    @SubscribeMessage('joinRoom')
    async onJoinRoom(@ConnectedSocket() socket: Socket,@MessageBody() user_id: string, @MessageBody() token: string) {
        const result = await this.verifyUser(user_id["user_id"], token["token"]);
        console.log(user_id["user_id"]);
        console.log(result);
        await socket.join(user_id["user_id"]);
        if(result.status === 'error') {
            this.server.to(user_id["user_id"]).emit('status', {
                status: "error",
                message: result.message
            });
            socket.disconnect(true);
        }
    }


    async disconnectUser(user_id: string) {
        console.log("Testing  "+user_id);
        this.server.to(user_id).emit('status', {
            status: "disconnect",
            message: "Need to relogin"
        })
        this.server.to(user_id).disconnectSockets(true);
    }

    async verifyUser(user_id: string, token: string) {
        const user = await this.authRepository.findOne({where: {user_id: user_id}});
        console.log(user);
        if(user===null) {
            return {
                status: "error",
                message: "User not found"
            }
        } else if (user.status==="suspended") {
            return {
                status: "error",
                message: "Account is suspended"
            }
        } else if (user!==null && user.status==="terminated") {
            return {
                status: "error",
                message: "Account is terminated"
            }
        } else if(user.token!==token) {
            return {
                status: "error",
                message: "Invalid token"
            }
        } else {
            return {
                status: "success",
                message: "Valid token"
            }
        }
    }
}