# Implementation Guide - Matching Your DocType

Quick guide to make the portal work with your actual Student Applicant DocType.

---

## 🚨 Critical Changes Required

### 1. **Add Missing Field to DocType**

Your Student Applicant DocType is missing the `assigned_staff` field!

####Option A: Add via UI (Recommended)

1. Go to: **Desk → DocType List → Student Applicant**
2. Click **Edit**
3. Scroll to **Fields** section
4. Add after `application_status` field:

```
Label: Assigned Staff
Fieldname: assigned_staff
Type: Link
Options: User
Required: No
In List View: Yes (✓)
In Standard Filter: Yes (✓)
In Filter: Yes (✓)
```

5. **Save** the DocType
6. **Reload** (Ctrl+Shift+R or Menu → Reload)

#### Option B: Add via Bench Console

```python
import frappe

# Get the DocType
doc = frappe.get_doc("DocType", "Student Applicant")

# Find the index after application_status field
app_status_idx = None
for i, field in enumerate(doc.fields):
    if field.fieldname == "application_status":
        app_status_idx = i + 1
        break

# Add the assigned_staff field
doc.insert(app_status_idx, "fields", {
    "label": "Assigned Staff",
    "fieldname": "assigned_staff",
    "fieldtype": "Link",
    "options": "User",
    "in_list_view": 1,
    "in_standard_filter": 1,
    "in_filter": 1,
    "permlevel": 0
})

# Optionally add assigned_date
doc.append("fields", {
    "label": "Assigned Date",
    "fieldname": "assigned_date",
    "fieldtype": "Date",
    "read_only": 1,
    "permlevel": 0
})

# Save
doc.save()

frappe.db.commit()

print("✅ Fields added successfully!")
print("⚠️ Please clear cache: bench clear-cache")
```

Then run:
```bash
bench clear-cache
bench restart
```

---

### 2. **Update Portal Files**

Replace the old `script.js` with the new `script_UPDATED.js`:

```bash
cd "Admission Portal"
cp script_UPDATED.js script.js
```

Or manually update these lines in `script.js`:

#### Change 1: DocType Name
```javascript
// OLD:
doctype: 'Student Application',

// NEW:
doctype: 'Student Applicant',
```

#### Change 2: Status Handling
```javascript
// OLD:
const status = app.application_status || 'Pending';

// NEW:
const rawStatus = app.application_status || 'PENDING';
const STATUS_MAP = {
    'PENDING': { display: 'Pending', class: 'pending' },
    'APPROVED': { display: 'Approved', class: 'approved' },
    'REJECTED': { display: 'Rejected', class: 'rejected' }
};
const statusInfo = STATUS_MAP[rawStatus];
```

#### Change 3: View URL
```javascript
// OLD:
window.location.href = `/app/student-application/${urlName}`;

// NEW:
window.location.href = `/app/student-applicant/${urlName}`;
```

---

### 3. **Update HTML Status Filter**

Update the status filter options in `index.html` to match uppercase values:

```html
<!-- OLD: -->
<select id="statusFilter" class="status-filter">
    <option value="">All Status</option>
    <option value="Pending">Pending</option>
    <option value="Approved">Approved</option>
    <option value="Rejected">Rejected</option>
</select>

<!-- NEW: -->
<select id="statusFilter" class="status-filter">
    <option value="">All Status</option>
    <option value="PENDING">Pending</option>
    <option value="APPROVED">Approved</option>
    <option value="REJECTED">Rejected</option>
</select>
```

---

## ✅ Verification Steps

### Step 1: Verify Field Added

Run in bench console:
```python
import frappe

doc = frappe.get_doc("DocType", "Student Applicant")
fields = [f.fieldname for f in doc.fields]

if "assigned_staff" in fields:
    print("✅ assigned_staff field exists!")
else:
    print("❌ assigned_staff field is MISSING!")
```

### Step 2: Test API Access

Run in browser console on any Frappe page:
```javascript
frappe.call({
    method: 'frappe.client.get_list',
    args: {
        doctype: 'Student Applicant',
        fields: ['name', 'first_name', 'last_name', 'application_status', 'assigned_staff'],
        limit_page_length: 5
    },
    callback: (r) => {
        console.log('✅ API Response:', r.message);
        if (r.message && r.message.length > 0) {
            console.log('Sample record:', r.message[0]);
        }
    }
});
```

Expected output:
```javascript
✅ API Response: [
  {
    name: "24-000001",
    first_name: "Juan",
    last_name: "Dela Cruz",
    application_status: "PENDING",
    assigned_staff: null
  },
  ...
]
```

### Step 3: Test Assignment

