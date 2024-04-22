import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { z } from 'zod';

import { IAuth, ICreateUserDTO } from '../dto/login.dto';
import { AuthFactoryService } from './auth-factory.service';
import { AtlassianFactoryService } from '@lib/atlassian/services/atlassian-factory.service';
import { AtlassianHelper } from '@lib/atlassian/helpers/atlassian.helper';
import { AtlassianUseCases } from '@lib/atlassian/services/atlassian.use-cases.service';
import { IAccessibleResources } from '@lib/atlassian/interfaces/accessible-resources.model';
import { ProjectDto } from '../dto/project.dto';

@Injectable()
export class AuthUseCase {
    private readonly logger = new Logger(AuthUseCase.name);
    public constructor(
        private readonly authFactoryService: AuthFactoryService,
        private readonly _atlassianUseCases: AtlassianUseCases,
        private readonly atlassianService: AtlassianFactoryService,
    ) {}

    public async login(registerDto: IAuth) {
        const bodySchema = z.object({
            code: z.string(),
            state: z.string().uuid(),
        });

        const { code, state } = bodySchema.parse(registerDto);

        const { userInfo, exchangedCode } = await this._atlassianUseCases.exchangeCodeAndUserInformation(code);

        const userExists = await this.authFactoryService.checkUserExists(userInfo.email);

        if (userExists) {
            return userExists;
        }

        const accessibleResources = await this.atlassianService.getAccessibleResources(exchangedCode.access_token);

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
