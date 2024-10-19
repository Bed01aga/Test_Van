import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SequelizeModule } from '@nestjs/sequelize';
import { TodoController } from './controllers/todo.controller';
import { TodoService } from './services/todo.service';
import { Todo } from './entities/todo.entity';


@Module({
  imports: [
    SequelizeModule.forFeature([Todo]), // Убедитесь, что ваша сущность указана здесь
    ElasticsearchModule.register({
      node: 'http://localhost:9200', // Убедитесь, что это ваш правильный путь к Elasticsearch
    }),
  ],
  controllers: [TodoController],
  providers: [TodoService,],
})
export class TodoModule {}