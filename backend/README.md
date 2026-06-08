# CloseMate AI Backend

AI-powered assistant API for salespeople and insurance agents.

## Features
- **Auth**: JWT-based signup and login with 14-day free trial.
- **AI Integration**: OpenAI-powered objection handling, sales script generation, and lead response suggestions.
- **Subscription**: Stripe integration for Pro plan subscriptions.
- **Usage Tracking**: Free tier limits (5/day) enforced after trial expiry.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your API keys (OpenAI, Stripe, JWT Secret)

3. Initialize Database:
   The database is automatically initialized on first run.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## API Endpoints

### Auth
- `POST /api/auth/signup`: Create a new account with a 14-day trial.
- `POST /api/auth/login`: Authenticate and get a JWT token.

### AI
- `POST /api/ai/objection-handle`: Handle sales objections.
- `POST /api/ai/generate-script`: Generate sales scripts.
- `POST /api/ai/suggest-response`: Suggest responses to lead messages.

### User
- `GET /api/user/usage`: Get current usage stats and subscription status.

### Subscription
- `POST /api/subscription/create-checkout-session`: Create a Stripe Checkout session.
- `POST /api/subscription/webhook`: Handle Stripe webhooks.
