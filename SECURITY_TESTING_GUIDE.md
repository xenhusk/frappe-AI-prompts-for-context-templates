# 🧪 Security Testing Guide

**Quick Reference for Testing Portal Access Control**

---

## 🎯 Test Matrix

| User Role | Head Portal | Staff Portal |
|-----------|-------------|--------------|
| Guest (Not logged in) | ❌ DENY | ❌ DENY |
| Admission Head | ✅ ALLOW | ❌ DENY |
| Admission Staff | ❌ DENY | ✅ ALLOW |
| System Manager | ✅ ALLOW | ❌ DENY |
| Other Roles | ❌ DENY | ❌ DENY |

---

## 📝 Test Cases

### Test Case 1: Guest User Access
**Objective:** Verify unauthenticated users cannot access portals

**Steps:**
1. Log out completely (or open incognito window)
2. Navigate to `https://your-site.com/admission-portal-head`
3. Observe behavior
4. Repeat for `https://your-site.com/admission-portal-staff`

**Expected Result:**
- ❌ Portal does not load
- 🔴 Red message dialog appears: "You must be logged in to access this page"
- ↪️ Redirect to login page after 1.5 seconds
- 🔗 URL includes redirect parameter: `/login?redirect-to=/admission-portal-head`

**Console Log:**
```
🔒 Access Denied: User not logged in
```

**Status:** ✅ PASS / ❌ FAIL

---

### Test Case 2: Admission Head - Head Portal
**Objective:** Verify Admission Head can access Head portal

**Setup:**
1. Create/use user with "Admission Head" role
2. Login as this user
3. Navigate to Admission Head Portal

**Expected Result:**
- ✅ Portal loads successfully
- 📊 Dashboard displays with all features
- 👥 Can see all applications
- 🔧 Can assign staff
- 📈 Charts render correctly

**Console Log:**
```
✓ Roles from frappe.boot: ["Admission Head", ...]
✓ Access Granted: User has required role
🎓 Initializing Admission Head Portal for: head@pccr.edu
```

**Status:** ✅ PASS / ❌ FAIL

---

### Test Case 3: Admission Head - Staff Portal
**Objective:** Verify Admission Head cannot access Staff portal

**Setup:**
1. Still logged in as Admission Head user
2. Navigate to Admission Staff Portal

**Expected Result:**
- ❌ Portal does not load
- 🔴 Message: "You do not have permission to access the Admission Staff Portal"
- ↪️ Redirect to login

**Console Log:**
```
✓ Roles from frappe.boot: ["Admission Head", ...]
🔒 Access Denied: User does not have required role
Required roles: ["Admission Staff"]
User roles: ["Admission Head", ...]
```

**Status:** ✅ PASS / ❌ FAIL

---

### Test Case 4: Admission Staff - Staff Portal
**Objective:** Verify Admission Staff can access Staff portal

**Setup:**
1. Create/use user with "Admission Staff" role
2. Login as this user
3. Navigate to Admission Staff Portal

**Expected Result:**
- ✅ Portal loads successfully
- 📊 Dashboard displays personal metrics
- 📋 Only sees assigned applications
- 🚫 Cannot see "Assign" button
- 📈 Personal charts render

**Console Log:**
```
✓ Roles from frappe.boot: ["Admission Staff", ...]
✓ Access Granted: User has required role
🎓 Initializing Admission Staff Portal for: staff@pccr.edu
```

**Status:** ✅ PASS / ❌ FAIL

---

### Test Case 5: Admission Staff - Head Portal
**Objective:** Verify Admission Staff cannot access Head portal

**Setup:**
1. Still logged in as Admission Staff user
2. Navigate to Admission Head Portal

**Expected Result:**
- ❌ Portal does not load
- 🔴 Message: "You do not have permission to access the Admission Head Portal"
- ↪️ Redirect to login

**Console Log:**
```
✓ Roles from frappe.boot: ["Admission Staff", ...]
🔒 Access Denied: User does not have required role
Required roles: ["Admission Head", "System Manager"]
User roles: ["Admission Staff", ...]
```

**Status:** ✅ PASS / ❌ FAIL

---

### Test Case 6: System Manager - Head Portal
**Objective:** Verify System Manager can access Head portal

**Setup:**
1. Login as System Manager (Administrator)
2. Navigate to Admission Head Portal

**Expected Result:**
- ✅ Portal loads successfully
- ✅ Full access to all features
- 👑 System Manager is super user

**Console Log:**
```
✓ Roles from frappe.boot: ["System Manager", ...]
✓ Access Granted: User has required role
🎓 Initializing Admission Head Portal for: admin@pccr.edu
```

**Status:** ✅ PASS / ❌ FAIL

---

### Test Case 7: System Manager - Staff Portal
**Objective:** Verify System Manager cannot access Staff portal by default

**Setup:**
1. Still logged in as System Manager
2. Navigate to Admission Staff Portal

**Expected Result:**
- ❌ Portal does not load (unless "System Manager" added to Staff REQUIRED_ROLES)
- 🔴 Access denied message

**Note:** If you want System Managers to access Staff portal, add "System Manager" to the `REQUIRED_ROLES` array in Staff portal's script.js

**Status:** ✅ PASS / ❌ FAIL

---

### Test Case 8: Other Roles
**Objective:** Verify users with unrelated roles cannot access portals

