# AI Agent Prompt Template for PCCR Pages

> **Copy this entire document when prompting an AI agent to create new pages that match the PCCR admission form design.**

---

## 📋 Context for AI Agent

You are creating a web page for the **Philippine College of Criminology (PCCR)**. The design should match the existing admission form design system.

---

## 🎨 Required Design Specifications

### Brand Colors (MUST USE THESE EXACT COLORS)

```
Primary Red:   #7b0200 (headers, buttons, primary elements)
Red Dark:      #5a0100 (gradients, hover states)
Gold Accent:   #fcb31c (progress bars, highlights, active states)
Gold Dark:     #e09a00 (gradients, hover states)
```

### Official Branding
- **Logo URL**: `https://cutover.pccr.edu.ph/files/pccr-logo.png`
- **Motto**: "Pro Bono Publico et Patria" (display in gold text)
- **Full Name**: Philippine College of Criminology

---

## 🛠️ Technology Stack (REQUIRED)

### Must Use:
1. **Tailwind CSS** (via CDN) for styling
2. **GSAP** (GreenSock) for animations
3. **jQuery** for DOM manipulation (Frappe requirement)
4. **Font Awesome 6** for icons
5. **Google Fonts**: Inter (body text) + Poppins (headings)

### File Structure:
- `index.html` - Structure only (with Tailwind classes)
- `style.css` - Custom CSS separated from HTML
- `script.js` - All JavaScript logic separated

---

## 📐 Layout Pattern

### HTML Template Structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PCCR - [Page Title]</title>
    <link rel="icon" href="https://cutover.pccr.edu.ph/files/pccr-logo.png">
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Tailwind Custom Config with PCCR Colors -->
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
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Custom Styles -->
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-gray-50 font-['Inter']">
    
    <!-- Loading Screen -->
    <div id="loadingScreen" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pccr-red to-pccr-red-dark">
        <img src="https://cutover.pccr.edu.ph/files/pccr-logo.png" alt="PCCR Logo" class="w-24 h-24 mb-6 animate-bounce">
        <div class="text-white text-xl font-semibold mb-4">Philippine College of Criminology</div>
        <div class="loader"></div>
    </div>

    <!-- Decorative Background Elements -->
    <div class="bg-decoration">
        <div class="accent-line line-1"></div>
        <div class="accent-line line-2"></div>
        <div class="accent-line line-3"></div>
        <div class="particles">
            <!-- Add 12 particles with varied positions and delays -->
        </div>
    </div>

    <!-- Main Container -->
    <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
            
            <!-- Header Card -->
            <div class="bg-gradient-to-r from-pccr-red to-pccr-red-dark rounded-t-2xl shadow-2xl overflow-hidden">
                <div class="p-8 text-center relative">
                    <!-- Decorative circles -->
                    <div class="absolute top-0 right-0 w-32 h-32 bg-pccr-gold/10 rounded-full -mr-16 -mt-16"></div>
                    <div class="absolute bottom-0 left-0 w-24 h-24 bg-pccr-gold/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div class="relative z-10">
                        <img src="https://cutover.pccr.edu.ph/files/pccr-logo.png" alt="PCCR Logo" class="w-20 h-20 mx-auto mb-4 drop-shadow-2xl">
                        <h1 class="text-3xl md:text-4xl font-bold text-white mb-2 font-['Poppins']">[Page Title]</h1>
                        <p class="text-white/90 text-lg mb-1">Philippine College of Criminology</p>
                        <p class="text-pccr-gold font-semibold text-sm tracking-wider">PRO BONO PUBLICO ET PATRIA</p>
                    </div>
                </div>
            </div>

            <!-- Content Card -->
            <div class="bg-white rounded-b-2xl shadow-2xl p-8">
                <!-- Page content here -->
            </div>

        </div>
    </div>

    <!-- Scroll to Top Button -->
    <button id="scrollTopBtn" class="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-br from-pccr-red to-pccr-red-dark text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 hidden z-40">
        <i class="fas fa-arrow-up"></i>
    </button>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    
    <!-- Custom Script -->
    <script src="script.js"></script>
    
</body>
</html>
```

---

## 🎨 Required CSS Patterns

### In style.css, include these base styles:

```css
/* === GLOBAL STYLES === */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f1f3f5 100%);
    position: relative;
    overflow-x: hidden;
}

