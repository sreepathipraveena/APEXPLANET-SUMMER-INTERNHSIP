# Testing & Quality Assurance Report

**Project Name**: Student Placement Tracker 
**Author**: Sreepathi Praveena
**Status**: Completed  
**Date**: June 26, 2026  

---

## 1. Executive Summary
This document provides a comprehensive report of the testing phase conducted on the Student Placement Tracker Web Application. The application has been fully tested for functional correctness, data persistence integrity, responsive behavior, validation edge-cases, and visual theme adaptations. 

Testing was conducted manually across various viewport sizes and browser contexts to ensure an error-free, production-ready release.

---

## 2. Test Environment
- **Operating Systems**: Windows 11, macOS, Android (mobile), iOS (mobile)
- **Browsers**: Google Chrome (v120+), Mozilla Firefox (v121+), Safari (v17+), Microsoft Edge (v120+)
- **Resolution Ranges**:
  - Mobile: 360x800, 390x844 (Portrait)
  - Tablet: 768x1024, 820x1180 (Portrait/Landscape)
  - Desktop: 1440x900, 1920x1080

---

## 3. Detailed Test Cases & Execution Matrix

### Section 3.1: Data Seeding and Initialization
| Test ID | Feature Under Test | Preconditions | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | First-Load Mock Seeding | LocalStorage is empty. | 1. Open the application in a new browser incognito window.<br>2. Inspect LocalStorage. | 1. App detects empty storage.<br>2. 8 mock student records are successfully loaded.<br>3. Dashboard metrics display correct initial values.<br>4. Charts render with data. | Loaded 8 mock records; dashboard metrics populated; charts rendered. | **PASS** |

### Section 3.2: CRUD Operations
| Test ID | Feature Under Test | Preconditions | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-02** | Add Student (Success) | App loaded. | 1. Click "Add Student".<br>2. Fill Name ("Jane Doe"), Roll ("1MS21CS999"), Branch ("CSE"), Skills ("SQL, Java"), Company ("Microsoft"), Status ("Shortlisted").<br>3. Click "Save Record". | 1. Modal closes.<br>2. Student table updates with new entry.<br>3. Total Students increases by 1.<br>4. Charts refresh. | Student Jane Doe was added successfully; metrics and charts updated immediately. | **PASS** |
| **TC-03** | Add Student (Duplicate Roll Number) | App loaded, roll number "1MS21CS001" exists. | 1. Click "Add Student".<br>2. Input Name ("Duplicate Tester").<br>3. Input existing Roll Number ("1MS21CS001").<br>4. Attempt to save. | 1. Form submission blocks.<br>2. Red warning message "Roll number must be unique." becomes visible. | Validation blocked submission and showed the unique roll number error. | **PASS** |
| **TC-04** | Edit Student Details | App loaded, student in row 1 exists. | 1. Click the Edit (pencil) icon on Aarav Sharma's row.<br>2. Change company to "Google Labs" and Status to "Selected".<br>3. Click "Save Record". | 1. Modal closes.<br>2. Details update in table.<br>3. Chart values adjust.<br>4. Changes are saved in LocalStorage. | Row updated in real-time; LocalStorage verified updated data; charts updated. | **PASS** |
| **TC-05** | View Profile Card | App loaded. | 1. Click the name "Priya Patel" or eye icon on her row. | 1. Profile modal opens.<br>2. Displays all student details (including skills separated into visual badges).<br>3. No input fields are editable. | View Profile modal loaded read-only data and displayed skills as individual badges. | **PASS** |
| **TC-06** | Delete Student (Cancel) | App loaded. | 1. Click Delete (trash) icon on a row.<br>2. When confirmation prompt loads, click "Cancel" or backdrop. | 1. Confirmation modal closes.<br>2. No record is removed. | Modal closed safely; record remained in table. | **PASS** |
| **TC-07** | Delete Student (Confirm) | App loaded. | 1. Click Delete (trash) icon on Rohan Das's row.<br>2. Click "Delete Record" in the confirmation modal. | 1. Record is permanently removed.<br>2. Table redraws.<br>3. Metrics count decrements.<br>4. Charts update. | Rohan Das was deleted; Total Students decremented; charts adjusted. | **PASS** |

### Section 3.3: Filters and Search
| Test ID | Feature Under Test | Preconditions | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-08** | Real-Time Name Search | App loaded. | 1. Type "priya" in search bar. | 1. Table displays only Priya Patel.<br>2. Other rows hidden. | Table instantly filtered down to 1 matching row matching "priya". | **PASS** |
| **TC-09** | Concurrent Filter Combinations | App loaded. | 1. Select Branch "CSE".<br>2. Select Status "Selected". | 1. Table filters to CSE students who have a "Selected" status. | Concurrently applied criteria. CSE and Selected rows shown. | **PASS** |
| **TC-10** | Reset Filters | Active filters are applied (TC-09). | 1. Click "Reset Filters" button above table. | 1. Search bar clears.<br>2. Branch, Company, and Status drop-downs revert to "All".<br>3. All table records return. | Filters cleared; full table list rendered immediately. | **PASS** |

### Section 3.4: Responsiveness and Theme
| Test ID | Feature Under Test | Preconditions | Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-11** | Mobile Viewport Adaptability | Viewport set to 375px (iPhone SE). | 1. Observe dashboard layout.<br>2. Observe table structure. | 1. Cards stack vertically.<br>2. Table headings hide; rows render as distinct cards containing labeled values. | Table elements converted to card-style blocks; layouts reflowed without horizontal scrolls. | **PASS** |
| **TC-12** | Theme Toggle & Chart Styling | App loaded. | 1. Toggle Dark Mode switch in the sidebar. | 1. App background transitions to light theme.<br>2. Gridlines on Branch chart adjust to light grey.<br>3. Tick marks & labels switch to readable dark grey. | Theme toggled cleanly; Chart.js font and grid lines automatically repainted based on active mode. | **PASS** |

---

## 4. Conclusion
All **12 Core Test Cases** passed successfully. The client-side database management via LocalStorage is highly stable and does not leak references. Input validation prevents duplicate primary keys (Roll Numbers). The responsive breakdown functions cleanly on mobile screen widths without overflowing contents. The application is declared **Stable and Production-Ready**.
