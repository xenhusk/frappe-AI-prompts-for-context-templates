# 🔒 Security Implementation Guide

**PCCR Admission Portal - Role-Based Access Control**  
*Protecting portal access with automatic authentication and authorization*

---

## 🎯 Overview

Both the **Admission Head Portal** and **Admission Staff Portal** now include robust security measures that:

1. ✅ **Verify user authentication** (logged in vs. Guest)
2. ✅ **Check role-based authorization** (correct role for portal)
3. ✅ **Automatically redirect** unauthorized users to login
4. ✅ **Display clear error messages** explaining why access was denied
5. ✅ **Preserve redirect URL** to return user after login

---

## 🔐 Security Architecture

### Multi-Layer Protection

```
┌─────────────────────────────────────────┐
│  User attempts to access portal         │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│  LAYER 1: Authentication Check          │
│  Is user logged in? (not "Guest")       │
└──────────────┬──────────────────────────┘
               ↓
         ┌─────┴─────┐
         │  Guest?   │
         └─────┬─────┘
               ↓ YES
         ┌─────────────────┐
         │ Redirect to     │
         │ Login Page      │
         └─────────────────┘
               │ NO
               ↓
┌─────────────────────────────────────────┐
│  LAYER 2: Authorization Check           │
│  Does user have required role?          │
└──────────────┬──────────────────────────┘
               ↓
         ┌─────┴─────┐
         │ Has Role? │
         └─────┬─────┘
               ↓ NO
         ┌─────────────────┐
         │ Show Message &  │
         │ Redirect Login  │
         └─────────────────┘
               │ YES
               ↓
┌─────────────────────────────────────────┐
│  ✓ GRANT ACCESS                         │
│  Initialize portal for user             │
└─────────────────────────────────────────┘
```

---

## 🛡️ Portal-Specific Security

### Admission Head Portal

**Required Roles (Any of):**
- `Admission Head`
- `System Manager`

**Fallback Chain for Role Detection:**
1. `frappe.boot.user.roles` (primary)
2. `frappe.user_roles` (fallback 1)
3. `frappe.session.user_roles` (fallback 2)

**Access Denied If:**
- User is "Guest" (not logged in)
- User lacks both "Admission Head" AND "System Manager" roles
- Unable to detect user roles

**On Denial:**
- Display message: *"You do not have permission to access the Admission Head Portal"*
- Wait 1.5 seconds (for user to read message)
- Redirect to: `/login?redirect-to=/admission-portal-head`

---

### Admission Staff Portal

**Required Roles:**
- `Admission Staff`

**Fallback Chain for Role Detection:**
1. `frappe.boot.user.roles` (primary)
2. `frappe.user_roles` (fallback 1)
3. `frappe.session.user_roles` (fallback 2)

**Access Denied If:**
- User is "Guest" (not logged in)
- User lacks "Admission Staff" role
- Unable to detect user roles

**On Denial:**
- Display message: *"You do not have permission to access the Admission Staff Portal"*
- Wait 1.5 seconds (for user to read message)
- Redirect to: `/login?redirect-to=/admission-portal-staff`

---

## 💻 Technical Implementation

### Security Functions

Both portals include two key security functions:

#### 1. `checkAccess()`
```javascript
function checkAccess() {
    // Step 1: Check authentication
    if (frappe.session.user === 'Guest') {
        console.warn('🔒 Access Denied: User not logged in');
        redirectToLogin('You must be logged in to access this page');
        return false;
    }
    
    // Step 2: Get user roles (with fallbacks)
    let userRoles = [];
    
    if (frappe.boot && frappe.boot.user && frappe.boot.user.roles) {
        userRoles = frappe.boot.user.roles;
    } else if (frappe.user_roles) {
        userRoles = frappe.user_roles;
    } else if (frappe.session.user_roles) {
        userRoles = frappe.session.user_roles;
    }
    
    // Step 3: Check authorization
    const hasAccess = REQUIRED_ROLES.some(role => userRoles.includes(role));
    
    if (!hasAccess) {
        console.warn('🔒 Access Denied: User does not have required role');
        redirectToLogin('You do not have permission to access this portal');
        return false;
    }
    
    console.log('✓ Access Granted: User has required role');
    return true;
}
```

**Returns:**
- `true` - User is authenticated and authorized
- `false` - User is denied access (redirect triggered)

---

