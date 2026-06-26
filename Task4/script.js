/**
 * Student Placement Tracker - Core Logic
 */

// ==========================================================================
// MOCK DATA GENERATION
// ==========================================================================
const mockStudentsList = [
  {
    name: "Aarav Sharma",
    rollNumber: "1MS21CS001",
    branch: "CSE",
    skills: ["React", "Node.js", "Python", "MongoDB"],
    company: "Google",
    status: "Selected"
  },
  {
    name: "Priya Patel",
    rollNumber: "1MS21IS042",
    branch: "ISE",
    skills: ["Java", "Spring Boot", "MySQL", "Docker"],
    company: "Amazon",
    status: "Interviewing"
  },
  {
    name: "Rohan Das",
    rollNumber: "1MS21EC085",
    branch: "ECE",
    skills: ["C++", "Embedded Systems", "RTOS", "Verilog"],
    company: "Qualcomm",
    status: "Selected"
  },
  {
    name: "Ananya Sen",
    rollNumber: "1MS21ME120",
    branch: "ME",
    skills: ["AutoCAD", "SolidWorks", "MATLAB", "Python"],
    company: "Tesla",
    status: "Applied"
  },
  {
    name: "Vikram Malhotra",
    rollNumber: "1MS21CS199",
    branch: "CSE",
    skills: ["Python", "TensorFlow", "PyTorch", "Kubernetes"],
    company: "Meta",
    status: "Rejected"
  },
  {
    name: "Sana Khan",
    rollNumber: "1MS21EE050",
    branch: "EE",
    skills: ["Simulink", "Power Electronics", "MATLAB", "PLC"],
    company: "Siemens",
    status: "Shortlisted"
  },
  {
    name: "Kabir Singh",
    rollNumber: "1MS21CE015",
    branch: "CE",
    skills: ["Revit", "Project Management", "Excel", "ETABS"],
    company: "L&T",
    status: "Interviewing"
  },
  {
    name: "Meera Nair",
    rollNumber: "1MS21IS012",
    branch: "ISE",
    skills: ["HTML", "CSS", "JavaScript", "Figma"],
    company: "Netflix",
    status: "Selected"
  }
];

// ==========================================================================
// APP STATE & CONSTANTS
// ==========================================================================
let students = [];
let statusChart = null;
let branchChart = null;
let deleteStudentIndex = null; // store index of student to be deleted

