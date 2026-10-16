/**
 * Test Facebook Integration
 * Usage: node test-facebook.js
 */

require('dotenv').config();

const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FACEBOOK_PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

console.log('🔍 Testing Facebook Integration...\n');

// Check if credentials are configured
if (!FACEBOOK_PAGE_ID || !FACEBOOK_PAGE_ACCESS_TOKEN) {
  console.error('❌ Facebook credentials not found!');
  console.log('\nPlease add to your .env file:');
  console.log('FACEBOOK_PAGE_ID="your-page-id"');
  console.log('FACEBOOK_PAGE_ACCESS_TOKEN="your-token"');
  process.exit(1);
}

console.log('✅ Credentials found in .env');
console.log(`📄 Page ID: ${FACEBOOK_PAGE_ID.substring(0, 8)}...`);
console.log(`🔑 Token: ${FACEBOOK_PAGE_ACCESS_TOKEN.substring(0, 15)}...\n`);

// Test Facebook Graph API connection
async function testFacebookConnection() {
  try {
    console.log('📡 Testing connection to Facebook Graph API...\n');

    const url = `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}?fields=name,username,followers_count&access_token=${FACEBOOK_PAGE_ACCESS_TOKEN}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('❌ Facebook API Error:');
      console.error(`   Code: ${data.error.code}`);
      console.error(`   Message: ${data.error.message}`);
      console.error(`   Type: ${data.error.type}`);
      
      console.log('\n💡 Common fixes:');
      console.log('   1. Token expired - Generate a new long-lived token');
      console.log('   2. Wrong permissions - Token needs pages_manage_posts');
      console.log('   3. Wrong page - Make sure you selected correct page');
      console.log('\n📖 See FACEBOOK_SETUP.md for detailed instructions');
      process.exit(1);
    }

    console.log('✅ Successfully connected to Facebook!\n');
    console.log('📊 Page Information:');
    console.log(`   Name: ${data.name}`);
    console.log(`   Username: @${data.username || 'N/A'}`);
    console.log(`   Followers: ${data.followers_count || 'N/A'}`);
    console.log(`   Page ID: ${data.id}`);
    
    console.log('\n🎉 Facebook integration is working correctly!');
    console.log('\n✅ You can now:');
    console.log('   1. Publish articles and they will auto-post to Facebook');
    console.log('   2. Test with: Visit /admin/content and publish an article');
    console.log('   3. Check your Facebook page to see the post');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Possible issues:');
    console.log('   1. No internet connection');
    console.log('   2. Facebook API is down');
    console.log('   3. Invalid token format');
    process.exit(1);
  }
}

// Run the test
testFacebookConnection();
