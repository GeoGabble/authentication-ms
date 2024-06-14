import { Body, Controller, Post } from "@nestjs/common";
import { AuthenticationService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { GrpcMethod } from "@nestjs/microservices";
import { VerificationRequest } from "src/proto/interfaces/verification-request.interface";
import { VerificationResponse } from "src/proto/interfaces/verification-response.interface";
import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";

@Controller()
export class AuthenticationController {
    constructor(
        private readonly authService: AuthenticationService
    ){}

    @Post('token')
    getToken(@Body() authDto: AuthDto) {
        return this.authService.getToken(authDto);
    }

    @GrpcMethod('Auth' , 'Verify')
    async verify(data: VerificationRequest) : Promise<VerificationResponse> {
        const result = await this.authService.verifyUser(data.userId, data.token);
        return {
            status: result.status,
            message: result.message
        }
    }
}