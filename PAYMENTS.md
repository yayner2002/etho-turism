# Booking, Payments, Roles, and Notifications — EthioTourism

## 1. Implementation Scope and Status

This document describes the intended behavior of the EthioTourism booking, payment, role-management, and notification features.

The project code includes booking creation and retrieval, booking status updates, administrator operations, payment-request handling, authentication endpoints, and notification functionality.

**Important:** Verify every behavior against the actual source code and test results before claiming it is fully implemented. Documentation alone does not prove that an API is secure or that a payment has been verified.

## 2. Roles and Permissions

The application uses three intended roles: `customer`, `staff`, and `admin`.

### Customer

- Public registration should create customer accounts only.
- Customers must sign in before creating bookings.
- Customers may access only their own private booking records.
- Customers may submit payment requests for their own eligible bookings.
- Customers may access notifications addressed to them.

### Staff

- Staff may view booking requests permitted by their role.
- Staff may update booking statuses where authorized.
- Staff must not access administrator-only APIs.
- Staff must not independently verify payments unless an explicit permission is implemented.

### Administrator

- Administrators may access authorized account, booking, and payment-management operations.
- Administrators may assign customer, staff, and administrator roles.
- Administrators may record manual payment-verification decisions after independently checking the transaction through an official channel.
- Administrative operations should be logged for auditing.

Every protected operation must enforce authentication and authorization on the server. Hiding navigation links or buttons does not replace server-side permission checks.

## 3. Administrator Provisioning

The intended initial administrator setup uses the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables, if supported by the current implementation.

Verify that the provisioning flow:

- Normalizes the configured email address consistently.
- Hashes the password before storing it.
- Prevents public registration from creating privileged accounts.
- Does not promote an arbitrary existing customer account.
- Handles concurrent first-time provisioning safely.
- Uses durable storage before production deployment.

If the application uses an in-memory store, the administrator account and other records may disappear when the server process restarts.

After a role change, the affected user should sign in again if required by the session design. Protected routes must enforce the current stored role rather than trusting a role supplied by the browser or an outdated session.

## 4. Booking Creation and Pricing

The booking API should require authentication before accepting a booking.

The current booking route derives the booking owner from `getCurrentUser()` and obtains the destination from trusted server-side destination data.

The intended pricing process is:

1. Validate the destination ID.
2. Confirm the destination exists.
3. Validate the traveler count.
4. Read the destination's configured `price`.
5. Calculate the booking amount on the server.
6. Save the booking using the authenticated user's ID.

The server must not trust client-supplied user IDs, booking statuses, payment statuses, or prices.

The booking API currently calculates the base amount as:

`destination price × traveler count`

and stores the currency as `ETB`.

Validate that the price and calculated amount are finite, positive, and within safe numeric limits. Use appropriate decimal-money arithmetic for financial calculations.

**Booking status and payment status are separate.** Approving a booking must not automatically mark its payment as paid.

## 5. Service Fee and Currency

The payment configuration is intended to use a 5% service fee. Confirm that the current payment API and `lib/payment-config.js` actually implement this rate.

The intended calculation is:

```text
Subtotal = Destination price × Traveler count
Service fee = Round(Subtotal × 5%)
Total payable = Subtotal + Service fee
```

Illustrative example:

| Item             |       Amount |
| ---------------- | -----------: |
| Subtotal         | ETB 1,000.00 |
| Service fee (5%) |    ETB 50.00 |
| Total payable    | ETB 1,050.00 |

This example does not represent an actual booking.

The server must calculate the authoritative subtotal, service fee, and total. Browser-displayed values are informational only and must not determine the amount owed.

Use integer minor units or an appropriate decimal-money representation to avoid floating-point rounding errors.

## 6. Telebirr Phone-Number Validation

If Telebirr is enabled, the intended form validates Ethiopian mobile-number formatting and normalizes accepted numbers to international format beginning with `+251`.

Example formats that may be accepted, depending on the configured rules:

```text
0912345678
911234567
+251911234567
251911234567
```

Validation confirms only that a number matches the configured format. It does not prove that the number is active, belongs to the customer, is registered with Telebirr, or has completed a payment.

**Payment limitation:** Accepting a Telebirr phone number does not establish that a live merchant integration exists. Real payment initiation and confirmation require an appropriate provider integration and credentials.

## 7. Bank-Transfer Options

The intended bank-transfer interface supports these six choices:

1. Amhara Bank
2. Awash Bank
3. Bank of Abyssinia
4. Commercial Bank of Ethiopia (CBE)
5. Wegagen Bank
6. Abay Bank

Only enable banks for which verified business account details have been configured.

Example environment-variable names:

```dotenv
AMHARA_BANK_ACCOUNT_NAME=
AMHARA_BANK_ACCOUNT_NUMBER=

AWASH_BANK_ACCOUNT_NAME=
AWASH_BANK_ACCOUNT_NUMBER=

ABYSSINIA_BANK_ACCOUNT_NAME=
ABYSSINIA_BANK_ACCOUNT_NUMBER=

CBE_BANK_ACCOUNT_NAME=
CBE_BANK_ACCOUNT_NUMBER=

WEGAGEN_BANK_ACCOUNT_NAME=
WEGAGEN_BANK_ACCOUNT_NUMBER=

ABAY_BANK_ACCOUNT_NAME=
ABAY_BANK_ACCOUNT_NUMBER=
```

These names are examples. Confirm that the application reads the same variable names before using them.

If account values are missing, the application should disable the corresponding payment method and reject its submission server-side.

Never invent account numbers or commit real financial account details to source control.

## 8. Payment Requests and Verification

