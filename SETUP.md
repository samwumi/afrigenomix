# Afrigenomix Setup Guide

This guide will help you set up the Afrigenomix platform for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20 or higher
- **npm** or **yarn**
- **PostgreSQL** 14 or higher
- **Git**

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Navigate to the project directory
cd afrigenomix

# Install dependencies
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and configure the following:

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/afrigenomix_dev"

# Authentication - Generate strong secrets for production
JWT_SECRET="your-strong-jwt-secret-here"
NEXTAUTH_SECRET="your-strong-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important:** For production, generate strong random secrets:
```bash
# Generate secrets (Linux/Mac)
openssl rand -base64 32
```

### 3. Set Up PostgreSQL Database

#### Option A: Using Docker (Recommended)

```bash
# Run PostgreSQL in Docker
docker run --name afrigenomix-postgres \
  -e POSTGRES_USER=afrigenomix \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=afrigenomix_dev \
  -p 5432:5432 \
  -d postgres:16

# Update your .env with:
# DATABASE_URL="postgresql://afrigenomix:yourpassword@localhost:5432/afrigenomix_dev"
```

#### Option B: Local PostgreSQL

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE afrigenomix_dev;

# Create user (optional)
CREATE USER afrigenomix WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE afrigenomix_dev TO afrigenomix;
```

### 4. Initialize Prisma and Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed database with demo data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Accounts

After seeding, you can log in with these accounts:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@afrigenomix.com | Password123! |
| Customer | john.doe@example.com | Password123! |
| Customer | sarah.johnson@example.com | Password123! |
| Lab Partner | lab@genetech.ng | Password123! |
| Collection Partner | collection@medcenter.ng | Password123! |

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to database
npm run prisma:migrate   # Create and run migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run db:seed          # Seed database with demo data
npm run db:reset         # Reset database (caution!)
```

## Database Management

### Prisma Studio

View and edit your database with Prisma's GUI:

```bash
npm run prisma:studio
```

Open [http://localhost:5555](http://localhost:5555)

### Migrations

When you modify the schema:

```bash
# Create a new migration
npm run prisma:migrate

# This will:
# 1. Create a migration file
# 2. Apply it to your database
# 3. Regenerate Prisma Client
```

### Reset Database

To completely reset and reseed:

```bash
npm run db:reset
npm run db:seed
```

## Project Structure

```
afrigenomix/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (customer)/          # Customer portal
│   ├── (public)/            # Public pages
│   ├── admin/               # Admin dashboard
│   ├── partner/             # Partner portals
│   ├── api/                 # API routes
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── layout/              # Layout components
│   └── forms/               # Form components
├── lib/                     # Utilities and helpers
│   ├── prisma.ts            # Prisma client
│   ├── auth.ts              # Auth utilities
│   ├── middleware.ts        # API middleware
│   ├── audit.ts             # Audit logging
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Helper functions
├── prisma/                  # Database
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script
├── public/                  # Static files
└── uploads/                 # Uploaded files (not in git)
```

## Troubleshooting

### Database Connection Issues

**Error:** "Can't reach database server"

```bash
# Check if PostgreSQL is running
# For Docker:
docker ps

# For local install:
# Mac
brew services list | grep postgres

# Linux
sudo systemctl status postgresql
```

**Error:** "Database does not exist"

```bash
# Create the database
createdb afrigenomix_dev

# Or through psql
psql -U postgres -c "CREATE DATABASE afrigenomix_dev;"
```

### Prisma Issues

**Error:** "Prisma Client did not initialize yet"

```bash
npm run prisma:generate
```

**Error:** Migration issues

```bash
# Reset and start fresh (development only!)
npm run db:reset
npm run prisma:push
npm run db:seed
```

### Port Already in Use

```bash
# If port 3000 is in use, specify a different port
PORT=3001 npm run dev
```

## Next Steps

After successful setup:

1. **Explore the application** - Navigate through the pages
2. **Check the database** - Open Prisma Studio and explore the data
3. **Review the code** - Start with `app/page.tsx` and components
4. **Read the documentation** - Check `README.md` for more details
5. **Test authentication** - Try logging in with test accounts
6. **Customize** - Modify colors, content, and features

## Production Deployment

Before deploying to production:

- [ ] Change all default passwords
- [ ] Generate strong JWT secrets
- [ ] Set up a production PostgreSQL database
- [ ] Configure environment variables
- [ ] Set up file storage (AWS S3, etc.)
- [ ] Configure email provider
- [ ] Set up payment provider
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Set up monitoring
- [ ] Review security settings

See `README.md` for the complete production checklist.

## Getting Help

- Check the `README.md` for project overview
- Review code comments for implementation details
- Check Prisma documentation: https://www.prisma.io/docs
- Check Next.js documentation: https://nextjs.org/docs

---

**Afrigenomix** - Connecting Africa to trusted DNA science.
