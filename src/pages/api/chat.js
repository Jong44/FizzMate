const { default: OpenAI } = require("openai");
import { Server } from 'ws';

const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY
})

export default async function handler(req, res) {
     if (req.method === 'GET') {
        const { threadId } = req.query;

        if (!threadId) {
            return res.status(400).json({ message: 'threadId is required' });
        }

        const threadMessages = await openai.beta.threads.messages.list(
            threadId, {
            order: 'asc',
            limit: 100
        }
        );
        // Kirim pesan ke semua client WebSocket yang terhubung
        res.status(200).json(threadMessages.body.data);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}