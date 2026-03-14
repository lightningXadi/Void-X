// ── VOID X — SUPABASE AUTH ──
// 
// SETUP INSTRUCTIONS:
// 1. Go to https://supabase.com → create a free project
// 2. Go to Project Settings → API
// 3. Copy your Project URL and anon/public key below
// 4. In Supabase Dashboard → Authentication → URL Configuration
//    Set Site URL to your GitHub Pages URL (e.g. https://you.github.io/voidx)
//
// ─────────────────────────────────────────────
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';   // e.g. https://xyzabc.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // starts with eyJ...
// ─────────────────────────────────────────────

// Load Supabase SDK dynamically
(function loadSupabase() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  script.onload = initSupabase;
  script.onerror = () => console.warn('[VoidX] Supabase SDK failed to load — running in demo mode');
  document.head.appendChild(script);
})();

let supabase = null;
let currentUser = null;

function initSupabase() {
  try {
    if (typeof window.supabase !== 'undefined' &&
        SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL') {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      // Check if already logged in
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const name = session.user.user_metadata?.full_name
                    || session.user.user_metadata?.name
                    || session.user.email?.split('@')[0]
                    || 'Reader';
          setLoggedIn(name, false); // no animation on page reload
        }
      });
      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') setLoggedOut();
      });
    } else {
      console.info('[VoidX] Running in demo mode — configure Supabase keys to enable real auth');
    }
  } catch (e) {
    console.warn('[VoidX] Supabase init error:', e);
  }
}

// ── SWITCH AUTH TAB ──
function switchAuthTab(tab) {
  const signin = document.getElementById('panel-signin');
  const signup = document.getElementById('panel-signup');
  const tabSI  = document.getElementById('tab-signin');
  const tabSU  = document.getElementById('tab-signup');
  if (!signin || !signup) return;

  clearAuthErrors();

  if (tab === 'signin') {
    signin.style.display = 'block';
    signup.style.display = 'none';
    tabSI.classList.add('active');
    tabSU.classList.remove('active');
  } else {
    signin.style.display = 'none';
    signup.style.display = 'block';
    tabSU.classList.add('active');
    tabSI.classList.remove('active');
  }
}

function clearAuthErrors() {
  const e1 = document.getElementById('signin-error');
  const e2 = document.getElementById('signup-error');
  if (e1) { e1.textContent = ''; e1.style.display = 'none'; }
  if (e2) { e2.textContent = ''; e2.style.display = 'none'; }
}

function showAuthError(panelId, msg) {
  const el = document.getElementById(panelId);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function setButtonLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.classList.toggle('btn-loading', loading);
  btn.disabled = loading;
}

// ── SIGN IN ──
async function handleSignIn() {
  const email    = document.getElementById('signin-email')?.value?.trim();
  const password = document.getElementById('signin-password')?.value;
  clearAuthErrors();

  if (!email || !password) {
    showAuthError('signin-error', 'Please fill in all fields.');
    return;
  }

  // DEMO MODE — no real Supabase configured
  if (!supabase) {
    const demoName = email.split('@')[0];
    closeModal('auth-modal');
    setTimeout(() => showWelcomeAnimation(demoName, 'signin'), 200);
    setLoggedIn(demoName, false);
    return;
  }

  setButtonLoading('signin-btn', true);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const name = data.user.user_metadata?.full_name
              || data.user.user_metadata?.name
              || email.split('@')[0];
    closeModal('auth-modal');
    setTimeout(() => showWelcomeAnimation(name, 'signin'), 200);
    setLoggedIn(name, false);
  } catch (err) {
    showAuthError('signin-error', friendlyError(err.message));
  } finally {
    setButtonLoading('signin-btn', false);
  }
}

