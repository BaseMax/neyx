(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  function detectOS() {
    var ua = navigator.userAgent || "";
    var platform = navigator.platform || "";
    if (/Mac/i.test(platform) || /Macintosh/i.test(ua)) return "mac";
    if (/Win/i.test(platform) || /Windows/i.test(ua)) return "windows";
    if (/Linux/i.test(platform) && !/Android/i.test(ua)) return "linux";
    return null;
  }

  var osLabels = { mac: "macOS", linux: "Linux", windows: "Windows" };
  var detectedOS = detectOS();

  function applyOSDetection() {
    var osNameEl = document.getElementById("os-name");
    if (detectedOS && osNameEl) osNameEl.textContent = osLabels[detectedOS];

    if (detectedOS) {
      var card = document.querySelector('.download-card[data-os="' + detectedOS + '"]');
      if (card) {
        var badge = document.createElement("span");
        badge.className = "recommended-badge";
        badge.textContent = "Recommended for you";
        card.insertBefore(badge, card.firstChild);
        card.classList.add("is-recommended");
      }
    }
  }
  applyOSDetection();

  function resolveReleaseLinks() {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".download-card[data-target]"));
    if (!cards.length || typeof fetch !== "function") return;

    fetch("https://api.github.com/repos/BaseMax/neyx/releases/latest", {
      headers: { Accept: "application/vnd.github+json" }
    })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (release) {
        if (!release || !Array.isArray(release.assets)) return;

        cards.forEach(function (card) {
          var target = card.getAttribute("data-target");
          var ext = card.getAttribute("data-ext");
          var pattern = new RegExp("^neyx-v[\\w.]+-" + target + "\\." + ext.replace(".", "\\.") + "$");
          var asset = release.assets.find(function (a) { return pattern.test(a.name); });
          if (!asset) return;

          card.href = asset.browser_download_url;
          if (card.getAttribute("data-os") === detectedOS) {
            var heroDownload = document.getElementById("hero-download");
            if (heroDownload) heroDownload.href = asset.browser_download_url;
          }
        });
      })
      .catch(function () {});
  }
  resolveReleaseLinks();

  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var sections = ["features", "speed", "commands", "download"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));

  if (sections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  var revealTargets = document.querySelectorAll(".feature-card, .stat-card, .download-card, .speed-stats, .chart");
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  var speedSection = document.getElementById("speed");
  var chartAnimated = false;

  function animateCount(el, target, duration) {
    var start = 0;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  function runSpeedAnimation() {
    if (chartAnimated) return;
    chartAnimated = true;

    document.querySelectorAll(".chart-bar").forEach(function (bar) {
      var w = bar.getAttribute("data-width");
      requestAnimationFrame(function () { bar.style.width = w + "%"; });
    });

    document.querySelectorAll(".count").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      if (reduceMotion) el.textContent = target;
      else animateCount(el, target, 1200);
    });
  }

  if (speedSection) {
    if ("IntersectionObserver" in window) {
      var speedObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runSpeedAnimation();
              obs.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      speedObserver.observe(speedSection);
    } else {
      runSpeedAnimation();
    }
  }

  var terminalEl = document.getElementById("terminal-type");
  var terminalScript = [
    { text: "$ neyx new my-site\n", cls: "c-prompt" },
    { text: "Created project 'my-site':\n  my-site/neyx.config.yml\n  my-site/content/index.md\n  my-site/layouts/default.html\n  my-site/assets/favicon.ico\n\n", cls: "c-mut" },
    { text: "$ cd my-site && neyx dev\n", cls: "c-prompt" },
    { text: "Building... 1 page in 0.6ms\nServing on http://localhost:3000\nWatching for changes - Ctrl+C to stop", cls: "c-mut" }
  ];

  function typeTerminal() {
    if (!terminalEl) return;
    if (reduceMotion) {
      terminalScript.forEach(function (part) {
        var span = document.createElement("span");
        span.className = part.cls;
        span.textContent = part.text;
        terminalEl.appendChild(span);
      });
      return;
    }

    var partIndex = 0;
    var charIndex = 0;
    var currentSpan = null;

    function tick() {
      if (partIndex >= terminalScript.length) return;
      var part = terminalScript[partIndex];

      if (charIndex === 0) {
        currentSpan = document.createElement("span");
        currentSpan.className = part.cls;
        terminalEl.appendChild(currentSpan);
      }

      currentSpan.textContent += part.text[charIndex];
      charIndex++;

      var speed = part.cls === "c-prompt" ? 32 : 6;

      if (charIndex >= part.text.length) {
        partIndex++;
        charIndex = 0;
        setTimeout(tick, 220);
      } else {
        setTimeout(tick, speed);
      }
    }
    tick();
  }

  if (terminalEl && "IntersectionObserver" in window) {
    var started = false;
    var termObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !started) {
            started = true;
            typeTerminal();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    termObserver.observe(terminalEl);
  } else {
    typeTerminal();
  }

  var tabs = document.querySelectorAll(".cmd-tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-tab");

      tabs.forEach(function (t) {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });

      document.querySelectorAll(".cmd-panel").forEach(function (panel) {
        var match = panel.id === "cmd-panel-" + target;
        panel.classList.toggle("is-active", match);
        panel.hidden = !match;
      });
    });
  });

  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var block = btn.closest(".code-block");
      var codeEl = block ? block.querySelector("code") : null;
      if (!codeEl) return;

      var text = codeEl.textContent
        .split("\n")
        .filter(function (line) { return line.trim() !== ""; })
        .map(function (line) { return line.replace(/^\$\s?/, ""); })
        .join("\n");

      var restore = function () {
        btn.textContent = "Copy";
        btn.classList.remove("is-copied");
      };

      function fallbackCopy() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
      }

      var done = function () {
        btn.textContent = "Copied!";
        btn.classList.add("is-copied");
        setTimeout(restore, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          fallbackCopy();
          done();
        });
      } else {
        fallbackCopy();
        done();
      }
    });
  });
})();
