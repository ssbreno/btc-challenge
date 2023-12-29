# BTC-CHALLENGE

![Code Coverage](https://img.shields.io/badge/Code%20Coverage-36%25-critical?style=flat)

## Introduction

BTC-CHALLENGE is a simulation platform for financial transactions with Bitcoin (BTC). It allows users to buy and sell BTC based on real-time market data from an external API. The project is designed to provide a realistic experience of cryptocurrency trading.

## Technologies Used

- Docker
- Fastify (Node.js framework)
- JestJs (Testing framework)
- TypeORM (ORM for TypeScript)
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

### Enhancements Made:

- **Introduction Section**: Provides a brief overview of the project.
- **Technologies Used**: Clarified the role of each technology in the project.
- **Getting Started**: Step-by-step guide on how to set up and run the project.
- **Testing**: Separate section for how to run tests.
- **Conclusion**: A closing note that invites contributions and feedback.

Feel free to adjust the content according to the specifics of your project and its current state. A well-documented `README.md` significantly contributes to the user experience of anyone who visits your repository.
