import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseUUID } from '@core/database/entities/base.entity';

export class RemoveSprintIssueDto {
  @IsUUID()
  sprintId: string;

  @IsArray()
  @Type(() => BaseUUID)
  @ValidateNested({ each: true })
  @IsOptional()
  issuesList?: BaseUUID[];
}
