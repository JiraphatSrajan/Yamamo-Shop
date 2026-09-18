const $ = (s,root=document) => root.querySelector(s);
const $$ = (s,root=document) => [...root.querySelectorAll(s)];
const productsEl = $("#products");
const searchEl = $("#search");
const sortEl = $("#sort");
const headerSearchEl = $("#header-search");
const modal = $("#modal");
const modalBody = $("#modal-body");
const modalLabel = $("#modal-label");
const toast = $("#toast");
const cartCountEl = $("#cart-count");

let selectedFilter = "all";
let selectedFarmMap = null;
let cart = (() => { try { return JSON.parse(localStorage.getItem("yamamo-cart") || "[]"); } catch(e){ return []; }})();
let orders = (() => { try { return JSON.parse(localStorage.getItem("yamamo-orders") || "[]"); } catch(e){ return []; }})();

const orderSteps = ["รับคำสั่งซื้อ","ตรวจสอบการชำระเงิน","กำลังดำเนินการ","เสร็จสิ้น"];
const money = n => Number(n || 0).toLocaleString("th-TH");

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(()=>toast.classList.remove("show"),1800);
}
function saveCart(){ try{ localStorage.setItem("yamamo-cart",JSON.stringify(cart)); }catch(e){} }
function saveOrders(){ try{ localStorage.setItem("yamamo-orders",JSON.stringify(orders)); }catch(e){} }
function updateCartCount(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  if(cartCountEl) cartCountEl.textContent = count;
  const mobile = $("#mobile-cart-count");
  if(mobile) mobile.textContent = count;
  saveCart();
}
function openModal(label,html){
  modalLabel.textContent = label;
  modalBody.innerHTML = html;
  modal.showModal();
}
function addToCart(id){
  const p = products.find(x=>x.id===id);
  if(!p || p.soldOut || p.comingSoon || p.price==null){
    showToast("สินค้านี้ยังไม่พร้อมสั่งซื้อ");
    return;
  }
  const item = cart.find(x=>x.id===id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  updateCartCount();
  showToast("เพิ่มลงตะกร้าแล้ว");
}
function getCartTotal(){
  return cart.reduce((sum,item)=>{
    const p=products.find(x=>x.id===item.id);
    return sum + (p ? p.price*item.qty : 0);
  },0);
}

function animateRenderedCards(){
  $$("#products .product-card, #products .farm-map-card").forEach((card,index)=>{
    card.style.animationDelay = `${Math.min(index,10)*35}ms`;
  });
}

function renderFarmMaps(query=""){
  const fischImage = products.find(p=>p.farmMap==="fisch" && p.imageData)?.imageData || "";
  const farmMaps = [
    {id:"fisch",name:"Fisch",desc:"บริการรับฟาร์ม Fisch",imageData:fischImage,comingSoon:false},
    {id:"steal-an-egg",name:"Steal An Egg",desc:"บริการรับฟาร์ม Steal An Egg",comingSoon:true},
    {id:"anime-expeditions",name:"Anime Expeditions",desc:"บริการรับฟาร์ม Anime Expeditions",comingSoon:true},
    {id:"bizarre-lineage",name:"Bizarre Lineage",desc:"บริการรับฟาร์ม Bizarre Lineage",comingSoon:true},
    {id:"anime-last-stand",name:"Anime Last Stand",desc:"บริการรับฟาร์ม Anime Last Stand",comingSoon:true},
    {id:"attack-on-titan-revolution",name:"Attack on Titan Revolution",desc:"บริการรับฟาร์ม Attack on Titan Revolution",comingSoon:true},
    {id:"blox-fruits",name:"Blox Fruits",desc:"บริการรับฟาร์ม Blox Fruits",comingSoon:true},
    {id:"anime-vanguards",name:"Anime Vanguards",desc:"บริการรับฟาร์ม Anime Vanguards",comingSoon:true}
  ].filter(m=>`${m.name} ${m.desc}`.toLowerCase().includes(query));

  productsEl.classList.add("farm-map-view");
  productsEl.innerHTML = `
    <div class="farm-map-head">
      <div><span class="farm-map-kicker">FARMING SERVICE</span><h3>เลือกแมพที่ต้องการใช้บริการ</h3><p>เลือกแมพก่อน แล้วจึงเลือกรายการบริการภายในแมพนั้น</p></div>
    </div>
    ${farmMaps.map(m=>`
      <button class="farm-map-card ${m.comingSoon?"farm-map-coming":"farm-map-active"}" ${m.comingSoon?"disabled":`data-farm-map="${m.id}"`} type="button">
        <div class="farm-map-art ${m.imageData?"has-map-image":""}">
          ${m.imageData?`<img src="${m.imageData}" alt="${m.name}">`:`<span class="farm-map-symbol">FM</span>`}
          <span class="farm-map-badge">${m.comingSoon?"COMING SOON":"AVAILABLE"}</span>
          ${m.comingSoon?'<span class="farm-map-overlay">เร็วๆนี้</span>':""}
        </div>
        <div class="farm-map-info">
          <div><span class="farm-map-type">ROBLOX FARMING MAP</span><strong>${m.name}</strong><small>${m.desc}</small></div>
          <span class="farm-map-enter">${m.comingSoon?"เร็วๆนี้":"ดูบริการ →"}</span>
        </div>
      </button>
    `).join("")}
  `;
  requestAnimationFrame(animateRenderedCards);
}

function productCard(p){
  return `
    <article class="product-card ${p.soldOut?"sold-out-card":""} ${p.comingSoon?"coming-soon-card":""}">
      <div class="product-art ${p.soldOut?"sold-out-art":""} ${p.comingSoon?"coming-soon-art":""} ${p.imageData?"has-image":""}" style="--art-a:${p.artA};--art-b:${p.artB}">
        <span class="product-badge ${p.soldOut?"sold-out-badge":""} ${p.comingSoon?"coming-soon-badge":""}">${p.soldOut?"SOLD OUT":p.comingSoon?"COMING SOON":p.badge}</span>
        ${p.imageData?`<img class="product-art-image" src="${p.imageData}" alt="${p.name}">`:""}
        <span class="art-symbol ${p.category==="toycode"?"toycode-mark":""} ${p.imageData?"hidden-symbol":""}">${p.symbol}</span>
        ${p.soldOut?'<span class="sold-out-overlay">SOLD OUT</span>':""}
        ${p.comingSoon?'<span class="coming-soon-overlay">เร็วๆนี้</span>':""}
      </div>
      <div class="product-info">
        <div class="game-name">${p.game}</div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-bottom">
          ${p.comingSoon?'<span class="price coming-soon-text">เร็วๆนี้</span>':p.price==null?'<span class="price">เลือกแพ็ก</span>':`<span class="price ${p.soldOut?"sold-out-price":""}">${money(p.price)} <small>บาท</small></span>`}
          ${p.soldOut?'<button class="add-button sold-out-button" disabled>สินค้าหมด</button>':p.comingSoon?'<button class="add-button coming-soon-button" disabled>เร็วๆนี้</button>':p.price==null?'<button class="add-button" disabled>เร็วๆนี้</button>':`<button class="add-button" data-add="${p.id}">เพิ่มลงตะกร้า</button>`}
        </div>
      </div>
    </article>
  `;
}

function renderProducts(){
  const query=(searchEl.value||"").trim().toLowerCase();
  if(selectedFilter==="farm" && !selectedFarmMap){ renderFarmMaps(query); return; }
  productsEl.classList.remove("farm-map-view");
  let list=products.filter(p=>{
    if(selectedFilter==="all" && p.category==="farm") return false;
    if(selectedFilter==="farm"){
      if(p.category!=="farm" || p.farmMap!==selectedFarmMap) return false;
    }else if(selectedFilter!=="all" && p.category!==selectedFilter) return false;
    return `${p.name} ${p.game} ${p.desc}`.toLowerCase().includes(query);
  });
  if(sortEl.value==="low") list.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity));
  if(sortEl.value==="high") list.sort((a,b)=>(b.price??-Infinity)-(a.price??-Infinity));
  if(!list.length){ productsEl.innerHTML='<div class="empty">ไม่พบสินค้าที่ตรงกับการค้นหา</div>'; return; }
  const crumb = selectedFilter==="farm" && selectedFarmMap ? `
    <div class="farm-subcategory-head">
      <button class="farm-back-button" type="button" data-farm-back>← กลับไปเลือกแมพ</button>
      <div><span>FARMING SERVICE / MAP</span><h3>${selectedFarmMap==="fisch"?"Fisch":selectedFarmMap}</h3><p>เลือกรายการบริการภายในแมพนี้</p></div>
    </div>` : "";
  productsEl.innerHTML = crumb + list.map(productCard).join("");
  requestAnimationFrame(animateRenderedCards);
}
function setFilter(filter){
  selectedFilter=filter;
  selectedFarmMap=null;
  $$("#filters button").forEach(b=>b.classList.toggle("selected",b.dataset.filter===filter));
  renderProducts();
  $("#store")?.scrollIntoView({behavior:"smooth",block:"start"});
}

