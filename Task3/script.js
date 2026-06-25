/**
 * ==========================================================================
 * NexusHub Script - Core Application Logic
 * ==========================================================================
 * Technology: Vanilla JavaScript (ES6+), Fetch API, Local Storage, Async/Await
 */

// --- Global Application State ---
const state = {
    theme: 'dark',
    activeTab: 'dashboard',
    apiKeys: {
        weather: '',
        movie: ''
    },
    weather: {
        unit: 'C', // 'C' or 'F'
        history: [], // Last 5 searched cities
        currentData: null // Holds active weather payload
    },
    movies: {
        searchResults: [],
        favorites: [],
        viewingFavorites: false
    },
    quotes: {
        current: null
    }
};

// ==========================================================================
// Initialization & Lifecycle
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 1. Load data from Local Storage
    loadStateFromStorage();

    // 2. Initialize UI States
    applyTheme(state.theme);
    updateAPIStatusIndicators();
    renderWeatherHistory();
    updateFavoritesBadge();

    // 3. Setup Navigation & Layout Listeners
    setupNavigation();
    setupMobileSidebar();
    setupThemeToggle();

    // 4. Setup Sub-App Event Listeners
    setupWeatherApp();
    setupMovieApp();
    setupQuoteApp();
    setupSettingsApp();

    // 5. Populate Initial Overview Screen & Pre-fetch a Quote
    fetchRandomQuote(true); // silent fetch to cache one
}

// --- Local Storage Synchronization ---
function loadStateFromStorage() {
    // Theme
    const savedTheme = localStorage.getItem('nexus_theme');
    if (savedTheme) state.theme = savedTheme;

    // API Keys
    state.apiKeys.weather = localStorage.getItem('nexus_key_weather') || '';
    state.apiKeys.movie = localStorage.getItem('nexus_key_movie') || '';

    // Weather History
    const savedHistory = localStorage.getItem('nexus_weather_history');
    state.weather.history = savedHistory ? JSON.parse(savedHistory) : [];

    // Movie Favorites
    const savedFavs = localStorage.getItem('nexus_movie_favorites');
    state.movies.favorites = savedFavs ? JSON.parse(savedFavs) : [];

    // Sync to Settings inputs
    document.getElementById('weatherApiKey').value = state.apiKeys.weather;
    document.getElementById('movieApiKey').value = state.apiKeys.movie;
}

function saveStateToStorage(key, value) {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
}

// ==========================================================================
// Global Component: Toast Notification System
// ==========================================================================

class Toast {
    static show(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        // Select icon based on toast type
        let iconClass = 'fa-circle-info';
        if (type === 'success') iconClass = 'fa-circle-check';
        if (type === 'error') iconClass = 'fa-circle-exclamation';
        if (type === 'warning') iconClass = 'fa-triangle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${iconClass}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close-btn" aria-label="Close message">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        container.appendChild(toast);

        // Bind dismiss click
        toast.querySelector('.toast-close-btn').addEventListener('click', () => {
            Toast.dismiss(toast);
        });

        // Auto dismiss after 4.5 seconds
        setTimeout(() => {
            Toast.dismiss(toast);
        }, 4500);
    }

    static dismiss(toast) {
        if (toast.classList.contains('removing')) return;
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }
}

// ==========================================================================
// Application Core Features (Theme, Nav, UI Actions)
// ==========================================================================

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById('themeToggle');
    // Accessibility label updates
    if (themeBtn) {
        themeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
    state.theme = theme;
    saveStateToStorage('nexus_theme', theme);
}

function setupThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;
    toggleBtn.addEventListener('click', () => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        Toast.show(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
    });
}

function setupNavigation() {
    const menuButtons = document.querySelectorAll('.menu-item');
    menuButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
            
            // Close mobile sidebar if open
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    });
}

function switchTab(tabId) {
    state.activeTab = tabId;
    
    // Toggle active menu button
    const menuButtons = document.querySelectorAll('.menu-item');
    menuButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Toggle active tab pane
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        if (pane.id === `tab-${tabId}`) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Set page title in top header
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titleMap = {
            dashboard: 'Dashboard Overview',
            weather: 'Weather Forecast App',
            movies: 'Movie Search & Favorites',
            quotes: 'Random Quote Generator',
            settings: 'API Configurations'
        };
        pageTitle.textContent = titleMap[tabId] || 'NexusHub';
    }
}

function setupMobileSidebar() {
    const hamburger = document.getElementById('hamburgerMenu');
    const closeBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', () => sidebar.classList.add('open'));
    }
    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
    }
}

