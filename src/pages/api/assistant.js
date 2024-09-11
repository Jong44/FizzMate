const { default: OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY
})

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { threadId, message } = req.body;

        if (!threadId) {
            return res.status(400).json({ message: 'threadId is required' });
        }

        if (!message) {
            return res.status(400).json({ message: 'message is required' });
        }

        const messageEvent = await openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: message
        });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
  

        if (messageEvent.error) {
            return res.status(500).json({ message: messageEvent.error });
        } else {
            const stream = await openai.beta.threads.runs.create(threadId, {
                assistant_id: process.env.OPENAI_ASSISTANT_ID,
                stream:true
            });
            for await (const message of stream) {
                res.write(`data: ${JSON.stringify(message)}\n\n`);
            }
            
            res.end();
        }
    }
}