// AssemblyScript WASM module for high-performance todo operations

// Priority enum matching the TypeScript interface
enum Priority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2
}

// Simple Todo struct for WASM
class Todo {
  id: i32;
  completed: bool;
  priority: Priority;
  createdAt: i64;
  updatedAt: i64;

  constructor(
    id: i32,
    completed: bool,
    priority: Priority,
    createdAt: i64,
    updatedAt: i64
  ) {
    this.id = id;
    this.completed = completed;
    this.priority = priority;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

// Memory-efficient array operations
let todos: Array<Todo> = [];

/**
 * Initialize todos array with capacity
 */
export function initTodos(capacity: i32): void {
  todos = new Array<Todo>(capacity);
}

/**
 * Add a todo to the array
 */
export function addTodo(
  index: i32,
  id: i32,
  completed: bool,
  priority: i32,
  createdAt: i64,
  updatedAt: i64
): void {
  const todo = new Todo(
    id,
    completed,
    priority as Priority,
    createdAt,
    updatedAt
  );

  if (index < todos.length) {
    todos[index] = todo;
  }
}

/**
 * Filter todos by completion status
 * Returns indices of matching todos
 */
export function filterByCompleted(completed: bool): i32 {
  let count: i32 = 0;

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].completed === completed) {
      count++;
    }
  }

  return count;
}

/**
 * Filter todos by priority
 */
export function filterByPriority(priority: i32): i32 {
  let count: i32 = 0;

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].priority === priority) {
      count++;
    }
  }

  return count;
}

/**
 * QuickSort implementation for sorting todos by createdAt
 */
function partition(arr: Array<Todo>, low: i32, high: i32, ascending: bool): i32 {
  const pivot = arr[high].createdAt;
  let i = low - 1;

  for (let j = low; j < high; j++) {
    const shouldSwap = ascending
      ? arr[j].createdAt <= pivot
      : arr[j].createdAt >= pivot;

    if (shouldSwap) {
      i++;
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }

  const temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;

  return i + 1;
}

function quickSort(arr: Array<Todo>, low: i32, high: i32, ascending: bool): void {
  if (low < high) {
    const pi = partition(arr, low, high, ascending);
    quickSort(arr, low, pi - 1, ascending);
    quickSort(arr, pi + 1, high, ascending);
  }
}

/**
 * Sort todos by creation date
 * @param ascending - true for ascending, false for descending
 */
export function sortByCreatedAt(ascending: bool): void {
  if (todos.length > 1) {
    quickSort(todos, 0, todos.length - 1, ascending);
  }
}

/**
 * Sort todos by priority
 */
export function sortByPriority(ascending: bool): void {
  if (todos.length <= 1) return;

  // Simple bubble sort for priority (since there are only 3 priorities)
  for (let i = 0; i < todos.length - 1; i++) {
    for (let j = 0; j < todos.length - i - 1; j++) {
      const shouldSwap = ascending
        ? todos[j].priority > todos[j + 1].priority
        : todos[j].priority < todos[j + 1].priority;

      if (shouldSwap) {
        const temp = todos[j];
        todos[j] = todos[j + 1];
        todos[j + 1] = temp;
      }
    }
  }
}

/**
 * Get todo at index
 */
export function getTodoId(index: i32): i32 {
  if (index >= 0 && index < todos.length) {
    return todos[index].id;
  }
  return -1;
}

/**
 * Get completion status at index
 */
export function getTodoCompleted(index: i32): bool {
  if (index >= 0 && index < todos.length) {
    return todos[index].completed;
  }
  return false;
}

/**
 * Get priority at index
 */
export function getTodoPriority(index: i32): i32 {
  if (index >= 0 && index < todos.length) {
    return todos[index].priority;
  }
  return 0;
}

/**
 * Get array length
 */
export function getTodoCount(): i32 {
  return todos.length;
}

/**
 * Performance test: Calculate statistics
 * Returns sum of all timestamps for benchmarking
 */
export function calculateStats(): i64 {
  let sum: i64 = 0;

  for (let i = 0; i < todos.length; i++) {
    sum += todos[i].createdAt;
  }

  return sum;
}
