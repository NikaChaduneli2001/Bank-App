import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

enum sortDir {
  DESC = 'DESC',
  ASC = 'ASC',
}

export class searchBy {
  @IsOptional()
  @IsString()
  accountNumber: string;
  @IsOptional()
  @IsNumber()
  cardCode: string;
  @IsOptional()
  @IsInt()
  userId: number;
}
export class getAllAccountsDto {
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
