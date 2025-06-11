/* ========================================
   INITIALIZATION & CONFIGURATION
   ======================================== */

// Initialize AOS (Animate On Scroll)
AOS.init({
    once: true, // L'animation ne doit se produire qu'une seule fois - en défilant vers le bas
    duration: 800, // Valeurs de 0 à 3000, avec un pas de 50ms
});

/* ========================================
   GLOBAL VARIABLES
   ======================================== */

// Variables globales pour éviter les conflits
const bodyElement = document.body;

/* ========================================
   THEME MANAGEMENT (DARK/LIGHT MODE)
   ======================================== */

// JavaScript pour le basculement du mode clair/sombre
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Fonction pour appliquer le thème
function applyTheme(theme) {
    if (theme === 'dark') {
        bodyElement.classList.add('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        bodyElement.classList.remove('dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Vérifier la préférence de thème enregistrée au chargement de la page
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // S'il n'y a pas de thème enregistré, vérifier la préférence du système
    applyTheme('dark');
} else {
    // Par défaut, utiliser le thème clair
    applyTheme('light');
}

// Écouteur d'événements pour le bouton de bascule du thème
themeToggleBtn.addEventListener('click', () => {
    if (bodyElement.classList.contains('dark')) {
        applyTheme('light');
        localStorage.setItem('theme', 'light');
    } else {
        applyTheme('dark');
        localStorage.setItem('theme', 'dark');
    }
});

/* ========================================
    MOBILE NAVIGATION PROFESSIONNELLE
======================================== */

// Sélection des éléments DOM
const hamburgerButton = document.getElementById('hamburger-button');
const navLinks = document.querySelector('.nav-links');
const mobileOverlay = document.getElementById('mobile-overlay');
const headerNavLinks = document.querySelectorAll('header .nav-links a');

// Fonction pour ouvrir le menu mobile
function openMobileMenu() {
    navLinks.classList.add('active');
    hamburgerButton.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    bodyElement.style.overflow = 'hidden'; // Empêche le scroll du body
    
    // Change l'icône du hamburger
    const icon = hamburgerButton.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }
}

// Fonction pour fermer le menu mobile
function closeMobileMenu() {
    navLinks.classList.remove('active');
    hamburgerButton.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    bodyElement.style.overflow = ''; // Restore le scroll du body
    
    // Remet l'icône du hamburger
    const icon = hamburgerButton.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Vérifier que les éléments existent avant d'ajouter les event listeners
if (hamburgerButton && navLinks) {
    // Toggle du menu hamburger
    hamburgerButton.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (navLinks.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Fermer le menu en cliquant sur l'overlay
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Fermer le menu en cliquant sur le bouton de fermeture (::before)
    navLinks.addEventListener('click', (e) => {
        // Vérifier si le clic est sur la zone du bouton de fermeture
        const rect = navLinks.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Zone approximative du bouton de fermeture (top-right)
        if (clickX > rect.width - 60 && clickY < 60) {
            closeMobileMenu();
        }
    });

    // Fermer le menu avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Fermer le menu lors du redimensionnement vers desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Amélioration de l'accessibilité
    hamburgerButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburgerButton.click();
        }
    });
}

// Fermer le menu mobile lorsqu'un lien est cliqué
headerNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});

// Smooth scroll pour les liens d'ancrage
headerNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Vérifier si c'est un lien d'ancrage
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Fermer le menu mobile d'abord
                if (navLinks && navLinks.classList.contains('active')) {
                    closeMobileMenu();
                    
                    // Attendre que l'animation de fermeture soit terminée
                    setTimeout(() => {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300);
                } else {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
    });
});

// Animation des liens au survol (effet de vague)
headerNavLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Détection du scroll pour modifier l'apparence de la navigation
let lastScrollTop = 0;
const header = document.querySelector('header') || document.querySelector('nav')?.parentElement;

