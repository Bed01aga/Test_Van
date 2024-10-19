import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Todo } from 'src/todos/entities/todo.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CreateTodoDto } from 'src/todos/dto/create-todo.dto';
import * as faker from 'faker';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo)
    private todoModel: typeof Todo,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  // Создать задачу
  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = await this.todoModel.create(createTodoDto as Partial<Todo>);
    
    // Добавляем задачу в Elasticsearch
    console.log('Indexing Todo in Elasticsearch:', todo); // Логирование для отладки
    await this.elasticsearchService.index({
        index: 'todo',
        id: todo.id, // Указываем ID
        body: {
            title: todo.title,
            description: todo.description,
            completed: todo.completed,
            createdAt: todo.createdAt,
            updatedAt: todo.updatedAt,
        },
    });
  
    return todo;
}


  // Получить все задачи
  findAll(): Promise<Todo[]> {
    return this.todoModel.findAll();
  }

  // Получить задачу по ID
  findOne(id: string): Promise<Todo> {
    return this.todoModel.findByPk(id);
  }

  // Обновить задачу
  async update(id: string, updateTodoDto: CreateTodoDto): Promise<[number, Todo | null]> {
    const [affectedCount] = await this.todoModel.update(updateTodoDto, {
      where: { id },
    });
  
    if (affectedCount > 0) {
      const updatedTodo = await this.todoModel.findByPk(id);
      
      // Обновляем задачу в Elasticsearch
      await this.elasticsearchService.update({
        index: 'todo',
        id: id,
        body: {
          doc: {
            title: updatedTodo.title,
            description: updatedTodo.description,
            completed: updatedTodo.completed,
            updatedAt: updatedTodo.updatedAt,
          },
        },
      });
  
      return [affectedCount, updatedTodo];
    }
  
    return [affectedCount, null];
  }
  

  async delete(id: string): Promise<void> {
    const todo = await this.todoModel.findByPk(id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
  
    // Обновляем поле deletedAt
    await this.todoModel.update({ deletedAt: new Date() }, {
      where: { id },
    });
  
    // Обновляем запись в Elasticsearch, чтобы пометить её как удалённую
    await this.elasticsearchService.update({
      index: 'todo',
      id: id,
      body: {
        doc: {
          deletedAt: new Date(),
        },
      },
    });
  }
  

  async search(query: string): Promise<any> {
    try {
        const result = await this.elasticsearchService.search({
            index: 'todo',
            body: {
                query: {
                    multi_match: {
                        query: query,
                        fields: ['title', 'description'],
                    },
                },
            },
        });

        return result.hits.hits.map((hit: any) => hit._source);
    } catch (error) {
        console.error('Elasticsearch search error:', error);
        throw new InternalServerErrorException('Ошибка поиска в Elasticsearch'); // Можно выбросить собственное исключение
    }
}


  async generateTestTodos(count: number): Promise<Todo[]> {
    const todos: Todo[] = [];
  
    for (let i = 0; i < count; i++) {
      const todoData = {
        title: faker.lorem.sentence(), // Генерируем заголовок
        description: faker.lorem.paragraph(), // Генерируем описание
        completed: faker.datatype.boolean(), // Генерируем статус завершения
      };
  
      const todo = await this.create(todoData as CreateTodoDto); // Создаем задачу
      todos.push(todo);
    }
  
    return todos; // Возвращаем сгенерированные задачи
  }
}
