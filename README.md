# Agentic Todo Application

A modern, full-stack todo application built with FastAPI, React, and Docker. Features a colorful Material-UI interface with real-time updates and comprehensive task management capabilities. Designed for future MCP (Model Context Protocol) integration with Claude Desktop.

## Features

### Core Functionality
- **Full CRUD Operations**: Create, read, update, and delete tasks
- **Rich Task Model**: Tasks include title, description, tags, due dates, priority levels, and status tracking
- **Real-time Updates**: Automatic polling ensures UI stays synchronized with backend
- **Advanced Filtering**: Filter tasks by status, priority, and tags
- **Modern UI**: Colorful, responsive Material-UI design with smooth animations
- **Task Statistics**: Real-time dashboard showing task counts by status

### Task Properties
- **Title**: Required task name
- **Description**: Optional detailed notes
- **Tags**: Multiple tags for categorization
- **Due Date**: Optional deadline with overdue indicators
- **Priority**: Low, Medium, or High priority levels
- **Status**: Pending, In Progress, or Completed

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework with automatic API documentation
- **SQLAlchemy**: ORM for database operations
- **SQLite**: Lightweight, file-based database
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server for Python

### Frontend
- **React 18**: Latest React with hooks
- **TypeScript**: Type-safe development
- **Material-UI v5**: Modern component library
- **React Query**: Server state management with caching
- **Vite**: Fast build tool with HMR
- **Dayjs**: Date manipulation library

### Infrastructure
- **Docker**: Containerization for consistent deployment
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Production web server for frontend

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git (for cloning the repository)

### Running with Docker Compose

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd agentic-todo
   ```

2. **Start the application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:8000/docs
   - API (Redoc): http://localhost:8000/redoc

### Development Mode

For local development with hot-reloading:

```bash
docker-compose -f docker-compose.dev.yml up
```

This will:
- Run the backend with auto-reload on code changes
- Run the frontend with Vite's development server
- Frontend available at: http://localhost:5173
- Backend available at: http://localhost:8000

## API Endpoints

### Tasks API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List all tasks (with optional filters) |
| GET | `/tasks/{id}` | Get a specific task |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/{id}` | Update a task |
| DELETE | `/tasks/{id}` | Delete a task |

### Query Parameters for GET /tasks
- `status`: Filter by task status (pending, in_progress, completed)
- `priority`: Filter by priority (low, medium, high)
- `tag`: Filter by tag name
- `skip`: Pagination offset (default: 0)
- `limit`: Number of results (default: 100, max: 1000)

### Example API Usage

**Create a task**:
```bash
curl -X POST "http://localhost:8000/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API docs",
    "tags": ["documentation", "high-priority"],
    "status": "in_progress",
    "priority": "high",
    "due_date": "2025-09-20T10:00:00"
  }'
```

**Get all pending tasks**:
```bash
curl "http://localhost:8000/tasks?status=pending"
```

## Project Structure

```
agentic-todo/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── database.py      # Database configuration
│   │   └── routers/
│   │       └── tasks.py     # Task CRUD endpoints
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile          # Backend container
│
├── frontend/
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── theme/          # Material-UI theme
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   ├── package.json        # Node dependencies
│   ├── vite.config.ts      # Vite configuration
│   └── Dockerfile          # Frontend container
│
├── mcp-server/             # Future MCP integration
├── docker-compose.yml      # Production orchestration
├── docker-compose.dev.yml  # Development orchestration
└── README.md              # This file
```

## Environment Variables

### Backend
- `DATABASE_URL`: SQLite database URL (default: `sqlite:///./todos.db`)
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)

### Frontend
- `VITE_API_URL`: Backend API URL (default: `http://localhost:8000`)

## Database Schema

The application uses SQLite with the following task model:

```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    tags JSON,
    date_entered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development

### Backend Development

1. **Install dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the backend**:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Development

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Testing

### Manual Testing Checklist
- [ ] Create a new task with all fields
- [ ] Edit an existing task
- [ ] Delete a task
- [ ] Toggle task status
- [ ] Filter by status
- [ ] Filter by priority
- [ ] Filter by tag
- [ ] Verify real-time updates
- [ ] Check responsive design on mobile
- [ ] Test due date functionality

## Future Enhancements (Phase 2)

### MCP Integration
- Model Context Protocol server for Claude Desktop
- Tools for task management via Claude
- Docker container for MCP server
- Integration documentation

### Planned Features
- Task search functionality
- Bulk operations (delete/update multiple tasks)
- Task templates
- Export/Import functionality
- Dark mode toggle
- User authentication (optional)
- Task attachments
- Recurring tasks
- Task dependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

Built with dedication to modern web development practices and designed for extensibility.