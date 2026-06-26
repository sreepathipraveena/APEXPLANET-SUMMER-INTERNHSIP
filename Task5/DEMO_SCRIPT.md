# 7-Minute Demo Video Script

**Project Title**: Student Placement Tracker  
**Target Duration**: 07:00 minutes  
**Presenter Role**: Front-end Developer  

---

## 🎬 Video Script Outline & Timeline

### 1. Introduction (0:00 - 1:00)
- **Visual**: Developer on screen or clean capture of the Placement Tracker dashboard in Dark Mode. Cursor hovers over metrics cards.
- **Action**: Smoothly scroll down to showcase the layout.
- **Narrator Audio**:
> "Hello everyone! Welcome to the walkthrough of the Student Placement Tracker. As a frontend developer, managing student data during placement seasons can get chaotic. That's why I created this single-page tracker web application. 
>
> It's built with semantic HTML5, CSS3 with custom variables, and vanilla JavaScript. There are zero heavy framework dependencies. On first launch, the app populates data automatically from a local JSON seed file. This dashboard gives recruiters and college placement coordinators real-time analytics on student recruitment pipelines. Let me show you how it works."

---

### 2. Layout, Analytics, & Charts (1:00 - 2:15)
- **Visual**: Focus on the 4 dashboard metrics cards, then pan to the charts.
- **Action**: Hover over the Donut chart sections to trigger Chart.js tooltip animations. Hover over the Bar Chart columns. Click the Light/Dark mode switch.
- **Narrator Audio**:
> "At the top of our interface, we see our key metrics cards: Total Students, Total Applications, Selected Students, and Rejected Students. Notice the gradient borders and hover animations that give a glassmorphic look.
>
> Below that, we have two dynamic visualization charts powered by Chart.js. The 'Placement Status' donut chart visualizes the distribution of candidates through different interview tracks: Applied, Shortlisted, Interviewing, Selected, and Rejected. Beside it, the 'Branch Performance' bar chart showcases selected student counts across different engineering branches.
> 
> Let's look at the theme switcher. With a single click on this toggle in the sidebar, the application transitions from Dark Mode to a clean, crisp Light Mode. Notice how the chart grid lines and labels automatically repaint for optimal legibility. Let's switch back to Dark Mode for the rest of the demo."

---

### 3. Adding a Student & Validation (2:15 - 3:30)
- **Visual**: Focus on the "Add Student" button, clicking it, and opening the slide-up/scale-up modal.
- **Action**: Fill the form fields. First, enter a duplicate roll number ("1MS21CS001") to trigger validation. Then replace it with a unique roll number and click save.
- **Narrator Audio**:
> "Let's test adding a new student to our database. Clicking the 'Add Student' button triggers an animated form modal. 
> 
> Let's try adding a student named Jane Doe. I will enter a roll number that already exists in the system: '1MS21CS001'. For branch, let's select Information Science, enter skills like 'SQL, Python', target company 'Microsoft', and interview status 'Shortlisted'. 
> 
> If I click 'Save Record', the custom JavaScript validation blocks submission and displays a red error warning stating 'Roll number must be unique.' This ensures primary-key integrity. Let's change the roll number to '1MS21IS999' and click save. The modal closes, the dashboard metrics update instantly, and our charts redraw in the background."

---

### 4. Viewing, Editing, and Deleting (3:30 - 4:45)
- **Visual**: Find the newly added student in the table. Click the view profile (eye) icon. Then click edit. Finally, click the delete (trash) icon on another student.
- **Action**: Open the View Profile Modal. Show details, then close it. Click edit, modify details, and save. Click delete to show the delete confirmation dialog, cancel once, then delete another.
- **Narrator Audio**:
> "Now let's find Jane Doe in our records. Click the view profile eye icon. This loads the read-only student details card showing her skills automatically split into individual tag badges.
>
> If we want to modify her profile, we can trigger the edit modal directly from this view or from the table action column. Let's change her status to 'Selected'. Upon saving, notice that the total selected count increments, and our bar chart updates to reflect the new selection under Information Science.
>
> Deleting is just as seamless. Clicking the delete trash icon launches a warning dialog detailing the student's name and roll number. Let's click cancel first to show it aborts safely. Now click delete again and confirm. The record is permanently removed, and all metrics sync instantly."

---

### 5. Multi-Filtering and Search (4:45 - 6:00)
- **Visual**: Filter inputs in the toolbar.
- **Action**: Type search query. Apply multiple filters simultaneously (e.g., CSE + Selected). Click "Reset Filters".
- **Narrator Audio**:
> "A core feature is our advanced search and filter system. You can search by typing. As I type 'Vikram' or 'CS001', the table filters in real-time.
>
> We can combine search criteria with filters. Let's filter for students in the 'CSE' branch. Now, let's refine this to only see students whose status is 'Selected'. The dropdown lists companies dynamically, too.
>
> If no records match, the app displays a custom empty state illustration. Clicking the 'Reset Filters' button immediately clears all query variables and restores our baseline datatable."

---

### 6. Code Walkthrough & Conclusion (6:00 - 7:00)
- **Visual**: Code Editor open with `script.js` and `style.css`. Focus briefly on the LocalStorage save/load functions and CSS custom properties.
- **Action**: Scroll through the key script sections. Turn back to the application dashboard.
- **Narrator Audio**:
> "Looking briefly behind the scenes: the codebase is clean and maintainable. In `script.js`, we use standard array methods to manage the state and mirror it to LocalStorage. We handle form validation, search query intersections, and chart updates dynamically on state mutation. In `style.css`, we leverage media queries to collapse columns and display table cells as inline card items on mobile, ensuring a 100% responsive layout.
>
> This app provides a lightweight, responsive, and visual alternative to heavy spreadsheet solutions. Thank you for watching my demo!"

---

## 💡 Tips for Recording
1. **Resolution**: Record at 1080p (1920x1080) for clear text.
2. **Audio**: Use a high-quality USB microphone to avoid background noise.
3. **Cursor**: Enable cursor highlight or halo to help viewers follow along.
4. **Transition**: Keep transitions fast to maintain a high-energy pace.
