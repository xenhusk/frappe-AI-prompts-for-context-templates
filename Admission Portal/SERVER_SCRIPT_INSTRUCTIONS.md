# Server Script Setup for Role Detection

## Problem
The Admission Portal needs to detect user roles to enforce RBAC, but web pages don't have access to `frappe.boot.user.roles` or `frappe.user_roles`.

## Solution
Create a custom Server Script that provides a whitelisted API endpoint to safely retrieve the current user's roles.

---

## Step-by-Step Instructions

### 1. Log in to Frappe as Administrator

### 2. Navigate to Server Script
- Go to: **Setup > Automation > Server Script**
- Click: **New**

### 3. Fill in Server Script Details

| Field | Value |
|-------|-------|
| **Script Name** | Get User Roles for Admission Portal |
| **Script Type** | API |
| **API Method** | `admission_portal.get_user_roles` |
| **Allow Guest** | ❌ No (leave unchecked) |
| **Enabled** | ✅ Yes (checked) |

### 4. Copy and Paste the Script

**IMPORTANT:** For API-type Server Scripts, set `frappe.response['message']` to return data.

```python
import frappe

# Get the current user's roles
user = frappe.session.user

if user == "Guest":
    frappe.response['message'] = []
else:
    frappe.response['message'] = frappe.get_roles(user)
```

### 5. Save the Server Script
- Click **Save**
- The script will now be available at the API endpoint: `admission_portal.get_user_roles`

### 6. Test the Portal
- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Log in as **Admission Head**
- Open browser console (F12)
- You should see: `✓ Roles fetched from custom API: ["Admission Head", ...]`

---

## Verification

After creating the server script, the console should show:

✅ **Success:**
```
✓ Roles fetched from custom API: ["Admission Head", "System Manager", ...]
✓ Using frappe.user_roles
User roles: ["Admission Head", "System Manager", ...]
Is Head: true
```

❌ **If still failing:**
```
✗ Error calling custom API: [error details]
⚠ Please create the Server Script (see instructions in console)
```

---

## Troubleshooting

### Error: "Method not found"
- Verify the API Method is exactly: `admission_portal.get_user_roles`
- Ensure the Server Script is **Enabled**
- Try saving the Server Script again

### Error: "Permission denied"
- Verify **Allow Guest** is unchecked
- Ensure the user is logged in (not Guest)

### Still showing "Is Head: false"
- Check the User has "Admission Head" role in: **User > Roles tab**
- Clear browser cache completely
- Log out and log back in

---

## Alternative: Quick Test Method

If you want to test without creating a Server Script, you can temporarily use this workaround:

1. Open the browser console on the Admission Portal page
2. Run this command:
```javascript
frappe.user_roles = ["Admission Head", "System Manager"];
location.reload();
```

This will manually set the roles for testing purposes only (resets on page reload).

---

## Security Notes

✅ **Safe:** This Server Script only returns the logged-in user's own roles  
✅ **Safe:** Uses Frappe's built-in `frappe.get_roles()` method  
✅ **Safe:** Requires user authentication (not available to Guest users)  
✅ **Safe:** Does not expose other users' data  

---

## Questions or Issues?

If you encounter any issues:
1. Check the Frappe error logs: **Tools > Error Log**
2. Verify the Server Script syntax
3. Ensure Frappe permissions are correctly configured