function updateAPIStatusIndicators() {
    const badge = document.getElementById('apiStatusBadge');
    const label = document.getElementById('apiStatusText');
    if (!badge || !label) return;

    const hasWeather = state.apiKeys.weather.trim().length > 0;
    const hasMovie = state.apiKeys.movie.trim().length > 0;

    if (hasWeather && hasMovie) {
        badge.className = 'status-indicator live';
        label.textContent = 'Live Sync';
    } else if (hasWeather || hasMovie) {
        badge.className = 'status-indicator demo';
        label.textContent = 'Semi-Demo';
    } else {
        badge.className = 'status-indicator demo';
        label.textContent = 'Demo Mode';
    }
}

// Utility: toggle password fields in settings
function togglePasswordVisibility(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input) return;
    const btn = input.nextElementSibling;
    const icon = btn ? btn.querySelector('.eye-icon') : null;

    if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    } else {
        input.type = 'password';
        if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// ==========================================================================
// Weather App Component
// ==========================================================================

function setupWeatherApp() {
    const form = document.getElementById('weatherForm');
    const clearHistoryBtn = document.getElementById('clearWeatherHistory');
    const unitCelsius = document.getElementById('unitCelsius');
    const unitFahrenheit = document.getElementById('unitFahrenheit');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('weatherInput');
            if (!input) return;
            const city = input.value.trim();
            if (city) {
                await fetchWeatherData(city);
                input.value = '';
            }
        });
    }

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            state.weather.history = [];
            saveStateToStorage('nexus_weather_history', []);
            renderWeatherHistory();
            Toast.show('Search history cleared', 'info');
        });
    }

    if (unitCelsius && unitFahrenheit) {
        unitCelsius.addEventListener('click', () => toggleWeatherUnit('C'));
        unitFahrenheit.addEventListener('click', () => toggleWeatherUnit('F'));
    }
}

async function fetchWeatherData(city) {
    const placeholder = document.getElementById('weatherPlaceholder');
    const skeleton = document.getElementById('weatherSkeleton');
    const content = document.getElementById('weatherContent');

    // UI state updates: show loading skeleton
    if (placeholder) placeholder.classList.add('hidden');
    if (content) content.classList.add('hidden');
    if (skeleton) skeleton.classList.remove('hidden');

    const apiKey = state.apiKeys.weather.trim();

    try {
        let weatherData;
        if (apiKey) {
            // Live OpenWeatherMap API Call
            // Use units=metric by default for standard requests
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized API Key. Please verify your OpenWeatherMap key in Settings.');
                } else if (response.status === 404) {
                    throw new Error(`Location "${city}" not found. Check spelling and try again.`);
                } else {
                    throw new Error(`Server returned code ${response.status}`);
                }
            }
            weatherData = await response.json();
            weatherData = parseLiveWeatherData(weatherData);
        } else {
            // Demo Mode: Mock Weather generation
            await simulateNetworkDelay(800); // Simulate API lag
            weatherData = generateMockWeatherData(city);
        }

        // Store active data in state
        state.weather.currentData = weatherData;

        // Render data, add to history
        renderWeatherDetails();
        saveWeatherSearch(weatherData.name);
        
        if (skeleton) skeleton.classList.add('hidden');
        if (content) content.classList.remove('hidden');

    } catch (err) {
        console.error('Weather Fetch Error:', err);
        Toast.show(err.message, 'error');

        // Restore placeholder/content states on error
        if (skeleton) skeleton.classList.add('hidden');
        if (state.weather.currentData) {
            if (content) content.classList.remove('hidden');
        } else {
            if (placeholder) placeholder.classList.remove('hidden');
        }
    }
}

function parseLiveWeatherData(data) {
    return {
        name: data.name,
        country: data.sys.country,
        tempC: Math.round(data.main.temp),
        tempF: Math.round((data.main.temp * 9/5) + 32),
        feelsLikeC: Math.round(data.main.feels_like),
        feelsLikeF: Math.round((data.main.feels_like * 9/5) + 32),
        humidity: `${data.main.humidity}%`,
        wind: `${data.wind.speed} m/s`,
        pressure: `${data.main.pressure} hPa`,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
    };
}

