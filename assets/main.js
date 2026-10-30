(() => {
  // Mobile menu
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  const setMenu = (open) => {
    menu.classList.toggle('hidden', !open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  btn.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Fade-in on scroll
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('is-visible'));
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  // Form
  const form = document.getElementById('appt-form');
  const dateInput = document.getElementById('date');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  dateInput.min = today.toISOString().split('T')[0];

  const rules = {
    name:    v => v.trim().length >= 2 ? '' : 'Please enter your full name.',
    phone:   v => /^(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(v.trim()) ? '' : 'Enter a valid Indian mobile number, e.g. +91 98765 43210.',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address.',
    date:    v => !v ? 'Please choose a date.' : (new Date(v) < today ? 'Date cannot be in the past.' : ''),
    time:    v => v ? '' : 'Please select a time slot.',
    service: v => v ? '' : 'Please select a service.'
  };

  const showError = (field, msg) => {
    const el = document.getElementById(field + '-err');
    const input = document.getElementById(field);
    el.textContent = msg;
    el.classList.toggle('hidden', !msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    input.classList.toggle('border-red-600', !!msg);
  };

  Object.keys(rules).forEach(f => {
    const input = document.getElementById(f);
    input.addEventListener('blur', () => showError(f, rules[f](input.value)));
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') showError(f, rules[f](input.value)); });
  });

  const toast = document.getElementById('toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 5000);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let firstInvalid = null;
    Object.keys(rules).forEach(f => {
      const input = document.getElementById(f);
      const msg = rules[f](input.value);
      showError(f, msg);
      if (msg && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    const data = Object.fromEntries(new FormData(form).entries());

    // TODO: Replace this simulated delay with a real API call, e.g.
    // await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true; submitBtn.textContent = 'Sending…';
    await new Promise(r => setTimeout(r, 900));
    console.log('Simulated appointment request:', data);

    submitBtn.disabled = false; submitBtn.textContent = 'Request Appointment';
    form.reset();
    showToast(`Thank you, ${data.name.split(' ')[0]}! Your request is received. We'll call you shortly to confirm.`);
  });
})();
