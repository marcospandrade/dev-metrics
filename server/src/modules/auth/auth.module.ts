import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthFactoryService } from './use-cases/auth-factory.service';
import { AuthController } from './auth.controller';
// import { PrismaModule } from 'src/lib/prisma/prisma.module';
import { AuthUseCase } from './use-cases/auth.use-cases';
import { AtlassianModule } from '@lib/atlassian/atlassian.module';
import { JwtStrategy } from './strategies/jwt-bearer/jwt.strategy';

@Module({
    imports: [
        // PrismaModule,
        HttpModule,
        AtlassianModule,
        JwtModule.register({
            secret: process.env['JWT_KEY'],
            signOptions: { expiresIn: '1d' },
        }),
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [AuthUseCase, AuthFactoryService, JwtService, ConfigService, JwtStrategy],
    exports: [AuthUseCase, JwtService],
})
export class AuthModule {}
