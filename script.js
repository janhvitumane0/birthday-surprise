const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

const screens = $$(".screen");
function showScreen(id){
  screens.forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  if(el){
    el.classList.add("active");
    if(id==="final-screen")updateCompletionStats();
    window.scrollTo({top:0, behavior:"smooth"});
  }
}
function burst(count=70){
  const layer=$("#confetti-layer");
  const symbols=["♥","✦","✧","●"];
  for(let i=0;i<count;i++){
    const e=document.createElement("span");
    e.className="confetti";
    e.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    e.style.left=Math.random()*100+"%";
    e.style.top=(-5-Math.random()*20)+"%";
    e.style.fontSize=(10+Math.random()*12)+"px";
    e.style.animationDelay=(Math.random()*.35)+"s";
    e.style.transform=`rotate(${Math.random()*360}deg)`;
    layer.appendChild(e);
    setTimeout(()=>e.remove(),2300);
  }
}
function sparkles(){
  const field=$("#sparkle-field");
  setInterval(()=>{
    if(document.hidden)return;
    const e=document.createElement("span");
    e.className="sparkle";
    e.textContent=Math.random()>.35?"✦":"♥";
    e.style.left=Math.random()*100+"%";
    e.style.bottom="-20px";
    e.style.fontSize=(9+Math.random()*17)+"px";
    e.style.animationDuration=(5+Math.random()*5)+"s";
    field.appendChild(e);
    setTimeout(()=>e.remove(),11000);
  },650);
}
sparkles();

const modal=$("#modal");
function openModal(title,text,emoji="💌"){
  $("#modal-title").textContent=title;
  $("#modal-text").textContent=text;
  $("#modal-emoji").textContent=emoji;
  modal.classList.add("show"); modal.setAttribute("aria-hidden","false");
}
function closeModal(){modal.classList.remove("show");modal.setAttribute("aria-hidden","true")}
$("#modal-close").onclick=closeModal; $("#modal-ok").onclick=closeModal;
$(".modal-backdrop").onclick=closeModal;

function celebrate(){
  burst(90);
  for(let i=0;i<10;i++) setTimeout(()=>burst(12),i*130);
}

/* 1. Password */
$("#password-form").addEventListener("submit",e=>{
  e.preventDefault();
  const raw=$("#password").value.trim();
  const normalized=raw.replace(/[\/\-. ]/g,"");
  const ok = normalized==="16092004" || normalized==="16";
  if(ok){
    $("#lock-message").textContent="Unlocked… just like that. 💗";
    celebrate();
    setTimeout(()=>showScreen("choice-screen"),700);
  }else{
    const input=$("#password");
    input.classList.remove("shake"); void input.offsetWidth; input.classList.add("shake");
    $("#lock-message").textContent="Hmm… that little lock says nope. Try again, birthday boy. 🙈";
  }
});

