export interface TaskEntityProps {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TaskEntity {
  readonly id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  readonly userId: string;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: TaskEntityProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.isCompleted = props.isCompleted;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static fromPersistence(record: TaskEntityProps): TaskEntity {
    return new TaskEntity(record);
  }
}