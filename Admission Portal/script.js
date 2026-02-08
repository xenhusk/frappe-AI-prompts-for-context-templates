// ========================================
// PCCR Admission Portal - JavaScript Logic
// UPDATED for Student Applicant DocType
// ========================================

// === GLOBAL VARIABLES ===
let isHead = false;
let currentPage = 1;
let totalPages = 1;
let applicationsData = [];
let filteredData = [];
const itemsPerPage = 10;

// === DOCTYPE CONFIGURATION ===
const DOCTYPE_NAME = 'Student Applicant';  // ✅ Updated to match your DocType

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

// Frappe Ready (for Frappe Framework Integration)
if (typeof frappe !== 'undefined') {
    frappe.ready(function() {
        // Ensure user_roles is available for role checking
        if (!frappe.user_roles) {
            frappe.call({
                method: 'frappe.core.doctype.user.user.get_all_roles',
                callback: function(r) {
                    frappe.user_roles = r.message || [];
                    initializeDashboard();
                }
            });
        } else {
            initializeDashboard();
        }
    });
} else {
    // Fallback for standalone testing
    window.addEventListener('load', function() {
        setTimeout(() => {
            initializeDashboard();
        }, 500);
    });
}

function initializeApp() {
    // Hide loading screen with GSAP
    setTimeout(() => {
        if (typeof gsap !== 'undefined') {
            gsap.to('#loadingScreen', {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    document.getElementById('loadingScreen').style.display = 'none';
                }
            });
        } else {
            document.getElementById('loadingScreen').style.display = 'none';
        }
    }, 1200);

    // Initialize animations
    initializeAnimations();
    
    // Setup scroll to top
    setupScrollToTop();
}

function initializeAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // Animate dashboard entrance
    gsap.from('.dashboard-header-card', {
        opacity: 0,
        y: -20,
        duration: 0.6,
        delay: 1.3,
        ease: 'power3.out'
    });

    gsap.from('.metric-card', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 1.5,
        stagger: 0.1,
        ease: 'power3.out'
    });

    gsap.from('.table-section', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 1.8,
        ease: 'power3.out'
    });
}

// === DASHBOARD INITIALIZATION ===
async function initializeDashboard() {
    // Check if Frappe is available
    if (typeof frappe === 'undefined') {
        console.warn('Frappe not available. Using demo mode.');
        loadDemoData();
        return;
    }

    // Check user role - compatible with all Frappe versions
    isHead = frappe.user_roles && frappe.user_roles.includes("Admission Head");
    
    // Set user info
    const userName = frappe.session.user_fullname || frappe.session.user;
    const userRole = isHead ? 'Admission Head' : 'Admission Staff';
    
    document.getElementById('userName').textContent = userName;
    document.getElementById('userRole').textContent = userRole;
    
    // Set dashboard title
    const title = isHead ? 'Admission Head Control Panel' : 'Admission Staff Dashboard';
    document.getElementById('dashboardTitle').textContent = title;
    
    // Show/hide assignment column for heads
    if (isHead) {
        const assignedHeader = document.getElementById('assignedHeader');
        if (assignedHeader) {
            assignedHeader.style.display = 'table-cell';
        }
        loadStaffMembers();
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Load dashboard data
    await loadDashboardData();
    
    // Setup sidebar toggle for mobile
    setupSidebarToggle();
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
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // You can add section switching logic here
            const section = this.getAttribute('data-section');
            console.log('Navigating to:', section);
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
        let filters = {};
        
        // If staff, only show assigned applications
        if (!isHead) {
            filters = {
                assigned_staff: frappe.session.user
            };
        }
        
        // Fetch applications - UPDATED DOCTYPE NAME
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: DOCTYPE_NAME,  // ✅ Using 'Student Applicant'
                fields: ['name', 'first_name', 'middle_name', 'last_name', 
                         'program', 'student_category', 'application_status', 
                         'application_date', 'creation', 'assigned_staff', 
                         'student_email_id', 'student_mobile_number'],
                filters: filters,
                limit_page_length: 999,
                order_by: 'creation desc'
            },
            callback: function(r) {
                if (r.message) {
                    applicationsData = r.message;
                    filteredData = [...applicationsData];
                    updateMetrics();
                    renderTable();
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
                ${isHead ? `<td>${app.assigned_staff || '<span class="text-muted">Unassigned</span>'}</td>` : ''}
                <td class="action-cell">
                    <button class="btn-action btn-view" onclick="viewApplication('${app.name}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${isHead ? `<button class="btn-action btn-assign" onclick="openAssignmentModal('${app.name}')">
                        <i class="fas fa-user-plus"></i> Assign
                    </button>` : ''}
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    updatePagination();
}

// === EMPTY STATE ===
function showEmptyState() {
    const tbody = document.getElementById('applicationsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = `
        <tr>
            <td colspan="7" class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No applications found</p>
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
        
        // Handle uppercase status comparison
        const matchesStatus = !statusValue || app.application_status === statusValue.toUpperCase();
        
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
            select.appendChild(option);
        });
        return;
    }

    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'User',
            fields: ['name', 'full_name'],
            filters: {
                enabled: 1
            },
            limit_page_length: 999
        },
        callback: function(r) {
            if (r.message) {
                const select = document.getElementById('staffSelect');
                r.message.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.name;
                    option.textContent = user.full_name || user.name;
                    select.appendChild(option);
                });
            }
        }
    });
}

