import { useState, useEffect } from 'react';

interface WasmModule {
  initTodos: (capacity: number) => void;
  addTodo: (
    index: number,
    id: number,
    completed: number,
    priority: number,
    createdAt: bigint,
    updatedAt: bigint
  ) => void;
  sortByCreatedAt: (ascending: number) => void;
  sortByPriority: (ascending: number) => void;
  filterByCompleted: (completed: number) => number;
  filterByPriority: (priority: number) => number;
  getTodoId: (index: number) => number;
  getTodoCompleted: (index: number) => number;
  getTodoPriority: (index: number) => number;
  getTodoCount: () => number;
  calculateStats: () => bigint;
}

export function useWasm() {
  const [wasmModule, setWasmModule] = useState<WasmModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadWasm() {
      try {
        // Try to load the actual WASM file
        const wasmPath = '/wasm/release.wasm';

        try {
          const response = await fetch(wasmPath);
          if (response.ok) {
            const buffer = await response.arrayBuffer();
            const result = await WebAssembly.instantiate(buffer);
            const exports = result.instance.exports as any;

            // Map WASM exports to our interface
            const wasmModule: WasmModule = {
              initTodos: exports.initTodos,
              addTodo: exports.addTodo,
              sortByCreatedAt: exports.sortByCreatedAt,
              sortByPriority: exports.sortByPriority,
              filterByCompleted: exports.filterByCompleted,
              filterByPriority: exports.filterByPriority,
              getTodoId: exports.getTodoId,
              getTodoCompleted: exports.getTodoCompleted,
              getTodoPriority: exports.getTodoPriority,
              getTodoCount: exports.getTodoCount,
              calculateStats: exports.calculateStats,
            };

            if (isMounted) {
              setWasmModule(wasmModule);
              setLoading(false);
              console.log('✓ WASM module loaded successfully');
            }
            return;
          }
        } catch (wasmError) {
          console.warn('Could not load WASM, using fallback:', wasmError);
        }

        // Fallback: Mock implementation if WASM fails to load
        const mockModule: WasmModule = {
          initTodos: () => {},
          addTodo: () => {},
          sortByCreatedAt: () => {},
          sortByPriority: () => {},
          filterByCompleted: () => 0,
          filterByPriority: () => 0,
          getTodoId: () => 0,
          getTodoCompleted: () => 0,
          getTodoPriority: () => 0,
          getTodoCount: () => 0,
          calculateStats: () => BigInt(0),
        };

        if (isMounted) {
          setWasmModule(mockModule);
          setLoading(false);
          console.log('Using fallback WASM implementation');
        }
      } catch (err) {
        console.error('Failed to load WASM module:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load WASM');
          setLoading(false);
        }
      }
    }

    loadWasm();

    return () => {
      isMounted = false;
    };
  }, []);

  return { wasmModule, loading, error };
}
