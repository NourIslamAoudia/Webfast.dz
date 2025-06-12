/* ========================================
   INITIALIZATION & CONFIGURATION
======================================== */

// Initialize AOS (Animate On Scroll)
AOS.init({
    once: true,
    duration: 800,
});


/* ========================================
   GLOBAL VARIABLES
======================================== */

const bodyElement = document.body;


/* ========================================
   THEME MANAGEMENT (DARK/LIGHT MODE)
======================================== */

const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const Nos_Points_Forts = document.getElementById('Nos_Points_Forts');
const Services_Détaillés = document.getElementById('Services_Détaillés');
const Questions_Fréquemment_Posées = document.getElementById('Questions_Fréquemment_Posées');

// Appliquer le thème
function applyTheme(theme) {
    if (theme === 'dark') {
        bodyElement.classList.add('dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        bodyElement.classList.remove('dark');
        themeIcon.classList.replace('fa-sun', 'fa-moon');

        if (Nos_Points_Forts) Nos_Points_Forts.style.color = 'white';
        if (Services_Détaillés) Services_Détaillés.style.color = 'white';
        if (Questions_Fréquemment_Posées) Questions_Fréquemment_Posées.style.color = 'white';
    }
}
// Ajuster la vitesse de lecture de la vidéo
const video = document.getElementById('demo-video');
    if (video) {
        video.playbackRate = 1.8; // Vitesse x1.25
    }

// Appliquer le thème au chargement
const savedTheme = localStorage.getItem('theme');
if (savedTheme) applyTheme(savedTheme);
else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');
else applyTheme('light');

// Toggle theme on click
themeToggleBtn.addEventListener('click', () => {
    const isDark = bodyElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
});


/* ========================================
   MOBILE NAVIGATION PROFESSIONNELLE
======================================== */

const hamburgerButton = document.getElementById('hamburger-button');
const navLinks = document.querySelector('.nav-links');
const mobileOverlay = document.getElementById('mobile-overlay');
const headerNavLinks = document.querySelectorAll('header .nav-links a');

function openMobileMenu() {
    navLinks.classList.add('active');
    hamburgerButton.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    bodyElement.style.overflow = 'hidden';

    const icon = hamburgerButton.querySelector('i');
    if (icon) icon.classList.replace('fa-bars', 'fa-times');
}

function closeMobileMenu() {
    navLinks.classList.remove('active');
    hamburgerButton.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    bodyElement.style.overflow = '';

    const icon = hamburgerButton.querySelector('i');
    if (icon) icon.classList.replace('fa-times', 'fa-bars');
}

// Gestion des événements de menu
if (hamburgerButton && navLinks) {
    hamburgerButton.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
    });

    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

    navLinks.addEventListener('click', (e) => {
        const rect = navLinks.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        if (clickX > rect.width - 60 && clickY < 60) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    hamburgerButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburgerButton.click();
        }
    });
}

headerNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.getElementById(href.slice(1));
            if (targetElement) {
                if (navLinks.classList.contains('active')) {
                    closeMobileMenu();
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                } else {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });

    link.addEventListener('mouseenter', () => link.style.transform = 'translateY(-2px)');
    link.addEventListener('mouseleave', () => link.style.transform = 'translateY(0)');
});


// Scroll effect sur header
const header = document.querySelector('header') || document.querySelector('nav')?.parentElement;
let lastScrollTop = 0;

if (header) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        scrollTop > 100 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
        lastScrollTop = scrollTop;
    });
}


// Trap focus
function trapFocus(element) {
    const focusable = element.querySelectorAll('a[href], button, textarea, input, select');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!focusable.length) return;

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        }
    });
}

if (navLinks) {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            if (m.type === 'attributes' && m.attributeName === 'class') {
                if (navLinks.classList.contains('active')) {
                    trapFocus(navLinks);
                    setTimeout(() => {
                        const firstLink = navLinks.querySelector('a');
                        if (firstLink) firstLink.focus();
                    }, 100);
                }
            }
        });
    });
    observer.observe(navLinks, { attributes: true });
}


/* ========================================
   ORDER FORM VALIDATION
======================================== */

// script.js - Version corrigée
const orderForm = document.getElementById('order-form');
const formMessage = document.getElementById('form-message');

