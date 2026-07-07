// HOT BRANDS™ — Shared Cart Manager
// Replace WA_NUMBER with your real WhatsApp business number

window.Cart = (() => {
  const CART_KEY = 'hb-cart';
  const USER_KEY = 'hb-user';
  const WA_NUMBER = '2349139933721';

  /* ── STATE ── */
  function getItems() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
  }
  function save(items) { localStorage.setItem(CART_KEY, JSON.stringify(items)); _badge(); _render(); }
  function getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
  }
  function setUser(u) { localStorage.setItem(USER_KEY, JSON.stringify(u)); }
  function getTotal() { return getItems().reduce((s, i) => s + i.price * i.qty, 0); }
  function getCount() { return getItems().reduce((s, i) => s + i.qty, 0); }

  /* ── MUTATIONS ── */
  function addItem(product) {
    const items = getItems();
    const key = `${product.id}|${product.size}|${product.color}`;
    const found = items.find(i => `${i.id}|${i.size}|${i.color}` === key);
    if (found) { found.qty += 1; } else { items.push({ ...product, qty: 1 }); }
    save(items); open();
  }
  function remove(id, size, color) {
    save(getItems().filter(i => !(String(i.id)===String(id) && i.size===size && i.color===color)));
  }
  function updateQty(id, size, color, qty) {
    if (qty <= 0) { remove(id, size, color); return; }
    const items = getItems();
    const found = items.find(i => String(i.id)===String(id) && i.size===size && i.color===color);
    if (found) { found.qty = qty; save(items); }
  }

  /* ── DRAWER ── */
  function open() {
    document.getElementById('cartDrawer')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden'; _render();
  }
  function close() {
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.getElementById('cartOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function _badge() {
    const count = getCount();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count; el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  function _render() {
    const drawer = document.getElementById('cartDrawer');
    if (!drawer) return;
    const items = getItems(), user = getUser();
    const greet = drawer.querySelector('.cart-greeting');
    if (greet) greet.textContent = user?.first ? `Hey, ${user.first}.` : 'Your Cart.';
    const list = drawer.querySelector('.cart-items');
    if (list) {
      list.innerHTML = !items.length
        ? `<div class="cart-empty"><div class="cart-empty-icon">◯</div><div class="cart-empty-text">Nothing here yet.<br>Go find your piece.</div></div>`
        : items.map(it => `
          <div class="cart-item">
            <div class="ci-thumb" style="background:${it.thumbColor||'#1a1a1a'}"><span>${(it.cat||'HB').slice(0,3).toUpperCase()}</span></div>
            <div class="ci-info">
              <div class="ci-name">${it.name}</div>
              <div class="ci-meta">${it.size?it.size+' · ':''}₦${it.price.toLocaleString()}</div>
            </div>
            <div class="ci-controls">
              <button class="ci-qty-btn" onclick="Cart.updateQty('${it.id}','${it.size||''}','${it.color||''}',${it.qty-1})">−</button>
              <span class="ci-qty">${it.qty}</span>
              <button class="ci-qty-btn" onclick="Cart.updateQty('${it.id}','${it.size||''}','${it.color||''}',${it.qty+1})">+</button>
              <button class="ci-remove" onclick="Cart.remove('${it.id}','${it.size||''}','${it.color||''}')">✕</button>
            </div>
          </div>`).join('');
    }
    const totEl = drawer.querySelector('.cart-total-amount');
    if (totEl) totEl.textContent = `₦${getTotal().toLocaleString()}`;
    const footer = drawer.querySelector('.cart-footer');
    if (footer) footer.style.display = items.length ? 'block' : 'none';
  }

  /* ── DELIVERY MODAL ── */
  function _injectDeliveryModal() {
    if (document.getElementById('dmWrap')) return;
    const wrap = document.createElement('div');
    wrap.id = 'dmWrap';
    wrap.innerHTML = `
      <div class="dm-overlay" id="dmOverlay"></div>
      <div class="dm-panel" id="dmPanel">
        <div class="dm-head">
          <div><div class="dm-title">DELIVERY DETAILS</div><div class="dm-sub">Fill in before we open WhatsApp</div></div>
          <button class="dm-x" id="dmClose">✕</button>
        </div>
        <div class="dm-body">
          <div class="dm-field">
            <label class="dm-lbl">DELIVERY CITY</label>
            <input class="dm-inp" id="dmCity" type="text" placeholder="e.g. Lagos, Abuja, Port Harcourt, Uyo">
          </div>
          <div class="dm-field">
            <label class="dm-lbl">DELIVERY ADDRESS</label>
            <input class="dm-inp" id="dmAddress" type="text" placeholder="Street, area, nearest landmark">
          </div>
          <div class="dm-field">
            <label class="dm-lbl">PAYMENT PREFERENCE</label>
            <select class="dm-inp dm-sel" id="dmPayment">
              <option value="">Select...</option>
              <option value="Pay on delivery">Pay on delivery</option>
              <option value="Bank transfer before delivery">Bank transfer before delivery</option>
              <option value="Online — Paystack">Online — Paystack</option>
            </select>
          </div>
          <div class="dm-field">
            <label class="dm-lbl">NOTES <span style="opacity:.4;font-weight:400;letter-spacing:0;text-transform:none">(optional)</span></label>
            <input class="dm-inp" id="dmNotes" type="text" placeholder="Special instructions, alternate contact, etc.">
          </div>
        </div>
        <div class="dm-err" id="dmErr" style="display:none;">Please fill in city, address and payment preference.</div>
        <button class="dm-submit" id="dmSubmit">
          <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          Send Order via WhatsApp
        </button>
      </div>`;
    document.body.appendChild(wrap);

    const s = document.createElement('style');
    s.textContent = `
      .dm-overlay{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,0.78);opacity:0;pointer-events:none;transition:opacity 300ms ease;}
      .dm-overlay.open{opacity:1;pointer-events:auto;}
      .dm-panel{
        position:fixed;top:50%;left:50%;z-index:301;
        transform:translate(-50%,-50%) scale(.96);
        width:min(480px,calc(100vw - 24px));
        background:var(--card,#111111);
        border:1px solid var(--card-border,rgba(255,255,255,0.07));
        opacity:0;pointer-events:none;
        transition:opacity 280ms ease,transform 280ms ease;
      }
      .dm-panel.open{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1);}
      .dm-head{padding:22px 22px 16px;border-bottom:1px solid var(--card-border,rgba(255,255,255,0.07));display:flex;align-items:flex-start;justify-content:space-between;}
      .dm-title{font-family:'Anton',sans-serif;font-size:20px;letter-spacing:.06em;color:var(--text,#F4F1EA);}
      .dm-sub{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--sub,#888);margin-top:3px;}
      .dm-x{background:none;border:1px solid var(--card-border,rgba(255,255,255,0.07));color:var(--text,#F4F1EA);width:30px;height:30px;flex-shrink:0;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;transition:border-color 180ms,color 180ms;}
      .dm-x:hover{border-color:#D81C1C;color:#D81C1C;}
      .dm-body{padding:18px 22px 4px;}
      .dm-field{margin-bottom:18px;}
      .dm-lbl{display:block;font-size:9px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:var(--sub,#888);margin-bottom:8px;}
      .dm-inp{width:100%;background:transparent;border:none;border-bottom:1px solid var(--inp-border,#2e2e2e);padding:9px 0;font-size:14px;color:var(--text,#F4F1EA);font-family:'Inter',sans-serif;outline:none;border-radius:0;transition:border-color 200ms;}
      .dm-inp:focus{border-bottom-color:#D81C1C;}
      .dm-inp::placeholder{color:var(--sub,#888);opacity:.7;}
      .dm-sel{cursor:pointer;}
      .dm-sel option{background:#111;color:#F4F1EA;}
      .dm-inp.dm-error{border-bottom-color:#D81C1C !important;}
      .dm-err{margin:0 22px 10px;padding:10px 14px;background:rgba(216,28,28,0.1);border-left:2px solid #D81C1C;font-size:11px;font-weight:700;letter-spacing:.06em;color:#D81C1C;text-transform:uppercase;}
      .dm-submit{width:100%;padding:16px 20px;background:#D81C1C;color:#fff;border:none;font-family:'Anton',sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background 200ms;}
      .dm-submit:hover{background:#A91414;}
    `;
    document.head.appendChild(s);

    document.getElementById('dmOverlay').addEventListener('click', _closeDeliveryModal);
    document.getElementById('dmClose').addEventListener('click', _closeDeliveryModal);
    document.getElementById('dmSubmit').addEventListener('click', _submitDelivery);
  }

  function _openDeliveryModal() {
    ['dmCity','dmAddress','dmNotes'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.classList.remove('dm-error'); }
    });
    const sel = document.getElementById('dmPayment');
    if (sel) { sel.value = ''; sel.classList.remove('dm-error'); }
    const err = document.getElementById('dmErr');
    if (err) err.style.display = 'none';
    document.getElementById('dmOverlay')?.classList.add('open');
    document.getElementById('dmPanel')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function _closeDeliveryModal() {
    document.getElementById('dmOverlay')?.classList.remove('open');
    document.getElementById('dmPanel')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function _submitDelivery() {
    const city    = document.getElementById('dmCity')?.value.trim();
    const address = document.getElementById('dmAddress')?.value.trim();
    const payment = document.getElementById('dmPayment')?.value;
    const notes   = document.getElementById('dmNotes')?.value.trim();
    let hasError = false;
    [['dmCity',city],['dmAddress',address],['dmPayment',payment]].forEach(([id,val]) => {
      const el = document.getElementById(id);
      if (!val) { el?.classList.add('dm-error'); hasError = true; }
      else el?.classList.remove('dm-error');
    });
    if (hasError) {
      const err = document.getElementById('dmErr');
      if (err) err.style.display = 'block';
      return;
    }
    _closeDeliveryModal();
    window.open(`https://wa.me/${WA_NUMBER}?text=${_waMsg({city,address,payment,notes})}`, '_blank');
  }

  /* ── WHATSAPP MESSAGE ── */
  function _waMsg(delivery = {}) {
    const items = getItems(), user = getUser();
    let msg = `*HOT BRANDS™ — Order Request*\n\n`;
    msg += `*Customer:*\n`;
    msg += `Name: ${user?.first||''} ${user?.last||''}\n`;
    if (user?.email) msg += `Email: ${user.email}\n`;
    if (user?.phone) msg += `WhatsApp: ${user.phone}\n`;
    msg += `\n*Items:*\n`;
    items.forEach(i => {
      msg += `• ${i.name}${i.size?` (${i.size})`:''} × ${i.qty}  =  ₦${(i.price*i.qty).toLocaleString()}\n`;
    });
    msg += `\n*Total: ₦${getTotal().toLocaleString()}*\n\n`;
    msg += `*Delivery Details:*\n`;
    msg += `City: ${delivery.city||'—'}\n`;
    msg += `Address: ${delivery.address||'—'}\n`;
    msg += `Payment: ${delivery.payment||'—'}\n`;
    if (delivery.notes) msg += `Notes: ${delivery.notes}\n`;
    return encodeURIComponent(msg);
  }

  /* ── INIT ── */
  function init() {
    _badge(); _render(); _injectDeliveryModal();
    document.querySelectorAll('.cart-btn').forEach(b => b.addEventListener('click', open));
    document.querySelectorAll('.cart-close').forEach(b => b.addEventListener('click', close));
    document.getElementById('cartOverlay')?.addEventListener('click', close);
    document.getElementById('cartWhatsapp')?.addEventListener('click', () => {
      if (!getItems().length) return;
      close();
      setTimeout(_openDeliveryModal, 320);
    });
    document.getElementById('cartCheckout')?.addEventListener('click', () => {
      alert('Paystack checkout — plug in your Paystack inline handler here.');
    });
  }

  return { init, addItem, remove, updateQty, open, close, getUser, setUser, getItems };
})();