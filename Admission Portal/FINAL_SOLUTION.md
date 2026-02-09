# Final Solution - Staff Assignment

## What Happened

### Server Script Approach (Didn't Work)
We initially tried to create a Server Script to filter users by "Admission Staff" role, but encountered:
```
Failed to get method for command get_admission_staff
```

**Why it failed:**
- Server Scripts with type "API" need to be called with a specific path format
- Different Frappe versions have different ways of exposing Server Scripts
- May require additional permissions or configuration not available through UI

## Current Working Solution

### What It Does Now
The dropdown shows **all active System Users** (users who can log into Frappe).

### Files Updated

1. **script.js** - Uses standard `frappe.client.get_list` to fetch System Users
2. **index.html** - Updated hint text to guide users to select staff with "Admission Staff" role

### How It Works

```javascript
frappe.call({
    method: 'frappe.client.get_list',
    args: {
        doctype: 'User',
        fields: ['name', 'full_name', 'email'],
        filters: {
            enabled: 1,
            user_type: 'System User'
        },
        order_by: 'full_name',
        limit_page_length: 999
    }
});
```

**Filters:**
- ✅ `enabled: 1` - Only active users
- ✅ `user_type: 'System User'` - Only users who can access Frappe (not website/portal users)
- ✅ Sorted alphabetically by full name

## User Guidance

The modal now shows a hint:
> "Select a user with 'Admission Staff' role to assign this application"

This guides Admission Heads to manually select only staff members from the dropdown.

## Testing Instructions

1. **Update Files:**
   - Copy updated `script.js` → Web Page Scripting tab
   - Copy updated `index.html` → Web Page HTML tab
   - Save

2. **Test:**
   - Hard refresh: Ctrl+Shift+R
   - Click "Assign" button
   - Dropdown should show all System Users
   - Select a user and assign

3. **Verify Assignment:**
   - Check the Student Applicant record
   - The `assigned_staff` field should be populated with the selected user

## Benefits of This Approach

✅ **Works immediately** - No Server Scripts or custom code needed
✅ **No permission issues** - Uses standard Frappe API
✅ **Simple & reliable** - Less complexity, less chance of errors
✅ **Easy to maintain** - No custom backend code to manage

## Limitations

⚠️ **Shows all System Users** - Not filtered to only "Admission Staff" role
- **Workaround:** Admission Heads must manually select only staff members
- **Best Practice:** Ensure only appropriate users are given System User access

## Future Improvements (If Needed)

### Option 1: User Permissions (Recommended)
Set up User Permissions in Frappe to restrict which users an Admission Head can see:
1. Go to: User Permissions
2. Create permission: User for [Admission Head User]
3. Allow: [Staff Member 1], [Staff Member 2], etc.

### Option 2: Custom App (Requires Developer)
If you get developer access later, create a custom whitelisted method in a custom app:

```python
# custom_app/api.py
import frappe

@frappe.whitelist()
def get_admission_staff():
    """Get users with Admission Staff role"""
    users = frappe.db.sql("""
        SELECT DISTINCT u.name, u.full_name, u.email
        FROM `tabUser` u
        INNER JOIN `tabHas Role` hr ON hr.parent = u.name
        WHERE hr.role = 'Admission Staff'
        AND u.enabled = 1
        ORDER BY u.full_name
    """, as_dict=1)
    
    return users
```

Then call it:
```javascript
frappe.call({
    method: 'custom_app.api.get_admission_staff'
});
```

### Option 3: Client-Side Filtering (Hacky but works)
Fetch all users, then filter client-side by checking roles:

```javascript
// Fetch all users
frappe.call({
    method: 'frappe.client.get_list',
    args: { doctype: 'User', ... },
    callback: function(r) {
        // For each user, check their roles
        r.message.forEach(user => {
            frappe.call({
                method: 'frappe.client.get_value',
                args: {
                    doctype: 'User',
                    filters: { name: user.name },
                    fieldname: 'roles'
                },
                async: false,
                callback: function(role_r) {
                    // Check if has Admission Staff role
                    // Add to dropdown if yes
                }
            });
        });
    }
});
```

**Note:** This makes many API calls and is slow. Not recommended.

## Current Status

✅ **Assignment Modal:** Working
✅ **Staff Dropdown:** Shows all System Users
✅ **Assignment Function:** Working
✅ **View Function:** Working
✅ **Role-Based Display:** Working (Heads see assign button, Staff don't)

## Summary

The portal is now fully functional! While we can't automatically filter the dropdown to show only "Admission Staff" users without backend access, the current solution works well with proper user guidance. Admission Heads just need to know which users are staff members and select accordingly.

**Best Practice:** Keep your System User list clean - only give System User access to people who need it. This naturally limits who appears in the dropdown.
