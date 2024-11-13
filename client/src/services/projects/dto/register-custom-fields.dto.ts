export interface FieldToRegisterDto {
  atlassianId: string;
  fieldName: string;
  fieldType: string;
  isStoryPointField: boolean;
}
export class RegisterCustomFieldsDto {
  projectId!: string;

  fieldsToRegister!: FieldToRegisterDto[];
}