**Setup:**
1. Create user with roles like "Sales User", "Employee", etc. (but NOT Admission roles)
2. Login as this user
3. Try accessing both portals

**Expected Result:**
- ❌ Both portals deny access
- 🔴 Permission denied message for each
- ↪️ Redirect to login

**Status:** ✅ PASS / ❌ FAIL

---

### Test Case 9: Redirect After Login
**Objective:** Verify post-login redirect works correctly

**Steps:**
1. Log out completely
2. Navigate directly to Head portal URL
3. Get redirected to login (note the URL has `?redirect-to=...`)
4. Login with correct credentials (Admission Head)
5. Observe redirect behavior

**Expected Result:**
- ✅ After successful login, automatically redirected back to Head portal
- ✅ Portal loads normally
- ✅ No need to navigate manually

**Status:** ✅ PASS / ❌ FAIL

---

### Test Case 10: Multiple Roles
**Objective:** Verify user with both Head and Staff roles

**Setup:**
1. Create user with BOTH "Admission Head" AND "Admission Staff" roles
2. Login as this user
3. Try accessing both portals

**Expected Result:**
- ✅ Head portal: Access granted (has Admission Head role)
- ❌ Staff portal: Access denied (checking for Staff role only, but has Head)
  
**Alternative Configuration:**
If you want dual-role users to access both, modify Staff portal's `REQUIRED_ROLES`:
```javascript
const REQUIRED_ROLES = ['Admission Staff', 'Admission Head'];
```

**Status:** ✅ PASS / ❌ FAIL

---

## 🐛 Troubleshooting

### Issue: All users denied (even with correct roles)

**Check:**
1. Open browser console (F12)
2. Look for role detection logs
3. Verify role names match exactly (case-sensitive!)

**Common Causes:**
- Role name mismatch: "admission head" vs "Admission Head"
- Roles not loaded: Web Page settings issue
- Session issue: Try clearing cache

**Fix:**
```javascript
// Check exact role names in Frappe
// User > Role Permission Manager
// Copy exact role name to REQUIRED_ROLES array
```

---

### Issue: Redirect loop after login

**Check:**
1. Does login page also have security checks?
2. Is session persisting after login?

**Fix:**
- Ensure login page is public (no security checks)
- Clear browser cookies/cache
- Check Frappe session settings

---

### Issue: Console shows empty roles array

**Check:**
```javascript
✓ Roles from frappe.boot: []
🔒 Access Denied: User does not have required role
```

**Causes:**
- Web Page not loading Frappe context
- User session not fully initialized

**Fix:**
1. Verify Web Page is published
2. Check "Allow Guest" is OFF in Web Page settings
3. Ensure user has "Allow Login" enabled
4. Try adding Server Script for role detection (see SECURITY_IMPLEMENTATION.md)

---

## 📊 Testing Checklist

Before marking security as ✅ Complete:

- [ ] Guest cannot access Head portal
- [ ] Guest cannot access Staff portal
- [ ] Admission Head can access Head portal
- [ ] Admission Head cannot access Staff portal
- [ ] Admission Staff can access Staff portal
- [ ] Admission Staff cannot access Head portal
- [ ] System Manager can access Head portal
- [ ] System Manager handling for Staff portal (decide policy)
- [ ] Other roles denied access to both portals
- [ ] Redirect-after-login works correctly
- [ ] Error messages are clear and user-friendly
- [ ] Console logs show correct role detection
- [ ] No JavaScript errors in console
- [ ] Works across browsers (Chrome, Firefox, Safari, Edge)
- [ ] Works on mobile devices

---

## 🎭 Test User Setup

### Create Test Users in Frappe

**Admission Head Test User:**
```
Email: testhead@pccr.edu
First Name: Test
Last Name: Head
Roles: 
  - Admission Head
  - All (basic role)
Allow Login: ✓
```

**Admission Staff Test User:**
```
Email: teststaff@pccr.edu
First Name: Test
Last Name: Staff
Roles: 
  - Admission Staff
  - All (basic role)
Allow Login: ✓
```

**Mixed Role Test User:**
```
Email: testboth@pccr.edu
First Name: Test
Last Name: Both
Roles: 
  - Admission Head
  - Admission Staff
  - All (basic role)
Allow Login: ✓
```

---

## 🔍 Security Audit Log

Use this table to track your testing:

| Test Case | Tester | Date | Result | Notes |
|-----------|--------|------|--------|-------|
| TC1: Guest Access | | | ⬜ | |
| TC2: Head → Head Portal | | | ⬜ | |
| TC3: Head → Staff Portal | | | ⬜ | |
| TC4: Staff → Staff Portal | | | ⬜ | |
| TC5: Staff → Head Portal | | | ⬜ | |
| TC6: SysMan → Head Portal | | | ⬜ | |
| TC7: SysMan → Staff Portal | | | ⬜ | |
| TC8: Other Roles | | | ⬜ | |
| TC9: Post-Login Redirect | | | ⬜ | |
| TC10: Multiple Roles | | | ⬜ | |

**Legend:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

## 📞 Support

**If all tests pass:** ✅ Security implementation is working correctly!

**If tests fail:** 
1. Check browser console for detailed error messages
2. Review SECURITY_IMPLEMENTATION.md
3. Verify role names match exactly in Frappe
4. Ensure Web Pages are published and configured correctly
5. Test with different browsers

---

**Security is critical! Don't skip testing.** 🔒

*All test cases should pass before deploying to production.*
