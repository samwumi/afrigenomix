import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Sample blog articles
const articles = [
  {
    title: 'Understanding DNA Paternity Testing in Africa',
    slug: 'understanding-dna-paternity-testing-africa',
    excerpt: 'A comprehensive guide to DNA paternity testing in Africa, including types of tests, processes, costs, and legal considerations for Nigerian families.',
    category: 'DNA_EDUCATION' as const,
    content: fs.readFileSync(
      path.join(__dirname, '..', 'BLOG_SAMPLE_ARTICLE.md'),
      'utf-8'
    ),
    metaTitle: 'DNA Paternity Testing in Africa: Complete Guide 2026',
    metaDescription: 'Learn everything about DNA paternity testing in Africa. Understand the process, costs, legal requirements, and how to choose the right test for your needs.',
    isFeatured: true,
  },
  {
    title: 'Paternity Fraud: The Silent Crisis Affecting Nigerian Families',
    slug: 'paternity-fraud-silent-crisis-nigeria',
    excerpt: 'Exploring the prevalence of paternity fraud in Nigeria, its emotional and financial impact, and why mandatory DNA testing could be the solution.',
    category: 'PATERNITY_FRAUD' as const,
    content: `# Paternity Fraud: The Silent Crisis Affecting Nigerian Families

## The Hidden Reality

Paternity fraud occurs when a woman falsely identifies a man as the biological father of her child. While exact statistics are difficult to obtain in Nigeria, global research suggests 10-30% of paternity tests reveal non-paternity.

## The Impact

### Emotional Consequences
- Betrayal and loss of trust
- Identity crisis for children
- Family breakdown
- Psychological trauma

### Financial Burden
Men raising children who aren't biologically theirs face:
- Years of financial support
- Educational expenses
- Healthcare costs
- Legal obligations

## The Solution: Mandatory Testing

We advocate for mandatory DNA testing at birth because:

1. **Prevention**: Eliminates fraud before it starts
2. **Protection**: Safeguards men's rights
3. **Transparency**: Promotes honesty in relationships
4. **Child Welfare**: Ensures children know their true heritage

## Join Our Campaign

Sign our petition for legislative reform at [afrigenomix.com/advocacy](https://afrigenomix.com/advocacy)

Together, we can end paternity fraud in Nigeria.`,
    metaTitle: 'Paternity Fraud in Nigeria: Understanding the Crisis',
    metaDescription: 'The truth about paternity fraud in Nigeria. Learn about its prevalence, impact, and our campaign for mandatory DNA testing to protect families.',
    isFeatured: false,
  },
  {
    title: 'Immigration DNA Testing: Requirements for Nigerian Visa Applications',
    slug: 'immigration-dna-testing-nigerian-visa',
    excerpt: 'Everything you need to know about DNA testing for UK, USA, and Canadian visa applications from Nigeria, including requirements and accredited laboratories.',
    category: 'IMMIGRATION_DNA' as const,
    content: `# Immigration DNA Testing: Requirements for Nigerian Visa Applications

## When is DNA Testing Required?

Immigration authorities may require DNA testing to prove biological relationships when:

- Documentation is unavailable or unreliable
- Claimed relationships are questioned
- Sponsoring family members abroad

## Countries That Require DNA Testing

### United Kingdom
- Family reunion visas
- Spouse visas with children
- Settlement applications

### United States
- Family-based immigration
- K-1 Fiancé visa (with children)
- Refugee family reunification

### Canada
- Family class sponsorship
- Dependent child applications
- Parent/grandparent sponsorship

## The Testing Process

### 1. Request from Embassy
You'll receive official notification requiring DNA testing.

### 2. Choose Accredited Laboratory
Only use AABB or ISO-accredited labs approved by the embassy.

### 3. Sample Collection
Visit an approved facility in Nigeria for sample collection under strict chain of custody.

### 4. Results Submission
Laboratory directly sends results to the embassy (usually 5-10 business days).

## Costs and Timeline

| Country | Average Cost | Processing Time |
|---------|--------------|-----------------|
| UK | ₦180,000 - ₦250,000 | 10-15 days |
| USA | ₦200,000 - ₦300,000 | 7-10 days |
| Canada | ₦180,000 - ₦250,000 | 10-15 days |

## Important Requirements

✅ **Use Accredited Labs Only**: Non-accredited results will be rejected  
✅ **Chain of Custody**: Proper documentation is critical  
✅ **All Parties Tested**: Include all family members in application  
✅ **Witnessed Collection**: Samples must be collected by authorized personnel

## Afrigenomix Support

We work with internationally accredited laboratories to provide:

- Embassy-approved testing
- Proper chain of custody
- Direct results submission
- Fast turnaround times
- Expert guidance throughout

Contact us for immigration DNA testing assistance.`,
    metaTitle: 'Immigration DNA Testing for Nigerian Visa Applications',
    metaDescription: 'Complete guide to DNA testing for UK, USA, and Canadian visa applications from Nigeria. Learn requirements, costs, and approved laboratories.',
    isFeatured: false,
  },
  {
    title: 'Legal DNA Testing vs Peace of Mind Testing: Which Do You Need?',
    slug: 'legal-dna-vs-peace-of-mind-testing',
    excerpt: 'Understanding the differences between legal DNA tests and peace of mind tests, including accuracy, cost, process, and when each type is appropriate.',
    category: 'LEGAL_DNA' as const,
    content: `# Legal DNA Testing vs Peace of Mind Testing

## The Key Difference

Both test types use identical DNA analysis methods and provide the same accuracy. The difference is in **documentation and chain of custody**.

## Legal DNA Testing

### When You Need It:
- Court proceedings
- Child support cases
- Immigration applications
- Custody disputes
- Inheritance claims
- Birth certificate changes

### Key Features:
✅ Court-admissible results  
✅ Strict chain of custody  
✅ Witnessed sample collection  
✅ Government-issued ID verification  
✅ Photographs of participants  
✅ Legal documentation

### Process:
1. Book appointment at accredited facility
2. Bring government ID
3. Witnessed sample collection
4. Chain of custody forms signed
5. Results delivered with legal certification

### Cost: ₦100,000 - ₦150,000

## Peace of Mind Testing

### When You Need It:
- Personal curiosity
- Relationship verification
- Private knowledge
- Family planning decisions
- No legal proceedings planned

### Key Features:
✅ Same DNA analysis accuracy  
✅ Complete privacy  
✅ Home collection possible  
✅ Lower cost  
✅ Faster results  
❌ Not court-admissible

### Process:
1. Order test kit online
2. Self-collect samples at home
3. Mail samples to laboratory
4. Results via email/online portal

### Cost: ₦50,000 - ₦80,000

## Accuracy Comparison

| Factor | Legal Test | Peace of Mind |
|--------|-----------|---------------|
| DNA Analysis | 99.99%+ | 99.99%+ |
| Methodology | Identical | Identical |
| Laboratory | Same | Same |
| Court Use | ✅ Yes | ❌ No |

## Can You Upgrade?

❌ **No** - You cannot convert peace of mind results to legal results. If you think you might need court-admissible results, start with legal testing.

## Our Recommendation

Choose **Legal Testing** if:
- Any possibility of court involvement
- Immigration purposes
- Official documentation needed
- Dispute resolution

Choose **Peace of Mind Testing** if:
- Personal knowledge only
- No legal action planned
- Budget-conscious
- Maximum privacy desired

## Get Started

Not sure which test you need? Contact our specialists for free consultation.

📞 +234-XXX-XXXX-XXX  
📧 info@afrigenomix.com`,
    metaTitle: 'Legal DNA Test vs Peace of Mind Test: Key Differences',
    metaDescription: 'Compare legal DNA testing and peace of mind testing. Learn which type you need, accuracy differences, costs, and processes in Nigeria.',
    isFeatured: false,
  },
  {
    title: 'Our Campaign for Mandatory Paternity Testing at Birth in Nigeria',
    slug: 'campaign-mandatory-paternity-testing-nigeria',
    excerpt: 'Join our movement to make DNA paternity testing mandatory at birth in Nigeria. Learn about our legislative goals, petition, and how you can help.',
    category: 'ADVOCACY' as const,
    content: `# Our Campaign for Mandatory Paternity Testing at Birth

## The Problem

Paternity fraud destroys families, wastes resources, and damages children's understanding of their heritage. Current Nigerian law offers little protection for men who discover they've been deceived.

## Our Solution

**Make DNA paternity testing mandatory at birth** - just like heel prick tests and vaccinations.

## Why This Matters

### Prevents Fraud Before It Starts
No opportunity for deception when testing is standard procedure.

### Protects Men's Rights
Men deserve to know the truth from day one, not years later.

### Benefits Children
Children have the right to know their biological heritage for medical and identity purposes.

### Saves Resources
Prevents years of emotional and financial investment based on lies.

### Promotes Honesty
Encourages honesty in relationships from the beginning.

## Our Legislative Goals

We're advocating for laws that:

1. **Require** DNA testing at birth in all hospitals
2. **Criminalize** deliberate paternity fraud
3. **Allow** men to recover financial damages
4. **Mandate** government subsidies for affordable testing
5. **Establish** paternity fraud as grounds for legal action

## The Campaign

### What We've Achieved:
- 50,000+ petition signatures
- Media coverage in major Nigerian outlets
- Meetings with lawmakers
- Public awareness events across Nigeria
- Partnership with international advocacy groups

### What's Next:
- Reach 100,000 signatures
- Present bill to National Assembly
- State-by-state advocacy
- International support mobilization

## How You Can Help

### Sign the Petition
Visit [afrigenomix.com/petition](https://afrigenomix.com/petition) to add your voice.

### Share Your Story
Know someone affected by paternity fraud? Share their story (anonymously) to help others understand the impact.

### Spread Awareness
Share on social media:
- Twitter: #EndPaternityFraud #MandatoryDNATesting
- Facebook: Tag @Afrigenomix
- Instagram: Use our campaign graphics

### Contact Your Representatives
Write to your:
- Local government chairman
- State representative
- Federal senator

### Donate
Support our advocacy work:
- Legal fees for bill drafting
- Campaign materials
- Public awareness events
- Subsidized DNA tests for low-income families

## Opposition Arguments (And Our Response)

### "It shows lack of trust"
**Our Response**: Trust is earned, not assumed. Verification protects everyone.

### "It's too expensive"
**Our Response**: Government subsidies can make it affordable, just like vaccinations.

### "It's against our culture"
**Our Response**: Culture should evolve to protect truth and justice.

### "Not all women lie"
**Our Response**: Testing isn't about distrust—it's about verification, protecting both honest women and innocent men.

## Success Stories from Other Countries

### France
While testing is restricted, awareness has led to cultural shift.

### Germany
Legal paternity testing available with proper consent frameworks.

### United States
Many states recognize paternity fraud as legal grounds for action.

## Join the Movement

This is a pivotal moment for Nigerian family law. With your support, we can create lasting change that protects families, children, and truth itself.

**Sign the petition today**: [afrigenomix.com/petition](https://afrigenomix.com/petition)

Together, we can end paternity fraud in Nigeria.

---

*Campaign launched: January 2026*  
*Signatures collected: 50,000+*  
*Goal: Legislative reform by 2027*`,
    metaTitle: 'Join Our Campaign: Mandatory Paternity Testing in Nigeria',
    metaDescription: 'Support our movement for mandatory DNA paternity testing at birth in Nigeria. Learn about our legislative goals and how to help end paternity fraud.',
    isFeatured: false,
  },
];

