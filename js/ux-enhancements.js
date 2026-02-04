/* ========================================
   MODERN UX ENHANCEMENTS - WebFast DZ
   Améliorations JavaScript pour l'expérience utilisateur
   ======================================== */

// ========================================
// LAZY LOADING POUR LES IMAGES
// ========================================
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add("fade-in");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
});

// ========================================
// SMOOTH SCROLL AMÉLIORÉ
// ========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;

    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ========================================
// HEADER SCROLL EFFECT AMÉLIORÉ
// ========================================
let lastScroll = 0;
const header = document.getElementById("main-header");

window.addEventListener(
  "scroll",
  () => {
    const currentScroll = window.pageYOffset;

    // Ajouter l'ombre au scroll
    if (currentScroll > 0) {
      header?.classList.add("scrolled-header");
    } else {
      header?.classList.remove("scrolled-header");
    }

    // Cacher/montrer le header en fonction du scroll
    if (currentScroll > lastScroll && currentScroll > 500) {
      header?.classList.add("-translate-y-full");
    } else {
      header?.classList.remove("-translate-y-full");
    }

    lastScroll = currentScroll;
  },
  { passive: true },
);

// ========================================
// PARALLAX EFFECT POUR LE HERO
// ========================================
window.addEventListener(
  "scroll",
  () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll("[data-parallax]");

    parallaxElements.forEach((el) => {
      const speed = el.dataset.parallax || 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  },
  { passive: true },
);

// ========================================
// ANIMATION AU SCROLL POUR LES SECTIONS
// ========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      sectionObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll("section").forEach((section) => {
  section.classList.add("fade-on-scroll");
  sectionObserver.observe(section);
});

// ========================================
// AMÉLIORATION DU BOUTON BACK TO TOP
// ========================================
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener(
  "scroll",
  () => {
    if (window.pageYOffset > 300) {
      backToTopBtn?.classList.remove("hidden");
      backToTopBtn?.classList.add("animate-fade-in-up");
    } else {
      backToTopBtn?.classList.add("hidden");
      backToTopBtn?.classList.remove("animate-fade-in-up");
    }
  },
  { passive: true },
);

// ========================================
// PRÉCHARGEMENT DES IMAGES CRITIQUES
// ========================================
function preloadImages() {
  const criticalImages = [
    "images/static.jpg",
    "images/cms.jpg",
    "images/Search-Engine-Optimization.jpg",
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  });
}

// ========================================
// DÉTECTION DE LA VITESSE DE CONNEXION
// ========================================
function optimizeForConnection() {
  if ("connection" in navigator) {
    const connection = navigator.connection;

    // Si connexion lente, réduire les animations
    if (
      connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g"
    ) {
      document.body.classList.add("reduced-motion");
      console.log("Mode économie de données activé");
    }
  }
}

// ========================================
// AMÉLIORATION DES FORMULAIRES
// ========================================
function enhanceForms() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    // Validation en temps réel
    const inputs = form.querySelectorAll("input, textarea, select");

    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        if (this.value.trim() && this.checkValidity()) {
          this.classList.add("is-valid");
          this.classList.remove("is-invalid");
        } else if (this.value.trim()) {
          this.classList.add("is-invalid");
          this.classList.remove("is-valid");
        }
      });

      input.addEventListener("input", function () {
        this.classList.remove("is-invalid", "is-valid");
      });
    });
  });
}

// ========================================
// COPY TO CLIPBOARD POUR EMAIL/PHONE
// ========================================
function setupCopyToClipboard() {
  const copyElements = document.querySelectorAll("[data-copy]");

  copyElements.forEach((el) => {
    el.style.cursor = "pointer";
    el.addEventListener("click", async function () {
      const text = this.dataset.copy || this.textContent;

      try {
        await navigator.clipboard.writeText(text);

        // Feedback visuel
        const originalText = this.textContent;
        this.textContent = "✓ Copié !";
        setTimeout(() => {
          this.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error("Erreur de copie:", err);
      }
    });
  });
}

// ========================================
// PERFORMANCE MONITORING
// ========================================
function monitorPerformance() {
  if ("performance" in window) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType("navigation")[0];

        if (perfData) {
          console.log("📊 Performance du site:");
          console.log(
            `⏱️ Temps de chargement: ${perfData.loadEventEnd - perfData.fetchStart}ms`,
          );
          console.log(
            `🎨 DOM chargé: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
          );
        }
      }, 0);
    });
  }
}

// ========================================
// EASTER EGG - KONAMI CODE
// ========================================
let konamiCode = [];
const konamiPattern = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join(",") === konamiPattern.join(",")) {
    activateEasterEgg();
  }
});

function activateEasterEgg() {
  document.body.style.animation = "rainbow 2s infinite";
  setTimeout(() => {
    document.body.style.animation = "";
  }, 5000);
}

// ========================================
// INITIALISATION
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  preloadImages();
  optimizeForConnection();
  enhanceForms();
  setupCopyToClipboard();
  monitorPerformance();

  console.log("🚀 Améliorations UX chargées avec succès !");
});

// ========================================
// GESTION DES ERREURS GLOBALES
// ========================================
window.addEventListener("error", (e) => {
  console.error("Erreur détectée:", e.error);
});

// ========================================
// CSS POUR LES ANIMATIONS
// ========================================
const style = document.createElement("style");
style.textContent = `
    .fade-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-on-scroll.is-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .is-valid {
        border-color: #10b981 !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
    }
    
    .is-invalid {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .reduced-motion * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
    
    @keyframes rainbow {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(360deg); }
    }
    
    header {
        transition: transform 0.3s ease;
    }
    
    header.-translate-y-full {
        transform: translateY(-100%);
    }
`;
document.head.appendChild(style);
