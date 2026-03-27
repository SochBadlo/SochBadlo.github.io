/* ══════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════ */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
if (dot && ring) {
  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  function animCursor() {
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();
  document.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.6)');
    el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
  });
}

/* ══════════════════════════════════════════
   STAR CANVAS
══════════════════════════════════════════ */
(function(){
  const c = document.getElementById('star-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, stars = [];
  function resize() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
  }
  function mkStar() {
    return {
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.5+0.2,
      a: Math.random(),
      speed: Math.random()*0.003+0.001
    };
  }
  function init() { resize(); stars = Array.from({length:150}, mkStar); }
  function draw() {
    ctx.clearRect(0,0,W,H);
    stars.forEach(s => {
      s.a += s.speed;
      const alpha = (Math.sin(s.a)+1)/2 * 0.7 + 0.1;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(245,197,24,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  init(); draw();
})();

/* ══════════════════════════════════════════
   NAVBAR SCROLL
══════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', scrollY > 50);
});

/* ══════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════ */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

/* ══════════════════════════════════════════
   REVEAL ON SCROLL
══════════════════════════════════════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e,i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (i * 0.08) + 's';
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ══════════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();
  const startVal = 0;
  
  // For "since" stat, format as year
  if (target === 2015) {
    el.textContent = '2015';
    return;
  }
  
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(startVal + eased * (target - startVal));
    
    // Format nicely
    if (target >= 1000) {
      const k = current / 1000;
      el.textContent = k >= 1 ? k.toFixed(k >= 10 ? 1 : 1) + 'K' + suffix : current + suffix;
    } else {
      el.textContent = current + suffix;
    }
    
    if (progress < 1) requestAnimationFrame(update);
    else {
      if (target >= 1000) {
        const k = target / 1000;
        el.textContent = k.toFixed(1) + 'K' + suffix;
      } else {
        el.textContent = target + suffix;
      }
    }
  }
  requestAnimationFrame(update);
}

const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
statsObs.observe(document.querySelector('.stats-bar'));

/* ══════════════════════════════════════════
   MARQUEE
══════════════════════════════════════════ */
const marqueeItems = [
  { icon:'📚', text:'Chapter Notes' }, { icon:'📝', text:'Past Papers' },
  { icon:'🎯', text:'Guess Papers' }, { icon:'✅', text:'MCQs & Quizzes' },
  { icon:'🎥', text:'Live Classes' }, { icon:'💡', text:'Study Hacks' },
  { icon:'🚀', text:'Entry Test Prep' }, { icon:'🇵🇰', text:'All Pakistan Boards' },
  { icon:'24/7', text:'24/7 Support' }, { icon:'🏆', text:'Academic Excellence' },
  { icon:'📱', text:'WhatsApp Support' }, { icon:'🔔', text:'Subscribe Now' }
];
const track = document.getElementById('marqueeTrack');
if (track) {
  const allItems = [...marqueeItems, ...marqueeItems];
  track.innerHTML = allItems.map(i =>
    `<div class="marquee-item"><span>${i.icon}</span> ${i.text}</div>`
  ).join('');
}

/* ══════════════════════════════════════════
   YOUTUBE VIDEOS — RSS VIA PROXY
══════════════════════════════════════════ */
async function loadVideos() {
  const container = document.getElementById('videosContainer');
  
  // Channel ID for @SochBadloByMAK
  // Replace CHANNEL_ID below with your actual YouTube channel ID
  // You can find it at: youtube.com/@SochBadloByMAK > About > Share Channel > Copy Channel ID
  const CHANNEL_ID = 'UCJ5v_MCY6GNUBTO8-D3XoAg'; // Update with actual channel ID
  
  const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const PROXY = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`;
  
  try {
    const res = await fetch(PROXY);
    const data = await res.json();
    const xml = new DOMParser().parseFromString(data.contents, 'application/xml');
    const entries = Array.from(xml.querySelectorAll('entry')).slice(0, 9);
    
    if (!entries.length) throw new Error('No entries');
    
    container.innerHTML = entries.map(entry => {
      const id = entry.querySelector('videoId')?.textContent || '';
      const title = entry.querySelector('title')?.textContent || 'Untitled Video';
      const published = entry.querySelector('published')?.textContent || '';
      const views = entry.querySelector('statistics')?.getAttribute('viewCount') || '';
      const date = published ? new Date(published).toLocaleDateString('en-PK', {year:'numeric',month:'short',day:'numeric'}) : '';
      const thumb = id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : '';
      const url = `https://www.youtube.com/watch?v=${id}`;
      
      return `
        <a href="${url}" target="_blank" class="video-card reveal" style="text-decoration:none;">
          <div class="video-thumb">
            <img src="${thumb}" alt="${title}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22180%22><rect fill=%22%231a2240%22 width=%22320%22 height=%22180%22/><text fill=%22%23f5c518%22 font-size=%2240%22 x=%22160%22 y=%2295%22 text-anchor=%22middle%22>▶</text></svg>'">
            <div class="video-play"><div class="play-circle">▶</div></div>
          </div>
          <div class="video-info">
            <h4>${title}</h4>
            <div class="video-meta">
              <span>📅 ${date}</span>
              ${views ? `<span>👁 ${parseInt(views).toLocaleString()}</span>` : ''}
            </div>
          </div>
        </a>
      `;
    }).join('');
    
    // Re-observe new reveal elements
    container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
  } catch (err) {
    // Fallback: show hardcoded popular videos
    container.innerHTML = getFallbackVideos();
    container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
}

function getFallbackVideos() {
  const videos = [
    { id: '', title: 'Latest Chapter Notes & Study Resources', date: 'Visit YouTube for Latest' },
    { id: '', title: 'Board Exam Past Papers & Solutions', date: 'Visit YouTube for Latest' },
    { id: '', title: 'Entry Test Preparation Classes', date: 'Visit YouTube for Latest' },
    { id: '', title: 'MCQ Practice Sessions', date: 'Visit YouTube for Latest' },
    { id: '', title: 'Live Zoom Class Recordings', date: 'Visit YouTube for Latest' },
    { id: '', title: 'Guess Papers & Important Topics', date: 'Visit YouTube for Latest' },
  ];
  return videos.map(() => `
    <a href="https://www.youtube.com/@SochBadloByMAK" target="_blank" class="video-card reveal" style="text-decoration:none;">
      <div class="video-thumb" style="background:linear-gradient(135deg,#1a2240,#0d1530);display:flex;align-items:center;justify-content:center;min-height:180px;position:relative;">
        <div style="font-size:3rem;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">▶</div>
      </div>
      <div class="video-info">
        <h4>Latest Educational Content</h4>
        <div class="video-meta"><span>Visit our YouTube channel for all videos →</span></div>
      </div>
    </a>
  `).join('');
}

loadVideos();

/* ══════════════════════════════════════════
   FAQ ACCORDION
══════════════════════════════════════════ */
function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ══════════════════════════════════════════
   LOGO SWAP — replace with real image if available
══════════════════════════════════════════ */
// To add your real logo: change the #heroLogo div innerHTML to:
// <img src="your-logo.png" alt="Soch Badlo By MAK" style="width:100%;height:100%;object-fit:cover;">
// Or place your logo.png in the same folder and update:
const logoEl = document.getElementById('heroLogo');
const realLogo = new Image();
realLogo.src = 'logo.png';
realLogo.onload = () => {
  logoEl.innerHTML = '';
  realLogo.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:21px;';
  logoEl.appendChild(realLogo);
};
