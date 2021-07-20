import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "src/enums/role.enum";
import { Type } from 'class-transformer';

enum sortDir {
    DESC = 'DESC',
    ASC = 'ASC',
  }
  
  export class searchBy {
    @IsOptional()
    @IsString()
    fullName: string
    @IsOptional()
    @IsEnum(Role)
    role: Role;
    @IsOptional()
    @IsEmail()
    email:number
    @IsOptional()
    @IsString()
    personalNumber: string
  }
  export class getAllUsersDto {
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
