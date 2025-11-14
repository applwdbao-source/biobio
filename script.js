const FULL_NAME = "Bách Phạm Ngọc";
const BIRTH_YEAR = 2008;

function two(n){ return String(n).padStart(2,'0'); }

/* ----- Đồng hồ & chào theo giờ ----- */
function tick() {
  const now = new Date();
  document.getElementById("clockText").textContent =
    now.toLocaleString('vi-VN');
  const h = now.getHours();
  let emoji="🌙", greet="Chúc buổi tối tuyệt vời!";
  if(h<11 && h>=5) {emoji="🌞"; greet="Chúc buổi sáng vui vẻ!";}
  else if(h<14) {emoji="🍜"; greet="Chúc buổi trưa ngon miệng!";}
  else if(h<18) {emoji="☕"; greet="Chúc buổi chiều năng lượng!";}
  document.getElementById("greetEmoji").textContent=emoji;
  document.getElementById("greetText").textContent=greet;
}
setInterval(tick,1000); tick();

/* ----- Gradient đổi màu ----- */
function setGradient(a,b){
  document.documentElement.style.setProperty("--grad-from",a);
  document.documentElement.style.setProperty("--grad-to",b);
}
function randomGradient(){
  const h1=Math.random()*360,h2=(h1+90)%360;
  return [`hsl(${h1} 90% 60%)`,`hsl(${h2} 80% 60%)`];
}
document.getElementById("btnPink").onclick=()=>{setGradient("#ff62a5","#ffb3d1");document.querySelector(".display").classList.remove("flash");};
document.getElementById("btnFlash").onclick=()=>{document.querySelector(".display").classList.toggle("flash");};
document.getElementById("btnRandom").onclick=()=>{const [a,b]=randomGradient();setGradient(a,b);document.querySelector(".display").classList.remove("flash");};
document.getElementById("btnPick").onclick=()=>colorInput.click();
colorInput.oninput=e=>{setGradient(e.target.value,"#fff");};

/* ----- Dynamic Island: giờ Việt Nam ----- */
function vnNow(){
  try {
    return new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Ho_Chi_Minh"}));
  } catch {
    const now=new Date();
    const utc=now.getTime()+now.getTimezoneOffset()*60000;
    return new Date(utc+7*3600000);
  }
}
function updateVNClock(){
  const n=vnNow();
  document.getElementById("vnClock").textContent=`${two(n.getHours())}:${two(n.getMinutes())}:${two(n.getSeconds())}`;
}
setInterval(updateVNClock,1000); updateVNClock();

/* ----- Ảnh đại diện ----- */
function getInitials(name){return name.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();}
function makeAvatar(initials){
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#ff62a5'/><stop offset='100%' stop-color='#70f0a6'/>
    </linearGradient></defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='58%' text-anchor='middle' font-size='110' font-family='Arial' fill='white' font-weight='700'>${initials}</text>
  </svg>`;
  return "data:image/svg+xml;utf8,"+encodeURIComponent(svg);
}
const defaultAvatar=makeAvatar(getInitials(FULL_NAME));
const avatarPreview=document.getElementById("avatarPreview");
const composerAvatar=document.getElementById("composerAvatar");
const postAvatar=document.getElementById("postAvatar");
avatarPreview.src=composerAvatar.src=postAvatar.src=defaultAvatar;

document.getElementById("avatarInput").addEventListener("change",e=>{
  const file=e.target.files?.[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    avatarPreview.src=composerAvatar.src=postAvatar.src=ev.target.result;
  };
  reader.readAsDataURL(file);
});
