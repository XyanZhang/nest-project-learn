// src/config/database.config.ts

import { TypeOrmModuleOptions } from "@nestjs/typeorm";

/**
 * 数据库配置
 */
export const database = (): TypeOrmModuleOptions => ({
  charset: 'utf8mb4',
  logging: ['error'],
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  // password: '12345678',
  password: '123456',
  database: '3r',
  synchronize: true,
  autoLoadEntities: true,
  // entities: []
});
// 在AppModule中通过forRoot传入配置并注册数据库模块即可，这样应用在启动时会根据模块(Entity)自动同步数据结构并连接数据库