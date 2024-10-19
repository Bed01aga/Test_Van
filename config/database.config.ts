import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  autoLoadModels: true,
  synchronize: true, // Для разработки, чтобы автоматически синхронизировать модели
};
