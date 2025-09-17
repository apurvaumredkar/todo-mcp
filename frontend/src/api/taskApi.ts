import axios from 'axios';
import { Task, TaskCreate, TaskUpdate, TaskStatus, TaskPriority } from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
}

export const taskApi = {
  getTasks: async (filters?: TaskFilter): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.tag) params.append('tag', filters.tag);

    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (task: TaskCreate): Promise<Task> => {
    const response = await api.post('/tasks', task);
    return response.data;
  },

  updateTask: async (id: number, task: TaskUpdate): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};