# Data Management — Ethio Tourism

This document describes how the application's data should be validated, protected, stored, and maintained. Confirm the actual implementation in `data/` and `lib/store.js` before treating these practices as completed.

## 1. Data Categories

| Data category | Examples                                              | Protection                                        |
| ------------- | ----------------------------------------------------- | ------------------------------------------------- |
| Destinations  | ID, name, description, region, price, image           | Validate content and use trusted published prices |
| Accounts      | Name, email, role, password hash                      | Restrict access and never expose password hashes  |
| Bookings      | User ID, destination, date, travelers, amount, status | Validate fields and enforce ownership             |
| Payments      | Booking ID, amount, status, verification reference    | Restrict access and maintain audit records        |
| Notifications | Recipient, type, title, message, related ID           | Return only authorized notifications              |
| Favorites     | User ID and destination ID                            | Enforce ownership and validate destinations       |
| Security data | Session and verification-token information            | Protect secrets and apply expiry rules            |

Collect only the information needed to operate the application.

## 2. Source of Truth

- Destination IDs and prices must come from trusted server-side data.
- Booking totals must be calculated on the server.
- The authenticated session determines the booking owner.
- The client must not choose its own privileged role or payment status.
- User-role changes must be restricted to authorized administrators.
- Payment status must be changed through an authorized verification process.

## 3. Input Validation

Validate all incoming data on the server, even if the frontend also validates it.

- **Name:** Trim whitespace and enforce length limits.
- **Email:** Normalize consistently and validate the format.
- **Password:** Enforce the password policy and use secure password hashing.
- **Travel date:** Validate the format and calendar date and enforce the applicable timezone policy.
- **Travelers:** Require an integer within the allowed range.
- **Destination:** Verify that the destination exists.
- **Message:** Apply a length limit and safely render user-provided content.
- **Role and status:** Accept only explicitly permitted values.
- **Identifiers:** Validate their type and length and never use them as a substitute for authorization.

Email format validation does not establish that the user owns the email address.

## 4. Data Storage

Inspect `lib/store.js` to identify whether the application uses in-memory storage, local files, or a database.

For production use, storage should be durable and support concurrent requests and multiple application instances.

In-memory data may disappear when the process restarts and may not be shared between serverless instances. Local-file storage may not be reliable or writable on some hosting platforms.

Use database transactions or equivalent consistency safeguards when one operation updates related records, such as a payment request and its booking.

## 5. Access Control

- Customers should access only their own private bookings and notifications.
- Staff and administrators must be authorized by server-side checks.
- Administrative APIs should return only the data needed by the interface.
- Password hashes, session secrets, and verification tokens must not be exposed in API responses.
- Use a public-user serializer such as `publicUser()` and review its returned fields.

## 6. Data Integrity

- Enforce unique normalized account emails.
- Verify that booking references point to valid users and destinations.
- Prevent unauthorized booking-status changes.
- Keep payment and booking status consistent.
- Record relevant payment-verification details.
- Prevent duplicate processing where possible.

## 7. Backups and Recovery

Before production deployment:

- Configure automated backups for persistent data.
- Test data restoration.
- Define data-retention periods.
- Restrict access to backups.
- Document data correction and deletion procedures where applicable.
- Avoid logging passwords, cookies, verification tokens, or sensitive payment details.

## 8. Data Migration

When changing storage systems:

1. Back up existing data.
2. Define the target schema and migration steps.
3. Test the migration.
4. Verify record counts and relationships.
5. Test login, booking ownership, payment history, and notifications.
6. Maintain a rollback plan until the migration is confirmed.

## 9. Review Checklist

- [ ] The storage behavior in `lib/store.js` is documented.
- [ ] Email normalization is consistent.
- [ ] Password hashes and secrets are never returned to clients.
- [ ] Booking ownership is checked server-side.
- [ ] Prices are calculated using trusted destination data.
- [ ] Payment and booking updates remain consistent.
- [ ] Backups and restoration are tested.
- [ ] Data-retention and access rules are documented.
