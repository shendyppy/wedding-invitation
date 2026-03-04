# AGENTS.md

## Project

Wedding Invitation Web App

This project is a custom-built digital wedding invitation system with RSVP tracking, guest management, and a simple admin dashboard.

The goal is to create a clean, elegant invitation website while maintaining a structured backend for managing guests and attendance.

The UI design is already defined and should be implemented section-by-section following the provided design reference.

---

# Tech Stack

Frontend:

* Next.js (App Router)
* React
* Tailwind CSS

Backend:

* Next.js API Routes

Database:

* Supabase (PostgreSQL)

Hosting:

* Vercel (frontend + API)
* Supabase (database)

Utilities:

* nanoid (for generating unique guest tokens)

---

# Core Features

### Magic Link Invitation

Each guest receives a unique invitation link:

/invite/[token]

The token identifies the guest in the database.

When the link is opened:

1. Validate token
2. Fetch guest data
3. Show personalized invitation
4. Limit RSVP based on the guest's allowed quota

---

### RSVP System

Guests can:

* Confirm attendance
* Select number of attendees (limited by quota)
* Submit wedding wishes

The form includes:

* Name
* Number of guests
* Attendance status (Attending / Not Attending)
* Wedding wishes message

---

### Wedding Wishes

Messages submitted by guests should be stored and displayed in a scrolling message list on the invitation page.

---

### Admin Dashboard

Admin-only route:

/admin

This dashboard allows viewing:

* Total invited guests
* Total attending
* Total not attending
* RSVP submissions
* Wedding wishes

Admin can also:

* View guest list
* Export data if needed

Access must be protected.

---

# Database Schema

## guests

id: uuid (primary key)
name: text
phone: text (optional)
max_quota: integer
unique_token: text
is_opened: boolean
created_at: timestamp

---

## rsvp

id: uuid
guest_id: uuid (FK -> guests.id)
attendance_status: enum (ATTENDING, NOT_ATTENDING)
number_of_attendees: integer
created_at: timestamp

---

## wishes

id: uuid
guest_id: uuid (nullable)
name: text
message: text
created_at: timestamp

---

# UI Architecture

The UI should be built modularly using section-based components.

Recommended folder structure:

/components/sections

Sections include:

* HeroSection
* CoupleIntroSection
* CountdownSection
* BrideSection
* GroomSection
* StorySection
* EventVenueSection
* RSVPSection
* GiftSection
* ThankYouSection

Each section should be implemented as a reusable React component.

---

# Design Guidelines

The design style is:

Elegant
Minimal
Warm earthy tones

Color palette example:

Beige background
Olive accent
Soft neutral tones

Typography:

Serif for titles
Script font for couple names

Tailwind theme should be extended to support these styles.

---

# Development Strategy

UI should be implemented first.

The design already exists, so the development flow is:

1. Implement UI sections
2. Build reusable components
3. Connect to Supabase
4. Implement RSVP logic
5. Add admin dashboard
6. Add token-based guest routing

AI tools may be used for UI scaffolding, but generated code should always be cleaned and refactored.

---

# Security Considerations

Do not expose guest lists publicly.

All guest data must be fetched using the token system.

Admin APIs must require authentication.

Routes that must be protected:

/admin
/api/admin/*

---

# Guest Flow

Guest receives link:

/invite/[token]

System:

1. Validate token
2. Load guest data
3. Display invitation
4. Guest submits RSVP
5. Store RSVP
6. Display wedding wishes

---

# Admin Flow

Admin logs in.

Admin can view:

* RSVP summary
* Attendance statistics
* Guest list
* Messages from guests

---

# Notes for AI Agents

This project prioritizes:

* clean architecture
* maintainable components
* minimal dependencies
* clear separation between UI and backend logic

Generated code should always follow:

* modular components
* readable Tailwind usage
* consistent naming
* reusable patterns

Avoid over-engineering.
Avoid unnecessary libraries.
Prefer simple and maintainable solutions.
