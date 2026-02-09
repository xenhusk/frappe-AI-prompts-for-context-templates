# Emergency Fix - Get Portal Working NOW

## Option 1: Manual Staff List (Quick Fix - 2 minutes)

While we debug the server script, use this temporary workaround:

### Update script.js

At the top of `loadStaffMembers()` function (around line 665), add your actual staff members:

```javascript
const manualStaffList = [
    { name: 'john.doe@pccr.edu.ph', full_name: 'John Doe' },
    { name: 'jane.smith@pccr.edu.ph', full_name: 'Jane Smith' },
    // Add more staff as needed
];
```

**Steps:**
1. Open your Web Page in Frappe
2. Go to Scripting section
3. Find `loadStaffMembers()` function
4. Replace the empty array with your actual staff:

```javascript
const manualStaffList = [
    { name: 'ACTUAL_STAFF_EMAIL@pccr.edu.ph', full_name: 'ACTUAL NAME' },
];
```

5. Save
6. Refresh portal
7. **Dropdown will now work!** ✅

---

## Option 2: Debug Server Script (Find Root Cause)

### A. Check the NEW Error Log

1. Go to **Error Log** in Frappe
2. **Click Refresh** button (top right)
3. Click the **FIRST error** (top)
4. **What does it say NOW?**

Common new errors:

#### Error: "Has Role not found"
```
frappe.exceptions.DoesNotExistError: DocType Has Role not found
```
**Cause:** "Has Role" is a virtual/child doctype  
**Fix:** Use different query approach (see Option 3 below)

#### Error: "PermissionError"
```
frappe.exceptions.PermissionError: Not permitted
```
**Cause:** Even with elevated permissions, query is blocked  
**Fix:** Use server-side role check (see Option 3)

#### Error: "Syntax Error"
```
SyntaxError: invalid syntax
```
**Cause:** Copy-paste issue, wrong quotes, or indentation  
**Fix:** Retype the script manually instead of copy-paste

---

### B. Test Basic Server Script

Create this super simple test:

**New Server Script:**
- API Name: `test_basic`
- Script Type: `API`
- Script:

```python
import frappe
frappe.response['message'] = 'success'
```

**Test in console:**
```javascript
frappe.call({
    method: 'test_basic',
    callback: r => console.log('Result:', r.message)
});
```

**If this fails:** Server scripts are not working on your Frappe instance  
**If this works:** The issue is with the query

---

## Option 3: Alternative Server Script (Different Approach)

If querying "Has Role" fails, try using Frappe's role checking method:

**Replace your server script with:**

```python
import frappe

# Get all enabled system users
all_users = frappe.get_all(
    'User',
    filters={
        'enabled': 1,
        'user_type': 'System User'
    },
    fields=['name', 'full_name', 'email']
)

# Filter users who have Admission Staff role
staff_members = []
for user in all_users:
    roles = frappe.get_roles(user.name)
    if 'Admission Staff' in roles:
        staff_members.append(user)

frappe.response['message'] = staff_members
```

**This approach:**
- ✅ Doesn't query "Has Role" doctype directly
- ✅ Uses Frappe's built-in `get_roles()` function
- ✅ More compatible across Frappe versions

---

## Option 4: Use Frappe's Whitelisted Method

Instead of server script, call Frappe's built-in user list:

**Update JavaScript (in script.js):**

```javascript
function loadStaffMembers() {
    const select = document.getElementById('staffSelect');
    
    // Get all users, then filter client-side
    frappe.call({
        method: 'frappe.desk.search.search_link',
        args: {
            doctype: 'User',
            txt: '',
            filters: {
                enabled: 1,
                user_type: 'System User'
            }
        },
        callback: function(r) {
            if (r.results) {
                // Filter by role client-side
                r.results.forEach(user => {
                    // Check if user has the role
                    frappe.call({
                        method: 'frappe.core.doctype.user.user.has_role',
                        args: {
                            user: user.value,
                            role: 'Admission Staff'
                        },
                        async: false,
                        callback: function(role_check) {
                            if (role_check.message) {
                                const option = document.createElement('option');
                                option.value = user.value;
                                option.textContent = user.description;
                                select.appendChild(option);
                            }
                        }
                    });
                });
            }
        }
    });
}
```

---

## What to Share with Me

To help you further, please share:

1. **The NEW Error Log message** (after updating script)
2. **Screenshot of your server script** showing:
   - API Name field
   - Script Type
   - The script content (all lines visible)
3. **Result of the simple test** (test_basic script)
4. **Your Frappe version** (see bottom right of Frappe UI)

---

## Quick Decision Tree

```
Portal not loading staff?
    |
    ├─ Need it working NOW?
    |    └─ Use Manual List (Option 1) ← Fastest
    |
    ├─ Want to fix properly?
    |    ├─ Check Error Log → Share error message
    |    ├─ Try Alternative Script (Option 3)
    |    └─ Test if server scripts work at all
    |
    └─ Server scripts don't work on your instance?
         └─ Use Option 4 (client-side filtering)
```

---

## Temporary Workaround is Already Added

I've already updated your `script.js` with the manual list option.

**To use it right now:**

1. Open the script.js file
2. Find this line (around line 673):
   ```javascript
   const manualStaffList = [
   ```
3. Add your staff:
   ```javascript
   const manualStaffList = [
       { name: 'staff@pccr.edu.ph', full_name: 'Staff Name' },
   ];
   ```
4. Copy to your Web Page
5. Save and refresh
6. **Done!** Dropdown will work immediately ✅

---

Let me know:
1. What the NEW error log says
2. If you want to use the manual list for now
3. If you want to try the alternative approaches

We'll get this working! 🎯