if (header) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Ajouter une classe pour le background blur quand on scroll
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Focus trap pour le menu mobile
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    if (focusableElements.length === 0) return;
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Appliquer le focus trap quand le menu est ouvert
if (navLinks) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (navLinks.classList.contains('active')) {
                    trapFocus(navLinks);
                    // Focus sur le premier lien
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
   CONTACT FORM VALIDATION
   ======================================== */

// JavaScript pour la validation du formulaire de contact
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm && formMessage) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher la soumission du formulaire par défaut

        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        // Réinitialiser les messages d'erreur
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const subjectError = document.getElementById('subject-error');
        const messageError = document.getElementById('message-error');

        if (nameError) nameError.classList.add('hidden');
        if (emailError) emailError.classList.add('hidden');
        if (subjectError) subjectError.classList.add('hidden');
        if (messageError) messageError.classList.add('hidden');
        formMessage.classList.add('hidden');

        // Valider le Nom
        if (name && name.value.trim() === '') {
            if (nameError) nameError.classList.remove('hidden');
            isValid = false;
        }

        // Valider l'Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && (email.value.trim() === '' || !emailPattern.test(email.value.trim()))) {
            if (emailError) emailError.classList.remove('hidden');
            isValid = false;
        }

        // Valider le Sujet
        if (subject && subject.value.trim() === '') {
            if (subjectError) subjectError.classList.remove('hidden');
            isValid = false;
        }

        // Valider le Message
        if (message && message.value.trim() === '') {
            if (messageError) messageError.classList.remove('hidden');
            isValid = false;
        }

        if (isValid) {
            // Dans un scénario réel, vous enverriez ces données à un serveur
            // Pour la démonstration, nous affichons simplement un message de succès
            formMessage.classList.remove('hidden', 'text-red-500', 'bg-red-100', 'text-red-700');
            formMessage.classList.add('bg-green-100', 'text-green-700');
            formMessage.textContent = 'Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.';
            contactForm.reset(); // Effacer le formulaire
        } else {
            formMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
            formMessage.classList.add('bg-red-100', 'text-red-700');
            formMessage.textContent = 'Veuillez corriger les erreurs dans le formulaire.';
        }
    });
}

/* ========================================
   FAQ ACCORDION FUNCTIONALITY
   ======================================== */

// JavaScript pour l'accordéon FAQ
document.addEventListener('DOMContentLoaded', function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.closest('.accordion-item');
            const accordionContent = header.nextElementSibling;
            const chevronIcon = header.querySelector('.fa-chevron-down');
            const isActive = accordionItem.classList.contains('active');

            // Fermer tous les autres accordéons ouverts
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    const otherItem = otherHeader.closest('.accordion-item');
                    const otherContent = otherHeader.nextElementSibling;
                    const otherChevron = otherHeader.querySelector('.fa-chevron-down');
                    
                    if (otherItem && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        if (otherContent) otherContent.style.maxHeight = '0';
                        if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
                    }
                }
            });

            // Basculer l'accordéon actuel
            if (!isActive && accordionItem && accordionContent) {
                // Ouvrir
                accordionItem.classList.add('active');
                
                // Calculer la hauteur réelle
                accordionContent.style.maxHeight = 'none';
                const fullHeight = accordionContent.scrollHeight;
                accordionContent.style.maxHeight = '0';
                
                // Forcer le reflow et appliquer la hauteur
                requestAnimationFrame(() => {
                    accordionContent.style.maxHeight = fullHeight + 'px';
                });
                
                if (chevronIcon) chevronIcon.style.transform = 'rotate(180deg)';
            } else if (isActive && accordionItem && accordionContent) {
                // Fermer
                accordionItem.classList.remove('active');
                accordionContent.style.maxHeight = '0';
                if (chevronIcon) chevronIcon.style.transform = 'rotate(0deg)';
            }
        });
    });
});

/* ========================================
   HEADER SCROLL EFFECTS
   ======================================== */

// JavaScript pour l'effet d'en-tête collant (Sticky Header)
const mainHeader = document.getElementById('main-header');
if (mainHeader) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            mainHeader.classList.add('scrolled-header');
        } else {
            mainHeader.classList.remove('scrolled-header');
        }
    });
}

/* ========================================
   BACK TO TOP BUTTON
   ======================================== */

// JavaScript pour le bouton "Retour en haut"
const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Afficher le bouton après avoir défilé de 300px
            backToTopButton.classList.remove('hidden');
        } else {
            backToTopButton.classList.add('hidden');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ========================================
   DOCUMENT READY INITIALIZATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Réappliquer les thèmes au chargement complet de la page
    const currentSavedTheme = localStorage.getItem('theme');
    if (currentSavedTheme) {
        applyTheme(currentSavedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    // Réinitialiser AOS si nécessaire
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
});