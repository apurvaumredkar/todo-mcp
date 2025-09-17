import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircleOutline,
  RadioButtonUnchecked,
  AccessTime,
  Flag,
} from '@mui/icons-material';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onStatusToggle: (task: Task) => void;
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return <CheckCircleOutline sx={{ color: 'success.main' }} />;
    case TaskStatus.IN_PROGRESS:
      return <AccessTime sx={{ color: 'warning.main' }} />;
    default:
      return <RadioButtonUnchecked sx={{ color: 'text.secondary' }} />;
  }
};

const getPriorityColor = (priority?: TaskPriority) => {
  switch (priority) {
    case TaskPriority.HIGH:
      return 'error';
    case TaskPriority.MEDIUM:
      return 'warning';
    case TaskPriority.LOW:
      return 'info';
    default:
      return 'default';
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusToggle,
}) => {
  const isOverdue = task.due_date && dayjs(task.due_date).isBefore(dayjs()) &&
    task.status !== TaskStatus.COMPLETED;

  return (
    <Card
      sx={{
        mb: 2,
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
        opacity: task.status === TaskStatus.COMPLETED ? 0.8 : 1,
        borderLeft: task.priority ? '4px solid' : 'none',
        borderLeftColor: `${getPriorityColor(task.priority)}.main`,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <IconButton
                size="small"
                onClick={() => onStatusToggle(task)}
                sx={{ p: 0 }}
              >
                {getStatusIcon(task.status)}
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  textDecoration: task.status === TaskStatus.COMPLETED ? 'line-through' : 'none',
                  color: task.status === TaskStatus.COMPLETED ? 'text.secondary' : 'text.primary',
                }}
              >
                {task.title}
              </Typography>
            </Box>

            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {task.description}
              </Typography>
            )}

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {task.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              ))}

              {task.priority && (
                <Chip
                  icon={<Flag />}
                  label={task.priority}
                  size="small"
                  color={getPriorityColor(task.priority)}
                  sx={{ mb: 1 }}
                />
              )}

              {task.due_date && (
                <Chip
                  label={dayjs(task.due_date).format('MMM D, YYYY')}
                  size="small"
                  color={isOverdue ? 'error' : 'default'}
                  variant={isOverdue ? 'filled' : 'outlined'}
                  sx={{ mb: 1 }}
                />
              )}
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Created {dayjs(task.created_at).fromNow()}
            </Typography>
          </Box>

          <Stack direction="row" spacing={0}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(task)}
                sx={{ color: 'primary.main' }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete(task.id)}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};