/**
 * AeroFit - Fitness & Health Tracker Dashboard Script
 * 
 * This file contains the complete application logic.
 * It demonstrates JavaScript fundamentals (Variables, Arrays, Objects, Functions,
 * Conditional Logic, Loops, Event Handlers, Array Helper Methods, DOM Manipulation, 
 * LocalStorage APIs, and ES6+ features).
 */

/* ==========================================================================
   JAVASCRIPT CONCEPTS REFERENCE FOR BEGINNERS (Mentorship Notes)
   ==========================================================================
   1. Const & Let: Variables defined with 'const' cannot be reassigned; 'let' variables can.
   2. DOM Selection: 'document.getElementById' and 'document.querySelector' allow fetching HTML elements.
   3. Event Listeners: 'addEventListener' listens for actions (clicks, keypresses, forms) and triggers callbacks.
   4. LocalStorage: Browser database storing key-value string pairs persistently across reloads.
   5. Arrow Functions: Clean modern syntax for writing callbacks (e.g. () => {}).
   6. Classes & Objects: Structuring complex data models (e.g. State management).
   7. Template Literals: String formatting using backticks (``) that allows embedding variables with ${}.
   8. Array Helpers: Methods like .filter(), .forEach(), .includes(), and .find() simplify collection manipulation.
   9. RequestAnimationFrame: Smooth execution loop for canvas drawings or count-up animations.
   ========================================================================== */

// 1. APPLICATION CONSTANTS (STATIC DATA)
const WORKOUT_DATABASE = [
  { id: 'w1', name: 'HIIT Interval Run', category: 'cardio', duration: 30, difficulty: 'High', calories: 350 },
  { id: 'w2', name: 'Dumbbell Curl & Press', category: 'strength', duration: 20, difficulty: 'Medium', calories: 180 },
  { id: 'w3', name: 'Sun Salutation Yoga', category: 'flexibility', duration: 25, difficulty: 'Low', calories: 90 },
  { id: 'w4', name: 'Speed Cycling', category: 'cardio', duration: 45, difficulty: 'High', calories: 450 },
  { id: 'w5', name: 'Bodyweight Squat Circuit', category: 'strength', duration: 15, difficulty: 'Medium', calories: 140 },
  { id: 'w6', name: 'Deep Stretching Routine', category: 'flexibility', duration: 15, difficulty: 'Low', calories: 60 },
  { id: 'w7', name: 'Jump Rope Session', category: 'cardio', duration: 20, difficulty: 'High', calories: 250 },
  { id: 'w8', name: 'Plank Core Workout', category: 'strength', duration: 10, difficulty: 'Medium', calories: 100 }
];

const HEALTH_TIPS = [
  { category: 'Hydration', title: 'Hydrate Before You Feel Thirsty', content: 'By the time your body signals thirst, you are already mildly dehydrated. Keep a water bottle handy and take small sips regularly throughout the day.' },
  { category: 'Nutrition', title: 'Power Up with Post-Workout Protein', content: 'Consuming high-quality protein within 45 minutes of a workout supports muscle recovery, repairs damaged fibers, and accelerates muscle growth.' },
  { category: 'Recovery', title: 'Never Skip Warm-ups & Cool-downs', content: 'Warming up increases blood flow to muscles, reducing muscle stiffness and injury risk. Cool-downs help stabilize your heart rate and stretch tight tissues.' },
  { category: 'Sleep', title: 'Sleep is the Ultimate Recovery Tool', content: 'During deep sleep, your body releases growth hormones that rebuild torn muscle tissue and replenish cellular energy. Aim for 7-9 hours.' },
  { category: 'Hydration', title: 'Check Hydration Level via Urine Color', content: 'Light straw or pale yellow indicates optimal hydration. Dark amber colors mean you need to increase your water intake immediately.' },
  { category: 'Training', title: 'Quality Beats Quantity Every Time', content: 'Performing 5 reps of an exercise with flawless form builds more strength and prevents more injuries than doing 15 reps with sloppy mechanics.' }
];

// Default initial state structure
const DEFAULT_STATE = {
  profile: {
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    gender: 'male',
    age: 26,
    height: 178,
    weight: 74,
    activityLevel: '1.375', // Lightly active multiplier
    calorieGoal: 2200,
    waterGoal: 2500
  },
  statsToday: {
    waterIntake: 1250,
    stepsWalked: 8420,
    completedWorkoutIds: ['w3'], // Starting with one workout complete
    caloriesBurnedOverride: 0 // Optional computed calorie sum from workouts
  },
  weeklyGoals: {
    'goal-water': true,
    'goal-steps': false,
    'goal-workouts': false,
    'goal-calories': true
  },
  activeTab: 'dashboard',
  theme: 'dark-theme'
};

