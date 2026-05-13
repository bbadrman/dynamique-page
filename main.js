/* ── CURSOR ── */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('button, a, .feature-card, .proj-card, .comp-cat, .tl-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

/* ── NAV SCROLL ── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

/* ── MARQUEE — Stack Technique ── */
const items = [
  'PHP 8', 'Symfony 7', 'Laravel 10', 'React', 'Docker',
  'GitHub Actions', 'MySQL', 'Redis', 'JWT', 'Nginx',
  'PHPUnit', 'SonarQube', 'Azure', 'Mercure', 'REST API',
  'Tailwind', 'Turbo', 'Stimulus', 'RGPD', 'CI/CD'
];
const track = document.getElementById('marquee-track');
[...items, ...items].forEach(t => {
  const el = document.createElement('span');
  el.className = 'marquee-item';
  el.innerHTML = `<span class="marquee-dot"></span>${t}`;
  track.appendChild(el);
});

/* ── REVEAL ON SCROLL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── HERO THREE.JS ── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  const count = 3000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 300;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 300;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 300;
    const gold = Math.random() > 0.6;
    col[i * 3]     = gold ? 0.8 : 0.2 + Math.random() * 0.3;
    col[i * 3 + 1] = gold ? 0.66 : 0.1;
    col[i * 3 + 2] = gold ? 0.3 : 0.5 + Math.random() * 0.5;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ size: 0.7, vertexColors: true, transparent: true, opacity: 0.7 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const shapes = [];
  for (let i = 0; i < 4; i++) {
    const g = i % 2 === 0
      ? new THREE.TorusKnotGeometry(6 + i * 2, 1.2, 100, 16)
      : new THREE.OctahedronGeometry(5 + i * 2, 0);
    const m = new THREE.MeshBasicMaterial({
      color: 0xc9a84c, wireframe: true, transparent: true, opacity: 0.08 + i * 0.03
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 40
    );
    scene.add(mesh);
    shapes.push(mesh);
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let t = 0;
  function animate() {
    t += 0.005;
    points.rotation.y = t * 0.08;
    points.rotation.x = t * 0.03;
    shapes.forEach((s, i) => {
      s.rotation.x += 0.003 + i * 0.001;
      s.rotation.y += 0.002 + i * 0.0015;
      s.position.y = Math.sin(t + i * 1.2) * 8;
    });
    camera.position.x += (mouseX * 12 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 8 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
