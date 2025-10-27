/**
 * Persist.Live Landing Page JavaScript
 * Handles: Dark mode, mobile menu, FAQ accordion, form submissions
 */

// ========================================
// Configuration
// ========================================
const CONFIG = {
    // Replace with your actual Supabase project URL
    SUPABASE_URL: 'https://sgndlkjpbuqcgskhygrq.supabase.co',
    EDGE_FUNCTIONS: {
        waitlist: '/functions/v1/join-waitlist',
        contact: '/functions/v1/submit-contact'
    }
};

// ========================================
// Dark Mode Toggle
// ========================================
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Get saved theme or use system preference
    const savedTheme = localStorage.getItem('theme') ||
                      (prefersDark.matches ? 'dark' : 'light');

    // Apply theme
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Toggle handler
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// ========================================
// Mobile Menu Toggle
// ========================================
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
}

// ========================================
// FAQ Accordion
// ========================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ========================================
// Form Utilities
// ========================================
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showMessage(formElement, message, type) {
    const messageDiv = formElement.querySelector('.form-message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';

        // Hide message after 5 seconds for success
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// ========================================
// Waitlist Form Submission
// ========================================
function initWaitlistForm() {
    const form = document.getElementById('waitlistForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const email = form.querySelector('#waitlist-email').value.trim();
        const name = form.querySelector('#waitlist-name').value.trim();
        const profession = form.querySelector('#waitlist-profession').value;
        const notifyIos = form.querySelector('input[name="notify_ios"]').checked;
        const interestedAndroid = form.querySelector('input[name="interested_android"]').checked;

        // Validation
        if (!email) {
            showMessage(form, 'Please enter your email address.', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showMessage(form, 'Please enter a valid email address.', 'error');
            return;
        }

        // Set loading state
        setButtonLoading(submitButton, true);

        try {
            const response = await fetch(`${CONFIG.SUPABASE_URL}${CONFIG.EDGE_FUNCTIONS.waitlist}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    name: name || null,
                    profession: profession || null,
                    notify_ios: notifyIos,
                    interested_android: interestedAndroid
                })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(form, data.message || 'Successfully joined the waitlist! 🎉', 'success');
                form.reset();

                // Track conversion in Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'join_waitlist', {
                        'event_category': 'engagement',
                        'event_label': 'waitlist_signup'
                    });
                }
            } else {
                showMessage(form, data.error || 'Failed to join waitlist. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Waitlist submission error:', error);
            showMessage(form, 'Network error. Please check your connection and try again.', 'error');
        } finally {
            setButtonLoading(submitButton, false);
        }
    });
}

// ========================================
// Contact Form Submission
// ========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const name = form.querySelector('#contact-name').value.trim();
        const email = form.querySelector('#contact-email').value.trim();
        const message = form.querySelector('#contact-message').value.trim();

        // Validation
        if (!name || name.length < 2) {
            showMessage(form, 'Please enter your name (minimum 2 characters).', 'error');
            return;
        }

        if (!email || !validateEmail(email)) {
            showMessage(form, 'Please enter a valid email address.', 'error');
            return;
        }

        if (!message || message.length < 10) {
            showMessage(form, 'Please enter a message (minimum 10 characters).', 'error');
            return;
        }

        // Set loading state
        setButtonLoading(submitButton, true);

        try {
            const response = await fetch(`${CONFIG.SUPABASE_URL}${CONFIG.EDGE_FUNCTIONS.contact}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    message
                })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(form, data.message || 'Message sent successfully! We\'ll get back to you soon. 📧', 'success');
                form.reset();

                // Track in Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form', {
                        'event_category': 'engagement',
                        'event_label': 'contact_submission'
                    });
                }
            } else {
                showMessage(form, data.error || 'Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Contact submission error:', error);
            showMessage(form, 'Network error. Please check your connection and try again.', 'error');
        } finally {
            setButtonLoading(submitButton, false);
        }
    });
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// Initialize All Features
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initMobileMenu();
    initFAQ();
    initWaitlistForm();
    initContactForm();
    initSmoothScroll();

    // Log initialization (remove in production)
    console.log('Persist.Live landing page initialized ✅');
});

// ========================================
// Performance: Preload Critical Resources
// ========================================
if ('connection' in navigator && navigator.connection.effectiveType !== 'slow-2g') {
    // Preload fonts or images here if needed
}
