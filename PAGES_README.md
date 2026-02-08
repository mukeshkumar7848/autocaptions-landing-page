# Auto Captions Pro - Website Pages

This directory contains all the landing pages for Auto Captions Pro.

## 📄 Pages Overview

### Main Pages

1. **index.html** - Homepage
   - Hero section with main CTA
   - Feature highlights
   - Free vs Pro comparison
   - How it works section
   - Pricing information
   - FAQ section
   - Testimonials
   - Footer with links

2. **getpro.html** - Get Pro Page
   - **Purpose**: When users click "Get Pro" in the extension or on the website, they are directed here first
   - Detailed pricing information
   - Feature comparison table
   - Special offers and discounts
   - Money-back guarantee highlight
   - Testimonials
   - Purchase CTA buttons linking to Gumroad
   - **Why**: This page provides a sales-focused landing experience before redirecting to payment, increasing conversion rates

3. **404.html** - Error Page
   - Creative 404 design with animated background
   - Links back to homepage
   - Quick navigation to important sections
   - Maintains brand consistency

### Legal Pages

4. **privacy.html** - Privacy Policy
   - Data collection practices (emphasizes offline nature)
   - Third-party services (Gumroad, Adobe)
   - User rights (GDPR, CCPA compliant)
   - Contact information
   - Last updated date

5. **terms.html** - Terms of Service
   - License agreement details
   - Free vs Pro usage terms
   - Refund policy (30-day money-back guarantee)
   - Permitted and prohibited uses
   - Intellectual property rights
   - Liability limitations
   - Commercial license information

## 🔗 Navigation Flow

### From Extension to Website
```
Extension "Get Pro" button → getpro.html → Gumroad checkout
```

### Main Website Navigation
```
index.html (Homepage)
├── Features
├── How It Works
├── Pricing
├── FAQ
├── Get Pro → getpro.html → Gumroad
├── Try Free → Gumroad free version
└── Footer Links
    ├── Privacy Policy → privacy.html
    ├── Terms of Service → terms.html
    └── Support
```

### Error Handling
```
Invalid URL → 404.html → Back to index.html
```

## 🎨 Design Consistency

All pages follow the same design system:

- **Colors**: Purple gradient primary (`#667eea` to `#764ba2`)
- **Typography**: Inter font family
- **Components**: Consistent navigation, buttons, and footer
- **Style**: Modern, clean, Apple-inspired design
- **Responsive**: Mobile-first approach

## 📱 Key Features

### Common Elements Across All Pages

1. **Navigation Bar**
   - Logo and brand name
   - Links to main sections
   - "Try Free" and "Get Pro" CTAs
   - Mobile hamburger menu

2. **Footer**
   - Product links
   - Support links
   - Legal links (Privacy, Terms)
   - Social media links
   - Copyright notice

### Page-Specific Features

#### getpro.html Highlights
- Countdown/urgency elements
- Trust badges (7,500+ downloads, ratings)
- Feature comparison grid
- Multiple CTAs throughout the page
- Money-back guarantee section
- FAQ specific to purchasing
- Final CTA section before footer

#### 404.html Highlights
- Animated particle effects
- Floating background elements
- Interactive mouse trail
- Direct navigation to key sections
- Playful yet professional tone

#### Legal Pages (privacy.html, terms.html)
- Structured content with clear headings
- Table of contents (implied through headings)
- Highlight boxes for key information
- Readable typography with proper spacing
- Contact information clearly visible

## 🚀 Setup Instructions

### Local Development

1. Open any HTML file directly in a browser
2. Or use a local server:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js (if you have http-server)
   npx http-server
   ```

3. Visit `http://localhost:8000` in your browser

### Deployment

All files are static HTML/CSS/JS, so they can be hosted on:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Current deployment: Uses CNAME file (check for custom domain configuration)

## 📝 Content Updates

### To Update Pricing
- Edit `getpro.html` - Update price displays
- Edit `index.html` - Update pricing section

### To Update Features
- Edit `index.html` - Features section
- Edit `getpro.html` - Comparison table

### To Update Legal Information
- Edit `privacy.html` - Privacy policy
- Edit `terms.html` - Terms of service
- **Important**: Update "Last Updated" date at the top

## 🔧 Technical Details

### File Structure
```
webpage/
├── index.html          # Homepage
├── getpro.html         # Get Pro landing page
├── 404.html            # Error page
├── privacy.html        # Privacy policy
├── terms.html          # Terms of service
├── style.css           # Main stylesheet (shared)
├── script.js           # Main JavaScript (shared)
└── CNAME              # Custom domain configuration
```

### Dependencies
- **Google Fonts**: Inter font family
- **AOS Library**: Scroll animations (only on index.html)
- **No framework**: Pure HTML/CSS/JS for performance

### Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Analytics Recommendations

Consider adding to track:
- Page views on each page
- Conversion rate from getpro.html to Gumroad
- 404 error sources
- Button clicks on CTAs
- Time spent on comparison sections

## ⚠️ Important Notes

1. **Extension Integration**: The `getpro.html` page is specifically designed to be linked from the extension's "Get Pro" button
2. **Gumroad Links**: Final purchase buttons link to Gumroad for payment processing
3. **Offline First**: Emphasize in all content that the tool works completely offline
4. **Legal Compliance**: Privacy and Terms pages are compliant with GDPR and CCPA

## 🔄 Update Checklist

When making changes:
- [ ] Test on desktop browsers
- [ ] Test on mobile devices
- [ ] Check all internal links work
- [ ] Verify external links (Gumroad, social media)
- [ ] Update "Last Updated" dates on legal pages
- [ ] Test 404 page navigation
- [ ] Ensure consistent branding across all pages

## 📧 Contact

For questions or issues:
- Email: support@autocaptionspro.com
- Website: [Auto Captions Pro](https://autocaptionspro.com)

---

Made with ❤️ by Mukeshfx
