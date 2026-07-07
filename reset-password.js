// HOT BRANDS™ — Password Reset Handler

const content = document.getElementById('content');

function showError(msg) {
  content.innerHTML = `
    <div class="headline">"LINK<br><em>EXPIRED."</em></div>
    <p class="sub">Something went wrong</p>
    <div class="msg error">${msg}</div>
    <a href="index.html" class="back">← Request a new reset link</a>`;
}

function showForm() {
  content.innerHTML = `
    <div class="headline">"NEW<br><em>PASSWORD."</em></div>
    <p class="sub">Choose something you'll remember</p>
    <div id="msg"></div>
    <div class="field">
      <label>New Password</label>
      <input type="password" id="pw1" name="new-password"
        autocomplete="new-password" placeholder="Min. 8 characters">
    </div>
    <div class="field">
      <label>Confirm Password</label>
      <input type="password" id="pw2" name="new-password"
        autocomplete="new-password" placeholder="Same password again">
    </div>
    <button class="btn" id="submitBtn">Set New Password</button>
    <a href="index.html" class="back">← Back to login</a>`;

  document.getElementById('submitBtn').addEventListener('click', submitNewPassword);
  document.getElementById('pw2').addEventListener('keyup', e => {
    if (e.key === 'Enter') submitNewPassword();
  });
}

async function submitNewPassword() {
  const pw1 = document.getElementById('pw1').value;
  const pw2 = document.getElementById('pw2').value;
  const msgEl = document.getElementById('msg');
  const btn   = document.getElementById('submitBtn');

  if (pw1.length < 8) {
    msgEl.innerHTML = `<div class="msg error">Password must be at least 8 characters.</div>`;
    return;
  }
  if (pw1 !== pw2) {
    msgEl.innerHTML = `<div class="msg error">Passwords don't match.</div>`;
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Updating...';

  const { error } = await window.sb.auth.updateUser({ password: pw1 });

  if (error) {
    msgEl.innerHTML = `<div class="msg error">${error.message}</div>`;
    btn.disabled = false;
    btn.textContent = 'Set New Password';
    return;
  }

  // Password updated — sign out and send to login with a success message
  await window.sb.auth.signOut();
  content.innerHTML = `
    <div class="headline">"ALL<br><em>GOOD."</em></div>
    <p class="sub">Password updated successfully</p>
    <div class="msg success">Your password has been reset. Log in with your new password.</div>
    <a href="index.html" class="back" style="display:block;margin-top:0;">
      <button class="btn" style="margin-top:0;">Go to Log In</button>
    </a>`;
}

// ── ON PAGE LOAD ──────────────────────────────────────────
// Supabase listens for the PASSWORD_RECOVERY event from the
// reset link in the email. When it fires, we show the form.
// If the link is invalid or expired, we show an error.

window.sb.auth.onAuthStateChange((event, session) => {
  if (event === 'PASSWORD_RECOVERY') {
    showForm();
  }
});

// Fallback: also check if there's already a session from the link
(async () => {
  try {
    // Handle PKCE code exchange if present in URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      const { error } = await window.sb.auth.exchangeCodeForSession(code);
      if (error) { showError(error.message); return; }
      showForm(); return;
    }

    // Give the onAuthStateChange listener 1.5s to fire before showing error
    setTimeout(() => {
      if (content.querySelector('.loading-msg')) {
        showError('This reset link is invalid or has expired. Please request a new one.');
      }
    }, 1500);

  } catch (e) {
    showError('Something went wrong. Please request a new reset link.');
  }
})();
