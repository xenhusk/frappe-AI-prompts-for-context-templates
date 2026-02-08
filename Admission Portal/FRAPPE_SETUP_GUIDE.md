# Frappe Framework Setup Guide - Admission Portal

Complete step-by-step guide to configure Frappe Framework for the Admission Portal.

---

## 📋 Prerequisites

- Frappe Framework installed and running
- Administrator access to your Frappe instance
- Basic understanding of DocTypes, Roles, and Permissions

---

## 1️⃣ CREATE DOCTYPE: Student Application

### Step 1: Create the DocType

1. Go to: **Desk → DocType List → New**
2. Set the following:

| Field | Value |
|-------|-------|
| **Name** | Student Application |
| **Module** | Education (or your custom module) |
| **Naming** | By fieldname → `naming_series` |
| **Is Submittable** | ☐ (Unchecked) |
| **Track Changes** | ☑ (Checked) |
| **Allow Rename** | ☐ (Unchecked) |

### Step 2: Add Fields

Add these fields in the **Fields** section:

#### **Section 1: Basic Information**

| Label | Fieldname | Type | Options/Details | Required |
|-------|-----------|------|-----------------|----------|
| **Naming Series** | naming_series | Select | Options: `EDU-APP-.YYYY.-` | ☑ Yes |
| **Column Break** | column_break_1 | Column Break | - | - |
| **Application Status** | application_status | Select | Options:<br>• Pending<br>• Approved<br>• Rejected<br>• Under Review | ☑ Yes |

#### **Section 2: Personal Information**

| Label | Fieldname | Type | Options/Details | Required |
|-------|-----------|------|-----------------|----------|
| **Section Break** | section_break_personal | Section Break | Label: "Personal Information" | - |
| **First Name** | first_name | Data | - | ☑ Yes |
| **Middle Name** | middle_name | Data | - | ☐ No |
| **Last Name** | last_name | Data | - | ☑ Yes |
| **Column Break** | column_break_2 | Column Break | - | - |
| **Date of Birth** | date_of_birth | Date | - | ☑ Yes |
| **Gender** | gender | Select | Options:<br>• Male<br>• Female<br>• Other | ☑ Yes |

#### **Section 3: Contact Information**

| Label | Fieldname | Type | Options/Details | Required |
|-------|-----------|------|-----------------|----------|
| **Section Break** | section_break_contact | Section Break | Label: "Contact Information" | - |
| **Student Email ID** | student_email_id | Data | Options: Email | ☑ Yes |
| **Student Mobile Number** | student_mobile_number | Data | - | ☑ Yes |
| **Column Break** | column_break_3 | Column Break | - | - |
| **Home Phone Number** | home_phone_number | Data | - | ☐ No |

#### **Section 4: Address Information**

| Label | Fieldname | Type | Options/Details | Required |
|-------|-----------|------|-----------------|----------|
| **Section Break** | section_break_address | Section Break | Label: "Address Information" | - |
| **Address Line 1** | address_line_1 | Small Text | - | ☑ Yes |
| **Address Line 2** | address_line_2 | Small Text | - | ☐ No |
| **Column Break** | column_break_4 | Column Break | - | - |
| **City** | city | Data | - | ☑ Yes |
| **Province** | province | Data | - | ☑ Yes |
| **Barangay** | barangay | Data | - | ☐ No |
| **Pincode** | pincode | Data | - | ☐ No |

#### **Section 5: Academic Information**

| Label | Fieldname | Type | Options/Details | Required |
|-------|-----------|------|-----------------|----------|
| **Section Break** | section_break_academic | Section Break | Label: "Academic Information" | - |
| **Program** | program | Link | DocType: `Program` | ☑ Yes |
| **Student Category** | student_category | Link | DocType: `Student Category` | ☐ No |
| **Column Break** | column_break_5 | Column Break | - | - |
| **Academic Year** | academic_year | Link | DocType: `Academic Year` | ☐ No |

#### **Section 6: Assignment (For Staff Management)**

| Label | Fieldname | Type | Options/Details | Required |
|-------|-----------|------|-----------------|----------|
| **Section Break** | section_break_assignment | Section Break | Label: "Assignment" | - |
| **Assigned Staff** | assigned_staff | Link | DocType: `User` | ☐ No |
| **Assigned Date** | assigned_date | Date | - | ☐ No |
| **Column Break** | column_break_6 | Column Break | - | - |
| **Reviewed By** | reviewed_by | Link | DocType: `User` | ☐ No |
| **Review Date** | review_date | Date | - | ☐ No |

