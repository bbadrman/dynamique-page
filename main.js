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
document.querySelectorAll('button, a, .feature-card, .showcase-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2.5)'; ring.style.transform = 'translate(-50%,-50%) scale(1.5)'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.transform = 'translate(-50%,-50%) scale(1)'; });
});

/* ── NAV SCROLL ── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

/* ── MARQUEE ── */
const items = ['AI Animations', 'Three.js', 'Particle Systems', 'Spline 3D', 'WebGL Shaders', 'Motion Design', 'Interactive Scenes', 'Luxury UX', 'Custom Cursors', 'Scroll Magic'];
const track = document.getElementById('marquee-track');
[...items, ...items].forEach(t => {
  const el = document.createElement('span');
  el.className = 'marquee-item';
  el.innerHTML = `<span class="marquee-dot"></span>${t}`;
  track.appendChild(el);
});

/* ── REVEAL ON SCROLL ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── HERO THREE.JS ── */
(function() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  // Stars / particles
  const count = 3000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i*3] = (Math.random() - 0.5) * 300;
    pos[i*3+1] = (Math.random() - 0.5) * 300;
    pos[i*3+2] = (Math.random() - 0.5) * 300;
    const gold = Math.random() > 0.6;
    col[i*3] = gold ? 0.8 : 0.2 + Math.random() * 0.3;
    col[i*3+1] = gold ? 0.66 : 0.1;
    col[i*3+2] = gold ? 0.3 : 0.5 + Math.random() * 0.5;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ size: 0.7, vertexColors: true, transparent: true, opacity: 0.7 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // Floating torus knots
  const shapes = [];
  for (let i = 0; i < 4; i++) {
    const g = i % 2 === 0
      ? new THREE.TorusKnotGeometry(6 + i * 2, 1.2, 100, 16)
      : new THREE.OctahedronGeometry(5 + i * 2, 0);
    const m = new THREE.MeshBasicMaterial({ color: 0xc9a84c, wireframe: true, transparent: true, opacity: 0.08 + i * 0.03 });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 40);
    scene.add(mesh); shapes.push(mesh);
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

/* ── DEMO CANVAS ── */
(function() {
  const canvas = document.getElementById('demo-canvas');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const W = canvas.parentElement.clientWidth, H = canvas.parentElement.clientHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
  camera.position.z = 28;

  // Central orb
  const orbGeo = new THREE.SphereGeometry(5, 64, 64);
  const orbMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, wireframe: true, transparent: true, opacity: 0.35 });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  scene.add(orb);

  // Rings
  const rings = [];
  for (let i = 0; i < 4; i++) {
    const rg = new THREE.TorusGeometry(7 + i * 2.5, 0.12, 8, 120);
    const rm = new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.15 + i * 0.05 });
    const ring = new THREE.Mesh(rg, rm);
    ring.rotation.x = Math.random() * Math.PI;
    ring.rotation.z = Math.random() * Math.PI;
    scene.add(ring); rings.push(ring);
  }

  // Orbiting dots
  const dots = [];
  for (let i = 0; i < 120; i++) {
    const dg = new THREE.SphereGeometry(0.08, 8, 8);
    const dm = new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0xe8c97a : 0x7c6bff });
    const d = new THREE.Mesh(dg, dm);
    const r = 7 + Math.random() * 10;
    const angle = Math.random() * Math.PI * 2;
    d.userData = { r, angle, speed: 0.003 + Math.random() * 0.008, yi: (Math.random() - 0.5) * 0.5 };
    scene.add(d); dots.push(d);
  }

  let dmx = 0, dmy = 0;
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    dmx = ((e.clientX - rect.left) / W - 0.5) * 2;
    dmy = -((e.clientY - rect.top) / H - 0.5) * 2;
  });

  let t = 0;
  function animate() {
    t += 0.01;
    orb.rotation.y = t * 0.4;
    orb.rotation.x = t * 0.2;
    rings.forEach((r, i) => {
      r.rotation.z += 0.003 + i * 0.001;
      r.rotation.x += 0.001;
    });
    dots.forEach(d => {
      d.userData.angle += d.userData.speed;
      d.position.x = Math.cos(d.userData.angle) * d.userData.r;
      d.position.z = Math.sin(d.userData.angle) * d.userData.r;
      d.position.y = Math.sin(d.userData.angle * 2) * d.userData.r * d.userData.yi;
    });
    camera.position.x += (dmx * 6 - camera.position.x) * 0.05;
    camera.position.y += (dmy * 4 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── SHOWCASE CANVASES ── */
function makeShowcase1(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const W = canvas.clientWidth || 400, H = canvas.clientHeight || 420;
  renderer.setSize(W, H);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 200);
  camera.position.z = 40;
  const count = 6000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 8 + Math.random() * 18;
    pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i*3+2] = r * Math.cos(phi);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.35, transparent: true, opacity: 0.85 });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  let t = 0;
  function a() { t += 0.005; pts.rotation.y = t; pts.rotation.x = t * 0.4; renderer.render(scene, camera); requestAnimationFrame(a); }
  a();
}

function makeShowcase2(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const W = canvas.clientWidth || 400, H = canvas.clientHeight || 420;
  renderer.setSize(W, H);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 200);
  camera.position.z = 35;
  const nodes = [], edges = [];
  const nCount = 30;
  for (let i = 0; i < nCount; i++) {
    const g = new THREE.SphereGeometry(0.3, 8, 8);
    const m = new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0xc9a84c : 0x7c6bff });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set((Math.random()-0.5)*30, (Math.random()-0.5)*30, (Math.random()-0.5)*10);
    scene.add(mesh); nodes.push(mesh);
  }
  for (let i = 0; i < nCount; i++) {
    for (let j = i+1; j < nCount; j++) {
      if (nodes[i].position.distanceTo(nodes[j].position) < 12) {
        const pts = [nodes[i].position.clone(), nodes[j].position.clone()];
        const g = new THREE.BufferGeometry().setFromPoints(pts);
        const m = new THREE.LineBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.12 });
        scene.add(new THREE.Line(g, m));
      }
    }
  }
  let t = 0;
  function a() {
    t += 0.008;
    nodes.forEach((n, i) => { n.position.y += Math.sin(t + i) * 0.02; });
    scene.rotation.y = Math.sin(t * 0.3) * 0.5;
    renderer.render(scene, camera); requestAnimationFrame(a);
  }
  a();
}

function makeShowcase3(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.clientWidth || 400, H = canvas.clientHeight || 420;
  canvas.width = W; canvas.height = H;
  let t = 0;
  function a() {
    t += 0.015;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < 6; i++) {
      const x = W/2 + Math.cos(t + i * 1.05) * (W * 0.3);
      const y = H/2 + Math.sin(t * 0.7 + i * 0.8) * (H * 0.3);
      const r = 120 + Math.sin(t + i) * 40;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const hues = [45, 200, 270, 30, 180, 320];
      g.addColorStop(0, `hsla(${hues[i]},80%,60%,0.18)`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
    requestAnimationFrame(a);
  }
  a();
}

makeShowcase1('sc1');
makeShowcase2('sc2');
makeShowcase3('sc3');
