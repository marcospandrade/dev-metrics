import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { ICreateUserDTO, LoginDto } from '../dto/login.dto';
import { AuthFactoryService } from './auth-factory.service';
import { AtlassianFactoryService } from '@lib/atlassian/services/atlassian-factory.service';
import { AtlassianHelper } from '@lib/atlassian/helpers/atlassian.helper';
import { AtlassianUseCases } from '@lib/atlassian/services/atlassian.use-cases.service';
import { IAccessibleResources } from '@lib/atlassian/interfaces/accessible-resources.model';
import { ProjectDto } from '../dto/project.dto';
import { LoggerService } from '@core/logger/logger.service';

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
        this.logger.info(userInfo, 'User info exchanged: ');

        const userExists = await this.authFactoryService.checkUserExists(userInfo.email);

        if (userExists) {
            return userExists;
        }

        const accessibleResources = await this.atlassianService.getAccessibleResources(exchangedCode.access_token);

        this.logger.info({ accessibleResources }, 'Got accessible resources');

        const accessTokenEstimai = await this.authFactoryService.generateJwtToken(
            state,
            userInfo,
            accessibleResources.url,
            accessibleResources.id,
        );

        const createUser: ICreateUserDTO = {
            accessTokenEstimai,
            accessTokenAtlassian: exchangedCode.access_token,
            refreshToken: exchangedCode.refresh_token,
            expiresAt: AtlassianHelper.calculateExpiresAt(exchangedCode.expires_in),
            state,
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            jobTitle: userInfo.extended_profile.job_title,
            project: this.mountProjectDto(accessibleResources),
        };

        this.logger.info({ createUser }, 'Create user');

        const userCreated = await this.authFactoryService.createUser(createUser);

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

    private mountProjectDto(accessibleResources: IAccessibleResources): ProjectDto {
        return {
            name: accessibleResources.name,
            url: accessibleResources.url,
            jiraId: accessibleResources.id,
            scopes: JSON.stringify(accessibleResources.scopes),
        };
    }
}
