import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { TodoService } from 'src/todos/services/todo.service';
import { CreateTodoDto } from 'src/todos/dto/create-todo.dto';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('todos') // Группа эндпоинтов
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Создано успешно' })
  @ApiResponse({ status: 400, description: 'Некорректный запрос' })
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Возвращает все задачи' })
  findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Возвращает задачу по ID' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Обновлено успешно' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  update(@Param('id') id: string, @Body() updateTodoDto: CreateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Удалено успешно' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  remove(@Param('id') id: string) {
    return this.todoService.delete(id);
  }

  @Get('search')
  @ApiQuery({ name: 'query', description: 'Поисковый запрос' })
  @ApiResponse({ status: 200, description: 'Задачи найдены' })
  @ApiResponse({ status: 404, description: 'Задачи не найдены' })
  async search(@Query('query') query: string) {
    return this.todoService.search(query);
  }

  @Get('generate-test-todos/:count')
  @ApiResponse({ status: 201, description: 'Тестовые задачи созданы' })
  async generateTestTodos(@Param('count') count: number) {
    await this.todoService.generateTestTodos(count);
    return { message: `${count} тестовых задач успешно созданы!` };
  }
}