function openCart(){
  if(!cart.length){
    openModal("ตะกร้าสินค้า",`<div class="cart-empty-state"><div class="cart-empty-icon">🛒</div><h2 class="modal-title">ตะกร้ายังว่าง</h2><p class="muted">เลือกสินค้าที่ต้องการ แล้วกด “เพิ่มลงตะกร้า”</p><button class="full" data-close-demo>เลือกดูสินค้า</button></div>`);
    return;
  }
  const rows=cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    if(!p) return "";
    return `<div class="cart-product-row">
      <div class="cart-product-icon" style="--cart-a:${p.artA};--cart-b:${p.artB}">${p.symbol}</div>
      <div class="cart-product-copy"><strong>${p.name}</strong><small>${money(p.price)} บาท / ชิ้น</small><button class="cart-remove" data-remove="${p.id}">ลบสินค้า</button></div>
      <div class="cart-line-right"><div class="quantity"><button data-qty="${p.id}" data-dir="-1">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-dir="1">+</button></div><b>${money(p.price*item.qty)} บาท</b></div>
    </div>`;
  }).join("");
  const total=getCartTotal();
  openModal("ตะกร้าสินค้า",`
    <div class="cart-modal-head"><div><h2 class="modal-title">รายการในตะกร้า</h2><p class="muted">${cart.reduce((s,i)=>s+i.qty,0)} ชิ้น</p></div><button class="cart-clear" data-clear-cart>ล้างตะกร้า</button></div>
    <div class="cart-products">${rows}</div>
    <div class="cart-summary"><div><span>ยอดสินค้า</span><strong>${money(total)} บาท</strong></div><div><span>ค่าธรรมเนียม</span><strong>0 บาท</strong></div><div class="grand-total"><span>ยอดรวมทั้งหมด</span><strong>${money(total)} บาท</strong></div></div>
    <button class="full checkout-button" data-checkout>ไปหน้าชำระเงิน · ${money(total)} บาท</button>
  `);
}

