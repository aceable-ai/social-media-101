/**
 * Vibe Coding 101 — Interactive Features
 * Progress bar, section navigation, jargon tooltips, copy buttons, scroll animations
 */

(function () {
  'use strict';

  // ---- PROGRESS BAR ----
  function initProgressBar() {
    var fill = document.querySelector('.progress-bar__fill');
    var bar = document.getElementById('progress-bar');
    if (!fill || !bar) return;

    var ticking = false;

    function updateProgress() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      percent = Math.min(100, Math.max(0, percent));

      fill.style.width = percent + '%';
      bar.setAttribute('aria-valuenow', Math.round(percent));
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    updateProgress();
  }


  // ---- SIDEBAR NAVIGATION ----
  function initSidebar() {
    var sidebar = document.getElementById('sidebar');
    var toggle = document.getElementById('sidebar-toggle');
    var closeBtn = document.getElementById('sidebar-close');
    var overlay = document.getElementById('sidebar-overlay');
    var links = document.querySelectorAll('.sidebar__link');

    if (!sidebar || !toggle) return;

    function openSidebar() {
      sidebar.classList.add('open');
      toggle.classList.add('open');
      overlay.classList.add('visible');
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      toggle.classList.remove('open');
      overlay.classList.remove('visible');
      toggle.setAttribute('aria-expanded', 'false');
    }

    // Toggle button
    toggle.addEventListener('click', function () {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', closeSidebar);
    }

    // Overlay click closes
    if (overlay) {
      overlay.addEventListener('click', closeSidebar);
    }

    // Escape key closes
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    });

    // Link clicks: smooth scroll and close sidebar
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
          closeSidebar();
          setTimeout(function () {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
      });
    });

    // Track active section on scroll
    var sections = document.querySelectorAll('.section[id]');
    if (!sections.length) return;

    var linkMap = {};
    links.forEach(function (link) {
      var section = link.getAttribute('data-section');
      if (section) linkMap[section] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          var link = linkMap[entry.target.id];
          if (link) link.classList.add('active');
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }


  // ---- TYPEWRITER ANIMATION ----
  function initTypewriter() {
    var codeEl = document.getElementById('typewriter-code');
    var demoEl = document.getElementById('typewriter-demo');
    if (!codeEl || !demoEl) return;

    var hasPlayed = false;

    // The sequence of things to type/show
    var steps = [
      { type: 'cursor', ms: 1000 },
      { type: 'prompt', text: '~ $ ' },
      { type: 'type', text: 'echo "Hello, world!"', speed: 60 },
      { type: 'pause', ms: 400 },
      { type: 'newline' },
      { type: 'instant', text: 'Hello, world!', className: 'terminal__response' },
      { type: 'pause', ms: 600 },
      { type: 'newline' },
      { type: 'newline' },
      { type: 'instant', text: '# You typed a command. The computer responded. That\'s all this is.', className: 'terminal__comment' }
    ];

    function runSequence() {
      if (hasPlayed) return;
      hasPlayed = true;
      codeEl.innerHTML = '';

      var stepIndex = 0;

      function nextStep() {
        if (stepIndex >= steps.length) return;
        var step = steps[stepIndex];
        stepIndex++;

        if (step.type === 'cursor') {
          var cursor = document.createElement('span');
          cursor.className = 'typewriter-cursor';
          cursor.textContent = '\u2588';
          codeEl.appendChild(cursor);
          setTimeout(function () {
            codeEl.removeChild(cursor);
            nextStep();
          }, step.ms);

        } else if (step.type === 'prompt') {
          var span = document.createElement('span');
          span.className = 'terminal__prompt';
          span.textContent = step.text;
          codeEl.appendChild(span);
          nextStep();

        } else if (step.type === 'type') {
          var charIndex = 0;
          var cursor = document.createElement('span');
          cursor.className = 'typewriter-cursor';
          cursor.textContent = '\u2588';
          codeEl.appendChild(cursor);

          function typeChar() {
            if (charIndex < step.text.length) {
              cursor.insertAdjacentText('beforebegin', step.text[charIndex]);
              charIndex++;
              setTimeout(typeChar, step.speed + Math.random() * 40 - 20);
            } else {
              codeEl.removeChild(cursor);
              nextStep();
            }
          }
          typeChar();

        } else if (step.type === 'pause') {
          setTimeout(nextStep, step.ms);

        } else if (step.type === 'newline') {
          codeEl.appendChild(document.createTextNode('\n'));
          nextStep();

        } else if (step.type === 'instant') {
          var span = document.createElement('span');
          span.className = step.className || '';
          span.textContent = step.text;
          span.style.opacity = '0';
          span.style.transition = 'opacity 300ms ease';
          codeEl.appendChild(span);
          requestAnimationFrame(function () {
            span.style.opacity = '1';
          });
          setTimeout(nextStep, 350);
        }
      }

      nextStep();
    }

    // Trigger when scrolled into view
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasPlayed) {
          setTimeout(runSequence, 300);
          observer.unobserve(demoEl);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(demoEl);
  }


  // ---- DOWNLOAD JARGON CSV ----
  function initJargonDownload() {
    var btn = document.getElementById('download-jargon');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var items = document.querySelectorAll('.glossary-item');
      var rows = [['Term', 'Definition', 'In Context']];

      items.forEach(function (item) {
        var term = item.querySelector('.glossary-term');
        var def = item.querySelector('.glossary-definition');
        var ctx = item.querySelector('.glossary-context');

        function escapeCSV(str) {
          if (!str) return '';
          var text = str.textContent.trim();
          if (text.indexOf(',') !== -1 || text.indexOf('"') !== -1 || text.indexOf('\n') !== -1) {
            return '"' + text.replace(/"/g, '""') + '"';
          }
          return text;
        }

        rows.push([escapeCSV(term), escapeCSV(def), escapeCSV(ctx)]);
      });

      var csv = rows.map(function (r) { return r.join(','); }).join('\n');
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'jargon-decoder-cheat-sheet.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }


  // ---- COPY BUTTONS ----
  function initCopyButtons() {
    var copyButtons = document.querySelectorAll('.copy-btn');
    if (!copyButtons.length) return;

    copyButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var textToCopy = btn.getAttribute('data-copy');

        // If no data-copy, fall back to the sibling code element
        if (!textToCopy) {
          var codeBlock = btn.parentElement.querySelector('code');
          if (codeBlock) {
            textToCopy = codeBlock.textContent;
          }
        }

        if (!textToCopy) return;

        // Copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(function () {
            showCopied(btn);
          }).catch(function () {
            fallbackCopy(textToCopy, btn);
          });
        } else {
          fallbackCopy(textToCopy, btn);
        }
      });
    });

    function fallbackCopy(text, btn) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showCopied(btn);
      } catch (e) {
        // silently fail
      }
      document.body.removeChild(textarea);
    }

    function showCopied(btn) {
      var originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');

      setTimeout(function () {
        btn.textContent = originalText;
        btn.classList.remove('copied');
      }, 2000);
    }
  }


  // ---- SCROLL FADE-IN ANIMATIONS ----
  function initScrollAnimations() {
    var fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  }


  // ---- AUTO FADE-IN SETUP ----
  // Automatically add fade-in to key content elements
  function setupFadeTargets() {
    var selectors = [
      '.workflow',
      '.glossary-item',
      '.tip-card',
      '.card',
      '.comparison',
      '.callout',
      '.step'
    ];

    selectors.forEach(function (selector) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function (el, index) {
        el.classList.add('fade-in');
        // Stagger animations within groups
        var delayClass = 'fade-in-delay-' + ((index % 4) + 1);
        el.classList.add(delayClass);
      });
    });
  }


  // ---- INITIALIZE EVERYTHING ----
  document.addEventListener('DOMContentLoaded', function () {
    initProgressBar();
    initSidebar();
    initTypewriter();
    initJargonDownload();
    initCopyButtons();
    setupFadeTargets();
    initScrollAnimations();
  });

})();
