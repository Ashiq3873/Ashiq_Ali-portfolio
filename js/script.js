/**
 * Mohamed Ashiq Ali B - Portfolio Website JavaScript (Gravity Edition)
 * Implements interactive UX features, theme toggling, gravity canvas physics, and validations.
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCyberThemes();
  initMobileMenu();
  initMobileOptimizations();
  initDesignationTyping();
  initParticleBackground();
  initScrollAnimations();
  initContactForm();
  initBackToTop();
  updateFooterYear();
});

/* ==========================================================================
   Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem("portfolio-theme");
  
  if (savedTheme === "light") {
    htmlElement.classList.remove("dark-theme");
  } else {
    htmlElement.classList.add("dark-theme");
  }

  themeToggle.addEventListener("click", () => {
    if (htmlElement.classList.contains("dark-theme")) {
      htmlElement.classList.remove("dark-theme");
      localStorage.setItem("portfolio-theme", "light");
    } else {
      htmlElement.classList.add("dark-theme");
      localStorage.setItem("portfolio-theme", "dark");
    }
  });
}

/* ==========================================================================
   Cyber Color Theme Templates
   ========================================================================== */
function initCyberThemes() {
  const htmlElement = document.documentElement;
  const pickerBtn = document.getElementById("themePickerBtn");
  const dropdown = document.getElementById("themePickerDropdown");
  const themeOptions = document.querySelectorAll(".theme-option");

  const savedCyberTheme = localStorage.getItem("portfolio-cyber-theme") || "matrix";
  applyCyberTheme(savedCyberTheme);

  pickerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains("open");
    dropdown.classList.toggle("open", !isOpen);
    pickerBtn.setAttribute("aria-expanded", !isOpen);
  });

  themeOptions.forEach(option => {
    option.addEventListener("click", () => {
      const theme = option.getAttribute("data-theme");
      applyCyberTheme(theme);
      localStorage.setItem("portfolio-cyber-theme", theme);
      dropdown.classList.remove("open");
      pickerBtn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#cyberThemePicker")) {
      dropdown.classList.remove("open");
      pickerBtn.setAttribute("aria-expanded", "false");
    }
  });

  function applyCyberTheme(theme) {
    htmlElement.setAttribute("data-cyber-theme", theme);
    themeOptions.forEach(opt => {
      opt.classList.toggle("active", opt.getAttribute("data-theme") === theme);
    });
  }
}

/* ==========================================================================
   Mobile Menu Overlay Navigation
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navOverlay = document.getElementById("navOverlay");
  const navLinks = document.querySelectorAll(".nav-link");

  function setMenuOpen(isOpen) {
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.classList.toggle("active", isOpen);
    navMenu.classList.toggle("mobile-active", isOpen);
    if (navOverlay) {
      navOverlay.classList.toggle("active", isOpen);
      navOverlay.setAttribute("aria-hidden", !isOpen);
    }
    document.body.classList.toggle("menu-open", isOpen);
  }

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isExpanded);
  });

  if (navOverlay) {
    navOverlay.addEventListener("click", () => setMenuOpen(false));
  }

  navLinks.forEach(link => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
    }
  });

  // Highlight active nav link on scroll
  const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", () => {
    let currentSectionId = "";
    const scrollPosition = window.scrollY + 160; // Offset for navbar height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });

    // Add sticky class to navbar
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  });
}

/* ==========================================================================
   Mobile Device Optimizations
   ========================================================================== */
function initMobileOptimizations() {
  const html = document.documentElement;
  const contactVideo = document.querySelector(".contact-bg-video");

  function applyMobileState() {
    const isMobile = window.innerWidth <= 768;
    html.classList.toggle("is-mobile", isMobile);

    if (contactVideo) {
      contactVideo.setAttribute("preload", isMobile ? "none" : "auto");
    }
  }

  applyMobileState();
  window.addEventListener("resize", applyMobileState);

  if (contactVideo && "IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          contactVideo.play().catch(() => {});
        } else if (window.innerWidth <= 768) {
          contactVideo.pause();
        }
      });
    }, { threshold: 0.15 });

    videoObserver.observe(contactVideo);
  }
}

/* ==========================================================================
   Shuffling Designation Typing Effect (Hero)
   ========================================================================== */
function initDesignationTyping() {
  const designations = [
    "Software Engineer",
    "Cyber Security Enthusiast",
    "AWS Support Specialist",
    "Full Stack Developer",
    "Penetration Tester",
    "Problem Solver"
  ];
  
  const typingTextElement = document.getElementById("typing-text");
  if (!typingTextElement) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = designations[wordIndex];
    
    if (isDeleting) {
      typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Speed up deleting
    } else {
      typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal typing speed
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % designations.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1000);
}

