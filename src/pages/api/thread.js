const { default: OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY
})

export default async function handler(req, res) {
    if(req.method === "POST"){
        try{
            let newThread = await openai.beta.threads.create();
            res.status(200).json(newThread)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else if (req.method === 'DELETE') {
        const { threadId } = req.query;

        if (!threadId) {
            return res.status(400).json({ message: 'threadId is required' });
        }

        try {
            const deleteThread = await openai.beta.threads.del(threadId);
            res.status(200).json(deleteThread);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    else {
        res.status(405).json({ message: 'Method not allowed' })
    }
}