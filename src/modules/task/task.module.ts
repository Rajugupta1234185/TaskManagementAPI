import { Module } from '@nestjs/common';
import { ITaskRepository } from './domain/repositories/task.repository';
import { PrismaTaskRepository } from './infrastructure/persistence/prisma-task.repository';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
    providers:[
        { provide: ITaskRepository, useClass: PrismaTaskRepository },
        TaskService
    ],
    controllers: [TaskController]
})
export class TaskModule {}
