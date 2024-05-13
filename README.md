# manager-bank-api

This project aims to implement a REST API that simulates banking operations, using the Nest.js framework to uphold principles of software design and clean architecture.

## Pre-requisites 
- Node.js
- Docker

## Usage

Follow these steps to get the project up and running:
1. Clone the repository.
2. Execute `npm install` to install dependencies.
3. Rename `.env.example` to `.env`.
4. Use `docker-compose up` to start the service.

⚠️ Ensure that all containers are fully operational before proceeding. The necessary database migrations will automatically execute.

✅ Once everything is set up, access the API documentation at: `http://localhost:3000/docs`

## Unit Testing

Run unit tests with the following command:
```bash
$ npm run test
```

## End-to-End Testing

For E2E testing, you need to install global dependencies and start the test environment:

1. Install dotenv CLI globally with `npm install -g dotenv-cli`.
2. Start the Docker containers for testing using `docker-compose -f docker-compose.test.yaml up -d`.

Then, run the E2E tests with:
```bash
$ npm run test:e2e
```