import { Module } from '@nestjs/common';
import { StatusGateway } from './status-gateway.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authentication } from 'src/auth/entity/auth.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Authentication])],
    providers: [{
        provide: "WS-SERVICE",
        useClass: StatusGateway
    }]
})
export class StatusGatewayModule {}