/* 2. Yes/No */
const noMessages=[
  "Are you sureeee? 🥺",
  "Nice try 😭",
  "Nope, this surprise is waiting for you.",
  "You have to say yes 😌",
  "The birthday committee strongly recommends YES. 🎀"
];
let noIndex=0;
const openedGifts=new Set();
const foundSecrets=new Set();
let letterOpened=false, wishDone=false;
$("#no-btn").onclick=()=>{
  $("#choice-message").textContent=noMessages[noIndex++%noMessages.length];
  const b=$("#no-btn");
  b.animate([{transform:"translateX(0) rotate(0)"},{transform:"translateX(10px) rotate(3deg)"},{transform:"translateX(-7px) rotate(-2deg)"},{transform:"translateX(0)"}],{duration:420});
};
$("#yes-btn").onclick=()=>{celebrate();setTimeout(()=>showScreen("photos-screen"),650)};
/* 3. Photos */
const photos=Array.from({length:11},(_,i)=>`photo-01.png-${String(i+1).padStart(2,"0")}.png`);
const captions=[
  "Okay… this one is adorable. ♡","Birthday boy energy. ✨","A very serious cutie. 😌",
  "This one deserves a little heart. 💗","No explanation needed. 🥹","Just… look at you.",
  "A tiny photo, a big smile. ♡","Another one for the collection. 📸","Still too cute.",
  "One more because I can. 🎀","Okay last one… maybe. 👀"
];
let photoIndex=0;
function renderPhoto(dir=1){
  const img=$("#photo-image"), card=$("#polaroid"), flash=$("#flash");
  flash.classList.remove("flash"); void flash.offsetWidth; flash.classList.add("flash");
  card.style.animation="none"; void card.offsetWidth; card.style.animation="";
  photoIndex=(photoIndex+photos.length)%photos.length;
  img.src=photos[photoIndex];
  img.alt=`Birthday photo ${photoIndex+1}`;
  $("#photo-caption").textContent=captions[photoIndex];
  $("#photo-count").textContent=`${photoIndex+1} / ${photos.length}`;
  $$(".dot").forEach((d,i)=>d.classList.toggle("active",i===photoIndex));
}
$("#photo-prev").onclick=()=>{photoIndex--;renderPhoto(-1)};
$("#photo-next").onclick=()=>{photoIndex++;renderPhoto(1)};
const dots=$("#photo-dots");
photos.forEach((_,i)=>{const d=document.createElement("span");d.className="dot"+(i===0?" active":"");dots.appendChild(d)});
$$(".continue-btn").forEach(b=>b.onclick=()=>showScreen(b.dataset.next));

/* 4/5. Room + gifts */
const giftMessages={
  1:["Gift 1 unlocked! 🎁","Your official birthday permission slip: eat the cake first and worry about everything else later. ♡","🎂"],
  2:["Gift 2 unlocked! 🎀","A tiny reminder that you are allowed to have ridiculously happy days. Today is definitely one of them. ✨","💗"],
  3:["Gift 3 unlocked! 🧸","Emergency cuddle-sized message: you are loved, appreciated and very, very birthday-worthy. 🧸","🥹"],
  4:["Gift 4 unlocked! ⭐","Secret bonus: you made it all the way through the surprise. Now take this sparkle and keep it. ⭐","🌟"]
};
function openGift(n){
  const [title,text,emoji]=giftMessages[n];
  openedGifts.add(n);
  openModal(title,text,emoji); burst(35);
  $("#gift-note").textContent=text;
}
$$("[data-gift]").forEach(b=>b.addEventListener("click",()=>openGift(Number(b.dataset.gift))));
$$(".secret").forEach((b,i)=>b.onclick=()=>{
  foundSecrets.add(`room-${i}`);
  openModal("YOU FOUND A SECRET! 👀",b.dataset.secret,"✨");
  burst(28);
});
$$(".teddy").forEach(b=>b.onclick=()=>openModal("Teddy says…",b.dataset.message,"🧸"));
$("#cake-btn").onclick=()=>{
  $("#cake-btn .flame").textContent="💨";
  openModal("Make a birthday wish. 🎂","Close your eyes for one tiny second, make a wish, and then imagine me cheering for you. ♡","🎂");
  burst(45);
  setTimeout(()=>$("#cake-btn .flame").textContent="🕯️",1000);
};
$("#room-envelope").onclick=()=>openModal("A tiny envelope… 💌","There are four more waiting for you later. Keep going, birthday boy. ♡","💌");
$("#frame-btn").onclick=()=>openModal("A little frame", "This frame is for the memories that deserve to stay close. 📸","🖼️");