if (orderForm && formMessage) {
  orderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    const fields = {
      name: document.getElementById('name'),
      email: document.getElementById('email'),
      type: document.getElementById('type'),
      budget: document.getElementById('budget'),
      deadline: document.getElementById('deadline'),
      message: document.getElementById('message'),
    };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Masquer toutes les erreurs précédentes
    Object.keys(fields).forEach(key => {
      const errEl = document.getElementById(`${key}-error`);
      if (errEl) errEl.classList.add('hidden');
    });
    formMessage.classList.add('hidden');

    // Validation de chaque champ
    Object.entries(fields).forEach(([key, field]) => {
      const errEl = document.getElementById(`${key}-error`);
      const val = field.value.trim();
      if (!val || (key === 'email' && !emailPattern.test(val))) {
        if (errEl) errEl.classList.remove('hidden');
        isValid = false;
      }
    });

    if (!isValid) {
      formMessage.textContent = 'Veuillez remplir tous les champs requis correctement.';
      formMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
      formMessage.classList.add('bg-red-100', 'text-red-700');
      return;
    }

    // Afficher message de chargement
    formMessage.textContent = '⏳ Envoi en cours...';
    formMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
    formMessage.classList.add('bg-blue-100', 'text-blue-700');

    // Préparation du payload JSON
    const payload = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      type: fields.type.value,
      budget: fields.budget.value.trim(),
      deadline: fields.deadline.value.trim(),
      message: fields.message.value.trim(),
    };

    // Envoi via fetch
    fetch('https://webfast-dz.vercel.app/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(async response => {
      const contentType = response.headers.get('content-type');
      
      // Vérifier si la réponse est du JSON
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}`);
        }
        
        return data;
      } else {
        // Si ce n'est pas du JSON, lire comme texte pour debug
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Le serveur a retourné une réponse invalide');
      }
    })
    .then(result => {
      if (result.status === 'success') {
        // Succès
        formMessage.textContent = '✅ Demande envoyée avec succès ! Nous vous contacterons bientôt.';
        formMessage.classList.remove('bg-blue-100', 'text-blue-700', 'bg-red-100', 'text-red-700');
        formMessage.classList.add('bg-green-100', 'text-green-700');
        
        // Réinitialiser le formulaire
        orderForm.reset();
      } else {
        throw new Error(result.error || 'Une erreur inconnue est survenue');
      }
    })
    .catch(err => {
      console.error('Submission error:', err);
      
      // Message d'erreur utilisateur
      let errorMessage = '❌ Une erreur est survenue, veuillez réessayer plus tard.';
      
      if (err.message.includes('Failed to fetch')) {
        errorMessage = '❌ Problème de connexion. Vérifiez votre internet et réessayez.';
      } else if (err.message.includes('JSON')) {
        errorMessage = '❌ Erreur de configuration du serveur. Contactez le support.';
      }
      
      formMessage.textContent = errorMessage;
      formMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700', 'bg-blue-100', 'text-blue-700');
      formMessage.classList.add('bg-red-100', 'text-red-700');
    });
  });
}



/* ========================================
   FAQ ACCORDION FUNCTIONALITY
======================================== */

document.addEventListener('DOMContentLoaded', function () {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion-item');
            const content = header.nextElementSibling;
            const icon = header.querySelector('.fa-chevron-down');
            const isActive = item.classList.contains('active');

            accordionHeaders.forEach(h => {
                const other = h.closest('.accordion-item');
                const otherContent = h.nextElementSibling;
                const otherIcon = h.querySelector('.fa-chevron-down');
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                    if (otherContent) otherContent.style.maxHeight = '0';
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                }
            });

            if (!isActive && content) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                item.classList.remove('active');
                content.style.maxHeight = '0';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        });
    });
});


/* ========================================
   HEADER SCROLL EFFECTS
======================================== */

const mainHeader = document.getElementById('main-header');
if (mainHeader) {
    window.addEventListener('scroll', () => {
        mainHeader.classList.toggle('scrolled-header', window.scrollY > 0);
    });
}


/* ========================================
   BACK TO TOP BUTTON
======================================== */

const backToTopButton = document.getElementById('back-to-top');
if (backToTopButton) {
    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('hidden', window.scrollY < 300);
    });
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ========================================
   DOCUMENT READY INITIALIZATION
======================================== */

document.addEventListener('DOMContentLoaded', () => {
    const currentSavedTheme = localStorage.getItem('theme');
    if (currentSavedTheme) applyTheme(currentSavedTheme);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');
    else applyTheme('light');

    if (typeof AOS !== 'undefined') AOS.refresh();
});
