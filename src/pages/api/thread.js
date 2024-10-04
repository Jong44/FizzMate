// IMPORT DEPENDENCIES OPENAI
const { default: OpenAI } = require("openai");

//  CREATE INSTANCE OPENAI WITH API KEY FROM ENV
const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY
})

// EXPORT DEFAULT FUNCTION HANDLER WITH REQ AND RES PARAMETER
export default async function handler(req, res) {
    // CHECK IF METHOD IS POST
    if(req.method === "POST"){
        try{
            // CREATE NEW THREAD FROM OPENAI API SERVICE
            let newThread = await openai.beta.threads.create();
            // RETURN RESPONSE WITH STATUS 200 AND DATA FROM OPENAI API SERVICE
            res.status(200).json(newThread)
        } catch (error) {
            // RETURN RESPONSE WITH STATUS 500 AND MESSAGE INTERNAL SERVER ERROR
            res.status(500).json({ message: 'Internal server error' });
        }
    } 

    // CHECK IF METHOD IS DELETE 
    else if (req.method === 'DELETE') {
        // INITIATE VARIABLE THREADID FROM REQ.QUERY
        const { threadId } = req.query;

        // CHECK IF THREADID IS EMPTY
        if (!threadId) {
            return res.status(400).json({ message: 'threadId is required' });
        }


        try {
            // DELETE THREAD FROM OPENAI API SERVICE BY THREADID
            const deleteThread = await openai.beta.threads.del(threadId);
            // RETURN RESPONSE WITH STATUS 200 AND DATA FROM OPENAI API SERVICE
            res.status(200).json(deleteThread);
        } catch (error) {
            // RETURN RESPONSE WITH STATUS 500 AND MESSAGE INTERNAL SERVER ERROR
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    // RETURN RESPONSE WITH STATUS 405 AND MESSAGE METHOD
    else {
        res.status(405).json({ message: 'Method not allowed' })
    }
}