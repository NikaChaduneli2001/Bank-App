import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CompanyEntity } from 'src/entities/company.entity';
import { Role } from 'src/enums/role.enum';

export class findUserByPersonalNumberDto {
  @IsInt()
  id: number;
  @IsOptional()
  @IsInt()
  companyId: number | CompanyEntity;
  @IsString()
  @IsOptional()
  fullName: string;
  @IsEmail()
  @IsOptional()
  email: string;
  @IsString()
  @IsOptional()
  time: string;
  @IsOptional()
  @IsString()
  hash: string;
  @IsEnum(Role)
  role: Role;
  @IsNumber()
  @IsOptional()
  phone: number;
  @IsString()
  personalNumber: string;
  @IsOptional()
  @IsBoolean()
  deleted: boolean;
}
