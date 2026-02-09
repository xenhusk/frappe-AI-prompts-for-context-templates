# ================================================================
# SERVER SCRIPT: Get Admission Staff Members
# ================================================================
# 
# To add this to Frappe:
# 1. Go to: Search Bar > Server Script > New
# 2. Fill in the following details:
#
#    API Name: get_admission_staff
#    Script Type: API
#    Allow Guest: No (unchecked)
#    Enabled: Yes (checked)
#
# 3. Copy ONLY the code between the lines below into the "Script" field
# ================================================================

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

# ================================================================
# END OF SERVER SCRIPT
# ================================================================
