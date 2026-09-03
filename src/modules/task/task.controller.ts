import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { CreateTaskDto } from './dto/createTask.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
    constructor( private readonly taskService: TaskService){}


    @Post()
    async create(
        @Body() createTaskDto: CreateTaskDto,
        @CurrentUser() userId:string
    ){
        return this.taskService.createTask(createTaskDto, userId);
    }

    @Get()
    async findAll(
        @CurrentUser() userId: string
    ){
        return this.taskService.getUserTasks(userId);
    }

    @Get(":id")
    async findOne(
        @Param('id') id : string,
        @CurrentUser() userId : string
    ){
        return this.taskService.findTaskByIdAndUserId(id, userId);
    }

    @Patch(':id')
    async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() userId: string,
     ) {
    return this.taskService.updateTask(id, updateTaskDto, userId);
    }


    @Delete(':id')
    async remove(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    ) {
    return this.taskService.deleteTask(id, userId);
   }
}
