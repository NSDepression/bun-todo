import { useState, useEffect } from 'react';
import { api } from './api';
import { useWasm } from './useWasm';
import type { Todo, FilterStatus, FilterPriority, SortField, SortOrder } from './types';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const { wasmModule, loading: wasmLoading } = useWasm();

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const completed = filterStatus === 'all' ? undefined : filterStatus === 'completed';
      const priority = filterPriority === 'all' ? undefined : filterPriority;

      const data = await api.getTodos(completed, priority, sortBy, sortOrder);
      setTodos(data.todos);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filterStatus, filterPriority, sortBy, sortOrder]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim()) return;

    try {
      await api.createTodo({
        title: newTitle,
        description: newDescription,
        priority: newPriority,
      });

      setNewTitle('');
      setNewDescription('');
      setNewPriority('medium');
      fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      await api.updateTodo(todo.id, { completed: !todo.completed });
      fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTodo(id);
      fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await api.updateTodo(id, {
        title: editTitle,
        description: editDescription,
      });
      setEditingId(null);
      fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Todo App</h1>
          <p className="subtitle">
            Powered by ElysiaJS, Bun, React & WASM {wasmModule && '✓'}
          </p>
        </header>

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="stats">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <form onSubmit={handleAddTodo} className="add-todo-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="input-title"
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Description (optional)"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              className="input-description"
            />
            <select
              value={newPriority}
              onChange={e => setNewPriority(e.target.value as any)}
              className="select-priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="submit" className="btn-add">
              Add Todo
            </button>
          </div>
        </form>

        <div className="filters">
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as FilterStatus)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority:</label>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value as FilterPriority)}
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortField)}>
              <option value="createdAt">Created</option>
              <option value="updatedAt">Updated</option>
              <option value="title">Title</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Order:</label>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as SortOrder)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="todo-list">
          {loading ? (
            <div className="loading">Loading todos...</div>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              <p>No todos found. Add one to get started!</p>
            </div>
          ) : (
            todos.map(todo => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''} priority-${
                  todo.priority
                }`}
              >
                {editingId === todo.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="edit-input"
                    />
                    <input
                      type="text"
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      className="edit-input"
                      placeholder="Description"
                    />
                    <div className="edit-actions">
                      <button
                        onClick={() => handleSaveEdit(todo.id)}
                        className="btn-save"
                      >
                        Save
                      </button>
                      <button onClick={handleCancelEdit} className="btn-cancel">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="todo-checkbox">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleComplete(todo)}
                        id={`todo-${todo.id}`}
                      />
                      <label htmlFor={`todo-${todo.id}`}></label>
                    </div>

                    <div className="todo-content">
                      <h3 className="todo-title">{todo.title}</h3>
                      {todo.description && (
                        <p className="todo-description">{todo.description}</p>
                      )}
                      <div className="todo-meta">
                        <span className={`priority-badge priority-${todo.priority}`}>
                          {todo.priority}
                        </span>
                        <span className="todo-date">
                          {new Date(todo.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="todo-actions">
                      <button
                        onClick={() => handleStartEdit(todo)}
                        className="btn-edit"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="btn-delete"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
