# NOTES APP👋

## Project image

<img src="https://socialify.git.ci/Masande07i/notes-App/image?language=1&name=1&owner=1&stargazers=1&theme=Light" alt="notes-App" width="640" height="320" />

A simple React Native notes application built with Expo. The app allows users to create an account, log in, manage their profile, and create and organise personal notes.

## Features

- User registration and login
- Multiple user accounts
- Logout
- Protected screens
- Profile information updates
- Password changes
- Create notes
- Edit notes
- Delete notes
- Note categories:
  - Work
  - Study
  - Personal
- Search notes
- Sort notes by newest or oldest
- Date added and edited date
- User-specific notes
- Local data storage using AsyncStorage

## Technologies

- React Native
- Expo
- Expo Router
- TypeScript
- AsyncStorage
- bcryptjs
- Expo Crypto
- Ionicons

## Project Structure

```text
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── auth/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (protected)/
│       ├── _layout.tsx
│       ├── home.tsx
│       ├── categories.tsx
│       └── profile.tsx
│
├── components/
│   └── addNoteModal.tsx
│
└── services/
    └── auth.ts
```

## Getting Started

### 1. Clone the project

```bash
git clone <your-github-repository-url>
cd <project-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the application

```bash
npx expo start
```

You can then run the application using:

- Expo Go
- Android Emulator
- iOS Simulator
- Web browser

## How It Works

### Authentication

Users can create an account using a username, email and password.

Passwords are hashed using `bcryptjs` before being stored locally.

The app supports multiple users. Each registered account is stored separately, and the currently logged-in user is stored using AsyncStorage.

### Notes

Notes are stored locally using AsyncStorage.

Each user's notes are saved using their email address as part of the storage key. This prevents one user from seeing another user's notes.

Each note contains:

- Title
- Note content
- Category
- Date added
- Edited date

### Profile

Users can:

- Update their username
- Update their email
- Change their password
- Log out

A user's current password is required before making profile or password changes.

## Data Storage

This project uses **AsyncStorage** as a local storage solution.

The main storage values include:

```text
users
loggedInUser
notes_<user-email>
```

Because AsyncStorage is local to the device, this application is intended as a learning project rather than a production authentication system.

## Author

Masande

Built as a React Native learning project.