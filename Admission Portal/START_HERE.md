# 🚀 START HERE - Admission Portal Setup

Quick guide to get your Admission Portal working with Frappe Framework.

---

## 📚 Which Guide to Follow?

| If you want... | Read this file |
|---------------|---------------|
| **Quick 15-min setup** | `QUICK_SETUP.md` ⚡ |
| **Complete detailed guide** | `FRAPPE_SETUP_GUIDE.md` 📖 |
| **Understand permissions** | `PERMISSION_MATRIX.md` 🔐 |
| **General info & features** | `README.md` ℹ️ |

---

## ⚡ Ultra-Quick Summary

### What You Need to Do:

1. **Create DocType** called "Student Application" with these fields:
   - `first_name`, `last_name`, `program`
   - `application_status`, `assigned_staff`

2. **Create 2 Roles**:
   - "Admission Head" (sees all)
   - "Admission Staff" (sees only assigned)

3. **Set Permissions**:
   - Head: Apply User Permissions = ☐ NO
   - Staff: Apply User Permissions = ☑ YES (if user = assigned_staff)

4. **Create Web Page**:
   - Route: `/admission-portal`
   - Paste: HTML, JS, CSS from files

5. **Test**: Login as Head and Staff to verify filtering works

**Time Required**: 15-20 minutes

---

## 🎯 Critical Settings

These MUST be correct or the portal won't work:

### 1. DocType Name (Exact Match Required)
```
✅ Correct: "Student Application"
❌ Wrong: "Student Applications" (plural)
❌ Wrong: "student application" (lowercase)
```

The JavaScript looks for exact name: `'Student Application'`

### 2. Field Names (Exact Match Required)

| JavaScript Variable | DocType Field Name | Type |
|---------------------|-------------------|------|
| `first_name` | first_name | Data |
| `last_name` | last_name | Data |
| `program` | program | Link → Program |
| `application_status` | application_status | Select |
| `assigned_staff` | assigned_staff | Link → User |
| `student_email_id` | student_email_id | Data |

### 3. Role Names (Exact Match Required)
```javascript
// JavaScript checks for exact role name:
frappe.user.has_role("Admission Head")

✅ Correct: "Admission Head"
❌ Wrong: "admission head" (lowercase)
❌ Wrong: "Head" (short)
```

### 4. Permission Settings

**For Admission Head:**
```
Apply User Permissions: NO (unchecked)
→ This allows them to see ALL records
```

**For Admission Staff:**
```
Apply User Permissions: YES (checked)
If User Field: assigned_staff
→ This filters to only assigned records
```

---

## 🔧 How the Portal Works

### Data Flow:

```
1. User visits /admission-portal
2. JavaScript checks: frappe.user.has_role("Admission Head")
3. If Head: filters = {} (get all)
   If Staff: filters = {assigned_staff: user}
4. Call: frappe.client.get_list('Student Application', filters)
5. Display results in table
```

### Role-Based Features:

| Feature | Admission Head | Admission Staff |
|---------|---------------|-----------------|
| See all applications | ✅ | ❌ |
| See assigned only | ✅ | ✅ |
| Assign to staff | ✅ | ❌ |
| Search & filter | ✅ | ✅ |
| View application | ✅ | ✅ |
| Edit application | ✅ | ✅ (assigned only) |

---

## 🧪 Testing Your Setup

### Quick Test Script

Run this in Frappe console (`bench console`):

```python
# 1. Create test application
doc = frappe.get_doc({
    "doctype": "Student Application",
    "naming_series": "EDU-APP-.YYYY.-",
    "first_name": "Test",
    "last_name": "Student",
    "program": "BS Criminology",
    "application_status": "Pending",
    "student_email_id": "test@example.com",
    "assigned_staff": "staff@test.com"
})
doc.insert()
print(f"Created: {doc.name}")

# 2. Test as Head (should see all)
frappe.set_user("head@test.com")
apps = frappe.get_list("Student Application", fields=["name"])
print(f"Head sees: {len(apps)} applications")

# 3. Test as Staff (should see only assigned)
frappe.set_user("staff@test.com")
apps = frappe.get_list("Student Application", 
                       filters={"assigned_staff": "staff@test.com"},
                       fields=["name"])
print(f"Staff sees: {len(apps)} applications")

# 4. Cleanup
frappe.set_user("Administrator")
```

### Expected Results:

```
Created: EDU-APP-2024-001
Head sees: 1 applications  ✅
Staff sees: 1 applications ✅
```

---

## ❌ Common Mistakes

### Mistake 1: Wrong DocType Name
```javascript
// JavaScript says:
doctype: 'Student Application'

// But you created:
"Student Applications" (plural) ❌

// Error: DocType Student Application not found
```

**Fix**: Rename DocType or change all JavaScript references.

### Mistake 2: Missing Field
```javascript
// JavaScript tries to access:
app.assigned_staff

// But field doesn't exist in DocType ❌

// Error: undefined
```

**Fix**: Add the field to DocType.

