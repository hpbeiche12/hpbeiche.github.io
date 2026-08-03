/* B&K Consulting LLC — interactivity */
(function () {
  "use strict";

  // --- Mobile nav toggle ---
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  // --- Reveal on scroll ---
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }

  // --- Animated stat counters ---
  const stats = document.querySelectorAll(".stat__num[data-count]");
  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (stats.length && "IntersectionObserver" in window) {
    const statIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    stats.forEach(function (el) {
      statIO.observe(el);
    });
  }

  // --- Contact form (front-end only) ---
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      if (!name || !email || !message) {
        showNote("Please complete all required fields.", false);
        return;
      }
      const topic = encodeURIComponent(form.topic.value);
      const body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\n\n" + message
      );
      // Opens the visitor's email client pre-filled to B&K Consulting.
      window.location.href =
        "mailto:contact@bk-consulting.us?subject=" +
        topic +
        "%20inquiry&body=" +
        body;
      showNote("Opening your email client… thank you for reaching out!", true);
      form.reset();
    });
  }
  function showNote(msg, ok) {
    if (!note) return;
    note.textContent = msg;
    note.hidden = false;
    note.style.color = ok ? "var(--accent-3)" : "#ff7a90";
  }

  // --- Current year in footer ---
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
})();
