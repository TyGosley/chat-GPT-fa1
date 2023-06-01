const PORT = 8000;
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.API_KEY;

app.post('/completions', async (req, res) => {
    const options = {
        method: 'POST',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        data: {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: req.body.message }],
            max_tokens: 100,
        }
    }
    try {
        const response = await axios(options);
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error(error);
    }
})

app.listen(PORT, () => console.log('Your server is running on Port😀 ' + PORT));