```javascript
// Test assigning a staff member
frappe.call({
    method: 'frappe.client.set_value',
    args: {
        doctype: 'Student Applicant',
        name: '24-000001',  // Use a real ID from your system
        fieldname: 'assigned_staff',
        value: 'your.staff@email.com'  // Use a real user email
    },
    callback: (r) => {
        if (!r.exc) {
            console.log('✅ Assignment successful!');
        } else {
            console.error('❌ Assignment failed:', r.exc);
        }
    }
});
```

---

## 📋 Complete Checklist

Before going live:

### DocType Configuration:
- [ ] `assigned_staff` field added to Student Applicant
- [ ] `assigned_staff` is Link type → User
- [ ] `assigned_staff` visible in List View
- [ ] `assigned_staff` available in filters
- [ ] DocType saved and cache cleared

### Portal Files:
- [ ] `script.js` updated with new DOCTYPE_NAME
- [ ] Status handling updated for uppercase
- [ ] View URL updated to `/app/student-applicant/`
- [ ] `index.html` status filter updated to uppercase values

### Roles & Permissions:
- [ ] "Admission Head" role created
- [ ] "Admission Staff" role created
- [ ] Permissions set for Student Applicant:
  - Head: Apply User Permissions = NO
  - Staff: Apply User Permissions = YES, If User = assigned_staff

### Testing:
- [ ] API call returns Student Applicant records
- [ ] Status displays correctly (Pending, Approved, Rejected)
- [ ] Assignment works (Head can assign to Staff)
- [ ] Staff sees only assigned applications
- [ ] Head sees all applications
- [ ] No console errors in browser

---

## 🔧 Quick Test Commands

### Create Test Application:
```python
import frappe

app = frappe.get_doc({
    "doctype": "Student Applicant",
    "naming_series": ".YY.-.######",
    "first_name": "Test",
    "last_name": "Student",
    "program": "BS Criminology",  # Make sure this program exists!
    "student_category": "New Student",
    "application_status": "PENDING",
    "student_email_id": "test@example.com",
    "application_date": frappe.utils.today()
})
app.insert()
frappe.db.commit()

print(f"✅ Created: {app.name}")
```

### Assign to Staff:
```python
import frappe

frappe.db.set_value(
    "Student Applicant",
    "24-000001",  # Use real ID
    "assigned_staff",
    "staff@test.com"  # Use real user email
)
frappe.db.commit()

print("✅ Assigned!")
```

### Check Assignments:
```python
import frappe

# Get unassigned
unassigned = frappe.get_all(
    "Student Applicant",
    filters={"assigned_staff": ["is", "not set"]},
    fields=["name", "first_name", "last_name"]
)
print(f"Unassigned: {len(unassigned)}")

# Get assigned to specific staff
assigned = frappe.get_all(
    "Student Applicant",
    filters={"assigned_staff": "staff@test.com"},
    fields=["name", "first_name", "last_name"]
)
print(f"Assigned to staff@test.com: {len(assigned)}")
```

---

## 🎯 Field Mapping Reference

| Portal Variable | Your DocType Field | Type | Notes |
|----------------|-------------------|------|-------|
| `name` | `name` | Auto | Application ID (24-000001) |
| `first_name` | `first_name` | Data | Required |
| `middle_name` | `middle_name` | Data | Optional, supported |
| `last_name` | `last_name` | Data | Available |
| `program` | `program` | Link → Program | Required |
| `student_category` | `student_category` | Select | New Student, Transferee, Second Courser |
| `application_status` | `application_status` | Select | PENDING, APPROVED, REJECTED (uppercase!) |
| `assigned_staff` | `assigned_staff` | Link → User | **YOU NEED TO ADD THIS** |
| `student_email_id` | `student_email_id` | Data | Email field |
| `student_mobile_number` | `student_mobile_number` | Data | Phone number |
| `application_date` | `application_date` | Date | When applied |
| `creation` | `creation` | Datetime | Auto-generated |

---

## 🚀 Final Steps

1. **Add `assigned_staff` field** to Student Applicant DocType
2. **Replace `script.js`** with `script_UPDATED.js`
3. **Update status filter** in HTML to uppercase
4. **Clear cache**: `bench clear-cache && bench restart`
5. **Test** the portal at `/admission-portal`

---

## 📞 Troubleshooting

### Error: "DocType Student Application not found"
**Cause**: Using old DocType name  
**Fix**: Update all references to `Student Applicant`

### Error: "Cannot read property 'assigned_staff'"
**Cause**: Field doesn't exist in DocType  
**Fix**: Add the `assigned_staff` field as shown above

### Error: "Status badge not showing correctly"
**Cause**: Status value mismatch (lowercase vs uppercase)  
**Fix**: Use the updated script with STATUS_MAP

### Portal shows no data
**Cause**: No applications exist or permission issue  
**Fix**: Create test applications and verify role permissions

---

**Ready to implement?**  
Follow the steps above, then test at: `/admission-portal`

🎓 *Pro Bono Publico et Patria*