function generateMockWeatherData(city) {
    // Generate deterministic values based on letters of the city name
    const seed = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const conditions = ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Snow', 'Mist'];
    const condition = conditions[seed % conditions.length];
    
    // Choose temperatures ranging between -5 and 35 based on seed
    const tempC = Math.round((seed % 40) - 5);
    const tempF = Math.round((tempC * 9/5) + 32);
    
    const feelsLikeC = tempC + (seed % 3 - 1);
    const feelsLikeF = Math.round((feelsLikeC * 9/5) + 32);
    
    const humidity = `${50 + (seed % 45)}%`;
    const wind = `${(1.5 + (seed % 10) * 0.8).toFixed(1)} m/s`;
    const pressure = `${1005 + (seed % 15)} hPa`;
    
    let description = 'clear sky';
    let iconCode = '01d';
    
    if (condition === 'Clouds') {
        description = seed % 2 === 0 ? 'few clouds' : 'overcast clouds';
        iconCode = seed % 2 === 0 ? '02d' : '04d';
    } else if (condition === 'Rain') {
        description = 'moderate rain';
        iconCode = '10d';
    } else if (condition === 'Drizzle') {
        description = 'light intensity drizzle';
        iconCode = '09d';
    } else if (condition === 'Thunderstorm') {
        description = 'thunderstorm with rain';
        iconCode = '11d';
    } else if (condition === 'Snow') {
        description = 'light snow';
        iconCode = '13d';
    } else if (condition === 'Mist') {
        description = 'misty haze';
        iconCode = '50d';
    }

    return {
        name: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
        country: 'Demo',
        tempC,
        tempF,
        feelsLikeC,
        feelsLikeF,
        humidity,
        wind,
        pressure,
        condition,
        description,
        iconUrl: `https://openweathermap.org/img/wn/${iconCode}@4x.png`
    };
}

function renderWeatherDetails() {
    const data = state.weather.currentData;
    if (!data) return;

    const cityName = document.getElementById('weatherCityName');
    const dateLabel = document.getElementById('weatherDate');
    const tempVal = document.getElementById('weatherTemp');
    const icon = document.getElementById('weatherIcon');
    const desc = document.getElementById('weatherDescription');
    const humidity = document.getElementById('weatherHumidity');
    const wind = document.getElementById('weatherWind');
    const feelsLike = document.getElementById('weatherFeelsLike');
    const pressure = document.getElementById('weatherPressure');

    if (cityName) cityName.textContent = `${data.name}, ${data.country}`;
    if (dateLabel) {
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        dateLabel.textContent = new Date().toLocaleDateString('en-US', options);
    }
    
    if (desc) desc.textContent = data.description;
    if (icon) {
        icon.src = data.iconUrl;
        icon.alt = data.condition;
    }
    if (humidity) humidity.textContent = data.humidity;
    if (wind) wind.textContent = data.wind;
    if (pressure) pressure.textContent = data.pressure;

    // Unit toggle dynamic output
    if (tempVal) {
        tempVal.textContent = state.weather.unit === 'C' ? data.tempC : data.tempF;
    }
    if (feelsLike) {
        feelsLike.textContent = state.weather.unit === 'C' ? `${data.feelsLikeC}°C` : `${data.feelsLikeF}°F`;
    }
}

function toggleWeatherUnit(unit) {
    if (state.weather.unit === unit) return;
    state.weather.unit = unit;

    const unitCelsius = document.getElementById('unitCelsius');
    const unitFahrenheit = document.getElementById('unitFahrenheit');

    if (unit === 'C') {
        if (unitCelsius) unitCelsius.classList.add('active');
        if (unitFahrenheit) unitFahrenheit.classList.remove('active');
    } else {
        if (unitCelsius) unitCelsius.classList.remove('active');
        if (unitFahrenheit) unitFahrenheit.classList.add('active');
    }

    renderWeatherDetails();
}

function saveWeatherSearch(cityName) {
    let history = state.weather.history;
    // Remove if duplicates exist to re-add to front
    history = history.filter(item => item.toLowerCase() !== cityName.toLowerCase());
    
    history.unshift(cityName);
    // Enforce size limit = 5
    if (history.length > 5) {
        history.pop();
    }

    state.weather.history = history;
    saveStateToStorage('nexus_weather_history', history);
    renderWeatherHistory();
}

function renderWeatherHistory() {
    const listContainer = document.getElementById('weatherHistoryList');
    if (!listContainer) return;

    if (state.weather.history.length === 0) {
        listContainer.innerHTML = '<li class="history-empty">No recent searches</li>';
        return;
    }

    listContainer.innerHTML = state.weather.history.map(city => `
        <li class="history-item" onclick="fetchWeatherData('${city}')">
            <span>${city}</span>
            <i class="fa-solid fa-chevron-right history-item-date"></i>
        </li>
    `).join('');
}

// ==========================================================================
// Movie Search App Component
// ==========================================================================

