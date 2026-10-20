# EthioTourism

EthioTourism is a Next.js App Router website for discovering tourist destinations across Ethiopia. The project is designed to provide destination listings, destination details, information about Ethiopian tourism, English and Amharic language selection, light and dark themes, authentication, role-based access, booking management, notifications, and payment-request handling.

> **Implementation status:** This README describes the intended functionality and the implementation discussed for this project. It does not certify that every feature has been completed, tested, deployed, or security-reviewed. Verify each feature against the current source code and test results before submitting the capstone.

## Features

- Destination listings with search and region filtering, where implemented.
- Destination cards and individual destination detail pages.
- An About page introducing EthioTourism and Ethiopian tourism.
- English and Amharic language selection. Translation coverage depends on the components that implement translated text.
- Light and dark theme preferences, stored in browser `localStorage`.
- Authentication and role-based access for customers, staff, and administrators, where implemented and verified.
- Booking management and status updates.
- User notifications.
- Payment requests with ETB currency formatting, a configurable service fee, Telebirr phone-number format validation, and six bank-transfer options.
- Responsive styling and reduced-motion support where implemented.
- Project documentation: `AUTH.md`, `DATA.md`, `PERF.md`, `FUTURE.md`, and `PAYMENTS.md`, if present.

## Technology

- Next.js App Router
- React
- JavaScript
- CSS and any utility-class framework configured in the project
- Browser `localStorage` for language and theme preferences
- Server-side authentication and API routes

Check `package.json` for the actual installed versions and available scripts.

## Getting started

### Prerequisites

- A supported Node.js LTS release
- npm
- Git, if cloning the repository

### 1. Install dependencies

Open a terminal in the project directory containing `package.json`:

```bash
npm install
```

### 2. Configure environment variables

If `.env.example` or `.env.local.example` exists, use it as a template. Otherwise, create `.env.local` and add the variables required by the application.

At minimum, authentication requires a strong session secret:

```dotenv
SESSION_SECRET=replace_with_a_random_secret
```

Generate a secret with:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Copy the generated value into `.env.local`. Configure other variables according to `AUTH.md` and `PAYMENTS.md`, including verified bank-account details when needed.

**Never commit `.env.local`, passwords, API credentials, session secrets, or real customer data to Git.**

### 3. Start the development server

```bash
npm run dev
```

Open the URL printed in the terminal, usually:

http://localhost:3000

If port 3000 is already in use, Next.js may select another port. Use the URL printed in your terminal.

## Production build

Run:

```bash
npm run build
```

Only after the build succeeds, start the production server:

```bash
npm run start
```

The production start command requires a successful build. Check `package.json` for the actual scripts defined in this repository.

## Project structure

The following is an illustrative structure. Your actual repository may contain additional files and folders.

```text
ethio-tourism/
├── app/
│   ├── about/
│   │   └── page.js
│   ├── destinations/
│   │   └── page.js
│   ├── api/
│   │   └── auth/
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   ├── robots.js
│   └── sitemap.js
├── components/
│   ├── SitePreferences.js
│   ├── AboutContent.js
│   ├── StaffWorkspace.js
│   └── PaymentOptions.js
├── data/
│   └── destinations.js
├── lib/
│   ├── auth.js
│   ├── payment-config.js
│   ├── rate-limit.js
│   ├── safe-redirect.js
│   └── store.js
├── public/
│   └── images/
├── AUTH.md
├── DATA.md
├── FUTURE.md
├── PAYMENTS.md
├── PERF.md
└── README.md
```

Keep existing files that are not listed here. Do not create missing files solely to match this illustrative tree unless the application needs them.

## Language and theme preferences

The preferences component uses these browser storage keys:

| Key              | Supported values |
| ---------------- | ---------------- |
| `ethio-language` | `en`, `am`       |
| `ethio-theme`    | `light`, `dark`  |

The language selector updates the selected language and document language. It only translates components that explicitly use translated text. Full-site bilingual support requires translations for navigation, destination names and descriptions, authentication pages, dashboards, administration pages, forms, validation messages, and accessibility labels.

The theme preference uses the `dark` class on the root HTML element. Test text, form controls, navigation, cards, borders, dialogs, and focus indicators in both themes.

Preferences stored in `localStorage` are browser-specific and may not be available when storage is blocked.

## Roles, bookings, and notifications

The intended application roles are:

- **Customer:** browse destinations, manage personal favorites, submit bookings, and view personal notifications.
- **Staff:** access authorized booking-management operations and relevant notifications.
- **Administrator:** access authorized administrative operations, including user, booking, and payment-request management.

These are intended permissions, not proof that every route is correctly protected. Each sensitive API route must independently authenticate the user, authorize the requested action, validate the request, and enforce record ownership.

## Payments

See [`PAYMENTS.md`](./PAYMENTS.md) for environment setup, bank-account configuration, service-fee calculation, Telebirr phone-number format validation, and payment-verification limitations.

The payment interface supports:

- Ethiopian birr (ETB) formatting.
- A configurable service fee, currently set to 5% in the example configuration.
- Telebirr mobile-number format validation.
- Bank-transfer options for Amhara Bank, Awash Bank, Bank of Abyssinia, Commercial Bank of Ethiopia (CBE), Wegagen Bank, and Abay Bank.
- Pending payment requests until the transaction is verified.

