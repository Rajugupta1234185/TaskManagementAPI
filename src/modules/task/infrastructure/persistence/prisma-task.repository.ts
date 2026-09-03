import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import {
  ITaskRepository,
  CreateTaskData,
  UpdateTaskData,
} from "../../domain/repositories/task.repository";
import { TaskEntity } from "../../domain/entities/task.entity";

@Injectable()
export class PrismaTaskRepository implements ITaskRepository {

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTaskData): Promise<TaskEntity> {
    const record = await this.prisma.task.create({ data });
    return TaskEntity.fromPersistence(record);
  }

  async findAllByUserId(userId: string): Promise<TaskEntity[]> {
    const records = await this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return records.map((record) => TaskEntity.fromPersistence(record));
  }

  async findByIdAndUserId(id: string, userId: string): Promise<TaskEntity | null> {
    const record = await this.prisma.task.findFirst({
      where: { id, userId },
    });
    return record ? TaskEntity.fromPersistence(record) : null;
  }

  async update(id: string, data: UpdateTaskData): Promise<TaskEntity> {
    const record = await this.prisma.task.update({
      where: { id },
      data,
    });
    return TaskEntity.fromPersistence(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }

}