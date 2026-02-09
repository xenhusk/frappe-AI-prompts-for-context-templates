# View Modal Integration Guide

## Overview
This guide shows you how to integrate the View Application Modal into your existing Admission Portal.

## Files Created
1. `view_modal.html` - Modal HTML structure
2. `view_modal_functions.js` - JavaScript functions
3. `view_modal_styles.css` - CSS styles

## Integration Steps

### Step 1: Add HTML to index.html

Open `index.html` and add the content from `view_modal.html` right **after** the assignment modal and **before** the scroll-to-top button.

**Location:** After line 312 (after `</div>` closing the assignment modal)

```html
    </div>
    <!-- End of Assignment Modal -->

    <!-- ✅ ADD VIEW MODAL HTML HERE -->
    [Paste content from view_modal.html]
    <!-- End of View Modal -->

    <!-- Scroll to Top Button -->
    <button id="scrollTopBtn" ...>
```

### Step 2: Add JavaScript to script.js

Open `script.js` and add the content from `view_modal_functions.js` at the **end of the file**, just before the closing of the frappe.ready block.

**Location:** Near the end of script.js, before the final `});`

```javascript
// === VIEW APPLICATION MODAL ===
[Paste content from view_modal_functions.js]

// Call setup when initializing
function initializeDashboard() {
    // ... existing code ...
    
    setupModalListeners();
    setupTableButtonListeners();
    setupViewModalListeners(); // ✅ ADD THIS LINE
    
    initializeSections();
}
```

**Important:** Also update the existing `viewApplication` function call. Find this line in `setupTableButtonListeners()`:

```javascript
// OLD - This redirects to Frappe form
if (button.classList.contains('btn-view')) {
    viewApplication(appName); // This now opens the view modal!
}
```

The new `viewApplication()` function we added will automatically replace the old one.

### Step 3: Add CSS to style.css

Open `style.css` and add the content from `view_modal_styles.css` at the **end of the file**.

**Location:** At the very end of style.css

```css
/* === ACCESSIBILITY === */
.btn-primary:focus-visible,
...existing styles...

/* ✅ ADD VIEW MODAL STYLES HERE */
[Paste content from view_modal_styles.css]
```

### Step 4: Update Initialization

Make sure `setupViewModalListeners()` is called in the `initializeDashboard()` function.

Find this section in `script.js`:

```javascript
async function initializeDashboard() {
    // ... existing code ...
    
    // Setup sidebar toggle for mobile
    setupSidebarToggle();
    
    // Setup modal event listeners
    setupModalListeners();
    
    // Setup table button event listeners
    setupTableButtonListeners();
    
    // ✅ ADD THIS LINE:
    setupViewModalListeners();
    
    // Initialize sections - start with applications
    initializeSections();
}
```

## Testing

### Step 1: Verify Integration
1. Save all three files (index.html, script.js, style.css)
2. Update them in your Frappe Web Page
3. Hard refresh: Ctrl+Shift+R or Cmd+Shift+R

### Step 2: Test View Modal
1. Click any **"View"** button (eye icon) in the applications table
2. The view modal should open with tabs
3. Check all 4 tabs:
   - Admission Details
   - Personal Information
   - Guardian & Address
   - Status & Assignment

### Step 3: Test Features
- ✅ Tab switching works
- ✅ Data displays correctly
- ✅ Status badge shows with proper color
- ✅ Guardian/Sibling tables populate (if data exists)
- ✅ Close button works
- ✅ ESC key closes modal
- ✅ "Open in Frappe" button works
- ✅ Status update works (for Admission Head)

## Features Included

### For All Users:
- **Tabbed interface** for organized data viewing
- **Print functionality** - prints application details
- **Responsive design** - works on mobile
- **Quick close** - ESC key, overlay click, or close button
- **Open in Frappe** - link to full form editor

### For Admission Head Only:
- **Status update** - change application status directly from modal
- Updates are saved immediately and refresh the table

## Troubleshooting

### Modal doesn't open
**Check:**
1. Console for JavaScript errors
2. `viewApplication()` function is defined
3. `setupViewModalListeners()` is called

**Fix:** Make sure all JavaScript from `view_modal_functions.js` is added to `script.js`

### Modal opens but no data
**Check:**
1. Console for API errors
2. Application name is being passed correctly
3. `frappe.client.get` has permission to read Student Applicant

**Fix:** Check browser console for error messages

### Tabs don't switch
**Check:**
1. CSS from `view_modal_styles.css` is loaded
2. `switchViewTab()` function exists
3. Tab buttons have correct `data-tab` attributes

**Fix:** Make sure all CSS is added to `style.css`

### Guardian/Sibling tables empty
**Note:** This is normal if the application doesn't have guardian/sibling data.

**Check:** Open the application in Frappe to verify data exists.

### Status update doesn't work
**Check:**
1. User is Admission Head
2. `isHead` variable is set correctly
3. Permission to update Student Applicant

**Fix:** Check console for permission errors

## Customization

### Change Tab Order
Edit the tab buttons in `view_modal.html`:

```html
<div class="view-modal-tabs">
    <button class="view-tab active" data-tab="admission">...</button>
    <button class="view-tab" data-tab="personal">...</button>
    <!-- Change order by reordering these buttons -->
</div>
```

### Add More Fields
1. Add view field in appropriate tab section:
```html
<div class="view-field">
    <label>New Field</label>
    <span id="view_new_field">-</span>
</div>
```

2. Populate it in `populateViewModal()`:
```javascript
setViewField('view_new_field', data.new_field);
```

### Hide Print Button
Remove or hide the print button in modal header:

```html
<!-- Comment out or remove this: -->
<!-- <button class="modal-action-btn" onclick="printApplication()">
    <i class="fas fa-print"></i>
</button> -->
```

### Change Colors
Edit CSS variables in `view_modal_styles.css`:

```css
.modal-header {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}

.view-tab.active {
    color: #YOUR_PRIMARY_COLOR;
    border-bottom-color: #YOUR_PRIMARY_COLOR;
}
```

## Summary

After integration, clicking the "View" button will:
1. ✅ Open a beautiful modal with tabs
2. ✅ Display all application information organized by category
3. ✅ Allow status updates (for Admission Head)
4. ✅ Provide print functionality
5. ✅ Still allow access to full Frappe form if needed

The modal keeps users in the portal instead of redirecting to Frappe's UI!
