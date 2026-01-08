# Backend - Address API

Spring Boot REST API providing address data (countries, regions, cities) for the address picker application.

## Overview

RESTful API service that provides:
- List of countries
- Regions/provinces for a given country
- Cities for a given region

## Tech Stack

- **Java** 17
- **Spring Boot** 4.0.1
- **Maven** - Build tool
- **Lombok** - Reduces boilerplate code

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+ (or use included `./mvnw` wrapper)

### Running the Application

#### Using Maven Wrapper

```bash
./mvnw spring-boot:run
```

#### Using Maven (if installed)

```bash
mvn spring-boot:run
```

The API will be available at http://localhost:8080

### Building

```bash
./mvnw clean package
```

This creates a JAR file in `target/backend-0.0.1-SNAPSHOT.jar`

### Running the JAR

```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

## API Endpoints

### Get All Countries

```http
GET /api/countries
```

**Response:**
```json
[
  {
    "code": "NL",
    "name": "Netherlands"
  },
  {
    "code": "DE",
    "name": "Germany"
  }
]
```

### Get Regions for a Country

```http
GET /api/countries/{countryCode}/regions
```

**Example:**
```http
GET /api/countries/NL/regions
```

**Response:**
```json
[
  {
    "code": "NL-NH",
    "name": "North Holland"
  },
  {
    "code": "NL-ZH",
    "name": "South Holland"
  }
]
```

### Get Cities for a Region

```http
GET /api/regions/{regionCode}/cities
```

**Example:**
```http
GET /api/regions/NL-NH/cities
```

**Response:**
```json
[
  {
    "code": "AMS",
    "name": "Amsterdam"
  },
  {
    "code": "HAAR",
    "name": "Haarlem"
  }
]
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/github/mmahabadi/address/
│   │   │   ├── BackendApplication.java    # Main application class
│   │   │   ├── controller/
│   │   │   │   └── AddressController.java # REST endpoints
│   │   │   ├── model/
│   │   │   │   ├── Country.java
│   │   │   │   ├── Region.java
│   │   │   │   └── City.java
│   │   │   └── service/
│   │   │       └── AddressService.java   # Business logic
│   │   └── resources/
│   │       └── application.properties     # Configuration
│   └── test/                               # Test files
├── pom.xml                                 # Maven configuration
└── Dockerfile                              # Docker configuration
```

## Configuration

Application configuration is in `src/main/resources/application.properties`:

```properties
server.port=8080
```

## Data Source

Currently, the application uses mock/hardcoded data in `AddressService.java`. In a production environment, this could be replaced with a database connection.

## Testing

### Run Tests

```bash
./mvnw test
```

## Docker

### Build

```bash
docker build -t backend .
```

### Run

```bash
docker run -p 8080:8080 backend
```

The Dockerfile uses a multi-stage build:
1. Build stage: Compiles the application using Maven
2. Production stage: Creates a lightweight JRE-only image

## Maven Commands

- `./mvnw spring-boot:run` - Run the application
- `./mvnw clean package` - Build JAR file
- `./mvnw test` - Run tests
- `./mvnw clean` - Clean build artifacts

## License

ISC

