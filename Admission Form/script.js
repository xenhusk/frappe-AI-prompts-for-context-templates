// ========================================
// PCCR Admission Form - JavaScript (FIXED)
// ========================================

// ===== CONFIGURATION =====
const CONFIG = {
    currentStep: 1,
    totalSteps: 4,
    timeEstimates: ['~8 min remaining', '~6 min remaining', '~3 min remaining', 'Almost done!'],
    validationRules: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^(09|\+639)\d{9}$/
    }
};

// ===== INITIALIZATION =====
frappe.ready(function() {
    initializeApp();
    setupProgramAutocomplete();
});

function initializeApp() {
    // 1. Hide loading screen
    setTimeout(() => {
        const loader = document.getElementById('loadingScreen');
        if (loader) loader.style.display = 'none';
    }, 1200);

    // 2. FORCE Progress Bar Update on Load
    updateProgress(CONFIG.currentStep);

    // 3. Setup Listeners
    setupEventListeners();
    loadDraft();
    setupAutoSave();
    setupScrollToTop();
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    document.querySelectorAll('.form-input, .form-select').forEach(input => {
        input.addEventListener('blur', function() { validateField(this); });
        input.addEventListener('input', function() { clearValidation(this); });
    });

    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// ===== NAVIGATION =====
function nextStep(targetStep) {
    // Validate current step before moving
    if (!validateStep(CONFIG.currentStep)) return;

    const currentStepEl = document.getElementById(`step${CONFIG.currentStep}`);
    const nextStepEl = document.getElementById(`step${targetStep}`);

    if (currentStepEl && nextStepEl) {
        // Hide Current
        currentStepEl.classList.remove('active');
        // Show Next
        nextStepEl.classList.add('active');
        
        finishNavigation(targetStep);
    }
}

function prevStep(targetStep) {
    const currentStepEl = document.getElementById(`step${CONFIG.currentStep}`);
    const prevStepEl = document.getElementById(`step${targetStep}`);

    if (currentStepEl && prevStepEl) {
        currentStepEl.classList.remove('active');
        prevStepEl.classList.add('active');
        
        finishNavigation(targetStep);
    }
}

function finishNavigation(targetStep) {
    CONFIG.currentStep = targetStep;
    updateProgress(targetStep);
    
    // Generate summary only if we are on the Review Step (4)
    if (targetStep === 4) {
        generateSummary();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== PROGRESS BAR (FIXED) =====
function updateProgress(step) {
    // 1. Calculate Percentage
    const percentage = (step / CONFIG.totalSteps) * 100;
    
    // 2. Update Bar Width (Forcefully)
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        // We set styling directly to override any Tailwind defaults
        progressBar.style.width = percentage + "%";
        // Ensure the bar is visible (remove any w-0 classes if present)
        progressBar.classList.remove('w-0');
    }
    
    // 3. Update Text
    const percentText = document.getElementById('progressPercent');
    if(percentText) percentText.innerText = Math.round(percentage) + '%';
    
    const timeText = document.getElementById('timeEstimate');
    if(timeText) timeText.innerText = CONFIG.timeEstimates[step - 1] || '';
    
    // 4. Update Icons
    for (let i = 1; i <= CONFIG.totalSteps; i++) {
        const label = document.getElementById(`stepLabel${i}`);
        if (!label) continue;

        const iconDiv = label.querySelector('div:first-child'); 
        const textDiv = label.querySelector('div:last-child');
        
        label.classList.remove('active');
        iconDiv.className = 'text-white text-lg mb-1 opacity-50'; // Default faded
        textDiv.className = 'text-xs font-semibold text-white opacity-50';

        if (i === step) {
            // Active Step
            label.classList.add('active');
            iconDiv.className = 'text-pccr-gold text-lg mb-1 opacity-100'; // Gold Icon
            textDiv.className = 'text-xs font-semibold text-white opacity-100'; 
        } else if (i < step) {
            // Completed Step
            iconDiv.innerHTML = '<i class="fas fa-check-circle"></i>';
            iconDiv.className = 'text-pccr-gold text-lg mb-1 opacity-100';
            textDiv.className = 'text-xs font-semibold text-white opacity-100';
        }
    }
}

// ===== SUMMARY GENERATOR (FIXED FOR CSS TABLE) =====
function generateSummary() {
    const form = document.getElementById('admissionForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const summaryTable = document.getElementById('summaryTable'); 
    
    if (!summaryTable) return;

    // Field Labels Mapping
    const labels = {
        'student_category': 'Category',
        'program': 'Program',
        'first_name': 'First Name',
        'middle_name': 'Middle Name',
        'last_name': 'Last Name',
        'date_of_birth': 'Date of Birth',
        'gender': 'Gender',
        'student_email_id': 'Email',
        'student_mobile_number': 'Mobile',
        'address_line_1': 'Address Line 1',
        'address_line_2': 'Address Line 2',
        'city': 'City',
        'province': 'Province',
        'barangay': 'Barangay',
        'pincode': 'Zip Code',
        'home_phone_number': 'Home Phone'
    };

    let html = '';
    
    // Convert FormData to simple object
    const data = {};
    formData.forEach((value, key) => { data[key] = value });

    // Build HTML Table Rows (<tr><td>...</td></tr>) to match your CSS
    for (const [key, label] of Object.entries(labels)) {
        if (data[key]) {
            html += `
                <tr>
                    <td>${label}</td>
                    <td>${data[key]}</td>
                </tr>
            `;
        }
    }
    
    // Inject rows into the table body
    summaryTable.innerHTML = html;
}

// ===== FORM SUBMIT =====
function submitForm() {
    const btn = document.getElementById('submitBtn');
    const originalContent = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';

    // Collect data
    const inputs = document.querySelectorAll('#admissionForm input, #admissionForm select');
    const data = {
        doctype: "Student Applicant",
        naming_series: "EDU-APP-.YYYY.-"
    };
    
    inputs.forEach(input => {
        if(input.name) {
            if(input.type === 'checkbox') {
                data[input.name] = input.checked ? 1 : 0;
            } else {
                data[input.name] = input.value;
            }
        }
    });

    frappe.call({
        method: 'frappe.client.insert',
        args: { doc: data },
        freeze: true,
        callback: function(r) {
            if (!r.exc) {
                showSuccessScreen();
                createConfetti();
                clearDraft();
            }
        },
        error: function(r) {
            btn.disabled = false;
            btn.innerHTML = originalContent;
            frappe.msgprint('Error submitting form. Please check your internet connection.');
        }
    });
}

// ===== UTILITIES =====
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    field.style.borderColor = "#e5e7eb"; // Reset

    if (field.hasAttribute('required') && !value) isValid = false;
    
    if (!isValid) {
        field.style.borderColor = "#ef4444"; // Red
    } else {
        field.style.borderColor = "#8B0000"; // Green
    }
    return isValid;
}

function clearValidation(field) {
    field.style.borderColor = "#fcb31c"; // Focus color (Gold)
}

function validateStep(step) {
    const stepEl = document.getElementById(`step${step}`);
    const requiredFields = stepEl.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
        frappe.show_alert({message: 'Please fill in all required fields.', indicator: 'red'});
    }
    return isValid;
}

function showSuccessScreen() {
    document.getElementById('admissionForm').style.display = 'none';
    const successScreen = document.getElementById('successScreen');
    successScreen.style.display = 'block';
    successScreen.classList.remove('hidden');
}

function setupAutoSave() {
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => {
            const data = {};
            document.querySelectorAll('input').forEach(i => data[i.name] = i.value);
            localStorage.setItem('pccr_draft', JSON.stringify(data));
        });
    });
}

function loadDraft() {
    const draft = JSON.parse(localStorage.getItem('pccr_draft'));
    if(draft) {
        for (const [key, val] of Object.entries(draft)) {
            const input = document.querySelector(`[name="${key}"]`);
            if(input) input.value = val;
        }
    }
}

function clearDraft() { localStorage.removeItem('pccr_draft'); }
function setupScrollToTop() { /* Optional */ }
function handleKeyboardShortcuts() { /* Optional */ }
function showKeyboardHint() { /* Optional */ }
function createConfetti() { /* Optional */ }

function setupProgramAutocomplete() {
    const input = document.querySelector('input[name="program"]');
    if(!input) return;
    input.setAttribute('list', 'program-list');
    const datalist = document.createElement('datalist');
    datalist.id = 'program-list';
    document.body.appendChild(datalist);

    frappe.call({
        method: 'frappe.client.get_list',
        args: { doctype: 'Program', fields: ['program_name'] },
        callback: function(r) {
            if(r.message) {
                r.message.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p.program_name;
                    datalist.appendChild(opt);
                });
            }
        }
    });
}

// Expose to HTML
window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitForm = submitForm;