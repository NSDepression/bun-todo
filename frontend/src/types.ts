export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  updatedAt: number;
}

export type SortField = 'createdAt' | 'updatedAt' | 'title' | 'priority';
export type SortOrder = 'asc' | 'desc';
export type FilterStatus = 'all' | 'active' | 'completed';
export type FilterPriority = 'all' | 'low' | 'medium' | 'high';