The intended workflow keeps payment requests pending until an authorized administrator records a verification decision.

Expected behavior:

- A customer can submit a payment request only for an eligible booking they own.
- The server calculates the authoritative payment amounts.
- Duplicate pending requests for the same booking are rejected.
- Payment requests retain the selected payment method and appropriate audit information.
- Customers cannot verify their own payments.
- Staff cannot verify payments unless explicitly authorized.
- Only authorized administrators can record manual verification decisions.
- Payment-state changes must be validated and audited.

A duplicate-request check must be atomic in production to prevent concurrent requests from creating multiple pending records.

### Manual Verification Requirements

Before marking a payment as paid, the administrator must independently check the transaction through the relevant official bank or payment-provider channel.

A reference entered by a customer or administrator is an audit detail; it is not independent proof that money was received.

A production implementation should record:

- The payment decision.
- The administrator who performed the verification.
- The verification timestamp.
- The relevant transaction reference.
- The associated booking and payment request.

Audit records must be protected from unauthorized modification.

The administrator API should update payment and booking records consistently. A partial failure must not leave a payment marked as paid while the related booking still reflects an incompatible payment status.

## 9. Notifications

The booking and administrator APIs use notification creation for relevant events, including:

- Booking creation.
- Booking status changes.
- Payment-verification decisions.
- Role changes.

Payment-request submission notifications should also be implemented and tested if required by the application's workflow.

Notifications must be delivered only to authorized recipients. Users must not be able to read, alter, or mark another user's private notifications as read by changing an identifier in a request.

Notification creation should remain consistent with the related operation. A durable database implementation should use transactions or a reliable event-delivery strategy to prevent important notifications from being lost when associated records change.

## 10. Environment Setup

### Step 1: Configure environment variables

Create `.env.local` in the project root, or copy `.env.example` if that file exists.

Configure only variables supported by the actual application.

### Step 2: Generate a session secret

If the authentication implementation uses `SESSION_SECRET`, generate a strong value with:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Store the generated value in `.env.local`:

```dotenv
SESSION_SECRET=replace_with_your_generated_secret
```

Keep it private. Never expose it through a `NEXT_PUBLIC_` variable.

If the application uses a different session mechanism, follow the requirements of that implementation.

### Step 3: Configure the administrator

If supported by the current code, configure:

```dotenv
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Use a unique administrator email and a strong password. Do not share the credentials or commit them to GitHub.

### Step 4: Configure bank accounts

Enter verified business account details only for the payment methods that should be enabled.

### Step 5: Install dependencies

If the project contains a compatible `package-lock.json`, run:

```bash
npm ci
```

Otherwise, inspect the package-management setup and use the appropriate installation command.

### Step 6: Start the development server

```bash
npm run dev
```

Open the local URL displayed by Next.js and test with non-production accounts and test data.

Check `package.json` to confirm that the expected scripts exist.

## 11. Storage and Production Limitations

Inspect `lib/store.js` to confirm whether the application uses an in-memory store, local files, or a database.

If the current implementation uses in-memory storage:

- Users, bookings, payment requests, and notifications may disappear when the server process restarts.
- Separate application instances do not share their in-memory records.
- Database-level transaction guarantees are unavailable.
- Duplicate-request prevention may fail under concurrent requests.
- Administrator provisioning may need to be repeated after a restart.

This design is not suitable for production financial operations.

Before handling real accounts or payments, use durable database storage, such as PostgreSQL, and implement:

- Database constraints and migrations.
- Transaction-safe booking and payment updates.
- Atomic duplicate-request prevention.
- Server-side authentication and authorization.
- Appropriate CSRF protection.
- Shared production-grade rate limiting.
- Audit logging and monitoring.
- Secure backups and recovery procedures.
- Verified payment-provider integration or reliable bank reconciliation.

## 12. Verification Checklist

### Roles and Authentication

- [ ] Public registration creates customer accounts only.
- [ ] Customers cannot promote themselves to staff or administrator.
- [ ] Staff cannot access administrator-only APIs.
- [ ] Administrator role changes are authorized and audited.
- [ ] Protected endpoints validate the current session and role.
- [ ] Record ownership is enforced on private operations.

### Booking and Pricing

- [ ] Booking creation requires authentication.
- [ ] Booking ownership comes from the authenticated user.
- [ ] The destination and traveler count are validated.
- [ ] Booking amounts use trusted server-side destination data.
- [ ] Client-supplied totals and fees are ignored.
- [ ] Booking status and payment status remain independent.

### Payments

- [ ] The configured service fee is verified.
- [ ] Monetary calculations handle rounding and invalid values safely.
- [ ] Telebirr number formatting is validated correctly, if enabled.
- [ ] Only configured banks accept payment requests.
- [ ] Duplicate pending requests are rejected safely.
- [ ] Customers cannot verify their own payments.
- [ ] Manual verification requires an independent transaction check.
- [ ] Payment decisions and references are audited.
- [ ] A booking is not marked paid solely because it was approved.

### Notifications and Storage

- [ ] Booking and payment events create the intended notifications.
- [ ] Notification access is restricted to authorized recipients.
- [ ] Users cannot modify another user's notifications.
- [ ] Data persistence is tested across application restarts.
- [ ] Concurrent booking and payment operations are tested.
- [ ] Production backups and recovery procedures are documented.

## 13. Final Status

The features described here must be verified against the actual source code and tests. Accepting payment details, displaying an administrator verification form, or using an in-memory store does not establish production readiness.

**Do not advertise EthioTourism as ready for real payments until durable storage, secure authorization, reliable audit records, and an appropriate verified payment-processing workflow have been implemented and tested.**
