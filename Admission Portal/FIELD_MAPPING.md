# Field Mapping Guide - Student Applicant DocType

Based on your actual Student Applicant DocType JSON structure.

---

## 🔍 Critical Findings

### 1. **DocType Name**
```
✅ Your DocType: "Student Applicant" 
❌ Portal Currently Uses: "Student Application"

ACTION REQUIRED: Update all JavaScript references!
```

### 2. **Missing Field: assigned_staff**
```
⚠️ WARNING: Your DocType does NOT have "assigned_staff" field!

The portal needs this field to:
- Assign applications to staff members
- Filter applications by staff
- Show "My Assignments" metric

ACTION REQUIRED: Add this field to your DocType!
```

### 3. **Status Field Differences**
```
Your DocType:        Portal Expects:
- PENDING           → Pending
- APPROVED          → Approved  
- REJECTED          → Rejected

Note: Your status is UPPERCASE!

ACTION REQUIRED: Update JavaScript to handle uppercase.
```

---

## 📋 Complete Field Inventory

### Fields in Your DocType (Student Applicant):

| Field Name | Type | Required | Portal Uses? | Notes |
|------------|------|----------|--------------|-------|
| **first_name** | Data | ✅ Yes | ✅ Yes | Match ✓ |
| **middle_name** | Data | ❌ No | ❌ No | Optional |
| **last_name** | Data | ❌ No | ✅ Yes | Portal expects required |
| **program** | Link → Program | ✅ Yes | ✅ Yes | Match ✓ |
| **student_category** | Select | ❌ No | ❌ No | New Student, Transferee, Second Courser |
| **naming_series** | Select | ❌ No | ✅ Yes | .YY.-.###### |
| **application_date** | Date | ❌ No | ❌ No | Default: Today |
| **academic_year** | Link → Academic Year | ❌ No | ❌ No | Optional |
| **academic_term** | Link → Academic Term | ❌ No | ❌ No | Optional |
| **student_admission** | Link | ❌ No | ❌ No | Optional |
| **date_of_birth** | Date | ❌ No | ❌ No | Available |
| **gender** | Select | ❌ No | ❌ No | Male, Female |
| **blood_group** | Select | ❌ No | ❌ No | A, B, O, AB with +/- |
| **student_email_id** | Data (Email) | ❌ No | ✅ Yes | Match ✓ |
| **student_mobile_number** | Data | ❌ No | ❌ No | Available |
| **nationality** | Data | ❌ No | ❌ No | Available |
| **address_line_1** | Data | ❌ No | ❌ No | Available |
| **address_line_2** | Data | ❌ No | ❌ No | Available |
| **city** | Data | ❌ No | ❌ No | Available |
| **state** | Data | ❌ No | ❌ No | Available (Province equivalent) |
| **province** | Data | ❌ No | ❌ No | Available |
| **barangay** | Data | ❌ No | ❌ No | Available |
| **pincode** | Data | ❌ No | ❌ No | Available |
| **home_phone_number** | Data | ❌ No | ❌ No | Available |
| **guardians** | Table | ❌ No | ❌ No | Child table |
| **siblings** | Table | ❌ No | ❌ No | Child table |
| **application_status** | Select | ❌ No | ✅ Yes | PENDING, APPROVED, REJECTED |
| **paid** | Check | ❌ No | ❌ No | Hidden field |
| **lms_only** | Check | ❌ No | ❌ No | Default: 0 |
| **image** | Attach Image | ❌ No | ❌ No | Hidden, for avatar |
| **title** | Data | ❌ No | ❌ No | Hidden |
| **amended_from** | Link | ❌ No | ❌ No | For amendments |
| **academic_department** | Data | ❌ No | ❌ No | Available |
| **age_as_first_friday_of_june** | Data | ❌ No | ❌ No | Custom field |
| **mother_tongue** | Data | ❌ No | ❌ No | Available |
| **ip__ethic_group_** | Data | ❌ No | ❌ No | Indigenous People |
| **religion** | Data | ❌ No | ❌ No | Available |
| **❌ assigned_staff** | **MISSING** | **N/A** | **✅ CRITICAL** | **MUST ADD!** |
| **❌ assigned_date** | **MISSING** | **N/A** | ⚠️ Optional | Portal expects this |
| **❌ reviewed_by** | **MISSING** | **N/A** | ⚠️ Optional | Portal expects this |
| **❌ review_date** | **MISSING** | **N/A** | ⚠️ Optional | Portal expects this |

---

## 🔧 Required Changes

### Step 1: Add Missing Fields to Student Applicant DocType

Go to: **Desk → DocType List → Student Applicant → Edit**

Add these fields:

#### Field 1: Assigned Staff (CRITICAL!)
```
Label: Assigned Staff
Fieldname: assigned_staff
Type: Link
Options: User
Required: No
In List View: Yes
In Filter: Yes
```

#### Field 2: Assigned Date (Optional)
```
Label: Assigned Date
Fieldname: assigned_date
Type: Date
Required: No
Read Only: Yes (auto-set when assigned)
```

#### Field 3: Reviewed By (Optional)
```
Label: Reviewed By
Fieldname: reviewed_by
Type: Link
Options: User
Required: No
```