// Color maps matching CSS Theme variables
const statusColorMap = {
  'Applied': { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)' },
  'Shortlisted': { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)' },
  'Interviewing': { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)' },
  'Selected': { border: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' },
  'Rejected': { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)' }
};

// ==========================================================================
// DOM SELECTORS
// ==========================================================================
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const currentDateStr = document.getElementById('current-date-str');

// Stats Counters
const metricTotalStudents = document.getElementById('metric-total-students');
const metricTotalApplications = document.getElementById('metric-total-applications');
const metricSelectedStudents = document.getElementById('metric-selected-students');
const metricRejectedStudents = document.getElementById('metric-rejected-students');

// Filter & Toolbar Controls
const searchInput = document.getElementById('search-input');
const filterBranch = document.getElementById('filter-branch');
const filterCompany = document.getElementById('filter-company');
const filterStatus = document.getElementById('filter-status');
const btnClearFilters = document.getElementById('btn-clear-filters');
const btnEmptyReset = document.getElementById('btn-empty-reset');

// Student Table & Empty State
const studentsTableBody = document.getElementById('students-table-body');
const emptyState = document.getElementById('empty-state');

// Modal Elements
const studentModal = document.getElementById('student-modal');
const modalTitle = document.getElementById('modal-title');
const studentForm = document.getElementById('student-form');
const studentEditId = document.getElementById('student-edit-id');
const studentNameInput = document.getElementById('student-name');
const studentRollInput = document.getElementById('student-roll');
const studentBranchInput = document.getElementById('student-branch');
const studentSkillsInput = document.getElementById('student-skills');
const studentCompanyInput = document.getElementById('student-company');
const studentStatusInput = document.getElementById('student-status');
const rollError = document.getElementById('roll-error');

const btnAddStudentTrigger = document.getElementById('btn-add-student-trigger');
const btnCloseStudentModal = document.getElementById('btn-close-student-modal');
const btnCancelStudentModal = document.getElementById('btn-cancel-student-modal');

// View Modal
const viewStudentModal = document.getElementById('view-student-modal');
const viewStudentDetailContent = document.getElementById('view-student-detail-content');
const btnCloseViewModal = document.getElementById('btn-close-view-modal');
const btnCloseViewFooter = document.getElementById('btn-close-view-footer');
const btnEditFromView = document.getElementById('btn-edit-from-view');

// Delete Modal
const deleteConfirmModal = document.getElementById('delete-confirm-modal');
const deleteStudentNameLabel = document.getElementById('delete-student-name');
const deleteStudentRollLabel = document.getElementById('delete-student-roll');
const btnCloseDeleteModal = document.getElementById('btn-close-delete-modal');
const btnCancelDelete = document.getElementById('btn-cancel-delete');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Load Theme
  initTheme();
  
  // Set Current Date in Header
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDateStr.textContent = `Placement Pipeline for ${new Date().toLocaleDateString('en-US', options)}`;
  
  // Load data from LocalStorage or fallback to mock list
  const storedData = localStorage.getItem('students');
  if (storedData) {
    students = JSON.parse(storedData);
  } else {
    students = [...mockStudentsList];
    saveToLocalStorage();
  }

  // Populate dynamic filters (companies list)
  updateCompanyFilterDropdown();

  // Draw Charts
  initCharts();
  
  // Render App Dashboard
  updateDashboard();
  
  // Attach Event Listeners
  setupEventListeners();
});

// ==========================================================================
// THEME MANAGEMENT
// ==========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Update chart fonts and grid color based on theme
  updateChartsTheme(newTheme);
}

// ==========================================================================
// STORAGE UTILITIES
// ==========================================================================
function saveToLocalStorage() {
  localStorage.setItem('students', JSON.stringify(students));
}

// ==========================================================================
// DASHBOARD & RENDER PIPELINE
// ==========================================================================
function updateDashboard() {
  // 1. Calculate Metrics
  const total = students.length;
  // Unique students count based on roll number
  const uniqueRolls = new Set(students.map(s => s.rollNumber.trim().toUpperCase()));
  const totalUniqueStudents = uniqueRolls.size;
  
  // Applications = count where company is applied
  const totalApps = students.filter(s => s.company && s.company.trim() !== "").length;
  
  const selectedCount = students.filter(s => s.status === 'Selected').length;
  const rejectedCount = students.filter(s => s.status === 'Rejected').length;
  
  // Update DOM metrics
  metricTotalStudents.textContent = totalUniqueStudents;
  metricTotalApplications.textContent = totalApps;
  metricSelectedStudents.textContent = selectedCount;
  metricRejectedStudents.textContent = rejectedCount;

  // 2. Render student records table (with active search and filters)
  renderStudentTable();
  
  // 3. Update Chart datasets
  updateChartsData();
}

function updateCompanyFilterDropdown() {
  // Get unique, non-empty, sorted companies
  const uniqueCompanies = [...new Set(students
    .map(s => s.company ? s.company.trim() : "")
    .filter(c => c !== "")
  )].sort();

  // Clear options but preserve "All Companies"
  filterCompany.innerHTML = '<option value="all">All Companies</option>';
  
  uniqueCompanies.forEach(company => {
    const opt = document.createElement('option');
    opt.value = company;
    opt.textContent = company;
    filterCompany.appendChild(opt);
  });
}

