// Navbar background change on scroll
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// Smooth scroll for all internal links (navbar + footer)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: "smooth",
      });
      // If mobile nav is open, close it after clicking an anchor
      const mobileNav = document.getElementById("navLinks");
      const hamburger = document.getElementById("hamburger");
      if (mobileNav && mobileNav.classList.contains("show")) {
        mobileNav.classList.remove("show");
        if (hamburger) {
          const spans = hamburger.querySelectorAll("span");
          spans[0].style.transform = "";
          spans[1].style.opacity = "1";
          spans[2].style.transform = "";
        }
      }
    }
  });
});

// Highlight navbar link on scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

// Create single movable pill indicator behind nav links
const navContainer = document.querySelector(".nav-links");
let navPill = document.querySelector(".nav-underline");
if (navContainer && !navPill) {
  navPill = document.createElement("div");
  navPill.className = "nav-underline";
  navContainer.insertBefore(navPill, navContainer.firstChild);
}

function positionNavPill(targetLink) {
  if (!navPill || !targetLink) return;
  const containerRect = navContainer.getBoundingClientRect();
  const linkRect = targetLink.getBoundingClientRect();
  const offsetX = linkRect.left - containerRect.left + 4; // small inset
  const width = Math.max(linkRect.width - 8, 36);
  // use translate3d for GPU-accelerated smooth movement
  navPill.style.width = width + "px";
  navPill.style.transform = `translate3d(${offsetX}px, -50%, 0)`;
}

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
      positionNavPill(link);
    }
  });
});

// Initialize pill position on load and reposition on resize
window.addEventListener("load", () => {
  const active = document.querySelector(".nav-links a.active");
  if (active) positionNavPill(active);
});
window.addEventListener("resize", () => {
  const active = document.querySelector(".nav-links a.active");
  if (active) positionNavPill(active);
});

// Move pill on click without creating new boxes
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    // allow default smooth-scroll logic above to run
    document
      .querySelectorAll(".nav-links a")
      .forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    positionNavPill(link);
  });
});

// Reveal animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

// Scroll-to-top button
const scrollBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 400 ? "block" : "none";
});
scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Set current year in footer

document.getElementById("year").textContent = new Date().getFullYear();

// ===== CONTACT FORM AJAX SUBMISSION & MODAL POPUP =====
const contactForm = document.querySelector(".contact-form form");
const contactModal = document.getElementById("contactModal");
const modalMessage = document.getElementById("modalMessage");
const closeModal = document.getElementById("closeModal");
const loadingSpinner = document.getElementById("loadingSpinner");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(contactForm);
    // Show loading spinner
    if (loadingSpinner) loadingSpinner.style.display = "flex";
    fetch("contact.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (loadingSpinner) loadingSpinner.style.display = "none";
        modalMessage.textContent = data.message;
        contactModal.style.display = "flex";
        if (data.success) contactForm.reset();
      })
      .catch(() => {
        if (loadingSpinner) loadingSpinner.style.display = "none";
        modalMessage.textContent =
          "Sorry, something went wrong. Please try again.";
        contactModal.style.display = "flex";
      });
  });
}

if (closeModal) {
  closeModal.onclick = function () {
    contactModal.style.display = "none";
  };
}

window.onclick = function (event) {
  if (event.target === contactModal) {
    contactModal.style.display = "none";
  }
  if (event.target === loadingSpinner) {
    loadingSpinner.style.display = "none";
  }
};

// Mobile hamburger toggle
const hamburgerBtn = document.getElementById("hamburger");
const navLinksEl = document.getElementById("navLinks");
if (hamburgerBtn && navLinksEl) {
  hamburgerBtn.addEventListener("click", () => {
    const open = navLinksEl.classList.toggle("show");
    // animate hamburger to X
    const spans = hamburgerBtn.querySelectorAll("span");
    if (open) {
      spans[0].style.transform = "translateY(8px) rotate(45deg)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "translateY(-8px) rotate(-45deg)";
    } else {
      spans[0].style.transform = "";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "";
    }
  });
  // close when a link is clicked
  navLinksEl.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinksEl.classList.remove("show");
      const spans = hamburgerBtn.querySelectorAll("span");
      spans[0].style.transform = "";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "";
    })
  );
}
