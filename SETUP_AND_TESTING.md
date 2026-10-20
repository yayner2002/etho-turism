# Ethio Tourism — Setup and Functional Test Guide

## 1. Requirements

- Node.js 20.9 or later, preferably a supported Node.js LTS release compatible with the project.
- npm.
- Git, if you plan to commit and push changes to GitHub.

## 2. Run the Project Locally

1. Extract the project archive, if you are starting from a ZIP file.
2. Open a terminal in the project root.
3. Install dependencies:

   ```bash
   npm ci
   ```

   This command requires a valid `package-lock.json`. If the project does not include one, use `npm install` instead.

4. Copy `.env.example` to `.env.local` using the appropriate command for your operating system.
5. Configure the required environment variables in `.env.local`. Use a cryptographically secure, randomly generated `SESSION_SECRET` containing at least 32 bytes of secret material. Set a strong, unique `ADMIN_PASSWORD` and the intended `ADMIN_EMAIL`.
6. If real email verification is implemented and required, configure Resend with a valid API key and verified sender. Never use example credentials in production.
7. Start the development server:

   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

Check `.env.example` and the application configuration for the exact environment variable names required by your project. Do not expose secret values in logs, screenshots, or Git commits.

## 3. Roles and Main User Flows

### Customer

- Register with a valid email address and password.
- Complete email verification if real email verification is configured and implemented.
- Sign in and browse destinations.
- Submit booking requests.
- View only their own bookings.
- Manage favorites and view notifications, where those features are implemented.

### Staff

- Staff accounts must be provisioned by an authorized administrator.
- Review bookings and update booking statuses according to the application's permissions.
- Do not receive permission to manage user roles or access administrator-only user and payment controls.

### Administrator

- Sign in using the administrator credentials configured on the server.
- Manage account roles and review payment requests.
- Verify payment transactions against trusted provider or bank records before marking payments as paid.

Public registration must create customer accounts only. The server must reject attempts to assign privileged roles through registration request data. Administrator access and permissions must be enforced on the server, not just hidden in the interface.

## 4. Functional and Security Tests

Run these tests in a development or staging environment with test data.

1. **Customer registration:** Register using a valid email address and a password of at least 12 characters, if that is the application's configured minimum. Verify the account using the delivered link if real email delivery is configured.

2. **Customer booking:** Sign in as the customer, select a listed destination, submit a booking for a future date, and verify that the booking appears in the customer's dashboard.

3. **Staff booking management:** Sign in as staff, approve or cancel a test booking, and verify that the updated status and any applicable notification are visible to the customer.

4. **Administrator controls:** Sign in as the administrator and test account-role management and payment-request review. Do not remove or demote the only administrator account.

5. **Authentication and authorization:** Verify that unauthenticated requests to protected booking APIs are rejected, customers cannot access another customer's booking by changing its ID, and customers cannot access administrator APIs or perform administrator-only actions.

6. **Payment verification:** Test pending, approved, and rejected payment states using test records. Confirm that a payment cannot be marked as paid without the required server-side verification.

7. **Production build:** Run:

   ```bash
   npm run build
   ```

8. **Security test script:** Start the application in one terminal. In a second terminal, run:

   ```bash
   npm run test:security
   ```

   Make sure the script exists in `package.json` and that its configured base URL points to the running test application. Review the results and investigate any failures.

Document the actual test results. Do not describe a feature or security test as successful until it has been verified.

## 5. Important Limitation: Data Persistence

The current `lib/store.js` implementation uses an in-memory demonstration store.

This means data may disappear when the server restarts, and state may not be shared reliably across multiple server instances. In-memory storage is not appropriate for production customer accounts, bookings, payment records, or persistent sessions.

Before using this application with real customer data, implement durable storage, such as PostgreSQL, with:

- Database migrations and appropriate indexes.
- Unique constraints for account email addresses.
- Transactions for operations that require consistency.
- Secure, persistent session handling.
- Server-side authorization and input validation.
- Appropriate rate limits and audit logging.
- Reliable persistence for bookings and payment records.

Real payments must not be accepted or confirmed solely on the basis of a user-submitted reference or a dashboard action. Integrate and verify the payment provider's trusted confirmation process before marking a transaction as paid.

## 6. Security and Environment Variables

- Never commit or distribute `.env.local` or other files containing secrets.
- Ensure secret-bearing files are excluded through `.gitignore`.
- Keep `.env.example` limited to variable names and safe placeholder values.
- If credentials were exposed in an archive, repository, screenshot, or shared file, rotate the affected session secret, administrator password, email API key, payment API key, and any other exposed credentials.
- Use legitimate payment-provider account details and follow the provider's integration requirements.
- Review authorization, input validation, session security, and error handling before deployment.

## 7. Before Production Deployment

Do not deploy the in-memory demonstration implementation for real customer data or live payments.

Before production use:

1. Replace the in-memory store with a durable database.
2. Verify authentication, role authorization, and session handling.
3. Configure and test real email verification if required.
4. Integrate trusted payment verification.
5. Run the production build and security tests.
6. Configure production environment variables securely.
7. Test the deployed application using non-sensitive test accounts and records.
