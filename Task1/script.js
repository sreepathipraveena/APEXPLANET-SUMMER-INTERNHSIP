document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. MOBILE MENU NAVIGATION
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 2. SCROLL HEADER EFFECT
    // ==========================================
    const header = document.querySelector('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    if (header) {
        window.addEventListener('scroll', handleScroll);
        // Run once on page load in case user is already scrolled down
        handleScroll();
    }

    // ==========================================
    // 3. INTERSECTION OBSERVER FOR SCROLL REVEAL
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ==========================================
    // 4. DESTINATION SEARCH & FILTERING
    // ==========================================
    const destSearch = document.getElementById('dest-search');
    const destRegion = document.getElementById('dest-region');
    const destGrid = document.querySelector('.destinations-grid');
    const destCards = document.querySelectorAll('.dest-card');
    const noResults = document.querySelector('.no-results');

    if (destCards.length > 0 && (destSearch || destRegion)) {
        const filterDestinations = () => {
            const searchValue = destSearch ? destSearch.value.toLowerCase().trim() : '';
            const regionValue = destRegion ? destRegion.value.toLowerCase() : '';
            let visibleCount = 0;

            destCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const region = card.getAttribute('data-region').toLowerCase();

                const matchesSearch = title.includes(searchValue) || description.includes(searchValue);
                const matchesRegion = regionValue === '' || region === regionValue;

                if (matchesSearch && matchesRegion) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (noResults) {
                if (visibleCount === 0) {
                    noResults.style.display = 'block';
                    if (destGrid) destGrid.style.display = 'none';
                } else {
                    noResults.style.display = 'none';
                    if (destGrid) destGrid.style.display = 'grid';
                }
            }
        };

        if (destSearch) destSearch.addEventListener('input', filterDestinations);
        if (destRegion) destRegion.addEventListener('change', filterDestinations);
    }

    // ==========================================
    // 5. PACKAGES TAB FILTERING (On packages.html)
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const pkgCards = document.querySelectorAll('.pkg-card');

    if (tabButtons.length > 0 && pkgCards.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from other buttons
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                pkgCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ==========================================
    // 6. BOOKING MODAL LOGIC
    // ==========================================
    const modal = document.getElementById('booking-modal');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const bookingForm = document.getElementById('booking-form');
    const successPopup = document.getElementById('success-popup');
    const modalTourSelect = document.getElementById('modal-tour');

    // Open Modal
    if (openModalBtns.length > 0 && modal) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Pre-select tour option if available in button attribute
                const selectedTour = btn.getAttribute('data-tour');
                if (selectedTour && modalTourSelect) {
                    modalTourSelect.value = selectedTour;
                }
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling background
            });
        });
    }

    // Close Modal helper
    const closeModal = () => {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    
    // Close on ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle Form Submissions & Show Success Toast
    const showSuccessToast = (message) => {
        if (successPopup) {
            const textSpan = successPopup.querySelector('span');
            if (textSpan) textSpan.textContent = message || "Operation successful!";
            
            successPopup.classList.add('active');
            
            setTimeout(() => {
                successPopup.classList.remove('active');
            }, 4000);
        }
    };

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Data (for internship submission simulation)
            const tour = document.getElementById('modal-tour').value;
            const name = document.getElementById('modal-name').value;
            const email = document.getElementById('modal-email').value;
            const date = document.getElementById('modal-date').value;
            const guests = document.getElementById('modal-guests').value;

            console.log("Booking Submitted:", { tour, name, email, date, guests });

            // Close Modal
            closeModal();
            
            // Show Success Notification
            showSuccessToast(`Booking request for ${tour} received! We will contact you soon.`);
            
            // Reset form
            bookingForm.reset();
        });
    }

    // ==========================================
    // 7. CONTACT FORM VALIDATION (On contact.html)
    // ==========================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const phoneInput = document.getElementById('contact-phone');
            const subjectInput = document.getElementById('contact-subject');
            const messageInput = document.getElementById('contact-message');
            
            let isValid = true;

            // Simple validation helper
            const validateField = (input, regex, errorId) => {
                const errorEl = document.getElementById(errorId);
                if (!input || !errorEl) return;

                const value = input.value.trim();
                const matches = regex.test(value);

                if (value === '' || !matches) {
                    errorEl.style.display = 'block';
                    input.style.borderColor = 'var(--error)';
                    isValid = false;
                } else {
                    errorEl.style.display = 'none';
                    input.style.borderColor = 'var(--light-accent)';
                }
            };

            // Regex patterns
            const textRegex = /^[a-zA-Z\s]{2,50}$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9\s\-\+\(\)]{8,20}$/;
            const notEmptyRegex = /[\s\S]+/;// At least one character

            validateField(nameInput, textRegex, 'error-name');
            validateField(emailInput, emailRegex, 'error-email');
            validateField(phoneInput, phoneRegex, 'error-phone');
            validateField(subjectInput, notEmptyRegex, 'error-subject');
            validateField(messageInput, notEmptyRegex, 'error-message');

            if (isValid) {
                console.log("Contact Form Submitted Successfully:", {
                    name: nameInput.value,
                    email: emailInput.value,
                    phone: phoneInput.value,
                    subject: subjectInput.value,
                    message: messageInput.value
                });

                // Clear input borders
                [nameInput, emailInput, phoneInput, subjectInput, messageInput].forEach(inp => {
                    if (inp) inp.style.borderColor = 'var(--light-accent)';
                });

                // Show Toast
                showSuccessToast("Message sent successfully! We'll reply within 24 hours.");
                
                // Reset Form
                contactForm.reset();
            }
        });
    }

    // ==========================================
    // 8. INNER PAGE SEARCH BAR REDIRECT
    // ==========================================
    const heroSearchForm = document.getElementById('hero-search-form');
    if (heroSearchForm) {
        heroSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const destination = document.getElementById('search-dest').value.trim();
            const type = document.getElementById('search-type').value;
            
            // Store search queries in sessionStorage to pass to destinations.html
            sessionStorage.setItem('search_dest', destination);
            sessionStorage.setItem('search_type', type);
            
            // Redirect to destinations page
            window.location.href = 'destinations.html';
        });
    }

    // Read stored searches if on destinations.html
    if (window.location.pathname.includes('destinations.html')) {
        const storedDest = sessionStorage.getItem('search_dest');
        const storedType = sessionStorage.getItem('search_type');

        if (storedDest && destSearch) {
            destSearch.value = storedDest;
            sessionStorage.removeItem('search_dest'); // clear
        }

        if (storedType && destRegion) {
            // Map category tags if matching (or regions)
            destRegion.value = storedType;
            sessionStorage.removeItem('search_type'); // clear
        }
        
        // Trigger filter if items loaded
        if (destCards.length > 0 && typeof filterDestinations === 'function') {
            filterDestinations();
        }
    }
});
