import { Module, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { database } from './config/database.config';
import { DatabaseModule } from './modules/database/database.module';
import { ContentModule } from './modules/content/content.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppPipe } from './modules/core/providers/app.pipe';
import { AppIntercepter } from './modules/core/providers/app.intercepter';
import { AppFilter } from './modules/core/providers/app.filter';
@Module({
  imports: [DatabaseModule.forRoot(database), ContentModule],
  controllers: [AppController],
  // 提供者需要在模块元元素的providers中注册才可以被本模块的其它类注入，需要在exports中导出后才能被其它模块调用
  providers: [ // 通过类型提示或者标识符的方式使某个类或函数以依赖注入的方式在其它需要使用到它的地方进行实例化
    AppService,
    {
      provide: APP_PIPE, // APP_PIPE 为nestjs框架的固定常量，用于设置全局管道
      useValue: new AppPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false },
      }),
    },
    // 全局序列化拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: AppIntercepter,
    },
    // 全局异常过滤器
    {
      provide: APP_FILTER,
      useClass: AppFilter,
    },
  ]
})
export class AppModule {}
