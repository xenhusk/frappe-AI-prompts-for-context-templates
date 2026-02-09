// === VIEW APPLICATION MODAL ===

let currentViewingApp = null;

// Open view modal with application details
function viewApplication(applicationName) {
    console.log('Opening view modal for:', applicationName);
    
    if (typeof frappe === 'undefined') {
        showToast('View: ' + applicationName + ' (Demo Mode)', 'info');
        return;
    }
    
    currentViewingApp = applicationName;
    
    // Fetch full application details
    frappe.call({
        method: 'frappe.client.get',
        args: {
            doctype: DOCTYPE_NAME,
            name: applicationName
        },
        callback: function(r) {
            if (r.message) {
                populateViewModal(r.message);
                openViewModal();
            } else {
                showToast('Failed to load application details', 'error');
            }
        },
        error: function(err) {
            console.error('Error loading application:', err);
            showToast('Error loading application details', 'error');
        }
    });
}

// Populate view modal with data
function populateViewModal(data) {
    console.log('Populating view modal with:', data);
    
    // Update subtitle
    document.getElementById('viewModalSubtitle').textContent = 
        `Student Application #${data.name}`;
    
    // Tab 1: Admission Details
    setViewField('view_name', data.name);
    setViewField('view_application_date', formatDate(data.application_date));
    setViewField('view_student_category', data.student_category);
    setViewField('view_program', data.program);
    setViewField('view_academic_year', data.academic_year);
    setViewField('view_academic_term', data.academic_term);
    setViewField('view_agent', data.agent || 'No agent');
    
    // Tab 2: Personal Information
    setViewField('view_first_name', data.first_name);
    setViewField('view_middle_name', data.middle_name);
    setViewField('view_last_name', data.last_name);
    setViewField('view_date_of_birth', formatDate(data.date_of_birth));
    setViewField('view_gender', data.gender);
    setViewField('view_blood_group', data.blood_group);
    setViewField('view_nationality', data.nationality);
    setViewField('view_religion', data.religion);
    setViewField('view_mother_tongue', data.mother_tongue);
    setViewField('view_student_email_id', data.student_email_id);
    setViewField('view_student_mobile_number', data.student_mobile_number);
    setViewField('view_home_phone_number', data.home_phone_number);
    
    // Tab 3: Guardian & Address
    setViewField('view_address_line_1', data.address_line_1);
    setViewField('view_address_line_2', data.address_line_2);
    setViewField('view_barangay', data.barangay);
    setViewField('view_city', data.city);
    setViewField('view_province', data.province);
    setViewField('view_state', data.state);
    setViewField('view_pincode', data.pincode);
    
    // Guardian list
    populateGuardiansList(data.guardians);
    
    // Siblings list
    populateSiblingsList(data.siblings);
    
    // Tab 4: Status
    const statusInfo = STATUS_MAP[data.application_status] || STATUS_MAP['PENDING'];
    const statusHTML = `<span class="status-badge status-${statusInfo.class}">${statusInfo.display}</span>`;
    document.getElementById('view_application_status').innerHTML = statusHTML;
    
    setViewField('view_assigned_staff', data.assigned_staff || 'Unassigned');
    setViewField('view_creation', formatDateTime(data.creation));
    setViewField('view_modified', formatDateTime(data.modified));
    
    // Show status update section for Admission Head
    const statusUpdateSection = document.getElementById('viewStatusUpdate');
    if (isHead && statusUpdateSection) {
        statusUpdateSection.style.display = 'block';
        document.getElementById('viewStatusSelect').value = data.application_status || 'PENDING';
    }
}

// Helper function to set view field value
function setViewField(fieldId, value) {
    const element = document.getElementById(fieldId);
    if (element) {
        element.textContent = value || '-';
    }
}

