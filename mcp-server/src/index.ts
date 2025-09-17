#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  TextContent,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { TaskApiClient } from './api-client.js';
import { TaskCreate, TaskUpdate, TaskStatus, TaskPriority } from './types.js';

const taskClient = new TaskApiClient();

class TodoMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'todo-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_tasks',
            description: 'List all tasks with optional filters',
            inputSchema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['pending', 'in_progress', 'completed'],
                  description: 'Filter by task status'
                },
                priority: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                  description: 'Filter by priority'
                },
                tag: {
                  type: 'string',
                  description: 'Filter by tag'
                },
                search: {
                  type: 'string',
                  description: 'Search in title and description'
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of results (default: 100)'
                }
              }
            }
          },
          {
            name: 'get_task',
            description: 'Get a specific task by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Task ID'
                }
              },
              required: ['id']
            }
          },
          {
            name: 'create_task',
            description: 'Create a new task',
            inputSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Task title'
                },
                description: {
                  type: 'string',
                  description: 'Task description'
                },
                tags: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Task tags'
                },
                due_date: {
                  type: 'string',
                  description: 'Due date in ISO 8601 format'
                },
                status: {
                  type: 'string',
                  enum: ['pending', 'in_progress', 'completed'],
                  description: 'Task status'
                },
                priority: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                  description: 'Task priority'
                }
              },
              required: ['title']
            }
          },
          {
            name: 'update_task',
            description: 'Update an existing task',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Task ID'
                },
                title: {
                  type: 'string',
                  description: 'New task title'
                },
                description: {
                  type: 'string',
                  description: 'New task description'
                },
                tags: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'New task tags'
                },
                due_date: {
                  type: 'string',
                  description: 'New due date in ISO 8601 format'
                },
                status: {
                  type: 'string',
                  enum: ['pending', 'in_progress', 'completed'],
                  description: 'New task status'
                },
                priority: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                  description: 'New task priority'
                }
              },
              required: ['id']
            }
          },
          {
            name: 'delete_task',
            description: 'Delete a task',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Task ID to delete'
                }
              },
              required: ['id']
            }
          },
          {
            name: 'complete_task',
            description: 'Mark a task as completed',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'number',
                  description: 'Task ID to complete'
                }
              },
              required: ['id']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'list_tasks':
            return await this.listTasks(args);
          case 'get_task':
            return await this.getTask(args);
          case 'create_task':
            return await this.createTask(args);
          case 'update_task':
            return await this.updateTask(args);
          case 'delete_task':
            return await this.deleteTask(args);
          case 'complete_task':
            return await this.completeTask(args);
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Tool ${name} not found`);
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  private async listTasks(args: any) {
    try {
      const tasks = await taskClient.getTasks({
        status: args.status as TaskStatus,
        priority: args.priority as TaskPriority,
        tag: args.tag,
        search: args.search,
        limit: args.limit || 100
      });

      const content: TextContent = {
        type: 'text',
        text: JSON.stringify(tasks, null, 2)
      };

      return { content: [content] };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to list tasks: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async getTask(args: any) {
    if (!args.id || typeof args.id !== 'number') {
      throw new McpError(ErrorCode.InvalidParams, 'Task ID is required and must be a number');
    }

    try {
      const task = await taskClient.getTask(args.id);
      const content: TextContent = {
        type: 'text',
        text: JSON.stringify(task, null, 2)
      };
      return { content: [content] };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to get task: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async createTask(args: any) {
    if (!args.title) {
      throw new McpError(ErrorCode.InvalidParams, 'Task title is required');
    }

    try {
      const taskData: TaskCreate = {
        title: args.title,
        description: args.description,
        tags: args.tags || [],
        due_date: args.due_date,
        status: args.status || TaskStatus.PENDING,
        priority: args.priority
      };

      const task = await taskClient.createTask(taskData);
      const content: TextContent = {
        type: 'text',
        text: `Task created successfully: ${JSON.stringify(task, null, 2)}`
      };
      return { content: [content] };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async updateTask(args: any) {
    if (!args.id || typeof args.id !== 'number') {
      throw new McpError(ErrorCode.InvalidParams, 'Task ID is required and must be a number');
    }

    try {
      const updateData: TaskUpdate = {};
      if (args.title !== undefined) updateData.title = args.title;
      if (args.description !== undefined) updateData.description = args.description;
      if (args.tags !== undefined) updateData.tags = args.tags;
      if (args.due_date !== undefined) updateData.due_date = args.due_date;
      if (args.status !== undefined) updateData.status = args.status;
      if (args.priority !== undefined) updateData.priority = args.priority;

      const task = await taskClient.updateTask(args.id, updateData);
      const content: TextContent = {
        type: 'text',
        text: `Task updated successfully: ${JSON.stringify(task, null, 2)}`
      };
      return { content: [content] };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async deleteTask(args: any) {
    if (!args.id || typeof args.id !== 'number') {
      throw new McpError(ErrorCode.InvalidParams, 'Task ID is required and must be a number');
    }

    try {
      await taskClient.deleteTask(args.id);
      const content: TextContent = {
        type: 'text',
        text: `Task ${args.id} deleted successfully`
      };
      return { content: [content] };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to delete task: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async completeTask(args: any) {
    if (!args.id || typeof args.id !== 'number') {
      throw new McpError(ErrorCode.InvalidParams, 'Task ID is required and must be a number');
    }

    try {
      const task = await taskClient.updateTask(args.id, { status: TaskStatus.COMPLETED });
      const content: TextContent = {
        type: 'text',
        text: `Task marked as completed: ${JSON.stringify(task, null, 2)}`
      };
      return { content: [content] };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to complete task: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Todo MCP server running on stdio');
  }
}

const server = new TodoMCPServer();
server.run().catch(console.error);