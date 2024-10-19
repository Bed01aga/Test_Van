import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from 'config/database.config';
import { TodoModule } from './todos/todos.module';

@Module({
  imports: [SequelizeModule.forRoot(databaseConfig), TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
