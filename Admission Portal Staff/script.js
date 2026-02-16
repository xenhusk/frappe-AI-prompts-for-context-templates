// ========================================
// PCCR Admission Portal - ADMISSION STAFF
// For users with "Admission Staff" role
// ========================================

// === GLOBAL VARIABLES ===
const isHead = false; // HARDCODED for Admission Staff portal
let currentUserEmail = '';
let currentPage = 1;
let totalPages = 1;
let applicationsData = [];
let filteredData = [];
const itemsPerPage = 10;

// === DOCTYPE CONFIGURATION ===
const DOCTYPE_NAME = 'Student Applicant';

// === STATUS MAPPING ===
// Your DocType uses: PENDING, APPROVED, REJECTED (uppercase)
const STATUS_MAP = {
    'PENDING': { display: 'Pending', class: 'pending' },
    'APPROVED': { display: 'Approved', class: 'approved' },
    'REJECTED': { display: 'Rejected', class: 'rejected' }
};

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// === SECURITY CHECK ===
// Required roles for Admission Staff portal
const REQUIRED_ROLES = ['Admission Staff'];

function checkAccess() {
    // Check if user is logged in
    if (frappe.session.user === 'Guest') {
        console.warn('🔒 Access Denied: User not logged in');
        redirectToLogin('You must be logged in to access this page');
        return false;
    }
    
    // Get user roles from multiple sources (fallback chain)
    let userRoles = [];
    
    if (frappe.boot && frappe.boot.user && frappe.boot.user.roles) {
        userRoles = frappe.boot.user.roles;
        console.log('✓ Roles from frappe.boot:', userRoles);
    } else if (frappe.user_roles) {
        userRoles = frappe.user_roles;
        console.log('✓ Roles from frappe.user_roles:', userRoles);
    } else if (frappe.session.user_roles) {
        userRoles = frappe.session.user_roles;
        console.log('✓ Roles from frappe.session.user_roles:', userRoles);
    }
    
    // If no roles detected, allow access but log warning
    // This prevents infinite redirect loops on web pages where roles aren't loaded
    if (!userRoles || userRoles.length === 0) {
        console.warn('⚠️ Warning: Could not detect user roles');
        console.warn('User:', frappe.session.user);
        console.warn('Allowing access - Please ensure Web Page permissions are configured');
        console.warn('Required roles:', REQUIRED_ROLES);
        return true; // Allow access rather than blocking
    }
    
    // Check if user has any of the required roles
    const hasAccess = REQUIRED_ROLES.some(role => userRoles.includes(role));
    
    if (!hasAccess) {
        console.warn('🔒 Access Denied: User does not have required role');
        console.warn('Required roles:', REQUIRED_ROLES);
        console.warn('User roles:', userRoles);
        redirectToLogin('You do not have permission to access the Admission Staff Portal');
        return false;
    }
    
    console.log('✓ Access Granted: User has required role');
    return true;
}

function redirectToLogin(message) {
    // Show alert with message
    if (message) {
        frappe.msgprint({
            title: 'Access Denied',
            indicator: 'red',
            message: message
        });
        
        // Wait a moment for message to show, then redirect
        setTimeout(() => {
            window.location.href = '/login?redirect-to=' + encodeURIComponent(window.location.pathname);
        }, 1500);
    } else {
        // Immediate redirect
        window.location.href = '/login?redirect-to=' + encodeURIComponent(window.location.pathname);
    }
}

// Frappe Ready - With Security Check
if (typeof frappe !== 'undefined') {
    frappe.ready(function() {
        // SECURITY: Check access before initializing
        if (!checkAccess()) {
            return; // Stop execution if access denied
        }
        
        currentUserEmail = frappe.session.user;
        console.log('🎓 Initializing Admission Staff Portal for:', currentUserEmail);
        initializeDashboard();
    });
} else {
    // Fallback for standalone testing (Demo Mode)
    window.addEventListener('load', function() {
        setTimeout(() => {
            currentUserEmail = 'demo@example.com'; 
            console.log('⚠ Running in Demo Mode');
            initializeDashboard();
        }, 500);
    });
}

function initializeApp() {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) loadingScreen.style.display = 'none';
    }, 1200);
    
    // Preloader Safety Net - Force hide after 5 seconds no matter what
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            loadingScreen.style.display = 'none';
        }
    }, 5000);
    
    // Setup scroll to top
    setupScrollToTop();
}

// === DASHBOARD INITIALIZATION ===
async function initializeDashboard() {
    // Check if Frappe is available
    if (typeof frappe === 'undefined') {
        console.warn('Frappe not available. Using demo mode.');
        loadDemoData();
        return;
    }

    // Set user info (Admission Staff portal)
    const userName = frappe.session.user_fullname || frappe.session.user || 'User';
    currentUserEmail = frappe.session.user;
    
    document.getElementById('userName').textContent = userName;
    document.getElementById('userRole').textContent = 'Admission Staff';
    document.getElementById('dashboardTitle').textContent = 'Admission Staff Workspace';
    
    // Setup event listeners
    setupEventListeners();
    
    // Load dashboard data
    await loadDashboardData();
    
    // Setup sidebar toggle for mobile
    setupSidebarToggle();
    
    // Setup modal event listeners
    setupModalListeners();
    
    setupViewModalListeners();
    
    // Setup table button event listeners
    setupTableButtonListeners();
    
    // Initialize sections - start with applications
    initializeSections();
}

