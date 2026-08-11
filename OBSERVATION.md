# Car Garage Web Application
### Lab Record — Observation Sheet

**Project Title:** Car Garage Web Application using React, Firebase, Dropbox, and Auth0  
**Technology Used:** React, Vite, Tailwind CSS, Firebase Firestore, Dropbox API, Auth0, React Query

---

## Aim / Objective

To build a full-stack web application where users can log in securely, add their cars with photos, and view all cars in a shared garage. The project demonstrates the integration of multiple cloud services including a database, file storage, and authentication.

---

## Observations / Steps Performed

1. **Project Initialization** — The project was initialized using the **Vite + React** framework. Vite sets up a ready-to-use React project structure quickly and runs the app on a local development server.

2. **Styling with Tailwind CSS** — **Tailwind CSS** was added for styling the application. It provides pre-built utility classes that make it easy to design responsive and modern-looking pages without writing custom CSS from scratch.

3. **Firebase Firestore Setup** — **Firebase Firestore** (a cloud-based NoSQL database by Google) was connected to the project. Car records are stored here as documents, each containing fields like `make`, `model`, `ownerId`, and `imageUrl`.

4. **Dropbox Integration for Images** — The **Dropbox API** was integrated to handle image uploads. When a user adds a car, the photo is uploaded to Dropbox, and the shareable link (URL) is saved in Firestore. Car images are served directly from Dropbox.

5. **Firebase Authentication (Initial)** — Initially, **Firebase Authentication** with Google Sign-In was used for user login. This showed a Google sign-in popup inside the app.

6. **Switched to Auth0** — Firebase Authentication was replaced with **Auth0**, a dedicated authentication service. Auth0 supports multiple login providers and offers more flexibility. The login flow changed from a popup to a **redirect-based flow** (Universal Login).

7. **Auth0 Redirect Login Flow** — With Auth0, when the user clicks "Continue with Google", the browser is redirected to Auth0's hosted login page. After successful login, the user is redirected back to the app at `http://localhost:3000`.

8. **One-Time Data Migration** — Switching from Firebase Auth to Auth0 changed the user ID format (e.g., from `108123456789` to `google-oauth2|108123456789`). A migration script was written and runs automatically on the first login to update all existing car records to the new ID format.

9. **Firestore Security Rules Updated** — Since Firebase no longer handles authentication, the Firestore security rules were changed from `request.auth != null` to `allow read, write: if true`. Access control is now enforced through Auth0 on the frontend side.

10. **App Port Set to 3000** — The development server was configured to always run on port **3000**, making the app accessible at `http://localhost:3000` during development. This is set in `vite.config.js`.

11. **Environment Variables for Security** — All sensitive credentials (Firebase API key, Auth0 domain, Dropbox token, etc.) are stored in a `.env` file which is never committed to Git. This keeps secret keys secure and out of the source code.

12. **React Query for Data Fetching** — **@tanstack/react-query** was used to fetch and cache car data from Firestore. It automatically handles loading states, error states, and re-fetching after data changes — making data management much cleaner.

---

## Result

The Car Garage web application was successfully built and runs on `localhost:3000`. Users can log in with Google via Auth0, add cars with photos (stored on Dropbox), and view all cars in a shared grid. The project demonstrates integration of React, Firebase Firestore, Dropbox, and Auth0 in a real-world application.

---

*Submitted as part of college lab record — August 2026*
