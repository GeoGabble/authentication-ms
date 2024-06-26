import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Authentication } from "./entity/auth.entity";
import { Repository, Timestamp } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { createHmac } from "crypto";
import { StatusGateway } from "src/status-gateway/status-gateway.service";
import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(Authentication) private readonly authRepository: Repository<Authentication>,
        private configService: ConfigService,
        @Inject("WS-SERVICE") private wsService: StatusGateway
    ) {}

    async getToken(authDto: AuthDto) {
        // await this.authRepository.clear();
        console.log(authDto.user_id);
        if(authDto.user_id == undefined) {
            throw new HttpException('Required body params not found.', HttpStatus.BAD_REQUEST);
        }
        try {
            let user = await this.authRepository.findOne({where: {user_id: authDto.user_id}});
            if(user!==null && user.status=="suspended") {
                throw new HttpException('Account is suspended', HttpStatus.FORBIDDEN);
            } else if (user!=null && user.status=="terminated") {
                throw new HttpException('Account is terminated', HttpStatus.FORBIDDEN);
            } else {
                const secret = this.configService.get<string>('TOKEN_SECRET');
                console.log(secret);
                const hash_token : string= createHmac('sha256',secret).update(`${Date.now().toString()+authDto.user_id}`).digest('hex');
                const final_token = `${hash_token.valueOf()}`;
                console.log(final_token);
                if (user===null) {
                    const new_user = new Authentication();
                    new_user.user_id = authDto.user_id;
                    new_user.status = "active";
                    new_user.token = final_token;
                    await this.authRepository.save(new_user);
                    return {
                        statusCode: 201,
                        message : {
                            token: final_token
                        }
                    }
                }
                user.token = final_token;
                await this.authRepository.save(user);
                await this.wsService.disconnectUser(authDto.user_id);
                return {
                    statusCode: 201,
                    message : {
                        token: final_token
                    }
                }
            }
        } catch (error) {
            throw new HttpException(error , HttpStatus.INTERNAL_SERVER_ERROR);
         };
        

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
