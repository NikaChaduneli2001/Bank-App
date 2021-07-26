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
  user?: number;
  @IsInt()
  @IsOptional()
  company?: number;
  @IsNumber()
  balance: number;
  @IsString()
  accountNumber: string;
  @IsNumber()
  cardCode: number;
  @IsBoolean()
  deleted: boolean;
}
