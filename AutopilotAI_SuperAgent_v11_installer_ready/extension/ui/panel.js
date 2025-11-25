(function(){
  const history = document.getElementById('history');
  const input = document.getElementById('input');
  const send = document.getElementById('send');
  const typing = document.getElementById('typing');
  const plan = document.getElementById('plan');
  const themeToggle = document.getElementById('theme-toggle');
  const stopBtn = document.getElementById('stop');

  let pageContext = null;

  window.addEventListener('message', (ev)=>{
    const m = ev.data;
    if(!m || m.type !== 'PAGE_CONTEXT') return;
    pageContext = m.payload;
    addSystem('Page loaded: ' + pageContext.title + '\n' + pageContext.url);
  });

  function addSystem(text){ const d=document.createElement('div'); d.className='msg'; d.innerText=text; history.appendChild(d); history.scrollTop = history.scrollHeight; }
  function addUser(text){ const d=document.createElement('div'); d.className='msg user'; d.innerText=text; history.appendChild(d); history.scrollTop = history.scrollHeight; }
  function addAI(text){ const d=document.createElement('div'); d.className='msg ai'; d.innerText=text; history.appendChild(d); history.scrollTop = history.scrollHeight; }

  themeToggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('light');
  });

  send.addEventListener('click', async ()=>{
    const q = input.value.trim(); if(!q) return;
    addUser(q); input.value=''; typing.classList.remove('hidden'); plan.innerHTML='';
    const payload = { query:q, pageContext };
    try{
      const r = await fetch('http://localhost:5173/api/agent', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
      const j = await r.json();
      const text = j.resp ? (j.resp.raw || JSON.stringify(j.resp)) : JSON.stringify(j);
      addAI(text);
      // Try to parse multi-step plan from response text
      try{
        const m = text.match(/\[PLAN\]([\s\S]*)/);
        // simple parse: look for numbered lines
        const lines = text.split('\n').slice(0,10);
        let stepCount = 0;
        for(const ln of lines){
          const nmat = ln.match(/^(\d+)\.\s+(.*)$/);
          if(nmat){
            stepCount++; const s = document.createElement('div'); s.className='step'; s.innerHTML = '<div class="num">Step '+nmat[1]+'</div><div>'+nmat[2]+'</div>'; plan.appendChild(s);
          }
        }
      }catch(e){}
    }catch(err){
      addAI('Error: '+err.message);
    }finally{
      typing.classList.add('hidden');
    }
  });

  stopBtn.addEventListener('click', ()=>{ addSystem('Stopped'); });

  // request initial page context
  window.parent.postMessage({type:'REQUEST_PAGE_CONTEXT'}, '*');
})();