// 2. STATE MANAGER CLASS (REACTIVE DATA STORE)
class AppState {
  constructor() {
    this.data = this.loadFromStorage();
  }

  // Load from browser localStorage, or fallback to defaults
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('aerofit_state');
      if (stored) {
        // Concept: JSON.parse transforms a string back into an object
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading from localStorage", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE)); // Deep clone defaults
  }

  // Save current state structure to localStorage
  saveToStorage() {
    try {
      // Concept: JSON.stringify converts objects to strings
      localStorage.setItem('aerofit_state', JSON.stringify(this.data));
    } catch (e) {
      console.error("Error writing to localStorage", e);
    }
  }

  // Update profile attributes
  updateProfile(newProfile) {
    this.data.profile = { ...this.data.profile, ...newProfile };
    this.saveToStorage();
  }

  // Update a daily tracker value
  updateStat(key, value) {
    this.data.statsToday[key] = value;
    this.saveToStorage();
  }

  // Toggle checklist goal status
  toggleWeeklyGoal(goalId, isChecked) {
    this.data.weeklyGoals[goalId] = isChecked;
    this.saveToStorage();
  }

  // Add a completed workout ID
  addCompletedWorkout(id) {
    if (!this.data.statsToday.completedWorkoutIds.includes(id)) {
      this.data.statsToday.completedWorkoutIds.push(id);
      this.saveToStorage();
    }
  }

  // Remove a completed workout ID
  removeCompletedWorkout(id) {
    this.data.statsToday.completedWorkoutIds = this.data.statsToday.completedWorkoutIds.filter(workoutId => workoutId !== id);
    this.saveToStorage();
  }

  // Clear state and reset
  resetState() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveToStorage();
  }
}

// Instantiate Global AppState
const State = new AppState();

// 3. CORE APPLICATION INITIALIZATION AND DOM SELECTORS
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTabNavigation();
  initWaterTracker();
  initWeeklyGoals();
  initCarousel();
  initBmiCalculator();
  initWorkoutsList();
  initProfileForm();
  initFAQAccordion();
  initModalTip();

  // Populate dynamic profile settings indicators on load
  syncProfileDisplay();
  
  // Trigger initial count-up animations on page render
  triggerStatsCountup();
});

// Sync profile texts in sidebars / headers
function syncProfileDisplay() {
  const sidebarName = document.getElementById('sidebar-username');
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  const profileName = document.getElementById('profile-display-name');
  const profileEmail = document.getElementById('profile-display-email');
  const profileAvatarBig = document.getElementById('profile-avatar-big');
  const greetingName = document.getElementById('dashboard-user-greeting');
  
  const name = State.data.profile.name || "User";
  const email = State.data.profile.email || "user@example.com";
  const firstLetter = name.trim().charAt(0);

  if (sidebarName) sidebarName.textContent = name;
  if (sidebarAvatar) sidebarAvatar.textContent = firstLetter;
  if (profileName) profileName.textContent = name;
  if (profileEmail) profileEmail.textContent = email;
  if (profileAvatarBig) profileAvatarBig.textContent = firstLetter;
  if (greetingName) greetingName.textContent = name;
}

// Toast Alert display helper
function showToast(message, borderType = 'success') {
  const toast = document.getElementById('toast-notif');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  
  // Setup color border based on type
  if (borderType === 'success') {
    toast.style.borderColor = 'var(--accent-success)';
  } else if (borderType === 'error') {
    toast.style.borderColor = 'var(--accent-danger)';
  } else {
    toast.style.borderColor = 'var(--accent-primary)';
  }

  toast.classList.add('active');
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// ==========================================================================
// FEATURE 1: DARK / LIGHT THEME TOGGLE
// ==========================================================================
function initTheme() {
  const btnDark = document.getElementById('theme-btn-dark');
  const btnLight = document.getElementById('theme-btn-light');
  const btnMobile = document.getElementById('mobile-theme-toggle');
  
  // Apply saved theme state on initial load
  applyTheme(State.data.theme);

  // Desktop switches
  if (btnDark) {
    btnDark.addEventListener('click', () => {
      applyTheme('dark-theme');
      State.data.theme = 'dark-theme';
      State.saveToStorage();
    });
  }

  if (btnLight) {
    btnLight.addEventListener('click', () => {
      applyTheme('light-theme');
      State.data.theme = 'light-theme';
      State.saveToStorage();
    });
  }

  // Mobile switch toggles between states
  if (btnMobile) {
    btnMobile.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      const targetTheme = isDark ? 'light-theme' : 'dark-theme';
      applyTheme(targetTheme);
      State.data.theme = targetTheme;
      State.saveToStorage();
    });
  }
}

