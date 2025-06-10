// Initialize AOS (Animate On Scroll)
AOS.init({
    once: true, // L'animation ne doit se produire qu'une seule fois - en défilant vers le bas
    duration: 800, // Valeurs de 0 à 3000, avec un pas de 50ms
});

// JavaScript pour le basculement du mode clair/sombre
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Fonction pour appliquer le thème
function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        body.classList.remove('dark');
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
    if (body.classList.contains('dark')) {
        applyTheme('light');
        localStorage.setItem('theme', 'light');
    } else {
        applyTheme('dark');
        localStorage.setItem('theme', 'dark');
    }
});

// JavaScript pour le basculement de la navigation mobile (menu hamburger)
const hamburgerButton = document.getElementById('hamburger-button');
const navLinks = document.querySelector('.nav-links'); // Sélectionner l'élément correct pour la navigation mobile
const headerNavLinks = document.querySelectorAll('header .nav-links a'); // Sélectionner tous les liens de navigation dans l'en-tête

hamburgerButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Fermer le menu mobile lorsqu'un lien est cliqué
headerNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// JavaScript pour la validation du formulaire de contact
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher la soumission du formulaire par défaut

    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    // Réinitialiser les messages d'erreur
    document.getElementById('name-error').classList.add('hidden');
    document.getElementById('email-error').classList.add('hidden');
    document.getElementById('subject-error').classList.add('hidden');
    document.getElementById('message-error').classList.add('hidden');
    formMessage.classList.add('hidden');

    // Valider le Nom
    if (name.value.trim() === '') {
        document.getElementById('name-error').classList.remove('hidden');
        isValid = false;
    }

    // Valider l'Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === '' || !emailPattern.test(email.value.trim())) {
        document.getElementById('email-error').classList.remove('hidden');
        isValid = false;
    }

    // Valider le Sujet
    if (subject.value.trim() === '') {
        document.getElementById('subject-error').classList.remove('hidden');
        isValid = false;
    }

    // Valider le Message
    if (message.value.trim() === '') {
        document.getElementById('message-error').classList.remove('hidden');
        isValid = false;
    }

    if (isValid) {
        // Dans un scénario réel, vous enverriez ces données à un serveur
        // Pour la démonstration, nous affichons simplement un message de succès
        formMessage.classList.remove('hidden', 'text-red-500');
        formMessage.classList.add('bg-green-100', 'text-green-700');
        formMessage.textContent = 'Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.';
        contactForm.reset(); // Effacer le formulaire
    } else {
        formMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
        formMessage.classList.add('bg-red-100', 'text-red-700');
        formMessage.textContent = 'Veuillez corriger les erreurs dans le formulaire.';
    }
});

// JavaScript pour l'accordéon FAQ
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const accordionItem = header.closest('.accordion-item');
        const accordionContent = header.nextElementSibling;
        const chevronIcon = header.querySelector('.fa-chevron-down');

        // Fermer tous les autres éléments
        document.querySelectorAll('.accordion-item').forEach(item => {
            if (item !== accordionItem) {
                item.classList.remove('active');
                item.querySelector('.accordion-content').style.maxHeight = '0';
                item.querySelector('.fa-chevron-down').style.transform = 'rotate(0deg)';
            }
        });

        // Toggle l'élément actuel
        const isActive = accordionItem.classList.contains('active');
        if (!isActive) {
            accordionItem.classList.add('active');
            accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            chevronIcon.style.transform = 'rotate(180deg)';
        } else {
            accordionItem.classList.remove('active');
            accordionContent.style.maxHeight = '0';
            chevronIcon.style.transform = 'rotate(0deg)';
        }
    });
});

// JavaScript pour l'effet d'en-tête collant (Sticky Header)
const mainHeader = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        mainHeader.classList.add('scrolled-header');
    } else {
        mainHeader.classList.remove('scrolled-header');
    }
});

// JavaScript pour le bouton "Retour en haut"
const backToTopButton = document.getElementById('back-to-top');

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


document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    AOS.init({ once: true, duration: 800 });
});
