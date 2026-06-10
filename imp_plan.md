# Implementation Plan - Auth, Onboarding & Session Management

This plan details the implementation of Supabase clients, Google OAuth redirect flows, profile onboarding, session management, and route guarding middleware.

## Proposed Changes

### Supabase Configuration

#### [NEW] [client.ts](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/lib/supabase/client.ts)
- Create and export a browser client using `createBrowserClient` from `@supabase/ssr`.

#### [NEW] [server.ts](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/lib/supabase/server.ts)
- Create and export a server client creator using `createServerClient` from `@supabase/ssr` that reads and writes cookies.

#### [NEW] [middleware.ts](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/lib/supabase/middleware.ts)
- Create an `updateSession` helper using `@supabase/ssr` to refresh the user's session in Next.js middleware and return the updated response.

#### [MODIFY] [middleware.ts](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/middleware.ts)
- Implement route guarding using the middleware client:
  - If the path is `/dashboard`:
    - Check if the user is authenticated. If not, redirect to `/`.
    - Check if the user's profile exists in the `users` table.
      - If it does not exist, redirect to `/auth/complete-profile`.
      - If it exists but is a `viewer`, redirect to `/`.
  - If the path is `/auth/complete-profile`:
    - Check if the user is authenticated. If not, redirect to `/`.
    - Check if the user's profile already exists in the `users` table. If it does, redirect to `/dashboard`.
  - Allow callback, home, and assets without blocking.

---

### Authentication Core

#### [NEW] [roles.ts](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/lib/auth/roles.ts)
- Helper functions to verify user roles:
  - `isStudent(role: string)`
  - `isViewer(role: string)`

#### [NEW] [permissions.ts](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/lib/auth/permissions.ts)
- Authorization checks:
  - `canRate(role: string, userCollegeId: string | null, targetCollegeId: string): boolean`
  - `canComment(role: string, userCollegeId: string | null, targetCollegeId: string): boolean`
  - `canReply(role: string): boolean`

#### [NEW] [session.ts](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/lib/auth/session.ts)
- Server-side helpers (usable in route handlers/server components):
  - `getServerSession(supabase)`: Get session data.
  - `getCurrentUser(supabase)`: Get current authenticated user details from Supabase auth.
  - `getCurrentProfile(supabase)`: Get the user's db profile from the `users` table.
  - `isAuthenticated(supabase)`: Boolean check for active session.

#### [NEW] [AuthContext.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/context/AuthContext.tsx)
- React context for client-side state:
  - Provides `user` (Supabase Auth user), `profile` (DB user profile), `role`, `loading` state.
  - Exposes login function: `signInWithGoogle(role: 'student' | 'viewer')`.
  - Exposes sign-out function.
  - Listens to Supabase `onAuthStateChange`.

#### [NEW] [useAuth.ts](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/hooks/useAuth.ts)
- React hook to easily consume `AuthContext`.

---

### Application Routes & Pages

#### [MODIFY] [route.ts](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/app/auth/callback/route.ts)
- Exposes `GET` handler.
- Reads `code` from query params and exchanges it for a session.
- Reads temporary `role` from query params.
- Checks DB for user profile:
  - If profile exists:
    - If `profile.role === 'student'`, redirect to `/dashboard`.
    - If `profile.role === 'viewer'`, redirect to `/`.
  - If profile does NOT exist:
    - If temporary role was `'viewer'`:
      - Automatically create a profile in the `users` table: `{ id: authUser.id, username: null, role: 'viewer', college_id: null }`.
      - Redirect to `/`.
    - If temporary role was `'student'`:
      - Redirect to `/auth/complete-profile`.

#### [MODIFY] [page.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/app/auth/complete-profile/page.tsx)
- Profile completion page.
- Fetches pre-seeded colleges using `getAllColleges` for college selection.
- Features:
  - Username input (validated against constraints).
  - Searchable autocomplete list of colleges.
  - Submit action: Writes profile row via `/api/profile` or directly calling DB helpers inside a Server Action, then redirects to `/dashboard`.

---

### Database Layer Updates

#### [MODIFY] [users.ts](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/lib/db/users.ts)
- Adjust or verify user query helpers function signatures to align with auth context.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify clean compilation with TypeScript and App Router routes.
- Run `npm run lint` to confirm eslint validations pass.
