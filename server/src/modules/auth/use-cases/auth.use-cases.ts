import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { LoginDto } from '../dto/login.dto';
import { AuthFactoryService } from './auth-factory.service';
import { AtlassianFactoryService } from '@lib/atlassian/services/atlassian-factory.service';
import { AtlassianHelper } from '@lib/atlassian/helpers/atlassian.helper';
import { AtlassianUseCases } from '@lib/atlassian/services/atlassian.use-cases.service';

import { LoggerService } from '@core/logger/logger.service';

import { SchemaValidator } from '@core/utils';
import { CreateUserDto } from '../dto/create-user.dto';
// import { CreateIntegrationServerCommand } from '@modules/integration-server/commands/create-integration-server/create-integration-server.command';

@Injectable()
export class AuthUseCase {
    public constructor(
        private readonly commandBus: CommandBus,
        private readonly authFactoryService: AuthFactoryService,
        private readonly _atlassianUseCases: AtlassianUseCases,
        private readonly atlassianService: AtlassianFactoryService,
        private readonly logger: LoggerService,
    ) {}

    public async login(registerDto: LoginDto) {
        const { code, state } = registerDto;

        const { userInfo, exchangedCode } = await this._atlassianUseCases.exchangeCodeAndUserInformation(code);

        this.logger.info({ email: userInfo.email }, 'User info exchanged: ');

        const userExists = await this.authFactoryService.checkUserExists(userInfo.email);
        const accessibleResources = await this.atlassianService.getAccessibleResources(exchangedCode.access_token);

        this.logger.info({ projectUrl: accessibleResources.url }, 'Got accessible resources for the project: ');
        this.authFactoryService.notifyIntegrationServerNewLogin(accessibleResources);

        if (userExists) {
            return userExists;
        }

        const accessTokenEstimai = this.authFactoryService.generateJwtToken(
            state,
            userInfo,
            accessibleResources.url,
            accessibleResources.id,
        );

        const createUser = SchemaValidator.toInstance(
            {
                accessTokenEstimai,
                accessTokenAtlassian: exchangedCode.access_token,
                refreshToken: exchangedCode.refresh_token,
                expiresAt: AtlassianHelper.calculateExpiresAt(exchangedCode.expires_in),
                state,
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture,
                jobTitle: userInfo.extended_profile.job_title,
            },
            CreateUserDto,
        );

        const userCreated = await this.authFactoryService.createUser(createUser);

        // this.commandBus.execute(
        //     SchemaValidator.toInstance(
        //         { ...accessibleResources, userId: userCreated.id },
        //         CreateIntegrationServerCommand,
        //     ),
        // );

        this.logger.info({ userCreated: userCreated.id }, 'Create user');

        return userCreated;
    }

    public async refreshToken(userEmail: string) {
        const user = await this.authFactoryService.checkUserExists(userEmail);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const refreshedToken = await this.atlassianService.refreshToken(userEmail, user.refreshToken);

        return refreshedToken;
    }
}
