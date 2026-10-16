/**
 * Update AI Author Title in Database
 * Removes "AI Content Generator" title from existing author
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAuthorTitle() {
  console.log('🔄 Updating author title in database...\n');

  try {
    // Find the AI author
    const aiAuthor = await prisma.contentAuthor.findFirst({
      where: {
        email: 'ai@afrigenomix.com',
      },
    });

    if (!aiAuthor) {
      console.log('ℹ️  AI author not found in database');
      console.log('   (This is normal if you haven\'t generated articles yet)');
      return;
    }

    console.log('📋 Current author details:');
    console.log(`   Name: ${aiAuthor.name}`);
    console.log(`   Title: ${aiAuthor.title || '(blank)'}`);
    console.log(`   Bio: ${aiAuthor.bio}`);
    console.log('');

    // Update the author
    const updated = await prisma.contentAuthor.update({
      where: {
        id: aiAuthor.id,
      },
      data: {
        title: '',
        bio: 'The Afrigenomix editorial team brings you the latest insights in African genomics and personalized medicine.',
      },
    });

    console.log('✅ Successfully updated author!');
    console.log('');
    console.log('📋 New author details:');
    console.log(`   Name: ${updated.name}`);
    console.log(`   Title: ${updated.title || '(blank)'}`);
    console.log(`   Bio: ${updated.bio}`);
    console.log('');

    // Count articles by this author
    const articleCount = await prisma.article.count({
      where: {
        authorId: updated.id,
      },
    });

    console.log(`📊 ${articleCount} article(s) are using this author`);
    console.log('   They will now show without the "AI Content Generator" title');
    console.log('');
    console.log('🎉 All done!');

  } catch (error) {
    console.error('❌ Error updating author:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateAuthorTitle();
