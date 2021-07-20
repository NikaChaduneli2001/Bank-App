import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { CompanyEntity } from './entities/company.entity';
import { OperatorsEntity } from './entities/operators.entity';
import { ServicesEntity } from './entities/services.entity';
import { TransactionEntity } from './entities/trasaction.entity';
import { UsersEntity } from './entities/users.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UsersMysqlModule } from './modules/repositories/users/users_mysql.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Kobaroveli007',
      database: 'lvl_bank',
      entities: [
        AccountEntity,
        CompanyEntity,
        OperatorsEntity,
        ServicesEntity,
        TransactionEntity,
        UsersEntity,
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