// Function to toggle body classes and button active indicators
function applyTheme(themeName) {
  const btnDark = document.getElementById('theme-btn-dark');
  const btnLight = document.getElementById('theme-btn-light');
  const btnMobile = document.getElementById('mobile-theme-toggle');

  if (themeName === 'dark-theme') {
    document.body.classList.add('dark-theme');
    
    if (btnDark) btnDark.classList.add('active');
    if (btnLight) btnLight.classList.remove('active');
    if (btnMobile) {
      btnMobile.classList.add('active');
      btnMobile.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  } else {
    document.body.classList.remove('dark-theme');
    
    if (btnDark) btnDark.classList.remove('active');
    if (btnLight) btnLight.classList.add('active');
    if (btnMobile) {
      btnMobile.classList.remove('active');
      btnMobile.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    }
  }
}

// ==========================================================================
// FEATURE 2: TAB NAVIGATION
// ==========================================================================
function initTabNavigation() {
  const desktopLinks = document.querySelectorAll('.nav-item');
  const mobileLinks = document.querySelectorAll('.mobile-nav-item');
  const panels = document.querySelectorAll('.tab-panel');

  // Unified click handler logic
  function switchTab(tabId) {
    State.data.activeTab = tabId;
    State.saveToStorage();

    // Toggle active state classes on navigation buttons
    desktopLinks.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    mobileLinks.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Toggle panel visibility
    panels.forEach(panel => {
      if (panel.id === `tab-${tabId}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Special: Trigger stats counters animation when entering dashboard
    if (tabId === 'dashboard') {
      triggerStatsCountup();
    }
  }

  // Register Click Listeners for Desktop Sidebar links
  desktopLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Register Click Listeners for Mobile bottom bar
  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Load last active tab from State
  if (State.data.activeTab && State.data.activeTab !== 'dashboard') {
    switchTab(State.data.activeTab);
  }
}

// ==========================================================================
// FEATURE 3: ANIMATED STATISTICS COUNTER
// ==========================================================================
function triggerStatsCountup() {
  // Update targets first from State profile properties
  document.getElementById('target-water').textContent = State.data.profile.waterGoal;
  document.getElementById('target-calories').textContent = State.data.profile.calorieGoal;

  // Calculate dynamic workout metrics
  const completedIds = State.data.statsToday.completedWorkoutIds;
  const completedWorkoutsCount = completedIds.length;
  
  // Calculate dynamic calorie sum (200 base BMR passive + logged workouts)
  let workoutCalorieSum = 0;
  completedIds.forEach(id => {
    const workoutObj = WORKOUT_DATABASE.find(w => w.id === id);
    if (workoutObj) {
      workoutCalorieSum += workoutObj.calories;
    }
  });
  const caloriesToday = 200 + workoutCalorieSum; // Let's say 200 is base active walk burn

  // Set visual elements targets
  const elCal = document.getElementById('counter-calories');
  const elStp = document.getElementById('counter-steps');
  const elWtr = document.getElementById('counter-water');
  const elWk = document.getElementById('counter-workouts');

  if (elCal) elCal.setAttribute('data-target', caloriesToday);
  if (elStp) elStp.setAttribute('data-target', State.data.statsToday.stepsWalked);
  if (elWtr) elWtr.setAttribute('data-target', State.data.statsToday.waterIntake);
  if (elWk) elWk.setAttribute('data-target', completedWorkoutsCount);

  // Run the animation
  animateSingleCounter(elCal, 1000); // 1s duration
  animateSingleCounter(elStp, 1200);
  animateSingleCounter(elWtr, 800);
  animateSingleCounter(elWk, 500);
}

// Count up logic utilizing standard setInterval
function animateSingleCounter(element, duration) {
  if (!element) return;
  
  const target = parseFloat(element.getAttribute('data-target')) || 0;
  const start = 0;
  const increment = target / (duration / 16); // ~60fps
  let current = start;
  
  // Clear any existing animation timer
  if (element.counterInterval) {
    clearInterval(element.counterInterval);
  }

  element.counterInterval = setInterval(() => {
    current += increment;
    if (current >= target) {
      clearInterval(element.counterInterval);
      element.textContent = Math.round(target).toLocaleString();
    } else {
      element.textContent = Math.round(current).toLocaleString();
    }
  }, 16);
}

// ==========================================================================
// FEATURE 4: DAILY WATER INTAKE TRACKER
// ==========================================================================
function initWaterTracker() {
  const plusBtn = document.getElementById('water-plus-btn');
  const minusBtn = document.getElementById('water-minus-btn');

  updateWaterUI();

  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      let currentVal = State.data.statsToday.waterIntake;
      const maxVal = 8000; // Cap intake at 8L
      
      if (currentVal < maxVal) {
        currentVal += 250; // Add 1 glass (250 ml)
        State.updateStat('waterIntake', currentVal);
        updateWaterUI();
        triggerStatsCountup();
      }
    });
  }

  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      let currentVal = State.data.statsToday.waterIntake;
      if (currentVal >= 250) {
        currentVal -= 250; // Subtract 1 glass
        State.updateStat('waterIntake', currentVal);
        updateWaterUI();
        triggerStatsCountup();
      }
    });
  }
}

// Synchronize numbers, progress-text, and height of wave animation in the cup
function updateWaterUI() {
  const currentVal = State.data.statsToday.waterIntake;
  const goalVal = State.data.profile.waterGoal || 2500;

  const textVal = document.getElementById('water-current-val');
  const goalText = document.getElementById('water-goal-val');
  const fillFluid = document.getElementById('water-visual-fill');

  if (textVal) textVal.textContent = currentVal;
  if (goalText) goalText.textContent = goalVal;

  if (fillFluid) {
    // Concept: math division to compute current percentage
    let percentage = (currentVal / goalVal) * 100;
    if (percentage > 100) percentage = 100;
    
    // Wave fills up container height
    fillFluid.style.height = `${percentage}%`;
  }
}

// ==========================================================================
// FEATURE 5: BMI CALCULATOR
// ==========================================================================
function initBmiCalculator() {
  const form = document.getElementById('bmi-calculator-form');
  const resetBtn = document.getElementById('bmi-reset-btn');

  // Input Validation variables
  const heightInput = document.getElementById('bmi-height');
  const weightInput = document.getElementById('bmi-weight');
  const heightError = document.getElementById('bmi-height-error');
  const weightError = document.getElementById('bmi-weight-error');

  // Output display variables
  const scoreDisplay = document.getElementById('bmi-score-display');
  const categoryDisplay = document.getElementById('bmi-category-display');
  const adviceContainer = document.getElementById('bmi-advice-container');
  const gaugePin = document.getElementById('bmi-gauge-pin');

  // Load default measurements from profile into BMI inputs
  if (heightInput && weightInput) {
    heightInput.value = State.data.profile.height;
    weightInput.value = State.data.profile.weight;
  }

  // Validation feedback indicators helper
  function validateBmiInput() {
    let isValid = true;

    // Validate Height (100 to 250)
    const h = parseFloat(heightInput.value);
    if (isNaN(h) || h < 100 || h > 250) {
      heightInput.classList.add('error');
      heightInput.classList.remove('success');
      heightError.style.display = 'block';
      isValid = false;
    } else {
      heightInput.classList.remove('error');
      heightInput.classList.add('success');
      heightError.style.display = 'none';
    }

    // Validate Weight (30 to 250)
    const w = parseFloat(weightInput.value);
    if (isNaN(w) || w < 30 || w > 250) {
      weightInput.classList.add('error');
      weightInput.classList.remove('success');
      weightError.style.display = 'block';
      isValid = false;
    } else {
      weightInput.classList.remove('error');
      weightInput.classList.add('success');
      weightError.style.display = 'none';
    }

    return isValid;
  }

  // Calculate Action Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateBmiInput()) {
        showToast("Please fix input boundaries before calculating.", "error");
        return;
      }

      const h = parseFloat(heightInput.value);
      const w = parseFloat(weightInput.value);

      // BMI Equation: Weight (kg) / Height^2 (m)
      const heightInMeters = h / 100;
      const bmi = w / (heightInMeters * heightInMeters);

      // Render Results
      scoreDisplay.textContent = bmi.toFixed(1);
      
      // Determine Health Category & recommendation texts
      let category = "";
      let advice = "";
      let pinPercent = 0; // slider position percentage 0-100%

      if (bmi < 18.5) {
        category = "Underweight";
        advice = "💡 <strong>Advice:</strong> Focus on nutrient-dense foods, clean mass-gain protocols, and resistance training. Consult a healthcare professional to identify healthy weight-gain strategies.";
        pinPercent = (bmi / 18.5) * 25; // Map Underweight into first 25% of slider
      } else if (bmi >= 18.5 && bmi < 25) {
        category = "Normal Weight";
        advice = "🌟 <strong>Advice:</strong> Excellent! Your body weight is in a highly balanced health range. Focus on cardiovascular health, regular strength building, and maintaining your balanced diet.";
        pinPercent = 25 + ((bmi - 18.5) / 6.5) * 35; // Map Normal (18.5-25) to 25-60% slider range
      } else if (bmi >= 25 && bmi < 30) {
        category = "Overweight";
        advice = "⚠️ <strong>Advice:</strong> Moderate weight loss could lower your risks of cardiovascular ailments. Focus on creating a small caloric deficit, walking 10k steps daily, and strength exercises.";
        pinPercent = 60 + ((bmi - 25) / 5) * 20; // Map Overweight (25-30) to 60-80% slider range
      } else {
        category = "Obese";
        advice = "🚨 <strong>Advice:</strong> Recommended to seek medical/nutritional guidance. Focus on steady, low-impact cardio exercises (walking, water sports), portion control, and reducing processed sugars.";
        pinPercent = 80 + Math.min(((bmi - 30) / 10) * 20, 20); // Map Obese (30-40+) to 80-100% slider range
      }

      categoryDisplay.textContent = category;
      adviceContainer.innerHTML = advice;
      
      // Visual slider pin movement
      if (gaugePin) {
        gaugePin.style.left = `${Math.min(Math.max(pinPercent, 0), 100)}%`;
      }

      showToast("BMI calculated successfully!");
    });
  }

  // Reset Button action handler
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      heightInput.value = State.data.profile.height;
      weightInput.value = State.data.profile.weight;
      
      heightInput.classList.remove('error', 'success');
      weightInput.classList.remove('error', 'success');
      heightError.style.display = 'none';
      weightError.style.display = 'none';

      scoreDisplay.textContent = '--.-';
      categoryDisplay.textContent = 'Enter inputs to calculate';
      adviceContainer.innerHTML = 'Enter weight and height to get personalized health feedback.';
      if (gaugePin) gaugePin.style.left = '0%';
    });
  }
}

// ==========================================================================
// FEATURE 6 & 7: WORKOUTS LIST, SEARCH, AND COMPLETION
// ==========================================================================
function initWorkoutsList() {
  const container = document.getElementById('workouts-list-container');
  const searchBar = document.getElementById('workout-search-bar');
  const categoryFilters = document.querySelectorAll('.category-filters .filter-btn');

  let currentSearchQuery = "";
  let currentCategoryFilter = "all";

  renderWorkouts();

  // Render cards based on database filters
  function renderWorkouts() {
    if (!container) return;
    container.innerHTML = "";

    // Array filtering concept
    const filteredWorkouts = WORKOUT_DATABASE.filter(workout => {
      const matchesSearch = workout.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) || 
                            workout.category.toLowerCase().includes(currentSearchQuery.toLowerCase());
      
      const matchesCategory = currentCategoryFilter === 'all' || workout.category === currentCategoryFilter;
      
      return matchesSearch && matchesCategory;
    });

    // Handle Empty Search/Filter results
    if (filteredWorkouts.length === 0) {
      container.innerHTML = `
        <div class="card form-grid-full" style="text-align: center; padding: 3rem;">
          <p style="font-weight: 600; color: var(--text-muted);">No workouts match your current filter settings.</p>
        </div>
      `;
      return;
    }

    // Loop through list and create DOM nodes
    filteredWorkouts.forEach(workout => {
      const isCompleted = State.data.statsToday.completedWorkoutIds.includes(workout.id);
      
      const card = document.createElement('article');
      card.className = 'card workout-card';
      
      card.innerHTML = `
        <div>
          <span class="workout-badge ${workout.category}">${workout.category}</span>
          <h3 class="workout-card-title">${workout.name}</h3>
          
          <div class="workout-meta">
            <div class="workout-meta-item">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>${workout.duration} mins</span>
            </div>
            <div class="workout-meta-item">
              <!-- Flame Icon -->
              <svg viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 3.5 3.5z"></path></svg>
              <span>${workout.difficulty}</span>
            </div>
          </div>
        </div>

        <div class="workout-footer">
          <span class="workout-calories">${workout.calories} kcal</span>
          <button type="button" class="complete-toggle-btn ${isCompleted ? 'completed' : ''}" data-workout-id="${workout.id}">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${isCompleted ? 'Completed' : 'Mark Done'}</span>
          </button>
        </div>
      `;

      // Event listener inside card button
      const toggleBtn = card.querySelector('.complete-toggle-btn');
      toggleBtn.addEventListener('click', () => {
        handleWorkoutToggle(workout.id, toggleBtn);
      });

      container.appendChild(card);
    });
  }

  // Handle completion toggle
  function handleWorkoutToggle(workoutId, btn) {
    const isNowCompleted = !btn.classList.contains('completed');
    const workout = WORKOUT_DATABASE.find(w => w.id === workoutId);
    
    if (isNowCompleted) {
      btn.classList.add('completed');
      btn.querySelector('span').textContent = 'Completed';
      State.addCompletedWorkout(workoutId);
      
      if (workout) {
        showToast(`Logged: +${workout.calories} kcal from ${workout.name}!`);
      }
    } else {
      btn.classList.remove('completed');
      btn.querySelector('span').textContent = 'Mark Done';
      State.removeCompletedWorkout(workoutId);
      
      if (workout) {
        showToast(`Removed workout: ${workout.name}`);
      }
    }
    
    // Sync statistics elements
    triggerStatsCountup();
  }

  // Register Search bar events
  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderWorkouts();
    });
  }

  // Register Category filters tab selection
  categoryFilters.forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoryFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentCategoryFilter = btn.getAttribute('data-filter');
      renderWorkouts();
    });
  });
}

// ==========================================================================
// FEATURE 8: WEEKLY FITNESS GOALS CHECKLIST
// ==========================================================================
function initWeeklyGoals() {
  const goalItems = document.querySelectorAll('.goals-checklist .goal-item');

  // Initial Sync from State
  goalItems.forEach(item => {
    const goalId = item.getAttribute('data-goal-id');
    const chk = item.querySelector('input[type="checkbox"]');
    
    const isDone = State.data.weeklyGoals[goalId] || false;
    chk.checked = isDone;
    
    if (isDone) {
      item.classList.add('checked');
    } else {
      item.classList.remove('checked');
    }

    // Change Listener
    chk.addEventListener('change', () => {
      const stateChecked = chk.checked;
      State.toggleWeeklyGoal(goalId, stateChecked);
      
      if (stateChecked) {
        item.classList.add('checked');
      } else {
        item.classList.remove('checked');
      }
      
      updateGoalsProgressUI();
    });
  });

  updateGoalsProgressUI();
}

// Update the overall Goals progress bars
function updateGoalsProgressUI() {
  const keys = Object.keys(State.data.weeklyGoals);
  let checkedCount = 0;
  
  keys.forEach(k => {
    if (State.data.weeklyGoals[k] === true) {
      checkedCount++;
    }
  });

  const totalGoals = keys.length || 4;
  const percentage = Math.round((checkedCount / totalGoals) * 100);

  const percentLabel = document.getElementById('weekly-goal-percent');
  const progressFill = document.getElementById('weekly-goal-progress-fill');

  if (percentLabel) percentLabel.textContent = `${percentage}%`;
  if (progressFill) progressFill.style.width = `${percentage}%`;
}

// ==========================================================================
// FEATURE 9: FAQ ACCORDION (Interactive Collapsible Grid)
// ==========================================================================
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Accordion mode: close other active panels before opening current
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
      });

      // Toggle current panel status
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ==========================================================================
// FEATURE 10: DAILY HEALTH TIPS DETAIL MODAL
// ==========================================================================
function initModalTip() {
  const triggerBtn = document.getElementById('dashboard-tip-trigger-btn');
  const modalOverlay = document.getElementById('tip-modal-overlay');
  const closeX = document.getElementById('modal-close-x');
  const closeConfirm = document.getElementById('modal-close-confirm');

  // Target inside modal
  const modalTag = document.getElementById('modal-tip-tag');
  const modalTitle = document.getElementById('modal-tip-title');
  const modalContent = document.getElementById('modal-tip-content');

  // Trigger Open Modal Event
  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      // Pick a random tip to show dynamically
      const randomIndex = Math.floor(Math.random() * HEALTH_TIPS.length);
      const tip = HEALTH_TIPS[randomIndex];

      modalTag.textContent = tip.category;
      modalTitle.textContent = tip.title;
      modalContent.textContent = tip.content;

      modalOverlay.classList.add('active');
    });
  }

  // Close events handlers
  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  if (closeX) closeX.addEventListener('click', closeModal);
  if (closeConfirm) closeConfirm.addEventListener('click', closeModal);
  
  // Close when clicking overlay background backdrop blur area
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }
}

// ==========================================================================
// FEATURE 11: DYNAMIC MOTIVATION CAROUSEL / SLIDER
// ==========================================================================
function initCarousel() {
  const container = document.querySelector('.carousel-container');
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');

  let activeIndex = 0;
  const slideCount = slides.length;
  let autoPlayInterval = null;

  // Active indicator logic
  function goToSlide(index) {
    // Wrap around boundaries
    if (index >= slideCount) index = 0;
    if (index < 0) index = slideCount - 1;

    activeIndex = index;

    // Toggle Slides visibility
    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Toggle dot indicators active color
    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Next slide helper
  function nextSlide() {
    goToSlide(activeIndex + 1);
  }

  // Prev slide helper
  function prevSlide() {
    goToSlide(activeIndex - 1);
  }

  // Register Buttons click
  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });
  
  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  // Register Indicators click
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-slide'));
      goToSlide(targetIndex);
      resetAutoplay();
    });
  });

  // Setup Autoplay loop (5 seconds transitions)
  function startAutoplay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoPlayInterval);
    startAutoplay();
  }

  // Play slideshow on render
  startAutoplay();
}

// ==========================================================================
// FEATURE 12 & 13: PROFILE FORM VALIDATION & CALORIE CALCULATOR
// ==========================================================================
function initProfileForm() {
  const form = document.getElementById('profile-settings-form');
  const prefillBtn = document.getElementById('prefill-goals-btn');

  // Input Field References
  const nameInput = document.getElementById('prof-name');
  const emailInput = document.getElementById('prof-email');
  const ageInput = document.getElementById('prof-age');
  const heightInput = document.getElementById('prof-height');
  const weightInput = document.getElementById('prof-weight');
  const waterGoalInput = document.getElementById('prof-water-goal');
  const calorieGoalInput = document.getElementById('prof-calorie-goal');
  
  // Select and Radios
  const genderSelect = document.getElementById('prof-gender');
  const activityRadios = () => document.getElementsByName('prof-activity');

  // Target Energy displays (Suggested TDEE / BMR fields)
  const suggestedTdee = document.getElementById('suggested-tdee-calories');
  const suggestedBmr = document.getElementById('suggested-bmr');

  // Load current settings values from State into form inputs
  const p = State.data.profile;
  if (nameInput) nameInput.value = p.name;
  if (emailInput) emailInput.value = p.email;
  if (ageInput) ageInput.value = p.age;
  if (heightInput) heightInput.value = p.height;
  if (weightInput) weightInput.value = p.weight;
  if (waterGoalInput) waterGoalInput.value = p.waterGoal;
  if (calorieGoalInput) calorieGoalInput.value = p.calorieGoal;
  if (genderSelect) genderSelect.value = p.gender;
  
  // Select current activity radio button
  const radios = activityRadios();
  radios.forEach(radio => {
    if (radio.value === p.activityLevel) {
      radio.checked = true;
    }
  });

  // Trigger TDEE calculation initially
  recalculateEnergyNeeds();

  // 1. DYNAMIC ENERGY CALCULATION (BMR & TDEE)
  function recalculateEnergyNeeds() {
    const age = parseInt(ageInput.value);
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    const gender = genderSelect.value;
    
    let activeLevelValue = "1.2";
    const selectedRadio = Array.from(radios).find(r => r.checked);
    if (selectedRadio) {
      activeLevelValue = selectedRadio.value;
    }
    const multiplier = parseFloat(activeLevelValue);

    // Verify fields contain numbers before doing equations
    if (isNaN(age) || isNaN(height) || isNaN(weight) || age <= 0 || height <= 0 || weight <= 0) {
      if (suggestedTdee) suggestedTdee.textContent = "--";
      if (suggestedBmr) suggestedBmr.textContent = "--";
      if (prefillBtn) prefillBtn.disabled = true;
      return;
    }

    // Mifflin-St Jeor Equations BMR math
    let bmr = 0;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // TDEE = BMR * Activity multiplier factor
    const tdee = bmr * multiplier;

    // Update suggestions UI text fields
    if (suggestedBmr) suggestedBmr.textContent = Math.round(bmr).toLocaleString();
    if (suggestedTdee) suggestedTdee.textContent = Math.round(tdee).toLocaleString();
    
    // Enable the "prefill goals" shortcuts button
    if (prefillBtn) prefillBtn.disabled = false;
  }

  // Event Listeners to trigger energy recalculation on details change
  [ageInput, heightInput, weightInput, genderSelect].forEach(input => {
    if (input) {
      input.addEventListener('input', recalculateEnergyNeeds);
      input.addEventListener('change', recalculateEnergyNeeds);
    }
  });

  // Dynamic activity radio click triggers recalculation
  radios.forEach(radio => {
    radio.addEventListener('click', recalculateEnergyNeeds);
  });

  // Prefill Button Shortcut handler
  if (prefillBtn) {
    prefillBtn.addEventListener('click', () => {
      const computedCalVal = suggestedTdee.textContent.replace(/,/g, '');
      if (computedCalVal !== '--') {
        calorieGoalInput.value = parseInt(computedCalVal);
        
        // Water goal prefill heuristic (weight * 35 ml)
        const weight = parseFloat(weightInput.value);
        let waterVal = 2500;
        if (!isNaN(weight)) {
          waterVal = Math.round((weight * 35) / 250) * 250; // rounded to nearest 250ml cup
        }
        waterGoalInput.value = waterVal;
        
        showToast("Prefilled goals from energy calculator!", "info");
      }
    });
  }

  // 2. INPUT ERROR VALIDATORS HANDLERS
  function validateField(inputEl, errorEl, validatorFn) {
    const isValid = validatorFn(inputEl.value);
    if (!isValid) {
      inputEl.classList.add('error');
      inputEl.classList.remove('success');
      errorEl.style.display = 'block';
    } else {
      inputEl.classList.remove('error');
      inputEl.classList.add('success');
      errorEl.style.display = 'none';
    }
    return isValid;
  }

  // Validator functions
  const nameValidator = (val) => val.trim().length >= 2;
  const emailValidator = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };
  const ageValidator = (val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 10 && num <= 100;
  };
  const heightValidator = (val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 100 && num <= 250;
  };
  const weightValidator = (val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 30 && num <= 250;
  };
  const waterGoalValidator = (val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 1000 && num <= 8000;
  };
  const calorieGoalValidator = (val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 1000 && num <= 6000;
  };

  // Real-time error messages trigger as user types
  nameInput.addEventListener('input', () => validateField(nameInput, document.getElementById('prof-name-error'), nameValidator));
  emailInput.addEventListener('input', () => validateField(emailInput, document.getElementById('prof-email-error'), emailValidator));
  ageInput.addEventListener('input', () => validateField(ageInput, document.getElementById('prof-age-error'), ageValidator));
  heightInput.addEventListener('input', () => validateField(heightInput, document.getElementById('prof-height-error'), heightValidator));
  weightInput.addEventListener('input', () => validateField(weightInput, document.getElementById('prof-weight-error'), weightValidator));
  waterGoalInput.addEventListener('input', () => validateField(waterGoalInput, document.getElementById('prof-water-goal-error'), waterGoalValidator));
  calorieGoalInput.addEventListener('input', () => validateField(calorieGoalInput, document.getElementById('prof-calorie-goal-error'), calorieGoalValidator));

  // 3. SUBMIT PROFILE HANDLER
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Run all validators
      const vName = validateField(nameInput, document.getElementById('prof-name-error'), nameValidator);
      const vEmail = validateField(emailInput, document.getElementById('prof-email-error'), emailValidator);
      const vAge = validateField(ageInput, document.getElementById('prof-age-error'), ageValidator);
      const vHeight = validateField(heightInput, document.getElementById('prof-height-error'), heightValidator);
      const vWeight = validateField(weightInput, document.getElementById('prof-weight-error'), weightValidator);
      const vWater = validateField(waterGoalInput, document.getElementById('prof-water-goal-error'), waterGoalValidator);
      const vCal = validateField(calorieGoalInput, document.getElementById('prof-calorie-goal-error'), calorieGoalValidator);

      const formIsValid = vName && vEmail && vAge && vHeight && vWeight && vWater && vCal;

      if (!formIsValid) {
        showToast("Form validation failed. Please review errors.", "error");
        return;
      }

      // Update State variables
      const activeRadio = Array.from(radios).find(r => r.checked);
      const updatedProfile = {
        name: nameInput.value,
        email: emailInput.value,
        gender: genderSelect.value,
        age: parseInt(ageInput.value),
        height: parseFloat(heightInput.value),
        weight: parseFloat(weightInput.value),
        activityLevel: activeRadio ? activeRadio.value : '1.375',
        waterGoal: parseInt(waterGoalInput.value),
        calorieGoal: parseInt(calorieGoalInput.value)
      };

      State.updateProfile(updatedProfile);
      
      // Update UI displays
      syncProfileDisplay();
      updateWaterUI();
      triggerStatsCountup();

      showToast("Profile and Goals updated successfully!");
    });
  }
}
