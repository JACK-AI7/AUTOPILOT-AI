(function(){
  const history = document.getElementById('history');
  const input = document.getElementById('input');
  const send = document.getElementById('send');
  const typing = document.getElementById('typing');
  const plan = document.getElementById('plan');
  const themeBtn = document.getElementById('theme');
  const stopBtn = document.getElementById('stop');
  let pageContext = null;

  window.addEventListener('message', (ev)=>{ const m = ev.data; if(!m || m.type!=='PAGE_CONTEXT') return; pageContext = m.payload; addSystem('Page: '+pageContext.title+'\n'+pageContext.url); });

  function addSystem(t){ const d=document.createElement('div'); d.className='msg'; d.innerText=t; history.appendChild(d); history.scrollTop=history.scrollHeight;}
  function addUser(t){ const d=document.createElement('div'); d.className='msg user'; d.innerText=t; history.appendChild(d); history.scrollTop=history.scrollHeight;}
  function addAI(t){ const d=document.createElement('div'); d.className='msg'; d.innerText=t; history.appendChild(d); history.scrollTop=history.scrollHeight;}

  themeBtn.addEventListener('click', ()=>{ document.documentElement.classList.toggle('light'); });
  send.addEventListener('click', async ()=>{ const q = input.value.trim(); if(!q) return; addUser(q); input.value=''; typing.classList.remove('hidden'); plan.innerHTML=''; const payload = { query:q, pageContext }; try{ const r = await fetch('http://localhost:5173/api/agent', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) }); const j = await r.json(); if(!j || !j.ok){ addAI('Error from backend: '+(j && j.error ? j.error : 'unknown')); return; } const text = j.answer || j.resp || JSON.stringify(j); addAI(text); const lines = (text||'').split('\n').slice(0,30); for(const ln of lines){ const m = ln.match(/^(\d{1,2})\.\s+(.*)$/); if(m){ const el = document.createElement('div'); el.className='step'; el.innerHTML='<div class="num">Step '+m[1]+'</div><div>'+m[2]+'</div>'; plan.appendChild(el); } } }catch(e){ addAI('Network error: '+e.message); } finally{ typing.classList.add('hidden'); } });
  stopBtn.addEventListener('click', ()=>{ addSystem('Stopped'); });
  window.parent.postMessage({type:'REQUEST_PAGE_CONTEXT'}, '*');
})();