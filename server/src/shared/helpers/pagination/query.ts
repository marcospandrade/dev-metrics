import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class GenericQueryDto {
    @Transform(GenericQueryDto.parsePage)
    @IsNumber({}, { message: 'page should be a number' })
    page: number = 1;

    @Transform(GenericQueryDto.parsePageSize)
    @IsNumber({}, { message: ' "pageSize" attribute should be a number ' })
    pageSize: number = 10;

    @IsOptional()
    public orderBy?: string;

    @IsEnum(SortOrder)
    @IsOptional()
    public sortOrder?: SortOrder = SortOrder.DESC;

    static parsePage({ value }: { value: string }) {
        if (!value || isNaN(parseInt(`${value}`))) {
            return 0;
        }

        return parseInt(`${value}`);
    }

    static parsePageSize({ value }: { value: string }) {
        if (!value || isNaN(parseInt(`${value}`))) {
            return 10;
        }

        return parseInt(`${value}`);
    }
}