// Populate guardians list
function populateGuardiansList(guardians) {
    const container = document.getElementById('view_guardians_list');
    
    if (!guardians || guardians.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm italic">No guardian information available</p>';
        return;
    }
    
    let html = '<div class="view-table">';
    html += '<table><thead><tr>';
    html += '<th>Name</th><th>Relation</th><th>Occupation</th><th>Mobile</th><th>Email</th>';
    html += '</tr></thead><tbody>';
    
    guardians.forEach(guardian => {
        html += '<tr>';
        html += `<td>${guardian.guardian_name || '-'}</td>`;
        html += `<td>${guardian.relation || '-'}</td>`;
        html += `<td>${guardian.occupation || '-'}</td>`;
        html += `<td>${guardian.mobile_number || '-'}</td>`;
        html += `<td>${guardian.email_address || '-'}</td>`;
        html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Populate siblings list
function populateSiblingsList(siblings) {
    const container = document.getElementById('view_siblings_list');
    
    if (!siblings || siblings.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm italic">No sibling information available</p>';
        return;
    }
    
    let html = '<div class="view-table">';
    html += '<table><thead><tr>';
    html += '<th>Name</th><th>Date of Birth</th><th>Gender</th><th>Institution</th>';
    html += '</tr></thead><tbody>';
    
    siblings.forEach(sibling => {
        html += '<tr>';
        html += `<td>${sibling.full_name || '-'}</td>`;
        html += `<td>${formatDate(sibling.date_of_birth) || '-'}</td>`;
        html += `<td>${sibling.gender || '-'}</td>`;
        html += `<td>${sibling.institution || '-'}</td>`;
        html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Switch between view tabs
function switchViewTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.view-tab[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.view-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Animate
    if (typeof gsap !== 'undefined') {
        gsap.from(`#${tabName}Tab`, {
            opacity: 0,
            y: 10,
            duration: 0.2
        });
    }
}

// Open view modal
function openViewModal() {
    const modal = document.getElementById('viewModal');
    if (!modal) return;
    
    setTimeout(() => {
        modal.classList.add('modal-active');
        document.body.style.overflow = 'hidden';
        
        // Reset to first tab
        switchViewTab('admission');
        
        // Animate
        if (typeof gsap !== 'undefined') {
            gsap.from('.view-modal-content', {
                scale: 0.95,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }, 50);
}

// Close view modal
function closeViewModal() {
    const modal = document.getElementById('viewModal');
    if (!modal) return;
    
    if (typeof gsap !== 'undefined') {
        gsap.to('.view-modal-content', {
            scale: 0.95,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                modal.classList.remove('modal-active');
                document.body.style.overflow = '';
                currentViewingApp = null;
            }
        });
    } else {
        modal.classList.remove('modal-active');
        document.body.style.overflow = '';
        currentViewingApp = null;
    }
}

// Setup view modal listeners
function setupViewModalListeners() {
    const modal = document.getElementById('viewModal');
    if (!modal) return;
    
    const modalClose = document.getElementById('viewModalClose');
    const modalCancelBtn = document.getElementById('viewModalCancelBtn');
    const modalOverlay = modal.querySelector('.modal-overlay');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeViewModal);
    }
    
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', closeViewModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeViewModal();
            }
        });
    }
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('modal-active')) {
            closeViewModal();
        }
    });
}

// Update application status
function updateApplicationStatus() {
    if (!currentViewingApp) return;
    
    const newStatus = document.getElementById('viewStatusSelect').value;
    
    frappe.call({
        method: 'frappe.client.set_value',
        args: {
            doctype: DOCTYPE_NAME,
            name: currentViewingApp,
            fieldname: 'application_status',
            value: newStatus
        },
        callback: function(r) {
            if (!r.exc) {
                showToast('Status updated successfully!', 'success');
                // Refresh the view
                viewApplication(currentViewingApp);
                // Refresh the main table
                loadDashboardData();
            } else {
                showToast('Failed to update status', 'error');
            }
        },
        error: function(err) {
            console.error('Error updating status:', err);
            showToast('Error updating status', 'error');
        }
    });
}

// Print application
function printApplication() {
    if (!currentViewingApp) return;
    
    // Use Frappe's print functionality
    if (frappe && frappe.set_route) {
        frappe.set_route('print', DOCTYPE_NAME, currentViewingApp);
    } else {
        showToast('Print functionality requires Frappe', 'info');
    }
}

// Format date helper
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Format datetime helper
function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
