/* ===== Cấu hình nhanh ===== */
const FULL_NAME = "ApplwNgoo";
const BIRTH_YEAR = 2008;

/* ===== Đồng hồ header & chào hỏi ===== */
function tickHeader() {
  const now = new Date();
  document.getElementById("clockText").textContent = now.toLocaleString("vi-VN");
  const h = now.getHours();
  let emoji="🌙", greet="Chúc buổi tối tuyệt vời!";
  if (h>=5 && h<11) { emoji="🌞"; greet="Chúc buổi sáng vui vẻ!"; }
  else if (h<14) { emoji="🍜"; greet="Chúc buổi trưa ngon miệng!"; }
  else if (h<18) { emoji="☕"; greet="Chúc buổi chiều năng lượng!"; }
  document.getElementById("greetEmoji").textContent = emoji;
  document.getElementById("greetText").textContent = greet;
}
setInterval(tickHeader, 1000); tickHeader();

/* ===== Thời gian Việt Nam cho Dynamic Island ===== */
function vnNow(){
  try {
    return new Date(new Date().toLocaleString("en-US",{ timeZone:"Asia/Ho_Chi_Minh" }));
  } catch {
    const now=new Date(); const utc=now.getTime()+now.getTimezoneOffset()*60000; return new Date(utc+7*3600000);
  }
}
function updateVNClock(){
  const n=vnNow();
  const pad = n=>String(n).padStart(2,"0");
  const hh=pad(n.getHours()), mm=pad(n.getMinutes()), ss=pad(n.getSeconds());
  const d=pad(n.getDate()), m=pad(n.getMonth()+1), y=n.getFullYear();
  document.getElementById("vnClock").textContent = `${hh}:${mm}:${ss}`;
  document.getElementById("vnClockBig").textContent = `${hh}:${mm}:${ss}`;
  document.getElementById("vnDate").textContent = `${d}/${m}/${y}`;
}
setInterval(updateVNClock, 1000); updateVNClock();

/* ===== Dynamic Island toggle ===== */
document.getElementById("island").addEventListener("click", e => {
  e.currentTarget.classList.toggle("expanded");
});

/* ===== Hero name + tick xanh ===== */
function injectVerified(name, el, sizeClass="v-badge--lg"){
  const badge = `
    <span class="v-badge ${sizeClass}" title="Đã xác minh" aria-label="Đã xác minh">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 12l3.5 3.5L18 7" fill="none" stroke="currentColor"
              stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>`;
  el.innerHTML = `${name}${badge}`;
}
injectVerified(FULL_NAME, document.getElementById("heroName"), "v-badge--lg");
injectVerified(FULL_NAME, document.getElementById("postName"), "v-badge--sm");

