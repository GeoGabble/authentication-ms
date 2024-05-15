import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authentication } from './entity/auth.entity';
import { AuthenticationService } from './auth.service';
import { AuthenticationController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { StatusGateway } from 'src/status-gateway/status-gateway.service';

@Module({
    imports: [TypeOrmModule.forFeature([Authentication]), ConfigModule],
    providers: [AuthenticationService,{
        provide: "WS-SERVICE",
        useClass: StatusGateway
    }],
    controllers: [AuthenticationController]
})
export class AuthModule {
    
}
