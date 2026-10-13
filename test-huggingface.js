// Quick test script to verify Hugging Face API works
require('dotenv').config();
const { HfInference } = require('@huggingface/inference');

async function testHuggingFace() {
  const token = process.env.HUGGINGFACE_TOKEN;
  
  if (!token) {
    console.error('❌ HUGGINGFACE_TOKEN not found in environment variables');
    console.log('\n📝 To get your FREE Hugging Face token:');
    console.log('1. Visit: https://huggingface.co/settings/tokens');
    console.log('2. Sign up/Login (free account)');
    console.log('3. Click "New token"');
    console.log('4. Select "Inference" preset');
    console.log('5. Copy the token and add to .env file as HUGGINGFACE_TOKEN="your-token-here"');
    process.exit(1);
  }

  console.log('✅ Token found:', token.substring(0, 15) + '...');
  console.log('🧪 Testing Hugging Face API connection...\n');

  try {
    const hf = new HfInference(token);

    const result = await hf.textGeneration({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      inputs: 'Say hello and confirm the Hugging Face API is working! Keep it to one sentence.',
      parameters: {
        max_new_tokens: 50,
        temperature: 0.7,
        return_full_text: false,
      },
    });

    const response = result.generated_text;

    console.log('✅ SUCCESS! Hugging Face API is working!\n');
    console.log('Response:', response);
    console.log('\n📊 Details:');
    console.log('- Model: Mistral-7B-Instruct-v0.2');
    console.log('- Cost: FREE ✅');
    console.log('- Rate Limit: Generous free tier');
    console.log('\n🎉 Your Hugging Face token is ready to use!');
    console.log('🎉 Generate unlimited articles for FREE!');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    if (error.message?.includes('Authorization') || error.message?.includes('token')) {
      console.error('\n⚠️  Invalid token. Please check your token and try again.');
      console.log('\n📝 Get your FREE token at: https://huggingface.co/settings/tokens');
    }
    process.exit(1);
  }
}

testHuggingFace();