function openAssignmentModal(applicationId) {
    document.getElementById('selectedApplicationId').value = applicationId;
    const modal = document.getElementById('assignmentModal');
    modal.classList.add('modal-active');
    
    // GSAP animation
    if (typeof gsap !== 'undefined') {
        gsap.from('.modal-content', {
            scale: 0.9,
            opacity: 0,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    }
}

function closeAssignmentModal() {
    const modal = document.getElementById('assignmentModal');
    
    if (typeof gsap !== 'undefined') {
        gsap.to('.modal-content', {
            scale: 0.9,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                modal.classList.remove('modal-active');
                document.getElementById('staffSelect').value = '';
                document.getElementById('selectedApplicationId').value = '';
            }
        });
    } else {
        modal.classList.remove('modal-active');
        document.getElementById('staffSelect').value = '';
        document.getElementById('selectedApplicationId').value = '';
    }
}

function confirmAssignment() {
    const applicationId = document.getElementById('selectedApplicationId').value;
    const staffMember = document.getElementById('staffSelect').value;
    
    if (!staffMember) {
        showToast('Please select a staff member.', 'warning');
        return;
    }
    
    if (typeof frappe === 'undefined') {
        // Demo mode
        showToast('Assignment successful! (Demo Mode)', 'success');
        closeAssignmentModal();
        
        // Update demo data
        const app = applicationsData.find(a => a.name === applicationId);
        if (app) {
            app.assigned_staff = staffMember;
            filterApplications();
            updateMetrics();
        }
        return;
    }
    
    // UPDATED DOCTYPE NAME
    frappe.call({
        method: 'frappe.client.set_value',
        args: {
            doctype: DOCTYPE_NAME,  // ✅ Using 'Student Applicant'
            name: applicationId,
            fieldname: 'assigned_staff',
            value: staffMember
        },
        callback: function(r) {
            if (!r.exc) {
                showToast('Application assigned successfully!', 'success');
                closeAssignmentModal();
                loadDashboardData();
            } else {
                showToast('Failed to assign application.', 'error');
            }
        }
    });
}

// === VIEW APPLICATION ===
function viewApplication(applicationName) {
    if (typeof frappe === 'undefined') {
        showToast('View: ' + applicationName + ' (Demo Mode)', 'info');
        return;
    }
    
    // Convert to proper URL format for Student Applicant
    const urlName = applicationName.toLowerCase().replace(/\s+/g, '-');
    window.location.href = `/app/student-applicant/${urlName}`;
}

// === REFRESH DASHBOARD ===
function refreshDashboard() {
    showToast('Refreshing dashboard...', 'info');
    
    // Add refresh animation
    const btn = event.currentTarget;
    btn.querySelector('i').classList.add('fa-spin');
    
    setTimeout(() => {
        loadDashboardData();
        btn.querySelector('i').classList.remove('fa-spin');
    }, 1000);
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
    
    toast.className = 'fixed top-6 right-6 bg-gradient-to-r from-pccr-red to-pccr-red-dark text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3';
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);

    if (typeof gsap !== 'undefined') {
        gsap.from(toast, {
            x: 400,
            opacity: 0,
            duration: 0.3
        });

        setTimeout(() => {
            gsap.to(toast, {
                x: 400,
                opacity: 0,
                duration: 0.3,
                onComplete: () => toast.remove()
            });
        }, 3000);
    } else {
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// === UTILITY FUNCTIONS ===
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', options);
}

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

// === EXPOSE FUNCTIONS TO WINDOW ===
window.viewApplication = viewApplication;
window.openAssignmentModal = openAssignmentModal;
window.closeAssignmentModal = closeAssignmentModal;
window.confirmAssignment = confirmAssignment;
window.refreshDashboard = refreshDashboard;
window.showNotifications = showNotifications;

// === CONSOLE MESSAGE ===
console.log('%c🎓 PCCR Admission Portal', 'color: #7b0200; font-size: 20px; font-weight: bold;');
console.log('%cPro Bono Publico et Patria', 'color: #fcb31c; font-style: italic;');
console.log('%cUsing DocType: ' + DOCTYPE_NAME, 'color: #666; font-size: 12px;');
