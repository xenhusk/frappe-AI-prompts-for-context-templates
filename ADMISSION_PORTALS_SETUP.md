# PCCR Admission Portals - Dual Portal Setup

## Overview

The admission system has been split into **two separate portals** to eliminate role detection complexity:

1. **Admission Portal Head** - Full access for Admission Heads
2. **Admission Portal Staff** - Limited access for Staff members

## Folder Structure

```
frappe/
├── Admission Portal/              # Original (keep for reference)
├── Admission Portal Head/         # For Admission Heads
│   ├── index.html
│   ├── script.js
│   └── style.css
└── Admission Portal Staff/        # For Staff Members
    ├── index.html
    ├── script.js
    └── style.css
```

---

## Portal Differences

### **Admission Portal Head**

**Access Level:** Full administrative access

**Features:**
- ✅ View ALL applications (no filtering)
- ✅ Assign applications to staff
- ✅ See "Assigned To" column in table
- ✅ Approve/reject ANY application
- ✅ Load staff members dropdown
- ✅ Dashboard title: "Admission Head Control Panel"
- ✅ User role badge: "Admission Head"

**Script Configuration:**
```javascript
const isHead = true;  // Hardcoded
// No data filtering
let filters = {};
```

---

### **Admission Portal Staff**

**Access Level:** Limited to assigned applications only

**Features:**
- ✅ View ONLY applications assigned to them
- ❌ NO assign functionality
- ❌ NO "Assigned To" column visible
- ✅ Approve/reject ONLY assigned applications
- ❌ NO staff members dropdown
- ✅ Dashboard title: "Admission Staff Workspace"
- ✅ User role badge: "Admission Staff"

**Script Configuration:**
```javascript
const isHead = false;  // Hardcoded
// Strict data filtering
let filters = {
    assigned_staff: frappe.session.user
};
```

---

## 🔒 Security Features

**NEW:** Both portals now include robust role-based access control (RBAC).

### Security Measures

✅ **Authentication Check** - Verifies user is logged in (not Guest)  
✅ **Authorization Check** - Validates user has required role(s)  
✅ **Automatic Redirect** - Sends unauthorized users to login page  
✅ **Error Messages** - Clear feedback on why access was denied  
✅ **Post-Login Redirect** - Returns user to original portal after login

### Portal Access Matrix

| User Role | Head Portal | Staff Portal |
|-----------|-------------|--------------|
| Guest (Not logged in) | ❌ DENY | ❌ DENY |
| Admission Head | ✅ ALLOW | ❌ DENY |
| Admission Staff | ❌ DENY | ✅ ALLOW |
| System Manager | ✅ ALLOW | ❌ DENY* |

*System Manager access to Staff portal can be enabled if needed (see SECURITY_IMPLEMENTATION.md)

**For detailed security documentation, see:**
- `SECURITY_IMPLEMENTATION.md` - Complete security architecture
- `SECURITY_TESTING_GUIDE.md` - Test cases and procedures

---

## Setup in Frappe

### Step 1: Create Web Pages in Frappe

1. **For Admission Head Portal:**
   - Go to: **Setup > Website > Web Page > New**
   - **Page Name:** `admission-portal-head`
   - **Route:** `/admission-head`
   - **Published:** ✅ Yes
   - **Allow Guest:** ❌ No (IMPORTANT for security)
   - **Template:** Standard
   - Copy contents from `Admission Portal Head/index.html` to HTML section
   - Copy contents from `Admission Portal Head/style.css` to CSS section
   - Copy contents from `Admission Portal Head/script.js` to Script section

2. **For Admission Staff Portal:**
   - Go to: **Setup > Website > Web Page > New**
   - **Page Name:** `admission-portal-staff`
   - **Route:** `/admission-staff`
   - **Published:** ✅ Yes
   - **Allow Guest:** ❌ No (IMPORTANT for security)
   - **Template:** Standard
   - Copy contents from `Admission Portal Staff/index.html` to HTML section
   - Copy contents from `Admission Portal Staff/style.css` to CSS section
   - Copy contents from `Admission Portal Staff/script.js` to Script section

---

### Step 2: Set Page Permissions

#### Option A: Using Frappe's Built-in Page Rules

1. Edit the Web Page
2. Scroll to **Has Web Page Permission** section
3. Add roles:

**For Admission Head Portal:**
- Add row: Role = "Admission Head"
- Add row: Role = "System Manager"

**For Staff Portal:**
- Add row: Role = "Admission Staff"

#### Option B: Using Custom Redirects

Create a **Server Script** that redirects users to the correct portal:

