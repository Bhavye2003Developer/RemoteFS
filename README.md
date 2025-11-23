# RemoteFS

A lightweight local-network file management application for browsing, uploading, downloading, and managing files on a host machine from any device on your LAN.

<p><img src="https://github.com/user-attachments/assets/9e60ae4b-92cc-4955-bb7a-156ab406f94f" alt="RemoteFS UI" width="300"></p>

## Overview

RemoteFS provides a clean web interface for essential file system operations with real-time updates. Built for home networks, internal tools, and lightweight remote management scenarios.

## Features

- **Real-time sync** via WebSocket connections
- **Auto-refresh** on file system changes using Chokidar
- **File operations**: upload, download, create, delete
- **Folder management**: create, navigate, delete (folders downloaded as ZIP)
- **Search** with instant filtering
- **Responsive UI** built with React and shadcn/ui
- **Live connection status** indicator

## Tech Stack

**Frontend**

- React (Vite + React Router) + shadcn/ui
- TailwindCSS
- Zustand for state management
- WebSocket client

**Backend**

- Node.js
- Express
- WebSocket server
- Archiver for folder compression
- Chokidar for file system watching

**Build System**

- Turborepo for monorepo orchestration

## Project Structure

```
apps/
  ├── client/       # React frontend
  ├── server/       # Node.js backend
packages/
  └── utils/        # Shared utilities and types
turbo.json          # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd remotefs

# Install dependencies
npm install
```

### Configuration

1. Find your local IP address:
   - **Windows**: Run `ipconfig`
   - **macOS**: Run `ifconfig`
   - **Linux**: Run `ip a`

2. Open `./packages/utils/constants.ts`

3. Set your local IP:
   ```typescript
   export const SYSTEM_IP = "192.168.1.x"; // Replace with your IP
   ```

### Development

```bash
# Start both client and server
npm run dev
```

The build system will automatically initialize both applications.

Access the application:

- **Desktop**: `http://<your-ip>:5173`
- **Mobile**: `http://<your-ip>:5173` (same network required)

## Architecture

RemoteFS uses a WebSocket-based architecture for real-time communication:

1. Client establishes persistent WebSocket connection
2. Chokidar watches the current directory for file system changes
3. File operations trigger WebSocket messages
4. Server processes filesystem changes (folders compressed using Archiver for download)
5. Server broadcasts updates to connected clients
6. UI automatically refreshes

### API

**HTTP Endpoints**

- `POST /upload` - Upload files
- `GET /download?fileInfo=...` - Download files

**WebSocket Events**

- `FETCH` - Retrieve directory contents
- `ADD` - Create file or folder
- `DELETE` - Remove file or folder
- `DOWNLOAD` - Download file or folder

## License

This project is licensed under the MIT License.
