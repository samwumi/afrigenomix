// Seed script for development and testing
// Run with: npx tsx prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (be careful in production!)
  console.log('🗑️  Clearing existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.campaignUpdate.deleteMany();
  await prisma.campaignMilestone.deleteMany();
  await prisma.advocacyCampaign.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.articleTag.deleteMany();
  await prisma.article.deleteMany();
  await prisma.contentAuthor.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.result.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.sample.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.document.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.caseTimeline.deleteMany();
  await prisma.case.deleteMany();
  await prisma.testType.deleteMany();
  await prisma.collectionLocation.deleteMany();
  await prisma.collectionPartner.deleteMany();
  await prisma.labPartner.deleteMany();
  await prisma.laboratoryAccreditation.deleteMany();
  await prisma.laboratory.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log('👤 Creating users...');
  
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@afrigenomix.com',
      passwordHash,
      role: 'SUPER_ADMIN',
      emailVerified: true,
      phone: '+2348012345678',
    },
  });

  // Customer Users
  const customer1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      passwordHash,
      role: 'CUSTOMER',
      emailVerified: true,
      phone: '+2348098765432',
      customerProfile: {
        create: {
          fullName: 'John Doe',
          country: 'Nigeria',
          city: 'Lagos',
          state: 'Lagos',
          address: '123 Victoria Island, Lagos',
          postalCode: '101241',
        },
      },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'sarah.johnson@example.com',
      passwordHash,
      role: 'CUSTOMER',
      emailVerified: true,
      phone: '+2347012345678',
      customerProfile: {
        create: {
          fullName: 'Sarah Johnson',
          country: 'Nigeria',
          city: 'Abuja',
          state: 'FCT',
          address: '45 Maitama Street, Abuja',
          postalCode: '900001',
        },
      },
    },
  });

  // Create Laboratories
  console.log('🔬 Creating laboratories...');
  
  const labNigeria = await prisma.laboratory.create({
    data: {
      name: 'GeneTech Diagnostics Nigeria',
      country: 'Nigeria',
      city: 'Lagos',
      address: 'Plot 15, Medical District, Ikeja, Lagos',
      phone: '+2341234567890',
      email: 'info@genetech.ng',
      website: 'https://genetech.ng',
      status: 'ACTIVE',
      capabilities: JSON.stringify(['PATERNITY', 'MATERNITY', 'SIBLING', 'LEGAL', 'IMMIGRATION']),
      description: 'Leading DNA testing laboratory in Nigeria with international accreditation.',
      accreditations: {
        create: [
          {
            accreditationType: 'ISO 17025',
            accreditationBody: 'UKAS',
            accreditationNumber: 'ISO-NG-2024-001',
            issuedDate: new Date('2024-01-01'),
            expiryDate: new Date('2027-01-01'),
            verified: true,
          },
          {
            accreditationType: 'AABB Accreditation',
            accreditationBody: 'AABB',
            accreditationNumber: 'AABB-NG-2024-002',
            issuedDate: new Date('2024-01-15'),
            expiryDate: new Date('2027-01-15'),
            verified: true,
          },
        ],
      },
    },
  });

  const labUK = await prisma.laboratory.create({
    data: {
      name: 'AlphaBiolabs UK',
      country: 'United Kingdom',
      city: 'Warrington',
      address: 'Unit 1-2 Warrington, WA1 3AB',
      phone: '+44 161 123 4567',
      email: 'info@alphabiolabs.co.uk',
      website: 'https://alphabiolabs.co.uk',
      status: 'ACTIVE',
      capabilities: JSON.stringify(['PATERNITY', 'MATERNITY', 'SIBLING', 'LEGAL', 'IMMIGRATION', 'PRENATAL']),
      description: 'UK-based ISO 17025 accredited DNA testing laboratory.',
      accreditations: {
        create: [
          {
            accreditationType: 'ISO 17025',
            accreditationBody: 'UKAS',
            accreditationNumber: 'ISO-UK-2023-456',
            issuedDate: new Date('2023-06-01'),
            expiryDate: new Date('2026-06-01'),
            verified: true,
          },
        ],
      },
    },
  });

  // Create Lab Partner
  const labUser = await prisma.user.create({
    data: {
      email: 'lab@genetech.ng',
      passwordHash,
      role: 'LAB_PARTNER',
      emailVerified: true,
      phone: '+2341234567891',
      labPartner: {
        create: {
          fullName: 'Dr. Adebayo Okonkwo',
          position: 'Laboratory Director',
          laboratoryId: labNigeria.id,
        },
      },
    },
  });

  // Create Collection Partner
  const collectionUser = await prisma.user.create({
    data: {
      email: 'collection@medcenter.ng',
      passwordHash,
      role: 'COLLECTION_PARTNER',
      emailVerified: true,
      phone: '+2348087654321',
      collectionPartner: {
        create: {
          name: 'MedCenter Collection Services',
          country: 'Nigeria',
          city: 'Lagos',
          address: 'Medical Plaza, Victoria Island',
          phone: '+2348087654321',
          email: 'collection@medcenter.ng',
          isActive: true,
        },
      },
    },
  });

  const collectionPartner = await prisma.collectionPartner.findFirst({
    where: { userId: collectionUser.id },
  });

  // Create Collection Locations
  await prisma.collectionLocation.createMany({
    data: [
      {
        collectionPartnerId: collectionPartner!.id,
        name: 'MedCenter Lagos - Victoria Island',
        country: 'Nigeria',
        city: 'Lagos',
        address: 'Plot 42, Ajose Adeogun Street, Victoria Island',
        phone: '+2348087654321',
        operatingHours: 'Mon-Fri: 8am-5pm, Sat: 9am-2pm',
        isActive: true,
      },
      {
        collectionPartnerId: collectionPartner!.id,
        name: 'MedCenter Lagos - Ikeja',
        country: 'Nigeria',
        city: 'Lagos',
        address: '15 Allen Avenue, Ikeja',
        phone: '+2348087654322',
        operatingHours: 'Mon-Fri: 8am-5pm',
        isActive: true,
      },
      {
        collectionPartnerId: collectionPartner!.id,
        name: 'MedCenter Abuja',
        country: 'Nigeria',
        city: 'Abuja',
        address: '23 Cadastral Zone, Central Business District',
        phone: '+2349012345678',
        operatingHours: 'Mon-Fri: 8am-6pm, Sat: 9am-2pm',
        isActive: true,
      },
    ],
  });

  // Create Test Types
  console.log('🧬 Creating test types...');
  
  const testTypes = await prisma.testType.createMany({
    data: [
      {
        name: 'Paternity DNA Test',
        slug: 'paternity-dna-test',
        category: 'PATERNITY',
        description: 'Establish biological relationship between father and child for personal knowledge.',
        sampleType: 'Buccal swab',
        isLegal: false,
        chainOfCustody: false,
        turnaroundDays: 3,
        price: 65000,
        currency: 'NGN',
        isActive: true,
      },
      {
        name: 'Legal Paternity DNA Test',
        slug: 'legal-paternity-dna-test',
        category: 'LEGAL',
        description: 'Court-admissible paternity test with identity verification and chain of custody.',
        sampleType: 'Buccal swab',
        isLegal: true,
        chainOfCustody: true,
        turnaroundDays: 5,
        price: 95000,
        currency: 'NGN',
        isActive: true,
      },
      {
        name: 'UK Immigration DNA Test',
        slug: 'uk-immigration-dna-test',
        category: 'IMMIGRATION',
        description: 'DNA testing for UK visa and immigration applications with Home Office requirements.',
        sampleType: 'Buccal swab',
        isLegal: true,
        chainOfCustody: true,
        turnaroundDays: 7,
        price: 450,
        currency: 'GBP',
        isActive: true,
      },
      {
        name: 'USA Immigration DNA Test',
        slug: 'usa-immigration-dna-test',
        category: 'IMMIGRATION',
        description: 'DNA testing for US immigration applications (USCIS approved).',
        sampleType: 'Buccal swab',
        isLegal: true,
        chainOfCustody: true,
        turnaroundDays: 7,
        price: 550,
        currency: 'USD',
        isActive: true,
      },
      {
        name: 'Maternity DNA Test',
        slug: 'maternity-dna-test',
        category: 'MATERNITY',
        description: 'Establish biological relationship between mother and child.',
        sampleType: 'Buccal swab',
        isLegal: false,
        chainOfCustody: false,
        turnaroundDays: 3,
        price: 65000,
        currency: 'NGN',
        isActive: true,
      },
      {
        name: 'Sibling DNA Test',
        slug: 'sibling-dna-test',
        category: 'SIBLING',
        description: 'Determine if two individuals share one or both parents.',
        sampleType: 'Buccal swab',
        isLegal: false,
        chainOfCustody: false,
        turnaroundDays: 5,
        price: 85000,
        currency: 'NGN',
        isActive: true,
      },
      {
        name: 'Prenatal Paternity DNA Test',
        slug: 'prenatal-paternity-dna-test',
        category: 'PRENATAL',
        description: 'Non-invasive prenatal paternity test using maternal blood sample.',
        sampleType: 'Blood sample',
        isLegal: false,
        chainOfCustody: false,
        turnaroundDays: 10,
        price: 450000,
        currency: 'NGN',
        isActive: true,
      },
    ],
  });

  // Create sample cases
  console.log('📋 Creating sample cases...');
  
  const customerProfile1 = await prisma.customerProfile.findUnique({
    where: { userId: customer1.id },
  });

  const testType1 = await prisma.testType.findFirst({
    where: { slug: 'legal-paternity-dna-test' },
  });

  const case1 = await prisma.case.create({
    data: {
      caseNumber: 'AFG-2026-000001',
      customerId: customerProfile1!.id,
      testTypeId: testType1!.id,
      laboratoryId: labNigeria.id,
      status: 'TESTING_IN_PROGRESS',
      purpose: 'Legal',
      country: 'Nigeria',
      notes: 'Legal paternity test for court proceedings',
      participants: {
        create: [
          {
            fullName: 'John Doe',
            relationship: 'Alleged Father',
            dateOfBirth: new Date('1985-03-15'),
            country: 'Nigeria',
            city: 'Lagos',
            phone: '+2348098765432',
          },
          {
            fullName: 'Michael Doe',
            relationship: 'Child',
            dateOfBirth: new Date('2015-07-20'),
            country: 'Nigeria',
            city: 'Lagos',
          },
        ],
      },
      timeline: {
        create: [
          {
            event: 'Case created',
            description: 'Test request submitted by customer',
            performedBy: 'Customer',
            createdAt: new Date('2026-08-20'),
          },
          {
            event: 'Documents verified',
            description: 'All required documents verified',
            performedBy: 'Admin',
            createdAt: new Date('2026-08-21'),
          },
          {
            event: 'Collection completed',
            description: 'Samples collected at Victoria Island location',
            performedBy: 'Collection Partner',
            createdAt: new Date('2026-08-23'),
          },
          {
            event: 'Sample received',
            description: 'Laboratory confirmed sample receipt',
            performedBy: 'Laboratory',
            createdAt: new Date('2026-08-25'),
          },
          {
            event: 'Testing in progress',
            description: 'DNA analysis underway',
            performedBy: 'Laboratory',
            createdAt: new Date('2026-08-26'),
          },
        ],
      },
    },
  });

  // Create Articles
  console.log('📝 Creating knowledge base articles...');
  
  // Create Content Authors
  const author1 = await prisma.contentAuthor.create({
    data: {
      name: 'Dr. Chidi Okafor',
      title: 'DNA Science Expert & Founder',
      bio: 'Leading advocate for DNA testing accessibility in Africa and champion for paternity fraud legislation',
      email: 'admin@afrigenomix.com',
      social: JSON.stringify({
        facebook: 'https://facebook.com/afrigenomix',
        twitter: 'https://twitter.com/afrigenomix',
        linkedin: 'https://linkedin.com/company/afrigenomix',
        instagram: 'https://instagram.com/afrigenomix',
      }),
      isActive: true,
    },
  });

  await prisma.article.createMany({
    data: [
      {
        title: 'What Is a Paternity DNA Test? A Complete Guide for Nigerians',
        slug: 'what-is-paternity-dna-test-nigeria',
        category: 'DNA_EDUCATION',
        authorId: author1.id,
        content: `
# What Is a Paternity DNA Test?

A paternity DNA test scientifically establishes whether a man is the biological father of a child. This is done by comparing the DNA profiles of the tested individuals.

## How It Works

DNA is inherited from both parents. A child receives 50% of their DNA from their mother and 50% from their biological father. By analyzing specific DNA markers (called loci), we can determine with over 99.99% accuracy whether a tested man is the biological father.

## Types of Paternity Tests

### 1. Peace-of-Mind Testing
For personal knowledge only. Not admissible in court but provides accurate results for private decision-making.

### 2. Legal DNA Testing
Includes identity verification and chain of custody. Admissible in Nigerian courts and accepted for legal proceedings.

### 3. Immigration DNA Testing
Meets requirements for visa applications to UK, USA, Canada and other countries requiring biological relationship proof.

## Why Africans Need Access to DNA Testing

DNA testing should be accessible and affordable across Africa. Every child has the right to know their biological heritage, and every family deserves access to scientific truth.

Visit Afrigenomix to learn about our affordable testing options across Nigeria and Africa.
        `,
        excerpt: 'Learn everything about paternity DNA testing, how it works, and why it matters for Nigerian families.',
        isFeatured: true,
        status: 'PUBLISHED',
        metaTitle: 'What Is Paternity DNA Test? Complete Guide Nigeria 2026',
        metaDescription: 'Comprehensive guide to paternity DNA testing in Nigeria. Learn how it works, types of tests, accuracy, and where to get tested affordably.',
        metaKeywords: 'paternity test Nigeria, DNA test Lagos, paternity DNA Nigeria, DNA testing Africa',
        viewCount: 1250,
        publishedAt: new Date('2026-01-15'),
      },
      {
        title: 'The Silent Crime: Why Nigeria Must Criminalize Paternity Fraud',
        slug: 'criminalize-paternity-fraud-nigeria',
        category: 'PATERNITY_FRAUD',
        authorId: author1.id,
        content: `
# Paternity Fraud: Nigeria's Silent Epidemic

Paternity fraud occurs when a woman deliberately misrepresents or conceals the biological father of her child, leading a man to believe he is the biological father when he is not.

## The Scale of the Problem

While exact numbers are difficult to establish, studies from other countries suggest paternity fraud affects between 1-10% of cases. In Nigeria, where DNA testing is not routine, the actual number could be higher.

## The Harm It Causes

### Financial Harm
- Men may pay child support for decades for children who are not biologically theirs
- Resources are diverted from biological fathers who should be providing support
- Family resources are drained under false pretenses

### Emotional and Psychological Harm
- Betrayal of trust destroys relationships
- Children grow up with false identity information
- Men develop trust issues and emotional trauma
- Biological fathers are denied relationship with their children

### Medical Harm
- Incorrect family medical history puts children at risk
- Inherited conditions may go undiagnosed
- Organ transplant matching becomes impossible

## Why It Should Be a Criminal Offense

Paternity fraud is:
1. **Fraud** - deliberate deception for financial gain
2. **Identity theft** - denying a child their true biological identity
3. **Child abuse** - depriving a child of their biological father
4. **Financial crime** - obtaining money through deception

## What We're Advocating For

We are calling for Nigerian law to:
- Make deliberate paternity fraud a criminal offense
- Allow victims to recover financial damages
- Provide DNA testing accessibility for contested paternity cases
- Protect children's right to know their biological identity

## Join the Movement

Sign our petition to the National Assembly demanding legislation to criminalize paternity fraud in Nigeria.

**Every child deserves to know their truth. Every man deserves to know his children.**
        `,
        excerpt: 'Paternity fraud is a silent crime affecting thousands of Nigerian families. It\'s time for legislation to protect victims and children.',
        isFeatured: true,
        status: 'PUBLISHED',
        metaTitle: 'Why Nigeria Must Criminalize Paternity Fraud | Afrigenomix',
        metaDescription: 'Paternity fraud destroys families and harms children. Learn why Nigeria needs legislation to criminalize this silent crime.',
        metaKeywords: 'paternity fraud Nigeria, criminalize paternity fraud, DNA testing legislation Nigeria, paternity fraud law',
        viewCount: 3420,
        publishedAt: new Date('2026-02-20'),
      },
      {
        title: 'UK Immigration DNA Testing: Complete Guide for Nigerian Applicants',
        slug: 'uk-immigration-dna-testing-guide-nigeria',
        category: 'IMMIGRATION_DNA',
        authorId: author1.id,
        content: `
# UK Immigration DNA Testing for Nigerians

If you're applying to bring family members to the UK and need to prove biological relationship, DNA testing may be required by UK Visas and Immigration (UKVI).

## When Is DNA Testing Required?

DNA testing for UK immigration is typically requested when:
- Standard documentation is insufficient to prove relationship
- Birth certificates or other documents are unavailable or questionable
- Home Office requires additional evidence of biological relationship

## Requirements for UK Immigration DNA Testing

1. **Home Office Approved Laboratory**
   Tests must be conducted by laboratories approved by UKVI

2. **Chain of Custody**
   Strict identity verification and sample handling procedures must be followed

3. **Controlled Sample Collection**
   Samples must be collected by authorized personnel with identity verification

4. **Proper Documentation**
   All participants must provide valid identification

## The Process with Afrigenomix

1. Submit your visa application and await Home Office request for DNA testing
2. Contact Afrigenomix with your case details
3. We coordinate testing with approved UK laboratories
4. Collection arranged in Nigeria (and UK if needed)
5. Laboratory sends results directly to Home Office
6. You receive copy of results

## Cost

UK immigration DNA testing typically costs £400-£600 depending on:
- Number of participants
- Countries involved
- Relationship being tested
- Urgency requirements

## Timeline

Standard processing: 10-15 working days from sample collection

## Why Choose Afrigenomix

- We work with UKVI-approved laboratories
- Coordinated collection in Nigeria and internationally
- Expert guidance through the entire process
- Transparent pricing
- Dedicated support

Contact us today to discuss your UK immigration DNA testing needs.
        `,
        excerpt: 'Complete guide to DNA testing for UK visa applications. Requirements, process, costs and timeline explained.',
        isFeatured: false,
        status: 'PUBLISHED',
        metaTitle: 'UK Immigration DNA Testing Guide for Nigerians | Afrigenomix',
        metaDescription: 'Need DNA testing for UK visa application? Complete guide covering requirements, approved laboratories, process, costs and timeline.',
        metaKeywords: 'UK immigration DNA test Nigeria, UK visa DNA test Lagos, immigration DNA testing, UK Home Office DNA test',
        viewCount: 890,
        publishedAt: new Date('2026-03-10'),
      },
      {
        title: 'Legal DNA Testing vs Peace-of-Mind Testing: What\'s the Difference?',
        slug: 'legal-vs-peace-of-mind-dna-testing',
        category: 'LEGAL_DNA',
        authorId: author1.id,
        content: `
# Legal DNA Testing vs Peace-of-Mind Testing

Understanding the difference between legal and personal DNA testing is crucial when deciding which test you need.

## Peace-of-Mind DNA Testing

### Purpose
- Personal knowledge only
- Private family decisions
- Not for court or official use

### Process
- Simpler collection procedures
- Can be done at home with kit
- Identity verification may not be required
- Results for personal use only

### Cost
Typically ₦50,000 - ₦65,000

### Turnaround
3-5 business days

## Legal DNA Testing

### Purpose
- Court proceedings
- Legal custody disputes
- Child support cases
- Estate matters
- Immigration applications

### Process
- Strict identity verification
- Controlled sample collection by authorized personnel
- Chain of custody documentation
- Witnessed collection process
- All participants photographed

### Cost
Typically ₦85,000 - ₦120,000

### Turnaround
5-7 business days

## Chain of Custody Explained

Chain of custody is the documented paper trail ensuring:
1. Samples came from the correct individuals
2. Samples weren't tampered with or switched
3. Proper handling occurred throughout testing
4. Results can be trusted in legal proceedings

## Which Test Do You Need?

### Choose Peace-of-Mind If:
- You want personal knowledge only
- Results won't be used in court
- You need quick private results
- Budget is a consideration

### Choose Legal Testing If:
- Results may be used in court
- Required for immigration
- Needed for custody or support cases
- Official documentation required

## Can Peace-of-Mind Tests Be Upgraded?

No. If you think you might need results for legal purposes, do a legal test from the start. Peace-of-mind results cannot be converted to legal results.

## Get Expert Advice

Not sure which test you need? Contact Afrigenomix for a free consultation. We'll help you choose the right test for your situation.
        `,
        excerpt: 'Understand the critical differences between legal and peace-of-mind DNA testing to choose the right test for your needs.',
        isFeatured: false,
        status: 'PUBLISHED',
        metaTitle: 'Legal DNA Testing vs Peace-of-Mind Testing Nigeria',
        metaDescription: 'What\'s the difference between legal and personal DNA testing? Compare costs, requirements, and which test you need.',
        metaKeywords: 'legal DNA test Nigeria, court DNA test, paternity test for court Nigeria, legal vs personal DNA test',
        viewCount: 560,
        publishedAt: new Date('2026-03-25'),
      },
    ],
  });

  // Create Advocacy Campaign
  console.log('📢 Creating advocacy campaigns...');
  
  const campaign1 = await prisma.advocacyCampaign.create({
    data: {
      title: 'Criminalize Paternity Fraud in Nigeria',
      slug: 'criminalize-paternity-fraud-nigeria',
      description: 'Campaign to make paternity fraud a criminal offense under Nigerian law',
      longDescription: `
# Why This Matters

Paternity fraud destroys families, traumatizes men, and denies children their right to know their biological identity. It's time for Nigeria to join progressive nations in criminalizing this harmful deception.

## What We're Demanding

1. **Criminal Penalties**
   Women who deliberately deceive men about paternity should face criminal prosecution

2. **Financial Restitution**
   Men who have been defrauded should be able to recover child support payments made under false pretenses

3. **Mandatory DNA Testing**
   Courts should have the power to order DNA testing in disputed paternity cases

4. **Child Protection**
   Children's right to know their biological identity must be protected

5. **Awareness and Education**
   Public education campaigns about the harm of paternity fraud

## Our Progress

We've gathered thousands of signatures and engaged with lawmakers. But we need your voice to make this a reality.

## How You Can Help

1. **Sign the Petition** - Add your voice to thousands of Nigerians demanding change
2. **Share on Social Media** - Use #EndPaternityFraudNG
3. **Contact Your Representatives** - Write to National Assembly members
4. **Donate** - Support advocacy efforts and public awareness campaigns
5. **Share Your Story** - Help others understand the impact (anonymity protected)

## Join Us

Together, we can create a Nigeria where truth, scientific evidence, and children's rights are protected by law.
      `,
      goal: 'Pass legislation criminalizing paternity fraud in Nigeria by 2027',
      targetCountries: JSON.stringify(['Nigeria']),
      signatureGoal: 100000,
      currentSignatures: 12847,
      status: 'ACTIVE',
      priority: 1,
      launchDate: new Date('2026-01-01'),
      targetDate: new Date('2027-12-31'),
      milestones: {
        create: [
          {
            title: 'Campaign Launch',
            description: 'Public launch of the campaign with press conference',
            isCompleted: true,
            completedAt: new Date('2026-01-15'),
            order: 1,
          },
          {
            title: '10,000 Signatures',
            description: 'Reach first milestone of 10,000 petition signatures',
            isCompleted: true,
            completedAt: new Date('2026-03-20'),
            order: 2,
          },
          {
            title: 'Meeting with National Assembly',
            description: 'Present petition to House Committee on Justice',
            isCompleted: false,
            order: 3,
          },
          {
            title: 'Draft Bill Submission',
            description: 'Submit draft legislation to National Assembly',
            isCompleted: false,
            order: 4,
          },
          {
            title: 'Public Hearing',
            description: 'National Assembly holds public hearing on the bill',
            isCompleted: false,
            order: 5,
          },
          {
            title: 'Bill Passes House',
            description: 'Bill passes House of Representatives',
            isCompleted: false,
            order: 6,
          },
          {
            title: 'Bill Passes Senate',
            description: 'Bill passes Senate',
            isCompleted: false,
            order: 7,
          },
          {
            title: 'Presidential Assent',
            description: 'President signs bill into law',
            isCompleted: false,
            order: 8,
          },
        ],
      },
      updates: {
        create: [
          {
            title: 'Campaign Surpasses 12,000 Signatures!',
            content: 'We\'ve reached another milestone in our fight to criminalize paternity fraud. Over 12,000 Nigerians have signed our petition demanding legislative action. Thank you to everyone who has shared their voice and their stories.',
            publishedAt: new Date('2026-08-15'),
          },
          {
            title: 'Media Coverage: ThisDay Newspaper Features Our Campaign',
            content: 'Major media coverage as ThisDay newspaper publishes feature article on paternity fraud and our legislative advocacy. The conversation is growing!',
            publishedAt: new Date('2026-07-28'),
          },
        ],
      },
    },
  });

  // Create FAQs
  console.log('❓ Creating FAQs...');
  
  await prisma.fAQ.createMany({
    data: [
      {
        category: 'General',
        question: 'How accurate are DNA tests?',
        answer: 'DNA paternity tests are extremely accurate, with probability of paternity exceeding 99.99% when the tested man is the biological father. When he is excluded, the probability is 0%.',
        order: 1,
        isActive: true,
      },
      {
        category: 'General',
        question: 'How long does testing take?',
        answer: 'Testing times vary by test type. Standard paternity tests take 3-5 business days, legal tests take 5-7 business days, and immigration tests may take 7-10 business days.',
        order: 2,
        isActive: true,
      },
      {
        category: 'General',
        question: 'Are your laboratories accredited?',
        answer: 'Yes, we work exclusively with ISO 17025 and AABB accredited laboratories that meet international standards for DNA testing.',
        order: 3,
        isActive: true,
      },
      {
        category: 'Paternity',
        question: 'Can I do a paternity test while pregnant?',
        answer: 'Yes, non-invasive prenatal paternity testing is available from 7 weeks of pregnancy using a simple blood sample from the mother.',
        order: 1,
        isActive: true,
      },
      {
        category: 'Paternity',
        question: 'Do I need the mother\'s sample?',
        answer: 'While not always required, including the mother\'s sample can increase accuracy and is recommended when possible.',
        order: 2,
        isActive: true,
      },
      {
        category: 'Immigration',
        question: 'Is your immigration DNA testing accepted by Home Office?',
        answer: 'Yes, we coordinate testing with UK Home Office approved laboratories that meet all UKVI requirements for immigration applications.',
        order: 1,
        isActive: true,
      },
      {
        category: 'Immigration',
        question: 'Can testing be done if participants are in different countries?',
        answer: 'Yes, we can coordinate international testing through our laboratory network. Samples can be collected in different countries and sent to the same laboratory.',
        order: 2,
        isActive: true,
      },
      {
        category: 'Legal',
        question: 'What is chain of custody?',
        answer: 'Chain of custody is the documented process ensuring sample integrity from collection through testing. It includes identity verification, witnessed collection, and secure handling throughout the testing process.',
        order: 1,
        isActive: true,
      },
      {
        category: 'Legal',
        question: 'Will my peace-of-mind test results be accepted in court?',
        answer: 'No. Only legal DNA tests with proper chain of custody are admissible in court. If you think you might need results for legal purposes, order a legal test from the start.',
        order: 2,
        isActive: true,
      },
      {
        category: 'Advocacy',
        question: 'What is paternity fraud?',
        answer: 'Paternity fraud occurs when a woman deliberately misrepresents or conceals the biological father of her child, leading a man to believe he is the biological father when he is not.',
        order: 1,
        isActive: true,
      },
      {
        category: 'Advocacy',
        question: 'Is paternity fraud illegal in Nigeria?',
        answer: 'Not currently. That\'s why we\'re advocating for legislation to criminalize this harmful deception. Join our campaign to demand change.',
        order: 2,
        isActive: true,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('📧 Test accounts:');
  console.log('  Super Admin: admin@afrigenomix.com');
  console.log('  Customer 1: john.doe@example.com');
  console.log('  Customer 2: sarah.johnson@example.com');
  console.log('  Lab Partner: lab@genetech.ng');
  console.log('  Collection Partner: collection@medcenter.ng');
  console.log('  Password for all: Password123!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