function openCheckout(){
  if(!cart.length){openCart();return}
  const total=getCartTotal();
  const rows=cart.map(item=>{const p=products.find(x=>x.id===item.id);return p?`<div class="checkout-mini-row"><span>${p.name} × ${item.qty}</span><b>${money(p.price*item.qty)} บาท</b></div>`:""}).join("");
  openModal("ชำระเงิน",`
    <div class="checkout-wrap"><h2 class="modal-title">ยืนยันการชำระเงิน</h2><p class="muted">ตรวจสอบรายการและเลือกช่องทางชำระเงิน</p>
    <div class="checkout-order-list">${rows}</div><div class="checkout-total"><span>ยอดที่ต้องชำระ</span><strong>${money(total)} บาท</strong></div>
    <div class="payment-method-title">เลือกช่องทางชำระเงิน</div>
    <div class="checkout-methods">
      <button class="checkout-method active" data-paymethod="qr"><span class="checkout-method-icon">▦</span><span><b>QR Code</b><small>สแกนเพื่อชำระเงิน</small></span></button>
      <button class="checkout-method" data-paymethod="angpao"><span class="checkout-method-icon">◎</span><span><b>ซองอั่งเปา</b><small>วางลิงก์ซองของขวัญ</small></span></button>
      <button class="checkout-method" data-paymethod="wallet"><span class="checkout-method-icon">฿</span><span><b>TrueMoney Wallet</b><small>ชำระผ่าน Wallet</small></span></button>
    </div>
    <input type="hidden" id="selected-payment-method" value="qr">
    <button class="full checkout-button" data-confirm-payment>ชำระเงิน ${money(total)} บาท</button>
    <p class="checkout-demo-note">ระบบนี้เป็น UI Demo และยังไม่มีการรับเงินจริง</p></div>
  `);
}