// === TABLE BUTTON EVENT LISTENERS ===
function setupTableButtonListeners() {
    const tbody = document.getElementById('applicationsTableBody');
    if (!tbody) return;
    
    // Use event delegation for dynamically created buttons
    tbody.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Find the clicked button (or parent if icon was clicked)
        let button = e.target;
        if (button.tagName === 'I') {
            button = button.parentElement;
        }
        
        if (!button.classList.contains('btn-action')) return;
        
        const appName = button.getAttribute('data-app-name');
        if (!appName) return;
        
        if (button.classList.contains('btn-view')) {
            viewApplication(appName);
        } else if (button.classList.contains('btn-assign')) {
            openAssignmentModal(appName);
        }
    }, true);
}

// === MODAL EVENT LISTENERS ===
function setupModalListeners() {
    console.log('Setting up modal listeners...');
    
    // Staff portal doesn't have assignment modal
    // This function is not needed for staff portal
    console.log('✓ Staff portal - No assignment modal needed');
    return;
    
    const modal = document.getElementById('assignmentModal');
    if (!modal) {
        console.log('Assignment modal not found (expected for Staff portal)');
        return;
    }
    
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalContent = modal.querySelector('.modal-content');
    const modalClose = modal.querySelector('.modal-close');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const modalAssignBtn = document.getElementById('modalAssignBtn');
    
    console.log('Modal elements found:', {
        modal: !!modal,
        overlay: !!modalOverlay,
        content: !!modalContent,
        close: !!modalClose,
        cancel: !!modalCancelBtn,
        assign: !!modalAssignBtn
    });
    
    // Close modal when clicking overlay (backdrop) - use normal bubble phase
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                console.log('Overlay clicked');
                closeAssignmentModal();
            }
        });
    }
    
    // Close modal when clicking X button - use normal bubble phase
    if (modalClose) {
        modalClose.addEventListener('click', function(e) {
            console.log('X button clicked');
            e.stopPropagation();
            closeAssignmentModal();
        });
    }
    
    // Close modal when clicking Cancel button - use normal bubble phase
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', function(e) {
            console.log('Cancel button clicked');
            e.stopPropagation();
            closeAssignmentModal();
        });
    }
    
    // Confirm assignment when clicking Assign button - use normal bubble phase
    if (modalAssignBtn) {
        modalAssignBtn.addEventListener('click', function(e) {
            console.log('Assign button clicked');
            e.stopPropagation();
            confirmAssignment();
        });
    } else {
        console.error('modalAssignBtn not found');
    }
    
    // Prevent clicks on modal content from closing modal (but NOT on buttons!)
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            // Only stop propagation if NOT clicking on a button
            if (!e.target.closest('button') && !e.target.closest('.form-select')) {
                e.stopPropagation();
            }
        });
    }
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('modal-active')) {
            console.log('ESC key pressed');
            closeAssignmentModal();
        }
    });
    
    console.log('Modal listeners setup complete');
}

// === INITIALIZE SECTIONS ===
function initializeSections() {
    // Set applications as default active section
    setTimeout(() => {
        switchSection('applications');
        
        // Update nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === 'applications') {
                item.classList.add('active');
            }
        });
    }, 100);
}

// === EVENT LISTENERS ===
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterApplications, 300));
    }
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterApplications);
    }
    
    // Pagination
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    
    if (prevPage) {
        prevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
    }
    
    if (nextPage) {
        nextPage.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });
    }
    
    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Switch sections
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
}

// === DATA LOADING ===
async function loadDashboardData() {
    if (typeof frappe === 'undefined') {
        loadDemoData();
        return;
    }

    try {
        // Staff only fetch applications assigned to them
        let filters = {
            assigned_staff: frappe.session.user
        };
        
        // Fetch applications - UPDATED DOCTYPE NAME
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: DOCTYPE_NAME,
                fields: ['name', 'first_name', 'middle_name', 'last_name', 
                         'program', 'student_category', 'application_status', 
                         'application_date', 'creation', 'assigned_staff', 
                         'student_email_id', 'student_mobile_number'], // Ensure assigned_staff is fetched
                filters: filters, // <--- This applies the strict filter
                limit_page_length: 999,
                order_by: 'creation desc'
            },
            callback: function(r) {
                if (r.message) {
                    applicationsData = r.message;
                    filteredData = [...applicationsData];
                    updateMetricsEnhanced();
                    renderTable();
                    initializeCharts();
                } else {
                    showEmptyState();
                }
            },
            error: function(r) {
                console.error('Error loading applications:', r);
                showToast('Failed to load applications. Please refresh the page.', 'error');
            }
        });
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Failed to load dashboard data.', 'error');
    }
}