#### **Section 7: Additional Information**

| Label | Fieldname | Type | Options/Details | Required |
|-------|-----------|------|-----------------|----------|
| **Section Break** | section_break_additional | Section Break | Label: "Additional Information" | - |
| **Remarks** | remarks | Text Editor | - | ☐ No |

### Step 3: Save the DocType

Click **Save** to create the DocType.

---

## 2️⃣ CREATE ROLES

### Create Two Custom Roles

#### Role 1: Admission Head

1. Go to: **Desk → Role List → New**
2. Set:
   - **Role Name**: `Admission Head`
   - **Desk Access**: ☑ Checked
3. Save

#### Role 2: Admission Staff

1. Go to: **Desk → Role List → New**
2. Set:
   - **Role Name**: `Admission Staff`
   - **Desk Access**: ☑ Checked
3. Save

---

## 3️⃣ CONFIGURE PERMISSIONS

### Set Permissions for Student Application DocType

1. Go to: **Student Application DocType → Permissions**

#### Permission Rules for "Admission Head":

| Permission | Level | Condition |
|------------|-------|-----------|
| **Read** | 0 | - |
| **Write** | 0 | - |
| **Create** | 0 | - |
| **Delete** | 0 | - |
| **Submit** | 0 | - (if submittable) |
| **Cancel** | 0 | - (if submittable) |
| **Amend** | 0 | - (if submittable) |
| **Report** | ☑ | - |
| **Export** | ☑ | - |
| **Import** | ☑ | - |
| **Set User Permissions** | ☑ | - |
| **Share** | ☑ | - |
| **Print** | ☑ | - |
| **Email** | ☑ | - |

**Apply User Permissions**: ☐ (Unchecked - Head sees ALL records)

#### Permission Rules for "Admission Staff":

| Permission | Level | Condition |
|------------|-------|-----------|
| **Read** | 0 | If User |
| **Write** | 0 | If User |
| **Create** | 0 | - |
| **Report** | ☑ | - |
| **Export** | ☑ | - |
| **Print** | ☑ | - |
| **Email** | ☑ | - |

**Apply User Permissions**: ☑ (Checked - Staff only see assigned records)

**If User Field**: `assigned_staff`

### How to Set "If User" Condition:

1. In the Permission section, find the row for "Admission Staff"
2. Click on the row to edit
3. Set **If Owner** = ☐ (Unchecked)
4. Set **Apply User Permissions** = ☑ (Checked)
5. In the permission rule, add:
   ```
   Match Field: assigned_staff
   ```

---

## 4️⃣ CREATE USERS

### For Testing: Create Sample Users

#### Create Admission Head User:

1. Go to: **Desk → User List → New**
2. Set:
   - **Email**: `admission.head@pccr.edu.ph`
   - **First Name**: `John`
   - **Last Name**: `Head`
   - **Roles**: 
     - ☑ Admission Head
     - ☑ System Manager (optional, for testing)
   - **Enabled**: ☑ Checked
3. Set a password
4. Save

#### Create Admission Staff Users:

1. Go to: **Desk → User List → New**
2. For Staff Member 1:
   - **Email**: `staff1@pccr.edu.ph`
   - **First Name**: `Maria`
   - **Last Name**: `Staff`
   - **Roles**: 
     - ☑ Admission Staff
   - **Enabled**: ☑ Checked
3. Save

Repeat for additional staff members (staff2, staff3, etc.)

---

## 5️⃣ CREATE SUPPORTING DOCTYPES (If Not Exist)

### Program DocType

If you don't have a Program DocType:

1. Go to: **Desk → DocType List → New**
2. Set:
   - **Name**: `Program`
   - **Module**: Education
3. Add fields:
   - **Program Name** (Data, Required)
   - **Program Abbreviation** (Data)
   - **Department** (Link to Department)
4. Save

**Add Sample Programs**:
1. Go to: **Program List → New**
2. Add:
   - BS Criminology
   - BS Criminal Justice
   - BS Forensic Science
   - Diploma in Criminology

### Student Category DocType (Optional)

1. Go to: **Desk → DocType List → New**
2. Set:
   - **Name**: `Student Category`
3. Add field:
   - **Category** (Data, Required)
4. Save

**Add Sample Categories**:
- New Student
- Transferee
- Returnee
- Foreign Student

