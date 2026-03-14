# ⬡ VOID X — Manga & Manhwa Reading Platform

A fully functional manga/manhwa reading and publishing website built with pure HTML, CSS, and JavaScript.

## 📁 File Structure

```
voidx/
├── index.html        ← Homepage (trending, featured, rankings)
├── reader.html       ← Chapter reader
├── upload.html       ← Creator publish page
├── profile.html      ← User profile & library
├── css/
│   └── style.css     ← All styles (void dark theme)
└── js/
    └── app.js        ← All JavaScript interactions
```

## 🚀 Deploy to GitHub Pages (Free)

1. Create a new GitHub repository named `voidx`
2. Upload all files keeping the same folder structure
3. Go to **Settings → Pages**
4. Set **Source** to `main` branch → `/ (root)`
5. Click **Save** — live at: `https://yourusername.github.io/voidx/`

## 🔧 Adding Real Backend (for Login & Publishing)

GitHub Pages only hosts static files. For real user accounts + publishing:

### Option A: Supabase (Recommended — Free)
- Auth + Database + File Storage (500MB free)
- https://supabase.com

### Option B: Firebase (Google — Free)
- Firestore, Auth, Storage, Hosting
- https://firebase.google.com

### Option C: Vercel / Netlify (Free hosting + serverless)
- Add API routes without needing a separate server

## 🎨 Theme Customization

Edit CSS variables in `css/style.css`:
```css
--purple: #7c3aed;
--purple-bright: #a855f7;
--glow: #c084fc;
```

---
Built for Void X · © 2025
