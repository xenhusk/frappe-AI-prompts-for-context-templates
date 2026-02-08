# Quick Setup Checklist - Admission Portal

Follow these steps in order to get your portal working.

---

## ⚡ 5-Minute Quick Start

### Step 1: Create DocType (5 min)
```
Desk → DocType List → New → "Student Application"
```

**Minimum Required Fields:**
- `naming_series` (Select) = "EDU-APP-.YYYY.-"
- `first_name` (Data) ✓ Required
- `last_name` (Data) ✓ Required
- `program` (Link → Program) ✓ Required
- `application_status` (Select) = Pending, Approved, Rejected
- `assigned_staff` (Link → User)
- `student_email_id` (Data)

**Save DocType**

---

### Step 2: Create Roles (1 min)
```
Desk → Role List → New
```

1. **Role Name**: `Admission Head` → Save
2. **Role Name**: `Admission Staff` → Save

---

### Step 3: Set Permissions (2 min)
```
Student Application DocType → Permissions Tab
```

**For "Admission Head":**
- Read: ✓
- Write: ✓
- Create: ✓
- Delete: ✓
- Apply User Permissions: ☐ (UNCHECKED)

**For "Admission Staff":**
- Read: ✓
- Write: ✓
- Apply User Permissions: ✓ (CHECKED)
- **If User Field**: `assigned_staff`

**Save Permissions**

---

### Step 4: Create Test Users (3 min)

**Head User:**
```
Email: head@test.com
Role: Admission Head
```

**Staff User:**
```
Email: staff@test.com
Role: Admission Staff
```

---

### Step 5: Create Web Page (2 min)
```
Desk → Web Page List → New
```

| Field | Value |
|-------|-------|
| Title | Admission Portal |
| Route | admission-portal |
| Published | ✓ |

**Paste Content:**
- HTML field ← `index.html` (content only, no `<html>` tags)
- JavaScript field ← `script.js`
- CSS field ← `style.css`

**Save and Publish**

---

### Step 6: Add Test Data (2 min)

Create 3-5 test applications:
```
Student Application → New
```

Fill in:
- Name fields
- Program (create if needed: BS Criminology)
- Status (Pending)
- Email

Some applications: Leave `assigned_staff` empty
Some applications: Assign to staff@test.com

---

### Step 7: Test (2 min)

**Login as Head:**
- Visit: `/admission-portal`
- Should see ALL applications
- Can assign applications

**Login as Staff:**
- Visit: `/admission-portal`
- Should see ONLY assigned applications
- Cannot assign

---

## 🔍 Troubleshooting

### No applications showing?
```sql
-- In bench console:
frappe.db.sql("SELECT name, first_name, assigned_staff FROM `tabStudent Application`")
```

### Staff sees all applications?
```
Fix: Student Application → Permissions → Admission Staff
Set "Apply User Permissions" = ✓
Set "If User" = assigned_staff
Save → Clear Cache
```

### "Frappe is not defined"?
```
Fix: Make sure you're accessing via Frappe route
URL: https://your-site.com/admission-portal
NOT: file:///path/to/index.html
```

### CSS not loading?
```
Fix: Add !important to body styles in CSS
Or: Upload style.css to /public/css/ and link it
```

---

## 📝 Minimum Fields Reference

**Student Application DocType - Absolute Minimum:**

```
1. naming_series (Select) = "EDU-APP-.YYYY.-"
2. first_name (Data, Required)
3. last_name (Data, Required)
4. program (Link → Program, Required)
5. application_status (Select) = Pending|Approved|Rejected
6. assigned_staff (Link → User)
7. student_email_id (Data)
```

**That's it! With these 7 fields, the portal will work.**

Add more fields later as needed (address, phone, etc.)

---

## 🚀 One-Command Testing

After setup, test with bench console:

```python
# Create test application
frappe.get_doc({
    "doctype": "Student Application",
    "naming_series": "EDU-APP-.YYYY.-",
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "program": "BS Criminology",
    "application_status": "Pending",
    "student_email_id": "juan@test.com",
    "assigned_staff": "staff@test.com"
}).insert()

frappe.db.commit()
```

---

## ✅ Quick Verification

Check if everything is set up:

```python
# In bench console:

# 1. Check DocType exists
frappe.db.exists("DocType", "Student Application")
# Should return: True

# 2. Check roles exist
frappe.db.exists("Role", "Admission Head")
frappe.db.exists("Role", "Admission Staff")
# Should return: True for both

# 3. Check applications exist
frappe.db.count("Student Application")
# Should return: > 0

# 4. Check permissions
frappe.get_doc("DocType", "Student Application").permissions
# Should show permissions for both roles
```

---

## 🎯 Critical Settings Summary

| Item | Required Setting |
|------|------------------|
| **DocType Name** | Exactly "Student Application" |
| **assigned_staff field** | Must be Link to User |
| **Head Permission** | Apply User Permissions = UNCHECKED |
| **Staff Permission** | Apply User Permissions = CHECKED, If User = assigned_staff |
| **Web Page Route** | /admission-portal |
| **Web Page Published** | Must be checked |

---

## 📞 Still Not Working?

### Check Browser Console (F12):
Look for errors in Console tab

### Check Frappe Error Log:
```bash
tail -f ~/frappe-bench/logs/web.log
```

### Clear Everything:
```bash
bench clear-cache
bench clear-website-cache
bench restart
```

### Verify API Access:
Open browser console on `/admission-portal` and run:
```javascript
frappe.call({
    method: 'frappe.client.get_list',
    args: {
        doctype: 'Student Application',
        fields: ['name', 'first_name']
    },
    callback: (r) => console.log(r.message)
});
```

Should return list of applications.

---

**Setup Time: ~15 minutes**  
**Done? Visit: `/admission-portal`**

🎉 **Welcome to your Admission Portal!**