/* === BACKGROUND DECORATIONS === */
/* Animated spotlight effects */
body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
        radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 20% 30%, rgba(123, 2, 0, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(252, 179, 28, 0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
}

/* Dot pattern */
.min-h-screen::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle, rgba(123, 2, 0, 0.03) 1px, transparent 1px);
    background-size: 30px 30px;
    pointer-events: none;
    z-index: 0;
}

/* === LOADING SCREEN === */
.loader {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top: 4px solid #fcb31c;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* === BUTTONS === */
.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 2rem;
    background: linear-gradient(135deg, #7b0200 0%, #5a0100 100%);
    color: white;
    font-weight: 600;
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

/* === FORMS === */
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

/* === ANIMATIONS === */
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

/* === ACCENT LINES === */
.accent-line {
    position: absolute;
    height: 2px;
    background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(252, 179, 28, 0.3) 20%, 
        rgba(123, 2, 0, 0.2) 50%, 
        rgba(252, 179, 28, 0.3) 80%, 
        transparent 100%);
    opacity: 0.4;
}

.line-1 {
    width: 60%;
    top: 15%;
    left: -10%;
    animation: slideRight 25s ease-in-out infinite;
}

@keyframes slideRight {
    0%, 100% {
        transform: translateX(0) rotate(2deg);
        opacity: 0.2;
    }
    50% {
        transform: translateX(120vw) rotate(-2deg);
        opacity: 0.6;
    }
}

/* === PARTICLES === */
.particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(123, 2, 0, 0.4);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(123, 2, 0, 0.3);
    animation: particleFloat 10s ease-in-out infinite;
}

.particle.gold {
    background: rgba(252, 179, 28, 0.5);
    box-shadow: 0 0 10px rgba(252, 179, 28, 0.4);
}

@keyframes particleFloat {
    0%, 100% {
        transform: translateY(0) scale(1);
        opacity: 0.4;
    }
    50% {
        transform: translateY(-20px) scale(1.2);
        opacity: 0.8;
    }
}
```

---

## 📝 Required JavaScript Pattern

### In script.js, include:

```javascript
// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Hide loading screen
    setTimeout(() => {
        gsap.to('#loadingScreen', {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                document.getElementById('loadingScreen').style.display = 'none';
            }
        });
    }, 1200);

    // Initialize animations
    initializeAnimations();
    
    // Setup scroll to top
    setupScrollToTop();
}

// === ANIMATIONS ===
function initializeAnimations() {
    // Animate content entrance
    gsap.from('.bg-white.rounded-b-2xl', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 1.3,
        ease: 'power3.out'
    });

    gsap.from('.bg-gradient-to-r', {
        opacity: 0,
        y: -20,
        duration: 0.6,
        delay: 1.3,
        ease: 'power3.out'
    });
}

// === SCROLL TO TOP ===
function setupScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// === TOAST NOTIFICATIONS ===
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'fixed top-6 right-6 bg-gradient-to-r from-pccr-red to-pccr-red-dark text-white px-6 py-4 rounded-lg shadow-2xl z-50';
    toast.innerHTML = `<i class="fas fa-check-circle mr-2"></i> ${message}`;
    
    document.body.appendChild(toast);

    gsap.from(toast, {
        x: 400,
        opacity: 0,
        duration: 0.3
    });

    setTimeout(() => {
        gsap.to(toast, {
            x: 400,
            opacity: 0,
            duration: 0.3,
            onComplete: () => toast.remove()
        });
    }, 3000);
}
```

---

## 🎨 Component Patterns

### Section Heading with Icon:
```html
<h2 class="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
    <span class="w-10 h-10 bg-gradient-to-br from-pccr-red to-pccr-red-dark text-white rounded-full flex items-center justify-center">
        <i class="fas fa-[icon-name] text-sm"></i>
    </span>
    [Section Title]
</h2>
<p class="text-gray-600 ml-13 mb-6">[Description text]</p>
```

### Info Alert Box:
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

### Form Input:
```html
<div class="form-group">
    <label class="block text-sm font-semibold text-gray-700 mb-2">[Label]</label>
    <input type="text" name="field_name" required class="form-input" placeholder="[Placeholder]">
    <small class="text-gray-500 text-xs mt-1 flex items-center gap-1">
        <i class="fas fa-info-circle text-pccr-gold"></i> [Helper text]
    </small>
