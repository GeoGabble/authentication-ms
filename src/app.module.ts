import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { StatusGatewayModule } from './status-gateway/status-gateway.module';
import { AuthenticationService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:'ep-silent-credit-a1rfhidk.ap-southeast-1.aws.neon.tech',
      url: 'postgresql://authentication_owner:wojKQAiL4WF6@ep-silent-credit-a1rfhidk.ap-southeast-1.aws.neon.tech/authentication?sslmode=require',
      username: 'authentication_owner',
      password: 'wojKQAiL4WF6',
      database: 'authentication',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging:true,
      ssl:true
    }),
    AuthModule,
    StatusGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
