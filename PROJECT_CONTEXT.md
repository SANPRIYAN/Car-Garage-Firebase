# 🚗 Car Garage — Project Context & Documentation

> **Who is this for?** This document is written for anyone — even someone who has never written a line of code — who wants to understand what this project is, how it works, and what every file does. Technical words are always explained in plain English.

---

## 📖 Table of Contents

1. [What Is This App?](#1--what-is-this-app)
2. [The Technology Stack (What Tools We Used)](#2--the-technology-stack-what-tools-we-used)
3. [How the Project Was Built — A Brief History](#3--how-the-project-was-built--a-brief-history)
4. [How Login Works (Step by Step)](#4--how-login-works-step-by-step)
5. [How Car Data Is Stored](#5--how-car-data-is-stored)
6. [How Car Photos (Images) Work](#6--how-car-photos-images-work)
7. [File Structure — Every File Explained](#7--file-structure--every-file-explained)
8. [Environment Variables — The Secret Config File](#8--environment-variables--the-secret-config-file)
9. [How Everything Connects Together](#9--how-everything-connects-together)
10. [Quick Reference — Key Concepts Glossary](#-quick-reference--key-concepts-glossary)

---

## 1. 🏁 What Is This App?

**Car Garage** is a web application — a program that runs inside a web browser, just like a website.

Think of it like a **shared digital garage** that lives online. Here's what you can do with it:

- **Log in** using your Google account (handled safely and securely)
- **Add a car** by entering its make (brand), model (name), and uploading a photo
- **View all cars** in a grid — like a community showroom where everyone's cars are on display
- **Edit or delete your own cars** — but you cannot touch anyone else's cars

That's it! Simple concept, but it uses several modern tools to make it work reliably.

---

## 2. 🔧 The Technology Stack (What Tools We Used)

A "technology stack" just means the collection of tools and services that power the app. Think of it like the ingredients in a recipe.

| Tool | What It Is | Why We Use It |
|---|---|---|
| **React** | A JavaScript library for building user interfaces (the visual part of the app) | Makes it easy to build interactive pages that update automatically |
| **Vite** | A "development server" — a tool that runs React on your computer while you build | Makes development fast; also bundles the app for production |
| **Tailwind CSS v4** | A collection of pre-made style classes for making things look good | Lets us style buttons, cards, layouts, etc. without writing custom CSS from scratch |
| **Firebase Firestore** | A cloud database owned by Google | Stores all the car data (make, model, owner info, image link, etc.) online |
| **Dropbox** | A cloud file storage service | Stores the actual image files (car photos) |
| **Auth0** | A third-party login service | Handles all the secure "who are you?" login/logout logic |
| **@tanstack/react-query** | A data-fetching library for React | Smartly fetches car data from Firestore and keeps it cached (saved temporarily) so the app doesn't reload constantly |

### 💡 A Helpful Analogy

Imagine a physical car showroom:
- **React** is the showroom building and its displays — the thing you see and interact with
- **Firestore** is the filing cabinet in the back office — it stores all the records about each car
- **Dropbox** is the photo album — it holds the actual pictures of the cars
- **Auth0** is the security guard at the door — it checks your ID before letting you in
- **Tailwind CSS** is the interior designer — it makes the showroom look beautiful
- **React Query** is the assistant who fetches files from the cabinet for you and remembers what you last asked for

---

## 3. 📜 How the Project Was Built — A Brief History

Understanding the project's history helps explain why certain things are set up the way they are.

### Step 1 — Project Started with Vite + React
The project was created using a tool called **Vite** (pronounced "veet"), which automatically sets up a React project with a good folder structure. Think of it like using a pre-built house frame instead of starting from scratch with bricks.

### Step 2 — Firebase Authentication (Original Login System)
At first, users logged in using **Firebase Authentication** with Google Sign-In. Firebase Auth is Google's own login system. This showed a Google popup directly in the app. It worked, but had limitations.

### Step 3 — Firestore Database Was Set Up
**Firebase Firestore** (Google's cloud database) was connected to store car documents. Each car became a "document" (like a record card) in the database.

### Step 4 — Dropbox Was Added for Images
Rather than storing photos inside Firebase Storage (Google's file storage), **Dropbox** was used instead — because the developer already had a Dropbox integration ready to go. When a car photo is uploaded, it goes straight to Dropbox.

### Step 5 — Firebase Auth Was Replaced by Auth0
The login system was **completely swapped** from Firebase Auth to **Auth0**. Why? Auth0 is a dedicated authentication service that works with many different login providers (Google, GitHub, email/password, etc.) and gives more control. The login flow changed from a popup to a **redirect** — meaning the user is sent to Auth0's login page, logs in there, and gets sent back to the app.

### Step 6 — One-Time Data Migration Was Added
Switching from Firebase Auth to Auth0 caused a problem: **user IDs changed format**.

- Firebase Auth gave Google users IDs like: `108123456789` (just a number)
- Auth0 gives Google users IDs like: `google-oauth2|108123456789` (a number with a prefix)

All the old car records had the old-style IDs as the owner. So we added a **migration** — a one-time automatic fix that, on the user's first login with Auth0, updates all their old car records to use the new ID format. This happens invisibly in the background.

### Step 7 — Port Set to 3000
The local development server (what runs on your computer when building the app) was set to always use port **3000**. This means the app is always at `http://localhost:3000` on your machine. (A "port" is like a door number on a building — it tells your browser which specific program to talk to.)

---

## 4. 🔐 How Login Works (Step by Step)

Here is exactly what happens when a user visits the app and logs in:

```
1. User opens the app in their browser
         ↓
2. App asks Auth0: "Is this person already logged in?"
         ↓
3. Auth0 says NO → App shows the Login Page
         ↓
4. User clicks "Continue with Google"
         ↓
5. App calls Auth0: "loginWithRedirect()"
   → Browser navigates away to: https://dev-os3q45l0f7zsfsef.us.auth0.com
         ↓
6. User picks their Google account and approves
         ↓
7. Auth0 redirects the browser back to: http://localhost:3000
   (with a secret auth token hidden in the URL)
         ↓
8. App now asks Auth0: "Is this person logged in?"
   Auth0 says YES → gives us: user.sub = "google-oauth2|108123456789"
         ↓
9. App runs the one-time migration (if never run before)
         ↓
10. App shows the full Dashboard (AddCarForm + CarList)
```

The user's unique identity is stored in a field called `user.sub` (short for "subject" — just Auth0's word for "who this person is"). It looks like `google-oauth2|108123456789`.

---

## 5. 🗃️ How Car Data Is Stored

Each car in the Firestore database is stored as a **document** (think: a digital index card). Here is what each card looks like:

```json
{
  "make": "Porsche",
  "model": "911 GT3",
  "garageId": "google-oauth2|108123456789",
  "ownerId": "google-oauth2|108123456789",
  "ownerName": "John Doe",
  "imageUrl": "https://dl.dropboxusercontent.com/...",
  "imagePath": "/garages/google-oauth2|108.../cars/carId/filename.jpg"
}
```

| Field | What It Means |
|---|---|
| `make` | The brand of the car (e.g. "Porsche", "Honda") |
| `model` | The specific model name (e.g. "911 GT3", "Civic") |
| `garageId` | Which user's garage this car belongs to (same as `ownerId`) |
| `ownerId` | The unique Auth0 ID of the person who added the car |
| `ownerName` | The display name of the owner (e.g. "John Doe") |
| `imageUrl` | A web link to the car's photo stored on Dropbox |
| `imagePath` | The file path inside Dropbox (used when deleting the image) |

The **`ownerId`** is the key field — it's how the app knows which cars belong to which user. Only the matching user can edit or delete a car.

---

## 6. 🖼️ How Car Photos (Images) Work

Here is the journey of a car photo from your computer to the screen:

```
1. User picks a photo file on the AddCarForm
         ↓
2. The image is uploaded to DROPBOX (not Firebase)
         ↓
3. Dropbox gives back a shareable web link (a URL)
         ↓
4. That URL is saved into the car's Firestore document as "imageUrl"
         ↓
5. When CarCard displays the car, it simply does:
   <img src={car.imageUrl} />
   → The browser loads the photo directly from Dropbox
```

**Why Dropbox instead of Firebase Storage?**
The developer already had a working Dropbox setup. Dropbox was a ready-made solution, so it was used to avoid extra complexity.

**How Dropbox access works:**
Dropbox requires a special password (called an **access token**) to upload and delete files. We store a "long-lived" token (one that doesn't expire quickly) in the `.env` file (explained later). When the app needs to upload, it first exchanges this long-lived token for a fresh short-lived token, then uses that to talk to Dropbox.

---

## 7. 📁 File Structure — Every File Explained

Here is the complete list of important files and folders in the project, explained in plain English.

---

### 🗂️ Root-Level Files (Top of the Project Folder)

---

#### `index.html`
The very first HTML file the browser loads. HTML is the skeleton of a web page. This file is nearly empty — it just has a `<div id="root">` tag. Think of it as a blank canvas with a single labeled spot where React will paint the entire app.

---

#### `vite.config.js`
The settings file for **Vite** (the development tool). Key settings:
- Loads the **React plugin** (so Vite understands React code)
- Loads the **Tailwind CSS plugin** (so Vite processes the styling)
- Sets the development **port to 3000** (so the app runs at `http://localhost:3000`)

---

#### `package.json`
A file that lists:
- All the **external libraries** (packages) the project depends on — like React, Auth0, Tailwind, etc.
- **Scripts** you can run with `npm run ...`:
  - `npm run dev` — starts the development server on your computer
  - `npm run build` — compiles the app for production (public release)
  - `npm run lint` — checks for code style problems
  - `npm run preview` — previews the built production version locally

---

#### `.env`
A **secret configuration file** that holds private API keys (passwords/credentials) for all the services. This file is **never committed to Git** (never shared publicly) because it contains sensitive secrets. See [Section 8](#8--environment-variables--the-secret-config-file) for the full list.

---

#### `.env.example`
A **safe template** of `.env` that shows which variables are needed, but with the actual values removed. This *is* committed to Git so other developers know what to fill in. Example:
```
VITE_FIREBASE_API_KEY=your_key_here
VITE_AUTH0_DOMAIN=your_domain_here
```

---

#### `firebase.json`
A settings file used by the **Firebase CLI** (a command-line tool for managing Firebase). It tells the CLI what to deploy — in this case, the Firestore security rules.

---

#### `firestore.rules`
The **security rules** for the Firestore database. These rules define who is allowed to read or write data. This file is written in a special Firebase rules language and is deployed to Google's servers.

> ⚠️ **Current Rule: `allow read, write: if true`**
> The rules were originally set to `request.auth != null` — meaning "only allow logged-in Firebase users." But when we switched to Auth0, Firebase no longer knows who is logged in (Auth0 handles that separately), so Firebase was blocking *every* request. The fix was to open the rules to `allow read, write: if true` — meaning anyone can technically read/write the database. **Access control is enforced on the frontend instead** — Auth0 ensures the user is logged in before they can see or touch any data in the app.
>
> This is perfectly fine for a personal/college project. In a real production app, you would want to verify Auth0's JWT token inside the Firestore rules for tighter security.

---

#### `firestore.indexes.json`
Defines **Firestore indexes**. An index is like the index in the back of a book — it helps the database find records quickly. When you query cars by `ownerId` and sort by date, Firestore needs an index for that combination. This file tells Firestore to create those indexes.

---

#### `.firebaserc`
A tiny file that tells the **Firebase CLI** which Firebase project to use. In this case, it points to the project named `car-garage-599e2`.

---

### 🗂️ `src/` Folder (Source Code — The Heart of the App)

---

#### `src/main.jsx`
The **entry point** of the React app. It's the first JavaScript file that runs. It does two critical things:

1. **Wraps the whole app in `Auth0Provider`** — This is like plugging in the security system. Every component (building block) in the app can now ask "is the user logged in?" and get an answer.

2. **Wraps the whole app in `QueryClientProvider`** — This is like plugging in the data librarian. Every component can now fetch, cache, and share data from Firestore.

---

#### `src/App.jsx`
The **main brain** of the application. It controls what gets shown on the screen based on the user's login status:

| Situation | What the User Sees |
|---|---|
| App is still loading | A spinning loading indicator |
| User is NOT logged in | The `<Login />` page |
| User IS logged in | The full dashboard: `<AddCarForm>` + `<CarList>` |

It also:
- Runs the **one-time migration** (fixes old car ownership IDs) when a user first logs in with Auth0
- Converts the Auth0 user object into a simpler shape: `{ uid, displayName, email }` so other components don't need to worry about Auth0's internal format

---

#### `src/components/Login.jsx`
The **login page** that users see when they are not authenticated (not signed in). It displays a stylish card with a "Continue with Google" button. When clicked, it calls `loginWithRedirect()` — which sends the user's browser to Auth0's hosted login page. The card uses a visual style called **glassmorphism** (a frosted-glass, semi-transparent look that's popular in modern design).

---

#### `src/config/firebaseConfig.js`
Initializes (starts up) the connection to **Firebase** using the secret credentials from `.env`. It exports two things that other files can use:

- **`db`** — the Firestore database connection. Used whenever we want to read or write car data.
- **`functions`** — Firebase Cloud Functions connection (available for future features, not used yet).

> ⚠️ **Important Note:** Firebase Authentication is **NOT** set up here anymore. Auth0 now handles all login logic. Firebase is only used for its Firestore database.

---

#### `src/services/auth.js`
This file previously contained Firebase sign-in and sign-out functions (like `signInWithGoogle()` and `signOut()`). Since we switched to Auth0, those functions were removed. The file is now empty/unused, but kept around in case future utility functions related to authentication are needed.

---

#### `src/services/firestore/carService.js`
Think of this as the **Firestore operation handbook**. It's a collection of functions that know how to talk to the Firestore database. Each function does one specific job:

| Function | What It Does |
|---|---|
| `getAll()` | Fetches every car in the entire database |
| `getAllForGarage(garageId)` | Fetches only the cars belonging to a specific user |
| `getById(carId)` | Fetches a single specific car by its unique ID |
| `create(carData)` | Adds a brand new car document to the database |
| `update(carId, updates)` | Changes specific fields on an existing car |
| `remove(carId)` | Permanently deletes a car from the database |

Other parts of the app use these functions instead of talking to Firestore directly — it keeps things organized.

---

#### `src/services/dropbox/` (Folder)

This folder contains two files that handle everything Dropbox-related:

**`dropboxAuth.js`**
Gets a fresh, short-lived access token from Dropbox. The `.env` file holds a long-lived token (like a master key), and this file uses it to get a temporary working key before each upload. Think of it like using your ID card to get a visitor badge — the visitor badge is what actually gets you through the door.

**`dropboxUpload.js`**
Does three things related to Dropbox files:
1. **Upload** a file to Dropbox
2. **Get a shareable link** — a public web URL to display the image
3. **Delete a file** from Dropbox — used when a car is deleted

---

#### `src/services/orchestration/carImageOrchestrator.js`
This is the **coordinator** — it knows about BOTH Firestore and Dropbox and combines them together. Think of it as a project manager who delegates tasks.

| Function | What It Does |
|---|---|
| `uploadCarImage()` | Uploads a photo to Dropbox, gets the link, and saves the link into the Firestore car document |
| `deleteCarAndImage()` | Deletes the car record from Firestore AND removes the photo from Dropbox — both, together |

This file exists because deleting a car should also delete its image — that coordination logic is kept in one place.

---

#### `src/services/migration/ownerIdMigration.js`
A **one-time automatic fix** for the ID format problem caused by switching from Firebase Auth to Auth0. Here is exactly what it does, step by step:

1. **Checks localStorage** (a small storage area in the browser) for a flag called `auth0_migration_done`. If it's already there, the migration has already run → it stops immediately.
2. **Strips the prefix** from the Auth0 ID: turns `google-oauth2|108123456789` into just `108123456789` (the old Firebase-style ID).
3. **Queries Firestore** for all car documents where `ownerId` equals the old raw number ID.
4. **Updates those cars** to use the full Auth0 ID (`google-oauth2|108123456789`) as both `ownerId` and `garageId`.
5. **Saves `auth0_migration_done` to localStorage** so this never runs again.

This means users who added cars under the old Firebase Auth system will still see and own their cars after switching to Auth0.

---

#### `src/hooks/useCars.js`
**Custom React hooks** that wrap around the carService functions and plug them into **React Query** (the data-fetching library). Hooks are a React concept — they're special functions that let components "hook into" features like data fetching.

| Hook | What It Does |
|---|---|
| `useAllCars()` | Fetches all cars and keeps them cached |
| `useCars(garageId)` | Fetches cars for a specific user's garage |
| `useCreateCar()` | Gives a component the ability to add a car |
| `useUpdateCar()` | Gives a component the ability to update a car |
| `useDeleteCar()` | Gives a component the ability to delete a car |
| `useCarImageUpload()` | Gives a component the ability to upload a car image |

**Why React Query?** Without it, you'd have to manually track whether data is loading, whether it errored, and manually re-fetch after changes. React Query handles all of that automatically, including **caching** (remembering recently fetched data so you don't re-fetch unnecessarily).

---

#### `src/features/cars/AddCarForm.jsx`
The **sidebar form** where users add new cars. It has three input fields:
1. Car Make (text input — e.g., "Toyota")
2. Car Model (text input — e.g., "Supra")
3. Photo (file picker — user selects an image from their computer)

**What happens when the user clicks Submit:**
1. A new car document is created in Firestore with the user's Auth0 ID as `ownerId`
2. If the user selected a photo, it gets uploaded to Dropbox and the shareable URL is saved to the Firestore document

---

#### `src/features/cars/CarList.jsx`
Fetches **all cars** from Firestore using the `useAllCars()` hook and displays them in a **responsive grid** (a layout that adjusts columns based on screen size). Each car in the grid is rendered using a `CarCard` component.

---

#### `src/features/cars/CarCard.jsx`
Displays a **single car** in the grid. Shows:
- The car's photo (if it has one)
- Make and model
- Owner's name

If the **currently logged-in user is the owner** of this car, two extra buttons appear:
- **Edit** — lets the user change the car's make, model, or photo
- **Delete** — removes the car from Firestore and its image from Dropbox

If you are NOT the owner, you see the car info only — no edit/delete buttons.

---

## 8. 🔑 Environment Variables — The Secret Config File

The `.env` file sits in the root of the project and holds all the private credentials (passwords and API keys) the app needs to talk to external services. **This file must never be shared publicly.**

Here is what each variable means:

| Variable | What It's For |
|---|---|
| `VITE_FIREBASE_API_KEY` | The API key (public password) for the Firebase project |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase's auth domain — still needed for Firestore initialization even though we don't use Firebase Auth anymore |
| `VITE_FIREBASE_PROJECT_ID` | The unique ID of the Firebase project (`car-garage-599e2`) |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket address (included for completeness, not actively used) |
| `VITE_FIREBASE_APP_ID` | The unique ID of this specific Firebase app within the project |
| `VITE_DROPBOX_ACCESS_TOKEN` | The long-lived token that allows the app to upload and delete files on Dropbox |
| `VITE_AUTH0_DOMAIN` | The address of the Auth0 tenant (login service) — looks like `dev-xxxx.us.auth0.com` |
| `VITE_AUTH0_CLIENT_ID` | The unique ID of this application within Auth0 |

> 💡 **Why does every variable start with `VITE_`?**
> Vite only exposes environment variables to the browser-side code if they start with `VITE_`. It's a safety feature — any variable without that prefix is invisible to the app, preventing accidental exposure of server-only secrets.

---

## 9. 🔗 How Everything Connects Together

Here is a bird's-eye view of how all the pieces talk to each other:

```
Browser (User's Screen)
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│                     React App (Vite)                    │
│                                                         │
│  ┌────────────┐    ┌─────────────┐    ┌──────────────┐  │
│  │  Login.jsx │    │  App.jsx    │    │  CarList.jsx │  │
│  │  (login    │    │  (controls  │    │  (shows all  │  │
│  │   button)  │    │   the flow) │    │   cars)      │  │
│  └──────┬─────┘    └──────┬──────┘    └──────┬───────┘  │
│         │                 │                  │           │
└─────────┼─────────────────┼──────────────────┼───────────┘
          │                 │                  │
          ▼                 ▼                  ▼
    ┌──────────┐     ┌──────────────┐   ┌──────────────────┐
    │  Auth0   │     │ Migration    │   │  Firestore       │
    │ (login / │     │ Service      │   │  (car database)  │
    │  logout) │     │ (fixes IDs)  │   │                  │
    └──────────┘     └──────────────┘   └──────────────────┘
                                               ▲
                                               │ imageUrl saved here
                                               │
                                        ┌──────────────┐
                                        │   Dropbox    │
                                        │ (car photos) │
                                        └──────────────┘
```

**The flow in words:**
1. **Auth0** handles all login/logout — the app never sees the user's raw password
2. **App.jsx** is the traffic controller — it decides what to show based on login state
3. **Firestore** is the source of truth for car data — all reads and writes go here
4. **Dropbox** stores the actual image files — Firestore only stores the web link (URL) to the image
5. **React Query** sits between the React components and Firestore, smartly managing when to fetch and when to use cached data
6. The **Migration Service** runs once silently in the background to bridge the gap between old and new user IDs

---

## 🔔 Known Warnings & Notes

### Auth0 "Development Keys" Warning
When you log in via Google through Auth0 and see a banner that says **"This app is using development keys"** — that is completely normal and expected during development. Here's what it means:

- By default, Auth0 provides its own shared Google OAuth credentials so you can test Google login quickly, without setting up anything in Google Cloud.
- These are called **development keys** — they are Auth0's test credentials, not your own.
- In production (a live, public app), you would need to create your own Google OAuth 2.0 credentials:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create an OAuth 2.0 Client ID under "APIs & Services → Credentials"
  3. Paste the Client ID and Secret into **Auth0 Dashboard → Authentication → Social → Google**
- For a college/dev project, the development keys work perfectly fine — you can safely ignore the warning.

---

## 🧩 Quick Reference — Key Concepts Glossary

| Term | Plain English Explanation |
|---|---|
| **React** | A JavaScript tool for building interactive web pages out of reusable "components" (building blocks) |
| **Component** | A self-contained chunk of UI — like a button, a card, or a form — that can be reused |
| **Vite** | A tool that runs your React app locally while you develop it, and packages it for release |
| **Firestore** | A cloud database from Google where data is stored as "documents" inside "collections" |
| **Document** | A single record in Firestore — like a row in a spreadsheet, but more flexible |
| **Collection** | A group of documents in Firestore — like a spreadsheet tab |
| **Auth0** | A service that handles login/logout so we don't have to build it ourselves |
| **`user.sub`** | Auth0's unique identifier for a logged-in user (e.g. `google-oauth2|108123456789`) |
| **API Key** | A unique password that allows our app to access an external service (like Firebase or Dropbox) |
| **`.env` file** | A local-only file storing secret credentials — never shared publicly |
| **Hook** | A special React function (starting with `use`) that gives components access to shared features |
| **Cache** | Temporarily stored data — React Query caches fetched data so it doesn't re-fetch unnecessarily |
| **Migration** | A one-time script that converts old data format to a new format |
| **Redirect** | When a browser is sent from one URL to another — used in the Auth0 login flow |
| **Port** | A "door number" for network connections — port 3000 means `http://localhost:3000` |
| **Token** | A temporary digital key that proves you are authorized to use a service |
| **Glassmorphism** | A modern UI design style using frosted-glass-like, semi-transparent elements |

---

*Last updated: August 2026*
