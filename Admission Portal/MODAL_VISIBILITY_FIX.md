# Modal Visibility Fix

## Problem
The modal gets the `modal-active` class (visible in inspect element) but is not visually displayed on the screen.

## Root Cause
This is typically caused by **z-index stacking context** issues in Frappe's framework. Frappe has its own UI layer system that can override or stack above custom modals.

## Fixes Applied

### 1. Increased Z-Index Significantly
Changed modal z-index from `2000` to `99999` with `!important`:

```css
.modal {
    z-index: 99999 !important;
}

.modal-overlay {
    z-index: 99999 !important;
}

.modal-content {
    z-index: 100000 !important;
}
```

### 2. Added Explicit Visibility Properties
```css
.modal.modal-active {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: all !important;
}
```

### 3. Added Pointer Events Control
```css
.modal {
    pointer-events: none;  /* When hidden */
}

.modal.modal-active {
    pointer-events: all !important;  /* When active */
}

.modal-overlay,
.modal-content {
    pointer-events: all !important;
}
```

### 4. Added Debugging Logs
The script now logs computed styles when modal opens:
- Display property
- Z-index value
- Visibility
- Opacity
- Classes

## Testing Instructions

### Step 1: Update Files
1. Copy the updated `style.css` to Frappe Web Page **CSS** tab
2. Copy the updated `script.js` to Frappe Web Page **Scripting** tab  
3. Copy the updated `index.html` to Frappe Web Page **HTML** tab
4. **Save** the Web Page

### Step 2: Clear Cache
1. **Hard refresh** the page: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Or clear browser cache completely

### Step 3: Test Modal
1. Navigate to Applications section
2. Click any **"Assign"** button
3. **Open browser console** (F12 → Console tab)
4. Look for debug output:

```
Modal opened for application: [name]
Modal classes: modal modal-active
Modal display: flex
Modal z-index: 99999
Modal visibility: visible
Modal opacity: 1
```

### Step 4: Diagnose
If modal still not visible, check console output:

**If `display: flex` and `z-index: 99999` are shown:**
- ✅ CSS is applied correctly
- ❌ Something else is covering it

**If `display: none` is shown:**
- ❌ CSS not loaded properly
- Try clearing cache again or check CSS tab in Frappe

## Advanced Troubleshooting

### Check for Frappe Overlays
1. Open browser DevTools (F12)
2. Go to **Elements** tab
3. Look for elements with high z-index that might be covering modal
4. Common culprits:
   - `.frappe-toast`
   - `.modal-backdrop`
   - `.frappe-sidebar`
   - Any element with `z-index > 99999`

### Inspect Modal in DevTools
1. When modal is active, right-click on page → **Inspect**
2. Find `<div id="assignmentModal" class="modal modal-active">` in Elements
3. Check the **Computed** tab on the right
4. Look for these properties:
   - `display: flex` ✅
   - `visibility: visible` ✅  
   - `opacity: 1` ✅
   - `z-index: 99999` ✅
   - `position: fixed` ✅

### Check for Transform Issues
Some Frappe pages use CSS transforms on containers that can create new stacking contexts:

```css
/* Temporary fix - add to style.css if needed */
.modal {
    transform: translateZ(0);
    will-change: transform;
}
```

### Check Modal Position
In the console, when modal is active, run:

```javascript
var modal = document.getElementById('assignmentModal');
var rect = modal.getBoundingClientRect();
console.log('Modal position:', rect);
console.log('Is visible on screen:', 
    rect.top >= 0 && 
    rect.left >= 0 && 
    rect.bottom <= window.innerHeight && 
    rect.right <= window.innerWidth
);
```

### Force Modal Visibility (Emergency Fix)
If nothing works, add this to the **bottom** of `style.css`:

```css
/* EMERGENCY FIX - Force modal visibility */
#assignmentModal.modal-active {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
    z-index: 999999 !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.5) !important;
}

#assignmentModal .modal-content {
    display: block !important;
    position: relative !important;
    margin: auto !important;
    z-index: 1000000 !important;
}
```

## Common Issues

### Issue 1: Modal Behind Frappe's UI
**Symptom:** Console shows correct styles but modal not visible
**Fix:** Increase z-index even higher (999999)

### Issue 2: Modal Outside Viewport
**Symptom:** Console shows modal exists but can't see it
**Fix:** Check position with getBoundingClientRect() as shown above

### Issue 3: CSS Not Loaded
**Symptom:** Console shows `display: none` even when active
**Fix:** 
1. Verify CSS is in the CSS tab (not in HTML)
2. Clear browser cache
3. Check for CSS syntax errors

### Issue 4: GSAP Animation Hiding Modal
**Symptom:** Modal appears for split second then disappears
**Fix:** Temporarily disable GSAP animation:

```javascript
// In openAssignmentModal function, comment out:
// if (typeof gsap !== 'undefined') {
//     gsap.from('.modal-content', {
//         scale: 0.9,
//         opacity: 0,
//         duration: 0.3,
//         ease: 'back.out(1.7)'
//     });
// }
```

## Files Modified
1. ✅ `style.css` - Added high z-index and visibility properties
2. ✅ `script.js` - Added debugging logs  
3. ✅ `index.html` - Removed inline onclick from modal-content

## Next Steps
1. Follow testing instructions above
2. Share console output if modal still not visible
3. Take screenshot of Elements tab showing modal structure
4. Check computed styles in DevTools
