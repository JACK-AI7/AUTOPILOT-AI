require('dotenv').config();
const express=require('express'), cors=require('cors'), bodyParser=require('body-parser');
const Agent = require('./agent');
const app = express(); app.use(cors()); app.use(bodyParser.json({limit:'30mb'}));
app.post('/api/agent', async (req,res)=>{ try{ const out = await Agent.handle(req.body); res.json(out); }catch(e){ res.json({ok:false,error:e.message}); } });
const PORT = process.env.PORT || 5173; app.listen(PORT, ()=>console.log('Autopilot-AI backend listening on', PORT));
