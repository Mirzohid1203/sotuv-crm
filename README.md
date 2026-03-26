# Sotuv CRM - Premium Sales Management System

Sotuv CRM is a modern, responsive, and production-ready Customer Relationship Management application built with Next.js, Tailwind CSS, and Firebase. It is designed to be easily white-labeled and sold to small businesses, entrepreneurs, and sales offices.

## Features Included
1. **Secure Authentication**: Utilizing Firebase Auth (Sign In, Sign Up).
2. **Interactive Dashboard**: KPI metrics and interactive sales charts using `recharts`.
3. **Customers Management**: Full CRUD on customers synced to Firestore.
4. **Kanban Pipeline**: Drag-and-drop Deal Pipeline utilizing `@hello-pangea/dnd`.
5. **Task Follow-ups**: Easy to add tasks linked to clients.
6. **File Uploading**: Avatar/Document uploading configured with Firebase Storage.
7. **Global State**: Managed effectively by `zustand`.

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ installed.
- A free account on [Firebase Console](https://console.firebase.google.com/).
- [Vercel](https://vercel.com/) account for optional 1-click deployment.

### 2. Firebase Configuration
1. Go to Firebase Console and Create a New Project.
2. Enable **Authentication** (Email/Password provider).
3. Enable **Firestore Database** (start in Test Mode initially if you wish, or use the following rules):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
4. Enable **Firebase Storage**. Set the rules allowing auth requests:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
5. Go to Project Settings -> General -> Your Apps, add a Web App to reveal your configuration keys.

### 3. Local Environment Setup
Create a `.env.local` file in the root of the project with your Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Running Locally
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application will redirect to the `/login` route automatically protecting your CRM.

### 5. Deployment
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).
When deploying, make sure to add all corresponding `NEXT_PUBLIC_FIREBASE_*` environment variables directly into your Vercel Project Settings.

---
Built with ❤️ ready for White-Labeling and Resale.
