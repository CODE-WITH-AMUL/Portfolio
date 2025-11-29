 // Clock functionality
    function updateClock() {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      document.getElementById("clock").textContent = time;
    }

    setInterval(updateClock, 1000);
    updateClock(); // first run

    // Header scroll effect - stays fully transparent
    window.addEventListener('scroll', function() {
      const header = document.querySelector('header');
      // Header remains transparent but still triggers scrolled class for other effects if needed
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    // Three.js Futuristic Mannequin
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.set(0, 1, 5);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: document.getElementById("webgl"), 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileCubemapShader();
    
    // Enhanced lighting
    const light = new THREE.DirectionalLight(0xffffff, 2); 
    light.position.set(5, 5, 5); 
    scene.add(light);
    
    const light2 = new THREE.DirectionalLight(0xffffff, 1); 
    light2.position.set(-5, 5, 5); 
    scene.add(light2);
    
    const ambient = new THREE.AmbientLight(0xffffff, 0.5); 
    scene.add(ambient);
    
    // Point lights for more dynamic effect
    const pointLight1 = new THREE.PointLight(0xffffff, 0.5, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 0.3, 10);
    pointLight2.position.set(-2, -1, 3);
    scene.add(pointLight2);
    
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x000000, 
      metalness: 1, 
      roughness: 0.1, 
      envMapIntensity: 1 
    });
    
    const group = new THREE.Group();
    
    // Create a more detailed mannequin
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), material); 
    head.position.y = 1.8; 
    group.add(head);
    
    const body = new THREE.Mesh(new THREE.BoxGeometry(1, 2.5, 0.5), material); 
    body.position.y = -0.2; 
    group.add(body);
    
    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5, 32), material); 
    arm1.rotation.z = Math.PI/4; 
    arm1.position.set(-1,0.8,0); 
    group.add(arm1);
    
    const arm2 = arm1.clone(); 
    arm2.rotation.z = -Math.PI/4; 
    arm2.position.set(1,0.8,0); 
    group.add(arm2);
    
    // Add legs
    const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 32), material);
    leg1.position.set(-0.3, -1.5, 0);
    group.add(leg1);
    
    const leg2 = leg1.clone();
    leg2.position.set(0.3, -1.5, 0);
    group.add(leg2);
    
    scene.add(group);
    
    // Load HDR environment
    const rgbeLoader = new THREE.RGBELoader();
    rgbeLoader.load('https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr', function(texture){
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = pmremGenerator.fromEquirectangular(texture).texture;
      texture.dispose(); 
      pmremGenerator.dispose();
    });

    // Animation loop
    function animate() { 
      requestAnimationFrame(animate); 
      
      // Subtle floating animation
      group.position.y = Math.sin(Date.now() * 0.001) * 0.1;
      
      // Rotate point lights
      pointLight1.position.x = Math.sin(Date.now() * 0.001) * 3;
      pointLight1.position.z = Math.cos(Date.now() * 0.001) * 3;
      
      pointLight2.position.x = Math.cos(Date.now() * 0.001) * 2;
      pointLight2.position.z = Math.sin(Date.now() * 0.001) * 2;
      
      renderer.render(scene, camera); 
    }
    animate();

    // Initialize particles.js
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
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
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
          resize: true
        }
      },
      retina_detect: true
    });

    // Scroll-triggered animations
    gsap.registerPlugin(ScrollTrigger);

    // Calculate actual scroll percentage
    function calculateScrollPercentage() {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const trackLength = docHeight - winHeight;
      const percentage = Math.floor((scrollTop / trackLength) * 100);
      return Math.max(0, Math.min(100, percentage)); // Ensure it's between 0-100
    }

    // Update scroll progress on scroll
    function updateScrollProgress() {
      const actualPercentage = calculateScrollPercentage();
      document.getElementById('progress').innerText = `scroll (${actualPercentage}%)`;
    }

    // Listen for scroll events
    window.addEventListener('scroll', updateScrollProgress);
    
    // Initialize progress
    updateScrollProgress();

    // Mannequin rotation on scroll
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: self => {
        group.rotation.y = self.progress * Math.PI * 2;
        
        // Parallax effect for hero text
        gsap.to('.hero h1', {
          y: self.progress * 50,
          scale: 1 + self.progress * 0.2,
          ease: "power1.out"
        });
      }
    });

    // 3D ball rotation on scroll
    const ballWrapper = document.querySelector(".wrapper");
    gsap.to(ballWrapper, {
      rotateX: 0, 
      rotateY: 0,
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: self => {
          ballWrapper.style.transform = `translate(-50%,-50%) rotateX(${45 + self.progress*360}deg) rotateY(${45 + self.progress*360}deg)`;
        }
      }
    });

    // Fade in sections on scroll
    gsap.utils.toArray('section').forEach(section => {
      gsap.fromTo(section, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Contact form handling
    document.getElementById('contact-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple form validation
      const inputs = this.querySelectorAll('input, textarea');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.boxShadow = '0 0 0 2px rgba(255, 0, 0, 0.5)';
        } else {
          input.style.boxShadow = 'none';
        }
      });
      
      if (isValid) {
        // In a real application, you would send the form data to a server
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
      } else {
        alert('Please fill in all fields.');
      }
    });

    // Handle window resize
    window.addEventListener("resize", ()=>{
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Update particles on resize
      if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.fn.vendors.resize();
      }
      
      // Update scroll progress on resize
      updateScrollProgress();
    });