function createOrder(method){
  const order={
    id:"YM-"+Date.now().toString().slice(-8)+Math.floor(10+Math.random()*90),
    createdAt:new Date().toISOString(),paymentMethod:method,total:getCartTotal(),statusIndex:1,
    items:cart.map(i=>{const p=products.find(x=>x.id===i.id);return {id:i.id,name:p?.name||"สินค้า",qty:i.qty,price:p?.price||0}})
  };
  orders.unshift(order); orders=orders.slice(0,20); saveOrders(); return order;
}
function fmtDate(iso){try{return new Intl.DateTimeFormat("th-TH",{dateStyle:"medium",timeStyle:"short"}).format(new Date(iso))}catch(e){return iso}}
function payName(m){return {qr:"QR Code",angpao:"ซองอั่งเปา",wallet:"TrueMoney Wallet"}[m]||m}
function openPaymentSuccess(method){
  const order=createOrder(method);
  openModal("ชำระเงิน",`<div class="payment-success"><div class="payment-success-icon">✓</div><h2 class="modal-title">สร้างคำสั่งซื้อแล้ว</h2><p class="muted">เลขออเดอร์ของคุณ</p><div class="payment-order-id">${order.id}</div><div class="payment-success-total">${money(order.total)} บาท</div><p class="checkout-demo-note">สถานะเริ่มต้น: ${orderSteps[order.statusIndex]} · Portfolio Demo ไม่มีการรับเงินจริง</p><div class="payment-success-actions"><button class="full secondary-full" data-track-order="${order.id}">ดูสถานะออเดอร์</button><button class="full" data-finish-demo>เสร็จสิ้น Demo</button></div></div>`);
}

function orderMarkup(o){
  const steps=orderSteps.map((s,i)=>`<div class="order-step ${i<o.statusIndex?"done":i===o.statusIndex?"active":""}"><span class="order-step-dot">${i<o.statusIndex?"✓":i+1}</span><div><strong>${s}</strong><small>${i===o.statusIndex?"สถานะปัจจุบัน":i<o.statusIndex?"เสร็จแล้ว":"รอดำเนินการ"}</small></div></div>`).join("");
  const items=o.items.map(i=>`<div class="order-track-item"><span>${i.name} × ${i.qty}</span><b>${money(i.price*i.qty)} บาท</b></div>`).join("");
  return `<div class="order-track-card"><div class="order-track-top"><div><span class="order-track-kicker">ORDER STATUS</span><h3>${o.id}</h3><p>${fmtDate(o.createdAt)}</p></div><span class="order-track-status">${orderSteps[o.statusIndex]}</span></div><div class="order-progress">${steps}</div><div class="order-track-items">${items}</div><div class="order-track-summary"><div><span>ช่องทางชำระเงิน</span><b>${payName(o.paymentMethod)}</b></div><div><span>ยอดรวม</span><b>${money(o.total)} บาท</b></div></div>${o.statusIndex<3?`<button class="order-demo-next" data-order-next="${o.id}">จำลองสถานะถัดไป</button>`:'<div class="order-complete-note">คำสั่งซื้อนี้ดำเนินการเสร็จสิ้นแล้ว</div>'}</div>`;
}
function openOrderStatus(id=""){
  const o=id?orders.find(x=>x.id.toLowerCase()===id.trim().toLowerCase()):orders[0];
  const recent=orders.slice(0,5).map(x=>`<button class="recent-order-row" data-order-pick="${x.id}"><span><b>${x.id}</b><small>${fmtDate(x.createdAt)}</small></span><span>${orderSteps[x.statusIndex]} →</span></button>`).join("");
  openModal("ติดตามคำสั่งซื้อ",`<div class="order-status-modal"><span class="order-track-kicker">TRACK YOUR ORDER</span><h2 class="modal-title">สถานะคำสั่งซื้อ</h2><p class="muted">กรอกเลขออเดอร์เพื่อตรวจสอบสถานะ</p><div class="order-search-box"><input id="order-search-input" value="${id}" placeholder="เช่น YM-12345678"><button data-order-search>ค้นหา</button></div>${o?orderMarkup(o):id?'<div class="order-not-found"><strong>ไม่พบเลขคำสั่งซื้อ</strong><span>ตรวจสอบเลขออเดอร์อีกครั้ง</span></div>':'<div class="order-empty-state"><div>◎</div><strong>ยังไม่มีคำสั่งซื้อ</strong><span>ลอง Checkout Demo ก่อน</span></div>'}${recent?`<div class="recent-orders"><span class="recent-orders-title">ออเดอร์ล่าสุด</span>${recent}</div>`:""}</div>`);
}