function setupMovieApp() {
    const form = document.getElementById('movieForm');
    const favToggleBtn = document.getElementById('favToggleBtn');
    const backToSearchBtn = document.getElementById('backToSearchBtn');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalOverlay = document.getElementById('movieDetailModal');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('movieInput');
            const typeFilter = document.getElementById('movieTypeFilter');
            if (!input) return;

            const query = input.value.trim();
            const type = typeFilter ? typeFilter.value : '';
            
            if (query) {
                // De-activate favorites view if searching
                state.movies.viewingFavorites = false;
                toggleFavoritesViewUI(false);
                await searchMovies(query, type);
            }
        });
    }

    if (favToggleBtn) {
        favToggleBtn.addEventListener('click', () => {
            state.movies.viewingFavorites = !state.movies.viewingFavorites;
            toggleFavoritesViewUI(state.movies.viewingFavorites);
            if (state.movies.viewingFavorites) {
                renderFavoritesList();
            } else {
                renderMoviesList(state.movies.searchResults);
            }
        });
    }

    if (backToSearchBtn) {
        backToSearchBtn.addEventListener('click', () => {
            state.movies.viewingFavorites = false;
            toggleFavoritesViewUI(false);
            renderMoviesList(state.movies.searchResults);
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
}

async function searchMovies(query, type = '') {
    const placeholder = document.getElementById('moviePlaceholder');
    const spinner = document.getElementById('moviesSpinner');
    const grid = document.getElementById('moviesGrid');

    if (placeholder) placeholder.classList.add('hidden');
    if (grid) grid.innerHTML = '';
    if (spinner) spinner.classList.remove('hidden');

    const apiKey = state.apiKeys.movie.trim();

    try {
        let movies = [];
        if (apiKey) {
            // Live OMDb API Fetch
            let url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;
            if (type) {
                url += `&type=${type}`;
            }
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`OMDb server error status: ${response.status}`);
            }

            const data = await response.json();
            if (data.Response === 'True') {
                movies = data.Search;
            } else {
                throw new Error(data.Error || 'No movies matching your criteria.');
            }
        } else {
            // Demo Mode: Mock movies database
            await simulateNetworkDelay(1000);
            movies = queryMockMovies(query, type);
        }

        // Cache search results in state
        state.movies.searchResults = movies;

        if (spinner) spinner.classList.add('hidden');
        renderMoviesList(movies);

    } catch (err) {
        console.error('Movies Fetch Error:', err);
        Toast.show(err.message, 'error');
        if (spinner) spinner.classList.add('hidden');
        if (placeholder) {
            document.getElementById('moviePlaceholderTitle').textContent = 'Search Failed';
            document.getElementById('moviePlaceholderDesc').textContent = err.message;
            placeholder.classList.remove('hidden');
        }
    }
}

function renderMoviesList(movies) {
    const grid = document.getElementById('moviesGrid');
    const placeholder = document.getElementById('moviePlaceholder');

    if (!grid) return;

    if (movies.length === 0) {
        grid.innerHTML = '';
        if (placeholder) {
            document.getElementById('moviePlaceholderTitle').textContent = 'No Titles Found';
            document.getElementById('moviePlaceholderDesc').textContent = 'Try adjusting your terms, filters, or setup API Keys for broader matching.';
            placeholder.classList.remove('hidden');
        }
        return;
    }

    if (placeholder) placeholder.classList.add('hidden');

    grid.innerHTML = movies.map(movie => {
        const isFav = isMovieFavorite(movie.imdbID);
        const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=350&auto=format&fit=crop';
        
        return `
            <div class="movie-card" data-id="${movie.imdbID}">
                <div class="movie-poster-wrapper">
                    <img src="${posterUrl}" alt="${movie.Title}" loading="lazy">
                    <button class="favorite-btn ${isFav ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('${movie.imdbID}')" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                        <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                    <span class="movie-badge-type">${movie.Type}</span>
                </div>
                <div class="movie-info-body">
                    <h4 class="movie-title" title="${movie.Title}">${movie.Title}</h4>
                    <div class="movie-meta">
                        <span class="movie-year">${movie.Year}</span>
                    </div>
                    <button class="btn btn-secondary btn-small" onclick="fetchMovieDetails('${movie.imdbID}')">View Details</button>
                </div>
            </div>
        `;
    }).join('');
}

function toggleFavoritesViewUI(viewingFavorites) {
    const toggleBtn = document.getElementById('favToggleBtn');
    const backToResults = document.getElementById('backToResultsContainer');
    
    if (viewingFavorites) {
        if (toggleBtn) {
            toggleBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> <span>Show Search</span>';
        }
        if (backToResults) backToResults.classList.remove('hidden');
    } else {
        if (toggleBtn) {
            toggleBtn.innerHTML = `<i class="fa-solid fa-heart"></i> <span>Show Favorites</span> <span class="favorites-count-badge" id="favBadge">${state.movies.favorites.length}</span>`;
        }
        if (backToResults) backToResults.classList.add('hidden');
    }
}

