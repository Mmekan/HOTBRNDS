const { createApp, ref, reactive, watch, onMounted, onUnmounted } = Vue;

createApp({
  setup() {
    const mode    = ref('signup');
    const isDark  = ref(true);
    const slide   = ref(0);
    const loading = ref(false);
    const error   = ref('');
    const success = ref('');
    const form    = reactive({ first:'', last:'', email:'', pw:'' });

    const slides = [
      { num:'HOT BRANDS™ 001', label:'The Collection', file:'img-01.jpg',   type:'image' },
      { num:'HOT BRANDS™ 002', label:'The Collection', file:'img-02.jpg',   type:'image' },
      { num:'HOT BRANDS™ 003', label:'The Collection', file:'img-03.jpg',   type:'image' },
      { num:'HOT BRANDS™ 004', label:'The Collection', file:'img-04.jpg',   type:'image' },
      { num:'HOT BRANDS™ 005', label:'The Collection', file:'img-05.jpg',   type:'image' },
      { num:'HOT BRANDS™ 006', label:'The Collection', file:'img-06.jpg',   type:'image' },
      { num:'HOT BRANDS™ 007', label:'The Collection', file:'img-07.jpg',   type:'image' },
      { num:'HOT BRANDS™ 008', label:'The Collection', file:'img-08.jpg',   type:'image' },
      { num:'HOT BRANDS™ 009', label:'The Collection', file:'img-09.jpg',   type:'image' },
      { num:'HOT BRANDS™ 010', label:'The Collection', file:'img-10.jpg',   type:'image' },
      { num:'HOT BRANDS™ 011', label:'The Collection', file:'img-11.jpg',   type:'image' },
      { num:'HOT BRANDS™ 012', label:'The Collection', file:'img-12.jpg',   type:'image' },
      { num:'HOT BRANDS™ 013', label:'The Collection', file:'img-15.jpg',   type:'image' },
      { num:'HOT BRANDS™ 014', label:'The Collection', file:'img-18.jpg',   type:'image' },
      // { num:'HOT BRANDS™ 015', label:'The Collection', file:'img-19.jpg', type:'image' },
      { num:'HOT BRANDS™ 016', label:'The Field',      file:'photo-12.jpg', type:'image' },
      { num:'HOT BRANDS™ 017', label:'The Field',      file:'photo-13.jpg', type:'image' },
      { num:'HOT BRANDS™ REEL',label:'Behind The Brand',file:'hb-reel.mp4', type:'video' },
    ];

    // Always derived — never breaks when images are added
    const VIDEO_INDEX = slides.findIndex(s => s.type === 'video');

    let timer = null;
    function getVideo()    { return document.getElementById('hb-video'); }
    function advance()     { slide.value = (slide.value + 1) % slides.length; }

    function goTo(i) {
      const vid = getVideo();
      if (vid && slide.value === VIDEO_INDEX) { vid.pause(); vid.currentTime = 0; }
      slide.value = i; resetTimer();
    }
    function resetTimer() {
      clearInterval(timer);
      if (slide.value !== VIDEO_INDEX) timer = setInterval(advanceFromTimer, 4800);
    }
    function toggleTheme() {
      isDark.value = !isDark.value;
      localStorage.setItem('hb-theme', isDark.value ? 'dk' : 'lt');
    }

    watch(slide, (newVal, oldVal) => {
      const vid = getVideo();
      if (!vid) return;
      if (oldVal === VIDEO_INDEX) { vid.pause(); vid.currentTime = 0; vid.onended = null; }
      if (newVal === VIDEO_INDEX) {
        clearInterval(timer); timer = null;
        setTimeout(() => {
          vid.play().catch(() => {});
          vid.onended = () => { advance(); resetTimer(); };
        }, 600);
      }
    });

    function advanceFromTimer() {
      const next = (slide.value + 1) % slides.length;
      slide.value = next;
      if (next === VIDEO_INDEX) { clearInterval(timer); timer = null; }
    }

    // ── EMAIL SIGNUP / LOGIN ──────────────────────────────
    async function submitForm() {
      error.value = ''; success.value = '';
      loading.value = true;
      try {
        if (mode.value === 'signup') {
          if (!form.first || !form.email || !form.pw) {
            error.value = 'First name, email and password are required.';
            loading.value = false; return;
          }
          if (form.pw.length < 8) {
            error.value = 'Password must be at least 8 characters.';
            loading.value = false; return;
          }
          const { data, error: err } = await window.sb.auth.signUp({
            email: form.email,
            password: form.pw,
            options: { data: { first_name: form.first, last_name: form.last } }
          });
          if (err) { error.value = err.message; loading.value = false; return; }

          // Ensure profile exists (trigger handles it, this is a safety net)
          await window.sb.from('profiles').upsert({
            id: data.user.id,
            first_name: form.first,
            last_name: form.last,
          });

          Cart.setUser({ first: form.first, last: form.last, email: form.email });
          window.location.href = 'home.html';

        } else {
          if (!form.email || !form.pw) {
            error.value = 'Please enter your email and password.';
            loading.value = false; return;
          }
          const { data, error: err } = await window.sb.auth.signInWithPassword({
            email: form.email, password: form.pw,
          });
          if (err) { error.value = err.message; loading.value = false; return; }

          const { data: profile } = await window.sb
            .from('profiles').select('*').eq('id', data.user.id).single();

          Cart.setUser({
            first: profile?.first_name || '',
            last:  profile?.last_name  || '',
            email: data.user.email,
            phone: profile?.phone      || '',
          });
          window.location.href = 'home.html';
        }
      } catch (e) {
        error.value = 'Something went wrong. Please try again.';
        loading.value = false;
      }
    }

    // ── FORGOT PASSWORD ───────────────────────────────────
    async function sendReset() {
      error.value = ''; success.value = '';
      if (!form.email) { error.value = 'Enter your email address.'; return; }
      loading.value = true;
      try {
        // redirectTo must be the full URL of your reset page
        const resetUrl = window.location.origin + '/reset-password.html';
        const { error: err } = await window.sb.auth.resetPasswordForEmail(form.email, {
          redirectTo: resetUrl,
        });
        if (err) { error.value = err.message; loading.value = false; return; }
        success.value = 'Reset link sent — check your email.';
      } catch (e) {
        error.value = 'Something went wrong. Please try again.';
      }
      loading.value = false;
    }

    onMounted(() => {
      const saved = localStorage.getItem('hb-theme');
      if (saved) isDark.value = saved === 'dk';
      timer = setInterval(advanceFromTimer, 4800);
    });
    onUnmounted(() => {
      clearInterval(timer);
      const vid = getVideo();
      if (vid) { vid.pause(); vid.onended = null; }
    });

    return {
      mode, isDark, slide, slides, form,
      loading, error, success,
      advance: advanceFromTimer, goTo, toggleTheme,
      VIDEO_INDEX, submitForm, sendReset,
    };
  }
}).mount('#app');