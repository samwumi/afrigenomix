# 🚀 Afrigenomix - Quick Start Guide

## Start the Application

```bash
cd afrigenomix
npm run dev
```

Open: **http://localhost:3000**

---

## 🧪 Test Accounts

Password for all: **Password123!**

- **admin@afrigenomix.com** - Super Admin
- **john.doe@example.com** - Customer with test case
- **sarah.johnson@example.com** - New customer
- **lab@genetech.ng** - Lab partner
- **collection@medcenter.ng** - Collection partner

---

## 📍 Key Pages to Test

### Public Pages
- **/** - Premium homepage with animations
- **/test-finder** - Visual questionnaire (6 steps)
- **/tests** - Test catalogue with filters
- **/tests/paternity-dna-test** - Example test detail page

### Authentication
- **/login** - Sign in
- **/register** - Create account

### Dashboard (after login)
- **/dashboard** - Customer dashboard (coming soon)

---

## 🎨 What's New

### ✅ Premium Design Upgrades
1. **Enhanced hero sections** - Large typography, animations, DNA patterns
2. **Laboratory network showcase** - Verified partner cards, "How It Works"
3. **Premium test cards** - Gradient headers, icons, hover effects
4. **Visual Test Finder** - Large clickable cards, progress tracking
5. **Improved typography** - Consistent hierarchy, responsive scaling
6. **Smooth animations** - Hover effects, transitions, micro-interactions
7. **Mobile optimized** - Perfect responsiveness, touch-friendly
8. **Polished catalogue** - Enhanced filters, card designs, CTAs

### 🎯 Business Model
**Platform Positioning Maintained:**
- Afrigenomix **coordinates** DNA testing
- **Connects** customers to verified laboratories
- Testing **conducted by laboratory partners**
- Clear separation throughout the application

---

## 🛠️ Database Management

### View Database
```bash
cd afrigenomix
npx prisma studio
```
Opens at http://localhost:5555

### Reset Database
```bash
cd afrigenomix
npm run db:seed
```

---

## 📊 What to Check

### Homepage
- [ ] Animated trust badge (pulse effect)
- [ ] Wave separator between sections
- [ ] Laboratory partner cards with hover
- [ ] Test discovery cards with gradients
- [ ] Mobile: Hamburger menu works

### Test Finder
- [ ] Progress bar with step labels
- [ ] All 6 steps work with card selection
- [ ] Recommendation shows after completion
- [ ] "Start over" button with rotation
- [ ] Mobile: Cards stack properly

### Test Catalogue
- [ ] Sticky category filter
- [ ] Category selection animations
- [ ] Test cards hover effects
- [ ] Empty state displays correctly
- [ ] Mobile: Grid adapts to screen

---

## 🐛 Troubleshooting

### Dev Server Won't Start
```bash
cd afrigenomix
npm install
npx prisma generate
npm run dev
```

### Database Issues
```bash
cd afrigenomix
npx prisma db push
npm run db:seed
```

### Port Already in Use
Check terminal output - Next.js will use port 3001 or 3002 automatically

---

## 📚 Documentation

- **PREMIUM_DESIGN_SUMMARY.md** - Complete upgrade overview
- **DESIGN_UPGRADE_COMPLETE.md** - Detailed feature list
- **LOCAL_TEST_GUIDE.md** - Full testing checklist
- **DESIGN_EXCELLENCE_PLAN.md** - Design specifications

---

## ✨ Quick Design Reference

### Colors
- Navy: #102a43 to #334e68
- Teal: #0ea5e9 to #0284c7
- Gradients: navy-900 → teal-900

### Typography
- Display: text-5xl to text-7xl
- Body: text-lg to text-xl
- Font: Inter (system fallback)

### Spacing
- Sections: py-16, py-20, py-24
- Cards: p-6, p-8
- Gaps: gap-4, gap-6, gap-8

### Animations
- Duration: 300ms, 500ms
- Hover: scale-102, scale-105
- Shadows: shadow-md → shadow-2xl

---

## 🎯 Success Metrics

✅ Premium scientific aesthetic
✅ Trustworthy presentation
✅ International credibility
✅ Mobile-first responsive
✅ Smooth 60fps animations
✅ Clear platform positioning
✅ Verified laboratory partners
✅ Professional user experience

---

## 🚀 Ready to Test!

1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Test homepage → Test Finder → Test Catalogue
4. Try different screen sizes
5. Test authentication flows
6. Review design consistency

**Enjoy the premium Afrigenomix experience! 🧬**
