import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { TransactionType } from 'src/enums/transaction-type.enum';

export class fillBlanaceDto {
  @IsNumber()
  @Min(0)
  amount: number;
  @IsInt()
  @IsOptional()
  senderId: number;
  @IsInt()
  receiverId: number;
  @IsOptional()
  @IsEnum(TransactionType)
  type: TransactionType;
}
