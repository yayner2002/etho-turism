# Authentication and Authorization — Ethio Tourism

This document describes security requirements for registration, login, sessions, bookings, payments, and administrator operations. Verify each control against the current implementation before treating it as complete.

## 1. Roles and Permissions

The application references customer accounts and staff/admin roles.

| Action                     | Customer    | Staff                         | Admin   |
| -------------------------- | ----------- | ----------------------------- | ------- |
| Browse public destinations | Allowed     | Allowed                       | Allowed |
| View own bookings          | Allowed     | Allowed                       | Allowed |
| View all bookings          | Not allowed | Only if authorized            | Allowed |
| Update booking status      | Not allowed | If authorized                 | Allowed |
| Change user roles          | Not allowed | Not allowed by default        | Allowed |
| Verify payments            | Not allowed | Only if explicitly authorized | Allowed |

Permissions must be enforced by server-side route handlers and data-access functions. Hiding a button or redirecting a page does not secure an API.

## 2. Registration and Login

- Normalize email addresses consistently.
- Validate request bodies on the server.
- Hash passwords with a modern password-hashing function.
- Never store plaintext passwords.
- Apply rate limiting to repeated login failures.
- Prevent public registration from assigning privileged roles.
- Provision administrator accounts through a controlled server-side process.
- Keep administrator credentials and session secrets in server-side environment variables.
- Enforce the intended email-verification policy on the server.

If email verification is required, ensure registration, verification, login, and account management follow the same policy.

## 3. Sessions and Cookies

Review `lib/auth.js` to confirm the session implementation.

For production sessions:

- Use secure session identifiers or appropriately protected session tokens.
- Set cookies to `HttpOnly`.
- Use `Secure` in production.
- Set an appropriate `SameSite` policy and expiration.
- Ensure cookie creation and logout use compatible cookie names and settings.
- Rotate sessions after authentication or privilege changes where appropriate.
- Never return session secrets in JSON responses.
- Protect state-changing requests against cross-site request forgery as appropriate for the application's architecture.

## 4. Email Verification

If email verification is enabled:

- Generate unpredictable, high-entropy tokens.
- Apply an expiration time.
- Make tokens single-use.
- Associate tokens with the correct account.
- Use a configured email provider if real emails are required.
- Do not claim a verification email was sent when the implementation only simulates verification.
- Return only safe public-user fields from the verification endpoint.
- Enforce verified-email requirements server-side if the policy requires them.

A verification endpoint alone does not guarantee that the rest of the application enforces verification.

## 5. Booking Security

- Derive `userId` from the authenticated session.
- Do not trust a client-supplied owner ID.
- Calculate booking prices using trusted server-side destination data.
- Validate destinations, travel dates, traveler counts, email addresses, phone numbers, and messages.
- Allow customers to access only their own bookings.
- Check staff/admin permissions before allowing administrative booking operations.
- Do not allow a booking to be completed until the required payment verification has succeeded.
- Validate booking-status transitions against an explicit policy.

## 6. Payment Verification

- Treat submitted transaction references as unverified input.
- Verify payments through an authorized provider or controlled manual verification process.
- Restrict payment decisions to authorized roles.
- Record the decision, timestamp, verifier, and relevant reference.
- Keep payment and booking updates consistent using a transaction or recovery strategy.
- Prevent duplicate processing and maintain an audit trail.
- Never store unnecessary payment credentials.

Checking that a transaction reference has a minimum length does not prove that a payment was received.

## 7. Administrator API

- Require administrator authorization for restricted user and payment operations.
- Validate role names against an allowlist.
- Prevent accidental self-demotion where required by policy.
- Return only necessary user and payment fields.
- Await asynchronous store operations where applicable.
- Handle failures without exposing stack traces or sensitive internal details.
- Log security-relevant actions without recording passwords, cookies, or verification tokens.

## 8. Rate Limiting

- Apply rate limits to login, registration, verification, password reset, and other sensitive endpoints.
- Ensure client-controlled headers cannot trivially bypass rate limits.
- Use shared rate-limit storage when running multiple production instances.
- Limit request sizes and validate input.
- Monitor repeated failures and unusual administrative or payment activity.

## 9. Environment Variables

- Store secrets in server-side environment settings.
- Keep `.env.local` out of Git.
- Never expose private credentials through `NEXT_PUBLIC_` variables.
- Use separate development and production credentials.
- Rotate secrets if they are accidentally exposed or committed.

## 10. Security Checklist

- [ ] Unauthenticated requests to protected APIs receive `401`.
- [ ] Unauthorized roles receive `403`.
- [ ] Customers cannot access another customer's booking.
- [ ] Public registration cannot create privileged accounts.
- [ ] Password hashes and session secrets are not returned to clients.
- [ ] Rate limiting works in the deployment environment.
- [ ] Session cookies have appropriate production attributes and expiry.
- [ ] Verification tokens expire and cannot be reused, if verification is enabled.
- [ ] Payment verification is authorized and auditable.
- [ ] Payment and booking status changes remain consistent.
- [ ] Secrets are not committed to GitHub.
- [ ] Authentication and authorization tests are run before release.
