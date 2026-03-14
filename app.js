// ── VOID X GLOBAL JS ──

// Placeholder manga data
const MANGA_DATA = [
  { id:1, title:"Shadow Monarch", type:"Manhwa", cover:"https://picsum.photos/seed/shadow/300/450", chapters:210, rating:9.8, badge:"hot", genre:"Action", views:"2.1M", status:"Ongoing" },
  { id:2, title:"Void Walker", type:"Manhwa", cover:"https://picsum.photos/seed/void/300/450", chapters:88, rating:9.5, badge:"new", genre:"Fantasy", views:"890K", status:"Ongoing" },
  { id:3, title:"Dragon's Last Arc", type:"Manga", cover:"https://picsum.photos/seed/dragon/300/450", chapters:312, rating:9.2, badge:"completed", genre:"Adventure", views:"4.3M", status:"Completed" },
  { id:4, title:"Neon Samurai", type:"Manga", cover:"https://picsum.photos/seed/neon/300/450", chapters:140, rating:8.9, badge:"hot", genre:"Action", views:"1.2M", status:"Ongoing" },
  { id:5, title:"Blood Contract", type:"Manhwa", cover:"https://picsum.photos/seed/blood/300/450", chapters:56, rating:8.7, badge:"new", genre:"Romance", views:"450K", status:"Ongoing" },
  { id:6, title:"Celestial Sword", type:"Manhua", cover:"https://picsum.photos/seed/celestial/300/450", chapters:490, rating:8.5, badge:null, genre:"Martial Arts", views:"3.8M", status:"Ongoing" },
  { id:7, title:"The Rift King", type:"Manhwa", cover:"https://picsum.photos/seed/rift/300/450", chapters:175, rating:9.1, badge:"hot", genre:"Fantasy", views:"1.7M", status:"Ongoing" },
  { id:8, title:"Phantom Blade", type:"Manga", cover:"https://picsum.photos/seed/phantom/300/450", chapters:230, rating:8.6, badge:null, genre:"Action", views:"980K", status:"Ongoing" },
  { id:9, title:"Gate of Stars", type:"Manhua", cover:"https://picsum.photos/seed/gate/300/450", chapters:67, rating:8.3, badge:"new", genre:"Sci-Fi", views:"320K", status:"Ongoing" },
  { id:10, title:"Obsidian Crown", type:"Manhwa", cover:"https://picsum.photos/seed/obsidian/300/450", chapters:102, rating:8.8, badge:null, genre:"Drama", views:"670K", status:"Ongoing" },
];

// ── NAVBAR SCROLL ──
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 20
      ? '0 4px 30px rgba(0,0,0,0.5)'
      : 'none';
  });
}

// ── MODAL ──
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ── TOAST ──
function showToast(msg, icon = '✦') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${icon}</span> ${msg}`;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── GENRE PILLS ──
document.querySelectorAll('.genre-pill').forEach(pill => {
  pill.addEventListener('click', function() {
    const group = this.closest('.genre-scroll');
    if (group) group.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
    this.classList.toggle('active');
  });
});

// ── TAG PILLS ──
document.querySelectorAll('.tag-pill').forEach(pill => {
  pill.addEventListener('click', function() {
    this.classList.toggle('selected');
  });
});

// ── PROFILE TABS ──
document.querySelectorAll('.profile-nav-item').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.profile-nav-item').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const target = this.dataset.tab;
    document.querySelectorAll('.profile-tab-content').forEach(c => {
      c.style.display = c.dataset.tab === target ? 'block' : 'none';
    });
  });
});

// ── TABS ──
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', function() {
    const group = this.closest('.tabs');
    if (group) group.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── COVER UPLOAD ──
const coverUpload = document.getElementById('cover-upload-area');
const coverInput = document.getElementById('cover-input');
if (coverUpload && coverInput) {
  coverUpload.addEventListener('click', () => coverInput.click());
  coverInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        coverUpload.innerHTML = `
          <img src="${ev.target.result}" style="max-height:200px; border-radius:8px; margin-bottom:8px;">
          <p class="cover-upload-text">✓ Cover uploaded</p>
        `;
      };
      reader.readAsDataURL(file);
    }
  });
}

// ── CHAPTERS UPLOAD ──
const chaptersArea = document.getElementById('chapters-area');
const chaptersInput = document.getElementById('chapters-input');
if (chaptersArea && chaptersInput) {
  chaptersArea.addEventListener('click', () => chaptersInput.click());
  chaptersInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      chaptersArea.innerHTML = `
        <div style="font-size:2rem;margin-bottom:8px">📦</div>
        <p class="cover-upload-text" style="color:var(--purple-bright)">✓ ${files.length} file(s) ready</p>
        <p class="cover-upload-hint">${files.map(f=>f.name).slice(0,3).join(', ')}${files.length>3?'...':''}</p>
      `;
    }
  });
}

// ── PUBLISH FORM ──
const publishBtn = document.getElementById('publish-btn');
if (publishBtn) {
  publishBtn.addEventListener('click', () => {
    const title = document.getElementById('manga-title')?.value;
    if (!title) {
      showToast('Please enter a title first', '⚠');
      return;
    }
    showToast(`"${title}" published successfully!`, '✦');
    setTimeout(() => { window.location.href = 'index.html'; }, 2000);
  });
}

// ── READER ──
if (document.querySelector('.reader-pages')) {
  let barsVisible = true;
  let scrollTimer;
  const topbar = document.querySelector('.reader-topbar');
  const bottombar = document.querySelector('.reader-bottombar');
  const pages = document.querySelectorAll('.reader-page');
  const progressFill = document.querySelector('.progress-fill');
  const pageCounter = document.querySelector('.page-counter');
  const totalPages = pages.length;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(100, (scrollTop / docHeight) * 100);

    let currentPage = 1;
    pages.forEach((p, i) => {
      if (p.getBoundingClientRect().top <= window.innerHeight / 2) currentPage = i + 1;
    });

    if (progressFill) progressFill.style.width = progress + '%';
    if (pageCounter) pageCounter.textContent = `${currentPage} / ${totalPages}`;
  }

  window.addEventListener('scroll', () => {
    updateProgress();
    clearTimeout(scrollTimer);
    if (barsVisible) {
      barsVisible = false;
      if (topbar) topbar.classList.add('hidden');
      if (bottombar) bottombar.classList.add('hidden');
    }
    scrollTimer = setTimeout(() => {
      barsVisible = true;
      if (topbar) topbar.classList.remove('hidden');
      if (bottombar) bottombar.classList.remove('hidden');
    }, 2000);
  });

  document.addEventListener('click', () => {
    if (!barsVisible) {
      barsVisible = true;
      if (topbar) topbar.classList.remove('hidden');
      if (bottombar) bottombar.classList.remove('hidden');
    }
  });

  updateProgress();
}

// ── INTERSECTION OBSERVER ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.manga-card, .rank-item, .form-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ── SEARCH ──
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      showToast(`Searching for "${searchInput.value}"...`, '🔍');
    }
  });
}

// ── BOOKMARK ──
function toggleBookmark(btn, title) {
  const bookmarked = btn.dataset.bookmarked === 'true';
  btn.dataset.bookmarked = !bookmarked;
  btn.textContent = bookmarked ? '🔖' : '✅';
  showToast(bookmarked ? `Removed from library` : `Added to library!`, bookmarked ? '🗑' : '✦');
}
