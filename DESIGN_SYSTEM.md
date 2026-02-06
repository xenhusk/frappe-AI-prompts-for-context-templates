# PCCR Design System
**Philippine College of Criminology - Official Design Guidelines**

> Use this document when creating new pages or components for PCCR to maintain consistency across the entire application.

---

## 📋 Table of Contents
1. [Brand Identity](#brand-identity)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Layout & Spacing](#layout--spacing)
5. [Components](#components)
6. [Animations](#animations)
7. [Background Patterns](#background-patterns)
8. [Forms](#forms)
9. [Buttons](#buttons)
10. [Code Conventions](#code-conventions)

---

## 🎨 Brand Identity

### Official Motto
**"Pro Bono Publico et Patria"**  
*For the Good of the Public and Country*

### Logo
```
URL: https://cutover.pccr.edu.ph/files/pccr-logo.png
Usage: Always include on headers, maintain white space around logo
```

### Brand Values
- Professional & Academic
- Trustworthy & Secure
- Modern & Innovative
- Traditional & Prestigious

---

## 🎨 Color Palette

### Primary Colors

#### PCCR Red (Primary)
```css
--pccr-red: #7b0200;
--pccr-red-dark: #5a0100;
```
**Usage:**
- Headers and hero sections
- Primary buttons
- Important highlights
- Navigation bars
- Brand elements

#### PCCR Gold (Accent)
```css
--pccr-gold: #fcb31c;
--pccr-gold-dark: #e09a00;
```
**Usage:**
- Progress indicators
- Active states
- Highlights and accents
- Icons and badges
- Call-to-action elements

### Neutral Colors

#### Backgrounds
```css
--bg-light: #f8f9fa;
--bg-mid: #e9ecef;
--bg-alt: #f1f3f5;
--bg-card: #ffffff;
```

#### Text Colors
```css
--text-primary: #1f2937;    /* Body text */
--text-secondary: #6b7280;  /* Secondary text */
--text-light: #9ca3af;      /* Placeholder text */
--text-white: #ffffff;      /* On dark backgrounds */
```

#### Borders & Dividers
```css
--border-light: #e5e7eb;
--border-mid: #d1d5db;
--border-dark: #9ca3af;
```

### Status Colors

```css
--success: #10b981;
--success-light: #d1fae5;
--error: #ef4444;
--error-light: #fee2e2;
--warning: #f59e0b;
--warning-light: #fef3c7;
--info: #3b82f6;
--info-light: #dbeafe;
```

### Gradients

#### Primary Gradient (Buttons & Headers)
```css
background: linear-gradient(135deg, #7b0200 0%, #5a0100 100%);
```

#### Gold Gradient (Progress bars)
```css
background: linear-gradient(90deg, #fcb31c 0%, #e09a00 100%);
```

#### Subtle Background Gradient
```css
background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f1f3f5 100%);
```

---

## 📝 Typography

### Font Families

```css
/* Primary Font - Body Text */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Display Font - Headings */
font-family: 'Poppins', 'Inter', sans-serif;
```

### Font Sizes

```css
/* Headings */
--text-4xl: 2.25rem;    /* 36px - Hero titles */
--text-3xl: 1.875rem;   /* 30px - Page titles */
--text-2xl: 1.5rem;     /* 24px - Section titles */
--text-xl: 1.25rem;     /* 20px - Card titles */
--text-lg: 1.125rem;    /* 18px - Subheadings */

/* Body Text */
--text-base: 1rem;      /* 16px - Body text */
--text-sm: 0.875rem;    /* 14px - Small text */
--text-xs: 0.75rem;     /* 12px - Captions */
```

### Font Weights

```css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Typography Examples

```html
<!-- Page Title -->
<h1 class="text-3xl md:text-4xl font-bold text-gray-800 font-['Poppins']">
    Student Admission Application
</h1>

<!-- Section Heading -->
<h2 class="text-2xl font-bold text-gray-800 mb-2">
    Personal Information
</h2>

<!-- Body Text -->
<p class="text-gray-600 text-base">
    Tell us about yourself so we can get to know you better.
</p>

<!-- Small Text -->
<small class="text-gray-500 text-xs">
    We'll send important updates to this email
</small>
```

---

## 📐 Layout & Spacing

### Container Widths

```css
--container-sm: 640px;   /* Small devices */
--container-md: 768px;   /* Tablets */
--container-lg: 1024px;  /* Laptops */
--container-xl: 1280px;  /* Desktops */
```

### Spacing Scale (Tailwind-based)

```css
0.25rem  /* 1  - 4px  */
0.5rem   /* 2  - 8px  */
0.75rem  /* 3  - 12px */
1rem     /* 4  - 16px */
1.25rem  /* 5  - 20px */
1.5rem   /* 6  - 24px */
2rem     /* 8  - 32px */
2.5rem   /* 10 - 40px */
3rem     /* 12 - 48px */
4rem     /* 16 - 64px */
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - Small elements */
--radius-md: 0.5rem;    /* 8px - Inputs, cards */
--radius-lg: 0.75rem;   /* 12px - Buttons */
--radius-xl: 1rem;      /* 16px - Large cards */
--radius-2xl: 1.5rem;   /* 24px - Hero sections */
--radius-full: 9999px;  /* Pills, avatars */
```

### Shadows

```css
/* Light Shadow - Hover states */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

/* Medium Shadow - Cards */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Large Shadow - Modals */
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);

/* XL Shadow - Hero cards */
box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Colored Shadow - Primary buttons */
box-shadow: 0 4px 6px rgba(123, 2, 0, 0.2);
```

---

## 🧩 Components

### Header Card Pattern

```html
<div class="bg-gradient-to-r from-pccr-red to-pccr-red-dark rounded-t-2xl shadow-2xl overflow-hidden">
    <div class="p-8 text-center relative">
        <!-- Decorative Elements -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-pccr-gold/10 rounded-full -mr-16 -mt-16"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-pccr-gold/10 rounded-full -ml-12 -mb-12"></div>
        
        <div class="relative z-10">
            <img src="[LOGO_URL]" alt="PCCR Logo" class="w-20 h-20 mx-auto mb-4 drop-shadow-2xl">
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-2 font-['Poppins']">
                [Page Title]
            </h1>
            <p class="text-white/90 text-lg mb-1">[Subtitle]</p>
            <p class="text-pccr-gold font-semibold text-sm tracking-wider">
                PRO BONO PUBLICO ET PATRIA
            </p>
        </div>
    </div>
</div>
```

### Card Pattern

```html
<div class="bg-white rounded-xl shadow-lg p-6">
    <!-- Card content -->
</div>
```

### Icon with Background Circle

```html
<span class="w-10 h-10 bg-gradient-to-br from-pccr-red to-pccr-red-dark text-white rounded-full flex items-center justify-center">
    <i class="fas fa-[icon-name] text-sm"></i>
</span>
```

### Info Alert Box

```html
<div class="bg-blue-50 border-l-4 border-pccr-gold p-4 rounded">
    <div class="flex items-start gap-3">
        <i class="fas fa-info-circle text-pccr-gold text-lg mt-0.5"></i>
        <div>
            <p class="text-gray-700 text-sm font-medium">[Title]</p>
            <p class="text-gray-600 text-sm mt-1">[Message]</p>
        </div>
    </div>
</div>
```

### Warning Alert Box

```html
<div class="bg-yellow-50 border-l-4 border-pccr-gold p-4 rounded">
    <div class="flex items-start gap-3">
        <i class="fas fa-exclamation-triangle text-pccr-gold text-lg mt-0.5"></i>
        <div>
            <p class="text-gray-700 text-sm font-medium">[Title]</p>
            <p class="text-gray-600 text-sm mt-1">[Message]</p>
        </div>
    </div>
</div>
```

---

## 🎬 Animations

### Animation Timing

```css
/* Duration */
--duration-fast: 0.15s;
--duration-normal: 0.3s;
--duration-slow: 0.5s;
--duration-slower: 1s;

/* Easing */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Common Animations

#### Fade In Up (Page transitions)
```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Usage */
animation: fadeInUp 0.5s ease-out forwards;
```

#### Fade In Scale (Modals, Success screens)
```css
@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Usage */
animation: fadeInScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
```

#### Shake (Validation errors)
```css
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

/* Usage */
animation: shake 0.5s;
```

#### Spin (Loading indicators)
```css
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Usage */
animation: spin 1s linear infinite;
```

### Hover Transitions

```css
/* Button hover */
transition: all 0.3s ease;
transform: translateY(-2px);

/* Scale hover */
transition: transform 0.3s ease;
transform: scale(1.05);

/* Glow hover */
transition: box-shadow 0.3s ease;
box-shadow: 0 8px 15px rgba(123, 2, 0, 0.3);
```

---

## 🌈 Background Patterns

### Standard Page Background

```css
body {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f1f3f5 100%);
    position: relative;
    overflow-x: hidden;
}
```

### Radial Gradients (Decorative)

```css
/* Red glow */
background: radial-gradient(circle, rgba(123, 2, 0, 0.05) 0%, transparent 50%);

/* Gold glow */
background: radial-gradient(circle, rgba(252, 179, 28, 0.06) 0%, transparent 50%);

/* Spotlight */
background: radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 50%);
```

### Dot Pattern

```css
background-image: radial-gradient(circle, rgba(123, 2, 0, 0.03) 1px, transparent 1px);
background-size: 30px 30px;
```

### Diagonal Lines

```css
background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 50px,
    rgba(123, 2, 0, 0.01) 50px,
    rgba(123, 2, 0, 0.01) 51px
);
```

### Floating Decorative Circle

```html
<div class="absolute top-0 right-0 w-32 h-32 bg-pccr-gold/10 rounded-full -mr-16 -mt-16"></div>
```

---

## 📝 Forms

### Input Field Pattern

```html
<div class="form-group">
    <label class="form-label">[Field Label]</label>
    <input type="text" name="field_name" required class="form-input" placeholder="[Placeholder]">
    <small class="text-gray-500 text-xs mt-1 flex items-center gap-1">
        <i class="fas fa-info-circle text-pccr-gold"></i> [Helper text]
    </small>
    <div class="error-message"></div>
</div>
```

### Input Styles

```css
.form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    transition: all 0.3s ease;
    background-color: #ffffff;
}

.form-input:focus {
    outline: none;
    border-color: #7b0200;
    box-shadow: 0 0 0 3px rgba(123, 2, 0, 0.1);
}

.form-input.valid {
    border-color: #10b981;
    background-color: #f0fdf4;
}

.form-input.invalid {
    border-color: #ef4444;
}
```

### Select Dropdown

```html
<select name="field_name" required class="form-input">
    <option value="">Select option</option>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
</select>
```

### Checkbox Pattern

```html
<label class="custom-checkbox">
    <input type="checkbox" name="field_name" class="checkbox-input">
    <span class="checkbox-label">
        <i class="fas fa-[icon] text-pccr-red mr-2"></i>
        [Checkbox Label]
    </span>
</label>
```

```css
.custom-checkbox {
    display: flex;
    align-items: center;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #ffffff;
}

.custom-checkbox:hover {
    border-color: #7b0200;
    background-color: #fef2f2;
}

.checkbox-input {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.75rem;
    cursor: pointer;
    accent-color: #7b0200;
}
```

---

## 🔘 Buttons

### Primary Button (PCCR Red)

```html
<button class="btn-primary">
    [Button Text] <i class="fas fa-arrow-right ml-2"></i>
</button>
```

```css
.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 2rem;
    background: linear-gradient(135deg, #7b0200 0%, #5a0100 100%);
    color: white;
    font-weight: 600;
    font-size: 0.9375rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(123, 2, 0, 0.2);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(123, 2, 0, 0.3);
}
```

### Secondary Button (Gray)

```html
<button class="btn-secondary">
    <i class="fas fa-arrow-left mr-2"></i> [Button Text]
</button>
```

```css
.btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 2rem;
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    color: #374151;
    font-weight: 600;
    font-size: 0.9375rem;
    border: 2px solid #d1d5db;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
    transform: translateY(-2px);
}
```

### Success Button (Green)

```html
<button class="btn-success">
    <i class="fas fa-check mr-2"></i> [Button Text]
</button>
```

```css
.btn-success {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 2rem;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    font-weight: 600;
    font-size: 0.9375rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
}

.btn-success:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(16, 185, 129, 0.3);
}
```

### Icon Button

```html
<button class="w-12 h-12 bg-gradient-to-br from-pccr-red to-pccr-red-dark text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300">
    <i class="fas fa-[icon]"></i>
</button>
```

---

## 💻 Code Conventions

### File Structure

```
project/
├── index.html          # HTML structure only
├── style.css           # All custom styles
├── script.js           # All JavaScript logic
└── assets/
    ├── images/
    └── fonts/
```

### HTML Best Practices

```html
<!-- Use semantic HTML -->
<header>, <main>, <section>, <article>, <footer>, <nav>

<!-- Use Tailwind classes for layout -->
<div class="max-w-4xl mx-auto px-4 py-8">

<!-- Add meaningful IDs for JavaScript -->
<button id="submitBtn" onclick="submitForm()">

<!-- Always include alt text -->
<img src="logo.png" alt="PCCR Logo">

<!-- Use Font Awesome for icons -->
<i class="fas fa-user text-pccr-gold"></i>
```

### CSS Best Practices

```css
/* Use CSS custom properties */
:root {
    --pccr-red: #7b0200;
    --pccr-gold: #fcb31c;
}

/* BEM-like naming for custom classes */
.form-group { }
.form-group__label { }
.form-group__input { }
.form-group--error { }

/* Mobile-first responsive design */
.element {
    font-size: 14px;
}

@media (min-width: 768px) {
    .element {
        font-size: 16px;
    }
}

/* Group related styles */
/* === BUTTONS === */
/* === FORMS === */
/* === ANIMATIONS === */
```

### JavaScript Best Practices

```javascript
// Use modern ES6+ syntax
const config = {
    apiUrl: '/api',
    timeout: 5000
};

// Use meaningful variable names
const formData = collectFormData();
const isValid = validateForm();

// Comment complex logic
// Validate email format using regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Use GSAP for animations
gsap.to(element, {
    opacity: 1,
    duration: 0.5,
    ease: 'power3.out'
});

// Handle errors gracefully
try {
    await submitForm();
} catch (error) {
    showToast('Submission failed', 'error');
}
```

### Tailwind Class Order

```html
<!-- Layout → Spacing → Sizing → Typography → Visual → Effects -->
<div class="
    flex items-center justify-center
    p-4 gap-2
    w-full max-w-md
    text-lg font-semibold
    bg-white text-gray-800
    rounded-lg shadow-lg
    hover:shadow-xl transition-all
">
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First */
/* xs: 0px - default */
/* sm: 640px */
@media (min-width: 640px) { }

/* md: 768px */
@media (min-width: 768px) { }

/* lg: 1024px */
@media (min-width: 1024px) { }

/* xl: 1280px */
@media (min-width: 1280px) { }
```

### Mobile Optimizations

```css
/* Prevent zoom on input focus (iOS) */
input, select, textarea {
    font-size: 16px;
}

/* Touch-friendly tap targets */
button, a {
    min-height: 44px;
    min-width: 44px;
}

/* Reduce animations on mobile */
@media (max-width: 768px) {
    * {
        animation-duration: 0.3s !important;
    }
}
```

---

## 🎯 Usage Examples

### Creating a New Page Header

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PCCR - [Page Name]</title>
    <link rel="icon" href="https://cutover.pccr.edu.ph/files/pccr-logo.png">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'pccr-red': '#7b0200',
                        'pccr-red-dark': '#5a0100',
                        'pccr-gold': '#fcb31c',
                        'pccr-gold-dark': '#e09a00',
                    }
                }
            }
        }
    </script>
    
    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Custom Styles -->
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-gray-50 font-['Inter']">
    <!-- Content here -->
</body>
</html>
```

### Creating a Form Section

```html
<div class="bg-white rounded-xl shadow-lg p-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
        <span class="w-10 h-10 bg-gradient-to-br from-pccr-red to-pccr-red-dark text-white rounded-full flex items-center justify-center">
            <i class="fas fa-user text-sm"></i>
        </span>
        Section Title
    </h2>
    <p class="text-gray-600 ml-13 mb-6">Section description text.</p>

    <div class="space-y-6">
        <!-- Form fields here -->
    </div>
</div>
```

---

## ✅ Checklist for New Pages

When creating a new page, ensure:

- [ ] Uses PCCR brand colors (#7b0200, #fcb31c)
- [ ] Includes PCCR logo and motto
- [ ] Uses Inter font for body, Poppins for headings
- [ ] Follows spacing scale (multiples of 4px)
- [ ] Has decorative background elements
- [ ] Buttons use gradient backgrounds
- [ ] Forms have proper validation states
- [ ] Includes hover states and transitions
- [ ] Responsive on mobile (test at 375px, 768px, 1024px)
- [ ] Uses GSAP for complex animations
- [ ] Has proper loading states
- [ ] Includes success/error feedback
- [ ] Accessible (keyboard navigation, focus states)
- [ ] SEO optimized (meta tags, semantic HTML)
- [ ] Performance optimized (lazy loading, optimized images)

---

## 📞 Questions?

When prompting an AI agent about PCCR design:

**✅ Good Prompt:**
> "Create a new enrollment status page for PCCR following the design system. Use PCCR red (#7b0200) for the header with the gradient pattern, include the logo and motto, add a progress indicator with gold color, and use the standard form input styling from the design system."

**❌ Bad Prompt:**
> "Make a page for PCCR with some colors and forms."

**Key Information to Include:**
1. Reference this design system document
2. Specify the PCCR colors
3. Mention specific components to use
4. Indicate if it should match the admission form style
5. Specify any unique requirements

---

## 🎨 Design Principles Summary

1. **Consistency** - Use the same colors, fonts, spacing everywhere
2. **Hierarchy** - Clear visual hierarchy with typography and color
3. **Whitespace** - Generous spacing for readability
4. **Accessibility** - High contrast, keyboard navigation, focus states
5. **Performance** - Optimize animations, use GPU acceleration
6. **Brand** - Always include PCCR branding elements
7. **Feedback** - Visual feedback for all interactions
8. **Simplicity** - Clean, uncluttered designs

---

## 📚 Resources

### External Libraries
- **Tailwind CSS**: https://cdn.tailwindcss.com
- **GSAP**: https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js
- **jQuery**: https://code.jquery.com/jquery-3.6.0.min.js
- **Font Awesome**: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css

### Fonts
- **Inter**: https://fonts.google.com/specimen/Inter
- **Poppins**: https://fonts.google.com/specimen/Poppins

### Tools
- **Color Palette**: https://coolors.co/
- **Gradient Generator**: https://cssgradient.io/
- **Shadow Generator**: https://shadows.brumm.af/

---

**Version:** 1.0.0  
**Last Updated:** 2025  
**Maintained By:** PCCR Development Team

---

*Pro Bono Publico et Patria* 🎓

