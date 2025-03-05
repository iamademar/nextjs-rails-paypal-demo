# Testing Guide

This project includes comprehensive testing for both the Rails API backend (with RSpec) and the Next.js frontend (with Jest).

## Backend Testing (RSpec)

The Rails API uses RSpec for testing models, controllers, and requests.

### Setup

1. Make sure you have all required gems installed:

```bash
cd subscription-api
bundle install
```

2. Set up the test database:

```bash
rails db:test:prepare
```

### Running Tests

To run all backend tests:

```bash
cd subscription-api
bundle exec rspec
```

To run specific test files:

```bash
bundle exec rspec spec/models/subscription_spec.rb
bundle exec rspec spec/controllers/api/health_controller_spec.rb
```

### Test Structure

- `spec/models/`: Tests for ActiveRecord models
- `spec/controllers/`: Tests for API controllers
- `spec/factories/`: FactoryBot factories for test data
- `spec/support/`: Shared helper methods and configurations

## Frontend Testing (Jest)

The Next.js frontend uses Jest with React Testing Library for testing components and hooks.

### Setup

Ensure you have all the required testing dependencies installed:

```bash
cd subscription-frontend
npm install
```

### Running Tests

To run all frontend tests:

```bash
cd subscription-frontend
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

### Test Structure

- `app/components/__tests__/`: Tests for React components
- `app/hooks/__tests__/`: Tests for custom React hooks

## Test Coverage

To generate test coverage reports for the Rails API:

```bash
cd subscription-api
COVERAGE=true bundle exec rspec
```

The coverage report will be available at `subscription-api/coverage/index.html`.

For the Next.js frontend:

```bash
cd subscription-frontend
npm test -- --coverage
```

## CI/CD Integration

To integrate these tests with CI/CD systems, you can run:

```bash
# Backend tests
cd subscription-api
bundle exec rspec

# Frontend tests
cd subscription-frontend
npm test -- --ci
```

## Writing New Tests

### Rails Backend

1. Models: Test validations, associations, and custom methods
2. Controllers: Test request/response lifecycles and status codes
3. Use FactoryBot to generate test data

### Next.js Frontend

1. Components: Test rendering and user interactions
2. Hooks: Test state changes and side effects
3. Mock API requests and external dependencies
