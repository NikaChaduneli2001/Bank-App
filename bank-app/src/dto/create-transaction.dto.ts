import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionStatus } from 'src/enums/transaction-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';

export class createTransactionDto {
  @IsInt()
  @IsOptional()
  userId: number;
  @IsInt()
  @IsOptional()
  senderId: number;
  @IsInt()
  @IsOptional()
  receiverId: number;
  @IsInt()
  @IsOptional()
  serviceId: number;
  @IsDateString()
  time: string;
  @IsNumber()
  balance: number;
  @IsString()
  @IsOptional()
  description: string;
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
  @IsEnum(TransactionType)
  type: TransactionType;
  @IsBoolean()
  deleted: boolean;
}
