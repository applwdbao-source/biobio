const FULL_NAME = "ApplwNgoo";
const BIRTH_YEAR = 2008;

/* === Header Clock & Greeting === */
function tick() {
  const now = new Date();
  document.getElementById("clockText").textContent =
    now.toLocaleString("vi-VN");
  const h = now.getHours();
  let emoji="🌙", greet="Chúc buổi tối tuyệt vời!";
  if(h<11 && h>=5) {emoji="🌞"; greet="Chúc buổi sáng vui vẻ!";}
  else if(h<14) {emoji="🍜"; greet="Chúc buổi trưa ngon miệng!";}
  else if(h<18) {emoji="☕"; greet="Chúc buổi chiều năng lượng!";}
  document.getElementById("greetEmoji").textContent=emoji;
  document.getElementById("greetText").textContent=greet;
}
setInterval(tick,1000); tick();

/* === Dynamic Island clock VN === */
function vnNow(){
  return new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Ho_Chi_Minh"}));
}
function updateVNClock(){
  const n=vnNow();
  const hh=String(n.getHours()).padStart(2,"0");
  const mm=String(n.getMinutes()).padStart(2,"0");
  const ss=String(n.getSeconds()).padStart(2,"0");
  const d=String(n.getDate()).padStart(2,"0");
  const m=String(n.getMonth()+1).padStart(2,"0");
  const y=n.getFullYear();
  document.getElementById("vnClock").textContent=`${hh}:${mm}:${ss}`;
  document.getElementById("vnClockBig").textContent=`${hh}:${mm}:${ss}`;
  document.getElementById("vnDate").textContent=`${d}/${m}/${y}`;
}
setInterval(updateVNClock,1000); updateVNClock();

/* === Dynamic Island Animation === */
const island=document.getElementById("island");
island.addEventListener("click",()=>island.classList.toggle("expanded"));

/* === Gradient color changer === */
function randomGradient(){
  const h1=Math.random()*360,h2=(h1+90)%360;
  return [`hsl(${h1} 90% 60%)`,`hsl(${h2} 80% 60%)`];
}
function setGradient(a,b){
  document.documentElement.style.setProperty("--grad-from",a);
  document.documentElement.style.setProperty("--grad-to",b);
}
