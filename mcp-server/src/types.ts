export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  tags: string[];
  date_entered: string;
  due_date?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  tags?: string[];
  due_date?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  tags?: string[];
  due_date?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}