/* ==========================================================================
   HTML5 Canvas - Gravity & Bouncing Particle Background
   ========================================================================== */
function initParticleBackground() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let matrixDrops = [];
  let mouse = { x: null, y: null, radius: 150 };

  const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEF<>{}[]/\\|@#$%&*";

  function getThemeColors() {
    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue("--particle-primary").trim() || "rgba(0, 255, 65, 0.7)";
    const secondary = style.getPropertyValue("--particle-secondary").trim() || "rgba(0, 212, 255, 0.55)";
    const glow = style.getPropertyValue("--accent-glow").trim() || "rgba(0, 255, 65, 0.35)";
    return { primary, secondary, glow };
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener("click", (e) => {
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    const spawnCount = 12;
    for (let i = 0; i < spawnCount; i++) {
      particles.push(new Particle(e.clientX, e.clientY, true));
    }
  });

  const GRAVITY = 0.12;
  const BOUNCINESS = 0.62;
  const FRICTION = 0.985;

  class Particle {
    constructor(startX = null, startY = null, isBurst = false) {
      this.x = startX !== null ? startX + (Math.random() * 30 - 15) : Math.random() * canvas.width;
      this.y = startY !== null ? startY + (Math.random() * 30 - 15) : -20 - (Math.random() * 150);
      
      this.radius = isBurst ? Math.random() * 5 + 3 : Math.random() * 3.5 + 1.5;
      this.vx = (Math.random() * 2 - 1) * (isBurst ? 3 : 1.5);
      this.vy = isBurst ? (Math.random() * -3 - 1) : Math.random() * 1.5;
      this.bounciness = BOUNCINESS + (Math.random() * 0.1 - 0.05);
      
      this.colorType = Math.random() > 0.5 ? 'primary' : 'secondary';
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.alpha = this.baseAlpha;
      this.settledFrames = 0;
      this.trail = [];
      this.maxTrail = 6;
      this.isChar = Math.random() > 0.7;
      this.char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.08;
    }

    draw() {
      const colors = getThemeColors();
      const colorString = this.colorType === 'primary' ? colors.primary : colors.secondary;

      if (this.trail.length > 1) {
        for (let i = 0; i < this.trail.length - 1; i++) {
          const tAlpha = (i / this.trail.length) * this.alpha * 0.4;
          ctx.strokeStyle = colorString.replace(/[\d.]+\)$/, `${tAlpha})`);
          ctx.lineWidth = this.radius * 0.5;
          ctx.beginPath();
          ctx.moveTo(this.trail[i].x, this.trail[i].y);
          ctx.lineTo(this.trail[i + 1].x, this.trail[i + 1].y);
          ctx.stroke();
        }
      }

      if (this.isChar && this.radius > 2) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.font = `${this.radius * 4}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = colorString.replace(/[\d.]+\)$/, `${this.alpha})`);
        ctx.shadowColor = colorString;
        ctx.shadowBlur = 8;
        ctx.fillText(this.char, -this.radius * 2, this.radius);
        ctx.restore();
      } else {
        ctx.fillStyle = colorString.replace(/[\d.]+\)$/, `${this.alpha})`);
        ctx.shadowColor = colorString;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrail) this.trail.shift();

      this.vy += GRAVITY;
      this.vx *= FRICTION;
      this.rotation += this.rotationSpeed;

      this.y += this.vy;
      this.x += this.vx;

      if (this.y + this.radius >= canvas.height) {
        this.y = canvas.height - this.radius;
        this.vy = -this.vy * this.bounciness;
        this.vx *= 0.75;
        
        if (Math.abs(this.vy) < 0.3) {
          this.vy = 0;
          this.settledFrames++;
        }
      }

      if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.vx = -this.vx * this.bounciness;
      } else if (this.x + this.radius > canvas.width) {
        this.x = canvas.width - this.radius;
        this.vx = -this.vx * this.bounciness;
      }

      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const pullForce = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * pullForce * 0.8;
          this.vy += Math.sin(angle) * pullForce * 0.5 + pullForce * 0.15;
        }
      }

      if (this.settledFrames > 40) {
        this.alpha -= 0.004;
        if (this.alpha <= 0) {
          this.reset();
        }
      }
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20 - (Math.random() * 120);
      this.vx = (Math.random() * 2 - 1) * 1.5;
      this.vy = Math.random() * 2;
      this.alpha = this.baseAlpha;
      this.settledFrames = 0;
      this.trail = [];
      this.char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
    }
  }

  class MatrixDrop {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.speed = Math.random() * 2 + 1;
      this.chars = [];
      this.length = Math.floor(Math.random() * 15) + 8;
      for (let i = 0; i < this.length; i++) {
        this.chars.push(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]);
      }
    }

    draw() {
      const colors = getThemeColors();
      for (let i = 0; i < this.chars.length; i++) {
        const alpha = (1 - i / this.length) * 0.15;
        ctx.font = "14px 'JetBrains Mono', monospace";
        ctx.fillStyle = colors.primary.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.fillText(this.chars[i], this.x, this.y - i * 18);
      }
    }

    update() {
      this.y += this.speed;
      if (Math.random() > 0.95) {
        const idx = Math.floor(Math.random() * this.chars.length);
        this.chars[idx] = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      }
      if (this.y - this.length * 18 > canvas.height) {
        this.reset();
      }
    }
  }

  function initParticles() {
    particles = [];
    matrixDrops = [];
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    const divisor = isSmallMobile ? 28 : isMobile ? 20 : 12;
    const maxCount = isSmallMobile ? 35 : isMobile ? 55 : 120;
    const count = Math.min(Math.floor(canvas.width / divisor), maxCount);
    for (let i = 0; i < count; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }
    const dropDivisor = isMobile ? 120 : 80;
    const maxDrops = isMobile ? 6 : 18;
    const dropCount = Math.min(Math.floor(canvas.width / dropDivisor), maxDrops);
    for (let i = 0; i < dropCount; i++) {
      matrixDrops.push(new MatrixDrop());
    }
  }
  initParticles();

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initParticles, 300);
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colors = getThemeColors();

    for (let i = 0; i < matrixDrops.length; i++) {
      matrixDrops[i].update();
      matrixDrops[i].draw();
    }

    if (particles.length > 300) {
      particles.splice(0, particles.length - 300);
    }

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    const lineColor = colors.glow.replace(/[\d.]+\)$/, "0.08)");
    
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 90) {
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   Scroll-Triggered Entry Animations (Gravity Drop) & Skill Meter Fill
   ========================================================================== */
function initScrollAnimations() {
  // 1. Gravity drop animations (settling downwards from top)
  const fadeElements = document.querySelectorAll(".gravity-drop-init");
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: "0px 0px -40px 0px"
  });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // 2. Skills progress bar trigger
  const skillsSection = document.getElementById("skills");
  const skillFills = document.querySelectorAll(".skill-meter-fill");

  if (skillsSection && skillFills.length > 0) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillFills.forEach(fill => {
            const meterItem = fill.closest(".skill-meter-item");
            if (meterItem) {
              const targetPercent = meterItem.getAttribute("data-percent") || "0";
              fill.style.width = `${targetPercent}%`;
            }
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    skillsObserver.observe(skillsSection);
  }
}

/* ==========================================================================
   Contact Form Validation & Feedbacks
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const banner = document.getElementById("formStatusBanner");
  const bannerText = document.getElementById("formStatusText");

  if (!form) return;

  const fields = {
    name: {
      input: document.getElementById("contactName"),
      error: document.getElementById("nameError"),
      validate: (val) => val.trim().length > 0
    },
    email: {
      input: document.getElementById("contactEmail"),
      error: document.getElementById("emailError"),
      validate: (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val.trim());
      }
    },
    message: {
      input: document.getElementById("contactMessage"),
      error: document.getElementById("messageError"),
      validate: (val) => val.trim().length > 0
    }
  };

  Object.values(fields).forEach(field => {
    if (!field.input) return;
    field.input.addEventListener("input", () => {
      field.input.classList.remove("invalid");
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isFormValid = true;

    Object.entries(fields).forEach(([key, field]) => {
      if (!field.input) return;
      
      const isValid = field.validate(field.input.value);
      if (!isValid) {
        field.input.classList.add("invalid");
        isFormValid = false;
      } else {
        field.input.classList.remove("invalid");
      }
    });

    if (!isFormValid) {
      showStatusBanner("Please fill in the required fields correctly.", "error");
      return;
    }

    // Form is valid - Simulate API submit
    const submitBtn = form.querySelector(".btn-submit");
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "<span>Sending Message...</span>";

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      showStatusBanner("Thank you! Your message has been sent successfully. I'll get back to you soon.", "success");
      form.reset();
    }, 1200);
  });

  function showStatusBanner(message, type) {
    bannerText.textContent = message;
    banner.className = `form-status-banner ${type}`;
    banner.classList.remove("hidden");
    
    banner.scrollIntoView({ behavior: "smooth", block: "nearest" });

    if (type === "success") {
      setTimeout(() => {
        banner.classList.add("hidden");
      }, 6000);
    }
  }
}

/* ==========================================================================
   Back To Top Floating Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* ==========================================================================
   Footer Date Updater
   ========================================================================== */
function updateFooterYear() {
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
