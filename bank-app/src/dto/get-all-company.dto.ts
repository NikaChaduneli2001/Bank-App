import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

enum sortDir {
  DESC = 'DESC',
  ASC = 'ASC',
}

export class searchBy {
  @IsOptional()
  @IsString()
  companyName: string;
}

export class getAllCompanyDto {
  @IsOptional()
  sortBy?: string;
  @IsEnum(sortDir)
  @IsOptional()
  sortDir?: sortDir;
  @Type(() => searchBy)
  @IsOptional()
  searchBy?: searchBy;
  @IsOptional()
  page?: number;
  @IsOptional()
  limit?: number;
}