async function seedBlog() {
  console.log('Starting blog seed...');

  try {
    // Find or create a content author (not regular user)
    let author = await prisma.contentAuthor.findFirst({
      where: { email: 'admin@afrigenomix.com' },
    });

    if (!author) {
      console.log('No content author found, creating one...');

      author = await prisma.contentAuthor.create({
        data: {
          name: 'Dr. Sarah Okonkwo',
          title: 'Chief Genetics Counselor',
          bio: 'Dr. Sarah Okonkwo is a leading genetics counselor with over 15 years of experience in DNA testing and paternity verification. She holds a PhD in Molecular Biology and is passionate about making DNA testing accessible across Africa.',
          email: 'admin@afrigenomix.com',
        },
      });
      console.log('Content author created');
    }

    // Create articles
    for (const article of articles) {
      const existing = await prisma.article.findUnique({
        where: { slug: article.slug },
      });

      if (existing) {
        console.log(`Article "${article.title}" already exists, skipping...`);
        continue;
      }

      await prisma.article.create({
        data: {
          ...article,
          authorId: author.id,
          status: 'PUBLISHED',
          publishedAt: new Date(),
          viewCount: Math.floor(Math.random() * 500) + 100, // Random view count for demo
        },
      });

      console.log(`✓ Created article: ${article.title}`);
    }

    console.log('\n✅ Blog seed completed successfully!');
    console.log(`📝 Created ${articles.length} articles`);
    console.log(`👤 Author: ${author.name}`);
  } catch (error) {
    console.error('❌ Error seeding blog:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedBlog()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
