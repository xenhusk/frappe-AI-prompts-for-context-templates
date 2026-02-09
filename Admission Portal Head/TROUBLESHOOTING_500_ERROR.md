# Troubleshooting 500 Internal Server Error

## What 500 Error Means
The server script **exists** but is **encountering an error** when it runs.

---

## Step 1: Check Error Log (CRITICAL!)

**This will tell us exactly what's wrong:**

1. **Open Frappe**
2. **Search Bar** → Type: `Error Log`
3. **Click on the FIRST error** (most recent, at the top)
4. **Look for the error message**

### What to Look For:

#### If you see: `SyntaxError`
- There's a typo in the Python code
- Check for missing colons, parentheses, or indentation

#### If you see: `AttributeError: 'NoneType'`
- A field or variable is None/empty
- The query might not be returning data

#### If you see: `PermissionError`
- Even server scripts need the **Script Manager** role
- Solution: See Step 4 below

#### If you see: `ImportError` or `Module not found`
- The code is trying to import something that doesn't exist
- Use the simpler version of the script

**→ Copy the FULL error message and share it with me**

---

## Step 2: Verify Server Script Exists

1. **Go to Server Script List:**
   - Search Bar → `Server Script`
   - Look for: `get_admission_staff`

2. **If it DOESN'T exist:**
   - You need to create it first
   - See: `QUICK_FIX.md` for instructions

3. **If it EXISTS, open it and verify:**

```
✓ API Name: get_admission_staff (exact spelling, lowercase, no spaces)
✓ Script Type: API (not Python, not Event, must be API)
✓ Enabled: ✅ (checked)
✗ Allow Guest: ❌ (unchecked)
```

---

## Step 3: Check Indentation (Python is Sensitive!)

Open your server script and make sure:
- **NO spaces before** `import frappe`
- All code blocks are properly indented with **4 spaces** (not tabs)
- No mixing of tabs and spaces

**Example of CORRECT formatting:**

```python
import frappe

users_with_role = frappe.get_all(
    'Has Role',
    filters={
        'role': 'Admission Staff',
        'parenttype': 'User'
    },
    fields=['parent']
)
```

**Example of WRONG formatting:**

```python
  import frappe  ← WRONG! Extra spaces before import

users_with_role = frappe.get_all(
'Has Role',  ← WRONG! No indentation
filters={
'role': 'Admission Staff',  ← WRONG! Inconsistent indentation
```

---

## Step 4: Check User Role Permissions

Server scripts require the user to have **Script Manager** role:

1. **Go to User List**
2. **Open YOUR user** (the one logged in as Admission Head)
3. **Scroll to Roles section**
4. **Check if you have:**
   - ✅ System Manager (or)
   - ✅ Script Manager

5. **If missing, add:**
   - Either ask admin to add it
   - Or log in as Administrator and add it

---

## Step 5: Test with Simple Script First

Let's verify server scripts work at all:

### Create a Test Server Script:

1. **New Server Script:**
   - API Name: `test_simple`
   - Script Type: `API`
   - Enabled: ✅

2. **Script content:**

```python
import frappe

frappe.response['message'] = [
    {
        'name': 'test@test.com',
        'full_name': 'Test User',
        'email': 'test@test.com'
    }
]
```

3. **Save**

4. **Test in browser console:**

```javascript
frappe.call({
    method: 'test_simple',
    callback: function(r) {
        console.log('Test result:', r);
    }
});
```

### Results:

- **If this works:** The issue is with the query logic in the original script
- **If this also fails:** Server scripts are not configured properly on your Frappe instance

---

## Step 6: Use Diagnostic Version

Replace your server script content with the diagnostic version from `get_admission_staff_v2.py`:

This version:
- ✅ Logs every step to Error Log
- ✅ Has try-catch error handling
- ✅ Won't crash even if there's an error
- ✅ Returns empty list instead of 500 error

After saving and testing:
1. Go to Error Log
2. Look for entries with title "Debug" or "Server Script Error"
3. Read the log messages to see where it's failing

---

## Step 7: Alternative Solution (If Server Scripts Don't Work)

If server scripts continue to fail, we can use a **Frappe API Method** instead:

### Option A: Use frappe.get_roles() Method

```javascript
frappe.call({
    method: 'frappe.desk.reportview.get',
    args: {
        doctype: 'User',
        fields: ['name', 'full_name', 'email'],
        filters: [['User', 'enabled', '=', 1]],
    },
    callback: function(r) {
        // Then filter by role client-side
    }
});
```

### Option B: Hardcode Staff List (Temporary)

As a quick workaround while debugging:

```javascript
function loadStaffMembers() {
    const select = document.getElementById('staffSelect');
    
    // TEMPORARY: Manual staff list
    const staffList = [
        { name: 'staff1@pccr.edu.ph', full_name: 'Staff Member 1' },
        { name: 'staff2@pccr.edu.ph', full_name: 'Staff Member 2' }
    ];
    
    staffList.forEach(user => {
        const option = document.createElement('option');
        option.value = user.name;
        option.textContent = user.full_name;
        select.appendChild(option);
    });
}
```

---

## Common Issues and Solutions

### Issue: "distinct=True" not supported
**Error:** `TypeError: get_all() got an unexpected keyword argument 'distinct'`

**Fix:** Remove the `distinct=True` line:

```python
users_with_role = frappe.get_all(
    'Has Role',
    filters={
        'role': 'Admission Staff',
        'parenttype': 'User'
    },
    fields=['parent']
    # Remove: distinct=True
)
```

---

### Issue: Role name mismatch
**Error:** Returns empty list even though users have the role

**Fix:** Check exact role name:
1. Go to Role List
2. Find "Admission Staff"
3. Open it
4. Check the exact name (case-sensitive!)
5. Update script to match exactly

---

### Issue: Server Scripts Not Enabled
**Error:** 500 error with no details in Error Log

**Fix:**
1. Check if your Frappe site has Server Scripts enabled
2. Ask admin to enable in site config
3. Or use alternative approach without server scripts

---

## What I Need From You

To help you fix this, please share:

1. **The full error message from Error Log** (most important!)
2. **Screenshot of your Server Script form** showing:
   - API Name field
   - Script Type dropdown
   - Enabled checkbox
   - The script content
3. **Your user's roles** (do you have System Manager or Script Manager?)

---

## Quick Decision Tree

```
500 Error
   |
   ├─ Check Error Log
   |    |
   |    ├─ Shows Python error → Fix syntax/indentation
   |    ├─ Shows Permission error → Add Script Manager role
   |    └─ No errors shown → Server scripts might be disabled
   |
   ├─ Server Script exists?
   |    ├─ Yes → Check configuration (API name, type, enabled)
   |    └─ No → Create it first
   |
   └─ Test simple script works?
        ├─ Yes → Issue is with the query logic
        └─ No → Server scripts not configured properly
```

---

Once you share the Error Log message, I can give you the exact fix! 🎯