// === DEMO DATA (FOR TESTING) ===
function loadDemoData() {
    console.log('Loading demo data...');
    
    // Set demo user info
    document.getElementById('userName').textContent = 'Demo User';
    document.getElementById('userRole').textContent = 'Admission Head';
    document.getElementById('dashboardTitle').textContent = 'Admission Head Control Panel';
    
    // Create demo applications with UPPERCASE status
    applicationsData = [
        {
            name: '24-000001',
            first_name: 'Juan',
            middle_name: 'Cruz',
            last_name: 'Dela Cruz',
            program: 'BS Criminology',
            student_category: 'New Student',
            application_status: 'PENDING',
            application_date: '2024-02-01',
            creation: '2024-02-01',
            assigned_staff: '',
            student_email_id: 'juan.delacruz@example.com',
            student_mobile_number: '09123456789'
        },
        {
            name: '24-000002',
            first_name: 'Maria',
            middle_name: 'Garcia',
            last_name: 'Santos',
            program: 'BS Criminal Justice',
            student_category: 'Transferee',
            application_status: 'APPROVED',
            application_date: '2024-02-02',
            creation: '2024-02-02',
            assigned_staff: 'staff@example.com',
            student_email_id: 'maria.santos@example.com',
            student_mobile_number: '09234567890'
        },
        {
            name: '24-000003',
            first_name: 'Jose',
            middle_name: 'Rizal',
            last_name: 'Reyes',
            program: 'BS Criminology',
            student_category: 'New Student',
            application_status: 'REJECTED',
            application_date: '2024-02-03',
            creation: '2024-02-03',
            assigned_staff: 'staff@example.com',
            student_email_id: 'jose.reyes@example.com',
            student_mobile_number: '09345678901'
        },
        {
            name: '24-000004',
            first_name: 'Ana',
            middle_name: 'Luna',
            last_name: 'Garcia',
            program: 'BS Forensic Science',
            student_category: 'Second Courser',
            application_status: 'PENDING',
            application_date: '2024-02-04',
            creation: '2024-02-04',
            assigned_staff: '',
            student_email_id: 'ana.garcia@example.com',
            student_mobile_number: '09456789012'
        },
        {
            name: '24-000005',
            first_name: 'Pedro',
            middle_name: 'Aguinaldo',
            last_name: 'Martinez',
            program: 'BS Criminology',
            student_category: 'New Student',
            application_status: 'APPROVED',
            application_date: '2024-02-05',
            creation: '2024-02-05',
            assigned_staff: 'staff@example.com',
            student_email_id: 'pedro.martinez@example.com',
            student_mobile_number: '09567890123'
        }
    ];
    
    isHead = true;
    document.getElementById('assignedHeader').style.display = 'table-cell';
    
    filteredData = [...applicationsData];
    updateMetrics();
    renderTable();
    setupEventListeners();
    setupSidebarToggle();
}

// === METRICS CALCULATION ===
function updateMetrics() {
    const total = applicationsData.length;
    
    // Count PENDING status (uppercase)
    const pending = applicationsData.filter(app => 
        app.application_status === 'PENDING' || !app.application_status
    ).length;
    
    let myAssignments = 0;
    if (isHead) {
        myAssignments = applicationsData.filter(app => 
            !app.assigned_staff || app.assigned_staff === ''
        ).length;
    } else {
        myAssignments = applicationsData.filter(app => 
            app.assigned_staff === (typeof frappe !== 'undefined' ? frappe.session.user : '')
        ).length;
    }
    
    // Update with animation
    animateCounter('totalApplications', total);
    animateCounter('pendingReview', pending);
    animateCounter('myAssignments', myAssignments);
}

// === COUNTER ANIMATION ===
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    const duration = 1000;
    const steps = 30;
    const increment = (targetValue - currentValue) / steps;
    let current = currentValue;
    let step = 0;
    
    const timer = setInterval(() => {
        step++;
        current += increment;
        element.textContent = Math.round(current);
        
        if (step >= steps) {
            element.textContent = targetValue;
            clearInterval(timer);
        }
    }, duration / steps);
}

// === TABLE RENDERING ===
function renderTable() {
    const tbody = document.getElementById('applicationsTableBody');
    if (!tbody) return;
    
    totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    if (pageData.length === 0) {
        showEmptyState();
        return;
    }
    
    // Hide "Assigned To" column (Staff doesn't see it)
    const assignedHeader = document.getElementById('assignedHeader');
    if (assignedHeader) {
        assignedHeader.style.display = 'none';
    }
    
    let html = '';
    pageData.forEach(app => {
        // Build full name with middle name support
        const fullName = [app.first_name, app.middle_name, app.last_name]
            .filter(n => n)
            .join(' ') || 'N/A';
        
        // Get status - handle uppercase
        const rawStatus = app.application_status || 'PENDING';
        const statusInfo = STATUS_MAP[rawStatus] || { 
            display: rawStatus, 
            class: rawStatus.toLowerCase() 
        };
        
        const date = formatDate(app.application_date || app.creation);
        const initial = (app.first_name?.[0] || 'S').toUpperCase();
        
        // Staff doesn't have assign button or assigned column
        const assignBtn = '';
        const assignedColumn = '';
        
        html += `
                <tr class="table-row">
                    <td class="app-id">${app.name}</td>
                    <td>
                        <div class="name-cell">
                            <div class="avatar">${initial}</div>
                            <div>
                                <div>${fullName}</div>
                                ${app.student_category ? `<small class="text-muted">${app.student_category}</small>` : ''}
                            </div>
                        </div>
                    </td>
                    <td>${app.program || 'N/A'}</td>
                    <td>${date}</td>
                    <td><span class="status-badge status-${statusInfo.class}">${statusInfo.display}</span></td>
                    
                    ${assignedColumn}  <td class="action-cell">
                        <button class="btn-action btn-view" data-app-name="${app.name}">
                            <i class="fas fa-eye"></i> View
                        </button>
                        ${assignBtn}   </td>
                </tr>
            `;
    });
    
    tbody.innerHTML = html;
    updatePagination();
    
    // Setup button event listeners using event delegation
    setupTableButtonListeners();
}

