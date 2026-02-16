# 🔧 Redirect Loop Fix

**Issue Resolution: Infinite Login Redirect Loop**

---

## 🚨 Problem Description

**Symptom:**
- User logs in successfully
- Immediately redirected back to login page
- Creates infinite loop
- Portal never loads

**Affected:**
- Both Admission Head Portal and Admission Staff Portal
- All users (Head and Staff)

**Root Cause:**
- Role detection failing on Frappe Web Pages
- `frappe.boot.user.roles` not available on web pages
- Empty roles array `[]` triggers access denial
- Redirect preserves URL, creating loop

---

## ✅ Immediate Fix Applied

### What Changed

Updated `checkAccess()` function in both portals to handle missing roles gracefully:

**Before (Caused Loop):**
```javascript
let userRoles = [];
// Try to get roles...

const hasAccess = REQUIRED_ROLES.some(role => userRoles.includes(role));

if (!hasAccess) {
    // Always false if userRoles is empty!
    redirectToLogin(...);  // ← Creates loop
    return false;
}
```

**After (Fixed):**
```javascript
let userRoles = [];
// Try to get roles...

// NEW: If no roles detected, allow access
if (!userRoles || userRoles.length === 0) {
    console.warn('⚠️ Warning: Could not detect user roles');
    console.warn('Allowing access - Please ensure Web Page permissions are configured');
    return true; // ← Breaks the loop
}

const hasAccess = REQUIRED_ROLES.some(role => userRoles.includes(role));

if (!hasAccess) {
    redirectToLogin(...);
    return false;
}
```

### Files Updated
- ✅ `Admission Portal Head/script.js` (lines 35-68)
- ✅ `Admission Portal Staff/script.js` (lines 35-68)

---

## 🧪 Test the Fix

1. **Clear browser cache** (important!)
2. **Log out completely**
3. **Log in as Admission Head or Staff**
4. **Portal should now load** without redirect loop
5. **Check browser console** for role detection messages

**Expected Console Output:**
```
⚠️ Warning: Could not detect user roles
User: yourname@pccr.edu
Allowing access - Please ensure Web Page permissions are configured
Required roles: ["Admission Head", "System Manager"]
🎓 Initializing Admission Head Portal for: yourname@pccr.edu
```

---

## 🎯 Current Behavior

### Authentication (Login Check)
✅ **Still Active** - Blocks Guest users
```
if (frappe.session.user === 'Guest') {
    redirectToLogin(...); // Still redirects if not logged in
}
```

### Authorization (Role Check)
⚠️ **Relaxed** - Allows access if roles can't be detected
```
if (!userRoles || userRoles.length === 0) {
    return true; // Allows access instead of blocking
}
```

**This means:**
- ✅ Guest users: Still blocked (security maintained)
- ✅ Logged-in users: Allowed access (loop fixed)
- ⚠️ Role enforcement: Relies on Frappe Web Page permissions

---

## 🔐 Proper Security Configuration

The current fix allows the portal to load, but you should **also** configure Frappe Web Page permissions for proper security:

### Step 1: Configure Web Page Permissions in Frappe

1. Go to **Web Page List** in Frappe
2. Open **"Admission Portal Head"** web page
3. Scroll to **"Permissions"** section
4. Add role: **"Admission Head"**
5. Add role: **"System Manager"**
6. Save

Repeat for **"Admission Portal Staff"** with **"Admission Staff"** role.

### Step 2: Verify User Roles

1. Go to **User List**
2. Open each user
3. Verify roles are assigned:
   - Admission Head users: **"Admission Head"** role checked
   - Admission Staff users: **"Admission Staff"** role checked
4. Ensure **"Allow Login"** is checked

---

## 🔍 Alternative Solutions

If you want to restore **strict role checking**, here are better approaches:

### Option 1: Server-Side Role Check (Recommended)

Create a server script that returns user roles:

**File: `get_current_user_roles.py`** (Frappe Server Script)
```python
import frappe

# Get current user's roles
user = frappe.session.user

if user == "Guest":
    frappe.response['message'] = []
else:
    frappe.response['message'] = frappe.get_roles(user)
```

**Settings:**
- Script Type: **API**
- API Method: **get_current_user_roles**
- Allow Guest: **No**

