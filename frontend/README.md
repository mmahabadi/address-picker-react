# Frontend - Address Picker React Application

React + TypeScript application implementing a delivery address picker component with a smart caching mechanism.

## Overview

The frontend provides a user-friendly interface for selecting delivery addresses:

- Country selection → Region selection → City selection → Address details
- Smart caching to minimize backend API requests
- Generic, reusable caching mechanism

## Features

- **Address Picker Flow**: Country → Region → City → Details
- **Smart Caching**: Caches API responses to minimize backend requests
- **Request Deduplication**: Prevents duplicate API calls
- **Generic Cache**: Supports caching any data type
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on all screen sizes

## Tech Stack

- **React** 19.2.0
- **TypeScript** 5.9.3
- **Vite** 7.2.4
- **Tailwind CSS** 4.1.18
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

## Getting Started

### Prerequisites

- Node.js >= 20
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── assets/           # Static assets
│   │   └── react.svg
│   ├── components/       # React components
│   │   ├── AddressPicker/
│   │   ├── AddressForm/
│   │   ├── AddressDetailsForm/
│   │   ├── AddressSummary/
│   │   ├── ErrorAlert/
│   │   ├── Input/
│   │   └── Select/
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   │   ├── useCachedFetcher.ts    # Generic caching hook
│   │   ├── useAddressData.ts      # Address data hook
│   ├── test/             # Test setup and mocks
│   ├── utils/            # Utility functions
│   │   ├── cache.ts      # Cache implementation
│   │   ├── cacheKey.ts   # Cache key generation
│   │   ├── requests.ts   # Request manager
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Main app component
│   ├── App.test.tsx      # App tests
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Public static assets
├── dist/                 # Build output
├── Dockerfile            # Docker configuration
├── nginx.conf            # Nginx configuration
├── vite.config.ts        # Vite configuration
├── vitest.config.ts      # Vitest configuration
├── tsconfig.json         # TypeScript configuration
├── eslint.config.js      # ESLint configuration
└── package.json          # Dependencies and scripts
```

## Caching Mechanism

The application implements a generic caching system with the following features:

### Features

- **TTL (Time To Live)**: Configurable cache expiration (default: 5 minutes)
- **Request Deduplication**: Prevents duplicate requests for the same data
- **Generic Support**: Can cache any data type, not just address data
- **Automatic Cleanup**: Periodic cleanup of expired cache entries

### Usage

```typescript
import { useCachedFetcher } from './hooks/useCachedFetcher';

const { data, loading, error, fetchData } = useCachedFetcher<Country[]>();

// Fetch data (automatically cached)
await fetchData('/api/countries');
```

### Cache Configuration

The cache is configured in `src/utils/cache.ts`:

- Default TTL: 5 minutes
- Automatic cleanup: Every 5 minutes
- Storage: In-memory Map

## API Integration

The frontend communicates with the backend API:

- `GET /api/countries` - Get all countries
- `GET /api/countries/{countryCode}/regions` - Get regions for a country
- `GET /api/regions/{regionCode}/cities` - Get cities for a region

API calls are automatically cached and deduplicated.

## Development Proxy

In development mode, Vite proxies `/api` requests to `http://localhost:8080` (backend).

Configuration in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

## Testing

### Run Tests

```bash
npm test
```

### Coverage

```bash
npm run test:coverage
```

## Docker

### Build

```bash
docker build -t frontend .
```

### Run

```bash
docker run -p 5173:80 frontend
```

The Docker image uses nginx to serve the built application and proxy API requests to the backend.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

ISC