#### 2. `redirectToLogin(message)`
```javascript
function redirectToLogin(message) {
    // Show user-friendly error message
    if (message) {
        frappe.msgprint({
            title: 'Access Denied',
            indicator: 'red',
            message: message
        });
        
        // Delay redirect to allow user to read message
        setTimeout(() => {
            window.location.href = '/login?redirect-to=' + 
                encodeURIComponent(window.location.pathname);
        }, 1500);
    } else {
        // Immediate redirect (no message)
        window.location.href = '/login?redirect-to=' + 
            encodeURIComponent(window.location.pathname);
    }
}
```

**Features:**
- Shows Frappe message dialog with error
- Preserves current URL as redirect target
- 1.5 second delay for UX
- URL encoding for safe redirect

---

### Integration Flow

```javascript
frappe.ready(function() {
    // SECURITY: Check access FIRST
    if (!checkAccess()) {
        return; // Stop execution immediately
    }
    
    // Only reached if access granted
    currentUserEmail = frappe.session.user;
    console.log('🎓 Initializing portal for:', currentUserEmail);
    initializeDashboard();
});
```

**Key Points:**
- ✅ Security check runs **before** any initialization
- ✅ Portal never loads if access denied
- ✅ User sees clean error message
- ✅ Automatic redirect to login
- ✅ After login, user returns to original portal

---

## 🧪 Testing Security

### Test Scenarios

#### ✅ Scenario 1: Guest User
**Setup:**
- Log out completely
- Navigate to portal URL directly

**Expected Result:**
- ❌ Access denied
- Message: "You must be logged in to access this page"
- Redirect to `/login?redirect-to=<portal-path>`
- After login with correct role → Return to portal

---

#### ✅ Scenario 2: Wrong Role (Staff tries Head Portal)
**Setup:**
- Log in as user with "Admission Staff" role only
- Navigate to Admission Head Portal

**Expected Result:**
- ❌ Access denied
- Message: "You do not have permission to access the Admission Head Portal"
- Redirect to login
- Console shows: Required roles vs. User roles

---

#### ✅ Scenario 3: Wrong Role (Head tries Staff Portal)
**Setup:**
- Log in as user with "Admission Head" role only
- Navigate to Admission Staff Portal

**Expected Result:**
- ❌ Access denied
- Message: "You do not have permission to access the Admission Staff Portal"
- Redirect to login

---

#### ✅ Scenario 4: Correct Role (Staff)
**Setup:**
- Log in as user with "Admission Staff" role
- Navigate to Admission Staff Portal

**Expected Result:**
- ✅ Access granted
- Console: "✓ Access Granted: User has required role"
- Console: "🎓 Initializing Admission Staff Portal for: user@example.com"
- Portal loads normally

---

#### ✅ Scenario 5: Correct Role (Head)
**Setup:**
- Log in as user with "Admission Head" or "System Manager" role
- Navigate to Admission Head Portal

**Expected Result:**
- ✅ Access granted
- Console: "✓ Access Granted: User has required role"
- Console: "🎓 Initializing Admission Head Portal for: user@example.com"
- Portal loads normally

---

#### ✅ Scenario 6: System Manager (Super User)
**Setup:**
- Log in as user with "System Manager" role
- Navigate to Admission Head Portal

**Expected Result:**
- ✅ Access granted (System Manager has access to Head portal)
- Portal loads normally

**Note:** System Managers do NOT automatically have access to Staff portal

---

## 🔍 Debugging Security Issues

### Console Logs

When security check runs, you'll see detailed console logs:

**Access Granted:**
```
✓ Roles from frappe.boot: ["Admission Head", "All"]
✓ Access Granted: User has required role
🎓 Initializing Admission Head Portal for: head@pccr.edu
```

**Access Denied (Wrong Role):**
```
✓ Roles from frappe.boot: ["Admission Staff", "All"]
🔒 Access Denied: User does not have required role
Required roles: ["Admission Head", "System Manager"]
User roles: ["Admission Staff", "All"]
```

**Access Denied (Not Logged In):**
```
🔒 Access Denied: User not logged in
```

---

### Common Issues & Fixes

#### Issue 1: Roles Not Detected
**Symptom:** Console shows empty roles array `[]`

**Possible Causes:**
- Web Page not loading Frappe context properly
- User object not fully initialized

**Fix:**
- Verify Web Page settings in Frappe
- Check if Web Page is published
- Ensure user has "Allow Login" checked
- Try clearing browser cache

---

#### Issue 2: Redirect Loop
**Symptom:** Keeps redirecting even with correct role

**Possible Causes:**
- Login page also checking roles
- Session not persisting after login

**Fix:**
- Check browser console for errors
- Verify Frappe session is working
- Try incognito/private browsing
- Check Frappe site session settings

---

#### Issue 3: System Manager Denied
**Symptom:** System Manager can't access Head portal

