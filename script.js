/* Victoria Cottage — interaction layer
   Header scroll state, mobile nav, and scroll-reveal animation. */

(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  var body = document.body;
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---- Header background on scroll ---- */
  var SCROLL_THRESHOLD = 40;

  function updateHeader() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---- Sync --header-h to the header's REAL rendered height ----
     The header's height can vary slightly by browser/font-loading state
     (e.g. a fallback font rendering taller before the web font loads),
     so the hero's height must be based on the actual measured header,
     not a hardcoded assumption, or a gap/overflow appears beneath it. */
  function syncHeaderHeight() {
    var h = header.getBoundingClientRect().height;
    if (h > 0) {
      document.documentElement.style.setProperty("--header-h", h + "px");
    }
  }

  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight);
  window.addEventListener("orientationchange", syncHeaderHeight);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncHeaderHeight);
  }
  window.addEventListener("load", syncHeaderHeight);

  /* ---- Mobile nav toggle ---- */
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- Gentle hero image scale-in on load ---- */
  var heroPhoto = document.querySelector(".hero-media .photo");
  if (heroPhoto && !prefersReducedMotion) {
    requestAnimationFrame(function () {
      heroPhoto.style.transform = "scale(1)";
    });
  }
})();
