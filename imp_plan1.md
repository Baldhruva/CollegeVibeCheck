# Implementation Plan - Home Page & Dashboard Shell UI

This plan outlines the implementation of the public landing page components and the student dashboard shell UI, including navigation sidebars and interactive parameter/rating cards.

## User Review Required

> [!IMPORTANT]
> **Interactivity & State Handling**
> Although database persistence for ratings and comments is excluded from this phase, the dashboard UI will be fully interactive (maintaining React state for selected star ratings and comment textbox values) so that it feels like a live, production-ready app.

## Proposed Changes

### Common Layout Components

#### [NEW] [Header.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/components/common/Header.tsx)
- Simple top bar showing the brand logo ("CollegeVibeCheck") on the left and user session info (logout button/username) on the right.

#### [NEW] [Footer.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/components/common/Footer.tsx)
- Simple footer showing "Created by Balben" and email placeholder contacts.

---

### Home Page Components

#### [NEW] [Hero.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/components/home/Hero.tsx)
- Big bold hero header with the branding, subtitle ("Know your college, before college."), and call to actions.

#### [NEW] [FAQ.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/components/home/FAQ.tsx)
- Accordion component utilizing the static FAQs configuration from `src/lib/constants/faqs.ts` with expand/collapse state.

#### [NEW] [AuthModal.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/components/home/AuthModal.tsx)
- Role selection card overlay providing clear selection options:
  - **Student**: Route to Google OAuth with role='student' query parameter.
  - **Viewer**: Route to Google OAuth with role='viewer' query parameter.

#### [MODIFY] [page.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/app/page.tsx)
- Main landing page file. Integrates the `Header`, `Hero`, `FAQ`, `Footer`, and controls the `AuthModal` display toggle.

---

### Student Dashboard Components

#### [NEW] [Sidebar.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/components/common/Sidebar.tsx)
- Left navigation bar displaying the 8 parameters. Clicking a parameter scrolls the main content smoothly to the selected parameter section.

#### [NEW] [RatingStars.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/components/dashboard/RatingStars.tsx)
- Core star selector component. Renders 5 stars, supports hover styling, and triggers selected value callbacks.

#### [NEW] [SubParameterCard.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/components/dashboard/SubParameterCard.tsx)
- Individual card rendering a single sub-parameter along with its 5-star rating selector.

#### [NEW] [CommentBox.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/components/dashboard/CommentBox.tsx)
- Text area wrapper supporting max-length countdowns (250 chars) and placeholder instructions.

#### [NEW] [SaveButton.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/components/dashboard/SaveButton.tsx)
- CTA button to save ratings (wired with a placeholder success message trigger).

#### [NEW] [ParameterCard.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/components/dashboard/ParameterCard.tsx)
- Groups the 4 sub-parameters and a comment box for each of the 8 parameters, displaying parameter average ratings dynamically.

#### [MODIFY] [page.tsx](file:///d:/Work%20I/KJ%20Somaiya%20Engineering/Programming/Projects/CollegeVibeCheck/src/app/dashboard/page.tsx)
- Connects the sidebar, headers, student details profile, college information, and parameters layout into a unified, responsive dashboard workspace.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify Next.js builds clean.
- Run `npm run lint` to verify syntax.
