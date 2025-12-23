const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

function markActive(){
  const page = location.pathname.split("/").pop() || "index.html";
  $$(".nav a").forEach(a=>{
    if(a.getAttribute("href") === page) a.classList.add("active");
  });
}

function initSidebar(){
  const btn = $("#menuBtn");
  const side = $("#sidebar");
  const scrim = $("#scrim");
  const open = ()=>{ side.classList.add("open"); scrim.classList.add("open"); };
  const close = ()=>{ side.classList.remove("open"); scrim.classList.remove("open"); };
  btn?.addEventListener("click", open);
  scrim?.addEventListener("click", close);
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") close(); });
}

function buildTechMap(){
  const root = $("#techMap"); if(!root) return;
  const items = [
    {t:"Хмарні сервіси", d:"Зберігання та робота з файлами онлайн (Drive/OneDrive), спільне редагування."},
    {t:"Штучний інтелект", d:"Чат‑боти, генерація тексту/зображень, розпізнавання голосу, рекомендації."},
    {t:"Кібербезпека", d:"Паролі, 2FA, шифрування, антивірус, резервні копії, правила поведінки онлайн."},
    {t:"Мобільні технології", d:"Смартфони як «міні‑комп’ютери»: сенсори, NFC, геолокація, застосунки."},
    {t:"Інтернет речей (IoT)", d:"Розумний дім, датчики, пристрої, що обмінюються даними через мережу."},
    {t:"VR/AR", d:"Віртуальна/доповнена реальність: навчання, ігри, моделювання."},
  ];
  const wrap = document.createElement("div");
  wrap.className = "cards";
  items.forEach(x=>{
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `<b>${x.t}</b><div class="big">${x.d}</div>`;
    wrap.appendChild(el);
  });
  root.appendChild(wrap);
}

function initHygiene(){
  const root = $("#hygiene"); if(!root) return;
  const KEY="it_hygiene_list_v1";
  let items=[];
  const load=()=>{ try{items=JSON.parse(localStorage.getItem(KEY)||"[]")}catch{items=[]} };
  const save=()=> localStorage.setItem(KEY, JSON.stringify(items));
  const render=()=>{
    const tbody=$("#hygTbody"); tbody.innerHTML="";
    items.forEach((it, idx)=>{
      const tr=document.createElement("tr");
      tr.innerHTML = `
        <td>${idx+1}</td>
        <td>${it.text}</td>
        <td>${it.done ? "✓" : "—"}</td>
        <td>
          <button class="btn" data-toggle="${idx}">${it.done ? "Скасувати" : "Виконано"}</button>
          <button class="btn" data-del="${idx}">Видалити</button>
        </td>`;
      tbody.appendChild(tr);
    });
    $("#hygCount").textContent = `${items.length} пункт(ів)`;
  };

  root.innerHTML = `

    <div class="row" style="margin-top:12px">
      <div>
        <label class="muted">Додати правило</label>
        <input class="input" id="hygIn" placeholder="Напр.: Увімкнути двофакторну автентифікацію">
      </div>
      <div>
        <span class="pill">Лічильник: <b id="hygCount">0</b></span>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap">
        <button class="btn neon" id="hygAdd">Додати</button>
        <button class="btn" id="hygClear">Очистити</button>
      </div>
    </div>
    <div style="margin-top:12px" class="panel">
      <table class="table" aria-label="Список цифрової гігієни">
        <thead><tr><th>#</th><th>Правило</th><th>Статус</th><th>Дії</th></tr></thead>
        <tbody id="hygTbody"></tbody>
      </table>
    </div>
  `;

  const inEl=$("#hygIn");
  $("#hygAdd").addEventListener("click", ()=>{
    const text=inEl.value.trim();
    if(!text) return alert("Впиши правило.");
    items.push({text, done:false});
    inEl.value="";
    save(); render();
  });
  $("#hygClear").addEventListener("click", ()=>{
    if(confirm("Очистити список?")){
      items=[]; save(); render();
    }
  });
  root.addEventListener("click",(e)=>{
    const t=e.target.getAttribute("data-toggle");
    const d=e.target.getAttribute("data-del");
    if(t!==null){
      const idx=Number(t); items[idx].done=!items[idx].done; save(); render();
    }
    if(d!==null){
      items.splice(Number(d),1); save(); render();
    }
  });

  load(); render();
}

