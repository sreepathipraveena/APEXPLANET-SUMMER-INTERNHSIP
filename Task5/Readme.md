# Student Placement Tracker

A modern, responsive, client-side web application designed to streamline the management and visualization of student campus placement records. Built entirely with vanilla HTML5, CSS3 (featuring responsive grids and CSS variables for smooth light/dark theme switching), and ES6+ JavaScript.

🚀 **Live Demo**: 
https://dapper-figolla-e8376e.netlify.app/
---

## 📋 Features

### 1. Interactive Analytics Dashboard
- **Live Metrics**: Displays key performance indicators: Total Students, Total Applications, Selected Students, and Rejected Students.
- **Data Visualizations**: 
  - **Placement Status Distribution**: Interactive Donut/Pie chart displaying pipeline breakdowns (Applied, Shortlisted, Interviewing, Selected, Rejected).
  - **Branch Performance**: Bar chart comparing the count of selected students across branches (CSE, ISE, ECE, EE, ME, CE).

### 2. Comprehensive CRUD Operations
- **Add Student**: Modally add student records (Name, unique Roll Number, Branch, Skills, Target Company, Status).
- **Edit Student**: Edit details of any student; changes update state, LocalStorage, metrics, and charts instantly.
- **Delete Student**: Safely delete records with an overlay confirmation dialog.
- **View Profile**: Clean, formatted student profile view containing skills tag badges and application details.

### 3. Advanced Filtering & Search
- **Live Search**: Query by student name or roll number simultaneously.
- **Drop-down Filters**: Query data concurrently by Branch, Company, or Interview Status.
- **Filter Reset**: One-click reset option to revert to default list views.

### 4. Data Persistence & Performance
- **Local Storage**: Automatically syncs records on every CRUD operation.
- **Mock Seed Data**: Automatically populates realistic student records on first load if the local storage is empty.

### 5. Responsive, Multi-Theme UI
- **Responsive Layout**: Adjusts seamlessly across desktop, tablet, and mobile layouts. On mobile, table rows transform into card-style layouts.
- **Sleek Light/Dark Mode**: Built using modern CSS variables with smooth transitions. Chart.js font and grid colors adjust dynamically depending on the active theme.

---

## 🛠️ Technology Stack

- **Structure**: Semantic HTML5
- **Styling**: Modern CSS3 (CSS Variables, Flexbox, CSS Grid, Media Queries)
- **Scripting**: ES6+ JavaScript (Vanilla JS, DOM Manipulation, LocalStorage API)
- **Charts Library**: Chart.js (via CDN)
- **Icons**: Inline SVG Icons (lightweight, resolution-independent, styleable via CSS)

---

## 📁 Folder Structure

```text
apexplanet4/
├── index.html       # Application markup, layout structure & modal definitions
├── style.css        # Theme variables, design system tokens & media queries
├── script.js        # App state, LocalStorage sync, search/filter, and charts
├── server.js        # Lightweight Node.js local dev server script (optional)
└── README.md        # Project documentation
```

---

## ⚡ Getting Started

### Prerequisites
To run the project locally, you only need a modern web browser. If you want to use the included Node.js server, make sure you have Node.js installed.

### Option A: Local Dev Server (Recommended)
1. Clone this repository or download the files.
2. Open your terminal in the project directory.
3. Run the static server:
   ```bash
   node server.js
   ```
4. Open your browser and navigate to `http://localhost:8081`.

### Option B: Direct Browser Execution
Since the application runs entirely on the client side, you can simply double-click the `index.html` file or drag it into any modern web browser to run the app instantly.

---

## 🤝 Contributing
Contributions are welcome! Please fork this repository, make your changes in a feature branch, and submit a pull request.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
