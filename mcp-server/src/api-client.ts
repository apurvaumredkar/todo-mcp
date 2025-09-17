import axios from 'axios';
import { Task, TaskCreate, TaskUpdate, TaskStatus, TaskPriority } from './types.js';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  tag?: string;
  search?: string;
  skip?: number;
  limit?: number;
}

export class TaskApiClient {
  async getTasks(filters?: TaskFilter): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.tag) params.append('tag', filters.tag);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
    if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());

    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  }

  async getTask(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  }

  async createTask(task: TaskCreate): Promise<Task> {
    const response = await api.post('/tasks', task);
    return response.data;
  }

  async updateTask(id: number, task: TaskUpdate): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
  }

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }
}