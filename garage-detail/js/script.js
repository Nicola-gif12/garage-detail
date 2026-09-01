const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const menuLinks = menu.querySelectorAll("a");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  menu.classList.remove("is-open");
  header.classList.remove("is-menu-open");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closeMenu();
    return;
  }

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Fechar menu");
  menu.classList.add("is-open");
  header.classList.add("is-menu-open");
  document.body.classList.add("menu-open");
}

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
}

menuToggle.addEventListener("click", toggleMenu);
menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    closeMenu();
  }
});

updateHeader();

/* ── Gallery filters ──────────────────────────────── */

const filterButtons = document.querySelectorAll("[data-filter]");
const galleryItems = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const activeFilter = button.getAttribute("data-filter");

    filterButtons.forEach((currentButton) => {
      const isActive = currentButton === button;
      currentButton.classList.toggle("is-active", isActive);
      currentButton.setAttribute("aria-pressed", String(isActive));
    });

    galleryItems.forEach((item) => {
      const category = item.getAttribute("data-category");
      item.hidden = activeFilter !== "all" && category !== activeFilter;
    });
  });
});

/* ── Lightbox ─────────────────────────────────────── */

const lightbox = document.querySelector("[data-lightbox]");
const lightboxImg = lightbox.querySelector(".lightbox-img");
const lightboxClose = lightbox.querySelector(".lightbox-close");
let lastFocusedElement = null;

function openLightbox(src, alt) {
  lastFocusedElement = document.activeElement;
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.hidden = false;
  requestAnimationFrame(() => {
    lightbox.classList.add("is-open");
  });
  document.body.classList.add("lightbox-open");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  document.body.classList.remove("lightbox-open");

  setTimeout(() => {
    lightbox.hidden = true;
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }, 300);
}

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const src = item.getAttribute("data-src");
    const alt = item.getAttribute("data-alt");
    openLightbox(src, alt);
  });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  const isLightboxOpen = lightbox.classList.contains("is-open");
  const isMenuOpen = menuToggle.getAttribute("aria-expanded") === "true";

  if (event.key === "Tab" && isLightboxOpen) {
    event.preventDefault();
    lightboxClose.focus();
  }

  if (event.key === "Escape" && isLightboxOpen) {
    closeLightbox();
    return;
  }

  if (event.key === "Escape" && isMenuOpen) {
    closeMenu();
    menuToggle.focus();
  }
});

/* ── Scroll Reveal ─────────────────────────────────── */

const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -48px 0px",
    }
  );

  document.documentElement.classList.add("reveal-enabled");
  requestAnimationFrame(() => {
    revealElements.forEach((element) => observer.observe(element));
  });
}
