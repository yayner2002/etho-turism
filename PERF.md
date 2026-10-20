# Performance, Accessibility, and SEO — Ethio Tourism

This document defines performance and quality targets for the Ethio Tourism Next.js application. These are targets to measure, not claims that the application has already passed an audit.

## 1. Core Web Vitals Targets

| Metric                          |                   Target |
| ------------------------------- | -----------------------: |
| Largest Contentful Paint (LCP)  |      2.5 seconds or less |
| Interaction to Next Paint (INP) | 200 milliseconds or less |
| Cumulative Layout Shift (CLS)   |              0.1 or less |

Where sufficient real-user data is available, evaluate the 75th percentile. Laboratory tools are useful for diagnosing problems but do not replace real-user measurements.

## 2. Image Optimization

- Use Next.js image optimization where appropriate.
- Provide responsive image sizes.
- Set image dimensions or aspect ratios to reduce layout shifts.
- Lazy-load images below the fold.
- Avoid lazy-loading the main above-the-fold image when it is likely to be the LCP element.
- Provide meaningful alternative text for informative images.
- Use properly licensed images and provide attribution where required.
- Configure allowed remote image hosts explicitly.

## 3. JavaScript and Rendering

- Prefer Server Components for content that does not require browser interactivity.
- Use Client Components only when browser APIs, event handlers, or client-side state are needed.
- Dynamically load heavy components, such as maps, when doing so improves initial loading.
- Avoid unnecessary dependencies and duplicate data fetching.
- Provide loading and error states for important routes.
- Use request-time rendering only where required.
- Do not publicly cache personalized account, booking, or payment data.

## 4. SEO

- Give each public page a descriptive title and meta description.
- Configure a correct production `metadataBase`.
- Use suitable canonical URLs and Open Graph metadata where appropriate.
- Provide a sitemap for indexable public pages.
- Configure `robots.txt` appropriately.
- Keep private pages and APIs out of search results where appropriate.
- Do not treat `noindex` as an access-control mechanism.
- Use structured data only when it accurately represents visible content.
- Handle missing destinations with an appropriate not-found response.

## 5. Accessibility

- Use semantic HTML and a logical heading hierarchy.
- Give each form control an accessible label.
- Display useful validation and error messages.
- Ensure interactive elements work with a keyboard.
- Provide visible focus indicators.
- Check text and background contrast.
- Do not communicate status through color alone.
- Test menus, dialogs, maps, and notifications for accessible names and keyboard behavior.
- Test common mobile screen sizes and browser zoom.

## 6. API and Data Performance

- Cache public destination data only when invalidation is correct.
- Do not expose personalized data through shared caches.
- Validate request bodies and reject invalid input.
- Paginate large booking and user lists.
- Add database indexes where appropriate.
- Apply rate limiting to sensitive endpoints.
- Avoid logging sensitive request data.
- Monitor API errors and response times.

## 7. Measurement Workflow

Before release:

1. Run `npm run build`.
2. Run the production server with `npm start`.
3. Test the home page, destination listing, destination details, trip planning, login, dashboard, and authorized administrative flows.
4. Run Lighthouse or an equivalent audit on representative mobile and desktop pages.
5. Record performance and accessibility findings.
6. Test keyboard navigation and form validation.
7. Fix high-impact problems and repeat the measurements.

## 8. Release Checklist

- [ ] Production build succeeds.
- [ ] Images are appropriately sized and optimized.
- [ ] Core Web Vitals have been measured.
- [ ] Public metadata and sitemap match the production domain.
- [ ] Protected routes enforce server-side authorization.
- [ ] Private API responses are not publicly cached.
- [ ] Forms and keyboard navigation have been tested.
- [ ] No secrets are exposed in client-side code or logs.
