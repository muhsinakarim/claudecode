# Screenshot Capture Guide

## Quick Screenshot Checklist

### 🎯 Priority Screenshots (Take These First!)

#### Main User Flow:
1. **Homepage** - `http://localhost:3000`
   - Full page view showing dark theme with Alamy green buttons
   - Hero section with "Turn Your Photos Into Passive Income"
   - Feature cards section

2. **Dashboard Main** - `http://localhost:3000/dashboard`
   - Stats cards with analytics
   - Recent images section
   - Dark theme navigation sidebar

3. **Key Dashboard Pages:**
   - **Upload Images** - `http://localhost:3000/dashboard/upload`
   - **My Images Table** - `http://localhost:3000/dashboard/images`
   - **Sales & Revenue** - `http://localhost:3000/dashboard/sales`
   - **Account Settings** - `http://localhost:3000/dashboard/settings`

### 📱 Mobile Responsive Views
- Use Chrome DevTools (F12) → Toggle Device Toolbar
- Test iPhone 14 Pro and iPad views
- Capture navigation and mobile layouts

### 🎨 Design System Showcase
1. **Color Palette Examples:**
   - Alamy green buttons in action
   - Dark mode cards and forms
   - Text contrast examples

2. **Typography:**
   - Noto Sans font in headings
   - Text hierarchy examples

### 🔧 Browser Tools for Screenshots

#### Chrome Extensions (Recommended):
- **"Full Page Screen Capture"** - Captures entire page
- **"GoFullPage"** - Another full page option
- **"Awesome Screenshot"** - Editing capabilities

#### Built-in Browser Tools:
1. **Chrome:** F12 → Device Toolbar → Screenshot icon
2. **Firefox:** F12 → Take Screenshot (3 dots menu)
3. **Safari:** Develop menu → Take Screenshots

### 📋 Screenshot Naming Convention
```
alamy-platform-[page]-[date].png

Examples:
- alamy-platform-homepage-2024-08-14.png
- alamy-platform-dashboard-2024-08-14.png
- alamy-platform-upload-mobile-2024-08-14.png
```

### 📁 Suggested Folder Structure
```
screenshots/
├── 01-homepage/
├── 02-authentication/
├── 03-dashboard/
├── 04-features/
├── 05-mobile/
└── 06-design-system/
```

### ⚡ Quick Capture Script
1. Open each URL in a new tab
2. Use full-page screenshot extension
3. Save with descriptive names
4. Capture both desktop and mobile views

### 🎬 Optional: Screen Recordings
For animations and interactions:
- **Mac:** QuickTime Player → New Screen Recording
- **Windows:** Xbox Game Bar (Win + G)
- **Cross-platform:** OBS Studio

### 📊 Before/After Comparison
If you want to show the evolution, you could:
1. Check git history for earlier commits
2. Temporarily change CSS variables to light theme
3. Take "before" screenshots, then revert

Would you like me to create any additional documentation or help you set up a specific documentation platform for this?