function renderStudentTable() {
  const searchQuery = searchInput.value.toLowerCase().trim();
  const selectedBranch = filterBranch.value;
  const selectedCompany = filterCompany.value;
  const selectedStatus = filterStatus.value;
  
  // Clear Table
  studentsTableBody.innerHTML = '';
  
  // Filter Records
  const filteredStudents = students.filter((student, index) => {
    // Add real index to match back to full array
    student.originalIndex = index;
    
    // Search filter (Match name or roll number)
    const matchesSearch = student.name.toLowerCase().includes(searchQuery) || 
                          student.rollNumber.toLowerCase().includes(searchQuery);
                          
    // Branch filter
    const matchesBranch = selectedBranch === 'all' || student.branch === selectedBranch;
    
    // Company filter
    const matchesCompany = selectedCompany === 'all' || student.company === selectedCompany;
    
    // Status filter
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    
    return matchesSearch && matchesBranch && matchesCompany && matchesStatus;
  });
  
  // Empty State Toggle
  if (filteredStudents.length === 0) {
    emptyState.classList.remove('hidden');
    document.querySelector('.students-table').classList.add('hidden');
  } else {
    emptyState.classList.add('hidden');
    document.querySelector('.students-table').classList.remove('hidden');
    
    // Build rows
    filteredStudents.forEach(student => {
      const tr = document.createElement('tr');
      
      // Student details cell
      const infoCell = document.createElement('td');
      infoCell.setAttribute('data-label', 'Student Info');
      infoCell.innerHTML = `
        <div class="student-info-cell">
          <span class="student-name-bold" onclick="viewStudentDetails(${student.originalIndex})">${escapeHTML(student.name)}</span>
          <span class="student-subtext">Roll Number: ${escapeHTML(student.rollNumber)}</span>
        </div>
      `;
      
      // Branch Cell
      const branchCell = document.createElement('td');
      branchCell.setAttribute('data-label', 'Branch');
      branchCell.innerHTML = `
        <div class="student-info-cell">
          <strong>${escapeHTML(student.branch)}</strong>
          <span class="student-subtext">B.E. Candidate</span>
        </div>
      `;
      
      // Skills cell
      const skillsCell = document.createElement('td');
      skillsCell.setAttribute('data-label', 'Skills');
      const skillsWrapper = document.createElement('div');
      skillsWrapper.className = 'skills-container';
      student.skills.forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.textContent = skill.trim();
        skillsWrapper.appendChild(skillTag);
      });
      skillsCell.appendChild(skillsWrapper);
      
      // Company cell
      const companyCell = document.createElement('td');
      companyCell.setAttribute('data-label', 'Company Applied');
      companyCell.innerHTML = `<strong>${escapeHTML(student.company || 'Not Applied')}</strong>`;
      
      // Status cell
      const statusCell = document.createElement('td');
      statusCell.setAttribute('data-label', 'Status');
      const statusClass = `status-${student.status.toLowerCase()}`;
      statusCell.innerHTML = `<span class="status-badge ${statusClass}">${escapeHTML(student.status)}</span>`;
      
      // Actions cell
      const actionsCell = document.createElement('td');
      actionsCell.className = 'actions-col';
      actionsCell.setAttribute('data-label', 'Actions');
      actionsCell.innerHTML = `
        <div class="table-actions">
          <button class="action-btn btn-view" title="View Profile" onclick="viewStudentDetails(${student.originalIndex})">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
          <button class="action-btn btn-edit" title="Edit Student" onclick="openEditStudentModal(${student.originalIndex})">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="action-btn btn-delete" title="Delete Record" onclick="triggerDeleteConfirmation(${student.originalIndex})">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      `;
      
      tr.appendChild(infoCell);
      tr.appendChild(branchCell);
      tr.appendChild(skillsCell);
      tr.appendChild(companyCell);
      tr.appendChild(statusCell);
      tr.appendChild(actionsCell);
      studentsTableBody.appendChild(tr);
    });
  }
}