#### Field 4: Review Date (Optional)
```
Label: Review Date
Fieldname: review_date
Type: Date
Required: No
```

**Save the DocType after adding fields!**

---

### Step 2: Update Portal JavaScript

Two options:

#### Option A: Update Existing Files (Recommended)

I'll create updated versions of the files.

#### Option B: Keep Portal Files, Add Custom Mapping

Create a custom mapping in your portal:

```javascript
// Field name mapping
const FIELD_MAP = {
    // Portal field → Your DocType field
    'first_name': 'first_name',
    'last_name': 'last_name',
    'program': 'program',
    'student_email_id': 'student_email_id',
    'application_status': 'application_status',
    'assigned_staff': 'assigned_staff'
};
```

---

## 📊 Status Value Mapping

Your DocType uses **UPPERCASE** status values:

| Your DocType | Portal Display | CSS Class |
|--------------|---------------|-----------|
| PENDING | Pending | status-pending |
| APPROVED | Approved | status-approved |
| REJECTED | Rejected | status-rejected |

**JavaScript Update Needed:**
```javascript
// OLD CODE:
const status = app.application_status || 'Pending';

// NEW CODE:
const status = app.application_status || 'PENDING';
const statusDisplay = status.charAt(0) + status.slice(1).toLowerCase(); // PENDING → Pending
```

---

## 🎯 API Call Updates

### Current Code (WRONG):
```javascript
frappe.call({
    method: 'frappe.client.get_list',
    args: {
        doctype: 'Student Application',  // ❌ WRONG
        fields: ['name', 'first_name', ...]
    }
});
```

### Updated Code (CORRECT):
```javascript
frappe.call({
    method: 'frappe.client.get_list',
    args: {
        doctype: 'Student Applicant',  // ✅ CORRECT
        fields: ['name', 'first_name', 'last_name', 'program',
                 'application_status', 'student_email_id', 
                 'creation', 'assigned_staff']
    }
});
```

---

## ✅ Verification Checklist

After making changes:

### 1. DocType Fields Added:
- [ ] `assigned_staff` field exists (Link → User)
- [ ] `assigned_date` field exists (Date) - optional
- [ ] Saved DocType successfully

### 2. JavaScript Updated:
- [ ] Changed "Student Application" → "Student Applicant" (all occurrences)
- [ ] Updated status handling for uppercase (PENDING, APPROVED, REJECTED)
- [ ] Verified field names match DocType

### 3. Test API Call:
Open browser console and run:
```javascript
frappe.call({
    method: 'frappe.client.get_list',
    args: {
        doctype: 'Student Applicant',
        fields: ['name', 'first_name', 'application_status', 'assigned_staff']
    },
    callback: (r) => console.log(r.message)
});
```

Should return list of Student Applicant records.

### 4. Test Assignment:
```javascript
frappe.call({
    method: 'frappe.client.set_value',
    args: {
        doctype: 'Student Applicant',
        name: '24-000001',  // Use real ID
        fieldname: 'assigned_staff',
        value: 'staff@test.com'
    },
    callback: (r) => console.log('Assigned!', r)
});
```

---

## 📝 Quick Fix Script

Run this in bench console to add the field programmatically:

```python
import frappe

# Get the DocType
doc = frappe.get_doc("DocType", "Student Applicant")

# Add assigned_staff field
doc.append("fields", {
    "label": "Assigned Staff",
    "fieldname": "assigned_staff",
    "fieldtype": "Link",
    "options": "User",
    "insert_after": "application_status",
    "in_list_view": 1,
    "in_filter": 1
})

# Save
doc.save()

print("✅ assigned_staff field added!")
```

---

## 🔄 Updated Portal Files

I'll create updated versions of:
1. `script.js` - with correct DocType name
2. `index.html` - updated if needed
3. `UPDATED_SETUP_GUIDE.md` - with your actual field names

Check the "Updated Files" folder for corrected versions.

---

## 💡 Additional Enhancements (Optional)

### Use More Fields from Your DocType:

```javascript
// In portal, display more information:
frappe.call({
    args: {
        doctype: 'Student Applicant',
        fields: [
            'name', 'first_name', 'middle_name', 'last_name',
            'program', 'student_category',
            'application_date', 'academic_year', 'academic_term',
            'application_status', 'assigned_staff',
            'student_email_id', 'student_mobile_number',
            'date_of_birth', 'gender'
        ]
    }
});
```

### Display Student Category:
Add column in table to show "New Student" vs "Transferee" vs "Second Courser"

### Show Application Date:
Display when the application was submitted

---

## 🚨 Summary of Critical Changes

| Item | Current State | Required Action |
|------|--------------|----------------|
| **DocType Name** | "Student Application" in portal | Change to "Student Applicant" |
| **assigned_staff field** | Missing in your DocType | Add to Student Applicant DocType |
| **Status values** | Pending, Approved, Rejected | Handle PENDING, APPROVED, REJECTED |
| **Portal files** | Need updates | Use updated versions |

---

**Next Step**: I'll create updated portal files with the correct DocType name and field mappings.

Would you like me to generate the corrected files now?