---

## 6️⃣ CONFIGURE WEB PAGE

### Create the Web Page:

1. Go to: **Desk → Web Page List → New**
2. Set:

| Field | Value |
|-------|-------|
| **Title** | Admission Portal |
| **Route** | admission-portal |
| **Published** | ☑ Checked |
| **Show Sidebar** | ☐ Unchecked |
| **Show Title** | ☐ Unchecked |

### Add HTML:

1. In the **HTML** field, paste the content from `index.html`
2. **Important**: Remove these lines from HTML (Frappe provides them):
   ```html
   <!DOCTYPE html>
   <html>
   <head>
   </head>
   <body>
   </body>
   </html>
   ```
   Keep only the content inside `<body>` tags.

### Add JavaScript:

1. Scroll to **JavaScript** or **Script** field
2. Paste the content from `script.js`

### Add CSS:

**Option A**: Using CSS field
1. Scroll to **CSS** or **Style** field
2. Paste the content from `style.css`

**Option B**: Upload as a file
1. Upload `style.css` to `/public/css/admission-portal.css`
2. In the HTML section, add:
   ```html
   <link rel="stylesheet" href="/assets/css/admission-portal.css">
   ```

### CDN Links in Web Page:

Make sure these are in the HTML head section:
```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- jQuery (if not already loaded by Frappe) -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
```

---

## 7️⃣ JAVASCRIPT API ENDPOINTS

### The portal uses these Frappe API calls:

#### 1. Get Applications List:
```javascript
frappe.call({
    method: 'frappe.client.get_list',
    args: {
        doctype: 'Student Application',
        fields: ['name', 'first_name', 'last_name', 'program', 
                 'application_status', 'creation', 'assigned_staff', 
                 'student_email_id'],
        filters: filters, // Empty for Head, {assigned_staff: user} for Staff
        limit_page_length: 999,
        order_by: 'creation desc'
    }
});
```

#### 2. Get Staff List:
```javascript
frappe.call({
    method: 'frappe.client.get_list',
    args: {
        doctype: 'User',
        fields: ['name', 'full_name'],
        filters: {
            enabled: 1
        }
    }
});
```

#### 3. Assign Staff to Application:
```javascript
frappe.call({
    method: 'frappe.client.set_value',
    args: {
        doctype: 'Student Application',
        name: applicationId,
        fieldname: 'assigned_staff',
        value: staffMember
    }
});
```

#### 4. Check User Role:
```javascript
// Built-in Frappe function
const isHead = frappe.user.has_role("Admission Head");
```

#### 5. Get Current User:
```javascript
// Available in frappe.session
const userName = frappe.session.user_fullname;
const userEmail = frappe.session.user;
```

---

## 8️⃣ TESTING CHECKLIST

### Before Going Live:

- [ ] **DocType Created**: Student Application exists with all fields
- [ ] **Roles Created**: Admission Head and Admission Staff roles exist
- [ ] **Permissions Set**: Head sees all, Staff sees only assigned
- [ ] **Users Created**: At least 1 Head and 2 Staff members
- [ ] **Programs Created**: At least 3-4 program options
- [ ] **Web Page Created**: Route `/admission-portal` is published
- [ ] **Test as Head**: Login and verify you see all applications
- [ ] **Test as Staff**: Login and verify you only see assigned applications
- [ ] **Test Assignment**: Head can assign applications to staff
- [ ] **Test Filters**: Search and status filters work correctly
- [ ] **Test Pagination**: Navigate through multiple pages

### Test Workflow:

1. **As System Manager**:
   - Create 10+ test Student Applications
   - Leave some unassigned
   - Assign some to different staff members
   - Set different statuses (Pending, Approved, Rejected)

2. **Login as Admission Head**:
   - Navigate to `/admission-portal`
   - Verify you see ALL 10+ applications
   - Test assigning an application to a staff member
   - Test search functionality
   - Test status filter

3. **Login as Admission Staff**:
   - Navigate to `/admission-portal`
   - Verify you ONLY see applications assigned to you
   - Test search and filter
   - Verify "Assign" button is NOT visible

4. **Test Responsiveness**:
   - Desktop view (> 1024px)
   - Tablet view (768px - 1024px)
   - Mobile view (< 768px)

---

## 9️⃣ COMMON ISSUES & SOLUTIONS

### Issue 1: "No applications found"

