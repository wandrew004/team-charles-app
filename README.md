# Team Charles App

This is an application dedicated to storing and recommending new recipes based on your current ingredients! Follow the steps below to clone the repository, set up the environment, and run the application along with its tests.

## Prerequisites

- **Git:** Ensure Git is installed on your machine.
- **Node.js and npm:** Install [Node.js](https://nodejs.org/) (which includes npm).

## Setup Instructions

### 1. Clone the Repository

Open your terminal and run the following commands:

```bash
git clone https://github.com/wandrew004/team-charles-app.git
cd team-charles-app
```

### 2. Install Dependencies and Launch the Backend

Navigate to the backend folder, install dependencies, and launch the backend:

```bash
cd backend
```
Install PostgreSQL https://www.postgresql.org/, then run the database initialization scripts
```bash
sh db_setup_scripts/init_db.sh -U username -d postgres
```
username is a user that you set up for postgres, postgres is the default database for management.

Then, create and add details to .env based on .env.example and run npm install and npm run dev.

```bash
npm install
npm run dev
```

### 3. Install Dependencies and Launch the Frontend

After completing the backend setup, navigate to the frontend folder, install dependencies, and launch the frontend:

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Execute Tests

Tests created using Jest and Supertest Make sure you are in the root directory of the repository (i.e., `team-charles-app`) and run the tests with:
```bash
cd ..
npm run test
npm run lint
npx eslint . --fix
```

This command will start the test runner in watch mode and execute all test files.
