# Ethio Tourism

Ethio Tourism is a Next.js web application designed to help visitors discover Ethiopia's historical sites, natural attractions, cultural heritage, and travel destinations. The application provides destination information and supports trip planning, booking requests, user accounts, and administrative management.

## Features

- **Destination discovery:** Browse destinations and view detailed destination information.
- **Trip planning:** Submit travel dates, traveler details, and booking requests.
- **User authentication:** Register, log in, retrieve account information, and log out.
- **User dashboard:** Access account information and supported personalized features.
- **Booking management:** Create booking requests, view booking details, and manage booking statuses.
- **Payment management:** Submit payment requests and support authorized payment verification.
- **Notifications:** Receive booking, payment, and account-related notifications.
- **Administrator dashboard:** Support administrative user-role and payment-management operations.
- **About Us:** Learn about the project and its tourism objectives.
- **SEO metadata:** Configure page titles and descriptions for improved discoverability.
- **Multilingual support:** Support English and Amharic where configured.

> **Note:** Features depend on the current implementation and configuration. Verify them in the running application before describing them as production-ready.

## Technology Stack

- Next.js with the App Router
- React
- JavaScript
- CSS and the styling framework configured in the project
- Next.js Route Handlers for server-side APIs
- Git and GitHub for version control

Check `package.json` for the installed versions and dependencies.

## Getting Started

### Requirements

- Node.js compatible with the project's Next.js version
- npm
- Git (optional, for version control)

### 1. Open the project

```bash
cd C:\Users\AAM\Desktop\ethio-tourism
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local` in the project root if required by the application.

Example:

```dotenv
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Use appropriate values in your local environment. Never commit real credentials, passwords, or secret keys to GitHub. Do not expose server-side secrets through `NEXT_PUBLIC_` variables.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build for production

```bash
npm run build
npm start
```

Resolve build errors and test the critical application flows before deployment.

## Main Application Routes

| Route                | Description                  |
| -------------------- | ---------------------------- |
| `/`                  | Home page                    |
| `/about`             | About Us page                |
| `/destinations`      | Destination listing          |
| `/destinations/[id]` | Destination details          |
| `/plan-trip`         | Trip planning                |
| `/register`          | Account registration         |
| `/login`             | User login                   |
| `/dashboard`         | User dashboard               |
| `/checkout`          | Checkout flow, if configured |
| `/notifications`     | Notifications                |
| `/staff`             | Staff workspace              |
| `/admin`             | Administrator dashboard      |

Some routes require authentication or particular user roles.

## API Endpoints

The project includes or is intended to include the following Route Handler endpoints:

- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/auth/verify-email`
- `/api/bookings`
- `/api/bookings/[id]`
- `/api/payments`
- `/api/notifications`
- `/api/favorites`
- `/api/admin`

The actual endpoint list depends on the route files present in `app/api`.

## Project Structure

```text
ethio-tourism/
├── app/
│   ├── about/
│   ├── admin/
│   ├── api/
│   ├── dashboard/
│   ├── destinations/
│   ├── login/
│   ├── register/
│   └── ...
├── components/
├── data/
├── lib/
├── public/
├── AUTH.md
├── DATA.md
├── FUTURE.md
├── PERF.md
└── README.md
```

This is a representative structure; retain your existing project files and folders.

## Security

- Enforce authentication and authorization on the server.
- Derive booking ownership from the authenticated user.
- Calculate booking prices using trusted server-side destination data.
- Never return password hashes or session secrets to clients.
- Require authorized payment verification before marking a payment as paid.
- Review the storage implementation before deploying to a multi-instance or serverless environment.
- Keep environment variables and secrets out of version control.

See [AUTH.md](./AUTH.md), [DATA.md](./DATA.md), and [PERF.md](./PERF.md).

## Testing Checklist

- [ ] `npm run build` completes successfully.
- [ ] Destination pages display the expected information.
- [ ] Invalid destination IDs are handled correctly.
- [ ] Registration and login validate input.
- [ ] Protected APIs reject unauthenticated requests.
- [ ] Customers cannot access other customers' private bookings.
- [ ] Only authorized staff/admin users can perform restricted operations.
- [ ] Payment status updates follow the verification workflow.
- [ ] Forms work on mobile and provide understandable error messages.
- [ ] Production environment variables are configured.

## Future Development

See [FUTURE.md](./FUTURE.md) for proposed improvements.

## License

A license has not yet been specified. Add a `LICENSE` file if you intend to distribute the project under a particular license.
