# Server Script for Admission Portal
# 
# To add this to Frappe:
# 1. Go to: Setup > Automation > Server Script > New
# 2. Fill in the following details:
#
# Script Name: Get User Roles for Admission Portal
# Script Type: API
# API Method: get_user_roles
# Allow Guest: No (unchecked)
# 
# Copy ONLY the code below:
# ================================================================

import frappe

# Get the current user's roles
user = frappe.session.user

if user == "Guest":
    frappe.response['message'] = []
else:
    frappe.response['message'] = frappe.get_roles(user)
