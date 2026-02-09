# ================================================================
# TEST SERVER SCRIPT - Simple Test
# ================================================================
# 
# Create a NEW server script with this to test:
#
# API Name: test_server_script
# Script Type: API
# Enabled: Yes
#
# This will help us verify server scripts work at all
# ================================================================

import frappe

# Simple test - just return a test message
frappe.response['message'] = [
    {
        'name': 'test@example.com',
        'full_name': 'Test User',
        'email': 'test@example.com'
    }
]

# ================================================================
# If this works, the issue is with the query logic
# If this also fails, there's a server script configuration issue
# ================================================================
