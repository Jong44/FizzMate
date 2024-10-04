
// IMPORT DEPENDENCIES OPENAI
const { default: OpenAI } = require("openai");

// CREATE INSTANCE OPENAI WITH API KEY FROM ENV
const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY
})


// EXPORT DEFAULT FUNCTION HANDLER WITH REQ AND RES PARAMETER
export default async function handler(req, res) {
    // CHECK IF METHOD IS GET
     if (req.method === 'GET') {
        // INITIATE VARIABLE THREADID FROM REQ.QUERY
        const { threadId } = req.query;

        // CHECK IF THREADID IS EMPTY
        if (!threadId) {
            return res.status(400).json({ message: 'threadId is required' });
        }

        // GET MESSAGES FROM OPENAI API SERVICE BY THREADID DENGAN LIMIT 100 PESAN DAN DIURUTKAN ASCENDING
        const threadMessages = await openai.beta.threads.messages.list(
            threadId, {
            order: 'asc',
            limit: 100
        }
        );
        // RETURN RESPONSE WITH STATUS 200 AND DATA FROM OPENAI API SERVICE
        res.status(200).json(threadMessages.body.data);
    } else {
        // RETURN RESPONSE WITH STATUS 405 AND MESSAGE METHOD NOT ALLOWED
        res.status(405).json({ message: 'Method not allowed' });
    }
}