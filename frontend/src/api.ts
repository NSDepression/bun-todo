import type { Todo, SortField, SortOrder } from './types';

const API_BASE = 'http://localhost:3000';

export const api = {
  async getTodos(
    completed?: boolean,
    priority?: string,
    sortBy?: SortField,
    sortOrder?: SortOrder
  ): Promise<{ todos: Todo[]; count: number; total: number }> {
    const params = new URLSearchParams();

    if (completed !== undefined) {
      params.append('completed', String(completed));
    }
    if (priority && priority !== 'all') {
      params.append('priority', priority);
    }
    if (sortBy) {
      params.append('sortBy', sortBy);
    }
    if (sortOrder) {
      params.append('sortOrder', sortOrder);
    }

    const response = await fetch(`${API_BASE}/todos?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  },

  async createTodo(data: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
  }): Promise<{ message: string; todo: Todo }> {
    const response = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    return response.json();
  },

  async updateTodo(
    id: string,
    data: Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<{ message: string; todo: Todo }> {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    return response.json();
  },

  async deleteTodo(id: string): Promise<{ message: string; todo: Todo }> {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
    return response.json();
  },
};
