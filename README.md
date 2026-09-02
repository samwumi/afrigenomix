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
- Content management (articles, FAQs)

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
git clone https://github.com/your-org/afrigenomix.git
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
- **Content:** Articles, FAQs, knowledge base
- **Audit Logs:** Complete activity tracking

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

### Production Checklist

- [ ] Set strong JWT_SECRET and NEXTAUTH_SECRET
- [ ] Configure production database
- [ ] Set up email provider
- [ ] Configure payment provider
- [ ] Enable HTTPS
- [ ] Set up file storage (S3, etc.)
- [ ] Configure CORS properly
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Review security settings

### Environment Variables

See `.env.example` for required variables.

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
