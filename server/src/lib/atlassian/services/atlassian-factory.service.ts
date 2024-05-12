import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import {
    IExchangeCodeToAccessTokenAtlassian,
    IExchangeResponse,
    IRefreshTokenAtlassian,
} from '../types/config-atlassian.type';
import { UserAtlassianInfo } from '../types/user-info.type';
import { TAccessibleResources } from '../types/accessible-resources.type';
import { ServerAppConfig } from '../../../app.module';
import { User } from '@modules/auth/entities/user.entity';
import { LoggerService } from '@core/logger/logger.service';

@Injectable()
export class AtlassianFactoryService {
    public constructor(
        private readonly logger: LoggerService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService<ServerAppConfig>,
        private readonly httpService: HttpService,
    ) {}

    public async getToken(userEmail: string) {
        const userAuthInfo = await this.userRepository.findOne({
            where: {
                email: userEmail,
            },
            select: {
                accessTokenAtlassian: true,
                expiresAt: true,
                refreshToken: true,
            },
        });

        if (!userAuthInfo) {
            throw new NotFoundException('User not registered');
        }

        if (Date.now() < Number(userAuthInfo.expiresAt)) {
            return userAuthInfo.accessTokenAtlassian;
        }

        this.logger.info('Refreshing user token... ');
        return this.refreshToken(userEmail, userAuthInfo.refreshToken);
    }

    public async exchangeCodeToAccessToken(code: string): Promise<IExchangeResponse> {
        const payloadAuthAtlassian: IExchangeCodeToAccessTokenAtlassian = {
            grant_type: 'authorization_code',
            client_id: this.configService.get('ATLASSIAN_CLIENT_ID') ?? '',
            client_secret: this.configService.get('ATLASSIAN_CLIENT_SECRET') ?? '',
            code,
            redirect_uri: this.configService.get('ATLASSIAN_CALLBACK_URL') ?? '',
        };

        const { data } = await firstValueFrom(
            this.httpService
                .post<IExchangeResponse>('https://auth.atlassian.com/oauth/token', payloadAuthAtlassian)
                .pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(error.response?.data);
                        throw new InternalServerErrorException(error.response?.data);
                    }),
                ),
        );

        return data;
    }

    public async getUserInformation(accessToken: string): Promise<UserAtlassianInfo> {
        const { data } = await firstValueFrom(
            this.httpService
                .get<UserAtlassianInfo>('https://api.atlassian.com/me', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(error.response?.data);
                        throw new InternalServerErrorException(error.response?.data);
                    }),
                ),
        );

        return data;
    }

    public async getAccessibleResources(accessToken: string) {
        this.logger.info('Getting accessible resources...');
        const { data } = await firstValueFrom(
            this.httpService
                .get<TAccessibleResources[]>('https://api.atlassian.com/oauth/token/accessible-resources', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(error.response?.data);
                        throw new InternalServerErrorException(error.response?.data);
                    }),
                ),
        );

        return data[0];
    }

    public async genericAtlassianCall<T>(url: string, userEmail: string) {
        const accessToken = await this.getToken(userEmail);

        const { data } = await firstValueFrom(
            this.httpService
                .get<T>(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error({ error }, `Error with generic call: ${url}`);
                        throw new InternalServerErrorException(error.response?.data);
                    }),
                ),
        );

        return data;
    }

    public async refreshToken(userEmail: string, refreshToken: string): Promise<string> {
        const payloadRefreshToken: IRefreshTokenAtlassian = {
            grant_type: 'refresh_token',
            client_id: this.configService.get('ATLASSIAN_CLIENT_ID') ?? '',
            client_secret: this.configService.get('ATLASSIAN_CLIENT_SECRET') ?? '',
            refresh_token: refreshToken,
        };

        const { data } = await firstValueFrom(
            this.httpService
                .post<IExchangeResponse>(`https://auth.atlassian.com/oauth/token`, payloadRefreshToken)
                .pipe(
                    catchError((error: AxiosError) => {
                        this.logger.error(error.response?.data);
                        throw new InternalServerErrorException(error.response?.data);
                    }),
                ),
        );

        await this.userRepository.update(
            { email: userEmail },
            { refreshToken: data.refresh_token, accessTokenAtlassian: data.access_token },
        );

        return data.access_token;
    }
}