```python
# Server Script Name: Admission Portal Router
# Script Type: Permission Query (or DocType Event on User)

import frappe

@frappe.whitelist()
def get_admission_portal_url():
    """Route users to correct portal based on role"""
    user_roles = frappe.get_roles()
    
    if "Admission Head" in user_roles or "System Manager" in user_roles:
        return "/admission-head"
    elif "Admission Staff" in user_roles:
        return "/admission-staff"
    else:
        return "/no-access"
```

---

### Step 3: Update Navigation/Home Pages

Update your workspace or home page with role-based links:

**In Workspace:**
```json
{
  "label": "Admission Portal",
  "type": "Link",
  "link_type": "Page",
  "page": "admission-head",
  "only_for": "Admission Head"
}

{
  "label": "My Applications",
  "type": "Link",
  "link_type": "Page",
  "page": "admission-staff",
  "only_for": "Admission Staff"
}
```

---

## Key Changes Made

### 1. **Simplified Initialization**

**Before (Original):**
- Complex role detection logic (100+ lines)
- API calls to fetch roles
- Multiple fallback methods
- Error prone on web pages

**After (New Portals):**
- Simple hardcoded `isHead` value
- No role detection needed
- 10 lines of initialization
- Works reliably on all pages

---

### 2. **Data Loading**

**Head Portal:**
```javascript
let filters = {}; // No filter = all data
```

**Staff Portal:**
```javascript
let filters = {
    assigned_staff: frappe.session.user  // Only assigned
};
```

---

### 3. **UI Elements**

| Feature | Head Portal | Staff Portal |
|---------|-------------|--------------|
| Assign Button | ✅ Visible | ❌ Hidden |
| Assigned Column | ✅ Visible | ❌ Hidden |
| Approve/Reject | ✅ All apps | ✅ Assigned only |
| Table Colspan | 7 | 6 |
| Empty State | "No applications found" | "No applications assigned to you" |

---

## 🔒 Security Testing

**CRITICAL:** Test security measures before production deployment!

### Quick Security Tests

1. **Test Guest Access:**
   - Log out completely
   - Try accessing both portal URLs directly
   - Expected: Redirect to login with error message

2. **Test Wrong Role:**
   - Login as Admission Staff
   - Try accessing Head portal URL
   - Expected: Access denied, redirect to login

3. **Test Correct Role:**
   - Login as Admission Head
   - Access Head portal
   - Expected: Portal loads normally

**Complete Testing:** See `SECURITY_TESTING_GUIDE.md` for all test cases

---

## Testing

### Test as Admission Head

1. Log in with a user that has "Admission Head" role
2. Navigate to `/admission-head`
3. Verify:
   - Title says "Admission Head Control Panel"
   - Can see ALL applications
   - "Assign" button visible
   - "Assigned To" column visible
   - Can approve/reject any application

### Test as Staff

1. Log in with a user that has "Admission Staff" role
2. Navigate to `/admission-staff`
3. Verify:
   - Title says "Admission Staff Workspace"
   - Can see ONLY assigned applications
   - NO "Assign" button
   - NO "Assigned To" column
   - Can approve/reject only assigned applications

---

## Benefits of This Approach

✅ **Simple & Clean**
- No complex role detection logic
- Easy to understand and maintain
- No server script dependencies

✅ **Reliable**
- No permission errors
- No role fetching issues
- Works on web pages without issues

✅ **Secure**
- Data filtering at API level (not just UI)
- Frappe page permissions control access
- Each portal isolated

✅ **Maintainable**
- Clear separation of concerns
- Easy to modify each portal independently
- No shared logic confusion

---

## Troubleshooting

### Issue: Users can access wrong portal

**Solution:** Set proper page permissions in Frappe
- Edit the Web Page
- Add role restrictions in "Has Web Page Permission"

### Issue: Staff sees no data

**Check:**
1. Are applications actually assigned to them?
2. Check `assigned_staff` field in Student Applicant doctype
3. Verify user email matches the assigned_staff field exactly

### Issue: Approve/Reject buttons don't show

**For Staff:** They only show if `assigned_staff === current_user`
**For Head:** They always show

---

## Migration Notes

- **Keep the original** `Admission Portal` folder for reference
- Both new portals share the **same CSS** (style.css is identical)
- Both connect to the **same DocType** (Student Applicant)
- No database changes required

---

## Future Enhancements

Possible improvements:
1. Add a landing page that auto-redirects based on role
2. Create role-specific dashboards
3. Add more granular permissions within each portal
4. Implement staff-specific metrics in Staff portal

---

## Support

If you encounter issues:
1. Check Frappe error logs: **Tools > Error Log**
2. Verify user roles: **User > Roles tab**
3. Check page permissions: **Web Page > Has Web Page Permission**
4. Verify DOCTYPE permissions: **Role Permission Manager**

---

**Created:** February 2026  
**Version:** 1.0  
**Status:** Production Ready ✅
