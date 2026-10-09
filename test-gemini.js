// Quick test script to verify Google Gemini API key works
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('\n📝 To get your FREE Gemini API key:');
    console.log('1. Visit: https://aistudio.google.com/app/apikey');
    console.log('2. Sign in with your Google account');
    console.log('3. Click "Create API Key"');
    console.log('4. Copy the key and add to .env file as GEMINI_API_KEY="your-key-here"');
    process.exit(1);
  }

  console.log('✅ API Key found:', apiKey.substring(0, 20) + '...');
  console.log('🧪 Testing Google Gemini API connection...\n');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = 'Say hello and confirm the Gemini API is working! Keep it to one short sentence.';
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('✅ SUCCESS! Google Gemini API is working!\n');
    console.log('Response:', text);
    console.log('\n📊 Cost: FREE! ✅');
    console.log('📊 Rate Limit: 60 requests/minute');
    console.log('📊 Daily Limit: 1,500 requests/day');
    console.log('\n🎉 Your Gemini API key is ready to use!');
    console.log('🎉 Generate unlimited articles for FREE!');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    if (error.message?.includes('API key')) {
      console.error('\n⚠️  Invalid API key. Please check your key and try again.');
      console.log('\n📝 Get your FREE key at: https://aistudio.google.com/app/apikey');
    }
    process.exit(1);
  }
}

testGemini();
