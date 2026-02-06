# PCCR AI Prompt Templates and Design Context

> **Complete design system and AI prompt templates for creating consistent web pages for the Philippine College of Criminology (PCCR)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

---

## 📋 Overview

This repository contains a complete design system and AI-ready prompt templates for building web applications for the **Philippine College of Criminology (PCCR)**. It includes a fully functional student admission form as a reference implementation, along with comprehensive documentation for creating additional pages that maintain visual consistency.

### ✨ What's Inside

- 🎨 **Complete Design System** - Colors, typography, components, patterns
- 🤖 **AI Prompt Templates** - Ready-to-use templates for AI agents (ChatGPT, Claude, etc.)
- 💻 **Working Example** - Fully functional admission form with modern animations
- 📚 **Comprehensive Documentation** - Everything needed to extend the design
- ⚡ **Quick References** - Fast lookup guides for developers

---

## 🎨 Design Preview

The design features:
- **Official PCCR Colors**: Dark Red (#7b0200) and Gold (#fcb31c)
- **Modern UI**: Built with Tailwind CSS
- **Smooth Animations**: GSAP-powered transitions
- **Responsive Design**: Mobile-first approach
- **Decorative Backgrounds**: Multi-layered animated patterns

![PCCR Design](https://img.shields.io/badge/Design-PCCR_Official-7b0200?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

---

## 🚀 Quick Start

### Option 1: View the Demo
```bash
git clone https://github.com/YOUR_USERNAME/pccr-ai-prompt-templates.git
cd pccr-ai-prompt-templates
open index.html  # or just double-click the file
```

### Option 2: Use with AI Agents

**Prompt example for ChatGPT/Claude:**
```
I need to create a [student dashboard/enrollment page/etc] for PCCR.

Please read the AI_PROMPT_TEMPLATE.md file from this repository:
https://github.com/YOUR_USERNAME/pccr-ai-prompt-templates

Create a page that matches the admission form design with:
- PCCR colors (#7b0200 red, #fcb31c gold)
- Gradient red header with logo
- Animated background elements
- Responsive layout

[Add your specific requirements here]
```

---

## 📁 Repository Structure

```
pccr-ai-prompt-templates/
│
├── index.html                   # ⭐ Working admission form example
├── style.css                    # All custom styles
├── script.js                    # JavaScript logic with GSAP
│
├── DESIGN_SYSTEM.md            # 🎨 Complete design specifications
├── AI_PROMPT_TEMPLATE.md       # 🤖 AI agent instruction template
├── QUICK_REFERENCE.md          # ⚡ Fast lookup guide
│
├── README_DOCUMENTATION.md     # 📚 Documentation guide
├── QUICK_START.md              # 🚀 Developer quick start
├── BACKGROUND_FEATURES.md      # 🌈 Background layer documentation
│
└── .gitignore
```

---

## 📚 Documentation Guide

### For Developers
| Document | Purpose | When to Use |
|----------|---------|-------------|
| **QUICK_REFERENCE.md** | Fast lookups | Need a color code, CDN link, or snippet |
| **QUICK_START.md** | Getting started | New to the project, need setup guide |
| **DESIGN_SYSTEM.md** | Complete specs | Building new features, learning system |

### For AI Agents
| Document | Purpose |
|----------|---------|
| **AI_PROMPT_TEMPLATE.md** | Complete template with all requirements |
| **DESIGN_SYSTEM.md** | Detailed component specifications |

### For Understanding Design
| Document | Purpose |
|----------|---------|
| **BACKGROUND_FEATURES.md** | Explains the 10 background layers |
| **DESIGN_SYSTEM.md** | Full design language documentation |

---

## 🎨 Design System Highlights

### Colors
```css
/* Primary Colors */
--pccr-red: #7b0200;
--pccr-red-dark: #5a0100;
--pccr-gold: #fcb31c;
--pccr-gold-dark: #e09a00;
```

### Typography
- **Body Text**: Inter
- **Headings**: Poppins

### Tech Stack
- **CSS Framework**: Tailwind CSS (via CDN)
- **Animations**: GSAP (GreenSock)
- **Icons**: Font Awesome 6
- **JavaScript**: Vanilla JS + jQuery (Frappe compatibility)

---

## 🤖 Using with AI Agents

### Example: Creating a New Page

1. **Give the AI context:**
   ```
   Read AI_PROMPT_TEMPLATE.md from this repository
   ```

2. **Specify your needs:**
   ```
   Create a student enrollment status page that:
   - Shows enrollment steps with progress
   - Displays required documents
   - Uses PCCR red (#7b0200) and gold (#fcb31c) colors
   - Matches the admission form design
   ```

3. **AI will generate:**
   - ✅ Matching HTML structure
   - ✅ Consistent CSS styling
   - ✅ Proper animations
   - ✅ Responsive layout

---

## ✨ Features

### Admission Form (Reference Implementation)

- ✅ **Multi-step form** (4 steps with smooth transitions)
- ✅ **Real-time validation** (email, phone, required fields)
- ✅ **Auto-save** (localStorage draft recovery)
- ✅ **Keyboard shortcuts** (Enter, Esc, Alt+Arrows)
- ✅ **Progress tracking** (percentage + time estimates)
- ✅ **Toast notifications**
- ✅ **Loading screen**
- ✅ **Success screen** (with confetti!)
- ✅ **Responsive design** (mobile, tablet, desktop)
- ✅ **Animated background** (particles, glows, floating elements)

### Design System

- ✅ **Complete component library**
- ✅ **Button variants** (primary, secondary, success)
- ✅ **Form patterns** (inputs, selects, checkboxes)
- ✅ **Alert boxes** (info, warning, success, error)
- ✅ **Card layouts**
- ✅ **Header patterns**
- ✅ **Animation specifications**

---

## 📖 Documentation

### Quick Links

- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Complete design reference
- **[AI_PROMPT_TEMPLATE.md](AI_PROMPT_TEMPLATE.md)** - AI agent instructions
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Fast lookup guide
- **[README_DOCUMENTATION.md](README_DOCUMENTATION.md)** - Documentation overview

---

## 🎯 Use Cases

### 1. Building New PCCR Pages
Use `AI_PROMPT_TEMPLATE.md` to maintain design consistency across all pages.

### 2. Training AI Agents
Give AI agents the prompt template to generate matching designs automatically.

### 3. Developer Reference
Use `QUICK_REFERENCE.md` for fast lookups during development.

### 4. Design Consistency
Use `DESIGN_SYSTEM.md` as single source of truth for all design decisions.

---

## 🛠️ Technologies

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[GSAP](https://greensock.com/gsap/)** - Professional animation library
- **[jQuery](https://jquery.com/)** - DOM manipulation
- **[Font Awesome](https://fontawesome.com/)** - Icon library
- **[Google Fonts](https://fonts.google.com/)** - Inter & Poppins

---

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Guidelines
1. Follow the existing design system
2. Use PCCR brand colors (#7b0200, #fcb31c)
3. Test on multiple devices
4. Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎓 About PCCR

**Philippine College of Criminology**  
*Pro Bono Publico et Patria* (For the Good of the Public and Country)

Official website: [https://pccr.dev.abakadastudios.com/](https://pccr.dev.abakadastudios.com/)

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the documentation files
- Reference the working example in `index.html`

---

## 🌟 Star This Repository!

If you find this useful, please give it a star ⭐ to help others discover it!

---

## 📊 Repository Stats

![GitHub Stars](https://img.shields.io/github/stars/YOUR_USERNAME/pccr-ai-prompt-templates?style=social)
![GitHub Forks](https://img.shields.io/github/forks/YOUR_USERNAME/pccr-ai-prompt-templates?style=social)
![GitHub Issues](https://img.shields.io/github/issues/YOUR_USERNAME/pccr-ai-prompt-templates)

---

## 🔄 Updates

- **v1.0.0** (2025) - Initial release
  - Complete admission form
  - Full design system documentation
  - AI prompt templates
  - Comprehensive guides

---

**Built with ❤️ for PCCR**

*Pro Bono Publico et Patria* 🎓