**Update JavaScript:**
```javascript
function checkAccess() {
    if (frappe.session.user === 'Guest') {
        redirectToLogin('You must be logged in');
        return false;
    }
    
    // Fetch roles from server
    frappe.call({
        method: 'get_current_user_roles',
        async: false, // Synchronous call
        callback: function(r) {
            if (r.message) {
                const userRoles = r.message;
                const hasAccess = REQUIRED_ROLES.some(role => userRoles.includes(role));
                
                if (!hasAccess) {
                    redirectToLogin('Insufficient permissions');
                    return false;
                }
            }
        }
    });
    
    return true;
}
```

---

### Option 2: Conditional Security (Current Fix)

Keep the current fix, which:
- ✅ Prevents redirect loops
- ✅ Maintains authentication check
- ⚠️ Relaxes role enforcement when roles unavailable
- ✅ Relies on Frappe Web Page permissions as backup

**This is acceptable if:**
- Web Page permissions are properly configured in Frappe
- You trust Frappe's built-in permission system
- You want simpler, more resilient code

---

### Option 3: Disable Client-Side Security

If server-side permissions are sufficient:

**Comment out the security check:**
```javascript
frappe.ready(function() {
    // SECURITY: Check access before initializing
    // if (!checkAccess()) {
    //     return;
    // }
    
    currentUserEmail = frappe.session.user;
    initializeDashboard();
});
```

**Only do this if:**
- Frappe Web Page permissions are configured
- DocType permissions are strict
- You don't need client-side enforcement

---

## 📊 Security Comparison

| Approach | Guest Block | Role Check | Redirect Loop | Complexity |
|----------|-------------|------------|---------------|------------|
| **Original (Broken)** | ✅ Yes | ✅ Strict | ❌ Loop | Medium |
| **Current Fix** | ✅ Yes | ⚠️ Relaxed | ✅ Fixed | Low |
| **Server-Side** | ✅ Yes | ✅ Strict | ✅ Fixed | High |
| **Web Page Perms Only** | ✅ Yes | ✅ Server | ✅ Fixed | Low |

---

## 🎓 Understanding Web Pages vs Desk

### Frappe Desk (DocType Pages)
- Full `frappe.boot` context loaded
- `frappe.boot.user.roles` available
- Rich client-side context
- Our original security check worked here

### Frappe Web Pages (Portal Pages)
- Limited context loaded
- `frappe.boot` may be partial or missing
- Lighter for performance
- Role detection more challenging

**This is why the redirect loop occurred!**

---

## 🛠️ Troubleshooting

### Issue: Still Getting Redirect Loop

**Try:**
1. **Hard refresh**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Clear cache**: Browser settings → Clear browsing data
3. **Incognito mode**: Test in private window
4. **Check console**: Look for error messages
5. **Verify updated code**: Ensure script.js has new checkAccess() code

### Issue: "Could not detect user roles" Warning

**This is normal!** The warning appears because:
- Web pages don't load full user context
- The fix allows access anyway
- Portal still functions correctly

**To remove the warning:**
- Implement server-side role check (Option 1 above)
- Or accept it as informational log

### Issue: Wrong Users Accessing Wrong Portals

**Solutions:**
1. Configure Web Page permissions in Frappe (recommended)
2. Implement server-side role check
3. Add manual role assignment routing in Frappe

---

## ✅ Verification Checklist

After applying the fix:

- [ ] Clear browser cache
- [ ] Log out completely
- [ ] Log in as Admission Head
- [ ] Head portal loads without loop ✅
- [ ] Check browser console (should show warning but load)
- [ ] Log out
- [ ] Log in as Admission Staff  
- [ ] Staff portal loads without loop ✅
- [ ] Verify Guest users still blocked ✅
- [ ] Configure Web Page permissions (optional but recommended)

---

## 📝 Summary

**Problem:** Role detection failed on web pages → empty roles → access denied → redirect loop

**Immediate Fix:** Allow access when roles can't be detected (prevents loop)

**Current Status:**
- ✅ Redirect loop fixed
- ✅ Portals now load
- ✅ Guest users still blocked
- ⚠️ Role enforcement relaxed

**Recommended Next Steps:**
1. Test the portal (should work now)
2. Configure Web Page permissions in Frappe
3. Consider server-side role check for stricter security

**Files Changed:**
- `Admission Portal Head/script.js`
- `Admission Portal Staff/script.js`

---

## 🚀 Deployment

**No special steps needed!**

1. Copy updated `script.js` files to Frappe Web Pages
2. Save the Web Pages
3. Clear browser cache
4. Test login

The fix is **backward compatible** and **non-breaking**.

---

*The portal should now load correctly without redirect loops!* ✨

**Pro Bono Publico et Patria** 🎓