function renderFavoritesList() {
    renderMoviesList(state.movies.favorites);
    
    // Modify placeholder description specific to empty favorites
    if (state.movies.favorites.length === 0) {
        const placeholderTitle = document.getElementById('moviePlaceholderTitle');
        const placeholderDesc = document.getElementById('moviePlaceholderDesc');
        if (placeholderTitle && placeholderDesc) {
            placeholderTitle.textContent = 'Your Favorites is Empty';
            placeholderDesc.textContent = 'Explore film catalog and click the heart icon on any poster to build your custom library.';
        }
    }
}

function isMovieFavorite(imdbID) {
    return state.movies.favorites.some(m => m.imdbID === imdbID);
}

function toggleFavorite(imdbID) {
    const isFav = isMovieFavorite(imdbID);
    
    if (isFav) {
        // Remove favorite
        state.movies.favorites = state.movies.favorites.filter(m => m.imdbID !== imdbID);
        Toast.show('Removed from favorites', 'info');
    } else {
        // Add to favorite (locate reference in searches or mock list)
        let movieObj = state.movies.searchResults.find(m => m.imdbID === imdbID);
        if (!movieObj) {
            // Check in mock registry if search was cleared
            movieObj = getMockMovieById(imdbID);
        }
        
        if (movieObj) {
            state.movies.favorites.push(movieObj);
            Toast.show('Added to favorites', 'success');
        }
    }

    saveStateToStorage('nexus_movie_favorites', state.movies.favorites);
    updateFavoritesBadge();

    // Re-render appropriate view
    if (state.movies.viewingFavorites) {
        renderFavoritesList();
    } else {
        // Toggle the icon state dynamically in standard grid to avoid rebuilding DOM
        const cards = document.querySelectorAll(`.movie-card[data-id="${imdbID}"]`);
        cards.forEach(card => {
            const btn = card.querySelector('.favorite-btn');
            if (btn) {
                btn.classList.toggle('favorited');
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.className = isFav ? 'fa-regular fa-heart' : 'fa-solid fa-heart';
                }
            }
        });
    }
}

function updateFavoritesBadge() {
    const badge = document.getElementById('favBadge');
    if (badge) {
        badge.textContent = state.movies.favorites.length;
    }
}

