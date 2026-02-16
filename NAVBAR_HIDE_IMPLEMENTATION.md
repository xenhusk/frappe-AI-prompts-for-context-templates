# 🚫 Hide Frappe Default Navbar

**Remove Frappe's Default Navigation Bar from Portal Pages**

---

## 🎯 Objective

Hide the default Frappe navbar that includes:
- Logo
- User avatar dropdown
- Login button
- Language switcher
- "My Account", "Log out", "Switch to Desk" links

**Reason:** Custom portal has its own navigation and header design.

---

## ✅ Solution Implemented

### CSS Added to Both Portals

```css
/* Hide Frappe Default Navbar */
.navbar.navbar-light.navbar-expand-lg,
nav.navbar {
    display: none !important;
}

/* Adjust body padding if navbar was adding spacing */
body {
    padding-top: 0 !important;
}
```

---

## 🔍 What This Hides

### Navbar Elements Hidden

```html
<!-- All of this will be hidden -->
<nav class="navbar navbar-light navbar-expand-lg">
  <div class="container">
    <!-- Logo -->
    <a class="navbar-brand" href="/">
      <img src="/files/new logo initial 2.png">
    </a>
    
    <!-- Mobile toggle button -->
    <button class="navbar-toggler">...</button>
    
    <!-- User dropdown -->
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav">
        <li class="nav-item dropdown logged-in">
          <!-- Avatar -->
          <a class="nav-link nav-avatar">A</a>
          
          <!-- Dropdown menu -->
          <ul class="dropdown-menu">
            <a href="/me">My Account</a>
            <a href="/?cmd=web_logout">Log out</a>
            <a href="/app">Switch To Desk</a>
            <a href="/apps">Apps</a>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

**Result:** ✅ All hidden with `display: none !important;`

---

## 📁 Files Updated

**Both Portals:**
- ✅ `Admission Portal Head/style.css`
- ✅ `Admission Portal Staff/style.css`

**CSS Location:** Added at the top after global styles (around line 7-15)

---

## 🎨 Visual Impact

### Before
```
┌────────────────────────────────────────┐
│  [Logo]              [User Avatar ▼]  │ ← Frappe Navbar
├────────────────────────────────────────┤
│                                        │
│  [Your Custom Portal Header]          │ ← Your Portal
│                                        │
└────────────────────────────────────────┘
```

### After
```
┌────────────────────────────────────────┐
│  [Your Custom Portal Header]          │ ← Clean Start
│                                        │
│  No duplicate navigation!              │
└────────────────────────────────────────┘
```

---

## ✅ Benefits

### Cleaner Interface
✅ **No duplicate navigation** - Only your custom portal UI visible  
✅ **More screen space** - Navbar removed from top  
✅ **Professional look** - Branded portal without default Frappe chrome  

### User Experience
✅ **Less confusion** - One logout button (yours in Settings)  
✅ **Consistent branding** - Full PCCR portal design  
✅ **Immersive** - Feels like dedicated application  

---

## 🔧 Troubleshooting

### Issue: Navbar Still Visible

**Try these solutions:**

1. **Clear browser cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux)
   - Or: `Cmd+Shift+R` (Mac)

2. **Check CSS loaded**
   - Open browser DevTools (F12)
   - Go to Elements tab
   - Find `<nav class="navbar">`
   - Check if style shows `display: none !important;`

3. **Verify CSS file updated**
   - Ensure the CSS was copied to Frappe Web Page
   - Check the CSS section in Web Page includes the new rules

4. **Inspect element**
   ```javascript
   // In browser console:
   document.querySelector('nav.navbar').style.display
   // Should return: "none"
   ```

---

### Issue: Page Layout Broken After Hiding Navbar

**Possible causes:**
- Frappe may have added padding to body to accommodate navbar
- Other elements may be positioned relative to navbar

**Solution already included:**
```css
body {
    padding-top: 0 !important;
}
```

**If still broken, add:**
```css
.page_content,
.web-page-content,
main {
    margin-top: 0 !important;
    padding-top: 0 !important;
}
```

---

### Issue: Want to Show Navbar on Some Pages

**To show navbar on specific pages only:**

```css
/* Hide by default */
nav.navbar {
    display: none !important;
}

/* Show on specific page */
body[data-path="/some-page"] nav.navbar {
    display: block !important;
}
```

---

## 🔄 Alternative: Hide Specific Parts Only

If you want to keep some navbar elements:

### Hide Only User Dropdown
```css
.nav-item.dropdown.logged-in {
    display: none !important;
}
```

### Hide Only Logo
```css
.navbar-brand {
    display: none !important;
}
```

### Hide Only "Switch to Desk" Link
```css
.dropdown-item.switch-to-desk {
    display: none !important;
}
```

---

## 💡 Your Custom Navigation

Since the default navbar is hidden, your portal provides:

### Custom Header (Both Portals)
- PCCR Maroon header with logo
- User info display
- Refresh button
- ~~Notification button~~ (hidden, not implemented)

### Custom Settings Page
- User email display
- Role display
- Logout button
- Account information

**Result:** Complete branded experience! ✅

---

## 🎨 CSS Specificity

The `!important` flag ensures our styles override Frappe's default styles:

```css
/* Frappe's default (lower specificity) */
.navbar {
    display: block;
}

/* Our override (higher specificity with !important) */
nav.navbar {
    display: none !important;  /* ← Wins! */
}
```

---

## 📝 Notes

### Why Both Selectors?
```css
.navbar.navbar-light.navbar-expand-lg,  /* Specific Frappe navbar */
nav.navbar {                             /* Generic navbar fallback */
    display: none !important;
}
```

**Reason:** Ensures we catch all variations of Frappe navbar classes.

### Why `!important`?
- Frappe loads its own CSS with high specificity
- `!important` ensures our hide rule takes precedence
- Prevents Frappe updates from showing the navbar again

### Body Padding Reset
```css
body {
    padding-top: 0 !important;
}
```

**Reason:** Frappe often adds top padding to accommodate the navbar. We remove it for clean layout.

---

## ✅ Verification Steps

1. **Open portal in browser**
2. **Check top of page** - No Frappe navbar visible ✅
3. **Your portal header** starts immediately ✅
4. **Inspect element** (F12) - Should see:
   ```html
   <nav class="navbar..." style="display: none !important;">
   ```
5. **Test on mobile** - No navbar on any screen size ✅

---

## 🚀 Deployment

**No special steps needed!**

1. CSS already updated in both portal files
2. Copy updated CSS to Frappe Web Pages
3. Save Web Pages
4. Hard refresh browser (`Ctrl+Shift+R`)
5. Navbar should be hidden ✅

---

## ✅ Summary

**Problem:** Frappe's default navbar showing on custom portal pages

**Solution:** Added CSS to hide navbar completely

**CSS Added:**
```css
nav.navbar { display: none !important; }
body { padding-top: 0 !important; }
```

**Result:** 
- ✅ Clean portal interface
- ✅ No duplicate navigation
- ✅ Fully branded PCCR experience
- ✅ Custom header only

**Files Changed:**
- `Admission Portal Head/style.css`
- `Admission Portal Staff/style.css`

---

*Pro Bono Publico et Patria* 🎓

**Frappe navbar now hidden for clean portal experience!** 🚫✨
