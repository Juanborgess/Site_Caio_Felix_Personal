(function () {
  const once = true; // Set to true to animate only once

  if (!window.__inViewIO) {
    window.__inViewIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          if (once) window.__inViewIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
  }

  window.initInViewAnimations = function (selector = ".animate-on-scroll") {
    document.querySelectorAll(selector).forEach((el) => {
      window.__inViewIO.observe(el); 
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    initInViewAnimations();
    if (typeof window.initPagination === 'function') {
      window.initPagination();
    }
  });

  // --- Pagination & Slider Logic ---
  window.initPagination = function() {
    const slider = document.getElementById('slider');
    const slides = document.querySelectorAll('.slide-container');
    const dotsContainer = document.getElementById('pagination-dots');
    if (!slider || slides.length === 0 || !dotsContainer) return;

    const dots = dotsContainer.children;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // --- Update Dots Helper ---
    const updateDots = (activeIndex) => {
      Array.from(dots).forEach((dot, index) => {
        if (index === activeIndex) {
          dot.className = "w-1.5 h-1.5 rounded-full bg-white cursor-pointer hover:scale-125 transition-transform";
        } else {
          dot.className = "w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-white/50 cursor-pointer transition-colors hover:scale-125 transition-transform";
        }
      });
    };

    // --- Scroll Observer for Dots ---
    const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(slides).indexOf(entry.target);
          if(index !== -1) {
            updateDots(index);
          }
        }
      });
    }, { 
      root: slider, 
      threshold: 0.6 
    });

    slides.forEach(slide => slideObserver.observe(slide));

    // --- Click on Dot to Scroll ---
    Array.from(dots).forEach((dot, index) => {
      dot.addEventListener('click', () => {
        slides[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    });

    // --- Arrow Buttons ---
    const getScrollAmount = () => {
      return window.innerWidth < 768 ? window.innerWidth * 0.85 : 548;
    };

    if(prevBtn && nextBtn) {
      nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      });
      
      prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      });
    }
  }
})();
