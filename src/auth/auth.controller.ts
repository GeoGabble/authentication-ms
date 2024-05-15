import { Body, Controller, Post } from "@nestjs/common";
import { AuthenticationService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller('auth')
export class AuthenticationController {
    constructor(
        private readonly authService: AuthenticationService
    ){}

    @Post('token')
    getToken(@Body() authDto: AuthDto) {
        return this.authService.getToken(authDto);
    }
}