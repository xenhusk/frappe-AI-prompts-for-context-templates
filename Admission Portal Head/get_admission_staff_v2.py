# ================================================================
# SERVER SCRIPT V2: Get Admission Staff Members (With Error Handling)
# ================================================================
# 
# API Name: get_admission_staff
# Script Type: API
# Enabled: Yes
# Allow Guest: No
#
# Replace your existing server script with this version
# ================================================================

import frappe
import traceback

try:
    # Log that the script is running
    frappe.log_error("Server script get_admission_staff called", "Debug")
    
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
    
    frappe.log_error(f"Found {len(users_with_role)} users with role", "Debug")
    
    if not users_with_role:
        frappe.response['message'] = []
    else:
        # Extract user names
        user_names = [u['parent'] for u in users_with_role]
        
        frappe.log_error(f"User names: {user_names}", "Debug")
        
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
        
        frappe.log_error(f"Returning {len(staff_members)} staff members", "Debug")
        frappe.response['message'] = staff_members

except Exception as e:
    # Log the full error for debugging
    error_message = f"Error in get_admission_staff: {str(e)}\n{traceback.format_exc()}"
    frappe.log_error(error_message, "Server Script Error")
    
    # Return empty list instead of crashing
    frappe.response['message'] = []

# ================================================================
# This version logs everything to Error Log for debugging
# Check Error Log after running to see what's happening
# ================================================================