async function fetchMovieDetails(imdbID) {
    const overlay = document.getElementById('movieDetailModal');
    const container = document.getElementById('modalDetailsBody');
    if (!overlay || !container) return;

    // Show loading skeleton in modal
    container.innerHTML = `
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-medium"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
    `;
    overlay.classList.remove('hidden');

    const apiKey = state.apiKeys.movie.trim();

    try {
        let details;
        if (apiKey) {
            // Live detailed fetch
            const url = `https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${apiKey}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Details fetch failed');
            details = await response.json();
        } else {
            // Mock detailed fetch
            await simulateNetworkDelay(400);
            details = getMockMovieDetailById(imdbID);
        }

        renderMovieDetailsModal(details);
    } catch (err) {
        console.error(err);
        Toast.show('Error retrieving movie information.', 'error');
        closeModal();
    }
}

function renderMovieDetailsModal(data) {
    const container = document.getElementById('modalDetailsBody');
    if (!container) return;

    const posterUrl = data.Poster !== 'N/A' ? data.Poster : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=350&auto=format&fit=crop';
    
    container.innerHTML = `
        <div class="modal-grid">
            <div class="modal-poster">
                <img src="${posterUrl}" alt="${data.Title}">
            </div>
            <div class="modal-content-details">
                <div class="modal-header-section">
                    <h2>${data.Title}</h2>
                    <div class="modal-quick-meta">
                        <span class="modal-badge">${data.Rated}</span>
                        <span>${data.Released}</span>
                        <span>•</span>
                        <span>${data.Runtime}</span>
                        <span>•</span>
                        <span>${data.Genre}</span>
                    </div>
                </div>

                <div class="modal-rating-row">
                    <i class="fa-solid fa-star"></i>
                    <span>IMDb Rating: ${data.imdbRating}/10</span>
                </div>

                <div class="modal-info-block">
                    <h3>Plot</h3>
                    <p>${data.Plot}</p>
                </div>

                <div class="modal-details-list">
                    <div class="modal-list-item">
                        <span class="modal-list-label">Director</span>
                        <span class="modal-list-val">${data.Director}</span>
                    </div>
                    <div class="modal-list-item">
                        <span class="modal-list-label">Writer</span>
                        <span class="modal-list-val">${data.Writer}</span>
                    </div>
                    <div class="modal-list-item">
                        <span class="modal-list-label">Actors</span>
                        <span class="modal-list-val">${data.Actors}</span>
                    </div>
                    <div class="modal-list-item">
                        <span class="modal-list-label">Awards</span>
                        <span class="modal-list-val">${data.Awards}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function closeModal() {
    const overlay = document.getElementById('movieDetailModal');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// --- Movie App Mocks Database ---
const MOCK_MOVIES = [
    { imdbID: 'mock1', Title: 'Interstellar', Year: '2014', Type: 'movie', Poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop' },
    { imdbID: 'mock2', Title: 'Inception', Year: '2010', Type: 'movie', Poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop' },
    { imdbID: 'mock3', Title: 'The Dark Knight', Year: '2008', Type: 'movie', Poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=400&auto=format&fit=crop' },
    { imdbID: 'mock4', Title: 'Stranger Things', Year: '2016–', Type: 'series', Poster: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=400&auto=format&fit=crop' },
    { imdbID: 'mock5', Title: 'Blade Runner 2049', Year: '2017', Type: 'movie', Poster: 'https://images.unsplash.com/photo-1542204172-e7052809f852?q=80&w=400&auto=format&fit=crop' },
    { imdbID: 'mock6', Title: 'Avatar: The Way of Water', Year: '2022', Type: 'movie', Poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop' },
    { imdbID: 'mock7', Title: 'Planet Earth II', Year: '2016', Type: 'series', Poster: 'https://images.unsplash.com/photo-1472214222541-d510753a4907?q=80&w=400&auto=format&fit=crop' },
    { imdbID: 'mock8', Title: 'Breaking Bad', Year: '2008–2013', Type: 'series', Poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400&auto=format&fit=crop' }
];

const MOCK_MOVIE_DETAILS = {
    mock1: {
        Title: 'Interstellar',
        Rated: 'PG-13',
        Released: '07 Nov 2014',
        Runtime: '169 min',
        Genre: 'Adventure, Drama, Sci-Fi',
        imdbRating: '8.7',
        Poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop',
        Plot: 'When Earth becomes uninhabitable, a team of explorers undertakes the most important mission in human history: traveling beyond this galaxy to discover whether mankind has a future among the stars.',
        Director: 'Christopher Nolan',
        Writer: 'Jonathan Nolan, Christopher Nolan',
        Actors: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
        Awards: 'Won 1 Oscar. 44 wins & 148 nominations total'
    },
    mock2: {
        Title: 'Inception',
        Rated: 'PG-13',
        Released: '16 Jul 2010',
        Runtime: '148 min',
        Genre: 'Action, Sci-Fi, Adventure',
        imdbRating: '8.8',
        Poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop',
        Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.',
        Director: 'Christopher Nolan',
        Writer: 'Christopher Nolan',
        Actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
        Awards: 'Won 4 Oscars. 159 wins & 220 nominations total'
    },
    mock3: {
        Title: 'The Dark Knight',
        Rated: 'PG-13',
        Released: '18 Jul 2008',
        Runtime: '152 min',
        Genre: 'Action, Crime, Drama',
        imdbRating: '9.0',
        Poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=400&auto=format&fit=crop',
        Plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        Director: 'Christopher Nolan',
        Writer: 'Jonathan Nolan, Christopher Nolan',
        Actors: 'Christian Bale, Heath Ledger, Aaron Eckhart',
        Awards: 'Won 2 Oscars. 163 wins & 160 nominations total'
    },
    mock4: {
        Title: 'Stranger Things',
        Rated: 'TV-14',
        Released: '15 Jul 2016',
        Runtime: '51 min',
        Genre: 'Drama, Fantasy, Horror',
        imdbRating: '8.7',
        Poster: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=400&auto=format&fit=crop',
        Plot: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
        Director: 'N/A',
        Writer: 'Matt Duffer, Ross Duffer',
        Actors: 'Millie Bobby Brown, Finn Wolfhard, Winona Ryder',
        Awards: 'Nominated for 4 Golden Globes. 104 wins & 270 nominations total'
    },
    mock5: {
        Title: 'Blade Runner 2049',
        Rated: 'R',
        Released: '06 Oct 2017',
        Runtime: '164 min',
        Genre: 'Action, Drama, Mystery',
        imdbRating: '8.0',
        Poster: 'https://images.unsplash.com/photo-1542204172-e7052809f852?q=80&w=400&auto=format&fit=crop',
        Plot: 'A new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what is left of society into chaos.',
        Director: 'Denis Villeneuve',
        Writer: 'Hampton Fancher, Michael Green',
        Actors: 'Ryan Gosling, Harrison Ford, Ana de Armas',
        Awards: 'Won 2 Oscars. 104 wins & 171 nominations total'
    },
    mock6: {
        Title: 'Avatar: The Way of Water',
        Rated: 'PG-13',
        Released: '16 Dec 2022',
        Runtime: '192 min',
        Genre: 'Action, Adventure, Fantasy',
        imdbRating: '7.6',
        Poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop',
        Plot: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
        Director: 'James Cameron',
        Writer: 'James Cameron, Rick Jaffa, Amanda Silver',
        Actors: 'Sam Worthington, Zoe Saldana, Sigourney Weaver',
        Awards: 'Won 1 Oscar. 71 wins & 140 nominations total'
    },
    mock7: {
        Title: 'Planet Earth II',
        Rated: 'TV-PG',
        Released: '18 Feb 2017',
        Runtime: '60 min',
        Genre: 'Documentary, Family',
        imdbRating: '9.5',
        Poster: 'https://images.unsplash.com/photo-1472214222541-d510753a4907?q=80&w=400&auto=format&fit=crop',
        Plot: 'David Attenborough returns with a new, high-definition natural history series, exploring the islands, mountains, jungles, deserts, grasslands, and cities of the world.',
        Director: 'N/A',
        Writer: 'N/A',
        Actors: 'David Attenborough',
        Awards: 'Won 2 BAFTA TV Awards. 20 wins & 22 nominations total'
    },
    mock8: {
        Title: 'Breaking Bad',
        Rated: 'TV-MA',
        Released: '20 Jan 2008',
        Runtime: '49 min',
        Genre: 'Crime, Drama, Thriller',
        imdbRating: '9.5',
        Poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400&auto=format&fit=crop',
        Plot: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family\'s future.',
        Director: 'N/A',
        Writer: 'Vince Gilligan',
        Actors: 'Bryan Cranston, Aaron Paul, Anna Gunn',
        Awards: 'Won 16 Primetime Emmys. 153 wins & 247 nominations total'
    }
};

function queryMockMovies(query, type) {
    const q = query.toLowerCase();
    return MOCK_MOVIES.filter(movie => {
        const matchesTitle = movie.Title.toLowerCase().includes(q);
        const matchesType = type ? movie.Type === type : true;
        return matchesTitle && matchesType;
    });
}

function getMockMovieById(imdbID) {
    return MOCK_MOVIES.find(m => m.imdbID === imdbID) || null;
}

function getMockMovieDetailById(imdbID) {
    return MOCK_MOVIE_DETAILS[imdbID] || {
        Title: 'Unknown Title',
        Rated: 'N/A',
        Released: 'Unknown',
        Runtime: 'N/A',
        Genre: 'N/A',
        imdbRating: 'N/A',
        Poster: 'N/A',
        Plot: 'Detailed description unavailable in Demo Mode. Add an OMDb API Key in settings to view live details.',
        Director: 'Unknown',
        Writer: 'Unknown',
        Actors: 'Unknown',
        Awards: 'None'
    };
}

// ==========================================================================
// Random Quote Generator Component
// ==========================================================================

function setupQuoteApp() {
    const newBtn = document.getElementById('newQuoteBtn');
    const copyBtn = document.getElementById('copyQuoteBtn');
    const tweetBtn = document.getElementById('tweetQuoteBtn');

    if (newBtn) {
        newBtn.addEventListener('click', () => fetchRandomQuote());
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', copyQuoteToClipboard);
    }

    if (tweetBtn) {
        tweetBtn.addEventListener('click', tweetQuote);
    }
}

async function fetchRandomQuote(silent = false) {
    const quoteContainer = document.getElementById('quoteContainer');
    const skeleton = document.getElementById('quoteSkeleton');
    const textContainer = document.getElementById('quoteTextContainer');
    const authorVal = document.getElementById('quoteAuthor');
    const tagVal = document.getElementById('quoteTag');

    if (!silent) {
        if (textContainer) textContainer.classList.add('hidden');
        if (authorVal) authorVal.classList.add('hidden');
        if (skeleton) skeleton.classList.remove('hidden');
    }

    try {
        let quoteData;
        // Quotable API random quote endpoint
        // Quotable API (api.quotable.io) is sometimes offline, so we handle it with a retry/local fallback
        const response = await fetch('https://api.quotable.io/random').catch(() => null);

        if (response && response.ok) {
            const data = await response.json();
            quoteData = {
                content: data.content,
                author: data.author,
                tag: data.tags ? data.tags[0] : 'Inspiration'
            };
        } else {
            // Fallback API if original is offline
            const backupResponse = await fetch('https://quotes-api-self.vercel.app/quote').catch(() => null);
            if (backupResponse && backupResponse.ok) {
                const data = await backupResponse.json();
                quoteData = {
                    content: data.quote,
                    author: data.author,
                    tag: 'Inspiration'
                };
            } else {
                // If all APIs fail, retrieve from our rich local collection
                quoteData = getFallbackQuote();
            }
        }

        state.quotes.current = quoteData;

        if (!silent) {
            // Render Quote details
            if (document.getElementById('quoteText')) {
                document.getElementById('quoteText').textContent = `"${quoteData.content}"`;
            }
            if (authorVal) authorVal.textContent = `- ${quoteData.author}`;
            if (tagVal) tagVal.textContent = quoteData.tag;

            if (skeleton) skeleton.classList.add('hidden');
            if (textContainer) textContainer.classList.remove('hidden');
            if (authorVal) authorVal.classList.remove('hidden');
        }

    } catch (err) {
        console.error(err);
        if (!silent) {
            Toast.show('Could not retrieve a new quote, using cached quotes.', 'warning');
            const quoteData = getFallbackQuote();
            state.quotes.current = quoteData;
            
            if (document.getElementById('quoteText')) {
                document.getElementById('quoteText').textContent = `"${quoteData.content}"`;
            }
            if (authorVal) authorVal.textContent = `- ${quoteData.author}`;
            if (tagVal) tagVal.textContent = quoteData.tag;
            
            if (skeleton) skeleton.classList.add('hidden');
            if (textContainer) textContainer.classList.remove('hidden');
            if (authorVal) authorVal.classList.remove('hidden');
        }
    }
}

function copyQuoteToClipboard() {
    const q = state.quotes.current;
    if (!q) return;

    const formatted = `"${q.content}" - ${q.author}`;
    navigator.clipboard.writeText(formatted).then(() => {
        Toast.show('Quote copied to clipboard', 'success');
    }).catch(err => {
        console.error(err);
        Toast.show('Failed to copy quote', 'error');
    });
}

function tweetQuote() {
    const q = state.quotes.current;
    if (!q) return;

    const tweetText = encodeURIComponent(`"${q.content}" - ${q.author} via #NexusHub`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    
    // Open in a small popup window for smooth UX
    window.open(twitterUrl, 'Share to Twitter', 'width=550,height=420');
}

// --- Local Fallback Quotes database ---
const FALLBACK_QUOTES = [
    { content: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", tag: "Encouragement" },
    { content: "We do not raise our expectations. We fall to the level of our training.", author: "Archilochus", tag: "Discipline" },
    { content: "It always seems impossible until it's done.", author: "Nelson Mandela", tag: "Inspiration" },
    { content: "Life is what happens when you're busy making other plans.", author: "John Lennon", tag: "Philosophy" },
    { content: "Quality is not an act, it is a habit.", author: "Aristotle", tag: "Excellence" },
    { content: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", tag: "Motivation" },
    { content: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", tag: "Identity" },
    { content: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", tag: "Design" },
    { content: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", tag: "Purpose" },
    { content: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House", tag: "Technology" }
];

function getFallbackQuote() {
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    return FALLBACK_QUOTES[randomIndex];
}

// ==========================================================================
// Settings Manager (API Keys)
// ==========================================================================

function setupSettingsApp() {
    const form = document.getElementById('settingsForm');
    const resetBtn = document.getElementById('resetSettingsBtn');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const weatherKey = document.getElementById('weatherApiKey').value.trim();
            const movieKey = document.getElementById('movieApiKey').value.trim();

            state.apiKeys.weather = weatherKey;
            state.apiKeys.movie = movieKey;

            saveStateToStorage('nexus_key_weather', weatherKey);
            saveStateToStorage('nexus_key_movie', movieKey);

            updateAPIStatusIndicators();
            Toast.show('Credentials updated successfully', 'success');
            
            // Redirect user to dashboard overview screen
            setTimeout(() => {
                switchTab('dashboard');
            }, 500);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.getElementById('weatherApiKey').value = '';
            document.getElementById('movieApiKey').value = '';

            state.apiKeys.weather = '';
            state.apiKeys.movie = '';

            localStorage.removeItem('nexus_key_weather');
            localStorage.removeItem('nexus_key_movie');

            updateAPIStatusIndicators();
            Toast.show('Saved keys cleared. NexusHub is back in Demo Mode.', 'warning');
        });
    }
}

// ==========================================================================
// General Helpers
// ==========================================================================

function simulateNetworkDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
