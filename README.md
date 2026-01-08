# Address Picker React Application

A delivery address picker component for an international online marketplace with a smart caching mechanism to minimize backend requests.

## Overview

This project implements a complete address picker solution:

- **Address Picker Component**: Country → Region → City selection flow
- **Reusable Caching Mechanism**: Generic frontend caching to minimize API requests
- **Backend API**: Spring Boot REST API
- **Docker Support**: Containerized frontend and backend
- **Algorithm Solution**: Path finding algorithm

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
docker-compose up
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

### Option 2: Local Development

**Start Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Start Frontend** (in another terminal):
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure

```
.
├── frontend/          # React application
├── backend/          # Spring Boot API
├── algorithm/        # Algorithmic task solution
└── docker-compose.yaml
```

## Documentation

For detailed information about each part of the project:

- **[Frontend README](frontend/README.md)** - React app setup, features, and development
- **[Backend README](backend/README.md)** - Spring Boot API setup and endpoints
- **[Algorithm README](algorithm/README.md)** - Algorithm solution details

## Requirements

- **Node.js** >= 20
- **Java** 17+
- **Maven** (included as `./mvn` wrapper)
- **Docker** (optional, for containerized deployment)

## License

ISC
