
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzEdUKU9jnC1z90mFyvCM-ZA3aKRJZXA2cXf35R5QrwJZBbaQxRbO6hnhz3S05dlXTcMg/exec';

document.getElementById('submitBtn').addEventListener('click', function () {
    const nameEl  = document.getElementById('fname');
    const emailEl = document.getElementById('femail');
    const msgEl   = document.getElementById('fmsg');
    const btn     = document.getElementById('submitBtn');

    const name  = nameEl.value.trim();
    const email = emailEl.value.trim();
    const msg   = msgEl.value.trim();

    [nameEl, emailEl, msgEl].forEach(el => el.style.borderColor = '');

    if (!name) {
        nameEl.style.borderColor = '#e8820c';
        nameEl.focus();
        alert('Please enter your name.');
        return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailEl.style.borderColor = '#e8820c';
        emailEl.focus();
        alert('Please enter a valid email address.');
        return;
    }
    if (msg.length < 10) {
        msgEl.style.borderColor = '#e8820c';
        msgEl.focus();
        alert('Message must be at least 10 characters.');
        return;
    }

    btn.textContent = 'Sending...';
    btn.disabled = true;

    const cbName = 'gsCallback_' + Date.now();

    const timer = setTimeout(function () {
        if (window[cbName]) {
            delete window[cbName];
            var s = document.getElementById('gs-script');
            if (s) s.remove();
            btn.textContent = 'Execute Contact.run()';
            btn.disabled = false;
            alert('⏱️ Request timed out. Please try again.');
        }
    }, 12000);

    window[cbName] = function (res) {
        clearTimeout(timer);
        delete window[cbName];
        var s = document.getElementById('gs-script');
        if (s) s.remove();
        btn.textContent = 'Execute Contact.run()';
        btn.disabled = false;
        if (res && res.status === 'success') {
            alert('Message sent successfully!');
            document.getElementById('contactForm').reset();
            [nameEl, emailEl, msgEl].forEach(el => el.style.borderColor = '');
        } else {
            alert('Something went wrong. Please try again.');
        }
    };

    var params = new URLSearchParams({ name: name, email: email, message: msg, callback: cbName });
    var script = document.createElement('script');
    script.id  = 'gs-script';
    script.src = SCRIPT_URL + '?' + params.toString();
    script.onerror = function () {
        clearTimeout(timer);
        delete window[cbName];
        btn.textContent = 'Execute Contact.run()';
        btn.disabled = false;
        alert('Could not reach server. Please email: aashishsaini1226@gmail.com');
    };
    document.head.appendChild(script);
});

const logs = [
    { tag: 'INFO', msg: 'JVM 17 initializing... Loading Bootstrap classes', type: 'info' },
    { tag: 'INFO', msg: 'Creating ApplicationContext for [AashishSainiApplication]', type: 'info' },
    { tag: 'INFO', msg: 'Loading Spring Boot AutoConfiguration...', type: 'info' },
    { tag: 'INFO', msg: 'Connecting to PostgreSQL cluster on port 5432', type: 'info' },
    { tag: 'INFO', msg: 'Configuring Spring Security filter chain... JWT enabled', type: 'info' },
    { tag: 'INFO', msg: 'Running Flyway migrations: 12 applied, 0 pending', type: 'info' },
    { tag: 'OK',   msg: 'Tomcat started on port 8080 — Application ready!', type: 'ok' },
];
const logDisplay = document.getElementById('log-display');
const bootBar    = document.getElementById('boot-bar');
const bootPct    = document.getElementById('boot-pct');
let logIdx = 0;

const logTimer = setInterval(() => {
    if (logIdx < logs.length) {
        const l  = logs[logIdx];
        const el = document.createElement('div');
        el.className = 'log-line';
        el.style.animationDelay = '0s';
        el.innerHTML = `<span class="log-tag ${l.type}">[${l.tag}]</span><span class="log-msg">${l.msg}</span>`;
        logDisplay.appendChild(el);
        const pct = Math.round(((logIdx + 1) / logs.length) * 100);
        bootBar.style.width = pct + '%';
        bootPct.textContent = pct + '%';
        logIdx++;
    } else { clearInterval(logTimer); }
}, 270);

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    loader.style.transition = 'opacity 0.3s ease';
    loader.style.opacity = '0';
    document.body.classList.add('loaded');
    setTimeout(() => loader.remove(), 300);
});

const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1400);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true, antialias: false });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
camera.position.z = 480;

const wordSets = [
    { words: ['@Bean', '@Service', '@Repository', '@Component', '@Autowired', '@Transactional', '@RestController', '@Entity', '@SpringBootApplication', '@PostMapping', '@GetMapping', '@Configuration'], color: '#bbb529' },
    { words: ['Optional<T>', 'Stream.of()', 'ResponseEntity', 'List<T>', 'Map<K,V>', 'CompletableFuture', 'HttpStatus', 'JpaRepository'], color: '#5b9bd5' },
    { words: ['Hibernate', 'Flyway', 'Docker', 'PostgreSQL', 'JWT', 'JUnit5', 'Mockito', 'Spring MVC', 'Maven', 'Swagger'], color: '#6db33f' },
    { words: ['public', 'private', 'class', 'void', 'return', 'interface', 'extends', 'implements', 'static', 'final'], color: '#cc7832' },
];

