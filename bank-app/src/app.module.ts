import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { CompanyEntity } from './entities/company.entity';
import { ServicesEntity } from './entities/services.entity';
import { TransactionEntity } from './entities/trasaction.entity';
import { UsersEntity } from './entities/users.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UsersMysqlModule } from './repositories/users/users_mysql.module';
import { UsersModule } from './modules/users/users.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { CompanyModule } from './modules/company/company.module';

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
        ServicesEntity,
        TransactionEntity,
        UsersEntity,
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    AccountsModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
