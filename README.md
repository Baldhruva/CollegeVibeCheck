# CollegeVibeCheck

CollegeVibeCheck is a full-stack college review and rating platform focused on Mumbai colleges.

Students can rate different aspects of their college, write detailed parameter-wise reviews, and participate in threaded discussions. Prospective students can browse colleges, compare ratings, read reviews, and engage with the community before making admission decisions.

---

## Features

### Authentication

* Google OAuth using Supabase Auth
* Role-based onboarding
* Secure session management

### User Roles

#### Student

* Select own college during onboarding
* Rate college parameters
* Update ratings anytime
* Write parameter-specific reviews
* Reply to discussions

#### Viewer

* Browse all colleges
* View ratings and reviews
* Participate in discussions through replies

#### Anonymous User

* Browse colleges
* View ratings
* View reviews and discussions

---

## Rating System

Students rate the following parameters:

### Academics

* Tuition Quality
* Attendance Culture
* Exam System
* Assignment Culture

### Amenities

* Canteen Food
* Mess Food
* Campus Infrastructure
* Hostel Infrastructure

### Social Life

* Crowd Diversity
* Dress-Code Discipline
* Dating Scene
* Inter-Batch Interaction

### Opportunities

* Internships
* Placements
* Guidance & Mentorship
* Hackathon Exposure

### Committees

* Work Culture
* Resume Impact
* Event Frequency & Quality
* Time Flexibility

### Fests

* Event Quality
* Space Management
* Crowd Turnout
* Celebrity Presence

### Location

* Cafes & Restaurants
* Railway / Metro Connectivity
* Hospitals
* PG / Flats Availability

### Campus Comfort

* Green Spaces & Biodiversity
* Mental Health Support
* Sports & Fitness Facilities
* Parking Facilities

---

## Rating Calculation

Sub-Parameter Rating

* 1 to 5 stars

Parameter Rating

* Average of all sub-parameters

User College Rating

* Average of all parameter ratings

College Overall Rating

* Average of ratings submitted by all students of that college

---

## Review & Discussion System

### Dashboard Reviews

Students can leave one review per parameter.

Example:

Academics

"Faculty members are highly supportive and exams are fair."

These reviews become public parameter reviews on the college page.

### Threaded Discussions

Users can reply to reviews.

Supports:

* Nested replies
* Expand / Collapse threads
* Role badges
* College-aware discussions

---

## Role-Based Permissions

### Student (Own College)

Can:

* Rate college
* Write reviews
* Reply to discussions

### Student (Other College)

Can:

* View reviews
* Reply to discussions

Cannot:

* Create reviews for another college

### Viewer

Can:

* View reviews
* Reply to discussions

Cannot:

* Rate colleges
* Create top-level reviews

### Anonymous User

Can:

* Read ratings
* Read reviews

Cannot:

* Comment
* Reply

---

## Search & Discovery

* Search colleges by name
* Autocomplete suggestions
* Parameter-wise statistics
* College comparison through ratings

---

## Mobile First Design

The platform is optimized primarily for mobile devices.

Responsive support includes:

* Android phones
* iPhones
* Tablets
* Desktop browsers

Features:

* Mobile navigation drawer
* Sticky dashboard navigation
* Touch-friendly rating controls
* Responsive discussion threads

---

## Tech Stack

### Frontend

* Next.js 15
* React
* TypeScript
* Vanilla CSS

### Backend

* Next.js Route Handlers
* Server Components

### Database

* Supabase PostgreSQL

### Authentication

* Supabase Auth
* Google OAuth

### Deployment

* Vercel

---

## Database Schema

Core Tables:

* users
* colleges
* parameters
* sub_parameters
* ratings
* sub_parameter_ratings
* comments

Comments use a self-referencing structure:

parent_comment_id = NULL

→ top-level review

parent_comment_id = comment_id

→ reply

---

## Local Development

### Clone Repository

```bash
git clone <repository-url>
cd college-vibe-check
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

Create:

```env
.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open:

http://localhost:3000

---

## Future Improvements

* College comparison tool
* Review moderation
* College ranking page
* Analytics dashboard
* Saved colleges
* Trending discussions

---

## Author

Baldhruva

Built to help students make informed college decisions through community-driven reviews and discussions.


