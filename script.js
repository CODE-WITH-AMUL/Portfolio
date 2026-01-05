 // ========== UTILITIES ==========
    function throttle(func, limit) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }

    // ========== DYNAMIC BACKGROUND PATTERN ==========
    function setBackgroundPattern() {
      // Change pattern daily based on day of year
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 0);
      const diff = now - startOfYear;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      
      // Cycle through 7 patterns
      const patternIndex = (dayOfYear % 7) + 1;
      document.body.setAttribute('data-pattern', patternIndex);
      
      console.log(`Background pattern: ${patternIndex} (Day ${dayOfYear} of year)`);
    }

    // ========== CALENDAR SYSTEM ==========
    const CalendarManager = {
      modal: null,
      calendarDays: null,
      calendarTitle: null,
      calendarTodayDate: null,
      currentDate: new Date(),
      
      init() {
        this.modal = document.getElementById('calendarModal');
        this.calendarDays = document.getElementById('calendarDays');
        this.calendarTitle = document.getElementById('calendar-title');
        this.calendarTodayDate = document.getElementById('calendarTodayDate');
        
        const toggleBtn = document.getElementById('calendarToggle');
        const closeBtn = document.getElementById('calendarClose');
        
        if (toggleBtn) {
          toggleBtn.addEventListener('click', () => this.open());
        }
        
        if (closeBtn) {
          closeBtn.addEventListener('click', () => this.close());
        }
        
        if (this.modal) {
          this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
              this.close();
            }
          });
        }
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
            this.close();
          }
        });
        
        this.render();
        
        // Auto-show calendar on first load
        setTimeout(() => {
          if (!sessionStorage.getItem('calendarShown')) {
            this.open();
            sessionStorage.setItem('calendarShown', 'true');
          }
        }, 1500);
      },
      
      open() {
        if (this.modal) {
          this.modal.classList.add('active');
          this.render();
        }
      },
      
      close() {
        if (this.modal) {
          this.modal.classList.remove('active');
        }
      },
      
      render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Set header
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        if (this.calendarTitle) {
          this.calendarTitle.textContent = `${monthNames[month]} ${year}`;
        }
        
        // Set today info
        const today = new Date();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        if (this.calendarTodayDate) {
          this.calendarTodayDate.textContent = `${dayNames[today.getDay()]}, ${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
        }
        
        // Generate calendar days
        if (this.calendarDays) {
          this.calendarDays.innerHTML = '';
          
          const firstDay = new Date(year, month, 1).getDay();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const daysInPrevMonth = new Date(year, month, 0).getDate();
          
          // Previous month days
          for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dayEl = this.createDayElement(day, 'other-month');
            this.calendarDays.appendChild(dayEl);
          }
          
          // Current month days
          const todayDate = today.getDate();
          const todayMonth = today.getMonth();
          const todayYear = today.getFullYear();
          
          for (let day = 1; day <= daysInMonth; day++) {
            const isToday = (day === todayDate && month === todayMonth && year === todayYear);
            const dayEl = this.createDayElement(day, isToday ? 'today' : '');
            this.calendarDays.appendChild(dayEl);
          }
          
          // Next month days
          const totalCells = this.calendarDays.children.length;
          const remainingCells = 42 - totalCells; // 6 rows x 7 days
          
          for (let day = 1; day <= remainingCells; day++) {
            const dayEl = this.createDayElement(day, 'other-month');
            this.calendarDays.appendChild(dayEl);
          }
        }
      },
      
      createDayElement(day, className) {
        const el = document.createElement('div');
        el.className = `calendar-day ${className}`;
        el.textContent = day;
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', `Day ${day}`);
        
        if (!className.includes('other-month')) {
          el.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day.selected').forEach(d => {
              d.classList.remove('selected');
            });
            if (!el.classList.contains('today')) {
              el.classList.add('selected');
            }
          });
        }
        
        return el;
      }
    };

    // ========== DATE & TIME DISPLAY ==========
    function updateDateTime() {
      const now = new Date();
      
      // 12-hour format with AM/PM
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      
      const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
      
      // Full date format: Monday, 6 January 2026
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      
      const dayName = dayNames[now.getDay()];
      const date = now.getDate();
      const monthName = monthNames[now.getMonth()];
      const year = now.getFullYear();
      
      const dateString = `${dayName}, ${date} ${monthName} ${year}`;
      
      // Update DOM
      const clockElement = document.getElementById("clock");
      const dateElement = document.getElementById("date");
      
      if (clockElement) {
        clockElement.textContent = timeString;
        clockElement.setAttribute('datetime', now.toISOString());
      }
      
      if (dateElement) {
        dateElement.textContent = dateString;
      }
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Update year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    // ========== HEADER SCROLL EFFECT ==========
    const handleHeaderScroll = throttle(function() {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    }, 100);

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // ========== SCROLL PROGRESS ==========
    function calculateScrollPercentage() {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const trackLength = docHeight - winHeight;
      const percentage = Math.floor((scrollTop / trackLength) * 100);
      return Math.max(0, Math.min(100, percentage));
    }

    const updateScrollProgress = throttle(function() {
      const actualPercentage = calculateScrollPercentage();
      const progressElement = document.getElementById('progress');
      if (progressElement) {
        progressElement.textContent = `scroll (${actualPercentage}%)`;
      }
    }, 100);

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // ========== THREE.JS SCENE ==========
    function initThreeJS() {
      if (typeof THREE === 'undefined') return;

      try {
        const canvas = document.getElementById("webgl");
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 1, 5);

        const renderer = new THREE.WebGLRenderer({ 
          canvas: canvas, 
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight1.position.set(5, 5, 5);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight2.position.set(-5, 3, 5);
        scene.add(directionalLight2);

        const material = new THREE.MeshStandardMaterial({ 
          color: 0x000000, 
          metalness: 1, 
          roughness: 0.2,
          envMapIntensity: 1
        });

        const group = new THREE.Group();

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
        head.position.y = 1.6;
        group.add(head);

        const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 1.8, 8, 16), material);
        body.position.y = 0;
        group.add(body);

        const createLimb = (length, position, rotation) => {
          const limb = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, length, 4, 8), material);
          limb.position.copy(position);
          if (rotation) limb.rotation.z = rotation;
          return limb;
        };

        group.add(createLimb(1.2, new THREE.Vector3(-0.7, 0.6, 0), Math.PI / 6));
        group.add(createLimb(1.2, new THREE.Vector3(0.7, 0.6, 0), -Math.PI / 6));
        group.add(createLimb(1.6, new THREE.Vector3(-0.25, -1.2, 0)));
        group.add(createLimb(1.6, new THREE.Vector3(0.25, -1.2, 0)));

        scene.add(group);

        if (THREE.RGBELoader) {
          const pmremGenerator = new THREE.PMREMGenerator(renderer);
          pmremGenerator.compileEquirectangularShader();

          const rgbeLoader = new THREE.RGBELoader();
          rgbeLoader.load(
            'https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr',
            function(texture) {
              texture.mapping = THREE.EquirectangularReflectionMapping;
              scene.environment = pmremGenerator.fromEquirectangular(texture).texture;
              texture.dispose();
              pmremGenerator.dispose();
            },
            undefined,
            function(error) {
              console.warn('HDR texture failed to load:', error);
            }
          );
        }

        let animationFrameId;
        const clock = new THREE.Clock();

        function animate() {
          animationFrameId = requestAnimationFrame(animate);
          
          const elapsedTime = clock.getElapsedTime();
          group.position.y = Math.sin(elapsedTime * 0.5) * 0.1;
          group.rotation.y += 0.001;
          
          renderer.render(scene, camera);
        }

        animate();

        function handleResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', throttle(handleResize, 250));

        window.addEventListener('beforeunload', () => {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
          renderer.dispose();
          material.dispose();
        });

      } catch (error) {
        console.warn('Three.js initialization failed:', error);
      }
    }

    // ========== PARTICLES.JS ==========
    function initParticles() {
      if (typeof particlesJS === 'undefined') return;

      try {
        particlesJS('particles-js', {
          particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.4, random: true },
            size: { value: 3, random: true },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.15,
              width: 1
            },
            move: {
              enable: true,
              speed: 1.5,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "out",
              bounce: false
            }
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: true, mode: "grab" },
              onclick: { enable: true, mode: "push" },
              resize: true
            },
            modes: {
              grab: {
                distance: 140,
                line_linked: { opacity: 0.3 }
              },
              push: { particles_nb: 4 }
            }
          },
          retina_detect: true
        });
      } catch (error) {
        console.warn('Particles.js initialization failed:', error);
      }
    }

    // ========== GSAP ANIMATIONS ==========
    function initGSAP() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

      try {
        gsap.registerPlugin(ScrollTrigger);

        const sections = gsap.utils.toArray('section');
        sections.forEach(section => {
          gsap.fromTo(section, 
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });

        const ballWrapper = document.querySelector(".wrapper");
        if (ballWrapper) {
          gsap.to(ballWrapper, {
            scrollTrigger: {
              trigger: "body",
              start: "top top",
              end: "bottom bottom",
              scrub: 0.5,
              onUpdate: self => {
                const progress = self.progress;
                ballWrapper.style.transform = `translate(-50%,-50%) rotateX(${45 + progress * 180}deg) rotateY(${45 + progress * 180}deg)`;
              }
            }
          });
        }

        const heroH1 = document.querySelector('.hero h1');
        if (heroH1) {
          gsap.to(heroH1, {
            y: 100,
            scale: 1.1,
            opacity: 0.5,
            scrollTrigger: {
              trigger: '.hero',
              start: 'top top',
              end: 'bottom top',
              scrub: 1
            }
          });
        }

      } catch (error) {
        console.warn('GSAP initialization failed:', error);
      }
    }

    // ========== FORM HANDLING ==========
    function initFormHandling() {
      const form = document.getElementById('contact-form');
      const formStatus = document.getElementById('form-status');
      
      if (!form || !formStatus) return;

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        formStatus.style.display = 'none';
        formStatus.className = 'form-status';
        
        const formData = {
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          message: document.getElementById('message').value.trim()
        };
        
        const errors = [];
        
        if (!formData.name) errors.push('name');
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push('email');
        if (!formData.message) errors.push('message');
        
        if (errors.length > 0) {
          errors.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
              field.style.borderColor = 'rgba(244, 67, 54, 0.5)';
              setTimeout(() => {
                field.style.borderColor = '';
              }, 3000);
            }
          });
          
          formStatus.textContent = 'Please fill in all fields correctly.';
          formStatus.classList.add('error');
          formStatus.style.display = 'block';
          return;
        }
        
        formStatus.textContent = 'Sending message...';
        formStatus.style.display = 'block';
        
        setTimeout(() => {
          formStatus.textContent = 'Thank you for your message! I will get back to you soon.';
          formStatus.classList.add('success');
          form.reset();
          
          setTimeout(() => {
            formStatus.style.display = 'none';
          }, 5000);
        }, 1000);
      });

      ['name', 'email', 'message'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
          field.addEventListener('input', function() {
            this.style.borderColor = '';
          });
        }
      });
    }

    // ========== SMOOTH SCROLL ==========
    function initSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href === '#') return;
          
          e.preventDefault();
          const target = document.querySelector(href);
          
          if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }

    // ========== INITIALIZATION ==========
    function init() {
      // Set dynamic background pattern
      setBackgroundPattern();
      
      // Initialize calendar
      CalendarManager.init();
      
      const loading = document.getElementById('loading');
      if (loading) {
        setTimeout(() => {
          loading.classList.add('hidden');
          setTimeout(() => {
            loading.style.display = 'none';
          }, 500);
        }, 500);
      }

      initThreeJS();
      initParticles();
      initGSAP();
      initFormHandling();
      initSmoothScroll();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    setTimeout(() => {
      if (typeof THREE !== 'undefined' && !document.querySelector('#webgl').children.length) {
        initThreeJS();
      }
      if (typeof particlesJS !== 'undefined' && !window.pJSDom) {
        initParticles();
      }
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initGSAP();
      }
    }, 2000);