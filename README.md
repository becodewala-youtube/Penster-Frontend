# Penster 

Penster is a modern, responsive blogging platform frontend built with React, TypeScript, and Tailwind CSS. It provides a rich user experience for creating, reading, and interacting with blog posts, featuring robust authentication, dynamic content display, and a dark/light theme. This repository serves as the client-side application for a MERN stack blogging platform.



## Table of Contents

- [Key Features](#key-features)

- [Architecture Overview](#architecture-overview)

- [Tech Stack](#tech-stack)

- [Getting Started](#getting-started)

  - [Prerequisites](#prerequisites)

  - [Installation](#installation)

- [Configuration](#configuration)

- [Usage](#usage)

- [Project Structure](#project-structure)

- [Scripts](#scripts)

- [Roadmap](#roadmap)

- [Contributing](#contributing)

- [Testing](#testing)

- [License](#license)

- [Acknowledgements](#acknowledgements)

## Key Features

-   **User Authentication**: Secure user registration, login, email verification, password reset, and Google OAuth integration.

-   **Post Management**: Create, view, edit, and delete blog posts. Supports markdown content and image uploads.

-   **Drafts Functionality**: Save posts as drafts before publishing.

-   **Interactive Content**: Like, comment on, and bookmark posts.

-   **Dynamic Search & Filtering**: Search posts by keywords, filter by categories, and sort by various criteria (latest, oldest, most liked, most commented).

-   **User Profiles**: View personal profiles, manage posts and bookmarks, and explore other users' profiles.

-   **Follow/Unfollow System**: Connect with other users by following their profiles.

-   **Responsive Design**: Optimized for various screen sizes using Tailwind CSS.

-   **Theme Toggle**: Switch between light and dark modes for personalized viewing.

-   **Skeletons & Loading States**: Enhanced user experience with loading skeletons for content.

## Architecture Overview

The Penster Frontend is a Single Page Application (SPA) built with React and Vite. It communicates with a backend API (expected to be a Node.js/Express server with MongoDB, forming the MERN stack) to fetch and manipulate data. React Router DOM handles client-side navigation, providing a seamless user experience. State management is primarily handled through React's `useState` and `useContext` hooks, with dedicated contexts for authentication and theme management. Tailwind CSS is used for utility-first styling, ensuring a consistent and responsive UI across the application. Axios is employed for making HTTP requests to the backend API.

## Tech Stack

| Area | Tool | Version |
|---|---|---|
|---|---|---|
| Frontend Framework | React | 18.3.1 |
| Language | TypeScript | 5.5.3 |
|---|---|---|
| Build Tool | Vite | 5.4.2 |
| Routing | React Router DOM | 6.22.3 |
|---|---|---|
| API Client | Axios | 1.6.7 |
| Styling | Tailwind CSS | 3.4.1 |
|---|---|---|
| Icons | Lucide React | 0.344.0 |
| Markdown Rendering | React Markdown | 9.0.1 |
|---|---|---|
| Linting | ESLint | - |
| CSS Post-processing | PostCSS, Autoprefixer | - |
|---|---|---|



## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

-   Node.js (LTS version recommended)

-   npm (comes with Node.js), yarn, or pnpm

### Installation

1.  **Clone the repository**:

```bash
git clone https://github.com/becodewala-youtube/Penster-Frontend.git

cd Penster-Frontend

```
2.  **Install dependencies**:

```bash
npm install

# or
yarn install

# or
    pnpm install

```
## Configuration

The application requires a backend API URL to function correctly. This is configured via an environment variable.

| ENV | Description | Example |
|---|---|---|
|---|---|---|
| `VITE_BACKEND_URL` | The base URL of the Penster backend API. | `http://localhost:5000` |



To set this up:

1.  Create a `.env` file in the root of the project.
2.  Add your backend API URL:

```ini
VITE_BACKEND_URL="http://localhost:5000"

```
Replace `http://localhost:5000` with the actual URL of your running backend server.

## Usage

To start the development server:

```bash
npm run dev

# or
yarn dev

# or
pnpm dev

```
The application will typically be available at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

```
.

├── public/
│   └── ...

├── src/
│   ├── components/

│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx

│   │   ├── PostDetailsSkeleton.tsx
│   │   ├── ProfileSkeleton.tsx

│   │   ├── Skeleton.tsx
│   │   └── UserProfileSkeleton.tsx

│   ├── context/
│   │   ├── AuthContext.tsx

│   │   └── ThemeContext.tsx
│   ├── pages/

│   │   ├── BookmarkedPosts.tsx
│   │   ├── CreatePost.tsx

│   │   ├── EditPost.tsx
│   │   ├── EmailVerification.tsx

│   │   ├── ForgotPassword.tsx
│   │   ├── Home.tsx

│   │   ├── Login.tsx
│   │   ├── OAuthCallback.tsx

│   │   ├── PostDetail.tsx
│   │   ├── Profile.tsx

│   │   ├── Register.tsx
│   │   ├── ResetPassword.tsx

│   │   ├── UserPosts.tsx
│   │   └── UserProfile.tsx

│   ├── App.tsx
│   ├── index.css

│   ├── main.tsx
│   └── vite-env.d.ts

├── .env.example
├── eslint.config.js

├── package.json
├── postcss.config.js

├── tailwind.config.js
├── tsconfig.app.json

├── tsconfig.json
├── tsconfig.node.json

├── vercel.json
└── vite.config.ts

```
## Scripts

| Command | Description |
|---|---|
|---|---|
| `dev` | Starts the local development server with Vite. |
| `build` | Compiles the TypeScript code and builds the project for production. |
|---|---|
| `lint` | Runs ESLint to check for code quality and style issues. |
| `preview` | Serves the production build locally for testing. |
|---|---|



## Roadmap

-   [ ] Implement real-time notifications (e.g., for new comments, likes, follows).

-   [ ] Implement a robust search backend with more advanced filtering.

-   [ ] Add unit and end-to-end tests for critical functionalities.

-   [ ] Improve accessibility across the application.

## Contributing

We welcome contributions to the Penster Frontend! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and ensure they adhere to the project's coding style.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code passes linting checks and includes appropriate tests if applicable.

## Testing

The project uses ESLint for static code analysis to maintain code quality and consistency.

To run the linter:

```bash
npm run lint

# or
yarn lint

# or
pnpm lint

```
Currently, there are no dedicated unit or end-to-end tests implemented. Adding these is a priority on the roadmap to ensure robustness and prevent regressions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (placeholder, create this file if it doesn't exist).

## Acknowledgements

-   Thanks to the creators of React, Vite, Tailwind CSS, and other open-source libraries that make this project possible.

-   Inspired by modern blogging platforms and user interfaces.

