# Ethio Tourism — Setup and Testing Guide

## 1. Requirements

- Node.js 20.9 or later (compatible supported LTS release).
- npm and Git (optional).

## 2. Installation and Setup

1. Open the project root in your terminal.
2. Install dependencies:

   ```bash
   npm ci
   ```

   Use `npm install` if `package-lock.json` is unavailable.

3. Copy `.env.example` to `.env.local` and configure the required variables, including `SESSION_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`, if required by your code.
4. Configure email services such as Resend if implemented.
5. Start the application:

   ```bash
   npm run dev
   ```

6. Open http://localhost:3000.

Never commit secrets or real credentials to GitHub.

## 3. User Roles

- **Customer:** Register, verify email if configured, log in, browse destinations, submit bookings, and view personal bookings.
- **Staff:** Manage booking statuses according to assigned permissions.
- **Administrator:** Manage user roles and review payment requests.

Enforce authentication and authorization on the server. Public registration must not allow users to assign themselves privileged roles.

## 4. Functional and Security Testing

- Test registration, login, and email verification.
- Submit a test booking and verify its status.
- Test staff booking management and administrator controls.
- Confirm customers cannot access other users' bookings or administrator APIs.
- Verify payments through trusted provider records before marking them as paid.
- Build the project:

  ```bash
  npm run build
  ```

- Run security tests if the script exists in `package.json`:

  ```bash
  npm run test:security
  ```

Document actual results and investigate failures.

## 5. Data Persistence

The current `lib/store.js` uses in-memory storage. Data may disappear after a restart and is unsuitable for production.

Before production, use a persistent database such as PostgreSQL, secure session storage, input validation, authorization, rate limiting, and audit logging.

## 6. Security and Deployment

- Exclude `.env.local` from Git.
- Use strong passwords and a securely generated session secret.
- Rotate any exposed credentials.
- Configure production environment variables securely.
- Test authentication, email verification, payments, and authorization before deployment.
- Never use the demonstration store for real customer data or live payments.