/* 6. Comic */
let comicIndex=0;
const comicPages=Array.from({length:8},(_,i)=>`page-01.jpg-${String(i+1).padStart(2,"0")}.jpg`);
function renderComic(){
  const wrap=$("#comic-page-wrap"), img=$("#comic-page");
  wrap.classList.remove("turn"); void wrap.offsetWidth; wrap.classList.add("turn");
  setTimeout(()=>{img.src=comicPages[comicIndex]; img.alt=`Comic page ${comicIndex+1}`},180);
  $("#comic-count").textContent=`Page ${comicIndex+1} of 8`;
}
$("#comic-prev").onclick=()=>{comicIndex=(comicIndex+7)%8;renderComic()};
$("#comic-next").onclick=()=>{comicIndex=(comicIndex+1)%8;renderComic()};

/* 8. Quiz — all facts come from the supplied comic */
const quiz=[
  {q:"Where did we first meet?", options:["Among Us","A school event","A random photo app","A music chat"], answer:0},
  {q:"When did we first meet?", options:["17 March 2025","27 January 2025","16 September 2004","8 March 2025"], answer:1},
  {q:"What happened on 17 March 2025?", options:["We played a new game","He surprised me and asked me to be his girlfriend","We went on a trip","We met at a concert"], answer:1}
];
let quizIndex=0,score=0,answered=false;
function renderQuiz(){
  answered=false;
  $("#quiz-progress").textContent=`${quizIndex+1} / ${quiz.length}`;
  $("#quiz-question").textContent=quiz[quizIndex].q;
  const box=$("#quiz-options"); box.innerHTML="";
  $("#quiz-feedback").textContent="";
  $("#quiz-next").classList.add("hidden");
  quiz[quizIndex].options.forEach((opt,i)=>{
    const b=document.createElement("button"); b.className="quiz-option"; b.textContent=opt;
    b.onclick=()=>{
      if(answered)return; answered=true;
      $$(".quiz-option",box).forEach(x=>x.disabled=true);
      if(i===quiz[quizIndex].answer){score++;b.classList.add("correct");$("#quiz-feedback").textContent="Correct! You remember. 🥹💗"}
      else{b.classList.add("wrong");$("#quiz-feedback").textContent=`Cute attempt 😭 The answer was "${quiz[quizIndex].options[quiz[quizIndex].answer]}".`}
      $("#quiz-next").classList.remove("hidden");
    };
    box.appendChild(b);
  });
}
renderQuiz();
$("#quiz-next").onclick=()=>{
  if(quizIndex<quiz.length-1){quizIndex++;renderQuiz()}
  else{
    $("#quiz-question").textContent="Quiz complete! 🎉";
    $("#quiz-options").innerHTML="";
    $("#quiz-feedback").textContent="";
    $("#quiz-next").classList.add("hidden");
    const result=$("#quiz-result");result.classList.remove("hidden");
    result.innerHTML=`You scored <b>${score}/3</b> 💗<br>${score===3?"Okayyy, memory champion!":score===2?"Pretty good, birthday boy. 😌":"We need a tiny memory refresh… but you're still cute. 😭"}`
    $("#quiz-continue").classList.remove("hidden"); burst(30);
  }
};

/* 9/10. Open When */
const openWhen=[
  ["When you're happy 💗","When you're happy, click a photo of yours and send it to me. I want to see that cute smile of yours. 🥹❤️","💗"],
  ["When you miss me 🥺","When you miss me, I want you to know that we are the same soul which can't be separated. ❤️","🥺"],
  ["When it's a bad day 🌧️","When it's a bad day, I want you to know that I am always ready to listen to you and reassure you. Even if it's the smallest thing, for me, you are the one who matters. ❤️","🌧️"],
  ["When you need a smile ✨","When you need a smile, take a breath, remember this little birthday world, and know that someone is sending you the biggest imaginary forehead boop. ✨","🥹"]
];
function openWhenCard(n){
  const [title,text,emoji]=openWhen[n];
  openModal(title,text,emoji);
  $("#openwhen-note").textContent=text;
}
$$("[data-openwhen]").forEach(b=>b.addEventListener("click",()=>openWhenCard(Number(b.dataset.openwhen))));

