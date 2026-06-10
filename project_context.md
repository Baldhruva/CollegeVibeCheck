# CollegeVibeCheck - Project Context

## Project Overview

CollegeVibeCheck is a full-stack web application focused on Mumbai colleges.

The goal is to help prospective students understand colleges before taking admission by viewing ratings and comments written by existing students.

Only manually-added Mumbai colleges exist in the system.

Students can rate and comment on their own college.

Viewers can browse colleges and reply to discussions.

---

# Tech Stack

Frontend:

* Next.js App Router
* React
* TypeScript
* Vanilla CSS

Backend:

* Next.js Route Handlers

Database:

* Supabase PostgreSQL

Authentication:

* Supabase Google OAuth

Deployment:

* Vercel

---

# User Roles

## Student

Can:

* Login with Google
* Select a college
* Create ratings
* Update ratings
* Create comments on own college
* Reply to comments anywhere

Cannot:

* Comment on other colleges

## Viewer

Can:

* Login with Google
* Browse colleges
* View ratings
* View comments
* Reply to comments

Cannot:

* Rate colleges
* Create comments

## Anonymous User

Can:

* View colleges
* View ratings
* View comments

Cannot:

* Reply
* Comment
* Rate

---

# Rating Parameters

1. Academics

* Tuition Quality
* Attendance Culture
* Exam System
* Assignment Culture

2. Amenities

* Canteen Food
* Mess Food
* Campus Infra
* Hostel Infra

3. Social Life

* Crowd Diversity
* Dress-code Discipline
* Dating Scenes
* Inter-batch Interactions

4. Opportunities

* Internships
* Placements
* Guidance & Mentorship
* Hackathon Exposure

5. Committees

* Work Culture
* Resume Impact
* Event Frequency & Quality
* Time Flexibility

6. Fests

* Event Quality
* Space Management
* Crowd Turnout
* Celebrity Presence

7. Location

* Cafes & Restaurants
* Railway/Metro Station
* Hospitals
* PG Flats

8. Campus Comfort

* Green Spaces & Biodiversity
* Mental Health Support
* Sports & Fitness Facilities
* Parking Facilities

---

# Rating Logic

Sub Parameter Rating:
1-5 stars

Parameter Rating:
Average of its 4 sub-parameters

User College Rating:
Average of the 8 parameter ratings

College Overall Rating:
Average of all users' college ratings

---

# Comment System

Comments belong to:

College
+
Parameter

Example:

VJTI
→ Academics
→ Comments

Students:

* Can create comments only on their own college

Viewers:

* Cannot create comments

Students and Viewers:

* Can reply to comments

Anonymous:

* Read only

---

# Comment Database Design

Single self-referencing comments table.

Root Comment:

parent_comment_id = NULL

Reply:

parent_comment_id = comment_id

Supports:

* Comments
* Replies
* Nested Replies
* View Replies
* Collapse Replies

---

# User Color Logic

Green:
Student belongs to viewed college

Red:
Student belongs to another college

Yellow:
Viewer

---

# Database Schema

## colleges

id uuid primary key
name varchar(200) unique
description text
created_at timestamptz

## parameters

id uuid primary key
name varchar(100) unique
description text

## sub_parameters

id uuid primary key
parameter_id uuid references parameters(id)
name varchar(100)

## users

id uuid primary key references auth.users(id)

username varchar(30) unique NULLABLE

role varchar(20)

Allowed:

* student
* viewer

college_id uuid references colleges(id)

created_at timestamptz

## ratings

id uuid primary key

user_id uuid references users(id)

college_id uuid references colleges(id)

unique(user_id, college_id)

created_at timestamptz

## sub_parameter_ratings

id uuid primary key

rating_id uuid references ratings(id)

sub_parameter_id uuid references sub_parameters(id)

stars integer (1-5)

unique(rating_id, sub_parameter_id)

## comments

id uuid primary key

parent_comment_id uuid references comments(id)

user_id uuid references users(id)

college_id uuid references colleges(id)

parameter_id uuid references parameters(id)

content varchar(250)

created_at timestamptz

---

# Supabase Notes

Authentication handled by Supabase.

Google OAuth already configured.

users table is application profile data.

auth.users stores actual authenticated users.

Important change made:

username column was changed from:

username NOT NULL

to:

username NULL

Reason:

Viewer accounts do not choose usernames.

SQL executed:

ALTER TABLE users
ALTER COLUMN username DROP NOT NULL;

---

# Folder Structure

src/

app/
components/
lib/
hooks/
context/
types/

Key folders:

lib/db
Database query functions

lib/auth
RBAC and permission helpers

lib/supabase
Supabase setup

components
Reusable UI

app
Pages and route handlers

---

# Progress

Completed:

✓ Prompt 1
Folder structure

✓ Prompt 2
Types
Constants
Utilities
Database layer

✓ Database created in Supabase

✓ Parameters seeded

✓ Sub-parameters seeded

✓ 5 engineering colleges seeded

✓ username column updated to nullable

✓ Prompt 3
Supabase setup
Google OAuth
Session handling
Auth context
Role handling
Profile onboarding
Dashboard route protection

Current Status:

Authentication and onboarding phase completed.

✓ Prompt 4 Completed

Implemented:

Home Page
- Header
- Hero Section
- FAQ Accordion
- Footer
- Login / Signup Modal
- Student / Viewer Role Selection

Authentication UX
- Google OAuth integrated with role selection
- Existing sessions automatically recognized
- Logout functionality implemented
- Logout redirects to Home Page

Dashboard Shell
- Protected student dashboard route
- Sidebar navigation
- Scroll-to-parameter functionality
- 8 parameter sections rendered
- Sub-parameter cards rendered
- Interactive star rating UI (client-side only)
- Comment box UI placeholders
- Save Ratings button UI
- College information card
- Username display in header

Dashboard State
- Unrated default state (0 stars)
- No mock ratings
- Client-side rating interaction
- Client-side average calculations

Current Status

✓ Folder Structure
✓ Database Schema
✓ Supabase Setup
✓ Google OAuth
✓ Session Handling
✓ Auth Context
✓ Role Handling
✓ Profile Onboarding
✓ Dashboard Route Protection
✓ Home Page
✓ Dashboard Shell


# Environment Variables

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

NEXT_PUBLIC_SITE_URL

Google OAuth handled by Supabase.

No Google Client ID or Google Client Secret required in application env file.
