import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsString } from 'class-validator';

class FieldToRegisterDto {
    @IsString()
    atlassianId: string;
    @IsString()
    fieldName: string;
    @IsString()
    fieldType: string;
    @IsBoolean()
    isStoryPointField: boolean;
}
export class RegisterCustomFieldsCommand {
    @IsString()
    projectId: string;

    @IsString()
    userEmail: string;

    @IsArray()
    @Type(() => FieldToRegisterDto)
    fieldsToRegister: FieldToRegisterDto[];
}

export class RegisterCustomFieldsWithoutEmailCommand extends OmitType(RegisterCustomFieldsCommand, ['userEmail']) {}