// ==========================================================================
// CHARTS AND ANALYTICS
// ==========================================================================
function getChartThemeColors(theme) {
  const isDark = theme === 'dark';
  return {
    text: isDark ? '#94a3b8' : '#475569',
    grid: isDark ? '#1e293b' : '#cbd5e1',
    statusColors: {
      Applied: '#3b82f6',
      Shortlisted: '#8b5cf6',
      Interviewing: '#f59e0b',
      Selected: '#10b981',
      Rejected: '#ef4444'
    }
  };
}

function initCharts() {
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const colors = getChartThemeColors(theme);
  
  // Common Font Settings
  const chartFont = {
    family: "'Inter', sans-serif",
    size: 11,
    weight: '500'
  };

  // 1. Status Donut / Pie Chart
  const statusCtx = document.getElementById('statusChart').getContext('2d');
  statusChart = new Chart(statusCtx, {
    type: 'doughnut',
    data: {
      labels: ['Applied', 'Shortlisted', 'Interviewing', 'Selected', 'Rejected'],
      datasets: [{
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          colors.statusColors.Applied,
          colors.statusColors.Shortlisted,
          colors.statusColors.Interviewing,
          colors.statusColors.Selected,
          colors.statusColors.Rejected
        ],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: colors.text,
            font: chartFont,
            padding: 16,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          padding: 10,
          bodyFont: chartFont,
          titleFont: { ...chartFont, weight: '700' }
        }
      },
      cutout: '65%'
    }
  });

  // 2. Branch Bar Chart (Selected Students by Branch)
  const branchCtx = document.getElementById('branchChart').getContext('2d');
  branchChart = new Chart(branchCtx, {
    type: 'bar',
    data: {
      labels: ['CSE', 'ISE', 'ECE', 'EE', 'ME', 'CE'],
      datasets: [{
        label: 'Selected Students',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(95, 90, 246, 0.85)',
        hoverBackgroundColor: 'rgba(95, 90, 246, 1)',
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // Hide label header
        },
        tooltip: {
          padding: 10,
          bodyFont: chartFont
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: colors.text,
            font: chartFont
          }
        },
        y: {
          grid: {
            color: colors.grid,
            drawTicks: false
          },
          ticks: {
            color: colors.text,
            font: chartFont,
            stepSize: 1,
            precision: 0
          },
          border: {
            dash: [4, 4]
          }
        }
      }
    }
  });
}

function updateChartsData() {
  if (!statusChart || !branchChart) return;

  // 1. Calculate Status Pie Counts
  const statusCounts = {
    'Applied': 0,
    'Shortlisted': 0,
    'Interviewing': 0,
    'Selected': 0,
    'Rejected': 0
  };
  
  students.forEach(student => {
    if (statusCounts.hasOwnProperty(student.status)) {
      statusCounts[student.status]++;
    }
  });

  statusChart.data.datasets[0].data = [
    statusCounts['Applied'],
    statusCounts['Shortlisted'],
    statusCounts['Interviewing'],
    statusCounts['Selected'],
    statusCounts['Rejected']
  ];
  statusChart.update();

  // 2. Calculate Branch Bar Counts (Selected Students per Branch)
  const branches = ['CSE', 'ISE', 'ECE', 'EE', 'ME', 'CE'];
  const branchCounts = {};
  branches.forEach(b => branchCounts[b] = 0);

  students.forEach(student => {
    if (student.status === 'Selected' && branchCounts.hasOwnProperty(student.branch)) {
      branchCounts[student.branch]++;
    }
  });

  branchChart.data.datasets[0].data = branches.map(b => branchCounts[b]);
  branchChart.update();
}

function updateChartsTheme(theme) {
  if (!statusChart || !branchChart) return;
  
  const colors = getChartThemeColors(theme);
  
  // Update Status chart colors
  statusChart.options.plugins.legend.labels.color = colors.text;
  statusChart.update();

  // Update Branch chart colors
  branchChart.options.scales.x.ticks.color = colors.text;
  branchChart.options.scales.y.ticks.color = colors.text;
  branchChart.options.scales.y.grid.color = colors.grid;
  branchChart.update();
}

