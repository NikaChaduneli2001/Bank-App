import { IsInt, IsOptional, IsString } from 'class-validator';

enum SortDir {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetAllServicesDto {
  @IsString()
  @IsOptional()
  sortBy?: string;
  @IsString()
  @IsOptional()
  sortDir?: SortDir;
  @IsString()
  @IsOptional()
  searchBy?: string;
  @IsInt()
  @IsOptional()
  page?: number;
  @IsInt()
  @IsOptional()
  limit?: number;
}

