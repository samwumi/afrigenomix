# Afrigenomix - Local Testing Guide

## 🎉 Application is Running!

Your Afrigenomix application is now running locally at:
**http://localhost:3000**

---

## 📋 Test Accounts

All test accounts use the password: **Password123!**

### Super Admin
- **Email**: admin@afrigenomix.com
- **Role**: Full system access

### Customers
- **Email**: john.doe@example.com
- **Role**: Customer with active test case
- **Email**: sarah.johnson@example.com
- **Role**: Customer (new account)

### Lab Partner
- **Email**: lab@genetech.ng
- **Role**: Laboratory partner at GeneTech Nigeria

### Collection Partner
- **Email**: collection@medcenter.ng
- **Role**: Collection partner at MedCenter

---

## 🧪 What to Test

### 1. Homepage (`/`)
- **Hero section** with main value proposition
- **Trust indicators** showing laboratory partners and security features
- **Test discovery section** with 6 category cards
- **Call-to-action** sections

### 2. Test Finder (`/test-finder`)
- **6-step intelligent questionnaire**:
  1. Purpose selection
  2. Relationship type
  3. Legal requirements
  4. Country selection
  5. Participant locations
  6. Pregnancy status (if applicable)
- **Smart recommendations** based on answers
- **Detailed recommendation cards** with test info

### 3. Test Catalogue (`/tests`)
- **All available tests** displayed
- **Filter by category**: Paternity, Immigration, Legal, etc.
- **Test cards** with key information

### 4. Individual Test Pages (`/tests/[slug]`)
Example URLs:
- http://localhost:3000/tests/paternity-dna-test
- http://localhost:3000/tests/uk-immigration-dna-test
- http://localhost:3000/tests/legal-paternity-dna-test

Features:
- Detailed test information
- "How It Works" process flow
- Requirements and sample types
- Pricing and features
- Related tests

### 5. Authentication
- **Register**: `/register` - Create new account
- **Login**: `/login` - Sign in with test accounts
- **Protected routes**: Try accessing customer dashboard before login

### 6. Customer Dashboard (requires login)
- **Dashboard**: `/dashboard` - Overview of cases
- Will show "Coming soon" for now (Task #8 not yet implemented)

---

## 🔍 Database Management

### View Database in Prisma Studio
```bash
cd afrigenomix
npx prisma studio
```
This opens a web interface at http://localhost:5555 to browse and edit database records.

### Reset Database
```bash
cd afrigenomix
npm run db:reset
```
This will clear all data and re-run the seed script.

### View Database File
The SQLite database is located at:
```
afrigenomix/prisma/dev.db
```

---

## ✅ Testing Checklist

### Responsiveness
- [ ] Test on different screen sizes (desktop, tablet, mobile)
- [ ] Check mobile menu navigation
- [ ] Verify cards stack properly on mobile

### Homepage
- [ ] Hero section displays correctly
- [ ] Trust indicators are visible
- [ ] Test discovery cards are clickable
- [ ] CTAs work ("Find a DNA Test", "Speak to a Specialist")

### Test Finder
- [ ] All 6 steps display correctly
- [ ] Progress bar updates
- [ ] Form validation works
- [ ] Recommendations match selections
- [ ] "Start Over" resets the form

### Test Catalogue
- [ ] All tests display
- [ ] Category filters work
- [ ] Test cards show correct information
- [ ] Links to detail pages work

### Test Detail Pages
- [ ] Breadcrumb navigation works
- [ ] All sections display (Overview, Details, Requirements)
- [ ] "How It Works" timeline is clear
- [ ] Pricing sidebar shows features
- [ ] Related tests are linked

### Authentication
- [ ] Registration creates new account
- [ ] Email validation works
- [ ] Login with correct credentials succeeds
- [ ] Login with wrong credentials fails
- [ ] Protected routes redirect to login
- [ ] JWT token is stored

### Design & UX
- [ ] Premium scientific aesthetic maintained
- [ ] Colors match design system (navy, teal)
- [ ] Typography is clear and professional
- [ ] Spacing is consistent
- [ ] Animations are smooth
- [ ] Loading states display

---

## 🚀 Next Steps After Testing

Once you've tested the current features, we'll continue with:

**Task #8**: Customer Dashboard and Case Management
- Case overview
- Case timeline
- Participant management
- Document tracking

**Task #9**: Document Management
- Secure document upload
- Document verification
- Identity verification

**Task #10**: Appointment & Sample Collection
- Appointment booking
- Collection location selection
- Sample tracking

---

## 🐛 Common Issues

### Server Won't Start
```bash
# Make sure dependencies are installed
cd afrigenomix
npm install

# Regenerate Prisma client
npx prisma generate
```

### Database Errors
```bash
# Push schema again
cd afrigenomix
npx prisma db push

# Re-seed database
npm run db:seed
```

### Port Already in Use
If port 3000 is busy, Next.js will automatically use port 3001 or 3002.
Check the terminal output for the actual URL.

---

## 📝 Current Progress

✅ **Completed (7/23 tasks - 30%)**:
1. Next.js project setup
2. Design system with UI components
3. Database schema with Prisma
4. Authentication with RBAC
5. Professional homepage
6. Intelligent Test Finder
7. Test catalogue with detail pages

🔄 **Ready for Implementation**:
8. Customer dashboard
9. Document management
10. Appointment scheduling
11. Laboratory network pages
... (16 more tasks)

---

## 💡 Tips

- Use **Prisma Studio** to inspect database records and verify data
- Check browser console for any JavaScript errors
- Use browser DevTools to test responsive design
- Try different user roles to see different permissions
- Test the entire flow: Homepage → Test Finder → Registration → Login

---

**Enjoy testing Afrigenomix! 🧬**
