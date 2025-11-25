chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
  if(msg.type==='PING') return sendResponse({pong:true});
  if(msg.type==='LOG') console.log('EXT LOG:', msg.msg);
});
