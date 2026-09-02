# Afrigenomix

**Truth. Science. Identity.**

Afrigenomix is a technology platform that connects people in Nigeria and across Africa who need DNA and genetic testing with trusted local and international laboratories.

## Overview

Afrigenomix is a **testing access and coordination platform**, not a laboratory. It allows customers to:

- Discover the right DNA test
- Understand testing requirements
- Submit test requests
- Complete necessary documentation
- Arrange sample collection
- Track their case progress
- Receive laboratory results securely

## Core Features

### For Customers
- Intelligent Test Finder
- Paternity, Maternity, and Relationship Testing
- Immigration DNA Testing (UK, USA, Canada)
- Legal DNA Testing with Chain of Custody
- Prenatal DNA Testing
- Secure customer dashboard
- Real-time case tracking
- Document management
- Appointment scheduling
- Secure result delivery

### Content & Advocacy
- Blog platform with 7 categories (DNA Testing, Immigration, Paternity, Legal, Prenatal, Genetics, DNA Science)
- Featured articles and related content
- Social sharing (Facebook, Twitter, LinkedIn)
- View counter and engagement tracking
- Advocacy hub for campaigns (e.g., Criminalize Paternity Fraud)
- Campaign milestones and progress tracking
- Petition signatures and supporter engagement
- Campaign updates and timeline

### For Partners
- Collection Partner Portal
- Laboratory Partner Portal
- Case assignment and management
- Sample tracking
- Result upload and management

### For Administrators
- Comprehensive admin dashboard
- Customer management
- Case management
- Laboratory network management
- Quote and payment management
- Audit logging
- Content Management System (CMS)
  - Create, edit, and delete articles
  - Manage featured content
  - View analytics (views, engagement)
  - Category management
  - SEO optimization
- Advocacy campaign management

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with bcrypt
- **File Upload:** Secure document handling
- **Deployment:** Production-ready architecture

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL database
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/samwumi/afrigenomix.git
cd afrigenomix
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- Database connection string
- JWT secret keys
- Email provider settings
- Payment provider settings (when ready)

4. Set up the database:
```bash
npm run prisma:push
npm run prisma:generate
```

5. (Optional) Seed the database with demo data:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
afrigenomix/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (customer)/        # Customer portal
│   ├── (public)/          # Public pages
│   ├── admin/             # Admin dashboard
│   ├── partner/           # Partner portals
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                   # Core utilities
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Authentication utilities
│   ├── types.ts          # TypeScript types
│   ├── utils.ts          # Helper functions
│   └── design-system.ts  # Design tokens
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema
├── public/               # Static assets
└── uploads/              # Uploaded files (not in git)
```

## Database Schema

The application uses a comprehensive relational database schema including:

- **Users & Authentication:** User accounts, sessions, role-based access control
- **Customer Profiles:** Customer information and preferences
- **Laboratory Network:** Labs, accreditations, capabilities
- **Test Catalogue:** Test types, categories, requirements
- **Cases:** Test requests, participants, status tracking
- **Documents:** Secure document storage and verification
- **Appointments:** Collection scheduling and management
- **Samples:** Sample tracking and chain of custody
- **Quotes & Payments:** Financial management
- **Results:** Secure result delivery
- **Content Management:** Articles, authors, advocacy campaigns, newsletters
- **Audit Logs:** Complete activity tracking

## SEO & Discoverability

Afrigenomix is fully optimized for search engines:

- Dynamic meta tags (title, description, keywords)
- Open Graph tags for social sharing (Facebook, LinkedIn)
- Twitter Card support
- Structured data (JSON-LD Article schema)
- XML sitemap at `/sitemap.xml`
- Robots.txt configuration
- Canonical URLs on all pages
- Optimized for keywords: DNA testing Nigeria, paternity test Africa, immigration DNA, etc.

See [`SEO-IMPLEMENTATION.md`](./SEO-IMPLEMENTATION.md) for complete SEO documentation.

## Key Workflows

### Customer Journey
1. Browse tests or use Test Finder
2. Register and create account
3. Submit test request
4. Upload required documents
5. Schedule sample collection
6. Track case progress
7. Receive and download results

### Admin Workflow
1. Review new test requests
2. Verify submitted documents
3. Assign appropriate laboratory
4. Coordinate sample collection
5. Track laboratory testing
6. Review and release results
7. Manage payments and quotes

## Security

Afrigenomix implements security best practices:

- Secure password hashing with bcrypt
- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- File upload validation
- Secure session management
- Comprehensive audit logging
- Protection against common vulnerabilities (XSS, CSRF, SQL injection)

**Never expose sensitive information:**
- Passwords are never logged
- Genetic results require authentication
- Documents are stored securely
- API endpoints enforce authorization

## Testing

```bash
# Run linting
npm run lint