/* ===== Avatar mặc định + upload ===== */
function makeDefaultAvatar(initials){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#ff62a5'/><stop offset='100%' stop-color='#57ff9a'/>
    </linearGradient></defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='58%' text-anchor='middle' font-size='110' font-family='Arial' fill='white' font-weight='700'>${initials}</text>
  </svg>`;
  return "data:image/svg+xml;utf8,"+encodeURIComponent(svg);
}
const initials = FULL_NAME.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const defaultAvatar = makeDefaultAvatar(initials);
["avatarPreview", "composerAvatar", "postAvatar"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.src = defaultAvatar;
});
document.getElementById("avatarInput").addEventListener("change", e=>{
  const f=e.target.files?.[0]; if(!f) return;
  const url = URL.createObjectURL(f);
  ["avatarPreview","composerAvatar","postAvatar"].forEach(id=>{
    const el=document.getElementById(id); if(el) el.src=url;
  });
});

/* ===== Chuẩn bị text targets để đổi màu hàng loạt ===== */
const themeTargets = (() => {
  // Bọc chữ trong island chips để có gradient text nhưng vẫn giữ nền chip
  document.querySelectorAll(".mini-chip").forEach(ch => {
    if (!ch.querySelector(".inner")) {
      ch.innerHTML = `${ch.innerHTML.replace(/^(.*)$/, '<span class="inner">$1</span>')}`;
    }
  });
  const list = [
    document.getElementById("heroName"),
    document.getElementById("vnClock"),
    document.getElementById("vnClockBig"),
    document.getElementById("vnDate"),
    document.getElementById("postName"),
    ...document.querySelectorAll(".tagline .chip"),
    ...document.querySelectorAll(".mini-chip .inner"),
    ...document.querySelectorAll(".post-text"),
    ...document.querySelectorAll(".lead, .sublead")
  ].filter(Boolean);
  // Áp base class theme-text (để nhận gradient var --grad-*)
  list.forEach(el => el.classList.add("theme-text"));
  return list;
})();

/* ===== Bộ đổi màu chữ bằng nút ===== */
function setGradient(a,b){
  document.documentElement.style.setProperty("--grad-from", a);
  document.documentElement.style.setProperty("--grad-to", b);
}
function randomGradient(){
  const h1=Math.floor(Math.random()*360);
  const h2=(h1+90+Math.floor(Math.random()*90))%360;
  return [`hsl(${h1} 90% 62%)`, `hsl(${h2} 85% 60%)`];
}
function clearRainbow(){
  themeTargets.forEach(el => el.classList.remove("rainbow-text"));
}

document.getElementById("btnPink").addEventListener("click", ()=>{
  setGradient("#ff62a5","#ffb3d1");
  clearRainbow();
});
document.getElementById("btnFlash").addEventListener("click", ()=>{
  // bật/tắt cầu vồng chạy cho toàn bộ chữ
  const anyHas = themeTargets.some(el => el.classList.contains("rainbow-text"));
  themeTargets.forEach(el => el.classList.toggle("rainbow-text", !anyHas));
});
document.getElementById("btnRandom").addEventListener("click", ()=>{
  const [a,b]=randomGradient(); setGradient(a,b); clearRainbow();
});
document.getElementById("btnPick").addEventListener("click", ()=>colorInput.click());
document.getElementById("colorInput").addEventListener("input", e=>{
  setGradient(e.target.value, "#ffffff"); clearRainbow();
});

/* ===== NỀN ĐỘNG: Chế độ Nhạc & Tự động theo giờ ===== */
const bgReact = document.getElementById("bgReact");
const modeHint = document.getElementById("modeHint");
let musicModeOn = false, timeAutoOn = false;
let audioCtx=null, analyser=null, srcNode=null, buf=null, rafId=null;
let baseHue = 200;
let timeTimer=null;

function setReactHSL(h1, l1, h2, l2){
  document.documentElement.style.setProperty("--react-h1", `${Math.round(h1)} 90% ${Math.round(l1)}%`);
  document.documentElement.style.setProperty("--react-h2", `${Math.round(h2)} 90% ${Math.round(l2)}%`);
}

function applyTimeThemeOnce(){
  const n = vnNow(); const h = n.getHours();
  // Bảng màu theo giờ VN
  let from="#aef1ff", to="#72ffc2", H1=190, L1=55, H2=140, L2=58; // sáng
  if (h>=5 && h<8){ from="#aef1ff"; to="#72ffc2"; H1=190; L1=55; H2=140; L2=58; }            // rạng đông
  else if (h<11){ from="#7ad1ff"; to="#7affc9"; H1=210; L1=60; H2=150; L2=62; }              // sáng
  else if (h<14){ from="#ffd86e"; to="#ff8db1"; H1=45;  L1=60; H2=330; L2=60; }              // trưa rực
  else if (h<17){ from="#ffb86c"; to="#57ff9a"; H1=30;  L1=58; H2=150; L2=60; }              // chiều
  else if (h<20){ from="#ff7aa2"; to="#ffd66e"; H1=330; L1=58; H2=45;  L2=60; }              // hoàng hôn
  else {              from="#7aa0ff"; to="#da6bff"; H1=230; L1=52; H2=290; L2=50; }          // đêm

  setGradient(from, to);
  setReactHSL(H1, L1, H2, L2);
}

async function startMusicMode(){
  // Tắt auto giờ nếu đang bật
  stopTimeAuto();

  if (musicModeOn) return;
  musicModeOn = true;
  modeHint.textContent = "Chế độ nhạc: đang nghe micro… (hãy nói/hát để thấy màu đổi)";
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation:true, noiseSuppression:true }});
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    srcNode = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.85;
    srcNode.connect(analyser);
    buf = new Uint8Array(analyser.frequencyBinCount);

    const loop = () => {
      if (!musicModeOn) return;
      analyser.getByteFrequencyData(buf);
      let sum=0; for(let i=0;i<buf.length;i++) sum+=buf[i];
      const avg = sum / buf.length;         // 0..255
      const norm = avg / 255;               // 0..1
      const energy = Math.pow(norm, 1.4);   // nhạy hơn với beat
      baseHue = (baseHue + 0.8 + energy*1.2) % 360; // xoay hue theo nhạc

      const h1 = baseHue;
      const h2 = (baseHue + 120) % 360;
      const l1 = 45 + energy*30;            // 45..75
      const l2 = 50 + energy*25;            // 50..75
      setReactHSL(h1, l1, h2, l2);

      // Đồng bộ màu chữ theo nhạc (nhẹ) – bạn có thể bỏ nếu muốn chữ không đổi
      setGradient(`hsl(${Math.round(h1)} 90% ${Math.round(58+energy*15)}%)`,
                  `hsl(${Math.round(h2)} 85% 60%)`);

      rafId = requestAnimationFrame(loop);
    };
    loop();
  }catch(err){
    musicModeOn = false;
    modeHint.textContent = "Không truy cập được micro. Kiểm tra quyền micro cho trình duyệt.";
    console.warn(err);
  }
}
function stopMusicMode(){
  if (!musicModeOn) return;
  musicModeOn = false;
  modeHint.textContent = "";
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  if (audioCtx) try{ audioCtx.close(); }catch{}
  audioCtx = analyser = srcNode = buf = null;
}

function startTimeAuto(){
  // Tắt chế độ nhạc nếu đang bật
  stopMusicMode();
  if (timeAutoOn) return;
  timeAutoOn = true;
  modeHint.textContent = "Auto theo giờ VN: bật";
  applyTimeThemeOnce();
  timeTimer = setInterval(applyTimeThemeOnce, 60 * 1000); // cập nhật mỗi phút
}
function stopTimeAuto(){
  if (!timeAutoOn) return;
  timeAutoOn = false;
  modeHint.textContent = "";
  if (timeTimer) clearInterval(timeTimer);
  timeTimer = null;
}

document.getElementById("btnMusic").addEventListener("click", startMusicMode);
document.getElementById("btnTimeAuto").addEventListener("click", startTimeAuto);
document.getElementById("btnAutoOff").addEventListener("click", ()=>{
  stopMusicMode(); stopTimeAuto();
  modeHint.textContent = "Auto đã tắt. Bạn có thể dùng nút Màu hồng/Random/Chọn màu.";
});
