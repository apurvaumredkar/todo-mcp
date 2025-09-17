import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi, TaskFilter } from '../api/taskApi';
import { TaskCreate, TaskUpdate } from '../types/task';

const TASKS_QUERY_KEY = 'tasks';
const POLL_INTERVAL = 2000; // 2 seconds

export const useTasks = (filters?: TaskFilter) => {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, filters],
    queryFn: () => taskApi.getTasks(filters),
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: true,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: TaskCreate) => taskApi.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }: { id: number; task: TaskUpdate }) =>
      taskApi.updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};