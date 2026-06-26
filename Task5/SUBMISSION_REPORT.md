# Internship Final Submission Report

**Project Title**: Student Placement Tracker  
**Student Name**: Sreepathi Praveena
**Internship Domain**: Front-end Web Development  
**Submission Date**: June 26, 2026  

---

## 1. Project Overview & Problem Statement
During college placement seasons, training and placement officers handle massive amounts of student data. Traditional spreadsheet solutions are slow, lack real-time visual insights, do not offer multi-device responsiveness, and are prone to data corruption or duplicate entry errors.

The **Student Placement Tracker** was developed to solve this problem. It is a modern, responsive web application that allows placement officers to manage student academic details, skills, target companies, and recruitment pipeline status. The tool calculates visual analytics and manages persistent storage directly in the user's browser.

---

## 2. Project Objectives
- **Data Visualizations**: Implement dynamic dashboards using charts to represent branch performance and status pipelines.
- **CRUD Operations**: Support full client-side record creation, read profiles, edit records, and delete records.
- **Search & Multi-criteria Filters**: Facilitate rapid candidate sourcing through name queries combined with branch, company, and status filters.
- **Robust Client-side Persistence**: Store files reliably using the LocalStorage API.
- **Theme Adaptation & Responsiveness**: Provide an adaptive design suitable for mobile, tablet, and desktop screens with full support for Light/Dark modes.

---

## 3. Technology Stack & Architecture
The project is built using a client-side architecture to minimize server overhead and load times.

- **Frontend Core**: HTML5 for semantic page layout.
- **Design System**: Custom CSS3 variables, CSS Grid, Flexbox, and transition properties.
- **Client Scripting**: Vanilla JavaScript (ES6+) for DOM manipulation, event routing, validation, and storage.
- **Charts Integration**: Chart.js loaded asynchronously via CDN.
- **Persistence Layer**: HTML5 Web Storage API (`localStorage`).

---

## 4. Implementation Details

### 4.1 Data Structure & Seed Engine
Each student record is stored as an object with the following schema:
```json
{
  "name": "Jane Doe",
  "rollNumber": "1MS21CS999",
  "branch": "CSE",
  "skills": ["React", "SQL"],
  "company": "Microsoft",
  "status": "Shortlisted"
}
```
If the application detects that `localStorage` is empty, it runs a seed loader to populate the initial database with 8 mock records representing different branches and recruitment states.

### 4.2 CRUD Engine & Validation
- **Modals**: Written directly in HTML/CSS with overlay displays controlled by toggling class values.
- **Validation**: On submission, the JavaScript loops through records to check if the roll number exists (preventing duplicates). If found, it blocks submission and renders a warning message.
- **Deletes**: A two-step deletion confirmation layout prevents accidental losses.

### 4.3 Data Visualizations
Two Chart.js instances are initialized:
1. **Doughnut Chart**: Groups records by recruitment status.
2. **Bar Chart**: Groups records by branch and counts those in the "Selected" state.
When records change, the script recalculates counts, binds new numbers to the dataset array, and invokes the `.update()` method to trigger smooth animations.

### 4.4 Theme Switcher
Custom CSS variable definitions (colors, borders, gradients) are swapped dynamically by applying a `data-theme` attribute (`light` or `dark`) to the root `<html>` element. Chart text and grid lines automatically repaint when a theme change event occurs.

---

## 5. Challenges Faced & Solutions

### Challenge 1: Chart Canvas Reuse Error
*Problem*: Redraws caused Chart.js to trigger errors stating "Canvas is already in use by Chart ID".  
*Solution*: Instead of re-instantiating charts on every update, chart instances were declared globally, initialized once, and updated by modifying dataset arrays and calling `.update()`.

### Challenge 2: Desktop Tables on Mobile Viewports
*Problem*: Wide data tables overflowed horizontally on mobile screens, breaking the page layout.  
*Solution*: Used media queries to set table columns (`thead`, `tbody`, `tr`, `td`) to `display: block`. Headers were hidden, and `td` items were aligned horizontally with labels dynamically fetched from `data-label` attributes.

---

## 6. Key Learnings & Conclusion
Developing this application helped solidify key frontend engineering skills:
1. **State Management**: Managing app state without modern reactive frameworks (React, Vue) improved understanding of browser rendering cycles.
2. **Dynamic Charting**: Gained experience integrating third-party APIs (Chart.js) and styling them with custom CSS variables.
3. **Data Security**: Sanitized form inputs using custom escaping functions to prevent Cross-Site Scripting (XSS) when rendering user records.

The Student Placement Tracker meets all functional objectives, proving that responsive, feature-rich web tools can be built efficiently using native web technologies.
