# PCCR Admission Portal

A comprehensive dashboard for managing student applications at Philippine College of Criminology (PCCR).

## 📋 Overview

This portal provides role-based access control for admission management:
- **Admission Head**: View all applications, assign staff, full control
- **Admission Staff**: View only assigned applications

## 🎨 Design System

Follows the official PCCR design system with:
- **Primary Red**: `#7b0200` (headers, buttons, primary elements)
- **Gold Accent**: `#fcb31c` (highlights, active states)
- **Font**: Inter (body), Poppins (headings)

## 📁 Files Structure

```
Admission Portal/
├── index.html       # Main HTML structure with Tailwind CSS
├── style.css        # Custom styles extending PCCR theme
├── script.js        # Dashboard logic and Frappe integration
└── README.md        # Documentation (this file)
```

## 🚀 Features

### For Admission Heads:
- ✅ View all student applications
- ✅ Assign applications to staff members
- ✅ Filter by status (Pending, Approved, Rejected)
- ✅ Search applications by name, ID, or program
- ✅ Real-time metrics dashboard
- ✅ Pagination for large datasets

### For Admission Staff:
- ✅ View only assigned applications
- ✅ Filter and search functionality
- ✅ Track personal assignments

### General Features:
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations with GSAP
- ✅ Role-based UI adaptation
- ✅ Status badges (Green: Approved, Yellow: Pending, Red: Rejected)
- ✅ Direct navigation to application records

## 🛠️ Installation

### For Frappe Framework:

1. **Create a Web Page in Frappe**:
   - Go to: Web Page > New Web Page
   - Set Route: `/admission-portal`
   - Published: ✓

2. **Add HTML**:
   - Copy content from `index.html`
   - Paste into the "HTML" field

3. **Add JavaScript**:
   - Copy content from `script.js`
   - Paste into the "Script" or "JS" field

4. **Add CSS**:
   - Copy content from `style.css`
   - Option A: Paste into "CSS" field
   - Option B: Upload as a file and link it

### Standalone Testing:

Open `index.html` directly in a browser. Demo mode will activate with sample data.

## 📊 Required Frappe Setup

### DocType: Student Application

Ensure you have a DocType named "Student Application" with these fields:

| Field Name | Type | Description |
|------------|------|-------------|
| `name` | Data | Application ID (auto-generated) |
| `first_name` | Data | Student first name |
| `last_name` | Data | Student last name |
| `program` | Link | Program (links to Program DocType) |
| `application_status` | Select | Status: Pending, Approved, Rejected |
| `assigned_staff` | Link | Assigned staff (links to User) |
| `student_email_id` | Data | Student email |
| `creation` | Datetime | Auto timestamp |

### Roles Setup:

Create these roles in Frappe:
- **Admission Head**: Full access to all applications
- **Admission Staff**: Limited to assigned applications

### Permissions:

Set proper permissions for "Student Application" DocType based on roles.

## 🎯 Usage

### Accessing the Portal:

1. **Via Frappe**: Navigate to `/admission-portal` (or your set route)
2. **Demo Mode**: Open `index.html` in browser (uses sample data)

### Navigation:

- **Overview**: Dashboard metrics and summary
- **Applications**: Full table view with filters
- **Reports**: (Future feature)
- **Settings**: (Future feature)

### Filtering Applications:

1. **Search Bar**: Type name, ID, email, or program
2. **Status Filter**: Select All, Pending, Approved, or Rejected
3. **Results update in real-time**

### Assigning Applications (Heads Only):

1. Click "Assign" button next to any application
2. Select staff member from dropdown
3. Click "Assign" to confirm
4. Staff member receives the assignment

### Viewing Applications:

Click "View" button to navigate to the full application record in Frappe.

## 🎨 Customization

### Change Colors:

In `style.css`, modify CSS variables or replace color codes:
```css
/* Current PCCR colors */
#7b0200 → Your primary red
#fcb31c → Your gold accent
```

In `index.html`, update Tailwind config:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'pccr-red': '#YOUR_COLOR',
                'pccr-gold': '#YOUR_COLOR',
            }
        }
    }
}
```

### Add New Metrics:

In `script.js`, modify `updateMetrics()` function:
```javascript
function updateMetrics() {
    // Add your custom metric calculation
    const customMetric = applicationsData.filter(...).length;
    animateCounter('yourMetricId', customMetric);
}
```

Then add the HTML card in `index.html`.

### Modify Table Columns:

Edit the table structure in `index.html` and update `renderTable()` in `script.js`.

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px (full sidebar, 3-column metrics)
- **Tablet**: 768px - 1024px (full sidebar, 2-column metrics)
- **Mobile**: < 768px (collapsible sidebar, 1-column metrics)

## 🔧 Dependencies

All dependencies are loaded via CDN:

- **Tailwind CSS**: `https://cdn.tailwindcss.com`
- **GSAP**: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- **jQuery**: `https://code.jquery.com/jquery-3.6.0.min.js`
- **Font Awesome**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- **Google Fonts**: Inter & Poppins

## 🐛 Troubleshooting

### "Frappe not available" message:
- **Cause**: Not running in Frappe context
- **Solution**: Demo mode activates automatically OR install in Frappe Web Page

### No applications showing:
- **Check**: Student Application DocType exists
- **Check**: User has proper role assignments
- **Check**: Browser console for errors

### Sidebar not showing on mobile:
- **Check**: Click hamburger menu button (top-left)
- **Check**: Browser width < 768px

### Assignment modal not working:
- **Check**: User has "Admission Head" role
- **Check**: Staff members exist in User DocType

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify Frappe DocType setup
3. Review role permissions
4. Test in demo mode first

## 📄 License

Created for Philippine College of Criminology (PCCR)

---

**Version**: 1.0.0  
**Created**: February 2024  
**Motto**: *Pro Bono Publico et Patria* 🎓