const group = new THREE.Group();
scene.add(group);

let wordPool = [];
wordSets.forEach(ws => ws.words.forEach(w => wordPool.push({ text: w, color: ws.color })));
for (let i = wordPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordPool[i], wordPool[j]] = [wordPool[j], wordPool[i]];
}

for (let i = 0; i < 110; i++) {
    const entry = wordPool[i % wordPool.length];
    const c = document.createElement('canvas'); c.width = 420; c.height = 64;
    const ctx = c.getContext('2d');
    ctx.fillStyle = entry.color;
    ctx.font = '600 22px "Fira Code",monospace';
    ctx.fillText(entry.text, 6, 42);
    const tex = new THREE.CanvasTexture(c);
    const opacity = 0.28 + Math.random() * 0.22;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity });
    const spr = new THREE.Sprite(mat);
    spr.position.set(
        (Math.random() - 0.5) * 1300,
        (Math.random() - 0.5) * 1300,
        (Math.random() - 0.5) * 1200
    );
    spr.scale.set(54, 18, 1);
    spr.userData.spd    = 0.08 + Math.random() * 0.22;
    spr.userData.driftX = (Math.random() - 0.5) * 0.04;
    spr.userData.driftY = (Math.random() - 0.5) * 0.02;
    group.add(spr);
}

function animBg() {
    requestAnimationFrame(animBg);
    const scrollFactor = 1 + window.scrollY * 0.015;
    group.children.forEach(s => {
        s.position.z += s.userData.spd * scrollFactor * 0.2;
        s.position.x += s.userData.driftX;
        s.position.y += s.userData.driftY;
        if (s.position.z > 480) { s.position.z = -600; }
        if (Math.abs(s.position.x) > 700) { s.userData.driftX *= -1; }
        if (Math.abs(s.position.y) > 700) { s.userData.driftY *= -1; }
    });
    group.rotation.y += 0.00025;
    group.rotation.x += 0.00008;
    renderer.render(scene, camera);
}
animBg();

window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});


const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('active');
            const fill = e.target.querySelector('.progress-fill');
            if (fill) fill.style.width = e.target.dataset.p + '%';
        }
    });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));


const heroName = document.querySelector('.hero-name');
let mx = 0, my = 0, cx = 0, cy = 0;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (!isTouchDevice) {
    document.addEventListener('mousemove', e => {
        mx = (e.clientX / innerWidth - 0.5) * 2;
        my = (e.clientY / innerHeight - 0.5) * 2;
    });
}

function animHero() {
    requestAnimationFrame(animHero);
    const t = Date.now() * 0.0014;
    cx += (mx * 20 - cx) * 0.07;
    cy += (my * 20 - cy) * 0.07;
    const fy = Math.sin(t) * 8;
    heroName.style.transform = `translate3d(${cx}px,${cy + fy}px,0)`;
}
animHero();

if (!isTouchDevice) {
    const trail = [];
    const TRAIL_LEN = 8;
    for (let i = 0; i < TRAIL_LEN; i++) {
        const d = document.createElement('div');
        d.className = 'trail-dot';
        d.style.cssText = `position:fixed;pointer-events:none;z-index:99997;border-radius:50%;
background:rgba(109,179,63,${0.5 - i * 0.06});
width:${6 - i * 0.6}px;height:${6 - i * 0.6}px;
transform:translate(-50%,-50%);transition:none;`;
        document.body.appendChild(d);
        trail.push({ el: d, x: 0, y: 0 });
    }
    let mouseTrailX = 0, mouseTrailY = 0;
    document.addEventListener('mousemove', e => { mouseTrailX = e.clientX; mouseTrailY = e.clientY; });
    function animTrail() {
        requestAnimationFrame(animTrail);
        let x = mouseTrailX, y = mouseTrailY;
        trail.forEach((t, i) => {
            t.x += (x - t.x) * (0.35 - i * 0.03);
            t.y += (y - t.y) * (0.35 - i * 0.03);
            t.el.style.left = t.x + 'px';
            t.el.style.top  = t.y + 'px';
            x = t.x; y = t.y;
        });
    }
    animTrail();
}

const roleEl = document.querySelector('.hero-role');
const cursor = document.createElement('span');
cursor.style.cssText = 'display:inline-block;width:2px;height:1em;background:var(--string-green);vertical-align:middle;margin-left:4px;animation:cursor-blink 1.1s step-end infinite;';
const styleEl = document.createElement('style');
styleEl.textContent = '@keyframes cursor-blink{0%,100%{opacity:1;}50%{opacity:0;}}';
document.head.appendChild(styleEl);
roleEl.appendChild(cursor);
