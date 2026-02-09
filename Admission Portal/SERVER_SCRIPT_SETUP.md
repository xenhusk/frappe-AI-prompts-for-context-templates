# Server Script Setup - Role-Based Staff Filtering

## Overview
Since you don't have access to the codebase, we'll use Frappe's **Server Script** feature (accessible through the UI) to create a custom API that filters users by the "Admission Staff" role.

## Step-by-Step Setup

### Step 1: Create Server Script

1. **Navigate to Server Script**
   - Click on the **Search bar** (top left)
   - Type: `Server Script`
   - Click on **Server Script** from the results

2. **Create New Server Script**
   - Click the **New** button
   - You'll see a form with several fields

3. **Fill in the Form**

   **API Name:**
   ```
   get_admission_staff
   ```

   **Script Type:** 
   - Select: `API`

   **Allow Guest:**
   - Leave **unchecked** (default)

   **Enabled:**
   - Check this box ✅

   **Script:** (Copy this entire code block)
   ```python
   import frappe

   # Get all users with Admission Staff role
   users = frappe.get_all(
       'Has Role',
       filters={
           'role': 'Admission Staff',
           'parenttype': 'User'
       },
       fields=['parent']
   )

   if not users:
       frappe.response['message'] = []
   else:
       user_names = list(set([u['parent'] for u in users]))
       
       staff_members = frappe.get_all(
           'User',
           filters={
               'name': ['in', user_names],
               'enabled': 1
           },
           fields=['name', 'full_name', 'email'],
           order_by='full_name'
       )
       
       frappe.response['message'] = staff_members
   ```

4. **Save**
   - Click the **Save** button
   - You should see a success message

### Step 2: Update Portal Script

1. **Go to your Web Page**
   - Navigate to: Website → Web Page → Your Admission Portal page

2. **Update Scripting Tab**
   - Copy the updated `script.js` content to the **Scripting** field
   - The script now calls: `method: 'get_admission_staff'`

3. **Save** the Web Page

### Step 3: Test

1. **Refresh the portal page** (Ctrl+Shift+R)
2. Click the **"Assign"** button
3. Check the **Staff Member** dropdown
4. It should show **only users with "Admission Staff" role**

## Verification

### Check Console
Open browser console (F12) and look for:
```
Loaded X Admission Staff members
```

### If Dropdown is Empty
Check console for:
```
No Admission Staff members found
```

**Solution:** You need to assign the "Admission Staff" role to users:
1. Go to: User List
2. Open a user
3. Scroll to "Roles" section
4. Add "Admission Staff" role
5. Save

## Troubleshooting

### Error: "Method not found"
**Cause:** Server Script not created or not enabled

**Fix:**
1. Go to Server Script list
2. Find your `get_admission_staff` script
3. Open it
4. Make sure **Enabled** is checked ✅
5. Save

### Error: "Not Permitted"
**Cause:** Your user doesn't have permission to create Server Scripts

**Fix:** Ask your system administrator to:
- Grant you "System Manager" role, OR
- Create the Server Script for you

### Error: "frappe.response is not defined"
**Cause:** Wrong Script Type selected

**Fix:**
1. Open the Server Script
2. Change **Script Type** to `API`
3. Save

### Dropdown Shows All Users Instead of Just Staff
**Cause:** Server Script not working, falling back to default

**Fix:**
1. Check browser console for errors
2. Verify Server Script is enabled
3. Check the method name in script.js matches: `get_admission_staff`

## Alternative: Manual User List (Temporary)

If you can't create Server Scripts, you can temporarily hardcode staff emails:

```javascript
function loadStaffMembers() {
    // TEMPORARY: Hardcoded staff list
    const admissionStaff = [
        { name: 'staff1@pccr.edu.ph', full_name: 'John Doe' },
        { name: 'staff2@pccr.edu.ph', full_name: 'Jane Smith' },
        { name: 'staff3@pccr.edu.ph', full_name: 'Bob Johnson' }
    ];
    
    const select = document.getElementById('staffSelect');
    
    admissionStaff.forEach(user => {
        const option = document.createElement('option');
        option.value = user.name;
        option.textContent = user.full_name;
        select.appendChild(option);
    });
}
```

**Note:** This requires manual updates when staff changes.

## Screenshots Location Reference

When creating the Server Script, the form should look like this:

```
┌─────────────────────────────────────┐
│ Server Script                       │
├─────────────────────────────────────┤
│ API Name: get_admission_staff       │
│ Script Type: API                    │
│ □ Allow Guest                       │
│ ☑ Enabled                           │
│                                     │
│ Script:                             │
│ ┌─────────────────────────────────┐ │
│ │ import frappe                   │ │
│ │                                 │ │
│ │ users = frappe.get_all(         │ │
│ │     'Has Role',                 │ │
│ │     ...                         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Save] [Cancel]                     │
└─────────────────────────────────────┘
```

## Benefits of This Approach

✅ **No code access needed** - Everything done through Frappe UI
✅ **Role-based filtering** - Only shows users with "Admission Staff" role
✅ **Automatic updates** - When roles change, dropdown updates automatically
✅ **Secure** - Uses Frappe's permission system
✅ **Easy to maintain** - Edit through UI anytime

## Next Steps

After setup:
1. Assign "Admission Staff" role to appropriate users
2. Test the assignment functionality
3. Verify assignments are saved correctly in Student Applicant DocType

## Need Help?

If you encounter issues:
1. Check the browser console for errors (F12)
2. Verify Server Script is saved and enabled
3. Confirm users have "Admission Staff" role assigned
4. Check that the Web Page has the updated script.js