// ── SIGN UP ──
async function handleSignUp() {
  const name     = document.getElementById('signup-name')?.value?.trim();
  const email    = document.getElementById('signup-email')?.value?.trim();
  const password = document.getElementById('signup-password')?.value;
  clearAuthErrors();

  if (!name || !email || !password) {
    showAuthError('signup-error', 'Please fill in all fields.');
    return;
  }
  if (password.length < 6) {
    showAuthError('signup-error', 'Password must be at least 6 characters.');
    return;
  }

  // DEMO MODE
  if (!supabase) {
    closeModal('auth-modal');
    setTimeout(() => showWelcomeAnimation(name, 'signup'), 200);
    setLoggedIn(name, false);
    return;
  }

  setButtonLoading('signup-btn', true);
  try {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    });
    if (error) throw error;

    // If email confirmation is enabled in Supabase, tell the user
    if (data.user && !data.session) {
      showAuthError('signup-error', ''); // clear
      document.getElementById('signup-error').style.display = 'block';
      document.getElementById('signup-error').style.color = '#86efac';
      document.getElementById('signup-error').style.background = 'rgba(16,185,129,0.1)';
      document.getElementById('signup-error').style.borderColor = 'rgba(16,185,129,0.3)';
      document.getElementById('signup-error').textContent =
        '✓ Check your email to confirm your account!';
      setButtonLoading('signup-btn', false);
      return;
    }

    closeModal('auth-modal');
    setTimeout(() => showWelcomeAnimation(name, 'signup'), 200);
    setLoggedIn(name, false);
  } catch (err) {
    showAuthError('signup-error', friendlyError(err.message));
  } finally {
    setButtonLoading('signup-btn', false);
  }
}

// ── GOOGLE AUTH ──
async function handleGoogleAuth() {
  if (!supabase) {
    closeModal('auth-modal');
    setTimeout(() => showWelcomeAnimation('Void Reader', 'signin'), 200);
    setLoggedIn('Void Reader', false);
    return;
  }
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href }
    });
    if (error) throw error;
  } catch (err) {
    showAuthError('signin-error', friendlyError(err.message));
  }
}

// ── SIGN OUT ──
async function handleSignOut() {
  if (supabase) {
    await supabase.auth.signOut();
  }
  setLoggedOut();
  showToast('Signed out. See you in the void.', '⬡');
}

// ── UI STATE ──
function setLoggedIn(name, showAnim = true) {
  currentUser = { name };
  const out  = document.getElementById('nav-logged-out');
  const inn  = document.getElementById('nav-logged-in');
  const uname = document.getElementById('nav-username');
  const avatar = document.getElementById('nav-avatar');

  if (out) out.style.display = 'none';
  if (inn) inn.style.display = 'flex';
  if (uname) uname.textContent = name;
  if (avatar) avatar.textContent = name.charAt(0).toUpperCase();

  if (showAnim) showWelcomeAnimation(name, 'signin');
}

function setLoggedOut() {
  currentUser = null;
  const out  = document.getElementById('nav-logged-out');
  const inn  = document.getElementById('nav-logged-in');
  if (out) out.style.display = 'flex';
  if (inn) inn.style.display = 'none';
}

// ── WELCOME ANIMATION ──
function showWelcomeAnimation(name, type) {
  const overlay  = document.getElementById('welcome-overlay');
  const greeting = document.getElementById('welcome-greeting');
  const nameEl   = document.getElementById('welcome-name');
  if (!overlay) return;

  greeting.textContent = type === 'signup' ? 'Welcome,' : 'Welcome back,';
  nameEl.textContent   = name.toUpperCase();

  // Show overlay
  overlay.classList.add('active');
  // Trigger text animations (slight delay to allow reflow)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('show-content');
    });
  });

  // Dismiss after 2.2 seconds
  setTimeout(() => {
    overlay.classList.remove('show-content');
    setTimeout(() => {
      overlay.classList.remove('active');
      // Reset for next use
      overlay.querySelector('#welcome-hex').style.transition = 'none';
      overlay.querySelector('#welcome-greeting').style.transition = 'none';
      overlay.querySelector('#welcome-name').style.transition = 'none';
      requestAnimationFrame(() => {
        overlay.querySelector('#welcome-hex').style.transition = '';
        overlay.querySelector('#welcome-greeting').style.transition = '';
        overlay.querySelector('#welcome-name').style.transition = '';
      });
    }, 400);
  }, 2200);
}

// ── ERROR MESSAGES ──
function friendlyError(msg) {
  if (!msg) return 'Something went wrong. Try again.';
  msg = msg.toLowerCase();
  if (msg.includes('invalid login') || msg.includes('invalid credentials'))
    return 'Incorrect email or password.';
  if (msg.includes('email not confirmed'))
    return 'Please confirm your email first.';
  if (msg.includes('already registered') || msg.includes('user already exists'))
    return 'An account with this email already exists.';
  if (msg.includes('password'))
    return 'Password must be at least 6 characters.';
  if (msg.includes('rate limit'))
    return 'Too many attempts. Please wait a moment.';
  if (msg.includes('network') || msg.includes('fetch'))
    return 'Network error. Check your connection.';
  return msg.charAt(0).toUpperCase() + msg.slice(1);
}
