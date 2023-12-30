# BTC-CHALLENGE

![image](https://github.com/ssbreno/btc-challenge/assets/8092325/773c2497-6b16-49d0-b76e-2636e150e297)

## Introduction

BTC-CHALLENGE is a simulation platform for financial transactions with Bitcoin (BTC). It allows users to buy and sell BTC based on real-time market data from an external API. The project is designed to provide a realistic experience of cryptocurrency trading.

## Technologies Used

- Docker
- Fastify (Node.js framework)
- JestJs (Testing framework)
- TypeORM (ORM for PostgreSQL)
- PostgreSQL (Database)
- MailJet (Email service)
- Other Libraries: Prettier (Code formatter), ESLint (Linter)

## Future Improvements

- Implements Bull with RabbitMQ
- Implements Redis to help postgresql

## Requirements

- Docker and Docker Compose

## Documentation

API documentation is available at [Local API Docs](http://localhost:3001/api) once the project is running.

## Getting Started

To run the BTC-CHALLENGE project on your local machine, follow these steps:

1. **Environment Setup**: Create a `.env` file based on the provided `.env-local` template.
2. **Install Dependencies**: Run `npm install` to install required dependencies.
3. **Build Containers**: Use `docker-compose build` to build the Docker containers.
4. **Start Containers**: Execute `docker-compose up -d` to start the containers in detached mode.
5. **Database Migration**: Run `npm run migrate:run` to apply database migrations.
6. **Start the Application**: Use `npm run start` to start the application.

You can import all endpoint configurations from the `/docs` folder into Postman for API testing.

## Testing

To run the test suite, simply execute:

```bash
npm test
```

### Conclusion

BTC-CHALLENGE is an ongoing project aimed at providing a comprehensive platform for simulating Bitcoin trading. Your contributions and feedback are welcome!

<img width="635" alt="image" src="https://github.com/ssbreno/btc-challenge/assets/8092325/2d761dd4-8810-4831-bd4d-33316ed6b156">