**Possible Causes:**
- Role name mismatch (e.g., "System manager" vs "System Manager")

**Fix:**
- Verify exact role name in Frappe
- Check console log for user roles
- Update `REQUIRED_ROLES` array if needed

---

## 🎛️ Customization

### Adding More Roles

To allow additional roles access:

**Admission Head Portal:**
```javascript
const REQUIRED_ROLES = [
    'Admission Head', 
    'System Manager',
    'Registrar',        // ADD NEW ROLES
    'Academic Director' // ADD NEW ROLES
];
```

**Admission Staff Portal:**
```javascript
const REQUIRED_ROLES = [
    'Admission Staff',
    'Junior Admission Officer' // ADD NEW ROLES
];
```

---

### Changing Redirect Behavior

**Option 1: Skip Message (Immediate Redirect)**
```javascript
if (!hasAccess) {
    redirectToLogin(); // No message parameter
    return false;
}
```

**Option 2: Custom Redirect URL**
```javascript
function redirectToLogin(message) {
    if (message) {
        frappe.msgprint({ /* ... */ });
        setTimeout(() => {
            window.location.href = '/access-denied'; // Custom page
        }, 1500);
    }
}
```

**Option 3: Longer Delay**
```javascript
setTimeout(() => {
    window.location.href = '/login?redirect-to=' + /* ... */;
}, 3000); // 3 seconds instead of 1.5
```

---

### Disabling Security (Dev/Testing Only)

⚠️ **WARNING: Only for local development!**

```javascript
// TEMPORARILY disable security check
frappe.ready(function() {
    // if (!checkAccess()) {
    //     return;
    // }
    
    currentUserEmail = frappe.session.user;
    initializeDashboard();
});
```

**Never deploy to production with security disabled!**

---

## 📋 Checklist for Deployment

Before deploying to production:

- [ ] Security checks added to both portals
- [ ] `REQUIRED_ROLES` arrays correctly configured
- [ ] Test with Guest user (should redirect)
- [ ] Test with wrong role user (should redirect)
- [ ] Test with correct role user (should load)
- [ ] Test with System Manager (Head portal should work)
- [ ] Console logs verified (no errors)
- [ ] Redirect-after-login tested
- [ ] Error messages are user-friendly
- [ ] No security bypass code left in files

---

## 🚀 Production Considerations

### Client-Side Security Limitations

**Important:** This implementation provides **client-side** security checks.

**What it protects:**
- ✅ Prevents unauthorized UI access
- ✅ Stops portal from loading for wrong users
- ✅ Provides good UX with clear messages

**What it doesn't protect:**
- ❌ Direct API calls (need server-side permissions)
- ❌ Frappe REST API access
- ❌ Backend data access

### Server-Side Security (Required!)

**Always ensure Frappe permissions are set:**

1. **DocType Permissions (Student Applicant)**
   - Admission Head: Read, Write, Create, Delete
   - Admission Staff: Read, Write (only assigned records)
   - System Manager: Full access

2. **Server Script Permissions**
   - Only accessible by authorized roles
   - Use `@frappe.whitelist()` with role checks

3. **API Method Permissions**
   - Check roles server-side
   - Never trust client-side role checks alone

**Example Server-Side Check:**
```python
import frappe

@frappe.whitelist()
def secure_method():
    # Server-side role check
    if not frappe.has_permission('Student Applicant', 'read'):
        frappe.throw('Insufficient permissions')
    
    # Your logic here
    pass
```

---

## 📊 Security Logs

All security events are logged to browser console:

| Event | Log |
|-------|-----|
| Guest access | `🔒 Access Denied: User not logged in` |
| Wrong role | `🔒 Access Denied: User does not have required role` |
| Role detected | `✓ Roles from frappe.boot: [...]` |
| Access granted | `✓ Access Granted: User has required role` |
| Portal initialized | `🎓 Initializing [Portal] for: email@domain.com` |

**For production, you may want to remove debug logs.**

---

## ✅ Summary

**Security Features Implemented:**
- ✅ Authentication check (Guest detection)
- ✅ Authorization check (Role validation)
- ✅ Multi-source role detection (3 fallbacks)
- ✅ User-friendly error messages
- ✅ Automatic login redirect
- ✅ Preserve original URL for post-login redirect
- ✅ Console logging for debugging
- ✅ Early termination (portal never loads if denied)

**Files Updated:**
- ✅ `Admission Portal Head/script.js` - Security for Head portal
- ✅ `Admission Portal Staff/script.js` - Security for Staff portal

**Both portals are now secure!** 🔒

---

*Remember: Client-side security is for UX. Always implement server-side permissions in Frappe!*
