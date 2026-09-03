import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskData, ITaskRepository } from './domain/repositories/task.repository';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {

    constructor( private readonly taskRepository: ITaskRepository){}

    async createTask( createTaskDto : CreateTaskDto, userId : string ){
        return this.taskRepository.create({
            title: createTaskDto.title,
            description : createTaskDto.description,
            isCompleted: createTaskDto.isCompleted,
            userId: userId
        });
    }

    async getUserTasks( userId: string){
        return this.taskRepository.findAllByUserId(userId);
    }

    async findTaskByIdAndUserId(taskId: string, userId : string){
        const task=await this.taskRepository.findByIdAndUserId(taskId, userId);
        if(!task){
            throw new NotFoundException("Task not found");
        }
        return task;
    }   


    async updateTask(taskId: string, updateTaskDto: UpdateTaskDto, userId: string) {
        // Ownership check FIRST — reuses the method you already fixed
        const existingTask = await this.taskRepository.findByIdAndUserId(taskId, userId);
        if (!existingTask) {
        throw new NotFoundException('Task not found');
        }

        return this.taskRepository.update(taskId, updateTaskDto);
    }


    async deleteTask(taskId: string, userId: string): Promise<void> {
        const existingTask = await this.taskRepository.findByIdAndUserId(taskId, userId);
        if (!existingTask) {
        throw new NotFoundException('Task not found');
        }

        await this.taskRepository.delete(taskId);
    }
}