/* 11. Letter */
const letterLines=[
  "I just wanted to make you a little corner of the internet that feels like a tiny hug from me.",
  "Thank you for being someone whose presence can make ordinary moments feel a little more special.",
  "I hope this birthday reminds you how loved, appreciated and celebrated you are.",
  "And whenever you come back to this little world, I hope it makes you smile all over again. ♡"
];
let typingTimer=null;
function typeLetter(){
  const target=$("#letter-text");
  target.innerHTML="";
  let line=0,char=0,current=null;
  clearInterval(typingTimer);
  typingTimer=setInterval(()=>{
    if(line>=letterLines.length){clearInterval(typingTimer);return;}
    if(!current){current=document.createElement("p");target.appendChild(current);}
    if(char<letterLines[line].length){
      current.textContent+=letterLines[line][char++];
    }else{
      line++;char=0;current=null;
    }
  },22);
}
$("#letter-envelope").onclick=()=>{
  if(letterOpened)return;
  letterOpened=true;
  $("#letter-envelope").classList.add("opened");
  setTimeout(()=>{
    $("#letter-card").classList.remove("hidden");
    typeLetter();
    $("#letter-continue").classList.remove("hidden");
    burst(24);
  },500);
};

/* 12. Birthday wish */
function blowCandles(){
  if(wishDone)return;
  wishDone=true;
  $("#wish-cake").classList.add("blown");
  $("#wish-prompt").textContent="The candles are out… ✨ Your wish is officially in the stars. ♡";
  $("#wish-done").classList.remove("hidden");
  $("#wish-continue").classList.remove("hidden");
  setTimeout(()=>burst(55),180);
}
$("#wish-cake").onclick=blowCandles;
$("#wish-cake").onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();blowCandles()}};
$("#wish-done").onclick=()=>{
  openModal("Wish made. ✨","Okay… I'm not going to ask what you wished for. Some wishes are meant to stay secret. ♡","🌠");
};

/* 13. Future stars + DON'T CLICK */
$$(".future-star").forEach((star,i)=>star.onclick=()=>{
  foundSecrets.add(`future-${i}`);
  $("#future-note").textContent=star.dataset.future;
  star.classList.add("found");
  burst(12);
});
$("#dont-click").onclick=()=>{
  foundSecrets.add("dont-click");
  openModal("I KNEW YOU'D CLICK IT 😭❤️","There was literally a warning. And you still clicked it. I am impressed. 😂 Now take this tiny secret: you are very, very loved.","🫣");
  burst(32);
};

function updateCompletionStats(){
  $("#stat-gifts").textContent=openedGifts.size;
  $("#stat-secrets").textContent=foundSecrets.size;
  $("#stat-quiz").textContent=`${score}/3`;
}

/* Final */
$("#replay-btn").onclick=()=>{
  photoIndex=0;quizIndex=0;score=0;noIndex=0;letterOpened=false;wishDone=false;
  openedGifts.clear();foundSecrets.clear();
  $("#letter-envelope").classList.remove("opened");
  $("#letter-card").classList.add("hidden");$("#letter-continue").classList.add("hidden");
  $("#wish-done").classList.add("hidden");$("#wish-continue").classList.add("hidden");
  $("#wish-prompt").textContent="Three tiny candles. One birthday wish. ♡";
  $("#wish-cake").classList.remove("blown");
  $$(".future-star").forEach(x=>x.classList.remove("found"));
  $("#future-note").textContent="Psst… one of these stars is hiding something. 👀";
  renderPhoto();renderQuiz();updateCompletionStats();showScreen("lock-screen");window.scrollTo({top:0});
};

/* Keyboard convenience */
document.addEventListener("keydown",e=>{
  if(e.key==="Escape")closeModal();
  if($("#comic-screen").classList.contains("active")){
    if(e.key==="ArrowLeft")$("#comic-prev").click();
    if(e.key==="ArrowRight")$("#comic-next").click();
  }
});
