import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({ description: 'Название задачи' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Описание задачи', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Статус выполнения', default: false })
  @IsBoolean()
  completed?: boolean = false;
}
