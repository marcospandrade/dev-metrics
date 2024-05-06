import { IsString } from 'class-validator';
import { IntegrationServer } from '../../integration-server/entities/integration-server.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TAccessibleResources } from '@lib/atlassian/types/accessible-resources.type';
import { User } from '../entities/user.entity';

export class LoginDto {
    @ApiProperty({
        type: String,
        description: 'code',
    })
    @IsString()
    code: string;

    @ApiProperty({
        type: String,
        description: 'state',
    })
    @IsString()
    state: string;
}

export interface ICreateUserDTO {
    state: string;
    accessTokenEstimai: string;
    accessTokenAtlassian: string;
    expiresAt: string;
    refreshToken: string;
    name: string;
    email: string;
    picture?: string;
    jobTitle?: string;
    project?: Partial<IntegrationServer>;
}

export class LoginResponseDTO {
    user: User;
    accessibleResources: TAccessibleResources;
}
