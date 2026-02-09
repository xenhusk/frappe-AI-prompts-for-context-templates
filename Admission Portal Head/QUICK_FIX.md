# Quick Fix - Staff Member Loading Issue

## The Problem
"Has Role" is a **Child DocType** (child table) that doesn't appear in the normal DocType list. This causes permission issues when querying it directly.

## The Solution
Use a **Server Script** that runs with elevated permissions.

---

## 5-Minute Setup

### 1. Create Server Script

1. **Open Frappe** → Search Bar → Type: `Server Script` → Click it
2. Click **+ New**
3. Fill in:

```
API Name: get_admission_staff
Script Type: API (from dropdown)
Allow Guest: ❌ (leave unchecked)
Enabled: ✅ (check this)
```

4. In the **Script** field, paste this:

```python
import frappe

users_with_role = frappe.get_all(
    'Has Role',
    filters={
        'role': 'Admission Staff',
        'parenttype': 'User'
    },
    fields=['parent'],
    distinct=True
)

if not users_with_role:
    frappe.response['message'] = []
else:
    user_names = [u['parent'] for u in users_with_role]
    
    staff_members = frappe.get_all(
        'User',
        filters={
            'name': ['in', user_names],
            'enabled': 1,
            'user_type': 'System User'
        },
        fields=['name', 'full_name', 'email'],
        order_by='full_name asc'
    )
    
    frappe.response['message'] = staff_members
```

5. Click **Save**

### 2. Update Your Web Page

- Copy the updated `script.js` to your Web Page's Scripting section
- Save

### 3. Test

1. Refresh portal: `Ctrl + Shift + R`
2. Open Console: `F12`
3. You should see:
   ```
   Fetching Admission Staff members via server script...
   Server script response: {message: Array(1)}
   ✓ Loaded 1 Admission Staff members
   ```

4. Click "Assign" button → Dropdown should show staff members! ✓

---

## Troubleshooting

### Error: "Method not found"
- Go back to Server Script
- Make sure:
  - API Name is exactly: `get_admission_staff` (no spaces)
  - Script Type is: `API`
  - Enabled is: ✅ checked
- Save again

### Still shows 0 staff members
- Check user has "Admission Staff" role:
  - Go to User List → Open user
  - Scroll to Roles section
  - Check ✅ "Admission Staff"
  - Make sure user is Enabled ✅
  - Save

---

## Why This Works

Server Scripts:
- ✅ Run with elevated permissions
- ✅ Can access child tables like "Has Role"
- ✅ Bypass role permission restrictions
- ✅ More efficient (1 API call instead of many)

---

## Expected Result

**Console Output:**
```
Fetching Admission Staff members via server script...
Server script response: Object
  message: Array(1)
    0: {name: "staff@example.com", full_name: "Staff Name", email: "staff@example.com"}
✓ Loaded 1 Admission Staff members
Loaded 1 staff member(s)
```

**Dropdown:**
- Shows staff members with their full names
- Selecting one and clicking "Assign" works

Done! 🎉
