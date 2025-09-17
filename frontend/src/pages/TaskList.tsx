import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Fab,
  CircularProgress,
  Alert,
  Stack,
  Paper,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Assignment } from '@mui/icons-material';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { TaskFilter } from '../components/TaskFilter';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { Task, TaskCreate, TaskStatus, TaskUpdate } from '../types/task';
import { TaskFilter as TaskFilterType } from '../api/taskApi';

export const TaskList: React.FC = () => {
  const [filters, setFilters] = useState<TaskFilterType>({});
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: tasks, isLoading, error } = useTasks(filters);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleCreateTask = (taskData: TaskCreate) => {
    if (editingTask) {
      updateTaskMutation.mutate({
        id: editingTask.id,
        task: taskData,
      });
    } else {
      createTaskMutation.mutate(taskData);
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleDelete = (taskId: number) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleStatusToggle = (task: Task) => {
    const newStatus = task.status === TaskStatus.COMPLETED
      ? TaskStatus.PENDING
      : TaskStatus.COMPLETED;

    updateTaskMutation.mutate({
      id: task.id,
      task: { status: newStatus } as TaskUpdate,
    });
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  const getTaskStats = () => {
    if (!tasks) return { total: 0, completed: 0, pending: 0, inProgress: 0 };
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
      pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
      inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    };
  };

  const stats = getTaskStats();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Assignment sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            Agentic Todo
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Chip label={`Total: ${stats.total}`} color="default" />
          <Chip label={`Pending: ${stats.pending}`} color="warning" />
          <Chip label={`In Progress: ${stats.inProgress}`} color="info" />
          <Chip label={`Completed: ${stats.completed}`} color="success" />
        </Stack>

        <TaskFilter
          filters={filters}
          onFilterChange={setFilters}
          onClear={handleClearFilters}
        />
      </Box>

      {isLoading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load tasks. Please try again.
        </Alert>
      )}

      {!isLoading && tasks && tasks.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Click the + button to create your first task
          </Typography>
        </Paper>
      )}

      {!isLoading && tasks && tasks.length > 0 && (
        <Box>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusToggle={handleStatusToggle}
            />
          ))}
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => setFormOpen(true)}
      >
        <AddIcon />
      </Fab>

      <TaskForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleCreateTask}
        task={editingTask}
      />
    </Container>
  );
};