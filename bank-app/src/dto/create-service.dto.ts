import { IsDecimal, IsEnum, IsInt, IsString, Length } from "class-validator";
import { AccountEntity } from "src/entities/account.entity";
import { UsersEntity } from "src/entities/users.entity";
import { Type } from "src/enums/services-type.enum";

export class CreateServiceDto{
    @IsInt()
    user: number | UsersEntity;
    @IsInt()
    account: number | AccountEntity;
    @IsString()
    @Length(2,40)
    description: string;
    @IsDecimal() 
    price: number;
    @IsEnum(Type)
    type: Type;

}