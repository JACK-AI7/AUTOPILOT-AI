(function(){
  if(window.__autopilot_injected_v6) return;
  window.__autopilot_injected_v6 = true;

  const bubble = document.createElement('div');
  bubble.id = 'ap-bubble';
  bubble.innerHTML = '<div id="ap-orb"><div id="ap-avatar">A</div><div id="ap-wave"></div></div>';

  document.documentElement.appendChild(bubble);

  const iframe = document.createElement('iframe');
  iframe.id = 'ap-panel';
  iframe.src = chrome.runtime.getURL('ui/panel.html');
  iframe.style.display = 'none';
  document.documentElement.appendChild(iframe);

  // position defaults
  let right=24, bottom=24;
  bubble.style.right = right + 'px';
  bubble.style.bottom = bottom + 'px';
  iframe.style.right = right + 'px';
  iframe.style.bottom = (bottom + 86) + 'px';

  // draggable with pointer events
  let dragging=false, startX=0, startY=0, startR=right, startB=bottom;
  bubble.addEventListener('pointerdown', e=>{
    dragging=true;
    startX = e.clientX; startY = e.clientY;
    startR = parseInt(bubble.style.right); startB = parseInt(bubble.style.bottom);
    bubble.setPointerCapture(e.pointerId);
  });
  window.addEventListener('pointermove', e=>{
    if(!dragging) return;
    const dx = startX - e.clientX;
    const dy = e.clientY - startY;
    const r = Math.max(8, startR + dx);
    const b = Math.max(8, startB + dy);
    bubble.style.right = r + 'px';
    bubble.style.bottom = b + 'px';
    iframe.style.right = r + 'px';
    iframe.style.bottom = (b + 86) + 'px';
  });
  window.addEventListener('pointerup', e=>{ dragging=false; });

  // click toggles panel with entrance 3D animation and typing dots
  bubble.addEventListener('click', async (e)=>{
    const visible = iframe.style.display === 'block';
    if(visible){
      iframe.style.transform = 'translateY(12px) scale(0.98) rotateX(6deg)';
      setTimeout(()=>{ iframe.style.display='none'; bubble.classList.remove('active'); }, 180);
      return;
    }
    bubble.classList.add('loading');
    // gather page context
    const selection = window.getSelection().toString();
    const snippet = (document.body && document.body.innerText) ? document.body.innerText.slice(0,2000) : '';
    const ctx = { title: document.title, url: location.href, selection, snippet };
    // show panel after slight delay
    setTimeout(()=>{
      iframe.style.display='block';
      iframe.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
      bubble.classList.remove('loading');
      bubble.classList.add('active');
      // send context to iframe
      iframe.contentWindow.postMessage({type:'PAGE_CONTEXT', payload:ctx}, '*');
    }, 420);
  });

  // neon trail effect: follow mouse when hovering
  bubble.addEventListener('mouseenter', ()=> bubble.classList.add('hovered'));
  bubble.addEventListener('mouseleave', ()=> bubble.classList.remove('hovered'));

  // forward actions from iframe
  window.addEventListener('message', ev=>{
    const m = ev.data;
    if(!m || !m.type) return;
    if(m.type === 'PERFORM_ACTION'){
      const a = m.payload || {};
      if(a.action==='click' && a.selector){
        const el = document.querySelector(a.selector);
        if(el) el.click();
        ev.source.postMessage({type:'ACTION_RESULT', payload:{ok:!!el}}, '*');
      } else if(a.action==='type' && a.selector){
        const el = document.querySelector(a.selector);
        if(el){ el.focus(); el.value = a.value || ''; el.dispatchEvent(new Event('input',{bubbles:true})); ev.source.postMessage({type:'ACTION_RESULT', payload:{ok:true}}, '*'); }
        else ev.source.postMessage({type:'ACTION_RESULT', payload:{ok:false}}, '*');
      } else if(a.action==='scroll'){ window.scrollTo({top:a.y||0,behavior:'smooth'}); ev.source.postMessage({type:'ACTION_RESULT', payload:{ok:true}}, '*'); }
      else ev.source.postMessage({type:'ACTION_RESULT', payload:{ok:false, error:'unknown-action'}}, '*');
    }
  });

})();
