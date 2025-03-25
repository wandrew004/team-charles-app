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
npm install
npm run build
```

### 3. Install Dependencies and Launch the Frontend

After completing the backend setup, navigate to the frontend folder, install dependencies, and launch the frontend:

```bash
cd ../frontend
npm install
npm run build
```

### 4. Execute Tests

Make sure you are in the root directory of the repository (i.e., `team-charles-app`) and run the tests with:

```bash
cd ..
npm test
```

This command will start the test runner in watch mode and execute all test files.
