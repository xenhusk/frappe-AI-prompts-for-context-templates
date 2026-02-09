# ================================================================
# FINAL WORKING VERSION - Get Admission Staff Members
# ================================================================
# 
# Replace your entire Server Script content with THIS code
# 
# API Name: get_admission_staff
# Script Type: API
# Enabled: Yes
# Allow Guest: No
#
# ================================================================

import frappe

# Get all users with "Admission Staff" role
users_with_role = frappe.get_all(
    'Has Role',
    filters={
        'role': 'Admission Staff',
        'parenttype': 'User'
    },
    fields=['parent']
)

if not users_with_role:
    frappe.response['message'] = []
else:
    # Extract unique user names
    user_names = list(set([u['parent'] for u in users_with_role]))
    
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
# This version works because:
# - No traceback import (not allowed in server scripts)
# - No f-strings in log_error (can cause issues)
# - No try-except needed for this simple query
# - Uses list(set()) instead of distinct=True parameter
# ================================================================
