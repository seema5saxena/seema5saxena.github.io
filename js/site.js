// Better Wellness: reveal-on-scroll and header state. Loaded in <head> so the
// "motion" class is set before first paint; the page works fully without it.
(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canAnimate = !reduceMotion && 'IntersectionObserver' in window;

  if (canAnimate) {
    root.classList.add('motion');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.site-header');
    var updateHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (!canAnimate) {
      return;
    }

    // Ridges in the hero drift slightly with scroll, only while the hero is on screen
    var heroCard = document.querySelector('.hero-card');
    if (heroCard) {
      var ticking = false;
      var updateRidges = function () {
        ticking = false;
        var y = window.scrollY;
        if (y < heroCard.offsetHeight + 200) {
          heroCard.style.setProperty('--hero-scroll', y.toFixed(1));
        }
      };
      window.addEventListener('scroll', function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateRidges);
        }
      }, { passive: true });
    }

    var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    var observerRan = false;

    // Stagger siblings that reveal together (feature rows, review cards)
    items.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (child) {
        return child.hasAttribute('data-reveal');
      });
      el.style.setProperty('--i', siblings.indexOf(el));
    });

    var observer = new IntersectionObserver(function (entries) {
      observerRan = true;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
          var counter = entry.target.querySelector('[data-count]');
          if (counter) {
            countUp(counter);
          }
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) {
      observer.observe(el);
    });

    // Never leave content hidden if the observer fails to report
    setTimeout(function () {
      if (!observerRan) {
        root.classList.remove('motion');
      }
    }, 3000);
  });

  // Counts a number up to its real value once, easing out
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1400;
    var start = null;
    var step = function (time) {
      if (start === null) {
        start = time;
      }
      var progress = Math.min((time - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    el.textContent = '0';
    window.requestAnimationFrame(step);
  }
})();
