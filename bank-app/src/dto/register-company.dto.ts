import { IsEmail, IsString } from 'class-validator';

export class registerCompanyDto {
  @IsString()
  companyName: string;
  @IsEmail()
  email: string;
}
