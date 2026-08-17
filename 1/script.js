/* ============================================================
   BELHART RAJESKY PASARIBU — PORTFOLIO
   script.js — Three.js scene, scroll choreography, interactions
   ============================================================ */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches || window.innerWidth < 900;
  const isSmall = window.innerWidth < 700;

  /* ============ PRELOADER ============ */
  const preloader = document.getElementById('preloader');
  const preCountNum = document.getElementById('preCountNum');
  let pct = 0;
  const preInterval = setInterval(() => {
    pct = Math.min(100, pct + Math.random() * 18);
    preCountNum.textContent = Math.floor(pct);
    if (pct >= 100) {
      clearInterval(preInterval);
      preCountNum.textContent = 100;
      setTimeout(() => {
        preloader.classList.add('done');
        document.body.style.overflow = '';
        if (window.gsap) runHeroIntro();
      }, 300);
    }
  }, 90);
  document.body.style.overflow = 'hidden';
  window.addEventListener('load', () => { pct = 100; });

  /* ============ LENIS SMOOTH SCROLL ============ */
  let lenis = null;
  if (!prefersReduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger ? ScrollTrigger.update : undefined);
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  /* ============ GSAP SETUP ============ */
  gsap.registerPlugin(ScrollTrigger);
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ============ SCROLL PROGRESS BAR ============ */
  const progressSpan = document.querySelector('#scrollProgress span');
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => { progressSpan.style.width = (self.progress * 100) + '%'; }
  });

  /* ============ NAV: hide on scroll down, show on up + active link ============ */
  const nav = document.getElementById('siteNav');
  let lastY = window.scrollY;
  ScrollTrigger.create({
    trigger: document.body, start: 'top top', end: 'bottom bottom',
    onUpdate: (self) => {
      const y = window.scrollY;
      if (y > lastY && y > 200) nav.classList.add('nav-hidden');
      else nav.classList.remove('nav-hidden');
      lastY = y;
    }
  });
  const navLinks = document.querySelectorAll('.nav-links a');
  const navSectionIds = ['work', 'journey', 'achievements', 'contact'];
  navSectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 40%', end: 'bottom 40%',
      onEnter: () => setActiveNav(id), onEnterBack: () => setActiveNav(id)
    });
  });
  function setActiveNav(id) {
    navLinks.forEach((a) => a.classList.toggle('nav-current', a.dataset.nav === id));
  }

  /* ============ MOBILE MENU ============ */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  menuToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('open');
    document.body.style.overflow = '';
  }));

  /* ============ CUSTOM CURSOR ============ */
  if (!isTouch) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    function cursorLoop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(cursorLoop);
    }
    cursorLoop();
    document.querySelectorAll('a, button, [data-magnetic]').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  /* ============ MAGNETIC BUTTONS ============ */
  if (!isTouch) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.28;
        const dy = (e.clientY - r.top - r.height / 2) * 0.35;
        gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
      });
    });
  }

  /* ============ HERO MOUSE PARALLAX LAYERS ============ */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!isTouch && !prefersReduced) {
    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      parallaxEls.forEach((el) => {
        const depth = parseFloat(el.dataset.parallax) * 40;
        gsap.to(el, { x: nx * depth, y: ny * depth * 0.6, duration: 1.1, ease: 'power3.out' });
      });
    });
  }

  /* ============ GSAP SCROLL REVEALS ============ */
  gsap.utils.toArray('.gsap-reveal').forEach((el) => {
    gsap.from(el, {
      opacity: 0, y: 34, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });
  gsap.utils.toArray('.gsap-reveal-left').forEach((el) => {
    gsap.from(el, {
      opacity: 0, x: -40, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    });
  });
  gsap.utils.toArray('.gsap-reveal-right').forEach((el) => {
    gsap.from(el, {
      opacity: 0, x: 40, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    });
  });

  /* ============ HERO INTRO TIMELINE ============ */
  function runHeroIntro() {
    gsap.set('.hero-title .line', { yPercent: 110, opacity: 0 });
    gsap.set('.hero-photo-frame', { opacity: 0, scale: 0.92 });
    gsap.set('.hero-role, .hero-cta, .hero-annot', { opacity: 0, y: 16 });
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to('.hero-title .line', { yPercent: 0, opacity: 1, duration: 1, stagger: 0.09 })
      .to('.hero-photo-frame', { opacity: 1, scale: 1, duration: 1 }, 0.15)
      .to('.hero-role', { opacity: 1, y: 0, duration: 0.8 }, 0.55)
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8 }, 0.7)
      .to('.hero-annot', { opacity: 1, y: 0, duration: 0.7 }, 0.9);
  }

  /* ============ WORK PANEL TILT (desktop) ============ */
  if (!isTouch) {
    document.querySelectorAll('.work-panel-media').forEach((media) => {
      media.addEventListener('mousemove', (e) => {
        const r = media.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(media, { rotateY: px * 6, rotateX: -py * 6, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
      });
      media.addEventListener('mouseleave', () => {
        gsap.to(media, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
      });
    });
  }

  /* ============ TIMELINE FILL ON SCROLL ============ */
  const timelineFill = document.getElementById('timelineFill');
  if (timelineFill) {
    ScrollTrigger.create({
      trigger: '.timeline-wrap', start: 'top 70%', end: 'bottom 60%', scrub: true,
      onUpdate: (self) => { timelineFill.style.height = (self.progress * 100) + '%'; }
    });
  }

  /* ============ ACHIEVEMENTS DRAG SCROLL ============ */
  const achGallery = document.getElementById('achGallery');
  if (achGallery) {
    let isDown = false, startX, scrollLeft;
    achGallery.addEventListener('mousedown', (e) => {
      isDown = true; startX = e.pageX - achGallery.offsetLeft; scrollLeft = achGallery.scrollLeft;
      achGallery.style.cursor = 'grabbing';
    });
    ['mouseleave', 'mouseup'].forEach((ev) => achGallery.addEventListener(ev, () => {
      isDown = false; achGallery.style.cursor = 'default';
    }));
    achGallery.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - achGallery.offsetLeft;
      achGallery.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
  }

  /* ============ LOCAL TIME (MEDAN, WIB) ============ */
  const localTimeEl = document.getElementById('localTime');
  function updateLocalTime() {
    try {
      const t = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' });
      localTimeEl.textContent = `MEDAN, ID — ${t} WIB`;
    } catch (e) { /* noop */ }
  }
  updateLocalTime();
  setInterval(updateLocalTime, 30000);

  /* ============================================================
     THREE.JS SCENE — "TECHNICAL SKETCHBOOK" DRIFTING GEOMETRY
     ============================================================ */
  const canvas = document.getElementById('scene');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 14);

  scene.fog = new THREE.Fog(0xf3f1ea, 10, 26);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(5, 8, 6);
  const accentLight = new THREE.PointLight(0xc8632c, 0.9, 20);
  accentLight.position.set(-6, -3, 4);
  scene.add(ambient, dirLight, accentLight);

  const inkColor = 0x16181c;
  const accentColor = 0xc8632c;
  const paperColor = 0xebe8de;

  const shapeGroup = new THREE.Group();
  scene.add(shapeGroup);

  const shapeCount = isSmall ? 6 : (isTouch ? 8 : 12);
  const shapes = [];
  const geoPool = [
    () => new THREE.IcosahedronGeometry(1, 0),
    () => new THREE.OctahedronGeometry(1, 0),
    () => new THREE.TorusGeometry(0.8, 0.28, 8, isSmall ? 10 : 16),
    () => new THREE.TetrahedronGeometry(1, 0),
    () => new THREE.TorusKnotGeometry(0.6, 0.18, isSmall ? 40 : 80, 8)
  ];

  for (let i = 0; i < shapeCount; i++) {
    const geoFn = geoPool[i % geoPool.length];
    const geo = geoFn();
    const wire = Math.random() > 0.4;
    let mesh;
    if (wire) {
      const mat = new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? accentColor : inkColor, wireframe: true, transparent: true, opacity: 0.55 });
      mesh = new THREE.Mesh(geo, mat);
    } else {
      const mat = new THREE.MeshStandardMaterial({ color: paperColor, metalness: 0.1, roughness: 0.6, transparent: true, opacity: 0.9 });
      mesh = new THREE.Mesh(geo, mat);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: inkColor, transparent: true, opacity: 0.4 }));
      mesh.add(edges);
    }
    const scale = 0.5 + Math.random() * 1.1;
    mesh.scale.setScalar(scale);
    mesh.position.set(
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 14 - 4
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    shapeGroup.add(mesh);
    shapes.push({
      mesh,
      speed: 0.05 + Math.random() * 0.12,
      floatOffset: Math.random() * Math.PI * 2,
      floatAmp: 0.4 + Math.random() * 0.6,
      rotSpeed: (Math.random() - 0.5) * 0.25
    });
  }

  /* Wireframe grid floor for depth */
  const gridHelper = new THREE.GridHelper(40, 28, 0x16181c, 0x16181c);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.06;
  gridHelper.position.y = -7;
  scene.add(gridHelper);

  /* Particle atmosphere */
  const particleCount = isSmall ? 150 : (isTouch ? 260 : 500);
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 6;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: inkColor, size: 0.035, transparent: true, opacity: 0.35 });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ---- Mouse parallax on camera ---- */
  let targetCamX = 0, targetCamY = 0;
  if (!isTouch) {
    window.addEventListener('mousemove', (e) => {
      targetCamX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetCamY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  /* ---- Scroll-driven camera & group motion ---- */
  let scrollProgress = 0;
  ScrollTrigger.create({
    trigger: document.body, start: 'top top', end: 'bottom bottom',
    onUpdate: (self) => { scrollProgress = self.progress; }
  });

  /* ---- Visibility / performance handling ---- */
  let isVisible = true;
  document.addEventListener('visibilitychange', () => { isVisible = document.visibilityState === 'visible'; });

  function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 150);
  });

  const clock = new THREE.Clock();
  let camX = 0, camY = 0;

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;
    const t = clock.getElapsedTime();

    shapes.forEach((s) => {
      s.mesh.rotation.x += s.rotSpeed * 0.005;
      s.mesh.rotation.y += s.rotSpeed * 0.008;
      s.mesh.position.y += Math.sin(t * s.speed + s.floatOffset) * 0.0025 * s.floatAmp;
    });

    particles.rotation.y = t * 0.01;

    /* scroll: rotate whole scene group + push camera through depth */
    if (!prefersReduced) {
      shapeGroup.rotation.y = scrollProgress * Math.PI * 0.6;
      camera.position.z = 14 - scrollProgress * 4;
      camX += (targetCamX * 1.1 - camX) * 0.04;
      camY += (targetCamY * 0.7 - camY) * 0.04;
      camera.position.x = camX;
      camera.position.y = -camY;
      camera.lookAt(0, 0, -4);
    } else {
      shapeGroup.rotation.y = 0.15;
      camera.position.set(0, 0, 14);
      camera.lookAt(0, 0, -4);
    }

    renderer.render(scene, camera);
  }
  animate();
  onResize();

})();
