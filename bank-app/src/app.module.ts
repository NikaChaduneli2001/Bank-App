import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'bankApp',
      password: 'bank12345678',
      database: 'lvl_bank',
      entities: [],
      synchronize: false,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
