import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class registerUsersDto {
  @IsString()
  fullName: string;
  @IsEmail()
  email: string;
  @IsDateString()
  time: string;
  @IsString()
  @MinLength(8)
  @MaxLength(87)
  password: string;
  @IsEnum(Role)
  role: Role;
  @IsNumber()
  phone: number;
  @IsNumber()
  cardCode: number;
  @IsString()
  personalNumber: string;
  @IsBoolean()
  deleted: boolean;
}
