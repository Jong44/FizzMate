// IMPORT DEPENDENCIES OPENAI
const { default: OpenAI } = require("openai");

// CREATE INSTANCE OPENAI WITH API KEY FROM ENV
const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY
})

// EXPORT DEFAULT FUNCTION HANDLER WITH REQ AND RES PARAMETER
export default async function handler(req, res) {
    // CHECK IF METHOD IS POST
    if (req.method === 'POST') {

        // INITIATE VARIABLE THREADID AND MESSAGE FROM REQ.BODY
        const { threadId, message } = req.body;

        // CHECK IF THREADID IS EMPTY
        if (!threadId) {
            return res.status(400).json({ message: 'threadId is required' });
        }

        // CHECK IF MESSAGE IS EMPTY
        if (!message) {
            return res.status(400).json({ message: 'message is required' });
        }

        // SEND MESSAGE TO OPENAI API SERVICE
        const messageEvent = await openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: message
        });

        // SET HEADER RESPONSE WITH CONTENT TYPE TEXT/EVENT-STREAM GUNA UNTUK SERVER-SENT EVENTS (SSE)
        res.setHeader('Content-Type', 'text/event-stream');

        // SET HEADER RESPONSE WITH CACHE-CONTROL NO-CACHE
        res.setHeader('Cache-Control', 'no-cache');

        // SET HEADER RESPONSE WITH CONNECTION KEEP-ALIVE UNTUK MENJAGA KONEKSI TERBUKA
        res.setHeader('Connection', 'keep-alive');

        // FLUSH HEADER RESPONSE UNTUK MENGIRIMKAN HEADER KE CLIENT
        res.flushHeaders();
  
        // CHECK IF MESSAGE EVENT HAS ERROR
        if (messageEvent.error) {
            // RETURN RESPONSE WITH STATUS 500 AND MESSAGE ERROR
            return res.status(500).json({ message: messageEvent.error });
        } else {
            // CREATE STREAM MESSAGE FROM OPENAI API SERVICE 
            // MENJALANKAN ASSISTANT DENGAN ASSISTANT_ID YANG DIAMBIL DARI ENV
            const stream = await openai.beta.threads.runs.create(threadId, {
                assistant_id: process.env.OPENAI_ASSISTANT_ID,
                stream:true
            });

            // LOOPING UNTUK MENGIRIMKAN MESSAGE KE CLIENT
            for await (const message of stream) {
                res.write(`data: ${JSON.stringify(message)}\n\n`);
            }
            
            // CLOSE RESPONSE
            res.end();
        }
    }
}