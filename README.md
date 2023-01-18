<p align="center">
  <a href="https://ivorysoft.co/" target="blank"><img src="https://ivorysoft.co/logo/IvorysoftLogo.svg" width="200" alt="IvorySoft Logo" /></a>
</p>

  <p align="center">Example of back-end project based on progressive NestJs framework with using actual technologies and best practices</p>
    <p align="center">
    
## Description

This project is example of IvorySoft code best practices and have realization of next functionallity:
- Creating new user, login through email and password
- Guard for API via roles
- Swagger API Documentation on `/api-docs` endpoint
- OWASP Security Practices
  - Helmet
  - Request Content Size Limits ([json and urlencoded](src/common/middlewares) middlewares)
  - Strict input validation ([validation pipe](src/main.ts))
  - [All Exception / Sequelize Error Handler](src/common/filters/all-exception.filter.ts) 
- Sequelize ORM and User model for **PostgreSQL**
- AWS: Configured `buildspec.yml`, `Procfile`

## Requirements

This project based on NodeJS, but require additional technologies for launch and work.
Before launch project you need make sure that you have working Redis server and installed Postgres Database.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Authors - [Denis Dunaievskiy](https://github.com/Denver23) | [Dmitry Donchenko](https://github.com/dmitrydnch)
- Website - [https://ivorysoft.co/](https://ivorysoft.co/)
- Instagram - [@ivorysoft.co](https://www.instagram.com/ivorysoft.co/)