**Important:** Validating a phone number does not confirm a Telebirr payment. Entering a bank-transfer reference does not prove that funds were received. Live payment confirmation requires a supported payment-provider integration or a reliable bank-reconciliation process.

The example application uses in-memory data storage. Do not use it to process real customer payments without implementing durable storage, transaction-safe updates, proper auditing, and independently verified payment processing.

## Authentication and security

Read [`AUTH.md`](./AUTH.md) and [`DATA.md`](./DATA.md) before using real users or deploying the application publicly.

Security requirements include:

- Keep secrets and credentials out of source control.
- Use server-side authentication and authorization on every protected operation.
- Check record ownership before returning or changing private data.
- Validate user input on the server.
- Reject crafted external redirect URLs.
- Apply login rate limiting using a suitable shared production service.
- Do not expose password hashes or sensitive session information in API responses.
- Keep payment verification separate from booking approval.
- Use durable storage with appropriate access controls and transaction handling.

The current in-memory store and in-memory rate limiter are suitable only for limited demonstrations. They do not provide durable persistence, cross-instance coordination, or production-grade concurrency guarantees.

## Capstone verification checklist

Complete these checks against the actual application before claiming the project is ready.

### Functionality

- [ ] `npm run build` completes successfully.
- [ ] Destination search and region filtering work.
- [ ] Destination detail pages load the correct destination.
- [ ] All destination images load and have useful alternative text.
- [ ] English and Amharic translations work for every page claimed to be bilingual.
- [ ] Language and theme preferences persist after refresh.
- [ ] Booking validation and authorized status updates work.
- [ ] Notifications are visible only to authorized recipients.
- [ ] Payment requests remain pending until independently verified.

### Security

- [ ] Unauthenticated write requests are rejected by the server.
- [ ] Customers cannot access or modify another customer's private records.
- [ ] Customer accounts cannot escalate themselves to staff or administrator roles.
- [ ] Staff cannot access administrator-only operations.
- [ ] Invalid and tampered session cookies are rejected.
- [ ] Crafted external return URLs are rejected.
- [ ] Login rate limiting works under the configured deployment environment.
- [ ] Payment amounts are recalculated on the server from trusted booking data.
- [ ] Payment status cannot be changed to paid without verified payment.

### Accessibility and performance

- [ ] All pages are keyboard-accessible.
- [ ] Form labels, errors, focus states, and loading states are accessible.
- [ ] Both light and dark themes remain readable.
- [ ] Reduced-motion preferences are respected where animations exist.
- [ ] Lighthouse results are measured and recorded in `PERF.md`.
- [ ] Required performance budgets are checked against the deployed application.

### Documentation and discovery

- [ ] `AUTH.md`, `DATA.md`, `FUTURE.md`, `PAYMENTS.md`, and `PERF.md` match the actual implementation.
- [ ] `/sitemap.xml` and `/robots.txt` return the expected content if required by the rubric.
- [ ] Production URLs and metadata are configured correctly.
- [ ] All documented commands and environment variables match the repository.

## Security attack tests

If `package.json` defines a `test:security` script and the corresponding test suite exists, run the tests against a local or dedicated test environment:

```bash
npm run dev
```

Open a second terminal in the same project directory:

```bash
npm run test:security
```

The intended test coverage includes:

1. Unauthenticated write attempts.
2. Insecure direct object reference (IDOR) attempts against another customer's booking.
3. Crafted external return URLs.
4. Registration role escalation.
5. Administrator API authorization.
6. Invalid passwords and tampered session cookies.

Confirm that the tests actually execute and pass. A script name alone does not guarantee that the tests exist or cover these scenarios. Do not run destructive security tests against production data.

## Destination imagery and licensing

Use images that you created, have permission to use, or whose licenses allow your intended use. Record attribution and license requirements where applicable.

Do not describe placeholder SVG illustrations as original destination photographs. Verify image paths, loading behavior, and alternative text before submitting the project.

## Future improvements

Potential next steps include:

- Replace in-memory storage with a persistent database.
- Add a complete translation catalog for the entire site.
- Integrate a verified Telebirr payment provider.
- Implement bank-transfer reconciliation and payment audit records.
- Add durable, distributed rate limiting.
- Automate accessibility, security, and performance tests in CI.
- Improve destination imagery, attribution, and image optimization.

## License

Add a `LICENSE` file before claiming a specific open-source license. Ensure that destination images, fonts, icons, and other third-party assets are compatible with the chosen license.


## Email verification (development demo only)

Registration now redirects to `/verify-email`. This is a browser-local simulation: no verification email is sent, and the generated six-digit code is stored in `localStorage`. The page displays the generated code for manual testing. Login checks the browser's local verified-email list. Clearing browser storage, changing browsers/devices, or using another browser profile resets this demo state. **This is not secure verification and must not be used to protect production accounts.** For production, implement expiring, single-use verification tokens on the server, store only token hashes, send messages through a real email provider, and enforce verification on the server at registration/login and protected routes.


## Email verification setup

Real verification emails are sent with [Resend](https://resend.com). Copy `.env.example` to `.env.local`, then set:

```env
RESEND_API_KEY=re_your_actual_key
EMAIL_FROM=Ethio Tourism <verify@your-verified-domain.com>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Use a domain verified in your Resend account for `EMAIL_FROM`. Never commit `.env.local` or expose the API key in client-side code. Registration sends a one-time verification link valid for 30 minutes; unverified accounts cannot log in. The current project store is in-memory, so a durable database migration is required before production deployment.