**Cause**: No data or permission issues  
**Solution**: 
1. Check if Student Application records exist
2. Verify user has proper role
3. Check permission rules
4. Check browser console for errors

### Issue 2: Staff sees all applications (should only see assigned)

**Cause**: Permission rules not configured correctly  
**Solution**:
1. Go to Student Application → Permissions
2. For "Admission Staff" role:
   - Set "Apply User Permissions" = ☑
   - Set "If User" field to `assigned_staff`
3. Save permissions
4. Clear cache: `bench clear-cache`

### Issue 3: "Frappe is not defined"

**Cause**: Not running in Frappe context  
**Solution**: 
1. Verify the page is accessed through Frappe web route
2. Check if page is published
3. Make sure user is logged in

### Issue 4: Assignment modal doesn't load staff

**Cause**: User doesn't have permission to read User DocType  
**Solution**:
1. Go to User DocType → Permissions
2. Add Read permission for "Admission Head" role
3. OR modify the API call to use a custom method

### Issue 5: CSS not loading properly

**Cause**: CSS conflicts with Frappe's default styles  
**Solution**:
1. Add `!important` to critical styles
2. Increase CSS specificity
3. Load custom CSS after Frappe's CSS

---

## 🔟 ADVANCED CONFIGURATION

### Custom Server Script (Optional)

If you need custom filtering logic, create a server script:

**File**: `student_application.py`

```python
import frappe

@frappe.whitelist()
def get_applications_for_user():
    """Get applications based on user role"""
    user = frappe.session.user
    
    if "Admission Head" in frappe.get_roles(user):
        # Head sees everything
        filters = {}
    else:
        # Staff only sees assigned
        filters = {"assigned_staff": user}
    
    applications = frappe.get_list(
        "Student Application",
        filters=filters,
        fields=["name", "first_name", "last_name", "program", 
                "application_status", "creation", "assigned_staff"],
        order_by="creation desc"
    )
    
    return applications
```

Then in JavaScript, call:
```javascript
frappe.call({
    method: 'your_app.student_application.get_applications_for_user',
    callback: function(r) {
        // Handle response
    }
});
```

### Auto-Assignment Logic (Optional)

Create a server script to auto-assign applications:

```python
import frappe

@frappe.whitelist()
def auto_assign_application(application_id):
    """Automatically assign to least busy staff"""
    
    # Get all active staff
    staff_list = frappe.get_all(
        "User",
        filters={"enabled": 1},
        fields=["name"]
    )
    
    # Filter staff with Admission Staff role
    staff_with_role = []
    for staff in staff_list:
        if "Admission Staff" in frappe.get_roles(staff.name):
            staff_with_role.append(staff.name)
    
    # Count assignments per staff
    assignment_counts = {}
    for staff in staff_with_role:
        count = frappe.db.count(
            "Student Application",
            {"assigned_staff": staff}
        )
        assignment_counts[staff] = count
    
    # Get staff with least assignments
    least_busy_staff = min(assignment_counts, key=assignment_counts.get)
    
    # Assign
    frappe.db.set_value(
        "Student Application",
        application_id,
        "assigned_staff",
        least_busy_staff
    )
    
    return least_busy_staff
```

---

## 📞 SUPPORT & DEBUGGING

### Enable Developer Mode:

In `site_config.json`:
```json
{
    "developer_mode": 1
}
```

Then restart:
```bash
bench restart
```

### Check Logs:

```bash
# Frappe logs
tail -f logs/web.log

# JavaScript errors
Check browser console (F12)
```

### Clear Cache:

```bash
bench clear-cache
bench clear-website-cache
```

### Bench Commands:

```bash
# Migrate database
bench migrate

# Reinstall app
bench reinstall

# Console
bench console
```

---

## ✅ FINAL CHECKLIST

Before deployment:

- [ ] All DocTypes created and configured
- [ ] All roles created
- [ ] Permissions properly set (Head = all, Staff = assigned only)
- [ ] Test users created
- [ ] Sample data created
- [ ] Web page published
- [ ] Tested as Head user
- [ ] Tested as Staff user
- [ ] Responsive design tested
- [ ] Browser console has no errors
- [ ] Performance tested with 100+ records

---

**Setup Complete!** 🎉

Your Admission Portal is now ready to use.

Access at: `https://your-site.com/admission-portal`

---

**Version**: 1.0.0  
**Last Updated**: February 2024  
**For**: Philippine College of Criminology (PCCR)  
*Pro Bono Publico et Patria* 🎓