function openAccount(tab="login"){
  openModal("บัญชีผู้ใช้",`<div class="auth-modal"><div class="auth-heading"><span class="auth-kicker">YAMAMO ACCOUNT</span><h2 class="modal-title">บัญชีผู้ใช้</h2><p class="muted">เข้าสู่ระบบหรือสร้างบัญชีใหม่ได้จากหน้าต่างเดียว</p></div><div class="auth-tabs"><button class="auth-tab ${tab==="login"?"active":""}" data-auth-tab="login">เข้าสู่ระบบ</button><button class="auth-tab ${tab==="register"?"active":""}" data-auth-tab="register">สมัครสมาชิก</button></div><div class="auth-panel ${tab==="login"?"active":""}" data-auth-panel="login"><label class="form-field">อีเมล<input type="email" placeholder="you@example.com"></label><label class="form-field">รหัสผ่าน<input type="password" placeholder="••••••••"></label><div class="auth-row"><label class="auth-remember"><input type="checkbox"><span>จดจำฉันไว้</span></label><button class="auth-link" data-auth-forgot>ลืมรหัสผ่าน?</button></div><button class="full" data-demo-login>เข้าสู่ระบบ</button></div><div class="auth-panel ${tab==="register"?"active":""}" data-auth-panel="register"><label class="form-field">ชื่อผู้ใช้<input type="text" placeholder="ชื่อที่ต้องการแสดง"></label><label class="form-field">อีเมล<input type="email" placeholder="you@example.com"></label><label class="form-field">รหัสผ่าน<input type="password" placeholder="อย่างน้อย 8 ตัวอักษร"></label><button class="full" data-demo-register>สร้างบัญชี</button><p class="auth-note">ระบบบัญชีส่วนนี้เป็น UI Demo สำหรับ Portfolio</p></div></div>`);
}

