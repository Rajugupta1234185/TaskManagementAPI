import { TaskEntity } from '../entities/task.entity';

export interface CreateTaskData {
  title: string;
  description?: string;
  isCompleted?: boolean,
  userId: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  isCompleted?: boolean;
}

export abstract class ITaskRepository {
  abstract create(data: CreateTaskData): Promise<TaskEntity>;
  abstract findAllByUserId(userId: string): Promise<TaskEntity[]>;
  abstract findByIdAndUserId(id: string, userId: string): Promise<TaskEntity | null>;
  abstract update(id: string, data: UpdateTaskData): Promise<TaskEntity>;
  abstract delete(id: string): Promise<void>;
}