// ==========================================================================
// CRUD OPERATIONS
// ==========================================================================

// --- ADD STUDENT MODAL TRIGGER ---
function openAddStudentModal() {
  // Clear any validation errors
  rollError.classList.remove('visible');
  studentRollInput.removeAttribute('disabled');
  
  // Clear form
  studentForm.reset();
  studentEditId.value = ''; // empty means Add Mode
  
  modalTitle.textContent = "Add New Student";
  studentModal.classList.remove('hidden');
  
  // Auto focus first element
  setTimeout(() => studentNameInput.focus(), 100);
}

// --- EDIT STUDENT MODAL TRIGGER ---
function openEditStudentModal(originalIndex) {
  const student = students[originalIndex];
  if (!student) return;

  // Clear errors
  rollError.classList.remove('visible');
  
  // Set forms mode
  studentEditId.value = originalIndex;
  modalTitle.textContent = "Edit Student Profile";
  
  // Fill details
  studentNameInput.value = student.name;
  studentRollInput.value = student.rollNumber;
  studentBranchInput.value = student.branch;
  studentSkillsInput.value = student.skills.join(', ');
  studentCompanyInput.value = student.company;
  studentStatusInput.value = student.status;
  
  // Open modal
  studentModal.classList.remove('hidden');
  
  // Auto focus name
  setTimeout(() => studentNameInput.focus(), 100);
}

// --- SAVE RECORD (ADD OR EDIT) ---
function handleSaveStudent(event) {
  event.preventDefault();
  
  const name = studentNameInput.value.trim();
  const rollNumber = studentRollInput.value.trim().toUpperCase();
  const branch = studentBranchInput.value;
  const skills = studentSkillsInput.value.split(',').map(s => s.trim()).filter(s => s !== "");
  const company = studentCompanyInput.value.trim();
  const status = studentStatusInput.value;
  const editIndex = studentEditId.value;
  
  // Validation: Check roll number uniqueness
  const isEditMode = editIndex !== '';
  const rollConflict = students.some((s, idx) => {
    if (isEditMode && idx === parseInt(editIndex)) return false; // ignore self
    return s.rollNumber.trim().toUpperCase() === rollNumber;
  });

  if (rollConflict) {
    rollError.classList.add('visible');
    studentRollInput.focus();
    return;
  } else {
    rollError.classList.remove('visible');
  }

  const record = { name, rollNumber, branch, skills, company, status };

  if (isEditMode) {
    // Edit existing student record
    students[parseInt(editIndex)] = record;
  } else {
    // Add new student record
    students.push(record);
  }

  // Save changes
  saveToLocalStorage();
  updateCompanyFilterDropdown();
  updateDashboard();
  
  // Close Modal
  closeStudentModal();
}

// --- VIEW PROFILE DETAILS ---
function viewStudentDetails(originalIndex) {
  const student = students[originalIndex];
  if (!student) return;

  const statusClass = `status-${student.status.toLowerCase()}`;
  const skillsHTML = student.skills.map(s => `<span class="skill-tag">${escapeHTML(s)}</span>`).join('');
  
  viewStudentDetailContent.innerHTML = `
    <div class="profile-summary-card">
      <div class="profile-avatar-circle">
        ${escapeHTML(student.name.charAt(0))}
      </div>
      <div class="profile-meta">
        <h4>${escapeHTML(student.name)}</h4>
        <p>${escapeHTML(student.branch)} Department &bull; B.E. Degree</p>
      </div>
    </div>
    
    <div class="profile-details-grid">
      <div class="profile-info-item">
        <span class="info-label">Roll Number</span>
        <span class="info-value">${escapeHTML(student.rollNumber)}</span>
      </div>
      
      <div class="profile-info-item">
        <span class="info-label">Current Placement Status</span>
        <span class="info-value">
          <span class="status-badge ${statusClass}">${escapeHTML(student.status)}</span>
        </span>
      </div>
      
      <div class="profile-info-item">
        <span class="info-label">Target Company</span>
        <span class="info-value"><strong>${escapeHTML(student.company || 'Not Applied')}</strong></span>
      </div>
      
      <div class="profile-info-item">
        <span class="info-label">Applied Track</span>
        <span class="info-value">Campus Placement Drive 2026</span>
      </div>
      
      <div class="profile-info-item full-width">
        <span class="info-label">Domain Skills</span>
        <div class="skills-container" style="max-width: 100%; margin-top: 6px;">
          ${skillsHTML}
        </div>
      </div>
    </div>
  `;
  
  // Attach the edit link directly to the edit button in footer
  btnEditFromView.onclick = () => {
    closeViewModal();
    openEditStudentModal(originalIndex);
  };
  
  viewStudentModal.classList.remove('hidden');
}