// === EMPTY STATE ===
function showEmptyState() {
    const tbody = document.getElementById('applicationsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No applications assigned to you</p>
            </td>
        </tr>
    `;
}

// === FILTERING ===
function filterApplications() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const statusValue = statusFilter ? statusFilter.value : '';
    
    filteredData = applicationsData.filter(app => {
        const matchesSearch = 
            (app.name && app.name.toLowerCase().includes(searchTerm)) ||
            (app.first_name && app.first_name.toLowerCase().includes(searchTerm)) ||
            (app.middle_name && app.middle_name.toLowerCase().includes(searchTerm)) ||
            (app.last_name && app.last_name.toLowerCase().includes(searchTerm)) ||
            (app.program && app.program.toLowerCase().includes(searchTerm)) ||
            (app.student_email_id && app.student_email_id.toLowerCase().includes(searchTerm)) ||
            (app.student_category && app.student_category.toLowerCase().includes(searchTerm));
        
        // Handle uppercase status comparison - statusValue is already uppercase from HTML
        const matchesStatus = !statusValue || app.application_status === statusValue;
        
        return matchesSearch && matchesStatus;
    });
    
    currentPage = 1;
    renderTable();
}

// === PAGINATION ===
function updatePagination() {
    const paginationInfo = document.getElementById('paginationInfo');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (paginationInfo) {
        paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
}

// === ASSIGNMENT MODAL (HEAD ONLY) ===
function loadStaffMembers() {
    if (typeof frappe === 'undefined') {
        // Demo staff for testing
        const select = document.getElementById('staffSelect');
        const demoStaff = [
            { name: 'staff1@pccr.edu.ph', full_name: 'Staff Member 1' },
            { name: 'staff2@pccr.edu.ph', full_name: 'Staff Member 2' },
            { name: 'staff3@pccr.edu.ph', full_name: 'Staff Member 3' }
        ];
        
        demoStaff.forEach(user => {
            const option = document.createElement('option');
            option.value = user.name;
            option.textContent = user.full_name;
            option.setAttribute('data-fullname', user.full_name);
            select.appendChild(option);
        });
        return;
    }

    // Fetch users with Admission Staff role by filtering client-side
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'User',
            fields: ['name', 'full_name', 'email'],
            filters: {
                enabled: 1,
                user_type: 'System User'
            },
            limit_page_length: 999
        },
        callback: async function(r) {
            if (r.message && r.message.length > 0) {
                const select = document.getElementById('staffSelect');
                // Clear existing options except the first one
                while (select.options.length > 1) {
                    select.remove(1);
                }
                
                const admissionStaff = [];
                
                // Check each user for Admission Staff role
                const checkPromises = r.message.map(user => {
                    return new Promise((resolve) => {
                        frappe.call({
                            method: 'frappe.client.get',
                            args: {
                                doctype: 'User',
                                name: user.name
                            },
                            callback: function(user_detail) {
                                if (user_detail.message && user_detail.message.roles) {
                                    const hasAdmissionStaffRole = user_detail.message.roles.some(
                                        role => role.role === 'Admission Staff'
                                    );
                                    
                                    if (hasAdmissionStaffRole) {
                                        admissionStaff.push({
                                            name: user.name,
                                            full_name: user.full_name || user.name
                                        });
                                    }
                                }
                                resolve();
                            },
                            error: function() {
                                resolve();
                            }
                        });
                    });
                });
                
                // Wait for all checks to complete
                await Promise.all(checkPromises);
                
                // Sort alphabetically
                admissionStaff.sort((a, b) => a.full_name.localeCompare(b.full_name));
                
                // Add to dropdown
                admissionStaff.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.name;
                    option.textContent = user.full_name;
                    option.setAttribute('data-fullname', user.full_name);
                    select.appendChild(option);
                });
                
                console.log(`Loaded ${admissionStaff.length} Admission Staff members`);
                
                if (admissionStaff.length === 0) {
                    showToast('No users found with "Admission Staff" role', 'warning');
                }
            } else {
                console.warn('No users found');
            }
        },
        error: function(err) {
            console.error('Error loading staff members:', err);
            showToast('Failed to load staff members', 'error');
        }
    });
}

function openAssignmentModal(applicationId, event) {
    // Prevent event propagation if event is passed
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }
    
    // Set the application ID
    const applicationIdField = document.getElementById('selectedApplicationId');
    if (applicationIdField) {
        applicationIdField.value = applicationId;
    }
    
    // Get modal element
    const modal = document.getElementById('assignmentModal');
    if (!modal) {
        console.error('Assignment modal not found');
        return;
    }
    
    // Use longer timeout to ensure event propagation has completely settled
    setTimeout(() => {
        modal.classList.add('modal-active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        console.log('Modal opened for application:', applicationId);
        
        // GSAP animation - animate TO final state
        if (typeof gsap !== 'undefined') {
            // Set initial state
            gsap.set('.modal-content', {
                scale: 0.9,
                opacity: 0
            });
            // Animate to final state
            gsap.to('.modal-content', {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        }
    }, 100);
}

function closeAssignmentModal() {
    const modal = document.getElementById('assignmentModal');
    if (!modal) return;
    
    if (typeof gsap !== 'undefined') {
        gsap.to('.modal-content', {
            scale: 0.9,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                modal.classList.remove('modal-active');
                document.body.style.overflow = ''; // Restore scrolling
                document.getElementById('staffSelect').value = '';
                document.getElementById('selectedApplicationId').value = '';
            }
        });
    } else {
        modal.classList.remove('modal-active');
        document.body.style.overflow = ''; // Restore scrolling
        document.getElementById('staffSelect').value = '';
        document.getElementById('selectedApplicationId').value = '';
    }
    
    console.log('Modal closed');
}

function confirmAssignment() {
    console.log('confirmAssignment called');
    
    const applicationId = document.getElementById('selectedApplicationId').value;
    const staffSelect = document.getElementById('staffSelect');
    const staffMemberEmail = staffSelect.value;
    const selectedOption = staffSelect.options[staffSelect.selectedIndex];
    const staffMemberName = selectedOption.getAttribute('data-fullname') || selectedOption.text;
    
    console.log('Application ID:', applicationId);
    console.log('Selected Staff Email:', staffMemberEmail);
    console.log('Selected Staff Name:', staffMemberName);
    
    if (!staffMemberEmail) {
        showToast('Please select a staff member.', 'warning');
        return;
    }
    
    if (!applicationId) {
        showToast('Application ID is missing.', 'error');
        return;
    }
    
    if (typeof frappe === 'undefined') {
        // Demo mode
        showToast('Assignment successful! (Demo Mode)', 'success');
        closeAssignmentModal();
        
        // Update demo data
        const app = applicationsData.find(a => a.name === applicationId);
        if (app) {
            app.assigned_staff = staffMemberEmail;
            app.agent = staffMemberName;
            filterApplications();
            updateMetrics();
        }
        return;
    }
    
    // Update both assigned_staff (email) and agent (full name)
    console.log('Calling frappe.client.set_value for multiple fields...');
    frappe.call({
        method: 'frappe.client.set_value',
        args: {
            doctype: DOCTYPE_NAME,
            name: applicationId,
            fieldname: {
                'assigned_staff': staffMemberEmail,
                'agent': staffMemberName
            }
        },
        callback: function(r) {
            console.log('Assignment response:', r);
            if (!r.exc) {
                showToast(`Application assigned to ${staffMemberName} successfully!`, 'success');
                closeAssignmentModal();
                loadDashboardData();
            } else {
                console.error('Assignment error:', r.exc);
                showToast('Failed to assign application.', 'error');
            }
        },
        error: function(err) {
            console.error('Assignment API error:', err);
            showToast('Error assigning application. Check console.', 'error');
        }
    });
}

// === VIEW APPLICATION ===
// (Function moved to line 1116 - more comprehensive implementation)

// === REFRESH DASHBOARD ===
function refreshDashboard() {
    showToast('Refreshing dashboard...', 'info');
    loadDashboardData();
}

// === SECTION SWITCHING ===
function switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Show selected section
    const sectionMap = {
        'overview': 'overviewSection',
        'applications': 'applicationsSection',
        'reports': 'reportsSection',
        'settings': 'settingsSection'
    };
    
    const sectionId = sectionMap[sectionName];
    const targetSection = document.getElementById(sectionId);
    
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
        
        // Initialize reports charts when switching to reports section
        if (sectionName === 'reports' && applicationsData.length > 0) {
            setTimeout(() => renderReportsCharts(), 100);
        }
        
        // Initialize settings when switching to settings section
        if (sectionName === 'settings') {
            initializeSettings();
        }
    }
}

// === SIDEBAR TOGGLE ===
function setupSidebarToggle() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('dashboardSidebar');
    
    if (!toggle || !sidebar) return;
    
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('sidebar-mobile-active');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                sidebar.classList.remove('sidebar-mobile-active');
            }
        }
    });
}

// === SCROLL TO TOP ===
function setupScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// === NOTIFICATIONS ===
function showNotifications() {
    showToast('You have 3 new notifications', 'info');
}

// === TOAST NOTIFICATIONS ===
function showToast(message, type = 'success') {
    // Use Frappe's msgprint if available
    if (typeof frappe !== 'undefined' && frappe.show_alert) {
        const indicators = {
            success: 'green',
            error: 'red',
            warning: 'yellow',
            info: 'blue'
        };
        
        frappe.show_alert({
            message: message,
            indicator: indicators[type] || 'blue'
        });
        return;
    }
    
    // Fallback to custom toast
    const toast = document.createElement('div');
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.className = 'toast-notification';
    toast.style.backgroundColor = '#24292e';
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// === UTILITY FUNCTIONS ===
// (formatDate function moved to line 1510 - more comprehensive implementation)

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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
    
    // Staff can only approve/reject applications assigned to them
    const modalFooter = document.querySelector('#viewModal .modal-footer');
    const btnApprove = document.getElementById('btnApprove');
    const btnReject = document.getElementById('btnReject');
    const btnPending = document.getElementById('btnPending');
    const currentStatus = data.application_status;
    
    if (modalFooter) {
        if (data.assigned_staff === frappe.session.user) {
            modalFooter.style.display = 'flex';
            
            // Enable/disable buttons based on current status
            if (btnApprove) {
                btnApprove.disabled = (currentStatus === 'APPROVED');
            }
            if (btnReject) {
                btnReject.disabled = (currentStatus === 'REJECTED');
            }
            if (btnPending) {
                btnPending.disabled = (currentStatus === 'PENDING' || !currentStatus);
            }
        } else {
            modalFooter.style.display = 'none';
        }
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
// Switch between view tabs
function switchViewTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.view-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTabBtn = document.querySelector(`.view-tab[data-tab="${tabName}"]`);
    if (activeTabBtn) activeTabBtn.classList.add('active');
    
    // Hide all tab contents, show target
    document.querySelectorAll('.view-tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });
    const targetTab = document.getElementById(`${tabName}Tab`);
    if (targetTab) {
        targetTab.classList.add('active');
        targetTab.style.display = 'block';
    }
}

// Open view modal
function openViewModal() {
    const modal = document.getElementById('viewModal');
    if (!modal) return;
    
    modal.classList.add('modal-active');
    document.body.style.overflow = 'hidden';
    switchViewTab('admission');
}

// Close view modal
function closeViewModal() {
    const modal = document.getElementById('viewModal');
    if (!modal) return;
    
    modal.classList.remove('modal-active');
    document.body.style.overflow = '';
    currentViewingApp = null;
}

// Setup view modal listeners
function setupViewModalListeners() {
    const modal = document.getElementById('viewModal');
    if (!modal) return;
    
    const modalClose = document.getElementById('viewModalClose');
    const modalOverlay = modal.querySelector('.modal-overlay');
    
    // New Buttons
    const btnApprove = document.getElementById('btnApprove');
    const btnReject = document.getElementById('btnReject');
    
    // Close on X icon
    if (modalClose) {
        modalClose.addEventListener('click', closeViewModal);
    }
    
    // Close on Overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeViewModal();
            }
        });
    }

    // Approve Button Listener
    if (btnApprove) {
        btnApprove.addEventListener('click', function() {
            updateApplicationStatus('APPROVED');
        });
    }

    // Reject Button Listener
    if (btnReject) {
        btnReject.addEventListener('click', function() {
            updateApplicationStatus('REJECTED');
        });
    }
    
    // Pending Button Listener
    const btnPending = document.getElementById('btnPending');
    if (btnPending) {
        btnPending.addEventListener('click', function() {
            updateApplicationStatus('PENDING');
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
// Update application status
function updateApplicationStatus(newStatus) {
    if (!currentViewingApp) return;
    
    // Validation: Ensure we have a valid status
    if (!newStatus) {
        showToast('Invalid status update', 'error');
        return;
    }

    // Confirm action
    if (!confirm(`Are you sure you want to mark this application as ${newStatus}?`)) {
        return;
    }
    
    // Demo Mode Logic
    if (typeof frappe === 'undefined') {
        showToast(`Application ${newStatus} successfully! (Demo Mode)`, 'success');
        
        // Update local data for demo feel
        const app = applicationsData.find(a => a.name === currentViewingApp);
        if (app) { 
            app.application_status = newStatus; 
        }
        
        viewApplication(currentViewingApp); // Refresh modal view
        loadDashboardData(); // Refresh table
        return;
    }
    
    // Frappe API Call
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
                showToast(`Application ${newStatus} successfully!`, 'success');
                // Refresh the view modal to show new status tag
                viewApplication(currentViewingApp);
                // Refresh the main dashboard table
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


// ========================================
// CHARTS & ANALYTICS (ADMISSION STAFF)
// ========================================

let chartsInitialized = false;
let chartInstances = {};

// Initialize overview charts
function initializeCharts() {
    if (chartsInitialized) return;
    if (typeof ApexCharts === 'undefined') {
        console.warn('ApexCharts not loaded');
        return;
    }
    
    renderMyStatusChart();
    renderMyActivityChart();
    chartsInitialized = true;
}

// Render detailed charts for Reports section
function renderReportsCharts() {
    if (typeof ApexCharts === 'undefined') return;
    
    renderMyProcessingTimelineChart();
    renderMyProgramChart();
    renderMyWeeklyChart();
    renderMyStatsTable();
}

// === OVERVIEW CHARTS ===

// My Status Distribution (Donut Chart)
function renderMyStatusChart() {
    const pending = applicationsData.filter(app => app.application_status === 'PENDING').length;
    const approved = applicationsData.filter(app => app.application_status === 'APPROVED').length;
    const rejected = applicationsData.filter(app => app.application_status === 'REJECTED').length;
    
    const options = {
        series: [pending, approved, rejected],
        chart: {
            type: 'donut',
            height: 300,
            fontFamily: 'Inter, sans-serif'
        },
        labels: ['Pending', 'Approved', 'Rejected'],
        colors: ['#fbbf24', '#4ade80', '#f87171'],
        legend: {
            position: 'bottom',
            fontSize: '14px'
        },
        dataLabels: {
            enabled: true,
            formatter: function(val, opts) {
                return opts.w.config.series[opts.seriesIndex];
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#1f2937'
                        }
                    }
                }
            }
        }
    };
    
    if (chartInstances.myStatus) {
        chartInstances.myStatus.destroy();
    }
    
    const chart = new ApexCharts(document.querySelector("#myStatusChart"), options);
    chart.render();
    chartInstances.myStatus = chart;
}

// My Activity (Last 7 Days)
function renderMyActivityChart() {
    const last7Days = getLast7Days();
    const activityData = calculateMyDailyActivity(last7Days);
    
    const options = {
        series: [{
            name: 'Processed',
            data: activityData.counts
        }],
        chart: {
            type: 'bar',
            height: 300,
            fontFamily: 'Inter, sans-serif',
            toolbar: {
                show: false
            }
        },
        colors: ['#60a5fa'],
        xaxis: {
            categories: activityData.dates
        },
        yaxis: {
            title: {
                text: 'Applications'
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '70%'
            }
        },
        dataLabels: {
            enabled: true
        },
        grid: {
            borderColor: '#f3f4f6'
        }
    };
    
    if (chartInstances.myActivity) {
        chartInstances.myActivity.destroy();
    }
    
    const chart = new ApexCharts(document.querySelector("#myActivityChart"), options);
    chart.render();
    chartInstances.myActivity = chart;
}

// === REPORTS SECTION CHARTS ===

// My Processing Timeline (Area Chart)
function renderMyProcessingTimelineChart() {
    const last30Days = getLast30Days();
    const timelineData = calculateMyTimeline(last30Days);
    
    const options = {
        series: [{
            name: 'Approved',
            data: timelineData.approved
        }, {
            name: 'Rejected',
            data: timelineData.rejected
        }],
        chart: {
            type: 'area',
            height: 350,
            fontFamily: 'Inter, sans-serif',
            stacked: false
        },
        colors: ['#4ade80', '#f87171'],
        xaxis: {
            categories: timelineData.dates,
            labels: {
                rotate: -45
            }
        },
        yaxis: {
            title: {
                text: 'Applications'
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.6,
                opacityTo: 0.1
            }
        },
        legend: {
            position: 'top'
        },
        dataLabels: {
            enabled: false
        }
    };
    
    if (chartInstances.myTimeline) {
        chartInstances.myTimeline.destroy();
    }
    
    const chart = new ApexCharts(document.querySelector("#myProcessingTimelineChart"), options);
    chart.render();
    chartInstances.myTimeline = chart;
}

// My Program Distribution
function renderMyProgramChart() {
    const programCounts = {};
    applicationsData.forEach(app => {
        const program = app.program || 'Not Specified';
        programCounts[program] = (programCounts[program] || 0) + 1;
    });
    
    const options = {
        series: [{
            data: Object.values(programCounts)
        }],
        chart: {
            type: 'bar',
            height: 350,
            fontFamily: 'Inter, sans-serif'
        },
        plotOptions: {
            bar: {
                borderRadius: 8,
                horizontal: true,
                distributed: true
            }
        },
        colors: ['#f87171', '#4ade80', '#fbbf24', '#60a5fa', '#94a3b8', '#a78bfa'],
        xaxis: {
            categories: Object.keys(programCounts)
        },
        dataLabels: {
            enabled: true
        },
        legend: {
            show: false
        }
    };
    
    if (chartInstances.myProgram) {
        chartInstances.myProgram.destroy();
    }
    
    const chart = new ApexCharts(document.querySelector("#myProgramChart"), options);
    chart.render();
    chartInstances.myProgram = chart;
}

// My Weekly Activity
function renderMyWeeklyChart() {
    const weeklyData = calculateMyWeeklyData();
    
    const options = {
        series: [{
            name: 'Processed',
            data: weeklyData.counts
        }],
        chart: {
            type: 'bar',
            height: 350,
            fontFamily: 'Inter, sans-serif'
        },
        colors: ['#60a5fa'],
        xaxis: {
            categories: weeklyData.weeks
        },
        yaxis: {
            title: {
                text: 'Applications'
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 8,
                columnWidth: '60%'
            }
        },
        dataLabels: {
            enabled: true
        }
    };
    
    if (chartInstances.myWeekly) {
        chartInstances.myWeekly.destroy();
    }
    
    const chart = new ApexCharts(document.querySelector("#myWeeklyChart"), options);
    chart.render();
    chartInstances.myWeekly = chart;
}

// === DATA CALCULATION HELPERS ===

function getLast7Days() {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        days.push(date);
    }
    return days;
}

function getLast30Days() {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        days.push(date);
    }
    return days;
}

function calculateMyDailyActivity(days) {
    const dates = days.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const counts = days.map(day => {
        return applicationsData.filter(app => {
            const modDate = new Date(app.modified);
            return modDate.toDateString() === day.toDateString() && 
                   (app.application_status === 'APPROVED' || app.application_status === 'REJECTED');
        }).length;
    });
    
    return { dates, counts };
}

function calculateMyTimeline(days) {
    const dates = days.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const approved = [];
    const rejected = [];
    
    days.forEach(day => {
        const dayStr = day.toDateString();
        approved.push(applicationsData.filter(app => 
            app.application_status === 'APPROVED' && new Date(app.modified).toDateString() === dayStr
        ).length);
        rejected.push(applicationsData.filter(app => 
            app.application_status === 'REJECTED' && new Date(app.modified).toDateString() === dayStr
        ).length);
    });
    
    return { dates, approved, rejected };
}

function calculateMyWeeklyData() {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const counts = [];
    const today = new Date();
    
    for (let i = 0; i < 4; i++) {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - (i + 1) * 7);
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() - i * 7);
        
        const count = applicationsData.filter(app => {
            const modDate = new Date(app.modified);
            return modDate >= weekStart && modDate < weekEnd &&
                   (app.application_status === 'APPROVED' || app.application_status === 'REJECTED');
        }).length;
        
        counts.unshift(count);
    }
    
    return { weeks, counts };
}

// My Statistics Table
function renderMyStatsTable() {
    const tbody = document.getElementById('myStatsTableBody');
    if (!tbody) return;
    
    const total = applicationsData.length;
    const pending = applicationsData.filter(app => app.application_status === 'PENDING').length;
    const approved = applicationsData.filter(app => app.application_status === 'APPROVED').length;
    const rejected = applicationsData.filter(app => app.application_status === 'REJECTED').length;
    const processed = approved + rejected;
    const approvalRate = processed > 0 ? ((approved / processed) * 100).toFixed(1) : 0;
    
    // Last 30 days processed
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const processed30d = applicationsData.filter(app => 
        (app.application_status === 'APPROVED' || app.application_status === 'REJECTED') &&
        new Date(app.modified) >= thirtyDaysAgo
    ).length;
    
    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const processed7d = applicationsData.filter(app => 
        (app.application_status === 'APPROVED' || app.application_status === 'REJECTED') &&
        new Date(app.modified) >= sevenDaysAgo
    ).length;
    
    const stats = [
        { metric: 'Total Assigned to Me', value: total, status: '📊 All time' },
        { metric: 'Pending My Review', value: pending, status: pending > 0 ? '⚠ Action needed' : '✓ All done' },
        { metric: 'Total Approved', value: approved, status: '✓ Completed' },
        { metric: 'Total Rejected', value: rejected, status: '✗ Declined' },
        { metric: 'Processed (Last 30d)', value: processed30d, status: `${processed30d} apps` },
        { metric: 'Processed (Last 7d)', value: processed7d, status: `${processed7d} apps` },
        { metric: 'My Approval Rate', value: `${approvalRate}%`, status: approvalRate > 70 ? '✓ Good' : '⚠ Review' }
    ];
    
    let html = '';
    stats.forEach(stat => {
        html += `
            <tr>
                <td style="font-weight: 600;">${stat.metric}</td>
                <td style="font-size: 1.125rem; font-weight: 700; color: #24292e;">${stat.value}</td>
                <td style="color: #6b7280;">${stat.status}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

// === UPDATE METRICS WITH ENHANCED DATA ===
function updateMetricsEnhanced() {
    const total = applicationsData.length;
    const pending = applicationsData.filter(app => app.application_status === 'PENDING' || !app.application_status).length;
    
    // Last 30 days completed
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const completed30d = applicationsData.filter(app => 
        (app.application_status === 'APPROVED' || app.application_status === 'REJECTED') &&
        new Date(app.modified) >= thirtyDaysAgo
    ).length;
    
    const approvedTotal = applicationsData.filter(app => app.application_status === 'APPROVED').length;
    const rejectedTotal = applicationsData.filter(app => app.application_status === 'REJECTED').length;
    const approvalRate = (approvedTotal + rejectedTotal) > 0 ? 
        Math.round((approvedTotal / (approvedTotal + rejectedTotal)) * 100) : 0;
    
    // Update counters
    animateCounter('totalApplications', total);
    animateCounter('pendingReview', pending);
    animateCounter('myAssignments', completed30d);
    
    const approvalRateEl = document.getElementById('myApprovalRate');
    if (approvalRateEl) {
        approvalRateEl.textContent = approvalRate + '%';
    }
}

// ========================================
// SETTINGS & LOGOUT
// ========================================

// Initialize settings page with user info
function initializeSettings() {
    const emailElement = document.getElementById('settingsUserEmail');
    if (emailElement && currentUserEmail) {
        emailElement.textContent = currentUserEmail;
    }
}

// Handle logout
function handleLogout() {
    // Confirm logout
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }
    
    console.log('🔐 Logging out user:', currentUserEmail);
    
    // Demo Mode
    if (typeof frappe === 'undefined') {
        showToast('Logged out successfully (Demo Mode)', 'info');
        setTimeout(() => {
            window.location.href = 'https://abakada-coco.s.frappe.cloud/login?redirect-to=%2F#login';
        }, 500);
        return;
    }
    
    // Show loading message
    showToast('Logging out...', 'info');
    
    // Frappe logout
    frappe.call({
        method: 'logout',
        callback: function(r) {
            console.log('✓ Logout successful');
            // Redirect to login page
            window.location.href = 'https://abakada-coco.s.frappe.cloud/login?redirect-to=%2F#login';
        },
        error: function(err) {
            console.error('Logout error:', err);
            // Force redirect even on error
            window.location.href = 'https://abakada-coco.s.frappe.cloud/login?redirect-to=%2F#login';
        }
    });
}

// === EXPOSE FUNCTIONS TO WINDOW ===
window.viewApplication = viewApplication;
window.openAssignmentModal = openAssignmentModal;
window.closeAssignmentModal = closeAssignmentModal;
window.confirmAssignment = confirmAssignment;
window.refreshDashboard = refreshDashboard;
window.showNotifications = showNotifications;
window.switchViewTab = switchViewTab;
window.printApplication = printApplication;
window.handleLogout = handleLogout;

// === CONSOLE MESSAGE ===
console.log('%cAdmission Portal - Staff', 'color: #24292e; font-size: 14px; font-weight: 600;');
console.log('%cUsing DocType: ' + DOCTYPE_NAME, 'color: #666; font-size: 12px;');
