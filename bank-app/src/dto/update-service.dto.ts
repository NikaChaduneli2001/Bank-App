import { IsDecimal, IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator";
import { AccountEntity } from "src/entities/account.entity";
import { UsersEntity } from "src/entities/users.entity";
import { Type } from "src/enums/services-type.enum";

export class updateServiceDto {
    @IsInt()
    @IsOptional()
    user?: number | UsersEntity;
    @IsInt()
    @IsOptional()
    account?: number | AccountEntity;
    @IsOptional()
    @IsString()
    @Length(2,40)
    description?: string;
    @IsOptional()
    @IsDecimal() 
    price?: number;
    @IsOptional()
    @IsEnum(Type)
    type?: Type;
}