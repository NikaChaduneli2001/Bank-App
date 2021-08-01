import { IsEmail, IsInt, IsString } from 'class-validator';

export class registerCompanyDto {
  @IsString()
  companyName: string;
  @IsEmail()
  email: string;
  @IsInt()
  user: number;
}
