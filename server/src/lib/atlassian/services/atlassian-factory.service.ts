import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import {
    IExchangeCodeToAccessTokenAtlassian,
    IExchangeResponse,
    IRefreshTokenAtlassian,
} from '../interfaces/config-atlassian.model';

import { UserAtlassianInfo } from '../interfaces/user-info.model';
import { IAccessibleResources } from '../interfaces/accessible-resources.model';
import { ServerAppConfig } from '../../../app.module';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@modules/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AtlassianFactoryService {
    private readonly logger = new Logger(AtlassianFactoryService.name);

    public constructor(
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
        this.logger.log('Getting accessible resources...');
        const { data } = await firstValueFrom(
            this.httpService
                .get<IAccessibleResources[]>('https://api.atlassian.com/oauth/token/accessible-resources', {
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
                        this.logger.error(error.response?.data);
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
