const cursor = document.querySelector('.cursor');
const menuToggle = document.querySelector('.menu-toggle');
const siteHeader = document.querySelector('.site-header');
const body = document.body;
const overlay = document.querySelector('.mobile-overlay');
const navLinks = document.querySelectorAll('.site-nav a');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const revealElements = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-count]');
const testimonials = document.querySelectorAll('.testimonial-card');
let testimonialIndex = 0;

if (cursor) {
  document.addEventListener('mousemove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    item.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    body.classList.toggle('menu-open');
    menuToggle.classList.toggle('active');
  });
}

if (overlay) {
  overlay.addEventListener('click', () => {
    body.classList.remove('menu-open');
    menuToggle.classList.remove('active');
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    body.classList.remove('menu-open');
    menuToggle.classList.remove('active');
  });
});

const handleScroll = () => {
  if (window.scrollY > 40) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleScroll);
handleScroll();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((element) => revealObserver.observe(element));

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.style.display = 'grid';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

const animateCounters = () => {
  counters.forEach((counter) => {
    const updateCount = () => {
      const target = +counter.dataset.count;
      const current = +counter.innerText;
      const speed = Math.max(target / 60, 1);
      if (current < target) {
        counter.innerText = Math.ceil(current + speed);
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
};

const counterObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        obs.disconnect();
      }
    });
  },
  { threshold: 0.4 }
);

if (counters.length) {
  counterObserver.observe(counters[0]);
}

const rotateTestimonials = () => {
  testimonials.forEach((testimonial, index) => {
    testimonial.classList.toggle('active', index === testimonialIndex);
  });
};

if (testimonials.length) {
  rotateTestimonials();
  setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    rotateTestimonials();
  }, 6000);
}

// ── Calendar Date Picker ──
(function () {
  const monthLabel = document.getElementById('cal-month-label');
  const grid = document.getElementById('cal-grid');
  const display = document.getElementById('cal-display');
  const hiddenInput = document.getElementById('cal-input');
  if (!grid) return;

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const today = new Date();
  let current = new Date(today.getFullYear(), today.getMonth(), 1);
  let selected = null;

  function render() {
    monthLabel.textContent = `${months[current.getMonth()]} ${current.getFullYear()}`;
    grid.innerHTML = '';

    // Day name headers
    dayNames.forEach(d => {
      const el = document.createElement('div');
      el.className = 'cal-day-name';
      el.textContent = d;
      grid.appendChild(el);
    });

    // Empty cells before first day
    const firstDay = new Date(current.getFullYear(), current.getMonth(), 1).getDay();
    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'cal-day cal-empty';
      grid.appendChild(el);
    }

    // Day cells
    const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      el.className = 'cal-day';
      el.textContent = d;

      const thisDate = new Date(current.getFullYear(), current.getMonth(), d);
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isPast = thisDate < todayMidnight;
      const isToday = thisDate.getTime() === todayMidnight.getTime();

      if (isPast) el.classList.add('cal-past');
      if (isToday) el.classList.add('cal-today');
      if (selected && thisDate.toDateString() === selected.toDateString()) {
        el.classList.add('cal-selected');
      }

      if (!isPast) {
        el.addEventListener('click', () => {
          selected = thisDate;
          const formatted = `${d} ${months[current.getMonth()]} ${current.getFullYear()}`;
          display.textContent = `Selected: ${formatted}`;
          hiddenInput.value = formatted;
          render();
        });
      }

      grid.appendChild(el);
    }
  }

  document.getElementById('cal-prev').addEventListener('click', () => {
    current.setMonth(current.getMonth() - 1);
    render();
  });

  document.getElementById('cal-next').addEventListener('click', () => {
    current.setMonth(current.getMonth() + 1);
    render();
  });

  render();
})();