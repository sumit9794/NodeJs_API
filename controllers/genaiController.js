// controllers/genaiController.js
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ✅ Controller: Chat Completion
exports.generateChatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant for a real estate app.' },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiText = response.data.choices?.[0]?.message?.content || 'No response received.';
    res.json({ reply: aiText });
  } catch (error) {
    console.error('🔥 OpenAI API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'AI request failed.' });
  }
};

// ✅ Controller: (Optional) Image Generation
exports.generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });

    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt,
        n: 1,
        size: '512x512',
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const imageUrl = response.data.data[0].url;
    res.json({ image: imageUrl });
  } catch (error) {
    console.error('🔥 Image Generation Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Image generation failed.' });
  }
};
