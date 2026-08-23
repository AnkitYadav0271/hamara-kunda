
# Hamara Kunda

> A local community platform that connects people, businesses, events, and important community updates in one place.

Hamara Kunda is a community-focused social platform designed to help people discover what is happening around them, connect with local people and businesses, promote events, and share useful local information.

The project consists of a **Node.js/Express/TypeScript backend** and a **React Native + Expo mobile application**.

---

## Table of Contents

* [Project Vision](#project-vision)
* [Core Features](#core-features)

  * [Authentication](#1-authentication)
  * [User Profiles](#2-user-profiles)
  * [User Following](#3-user-following)
  * [Posts](#4-posts)
  * [Post Likes](#5-post-likes)
  * [Comments](#6-comments)
  * [Businesses](#7-businesses)
  * [Business Categories](#8-business-categories)
  * [Business Followers](#9-business-followers)
  * [Business Ratings](#10-business-ratings)
  * [Events](#11-events)
  * [Updates](#12-updates)
  * [Media](#13-media)
  * [Feed](#14-feed)
  * [Sharing](#15-sharing)
  * [Admin Moderation](#16-admin-moderation)
  * [Verification](#17-verification)
  * [Sponsored Content](#18-sponsored-content)
* [Content Relationships](#content-relationships)
* [User Roles](#user-roles)
* [Content Status](#content-status)
* [API Architecture](#api-architecture)
* [Mobile Application](#mobile-application)
* [Development Principles](#development-principles)
* [Future Features](#future-features)

---

# Project Vision

Hamara Kunda is intended to become a digital hub for local communities.

Instead of users having to rely on multiple platforms for:

* Finding local businesses
* Discovering events
* Reading community announcements
* Sharing local information
* Connecting with people
* Finding useful posts

Hamara Kunda brings these activities together.

The first version focuses on creating a strong foundation rather than implementing every possible social-media feature.

---

# Core Features

## 1. Authentication

Users can create accounts and securely access the platform.

### Features

* User registration
* Login
* Email verification
* OTP verification
* Password hashing
* Authentication tokens
* Protected API routes
* User logout/session management

Users who have not verified their email should not receive the same privileges as fully verified users.

---

# 2. User Profiles

Every user has a public profile.

A profile can contain:

* Full name
* Username
* Profile image
* Followers count
* Following count
* User posts
* User-created content

Other users can visit profiles and interact with them.

---

# 3. User Following

Users can follow other users.

### Actions

```text
Follow user
Unfollow user
```

The system maintains:

```text
followersCount
followingCount
isFollowing
```

The initial version does not require follower/following lists.

The feature is intentionally kept simple for the MVP.

---

# 4. Posts

Posts are the primary user-generated content.

Users can create posts containing:

* Title
* Description
* Post type
* Media
* Optional business association

A post can belong to:

```text
User
Business
```

The `business_id` determines whether a post belongs to an individual user or a business.

### Post types

The system supports content classifications such as:

```text
user
business
alert
news
sponsored
```

---

# 5. Post Likes

Users can like posts.

A user should only be able to have one active like on a post.

The post response should provide:

```text
likesCount
isLiked
```

This allows the mobile application to immediately render the current like state.

---

# 6. Comments

Users can comment on posts.

Comments are associated with:

```text
user
post
```

The post response provides:

```text
commentsCount
```

The comment system can later be expanded with:

* Replies
* Comment likes
* Comment reporting
* Comment moderation

---

# 7. Businesses

Businesses are one of the major features of Hamara Kunda.

Users can create and manage their own businesses.

A business may contain:

* Business name
* Description
* Address
* Contact number
* Email
* Website
* Category
* Profile image
* Status
* Verification information

### Ownership

The user who creates a business owns it.

The owner has control over the business information.

Administrators can moderate businesses when suspicious or inappropriate activity is detected.

---

# 8. Business Categories

Businesses belong to predefined categories.

Examples:

```text
Education
Food
Healthcare
Shopping
Technology
Automotive
Beauty
Fitness
Travel
Professional Services
Home Services
Entertainment
Religious / Community
Other
```

Categories make businesses easier to discover and filter.

---

# 9. Business Followers

Users can follow businesses.

This allows users to stay connected with businesses they are interested in.

Examples:

```text
Follow a coaching center
Follow a restaurant
Follow a local shop
Follow a service provider
```

The initial version focuses on:

* Follow
* Unfollow
* Follower count

---

# 10. Business Ratings

Users can rate businesses.

Ratings are associated with:

```text
user
business
rating
```

Business pages can display:

```text
Average rating
Rating count
User reviews/ratings
```

The rating system helps users discover trustworthy local businesses.

---

# 11. Events

Events allow users and businesses to promote local activities.

Examples:

* Sports tournaments
* Workshops
* Educational events
* Cultural programs
* Festivals
* Community meetings
* Competitions
* Blood donation camps
* Local celebrations

An event can contain:

* Title
* Description
* Event type
* Address
* Start time
* End time
* Paid/free status
* Ticket price
* Creator
* Optional business
* Media

### Event media

Event media is uploaded when the event is created.

For the initial version, event media is intentionally immutable after creation.

If an organizer needs a completely different poster, they can create a new event.

---

# 12. Updates

Updates are official/community information rather than ordinary social posts.

They are intended for useful local information that users need to know.

Examples:

* Water supply interruption
* Electricity updates
* Road closures
* Government notices
* School announcements
* Health information
* Community announcements
* Festival information
* Local service announcements

Updates may be created by authorized users and must be approved by an administrator where required.

The goal is to provide useful information without making the feature feel like a frightening "alert" system.

---

# 13. Media

Media is separated from the main content tables.

Examples:

```text
post_media
event_media
update_media
```

Media records can contain:

```text
media_id
content_id
media_url
cloud_id
media_status
```

Cloudinary is used for media storage.

The database stores the relevant Cloudinary information rather than the binary file itself.

---

# 14. Feed

The feed is the main discovery surface of the application.

It can contain:

```text
Posts
Events
Updates
Sponsored content
```

The backend uses **cursor-based pagination**.

Example:

```http
GET /api/posts?cursor=123&limit=20
```

Cursor pagination is preferred over offset pagination because it behaves better as the dataset grows.

The mobile application will consume the feed using infinite scrolling.

---

---

# 15. Verification

Verification is used to establish trust.

### Email verification

Users receive an OTP through email.

The general flow is:

```text
Signup
   ↓
Create account
   ↓
Generate OTP
   ↓
Send verification email
   ↓
User enters OTP
   ↓
Verify account
```

Verification tokens should be short-lived.

OTP values should not be stored as plaintext where avoidable.

---

# 16. Sponsored Content

Sponsored content allows businesses or other approved entities to promote content.

Sponsored content should be clearly distinguishable from normal community content.

Possible sponsored content includes:

```text
Sponsored posts
Sponsored businesses
Sponsored events
```

The initial implementation should keep sponsorship simple and controlled by administrators.

---

# Content Relationships

The main relationships are:

```text
User
 ├── Posts
 ├── Comments
 ├── Likes
 ├── Businesses
 ├── Events
 ├── Updates
 └── Followers
```

```text
Business
 ├── Posts
 ├── Events
 ├── Followers
 ├── Ratings
 └── Media
```

```text
Post
 ├── Media
 ├── Likes
 └── Comments
```

```text
Event
 └── Media
```

```text
Update
 └── Media
```

---

# User Roles

## Normal User

Can:

* Create posts
* Like posts
* Comment
* Follow users
* Follow businesses
* Create businesses
* Create events
* Create permitted updates
* Rate businesses
* Share content

---

## Business Owner

A business owner can manage their own business.

They can:

* Edit business information
* Create business posts
* Create business events
* Manage their business content

They cannot modify another user's business.

---

## Administrator

Administrators can:

* Moderate content
* Hide suspicious businesses
* Hide inappropriate posts
* Moderate events
* Approve/reject updates
* Manage verification/moderation workflows

Administrative operations should be protected by role-based authorization.

---

# Content Status

Content should generally use soft deletion/moderation instead of immediately destroying database records.

Example statuses:

```text
active
hidden
deleted
```

This is particularly useful for:

* Posts
* Businesses
* Events
* Updates
* Media

Soft deletion preserves history and makes future auditing possible.

---

# API Architecture

The backend follows a layered architecture:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

### Route

Defines the API endpoint.

### Middleware

Handles concerns such as:

* Authentication
* Authorization
* Validation
* File uploads
* Rate limiting

### Controller

Handles HTTP-specific concerns.

It should not contain complex business logic.

### Service

Contains business rules and workflows.

### Repository

Handles database queries.

This separation keeps the backend maintainable as the application grows.

---


# Features to Implement (Not implemented)

## Admin Moderation

Administrators are responsible for maintaining the quality of the platform.

Admin capabilities include moderation of:

* Users
* Businesses
* Posts
* Events
* Updates

Administrators may hide content when suspicious, inappropriate, or harmful activity is detected.

The normal user should not have access to administrative operations.


# Mobile Application

The mobile application will be built using:

```text
React Native
Expo SDK 57
TypeScript
Expo Router
Axios
TanStack Query
Zustand
React Hook Form
Zod
Expo Secure Store
Expo Image
```

---

## API communication

Axios is responsible for HTTP communication.

```text
React Native
      ↓
TanStack Query
      ↓
API Service
      ↓
Axios
      ↓
Hamara Kunda API
```

TanStack Query handles server-state concerns such as:

* Caching
* Refetching
* Loading states
* Mutations
* Infinite queries
* Pagination

Zustand is reserved for application state such as:

* Authentication state
* Current user
* Theme
* Notification state

Server data such as posts and events should primarily remain in TanStack Query.

---

# Mobile Navigation

The initial navigation structure is expected to contain:

```text
Feed
Updates
Create
Events
Profile
```

Businesses can be discovered through:

* Search
* Feed
* User profiles
* Business links

---

# Development Principles

## 1. Build features end-to-end

A feature should generally follow:

```text
UI
 ↓
API integration
 ↓
Loading/error states
 ↓
Backend integration
 ↓
Testing
 ↓
Polish
```

Do not build dozens of screens and connect the backend later.

---

## 2. Keep server state separate from application state

Use:

```text
TanStack Query → server data
Zustand → application state
```

---

## 3. Avoid premature complexity

The first release should focus on:

* Reliability
* Usability
* Performance
* Security
* Real user feedback

Features should be expanded when real users demonstrate a need for them.

---

## 4. Mobile-first experience

Hamara Kunda is primarily designed around local community usage on mobile devices.

The application should prioritize:

* Fast loading
* Low bandwidth usage
* Good image handling
* Simple navigation
* Clear actions
* Reliable scrolling
* Good empty/error states

---

# Future Features

The following features are intentionally not required for the initial MVP.

Potential future additions include:

* Push notifications
* Followers/following lists
* User recommendations
* Business recommendations
* Post saves/bookmarks
* Event registrations
* Event reminders
* Advanced search
* Location-based discovery
* Nearby businesses
* Advanced moderation
* Reports
* Post sharing analytics
* Rich link previews
* Deep linking
* Business verification badges
* User verification badges
* Sponsored content management
* Advanced analytics
* Personalized feed
* Offline support

These should be prioritized based on actual user behavior rather than implemented all at once.

---

# MVP Philosophy

Hamara Kunda is not intended to become a clone of every existing social network.

The core purpose is:

> **Help people discover, participate in, and contribute to their local community.**

The MVP therefore focuses on four major content types:

```text
People
Businesses
Events
Community Updates
```

with social interaction through:

```text
Posts
Likes
Comments
Following
Ratings
Sharing
```

The first goal is to get this experience into the hands of real users, learn how they use it, and then evolve the platform based on real community needs.

