# Server Script Setup Guide - Fix Staff Member Loading

## Problem
The Admission Head Portal shows "Loaded 0 Admission Staff members" because the client-side approach cannot efficiently query user roles.

## Solution
Create a Server Script that queries users with the "Admission Staff" role server-side.

---

## Step-by-Step Setup

### Step 1: Create the Server Script

1. **Open Frappe**
   - Log in to your Frappe instance
   - Make sure you're logged in as a user with "System Manager" role

2. **Navigate to Server Script**
   - Click the **Search Bar** (top of the page)
   - Type: `Server Script`
   - Click on **Server Script** from the dropdown

3. **Create New Server Script**
   - Click the **+ New** button (top right)

4. **Fill in the Server Script Form**

   Copy these exact values:

   **Field: API Name**
   ```
   get_admission_staff
   ```

   **Field: Script Type**
   - Select: `API` (from dropdown)

   **Field: Allow Guest**
   - Leave **UNCHECKED** ❌

   **Field: Enabled**
   - **CHECK** this box ✅

   **Field: Script**
   - Copy and paste the code below:

   ```python
   import frappe

   # Get all users with "Admission Staff" role
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
       # Extract user names
       user_names = [u['parent'] for u in users_with_role]
       
       # Get full user details for these users
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

5. **Save the Server Script**
   - Click the **Save** button (top right)
   - You should see a success message: "Saved"

---

### Step 2: Update the Web Page

1. **Navigate to Your Web Page**
   - Go to: **Website** → **Web Page**
   - Find and open your "Admission Portal Head" page

2. **Update the Script**
   - Go to the **Scripting** tab or section
   - Replace the entire content with the updated `script.js` from the repository
   - OR just update the `loadStaffMembers()` function with the new version

3. **Save the Web Page**
   - Click **Save**

---

### Step 3: Verify User Has "Admission Staff" Role

1. **Go to User List**
   - Search Bar → Type: `User`
   - Click **User** from dropdown

2. **Find Your Staff Member**
   - Open the user you want to see in the dropdown

3. **Check Roles Section**
   - Scroll down to the **Roles** section
   - Make sure "Admission Staff" role is checked ✅
   - Save if you made changes

---

### Step 4: Test the Portal

1. **Clear Browser Cache**
   - Press: `Ctrl + Shift + R` (Windows/Linux)
   - Or: `Cmd + Shift + R` (Mac)

2. **Open the Admission Head Portal**

3. **Open Browser Console**
   - Press `F12`
   - Go to the **Console** tab

4. **Check Console Output**
   - You should see:
     ```
     Fetching Admission Staff members via server script...
     Server script response: Object {message: Array(X)}
     ✓ Loaded X Admission Staff members
     ```

5. **Click Assign Button**
   - Click any application's "Assign" button
   - The dropdown should now show your staff members!

---

## Troubleshooting

### Error: "Method get_admission_staff not found"

**Cause:** Server Script not created or not enabled

**Fix:**
1. Go back to: Search Bar → Server Script
2. Find your `get_admission_staff` script
3. Open it
4. Make sure:
   - **Script Type** is set to `API`
   - **Enabled** checkbox is CHECKED ✅
   - **API Name** is exactly: `get_admission_staff` (no spaces, lowercase)
5. Save again

---

### Dropdown Still Empty

**Possible Causes:**

1. **No users have the role**
   - Go to User List
   - Open each user
   - Assign "Admission Staff" role
   - Save

2. **Users are disabled**
   - Check if the user's "Enabled" checkbox is checked
   - Only enabled users will appear

3. **Browser cache**
   - Hard refresh: `Ctrl + Shift + R`
   - Or clear browser cache completely

4. **Check console for errors**
   - Open Console (F12)
   - Look for red error messages
   - Share the error message if you need help

---

### Error: "Not Permitted"

**Cause:** Current user doesn't have permission to create Server Scripts

**Fix:**
- Ask your System Administrator to:
  - Create the Server Script for you, OR
  - Grant you "System Manager" role temporarily

---

### Console Shows Different Error

If you see any other error in the console:

1. **Take a screenshot** of the error
2. **Copy the full error message**
3. Check the Server Script is:
   - Saved
   - Enabled
   - Has no syntax errors

---

## Verification Checklist

Before asking for help, verify:

- [ ] Server Script is created
- [ ] Server Script API Name is: `get_admission_staff`
- [ ] Server Script Type is: `API`
- [ ] Server Script is Enabled ✅
- [ ] Server Script is Saved
- [ ] At least one user has "Admission Staff" role
- [ ] That user is Enabled
- [ ] Web Page has been updated with new script
- [ ] Browser cache has been cleared (Ctrl+Shift+R)
- [ ] Console is open (F12) to see logs

---

## Expected Result

After successful setup:

1. Console shows: `✓ Loaded X Admission Staff members`
2. Clicking "Assign" button opens modal
3. Dropdown shows all users with "Admission Staff" role
4. Selecting a user and clicking "Assign" works
5. Application is assigned successfully

---

## Additional Notes

**Security:** 
- The server script only returns users with "Admission Staff" role
- It respects Frappe's permission system
- Only System Users can access this API

**Performance:**
- This method is much faster than the old client-side approach
- It makes only 1 API call instead of N+1 calls
- Results are sorted alphabetically by name

**Maintenance:**
- When you add new staff members, just assign them the "Admission Staff" role
- They will automatically appear in the dropdown
- No code changes needed

---

## File Reference

- **Server Script Python Code:** `get_admission_staff_server_script.py`
- **Updated JavaScript:** `script.js` (loadStaffMembers function)
- **This Guide:** `SERVER_SCRIPT_SETUP_GUIDE.md`

---

## Need Help?

If you're still stuck:
1. Check the Console (F12) for errors
2. Take screenshots of:
   - The Server Script form (showing all fields)
   - The User's Roles section
   - The Console errors
3. Share the error messages

Good luck! 🚀
