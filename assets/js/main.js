document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  var navLinks = document.querySelectorAll(".nav-links a");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll("main > [id]"));

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var setActive = function (id) {
      navLinks.forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
      });
    };

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  var revealTargets = document.querySelectorAll(
    "main .card, main .media-item, main .timeline-item, main .section-head"
  );

  if (revealTargets.length && "IntersectionObserver" in window) {
    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
    });

    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  var phaseHeroes = Array.prototype.slice.call(document.querySelectorAll(".phase-hero"));
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (phaseHeroes.length && !reduceMotion) {
    var ticking = false;

    var updatePhaseHeroes = function () {
      var vh = window.innerHeight;

      phaseHeroes.forEach(function (el) {
        var top = el.getBoundingClientRect().top;
        var opacity;

        if (top >= 0) {
          // Approaching from below: fade in as it slides up to the pin point.
          opacity = 1 - Math.min(Math.max(top / vh, 0), 1);
        } else {
          // Pinned, then fading out as its wrap scrolls past and the
          // chapter's normal content is about to take over.
          opacity = 1 - Math.min(Math.max(-top / (vh * 0.6), 0), 1);
        }

        el.style.opacity = opacity;
      });

      ticking = false;
    };

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updatePhaseHeroes);
          ticking = true;
        }
      },
      { passive: true }
    );

    window.addEventListener("resize", updatePhaseHeroes);
    updatePhaseHeroes();
  }
});
