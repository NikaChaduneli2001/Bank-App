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
  time: Date;
  @IsNumber()
  balance: number;
  @IsString()
  @IsOptional()
  description: string;
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
  @IsBoolean()
  deleted: boolean;
}
