# Permission Matrix & Data Flow

Visual guide to understand how roles, permissions, and data flow work in the Admission Portal.

---

## 🔐 Permission Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    FRAPPE FRAMEWORK                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐              ┌──────────────────┐    │
│  │  Admission Head  │              │  Admission Staff │    │
│  │                  │              │                  │    │
│  │  • Full Access   │              │  • Limited Access│    │
│  │  • Sees ALL apps │              │  • Sees ONLY     │    │
│  │  • Can Assign    │              │    assigned apps │    │
│  │  • Can Approve   │              │  • Can Review    │    │
│  └────────┬─────────┘              └────────┬─────────┘    │
│           │                                 │               │
│           │                                 │               │
│           ▼                                 ▼               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Student Application DocType                  │  │
│  │                                                        │  │
│  │  Apply User Permissions:                              │  │
│  │  • Head: NO  (sees all records)                       │  │
│  │  • Staff: YES (filtered by assigned_staff = user)     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
USER LOGIN
    ↓
┌───────────────────────────────┐
│   Frappe Authentication       │
│   Check: frappe.session.user  │
└───────────────┬───────────────┘
                ↓
        ┌───────────────┐
        │ Check Role    │
        │ frappe.user.  │
        │ has_role()    │
        └───┬───────┬───┘
            │       │
    ┌───────┘       └────────┐
    ↓                        ↓
┏━━━━━━━━━━━━━━┓      ┏━━━━━━━━━━━━━━┓
┃ ADMISSION    ┃      ┃ ADMISSION    ┃
┃ HEAD         ┃      ┃ STAFF        ┃
┗━━━━━┯━━━━━━━━┛      ┗━━━━━┯━━━━━━━━┛
      │                     │
      │ frappe.call()       │ frappe.call()
      ↓                     ↓
┌─────────────────────────────────────┐
│  frappe.client.get_list()           │
│  doctype: Student Application       │
├─────────────────────────────────────┤
│  HEAD:                              │
│  filters = {}  (NO FILTER)          │
│  → Returns ALL records              │
├─────────────────────────────────────┤
│  STAFF:                             │
│  filters = {                        │
│    assigned_staff: user@email.com   │
│  }                                  │
│  → Returns ONLY assigned records    │
└─────────────────┬───────────────────┘
                  ↓
      ┌───────────────────────┐
      │  Student Application  │
      │  Table (Database)     │
      └───────────────────────┘
                  ↓
      ┌───────────────────────┐
      │  Dashboard Display    │
      │  • Metrics            │
      │  • Table              │
      │  • Filters            │
      └───────────────────────┘
```

---

## 🔑 Permission Rules Table

### Student Application DocType Permissions

| Action | Admission Head | Admission Staff | Notes |
|--------|---------------|-----------------|-------|
| **Read All** | ✅ Yes | ❌ No | Head sees everything |
| **Read Assigned** | ✅ Yes | ✅ Yes | Staff sees only their assignments |
| **Create** | ✅ Yes | ✅ Yes | Both can create new applications |
| **Update All** | ✅ Yes | ❌ No | Head can update any record |
| **Update Assigned** | ✅ Yes | ✅ Yes | Staff can update their assigned records |
| **Delete** | ✅ Yes | ❌ No | Only Head can delete |
| **Assign** | ✅ Yes | ❌ No | Only Head can assign to staff |
| **Approve/Reject** | ✅ Yes | ⚠️ Optional | Based on workflow config |

### User DocType Permissions (for Staff List)

| Action | Admission Head | Admission Staff | Notes |
|--------|---------------|-----------------|-------|
| **Read Users** | ✅ Yes | ❌ No | Head needs this to load staff list |
| **Update Users** | ❌ No | ❌ No | Not needed for portal |

---

## 🔄 Assignment Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  1. NEW APPLICATION CREATED                                  │
│     assigned_staff = NULL                                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  2. HEAD LOGS IN TO PORTAL                                   │
│     Sees: ALL applications (including unassigned)            │
│     Dashboard shows: "My Assignments" = Unassigned count     │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  3. HEAD CLICKS "ASSIGN" BUTTON                              │
│     • Opens modal                                            │
│     • Loads staff list (frappe.client.get_list → User)       │
│     • Filters: enabled = 1                                   │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  4. HEAD SELECTS STAFF & CONFIRMS                            │
│     frappe.client.set_value(                                 │
│       doctype: "Student Application",                        │
│       name: "EDU-APP-2024-001",                              │
│       fieldname: "assigned_staff",                           │
│       value: "staff@pccr.edu.ph"                             │
│     )                                                        │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  5. DATABASE UPDATED                                         │
│     assigned_staff = "staff@pccr.edu.ph"                     │
│     (Optional: assigned_date = today)                        │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  6. STAFF LOGS IN TO PORTAL                                  │
│     Sees: ONLY this application (filter: assigned_staff)     │
│     Can: View, Edit, Update status                           │
│     Cannot: See other staff's applications                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Filter Logic Examples

### Scenario 1: Head Viewing Dashboard

**JavaScript Code:**
```javascript
let filters = {};  // Empty = no filter

frappe.call({
    method: 'frappe.client.get_list',
    args: {
        doctype: 'Student Application',
        fields: ['name', 'first_name', 'last_name', ...],
        filters: filters  // {} means get ALL
    }
});
```

**SQL Query (What Frappe Runs):**
```sql
SELECT name, first_name, last_name, ...
FROM `tabStudent Application`
ORDER BY creation DESC
-- No WHERE clause, returns everything
```

**Result:** 100 applications returned

---

### Scenario 2: Staff Viewing Dashboard

**JavaScript Code:**
```javascript
let filters = {
    assigned_staff: frappe.session.user  // "staff@pccr.edu.ph"
};

