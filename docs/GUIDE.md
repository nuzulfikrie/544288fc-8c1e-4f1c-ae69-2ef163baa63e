# Assessment Reporting System

A TypeScript-based CLI application for generating student assessment reports.

## Prerequisites

- Node.js v22 (using nvm)
- npm

## Setup

1. Install dependencies:

```bash
nvm use 22
npm install
```

2. Build the project:

```bash
npm run build
```

## Running the Application

To run the application:

```bash
npm start
```

The application will prompt you for:

1. Student ID
2. Report type (1 for Diagnostic, 2 for Progress, 3 for Feedback)

## Running Tests

To run the tests:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Project Structure

- `src/` - Source code
  - `types/` - TypeScript type definitions
  - `services/` - Business logic and data services
  - `tests/` - Test files
- `data/` - JSON data files
  - `students.json` - Student information
  - `assessments.json` - Assessment definitions
  - `questions.json` - Question definitions
  - `student-responses.json` - Student assessment responses

## Report Types

1. **Diagnostic Report**: Shows student's performance by strand
2. **Progress Report**: Shows improvement over time
3. **Feedback Report**: Provides detailed feedback on incorrect answers
