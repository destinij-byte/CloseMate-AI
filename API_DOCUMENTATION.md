# CloseMate AI - API Documentation (FlutterFlow Compatible)

This document provides the exact request and response schemas for the CloseMate AI backend API, designed for easy integration with FlutterFlow's API Configuration.

## Base URL
`https://YOUR_BACKEND_URL/api`

## Authentication
Most endpoints require a JWT token in the header:
- **Header Key:** `Authorization`
- **Header Value:** `Bearer [YOUR_JWT_TOKEN]`

---

## 1. Auth: Signup
Create a new user account.

- **Method:** `POST`
- **Path:** `/auth/signup`
- **Request Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
- **Response (201 Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "subscriptionStatus": "free",
    "trialEndsAt": "2026-06-22T12:00:00.000Z"
  }
}
```
- **Response (400 Error):**
```json
{
  "message": "Email already exists"
}
```

---

## 2. Auth: Login
Authenticate an existing user.

- **Method:** `POST`
- **Path:** `/auth/login`
- **Request Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
- **Response (200 Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "subscriptionStatus": "free",
    "trialEndsAt": "2026-06-22T12:00:00.000Z"
  }
}
```

---

## 3. AI: Handle Objection
Generate a script to handle a sales objection.

- **Method:** `POST`
- **Path:** `/ai/objection-handle`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body (JSON):**
```json
{
  "objection": "It's too expensive",
  "context": "Selling life insurance to a young couple"
}
```
- **Response (200 Success):**
```json
{
  "script": "I understand that budget is a priority for you. Many of our clients felt the same way until they saw the long-term value..."
}
```
- **Response (403 Limit Reached):**
```json
{
  "message": "Daily limit reached. Upgrade for unlimited access."
}
```

---

## 4. AI: Generate Sales Script
Generate a tailored sales script for a specific product and scenario.

- **Method:** `POST`
- **Path:** `/ai/generate-script`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body (JSON):**
```json
{
  "scenario": "Cold call",
  "product": "Term Life Insurance",
  "target_audience": "New parents"
}
```
- **Response (200 Success):**
```json
{
  "script": "Hi [Lead Name], this is [Your Name] from [Company]. I'm calling because we've helped many new parents like yourself..."
}
```

---

## 5. AI: Suggest Response
Suggest a reply to a message received from a lead.

- **Method:** `POST`
- **Path:** `/ai/suggest-response`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body (JSON):**
```json
{
  "leadMessage": "Can you send me more details?",
  "lastInteraction": "Sent them a brochure yesterday"
}
```
- **Response (200 Success):**
```json
{
  "suggestion": "Absolutely! I'd be happy to. Beyond the brochure, are there specific areas you have questions about?"
}
```

---

## 6. User: Get Usage & Status
Get current usage statistics and subscription status for the authenticated user.

- **Method:** `GET`
- **Path:** `/user/usage`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 Success):**
```json
{
  "subscriptionStatus": "trialing",
  "trialEndsAt": "2026-06-22T12:00:00.000Z",
  "daysRemaining": 14,
  "dailyUsage": 2,
  "dailyLimit": "unlimited"
}
```
*Note: `dailyLimit` will return "unlimited" for paid or trialing users, and `5` for free users.*

---

## 7. Subscription: Create Checkout Session
Generate a Stripe Checkout URL for upgrading to the Pro Plan.

- **Method:** `POST`
- **Path:** `/subscription/create-checkout-session`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 Success):**
```json
{
  "id": "cs_test_a1b2c3...",
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

---

## 8. Subscription: Get Status
Quickly check the subscription tier.

- **Method:** `GET`
- **Path:** `/subscription/status`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 Success):**
```json
{
  "tier": "paid"
}
```
*Tiers: `free`, `trialing`, `paid`*

---

## FlutterFlow Integration Tips

### 1. Variables
In FlutterFlow's API Call settings, use **Variables** for dynamic content:
- `token` (String) - Passed in the Header as `Bearer [token]`
- `objection`, `context`, `scenario`, `product`, etc. - Passed in the JSON Body.

### 2. JSON Paths
To extract data from the response in FlutterFlow, use these JSON Paths:
- **Token:** `$.token`
- **AI Script:** `$.script`
- **AI Suggestion:** `$.suggestion`
- **Days Remaining:** `$.daysRemaining`
- **Stripe URL:** `$.url`

### 3. Error Handling
Always check the **Action Output > Succeeded** boolean in FlutterFlow. If the API returns a 403 or 400, you can show a SnackBar or navigate the user to the Pricing page.
