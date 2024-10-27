import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthFactoryService } from './use-cases/auth-factory.service';
import { AuthController } from './auth.controller';
// import { PrismaModule } from 'src/lib/prisma/prisma.module';
import { AuthUseCase } from './use-cases/auth.use-cases';
import { AtlassianModule } from '@lib/atlassian/atlassian.module';
import { JwtStrategy } from './strategies/jwt-bearer/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ServerAppConfig } from 'src/app.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        AtlassianModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService<ServerAppConfig>) => {
                const secret = configService.get('JWT_KEY');
                const expiresIn = configService.get('JWT_EXPIRES');

                return {
                    secret,
                    signOptions: {
                        expiresIn,
                    },
                };
            },
            inject: [ConfigService],
        }),
        PassportModule.registerAsync({
            useFactory: () => {
                return {
                    defaultStrategy: 'jwt',
                    property: 'user',
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthUseCase, AuthFactoryService, JwtService, ConfigService, JwtStrategy],
    exports: [AuthUseCase, JwtService],
})
export class AuthModule { }
