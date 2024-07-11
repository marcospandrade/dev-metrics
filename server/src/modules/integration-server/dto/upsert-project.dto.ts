import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpsertProjectDto {
    @IsString()
    @IsOptional()
    atlassianId?: string;

    @IsString()
    @IsOptional()
    key?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    projectTypeKey?: string;

    @IsBoolean()
    @IsOptional()
    isPrivate?: boolean;

    @IsBoolean()
    @IsOptional()
    isSynced?: boolean;

    @IsString()
    @IsOptional()
    integrationServerId?: string;

    @IsString()
    @IsOptional()
    integrationUUID?: string;

    @IsString()
    @IsOptional()
    id?: string;
}