</div>
```

### Button Group:
```html
<div class="flex justify-between mt-8">
    <button type="button" class="btn-secondary">
        <i class="fas fa-arrow-left mr-2"></i> Back
    </button>
    <button type="button" class="btn-primary">
        Continue <i class="fas fa-arrow-right ml-2"></i>
    </button>
</div>
```

---

## ✅ Requirements Checklist

When creating a new page, ensure:

### Design Requirements:
- [ ] Uses exact PCCR colors (#7b0200, #fcb31c)
- [ ] Includes PCCR logo (https://cutover.pccr.edu.ph/files/pccr-logo.png)
- [ ] Displays motto "Pro Bono Publico et Patria" in gold
- [ ] Uses Inter font for body text
- [ ] Uses Poppins font for headings
- [ ] Has gradient red header (from-pccr-red to-pccr-red-dark)
- [ ] Includes decorative background elements (particles, lines, glows)

### Technical Requirements:
- [ ] Separate files: index.html, style.css, script.js
- [ ] Uses Tailwind CSS via CDN with custom config
- [ ] Uses GSAP for animations
- [ ] Includes jQuery (for Frappe compatibility)
- [ ] Has loading screen animation
- [ ] Has scroll-to-top button
- [ ] Responsive on mobile, tablet, desktop

### Interactive Requirements:
- [ ] Smooth page load animation
- [ ] Hover effects on buttons
- [ ] Focus states on form inputs
- [ ] Toast notifications for feedback
- [ ] Keyboard navigation support
- [ ] Smooth scroll behavior

### Background Requirements:
- [ ] Multi-layered gradient background
- [ ] Radial gradient spotlights (red and gold)
- [ ] Dot pattern overlay
- [ ] 3 animated accent lines
- [ ] 12 floating particles (8 red, 4 gold)
- [ ] Floating decorative circles

---

## 📋 Example AI Prompt

**When asking AI to create a new page, use this format:**

```
Create a [PAGE NAME] for PCCR (Philippine College of Criminology) that matches the design system.

REQUIREMENTS:
1. Use the PCCR Design System from DESIGN_SYSTEM.md
2. Follow the HTML template structure from AI_PROMPT_TEMPLATE.md
3. Use EXACT colors: #7b0200 (red), #fcb31c (gold)
4. Separate code into: index.html, style.css, script.js
5. Use Tailwind CSS + GSAP animations
6. Include all decorative background elements
7. Make it responsive and accessible

SPECIFIC FEATURES FOR THIS PAGE:
- [List specific features needed]
- [Any unique requirements]
- [Special interactions or animations]

REFERENCE:
Look at the admission form (index.html) as the design reference.
Match the visual style, animations, and component patterns.
```

---

## 🎯 Common Modifications

### To change page title:
```html
<h1 class="text-3xl md:text-4xl font-bold text-white mb-2 font-['Poppins']">
    [Your New Title]
</h1>
```

### To add a new section:
```html
<div class="mb-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
        <span class="w-10 h-10 bg-gradient-to-br from-pccr-red to-pccr-red-dark text-white rounded-full flex items-center justify-center">
            <i class="fas fa-[icon] text-sm"></i>
        </span>
        Section Title
    </h2>
    <p class="text-gray-600 ml-13 mb-6">Section description</p>
    
    <!-- Section content -->
</div>
```

### To add a progress bar:
```html
<div class="mb-6">
    <div class="flex justify-between text-sm mb-2">
        <span class="font-semibold text-pccr-red">Progress</span>
        <span class="font-bold text-pccr-gold">75%</span>
    </div>
    <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-pccr-gold to-yellow-300 rounded-full transition-all duration-500" style="width: 75%"></div>
    </div>
</div>
```

---

## 📞 Support

For questions about the design system:
- Review `DESIGN_SYSTEM.md` for detailed specifications
- Check `README.md` for technical documentation
- Reference `index.html` for working examples

---

**Version:** 1.0.0  
**Purpose:** AI Agent Prompt Template for PCCR Pages  
**Maintained By:** PCCR Development Team

---

*Pro Bono Publico et Patria* 🎓