$("#filters").addEventListener("click",e=>{const b=e.target.closest("button[data-filter]");if(b)setFilter(b.dataset.filter)});
document.addEventListener("click",e=>{
  const farm=e.target.closest("[data-farm-map]"); if(farm){selectedFilter="farm";selectedFarmMap=farm.dataset.farmMap;renderProducts();$("#store")?.scrollIntoView({behavior:"smooth"});return}
  if(e.target.closest("[data-farm-back]")){selectedFilter="farm";selectedFarmMap=null;renderProducts();return}
  const add=e.target.closest("[data-add]"); if(add)addToCart(Number(add.dataset.add));
  const cat=e.target.closest("[data-category]"); if(cat)setFilter(cat.dataset.category);
  const action=e.target.closest("[data-action]");
  if(action){
    if(action.dataset.action==="cart")openCart();
    if(action.dataset.action==="order-status")openOrderStatus();
    if(action.dataset.action==="account")openAccount();
    if(action.dataset.action==="mobile-menu")$("#mobile-menu-panel")?.classList.toggle("open");
  }
  const qty=e.target.closest("[data-qty]"); if(qty){const item=cart.find(x=>x.id===Number(qty.dataset.qty));if(item){item.qty+=Number(qty.dataset.dir);if(item.qty<=0)cart=cart.filter(x=>x!==item);updateCartCount();openCart()}}
  const rem=e.target.closest("[data-remove]"); if(rem){cart=cart.filter(x=>x.id!==Number(rem.dataset.remove));updateCartCount();openCart()}
  if(e.target.closest("[data-clear-cart]")){cart=[];updateCartCount();openCart()}
  if(e.target.closest("[data-checkout]"))openCheckout();
  const pm=e.target.closest("[data-paymethod]"); if(pm){$$(".checkout-method").forEach(b=>b.classList.toggle("active",b===pm));$("#selected-payment-method").value=pm.dataset.paymethod}
  if(e.target.closest("[data-confirm-payment]"))openPaymentSuccess($("#selected-payment-method")?.value||"qr");
  const tr=e.target.closest("[data-track-order]"); if(tr)openOrderStatus(tr.dataset.trackOrder);
  if(e.target.closest("[data-order-search]"))openOrderStatus($("#order-search-input")?.value||"");
  const pick=e.target.closest("[data-order-pick]"); if(pick)openOrderStatus(pick.dataset.orderPick);
  const next=e.target.closest("[data-order-next]"); if(next){const o=orders.find(x=>x.id===next.dataset.orderNext);if(o){o.statusIndex=Math.min(o.statusIndex+1,3);saveOrders();openOrderStatus(o.id)}}
  if(e.target.closest("[data-finish-demo]")){cart=[];updateCartCount();modal.close();showToast("เสร็จสิ้นขั้นตอน Demo")}
  const tab=e.target.closest("[data-auth-tab]"); if(tab){$$(".auth-tab").forEach(b=>b.classList.toggle("active",b.dataset.authTab===tab.dataset.authTab));$$(".auth-panel").forEach(p=>p.classList.toggle("active",p.dataset.authPanel===tab.dataset.authTab));return}
  if(e.target.closest("[data-auth-forgot]"))showToast("ระบบกู้รหัสผ่านเป็น Demo");
  if(e.target.closest("[data-demo-login]")){showToast("เข้าสู่ระบบตัวอย่างแล้ว");modal.close()}
  if(e.target.closest("[data-demo-register]")){showToast("สร้างบัญชีตัวอย่างแล้ว");modal.close()}
  if(e.target.closest("[data-close-demo]"))modal.close();
});

searchEl.addEventListener("input",renderProducts);
sortEl.addEventListener("change",renderProducts);
headerSearchEl.addEventListener("input",()=>{searchEl.value=headerSearchEl.value;renderProducts()});
headerSearchEl.addEventListener("keydown",e=>{if(e.key==="Enter")$("#store").scrollIntoView({behavior:"smooth"})});
$("#close-modal").addEventListener("click",()=>modal.close());
modal.addEventListener("click",e=>{const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close()});

$$(".faq-question").forEach(btn=>btn.addEventListener("click",()=>{
  const item=btn.closest(".faq-item"); const open=item.classList.contains("open");
  $$(".faq-item.open").forEach(x=>x.classList.remove("open"));
  if(!open)item.classList.add("open");
}));
$$(".category-card[data-category]").forEach(card=>card.addEventListener("click",()=>setFilter(card.dataset.category)));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target)}}),{threshold:.12});
$$(".reveal-zone").forEach(el=>{revealObserver.observe(el);setTimeout(()=>el.classList.add("visible"),900)});

const hero=$(".hero-banner"), visual=$(".banner-visual");
if(hero&&visual){
  hero.addEventListener("mousemove",e=>{const r=hero.getBoundingClientRect();const x=((e.clientX-r.left)/r.width-.5)*10;const y=((e.clientY-r.top)/r.height-.5)*10;visual.style.transform=`translate3d(${x}px,${y}px,0)`});
  hero.addEventListener("mouseleave",()=>visual.style.transform="");
}

updateCartCount();
renderProducts();
