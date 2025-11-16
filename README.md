# Modern Todo App

A high-performance todo application built with **ElysiaJS**, **Bun**, **React**, and **WebAssembly (WASM)**.

## Features

- **Fast Backend**: Powered by ElysiaJS and Bun for blazing-fast API responses
- **Modern React UI**: Beautiful, responsive interface with smooth interactions
- **WebAssembly Integration**: High-performance todo filtering and sorting using WASM
- **Full CRUD Operations**: Create, Read, Update, and Delete todos
- **Advanced Filtering**: Filter by completion status and priority
- **Flexible Sorting**: Sort by creation date, update date, title, or priority
- **Priority Management**: Organize todos with low, medium, and high priorities
- **Real-time Updates**: Instant feedback on all operations

## Tech Stack

### Backend
- **ElysiaJS**: Fast and ergonomic web framework for Bun
- **Bun**: Ultra-fast JavaScript runtime and package manager
- TypeScript for type safety

### Frontend
- **React 18**: Modern UI library with hooks
- **Vite**: Lightning-fast build tool and dev server
- **TypeScript**: Full type safety across the application

### Performance
- **WebAssembly**: AssemblyScript-compiled WASM for efficient data operations
- Optimized sorting and filtering algorithms

## Project Structure

```
bun-todo/
├── backend/              # ElysiaJS API server
│   ├── src/
│   │   └── index.ts     # Main server file with routes
│   ├── package.json
│   └── tsconfig.json
├── frontend/            # React application
│   ├── public/
│   │   └── wasm/        # WASM modules
│   ├── src/
│   │   ├── App.tsx      # Main React component
│   │   ├── App.css      # Styles
│   │   ├── api.ts       # API client
│   │   ├── types.ts     # TypeScript definitions
│   │   ├── useWasm.ts   # WASM hook
│   │   └── main.tsx     # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── wasm/                # WebAssembly module
│   ├── src/
│   │   └── index.ts     # AssemblyScript source
│   ├── build/           # Compiled WASM output
│   ├── package.json
│   └── asconfig.json
└── package.json         # Root workspace config
```

## Prerequisites

- [Bun](https://bun.sh) v1.3.2 or higher

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bun-todo
```

2. Install dependencies:
```bash
bun install
```

3. Build the WASM module:
```bash
bun run build:wasm
```

## Running the Application

### Development Mode

Start both backend and frontend concurrently:
```bash
bun run dev
```

Or run them separately:

**Backend only:**
```bash
bun run dev:backend
```
The API will be available at `http://localhost:3000`

**Frontend only:**
```bash
bun run dev:frontend
```
The UI will be available at `http://localhost:5173`

### Production Build

Build all components:
```bash
bun run build
```

Start the production server:
```bash
bun run start
```

## API Endpoints

### GET /todos
Get all todos with optional filtering and sorting.

**Query Parameters:**
- `completed` (boolean): Filter by completion status
- `priority` (string): Filter by priority (low, medium, high)
- `sortBy` (string): Sort field (createdAt, updatedAt, title, priority)
- `sortOrder` (string): Sort order (asc, desc)

**Example:**
```bash
curl "http://localhost:3000/todos?completed=false&priority=high&sortBy=createdAt&sortOrder=desc"
```

### POST /todos
Create a new todo.

**Body:**
```json
{
  "title": "Learn WASM",
  "description": "Build a WASM module",
  "priority": "high"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn WASM","priority":"high"}'
```

### PUT /todos/:id
Update an existing todo.

**Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "priority": "medium"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### DELETE /todos/:id
Delete a todo.

**Example:**
```bash
curl -X DELETE http://localhost:3000/todos/1
```

### GET /health
Health check endpoint.

## WebAssembly Features

The WASM module (written in AssemblyScript) provides high-performance operations:

- **Efficient filtering**: Filter todos by completion status and priority
- **Optimized sorting**: QuickSort implementation for large datasets
- **Memory management**: Efficient array operations
- **Statistics calculation**: Fast computation of todo statistics

The WASM module is compiled from AssemblyScript, which provides a TypeScript-like syntax that compiles to WebAssembly for near-native performance.

## Development

### Backend Development

The backend uses ElysiaJS, which provides:
- Fast routing with type safety
- Built-in request validation
- CORS support
- JSON serialization

Edit `backend/src/index.ts` to modify API routes and logic.

### Frontend Development

The frontend is built with React and uses:
- Functional components with hooks
- TypeScript for type safety
- CSS-in-CSS styling with modern features
- Responsive design

Edit files in `frontend/src/` to modify the UI.

### WASM Development

The WASM module uses AssemblyScript:
- Write TypeScript-like code
- Compile to optimized WASM
- Import in React for high-performance operations

Edit `wasm/src/index.ts` and rebuild:
```bash
cd wasm
bun run build
```

## Performance Optimizations

1. **Bun Runtime**: Uses Bun's fast JavaScript engine for server-side operations
2. **ElysiaJS**: Optimized routing and request handling
3. **WASM**: Critical operations compiled to WebAssembly
4. **Vite**: Fast HMR and optimized production builds
5. **In-memory Storage**: Quick data access (can be upgraded to SQLite)

## Future Enhancements

- [ ] Add SQLite database for persistent storage
- [ ] Implement user authentication
- [ ] Add todo categories/tags
- [ ] Enable drag-and-drop reordering
- [ ] Add due dates and reminders
- [ ] Implement search functionality
- [ ] Add dark/light theme toggle
- [ ] Create mobile app with React Native
- [ ] Add real-time sync with WebSockets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- [Bun](https://bun.sh) - Fast all-in-one JavaScript runtime
- [ElysiaJS](https://elysiajs.com) - Ergonomic web framework
- [React](https://react.dev) - UI library
- [AssemblyScript](https://www.assemblyscript.org) - TypeScript to WASM compiler
- [Vite](https://vitejs.dev) - Next generation frontend tooling

---

**Built with ❤️ using Bun, ElysiaJS, React, and WebAssembly**
