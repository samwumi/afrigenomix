// Quick test script to verify OpenAI API key works
require('dotenv').config();
const OpenAI = require('openai').default;

async function testOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
    process.exit(1);
  }

  console.log('✅ API Key found:', apiKey.substring(0, 20) + '...');
  console.log('🧪 Testing OpenAI API connection...\n');

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond in one sentence.',
        },
        {
          role: 'user',
          content: 'Say hello and confirm the API is working!',
        },
      ],
      max_tokens: 50,
    });

    const response = completion.choices[0]?.message?.content;
    const tokens = completion.usage?.total_tokens || 0;
    const cost = (tokens * 0.000001).toFixed(6);

    console.log('✅ SUCCESS! OpenAI API is working!\n');
    console.log('Response:', response);
    console.log('\n📊 Usage:');
    console.log('- Tokens used:', tokens);
    console.log('- Cost: $' + cost);
    console.log('\n🎉 Your API key is ready to use!');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    if (error.status === 401) {
      console.error('\n⚠️  Invalid API key. Please check your key and try again.');
    } else if (error.status === 429) {
      console.error('\n⚠️  Rate limit exceeded. Wait a moment and try again.');
    }
    process.exit(1);
  }
}

testOpenAI();
