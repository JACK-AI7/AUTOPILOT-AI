// Simple native host example: reads JSON from stdin, echoes messages.
// Note: Real native host must follow Native Messaging protocol (length-prefixed messages).
console.log("Native host placeholder started");
process.stdin.on('data', function(chunk){ try{ const s = chunk.toString(); console.log("IN:", s); }catch(e){} });
