# NextJS + Rails API PayPal Subscription Demo

This project demonstrates a PayPal subscription system using a NextJS frontend and Rails API backend.

## Project Structure

- `subscription-frontend/`: NextJS frontend application
- `subscription-api/`: Rails API backend application

## Prerequisites

- Node.js (v18+)
- Ruby (v3.0+)
- Rails (v7.0+)
- PostgreSQL
- PayPal Developer Account (for API credentials and subscription plans)

## Setup Instructions

### 1. Backend Setup (Rails API)

1. Navigate to the backend directory:

   ```bash
   cd subscription-api
   ```

2. Install dependencies:

   ```bash
   bundle install
   ```

3. Set up the database:

   ```bash
   rails db:create db:migrate
   ```

4. Start the Rails server:
   ```bash
   rails s -p 3001
   ```

### 2. Frontend Setup (NextJS)

1. Navigate to the frontend directory:

   ```bash
   cd subscription-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file with your PayPal credentials (as described in Environment Variables section below)

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables and Credentials

### Frontend Environment Variables

Create a `.env.local` file in the root of the `subscription-frontend` directory with the following content:

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
NEXT_PUBLIC_PAYPAL_BASIC_PLAN_ID=your_basic_plan_id
NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID=your_premium_plan_id
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

For production, create a `.env.production` file with your production values:

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_production_paypal_client_id
NEXT_PUBLIC_PAYPAL_BASIC_PLAN_ID=your_production_basic_plan_id
NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID=your_production_premium_plan_id
NEXT_PUBLIC_API_URL=https://your-production-api.com/api
```

### Backend Credentials

The Rails API application uses encrypted credentials to store sensitive information:

1. Check if `config/master.key` exists. If not, generate new credentials:

   ```bash
   cd subscription-api
   rails credentials:edit
   ```

2. Add your PayPal credentials in this format:

   ```yaml
   paypal_client_id: your_paypal_client_id
   paypal_client_secret: your_paypal_client_secret
   api_key: your_api_key_for_receipt_downloads
   ```

3. Save and close the editor. This will encrypt your credentials.

For additional environment configuration, create a `.env` file in the `subscription-api` root:

```
# Database configuration (if needed)
DATABASE_URL=postgres://username:password@localhost:5432/subscription_development

# Rails environment
RAILS_ENV=development
```

### Obtaining PayPal Credentials

1. Create a PayPal Developer account at [developer.paypal.com](https://developer.paypal.com)
2. Create an app in the PayPal Developer Dashboard to get your client ID and secret
3. Set up subscription plans in the PayPal dashboard and note their IDs for your environment variables

### Security Notes

- Never commit environment files (`.env*`) or `config/master.key` to your repository
- For production deployment, set environment variables on your hosting platform rather than using files
- For the Rails app, ensure `RAILS_MASTER_KEY` is properly set in your production environment

## Features

- **Subscription Plans**: Basic Plan ($139/month) and Premium Plan ($199/month)
- **PayPal Integration**: Seamless subscription creation via PayPal
- **Billing Page**: View subscription details and payment history
- **Receipt Generation**: Background job for receipt generation

## API Endpoints

- `GET /api/health`: Health check endpoint
- `POST /api/company_subscription`: Create a new subscription
- `GET /api/payments`: Get payment history
- `GET /api/receipts/:id`: Get receipt details for a payment

## Deployment

### Backend Deployment

1. Configure your production database in `config/database.yml`
2. Add your PayPal credentials to Rails credentials
3. Deploy to your preferred hosting platform (Heroku, AWS, etc.)
4. Run database migrations on the production server
5. Set up a job scheduler for background jobs (such as Sidekiq)
6. Ensure `RAILS_MASTER_KEY` is set in your production environment

### Frontend Deployment

1. Build the NextJS app:

   ```bash
   npm run build
   ```

2. Deploy the built files to your preferred hosting platform
3. Set the environment variables for your production environment

## Production Considerations

- Set up SSL for secure communication
- Configure CORS properly for the API
- Implement proper error monitoring and logging
- Consider implementing a centralized logging system
- Set up automated backups for the database

## Testing

### Backend Tests

```bash
cd subscription-api
rails test
```

### Frontend Tests

```bash
cd subscription-frontend
npm test
```

## Notes

This is a demonstration project and not intended for production use without additional security and feature enhancements.

The PayPal integration is using the sandbox mode for testing purposes.
