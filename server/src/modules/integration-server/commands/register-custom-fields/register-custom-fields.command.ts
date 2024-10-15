import { OmitType } from '@nestjs/mapped-types';
import { IsArray, IsString } from 'class-validator';

export class RegisterCustomFieldsCommand {
    @IsString()
    projectId: string;

    @IsString()
    userEmail: string;

    @IsArray()
    fieldsToRegister: {
        atlassianId: string;
        fieldName: string;
        fieldType: string;
        isStoryPointField: boolean;
    }[]
}

export class RegisterCustomFieldsWithoutEmailCommand extends OmitType(RegisterCustomFieldsCommand, ['userEmail']) { }