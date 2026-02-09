# Permission Fix Guide - 500 Error Resolution

## The Error
```
POST https://abakada-coco.s.frappe.cloud/ 500 (Internal Server Error)
```

This means the server is rejecting the request, usually due to missing permissions.

---

## Solution: Grant Permissions to "Admission Head" Role

### Step 1: Check Error Log (Important!)

Before fixing, let's see the exact error:

1. **Open Frappe**
2. **Search Bar** → Type: `Error Log`
3. **Click** on the first error (most recent)
4. **Read** the error message - it will tell you exactly what's wrong

Common error messages:
- `PermissionError: User not permitted to access DocType`
- `Method not found`
- `Role not found`

---

### Step 2: Grant "Has Role" Read Permission

The "Admission Head" role needs permission to read the "Has Role" doctype.

1. **Go to Role Permission Manager**
   - Search Bar → Type: `Role Permission Manager`
   - Click on it

2. **Set Document Type**
   - In the "Document Type" field
   - Type: `Has Role`
   - Press Enter

3. **Add Permission for "Admission Head"**
   - Click: **+ Add A New Rule**
   - **Role**: Select `Admission Head`
   - **Level**: `0`
   - **Permissions**: Check **ONLY** these boxes:
     - ✅ **Select** (Read)
     - ✅ **Read**
   - Click: **Update**

4. **Verify**
   - You should now see a row for "Admission Head" with Select and Read permissions

---

### Step 3: Grant "User" Read Permission

The "Admission Head" role also needs permission to read the "User" doctype.

1. **Still in Role Permission Manager**
   - Change "Document Type" field to: `User`
   - Press Enter

2. **Check if "Admission Head" already has permissions**
   - Look for a row with "Admission Head"
   - If it exists and has "Read" checked, you're good
   - If not, continue:

3. **Add Permission for "Admission Head"**
   - Click: **+ Add A New Rule**
   - **Role**: Select `Admission Head`
   - **Level**: `0`
   - **Permissions**: Check these boxes:
     - ✅ **Select** (Read)
     - ✅ **Read**
   - Click: **Update**

---

### Step 4: Test the Portal Again

1. **Refresh the Admission Head Portal**
   - Press: `Ctrl + Shift + R` (hard refresh)

2. **Open Browser Console**
   - Press: `F12`
   - Go to **Console** tab

3. **Check the output**
   - You should now see:
     ```
     Fetching Admission Staff members...
     Has Role response: {message: Array(X)}
     Found users with Admission Staff role: ["user@example.com"]
     User details response: {message: Array(X)}
     ✓ Loaded X Admission Staff members
     ```

4. **Click the Assign Button**
   - The dropdown should now show staff members!

---

## Troubleshooting

### Still Getting 500 Error?

**Check Error Log Again:**
1. Go to Error Log
2. Read the new error message
3. Share it with me for further help

**Common issues:**
- User doctype permission missing
- Has Role doctype permission missing
- Role name mismatch (check exact spelling)

---

### Still Shows 0 Staff Members?

**Check if users actually have the role:**

1. Go to **User List**
2. Open a user
3. Scroll to **Roles** section
4. Make sure "Admission Staff" is checked ✅
5. Make sure user is **Enabled** ✅
6. Save

---

### Getting Permission Error in Console?

If you see:
```
PermissionError: User not permitted to access DocType Has Role
```

**Fix:**
1. Go back to Role Permission Manager
2. Document Type: `Has Role`
3. Add "Admission Head" with Read permission

---

### Alternative: Use Server Script (If Permissions Don't Work)

If you can't grant the necessary permissions, use the Server Script approach:

1. Create the server script (see `SERVER_SCRIPT_SETUP_GUIDE.md`)
2. Server scripts run with elevated permissions
3. Revert the `script.js` to call `method: 'get_admission_staff'`

---

## Summary of Required Permissions

For the current approach to work, "Admission Head" role needs:

| DocType | Permissions Required |
|---------|---------------------|
| Has Role | Select, Read |
| User | Select, Read |
| Student Applicant | Select, Read, Write, Create |

---

## Visual Guide

### Has Role Permission Should Look Like:

```
Document Type: Has Role

┌─────────────────┬──────┬───────┬────────────────────┐
│ Role            │ Level│ Perms │ Actions            │
├─────────────────┼──────┼───────┼────────────────────┤
│ Admission Head  │   0  │ ☑ Select                  │
│                 │      │ ☑ Read                    │
│                 │      │                            │
└─────────────────┴──────┴───────┴────────────────────┘
```

### User Permission Should Look Like:

```
Document Type: User

┌─────────────────┬──────┬───────┬────────────────────┐
│ Role            │ Level│ Perms │ Actions            │
├─────────────────┼──────┼───────┼────────────────────┤
│ Admission Head  │   0  │ ☑ Select                  │
│                 │      │ ☑ Read                    │
│                 │      │                            │
└─────────────────┴──────┴───────┴────────────────────┘
```

---

## Important Notes

**Security:**
- Only grant Read permissions, not Write/Create/Delete
- This keeps user data secure
- Staff dropdown only shows users with "Admission Staff" role

**Performance:**
- This approach makes 2 API calls instead of 1
- Still much better than the old N+1 approach
- Fast enough for most use cases

---

## Next Steps After Fix

Once working:
1. Test assigning applications to staff
2. Verify assignments are saved correctly
3. Check that staff can see their assigned applications in the Staff Portal

---

## Need More Help?

If still not working:
1. Take screenshot of Error Log
2. Take screenshot of Role Permission Manager for "Has Role"
3. Take screenshot of Console output
4. Share all three screenshots

Good luck! 🚀