function initImageModal(){
  const modal=$("#imgModal"); if(!modal) return;
  const img=$("#imgModalImg"), title=$("#imgModalTitle"), close=$("#imgModalClose");
  const open=(src,cap)=>{ img.src=src; title.textContent=cap||"Скріншот"; modal.classList.add("open"); };
  const shut=()=>{ modal.classList.remove("open"); img.src=""; };
  close.addEventListener("click", shut);
  modal.addEventListener("click", e=>{ if(e.target===modal) shut(); });
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") shut(); });
  $$("img[data-modal]").forEach(im=>{
    im.style.cursor="zoom-in";
    im.addEventListener("click", ()=> open(im.src, im.alt));
  });
}

function initQuiz(){
  const root=$("#quizRoot"); if(!root) return;

  const qs=[
    {q:"Що таке сучасні інформаційні технології?", a:["Тільки комп’ютерні ігри","Сукупність методів і засобів для обробки, зберігання й передачі інформації","Лише програмування на C++","Тільки друк документів"], c:1},
    {q:"Хмарні сервіси корисні тим, що…", a:["Працюють лише без інтернету","Дають доступ до файлів з різних пристроїв і підтримують спільну роботу","Не потребують паролів","Заміщують електроенергію"], c:1},
    {q:"2FA (двофакторна автентифікація) — це…", a:["Два однакових паролі","Підтвердження входу двома способами (пароль + код/додаток)","Дві сторінки сайту","Два антивіруси"], c:1},
    {q:"Приклад IoT — це…", a:["Паперовий щоденник","Розумна лампа, що керується зі смартфона","Пошта на конвертах","Звичайний калькулятор"], c:1},
    {q:"Перевага шифрування даних:", a:["Збільшує розмір екрану","Захищає інформацію від прочитання сторонніми без ключа","Видаляє віруси автоматично","Підвищує швидкість Wi‑Fi"], c:1},
  ];

  const quiz=document.createElement("div");
  quiz.className="quiz";

  qs.forEach((qq,i)=>{
    const block=document.createElement("div");
    block.className="q";
    block.innerHTML=`<h3>${i+1}. ${qq.q}</h3><div class="answers"></div>`;
    const ans=$(".answers", block);
    qq.a.forEach((opt,j)=>{
      const lab=document.createElement("label");
      lab.className="opt";
      lab.innerHTML=`<input type="radio" name="q${i}" value="${j}"><div>${opt}</div>`;
      ans.appendChild(lab);
    });
    quiz.appendChild(block);
  });

  const controls=document.createElement("div");
  controls.innerHTML=`
    <div class="progress"><div id="progBar"></div></div>
    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px">
      <button class="btn neon" id="checkBtn">Перевірити</button>
      <button class="btn" id="resetBtn">Скинути</button>
    </div>
    <div id="quizResult" style="display:none"></div>
  `;
  root.appendChild(quiz);
  root.appendChild(controls);

  const prog=$("#progBar");
  const update=()=>{
    const chosen=qs.reduce((acc,_,i)=> acc + (document.querySelector(`input[name="q${i}"]:checked`)?1:0), 0);
    prog.style.width = `${Math.round((chosen/qs.length)*100)}%`;
  };
  document.addEventListener("change", e=>{ if(e.target.matches('input[type="radio"]')) update(); });
  update();

  $("#checkBtn").addEventListener("click", ()=>{
    let score=0; const wrong=[];
    qs.forEach((qq,i)=>{
      const picked=document.querySelector(`input[name="q${i}"]:checked`);
      const v=picked?Number(picked.value):-1;
      if(v===qq.c) score++; else wrong.push(i+1);
    });
    const percent=Math.round((score/qs.length)*100);
    const ok=percent>=80;
    const box=$("#quizResult");
    box.style.display="block";
    box.className= ok ? "result" : "result bad";
    box.innerHTML = `<b>Результат:</b> ${score}/${qs.length} (${percent}%)<div class="muted" style="margin-top:6px">${ok?"Відмінно!":"Порада: переглянь теорію і спробуй ще раз."}${wrong.length?`<br>Помилки в питаннях: ${wrong.join(", ")}`:""}</div>`;
  });

  $("#resetBtn").addEventListener("click", ()=>{
    $$('input[type="radio"]', root).forEach(i=>i.checked=false);
    $("#quizResult").style.display="none";
    update();
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  markActive();
  initSidebar();
  buildTechMap();
  initHygiene();
  initImageModal();
  initQuiz();
});