frappe.call({
    method: 'frappe.client.get_list',
    args: {
        doctype: 'Student Application',
        fields: ['name', 'first_name', 'last_name', ...],
        filters: filters  // Filter by assigned staff
    }
});
```

**SQL Query (What Frappe Runs):**
```sql
SELECT name, first_name, last_name, ...
FROM `tabStudent Application`
WHERE assigned_staff = 'staff@pccr.edu.ph'
ORDER BY creation DESC
```

**Result:** 15 applications returned (only assigned to this staff)

---

### Scenario 3: Searching Applications

**JavaScript Code (works for both roles):**
```javascript
const searchTerm = "Juan";  // User typed this

filteredData = applicationsData.filter(app => {
    return (
        app.first_name.includes(searchTerm) ||
        app.last_name.includes(searchTerm) ||
        app.program.includes(searchTerm)
    );
});
```

**Flow:**
```
1. Get full dataset (already filtered by role)
   Head: All 100 applications
   Staff: Only 15 assigned applications

2. Apply search filter on CLIENT SIDE
   Filter in JavaScript, not database

3. Display filtered results
```

---

## 🔍 Permission Debugging

### Check User Roles:
```python
# In bench console
frappe.get_roles("user@email.com")

# Expected output for Head:
['Admission Head', 'System Manager', ...]

# Expected output for Staff:
['Admission Staff', ...]
```

### Check Permissions:
```python
# In bench console
doctype = frappe.get_doc("DocType", "Student Application")
for perm in doctype.permissions:
    print(f"Role: {perm.role}")
    print(f"  Read: {perm.read}")
    print(f"  Write: {perm.write}")
    print(f"  Apply User Permissions: {perm.apply_user_permissions}")
    print(f"  If Owner: {perm.if_owner}")
    print("---")
```

### Test Filters:
```python
# In bench console

# As Head (should return all)
frappe.set_user("head@pccr.edu.ph")
apps = frappe.get_list("Student Application", fields=["name", "assigned_staff"])
print(f"Head sees: {len(apps)} applications")

# As Staff (should return only assigned)
frappe.set_user("staff@pccr.edu.ph")
apps = frappe.get_list("Student Application", fields=["name", "assigned_staff"])
print(f"Staff sees: {len(apps)} applications")
```

---

## 📋 Common Permission Issues

### Issue: Staff sees ALL applications

**Diagnosis:**
```python
# Check permission rule
doc = frappe.get_doc("DocType", "Student Application")
staff_perm = [p for p in doc.permissions if p.role == "Admission Staff"][0]
print(f"Apply User Permissions: {staff_perm.apply_user_permissions}")
# Should be: 1 (True)
```

**Fix:**
1. Go to: Student Application → Permissions
2. Find "Admission Staff" row
3. Set "Apply User Permissions" = ✓
4. In Permission Manager, add:
   - User Permission On: Student Application
   - User: staff@pccr.edu.ph
   - Allow: assigned_staff = staff@pccr.edu.ph

---

### Issue: Head cannot see staff list

**Diagnosis:**
```python
# Check User permissions
frappe.set_user("head@pccr.edu.ph")
users = frappe.get_list("User", fields=["name"])
# Should return list, not empty
```

**Fix:**
1. Go to: User DocType → Permissions
2. Add "Admission Head" role
3. Set Read = ✓
4. Save

---

## 🎓 Understanding User Permissions

### Standard Frappe Permissions (Applied First):

```
DocType Permissions:
├── Role: Admission Head
│   ├── Read: Yes
│   ├── Write: Yes
│   └── Apply User Permissions: NO
│       → Sees EVERYTHING
│
└── Role: Admission Staff
    ├── Read: Yes
    ├── Write: Yes (for assigned only)
    └── Apply User Permissions: YES
        └── If User: assigned_staff
            → Sees ONLY where assigned_staff = their email
```

### JavaScript Filter (Applied Second):

```javascript
// Portal adds additional filters
if (!isHead) {
    filters.assigned_staff = frappe.session.user;
}

// This DOUBLES the filtering:
// 1. Frappe permission system filters at DB level
// 2. JavaScript filters at API level
```

**Result:** Extra security layer ensuring staff ONLY see assigned records.

---

## ✅ Setup Validation Checklist

Use this to verify permissions are set correctly:

```python
# Run in bench console

# 1. Check roles exist
assert frappe.db.exists("Role", "Admission Head")
assert frappe.db.exists("Role", "Admission Staff")

# 2. Check DocType exists
assert frappe.db.exists("DocType", "Student Application")

# 3. Check permissions are set
doc = frappe.get_doc("DocType", "Student Application")
head_perm = [p for p in doc.permissions if p.role == "Admission Head"]
staff_perm = [p for p in doc.permissions if p.role == "Admission Staff"]

assert len(head_perm) > 0, "Head permission missing"
assert len(staff_perm) > 0, "Staff permission missing"

# 4. Check permission settings
assert head_perm[0].read == 1
assert head_perm[0].apply_user_permissions == 0  # Head sees all

assert staff_perm[0].read == 1
assert staff_perm[0].apply_user_permissions == 1  # Staff filtered

print("✅ All permission checks passed!")
```

---

**Summary**: The permission system uses TWO layers of filtering:
1. **Frappe Permission System** (database level)
2. **JavaScript Filters** (application level)

Both work together to ensure data security.

---

*Need more help? Check FRAPPE_SETUP_GUIDE.md for detailed instructions.*
