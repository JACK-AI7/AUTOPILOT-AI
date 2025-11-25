module.exports = { handle: async (p)=> ({ok:true, answer:'Hello from fallback agent'}) , handleStream: async function*(p){ yield 'Hello'; yield '[DONE]'; } };