# Run type checking
npx tsc --noEmit
```

## Deployment

### Hostinger Cloud Startup Deployment

This project is configured for deployment on Hostinger Cloud Startup. See comprehensive deployment guides:

- **Quick Start:** [`QUICK_START_HOSTINGER.md`](./QUICK_START_HOSTINGER.md) - Get up and running in 15 minutes
- **Detailed Guide:** [`HOSTINGER_DEPLOYMENT.md`](./HOSTINGER_DEPLOYMENT.md) - Complete deployment documentation
- **Checklist:** [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) - Step-by-step verification

### Required Environment Variables

The application requires these environment variables for production:

```env
# Database (PostgreSQL on Hostinger)
DATABASE_URL="postgresql://user:password@localhost:5432/afrigenomix_prod"

# Authentication (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET="your-secure-32-char-jwt-secret"
NEXTAUTH_SECRET="your-secure-32-char-nextauth-secret"

# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://afrigenomix.com"

# File Uploads
UPLOAD_DIR="/home/username/uploads"
MAX_FILE_SIZE="10485760"

# Email (Hostinger SMTP)
EMAIL_FROM="noreply@afrigenomix.com"
EMAIL_HOST="smtp.hostinger.com"
EMAIL_PORT="465"
EMAIL_USER="noreply@afrigenomix.com"
EMAIL_PASSWORD="your-email-password"
EMAIL_SECURE="true"

# Payment (Paystack for Nigeria)
PAYSTACK_SECRET_KEY="sk_live_your_key_here"
PAYSTACK_PUBLIC_KEY="pk_live_your_key_here"
```

See [`.env.production.example`](./.env.production.example) for the complete template.

### Production Deployment Steps

1. **Set up PostgreSQL database** on Hostinger
2. **Generate secure secrets** for JWT_SECRET and NEXTAUTH_SECRET
3. **Clone repository** to your Hostinger server
4. **Install dependencies:** `npm install`
5. **Create `.env` file** with production values
6. **Run migrations:** `npx prisma migrate deploy`
7. **Seed database:** `npx prisma db seed`
8. **Build application:** `npm run build`
9. **Start with PM2:** `pm2 start npm --name "afrigenomix" -- start`
10. **Configure reverse proxy** in Hostinger panel (port 3000)
11. **Enable SSL certificate** (Let's Encrypt)

### Demo Accounts (Change passwords immediately in production!)

After seeding, these accounts are available:
- **Admin:** admin@afrigenomix.com / Password123!
- **Customer:** john.doe@example.com / Password123!
- **Lab Partner:** lab@genetech.ng / Password123!
- **Collection Partner:** collection@medcenter.ng / Password123!

### Post-Deployment

- ✅ Change all default passwords
- ✅ Configure email provider
- ✅ Set up Paystack for payments
- ✅ Test RBAC and security
- ✅ Submit sitemap to Google Search Console
- ✅ Set up monitoring and backups

## Contributing

This is a private project. Contact the development team for contribution guidelines.

## License

Proprietary - All rights reserved.

## Support

For technical support:
- Email: support@afrigenomix.com
- Phone: [To be configured]
- WhatsApp: [To be configured]

---

**Afrigenomix** - Connecting Africa to trusted DNA science.
