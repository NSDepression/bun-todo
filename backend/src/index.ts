import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  updatedAt: number;
}

// In-memory storage
const todos = new Map<string, Todo>();

// Seed some initial data
const seedData = () => {
  const sampleTodos = [
    {
      id: '1',
      title: 'Learn ElysiaJS',
      description: 'Explore the ElysiaJS framework for Bun',
      completed: false,
      priority: 'high' as const,
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
    },
    {
      id: '2',
      title: 'Build with WASM',
      description: 'Integrate WebAssembly for performance',
      completed: false,
      priority: 'medium' as const,
      createdAt: Date.now() - 3600000,
      updatedAt: Date.now() - 3600000,
    },
    {
      id: '3',
      title: 'Setup React Frontend',
      description: 'Create a modern React UI',
      completed: true,
      priority: 'high' as const,
      createdAt: Date.now() - 7200000,
      updatedAt: Date.now(),
    },
  ];

  sampleTodos.forEach(todo => todos.set(todo.id, todo));
};

seedData();

const app = new Elysia()
  .use(cors())
  .get('/', () => ({
    message: 'Todo API powered by ElysiaJS and Bun',
    endpoints: {
      'GET /todos': 'Get all todos',
      'GET /todos/:id': 'Get todo by id',
      'POST /todos': 'Create new todo',
      'PUT /todos/:id': 'Update todo',
      'DELETE /todos/:id': 'Delete todo',
      'GET /health': 'Health check',
    }
  }))
  .get('/health', () => ({ status: 'ok', timestamp: Date.now() }))
  .get('/todos', ({ query }) => {
    let todoList = Array.from(todos.values());

    // Filter by completion status
    if (query.completed !== undefined) {
      const isCompleted = query.completed === 'true';
      todoList = todoList.filter(todo => todo.completed === isCompleted);
    }

    // Filter by priority
    if (query.priority) {
      todoList = todoList.filter(todo => todo.priority === query.priority);
    }

    // Sort by different fields
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    todoList.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        comparison = a[sortBy] - b[sortBy];
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return {
      todos: todoList,
      count: todoList.length,
      total: todos.size,
    };
  })
  .get('/todos/:id', ({ params: { id }, error }) => {
    const todo = todos.get(id);
    if (!todo) {
      return error(404, { message: 'Todo not found' });
    }
    return todo;
  })
  .post('/todos', ({ body, error }) => {
    const { title, description, priority } = body as {
      title: string;
      description?: string;
      priority?: 'low' | 'medium' | 'high';
    };

    if (!title || title.trim().length === 0) {
      return error(400, { message: 'Title is required' });
    }

    const id = crypto.randomUUID();
    const now = Date.now();

    const newTodo: Todo = {
      id,
      title: title.trim(),
      description: description?.trim() || '',
      completed: false,
      priority: priority || 'medium',
      createdAt: now,
      updatedAt: now,
    };

    todos.set(id, newTodo);
    return { message: 'Todo created successfully', todo: newTodo };
  })
  .put('/todos/:id', ({ params: { id }, body, error }) => {
    const todo = todos.get(id);
    if (!todo) {
      return error(404, { message: 'Todo not found' });
    }

    const { title, description, completed, priority } = body as Partial<Todo>;

    const updatedTodo: Todo = {
      ...todo,
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(completed !== undefined && { completed }),
      ...(priority !== undefined && { priority }),
      updatedAt: Date.now(),
    };

    todos.set(id, updatedTodo);
    return { message: 'Todo updated successfully', todo: updatedTodo };
  })
  .delete('/todos/:id', ({ params: { id }, error }) => {
    const todo = todos.get(id);
    if (!todo) {
      return error(404, { message: 'Todo not found' });
    }

    todos.delete(id);
    return { message: 'Todo deleted successfully', todo };
  })
  .listen(3000);

console.log(
  `🚀 Todo API is running at http://${app.server?.hostname}:${app.server?.port}`
);

export type { Todo };