### Mistake 3: Wrong Permission Setting
```
Staff Role:
Apply User Permissions: NO ❌

Result: Staff sees ALL applications (security issue!)
```

**Fix**: Set "Apply User Permissions" = YES for Staff.

### Mistake 4: Forgot to Publish Web Page
```
Web Page created but:
Published: ☐ (unchecked) ❌

Result: 404 Not Found
```

**Fix**: Check "Published" checkbox and save.

---

## 🔍 Debugging Checklist

If portal not working, check these in order:

### 1. Check Browser Console (F12)
```
Look for errors like:
- "Frappe is not defined" → Not in Frappe context
- "DocType Student Application not found" → DocType name wrong
- "Permission denied" → Check permissions
```

### 2. Check Frappe Error Log
```bash
tail -f ~/frappe-bench/logs/web.log
```

### 3. Verify DocType
```python
# In bench console
frappe.db.exists("DocType", "Student Application")
# Should return True
```

### 4. Verify Roles
```python
# In bench console
frappe.get_roles("user@email.com")
# Should include "Admission Head" or "Admission Staff"
```

### 5. Verify Permissions
```python
# In bench console
doc = frappe.get_doc("DocType", "Student Application")
for p in doc.permissions:
    if p.role in ["Admission Head", "Admission Staff"]:
        print(f"{p.role}: read={p.read}, apply_user_perms={p.apply_user_permissions}")
```

### 6. Test API Call
Open browser console on `/admission-portal` and run:
```javascript
frappe.call({
    method: 'frappe.client.get_list',
    args: {
        doctype: 'Student Application',
        fields: ['name', 'first_name']
    },
    callback: (r) => console.log(r)
});
```

Should return list of applications.

---

## 📞 Getting Help

### If Still Having Issues:

1. **Check file**: `PERMISSION_MATRIX.md` for detailed permission info
2. **Review**: `FRAPPE_SETUP_GUIDE.md` for step-by-step setup
3. **Verify**: All field names match exactly (case-sensitive)
4. **Clear cache**: `bench clear-cache && bench restart`
5. **Check logs**: Browser console + Frappe logs

### Common Error Messages:

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| "DocType not found" | Name mismatch | Check exact spelling |
| "Permission denied" | Wrong permissions | Check permission rules |
| "Frappe is not defined" | Not in Frappe context | Access via web route |
| "No applications" | No data or filter issue | Check database |
| "Cannot read property" | Missing field | Add field to DocType |

---

## ✅ Final Checklist

Before considering setup complete:

- [ ] DocType "Student Application" created with all fields
- [ ] Roles "Admission Head" and "Admission Staff" created
- [ ] Permissions set (Head = all, Staff = assigned only)
- [ ] Test users created (1 Head, 2+ Staff)
- [ ] Sample applications created (5+ records)
- [ ] Programs created (BS Criminology, etc.)
- [ ] Web Page created at route `/admission-portal`
- [ ] Web Page is published
- [ ] HTML, JS, CSS pasted correctly
- [ ] Tested as Head user (sees all applications)
- [ ] Tested as Staff user (sees only assigned)
- [ ] Assignment feature works (Head can assign)
- [ ] Search and filters work
- [ ] No errors in browser console
- [ ] Responsive design works on mobile

---

## 🎓 Next Steps

### After Basic Setup:

1. **Add more fields** to Student Application (address, phone, etc.)
2. **Create workflow** for approval process
3. **Add email notifications** when assigned
4. **Customize metrics** in dashboard
5. **Add reports** for analytics
6. **Configure auto-assignment** logic
7. **Brand with your logo** and colors

### Resources:

- Frappe Docs: https://frappeframework.com/docs
- ERPNext Education: https://docs.erpnext.com/docs/user/manual/en/education

---

## 📋 File Reference

Your Admission Portal folder contains:

```
Admission Portal/
├── START_HERE.md              ← You are here
├── QUICK_SETUP.md             ← 15-min setup guide
├── FRAPPE_SETUP_GUIDE.md      ← Complete detailed guide
├── PERMISSION_MATRIX.md       ← Permission explanations
├── README.md                  ← General information
├── index.html                 ← Portal HTML structure
├── style.css                  ← Portal styles
└── script.js                  ← Portal logic
```

---

## 🎯 Your Action Plan

### Right Now:
1. Read: `QUICK_SETUP.md` (5 min)
2. Follow: Steps 1-7 (15 min)
3. Test: Login as both roles (5 min)

### If Issues:
1. Check: Browser console for errors
2. Review: `PERMISSION_MATRIX.md`
3. Verify: Field names match exactly

### After Working:
1. Add: More test data
2. Customize: Colors, metrics, fields
3. Deploy: To production

---

**Estimated Setup Time**: 15-25 minutes  
**Difficulty**: Beginner-Intermediate  
**Prerequisites**: Frappe Framework installed

---

## 🚀 Ready to Start?

**→ Go to: `QUICK_SETUP.md`**

Follow the 7 steps and you'll have a working portal in 15 minutes!

---

*Pro Bono Publico et Patria* 🎓  
**Philippine College of Criminology - Admission Portal v1.0**
