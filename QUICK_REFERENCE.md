# PCCR Design Quick Reference
**Ultra-Fast Lookup Guide**

---

## 🎨 Colors (Copy-Paste Ready)

```css
/* Primary Colors */
#7b0200  /* PCCR Red */
#5a0100  /* Red Dark */
#fcb31c  /* PCCR Gold */
#e09a00  /* Gold Dark */

/* Tailwind Config */
'pccr-red': '#7b0200'
'pccr-red-dark': '#5a0100'
'pccr-gold': '#fcb31c'
'pccr-gold-dark': '#e09a00'
```

---

## 📝 Typography

```css
/* Fonts */
font-family: 'Inter'    /* Body */
font-family: 'Poppins'  /* Headings */

/* Sizes */
3xl-4xl  /* Page titles */
2xl      /* Section titles */
base     /* Body text */
sm       /* Small text */
xs       /* Helper text */
```

---

## 🔗 CDN Links

```html
<!-- Tailwind -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">

<!-- Logo -->
<img src="https://cutover.pccr.edu.ph/files/pccr-logo.png" alt="PCCR Logo">
```

---

## 🔘 Button Classes

```html
<!-- Primary Button -->
<button class="btn-primary">Text</button>

<!-- Secondary Button -->
<button class="btn-secondary">Text</button>

<!-- Success Button -->
<button class="btn-success">Text</button>
```

---

## 📝 Form Input

```html
<div class="form-group">
    <label class="block text-sm font-semibold text-gray-700 mb-2">Label</label>
    <input type="text" name="field" required class="form-input" placeholder="Placeholder">
</div>
```

---

## 🎨 Header Pattern

```html
<div class="bg-gradient-to-r from-pccr-red to-pccr-red-dark rounded-t-2xl shadow-2xl overflow-hidden">
    <div class="p-8 text-center relative">
        <div class="absolute top-0 right-0 w-32 h-32 bg-pccr-gold/10 rounded-full -mr-16 -mt-16"></div>
        <div class="relative z-10">
            <img src="https://cutover.pccr.edu.ph/files/pccr-logo.png" class="w-20 h-20 mx-auto mb-4">
            <h1 class="text-4xl font-bold text-white font-['Poppins']">Title</h1>
            <p class="text-pccr-gold text-sm tracking-wider mt-2">PRO BONO PUBLICO ET PATRIA</p>
        </div>
    </div>
</div>
```

---

## 💡 Alert Box

```html
<div class="bg-blue-50 border-l-4 border-pccr-gold p-4 rounded">
    <div class="flex items-start gap-3">
        <i class="fas fa-info-circle text-pccr-gold text-lg"></i>
        <div>
            <p class="text-gray-700 text-sm font-medium">Title</p>
            <p class="text-gray-600 text-sm">Message</p>
        </div>
    </div>
</div>
```

---

## 🎬 GSAP Animation

```javascript
// Fade in
gsap.from(element, {
    opacity: 0,
    y: 30,
    duration: 0.6,
    ease: 'power3.out'
});

// Scale up
gsap.from(element, {
    scale: 0.8,
    duration: 0.5,
    ease: 'back.out(1.7)'
});

// Slide in
gsap.from(element, {
    x: -100,
    opacity: 0,
    duration: 0.5
});
```

---

## 🎨 Gradient Patterns

```css
/* Red gradient */
background: linear-gradient(135deg, #7b0200 0%, #5a0100 100%);

/* Gold gradient */
background: linear-gradient(90deg, #fcb31c 0%, #e09a00 100%);

/* Background gradient */
background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f1f3f5 100%);
```

---

## 📏 Spacing

```
p-4   /* padding: 1rem */
p-6   /* padding: 1.5rem */
p-8   /* padding: 2rem */
mb-4  /* margin-bottom: 1rem */
gap-3 /* gap: 0.75rem */
```

---

## 🎯 Responsive Breakpoints

```
sm:  /* 640px */
md:  /* 768px */
lg:  /* 1024px */
xl:  /* 1280px */
```

---

## 📱 Mobile Optimizations

```css
/* Prevent iOS zoom */
input { font-size: 16px; }

/* Touch targets */
button { min-height: 44px; min-width: 44px; }
```

---

## ✨ Must-Have Elements

```html
✓ PCCR Logo
✓ "Pro Bono Publico et Patria" motto
✓ Red gradient header (from-pccr-red to-pccr-red-dark)
✓ Gold accents for highlights
✓ Loading screen animation
✓ Scroll to top button
✓ Decorative background particles
✓ Responsive layout (max-w-4xl mx-auto)
```

---

## 🚀 Quick Start Template

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'pccr-red': '#7b0200',
                        'pccr-gold': '#fcb31c'
                    }
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-gray-50 font-['Inter']">
    <div class="min-h-screen py-8 px-4">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="bg-gradient-to-r from-pccr-red to-pccr-red-dark rounded-t-2xl p-8 text-center">
                <img src="https://cutover.pccr.edu.ph/files/pccr-logo.png" class="w-20 h-20 mx-auto mb-4">
                <h1 class="text-4xl font-bold text-white font-['Poppins']">Title</h1>
                <p class="text-pccr-gold text-sm mt-2">PRO BONO PUBLICO ET PATRIA</p>
            </div>
            
            <!-- Content -->
            <div class="bg-white rounded-b-2xl shadow-2xl p-8">
                <!-- Your content here -->
            </div>
        </div>
    </div>
    
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

---

**For Full Details:** See `DESIGN_SYSTEM.md`  
**For AI Prompts:** See `AI_PROMPT_TEMPLATE.md`

*Pro Bono Publico et Patria* 🎓