// --- DELETE PROFILE DELEGATION ---
function triggerDeleteConfirmation(originalIndex) {
  const student = students[originalIndex];
  if (!student) return;
  
  deleteStudentIndex = originalIndex;
  
  deleteStudentNameLabel.textContent = student.name;
  deleteStudentRollLabel.textContent = student.rollNumber;
  
  deleteConfirmModal.classList.remove('hidden');
}

function handleConfirmDelete() {
  if (deleteStudentIndex === null) return;
  
  // Remove student
  students.splice(deleteStudentIndex, 1);
  
  // Save changes
  saveToLocalStorage();
  updateCompanyFilterDropdown();
  updateDashboard();
  
  // Close confirmation modal
  closeDeleteModal();
}

// --- CLOSE MODALS ---
function closeStudentModal() {
  studentModal.classList.add('hidden');
}

function closeViewModal() {
  viewStudentModal.classList.add('hidden');
}

function closeDeleteModal() {
  deleteConfirmModal.classList.add('hidden');
  deleteStudentIndex = null;
}

// ==========================================================================
// FILTERS RESET
// ==========================================================================
function resetFilters() {
  searchInput.value = '';
  filterBranch.value = 'all';
  filterCompany.value = 'all';
  filterStatus.value = 'all';
  renderStudentTable();
}

// ==========================================================================
// EVENT LISTENERS BINDING
// ==========================================================================
function setupEventListeners() {
  // Theme Toggle
  themeToggleBtn.addEventListener('click', toggleTheme);
  
  // Filter Inputs (Real-time updates)
  searchInput.addEventListener('input', renderStudentTable);
  filterBranch.addEventListener('change', renderStudentTable);
  filterCompany.addEventListener('change', renderStudentTable);
  filterStatus.addEventListener('change', renderStudentTable);
  
  // Clear Filters
  btnClearFilters.addEventListener('click', resetFilters);
  btnEmptyReset.addEventListener('click', resetFilters);
  
  // Add Student Modal triggers
  btnAddStudentTrigger.addEventListener('click', openAddStudentModal);
  btnCloseStudentModal.addEventListener('click', closeStudentModal);
  btnCancelStudentModal.addEventListener('click', closeStudentModal);
  
  // Save form
  studentForm.addEventListener('submit', handleSaveStudent);
  
  // View Student Modal triggers
  btnCloseViewModal.addEventListener('click', closeViewModal);
  btnCloseViewFooter.addEventListener('click', closeViewModal);
  
  // Delete Modal triggers
  btnCloseDeleteModal.addEventListener('click', closeDeleteModal);
  btnCancelDelete.addEventListener('click', closeDeleteModal);
  btnConfirmDelete.addEventListener('click', handleConfirmDelete);
  
  // Modal Overlay Backdrops Close Event
  [studentModal, viewStudentModal, deleteConfirmModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        if (modal === deleteConfirmModal) deleteStudentIndex = null;
      }
    });
  });
}

// ==========================================================================
// HTML ESCAPE HELPER
// ==========================================================================
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
