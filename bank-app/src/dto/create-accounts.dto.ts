import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class createAccountDto {
  @IsInt()
  @IsOptional()
  userId?: number;
  @IsInt()
  @IsOptional()
  companyId?: number;
  @IsNumber()
  balance: number;
  @IsString()
  accountNumber: string;
  @IsNumber()
  cardCode: number;
  @IsBoolean()
  deleted: boolean;
}
