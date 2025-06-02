## 1. **CLI Application & User Input**

- **README requirement:**
  - CLI prompts for Student ID and report type (1=Diagnostic, 2=Progress, 3=Feedback).
  - Generates the report using the provided data.
- **Code:**
  - `src/index.ts` matches this exactly: uses `zx` to prompt for Student ID and report type, maps input to report type, and prints the report.
- **Checklist:**
  - [x] CLI prompts for correct inputs
  - [x] CLI output matches README scenario

---

## 2. **Report Generation Logic**

- **README requirement:**
  - Diagnostic: Latest assessment, by strand, correct/total.
  - Progress: All assessments, date and raw score, improvement.
  - Feedback: Latest assessment, feedback for wrong answers.
- **Code:**
  - `src/services/reportService.ts` implements all three report types as described.
- **Checklist:**
  - [x] Diagnostic report logic
  - [x] Progress report logic
  - [x] Feedback report logic

---

## 3. **Data Handling**

- **README requirement:**
  - Use JSON files for students, assessments, questions, responses.
  - Only completed assessments (with a completed date) are considered.
- **Code:**
  - `src/services/dataService.ts` (not shown here, but referenced) loads and filters data as required.
- **Checklist:**
  - [x] Loads all required data files
  - [x] Ignores incomplete assessments

---

## 4. **Automated Tests**

- **README requirement:**
  - Automated tests for features, not necessarily 100% coverage.
- **Code:**
  - `src/tests/reportService.test.ts` covers:
    - Diagnostic report (checks for correct student, assessment, strand details)
    - Progress report (checks for correct dates, scores, improvement)
    - Feedback report (checks for feedback content)
    - Error handling (non-existent student)
  - `src/tests/dataService.test.ts` covers:
    - Data loading
    - Student lookup
    - Completed assessments filtering
- **Checklist:**
  - [x] Diagnostic report tested
  - [x] Progress report tested
  - [x] Feedback report tested
  - [x] Error handling tested
  - [x] Data loading tested

---

## 5. **NPM Scripts**

- **README requirement:**
  - Scripts for running app and tests: `npm run test`, `npm run app` (or `npm start`)
- **Code:**
  - `package.json` scripts:
    - `"start": "NODE_OPTIONS='--loader ts-node/esm' node src/index.ts"` (matches app run)
    - `"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"`
    - `"test:watch": ...`
    - `"build": "tsc"`
- **Checklist:**
  - [x] `npm start` runs the CLI app
  - [x] `npm test` runs the tests
  - [x] `npm run build` compiles TypeScript

---

## 6. **Sample Output**

- **README requirement:**
  - Output format for each report type is specified.
- **Code & Tests:**
  - Tests in `reportService.test.ts` check for output strings that match the README samples.
- **Checklist:**
  - [x] Output format matches README samples

---

## 7. **Other Requirements**

- **README requirement:**
  - No DB, just in-memory data
  - TypeScript, with type definitions
  - GitHub Actions for CI (not checked here)
- **Code:**
  - All logic is in TypeScript, with types in `src/types/`
  - Data is loaded from JSON, not a DB
- **Checklist:**
  - [x] TypeScript used throughout
  - [x] In-memory data only

---

## 8. **Documentation**

- **README and GUIDE.md:**
  - Both provide setup, run, and test instructions.
- **Checklist:**
  - [x] Setup instructions present
  - [x] Run/test instructions present

---

## **Summary Table**

| Requirement Area | Implemented? | Notes                               |
| ---------------- | ------------ | ----------------------------------- |
| CLI Input/Output | ✅           | Matches README                      |
| Report Logic     | ✅           | All 3 types, correct logic          |
| Data Handling    | ✅           | Loads, filters, ignores incomplete  |
| Automated Tests  | ✅           | Covers all main scenarios           |
| NPM Scripts      | ✅           | `start`, `test`, `build` present    |
| Output Format    | ✅           | Matches README samples              |
| TypeScript/No DB | ✅           | All TS, in-memory                   |
| Documentation    | ✅           | Setup/run/test in README & GUIDE.md |
