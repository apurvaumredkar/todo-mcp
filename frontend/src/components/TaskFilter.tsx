import React from 'react';
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
  Button,
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';
import { TaskStatus, TaskPriority } from '../types/task';
import { TaskFilter as TaskFilterType } from '../api/taskApi';

interface TaskFilterProps {
  filters: TaskFilterType;
  onFilterChange: (filters: TaskFilterType) => void;
  onClear: () => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({ filters, onFilterChange, onClear }) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <FilterList color="primary" />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ''}
            label="Status"
            onChange={(e) =>
              onFilterChange({ ...filters, status: e.target.value as TaskStatus || undefined })
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={TaskStatus.PENDING}>Pending</MenuItem>
            <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
            <MenuItem value={TaskStatus.COMPLETED}>Completed</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority || ''}
            label="Priority"
            onChange={(e) =>
              onFilterChange({ ...filters, priority: e.target.value as TaskPriority || undefined })
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
            <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
            <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Tag"
          value={filters.tag || ''}
          onChange={(e) =>
            onFilterChange({ ...filters, tag: e.target.value || undefined })
          }
          placeholder="Filter by tag"
        />

        <Button
          variant="outlined"
          startIcon={<Clear />}
          onClick={onClear}
          size="small"
        >
          Clear
        </Button>
      </Stack>
    </Paper>
  );
};