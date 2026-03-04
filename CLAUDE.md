# CLAUDE.md

## Purpose

This file provides guidance for Claude Code when assisting with development in this repository.

The goal is to ensure that generated code remains consistent, maintainable, and aligned with the architecture of the wedding invitation system.

Claude should prioritize clean architecture, modular components, and minimal dependencies.

---

# Project Overview

This project is a **digital wedding invitation platform** built with Next.js and Supabase.

Main capabilities:

* Personalized invitation links
* RSVP management
* Wedding wishes submission
* Guest quota management
* Admin dashboard for monitoring responses

Each guest receives a **unique token-based invitation link**.

Example:

```
/invite/[token]
```

The token identifies the guest in the database.

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

Deployment:

* Vercel

Utilities:

* nanoid

---

# Coding Principles

Claude should follow these rules when generating or modifying code.

### 1. Prefer Simplicity

Avoid overengineering.

Use simple and readable solutions.

Do not introduce unnecessary libraries.

---

### 2. Component Modularity

UI should be built using small reusable components.

Preferred structure:

```
/components
  /sections
  /ui
  /forms
```

Sections represent full page blocks.

UI components represent reusable design elements.

Forms handle user inputs such as RSVP.

---

### 3. Separation of Concerns

Keep logic separate from presentation.

Avoid placing business logic directly inside UI components.

Prefer utility functions and hooks.

Example:

```
/lib
  supabase.ts
  tokens.ts
  guest.ts
```

---

### 4. Consistent Naming

Use clear and descriptive names.

Examples:

```
HeroSection
CountdownSection
RSVPForm
WeddingWishList
GuestService
```

Avoid vague names like:

```
Component1
Helper
Utils2
```

---

# Folder Structure

Preferred project structure:

```
/app
  /invite/[token]
  /admin
  /api

/components
  /sections
  /ui
  /forms

/lib

/types

/styles
```

---

# Styling Rules

Tailwind CSS is used for styling.

Guidelines:

* Prefer Tailwind utility classes
* Avoid inline styles
* Avoid complex CSS files unless necessary
* Extract reusable styles into components

---

# Design Direction

The UI style should follow the wedding design reference.

Style characteristics:

* Elegant
* Minimal
* Warm neutral palette
* Soft typography
* Spacious layout

Example color palette:

```
Beige background
Olive green accent
Soft neutral tones
```

Typography style:

```
Serif for titles
Script font for names
Clean sans-serif for body text
```

---

# Data Access

All database operations should go through Supabase.

Example location:

```
/lib/supabase.ts
```

Claude should avoid embedding database queries directly inside UI components.

Instead create helper functions or service files.

---

# Token System

Guest invitations use a unique token.

Example:

```
/invite/[token]
```

When loading an invitation:

1. Validate token
2. Fetch guest data
3. Display invitation

If token is invalid:

* Show error page
* Or redirect to landing page

---

# RSVP Logic

Guests can submit:

* Attendance status
* Number of attendees
* Wedding wishes

Constraints:

* Number of attendees cannot exceed the guest quota
* RSVP should only be submitted once per guest unless updates are allowed

---

# Admin Dashboard

Admin-only route:

```
/admin
```

This page displays:

* RSVP summary
* Attendance statistics
* Guest list
* Wedding wishes

Admin routes must be protected.

---

# API Guidelines

API routes should follow clear naming.

Examples:

```
POST /api/rsvp
POST /api/wishes
GET /api/guest/[token]
GET /api/admin/summary
```

Responses should follow consistent structure.

Example:

```
{
  success: true,
  data: {}
}
```

Errors:

```
{
  success: false,
  error: "message"
}
```

---

# State Management

Prefer local state using:

* React state
* React hooks

Avoid adding global state libraries unless absolutely necessary.

---

# Performance Considerations

* Avoid unnecessary re-renders
* Use server components where possible
* Lazy load heavy UI sections if needed

---

# Code Quality

Claude should generate code that is:

* readable
* typed (when possible)
* well structured
* maintainable

Avoid large monolithic files.

Prefer splitting logic into smaller modules.

---

# AI Collaboration Strategy

Claude may assist with:

* component scaffolding
* UI layout generation
* Tailwind styling
* API scaffolding
* utility functions
* database queries

However, Claude should avoid:

* generating overly complex abstractions
* introducing heavy frameworks
* changing the overall architecture without clear reason

---

# Summary

Claude should prioritize:

* clean code
* modular architecture
* maintainable UI
* minimal dependencies
* clear data flow

The goal is to build a simple but well-structured wedding invitation system.
