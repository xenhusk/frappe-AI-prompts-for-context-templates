// ========================================
// PCCR Admission Form - JavaScript
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
    setupAgentDropdown();
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
}

// ===== NAVIGATION =====
function nextStep(targetStep) {
    // Validate current step before moving
    if (!validateStep(CONFIG.currentStep)) return;

    const currentStepEl = document.getElementById(`step${CONFIG.currentStep}`);
    const nextStepEl = document.getElementById(`step${targetStep}`);

    if (currentStepEl && nextStepEl) {
        // Simple class switching
        currentStepEl.classList.remove('active');
        currentStepEl.style.display = 'none'; // Ensure it hides
        
        nextStepEl.classList.add('active');
        nextStepEl.style.display = 'block'; // Ensure it shows
        
        finishNavigation(targetStep);
    }
}

function prevStep(targetStep) {
    const currentStepEl = document.getElementById(`step${CONFIG.currentStep}`);
    const prevStepEl = document.getElementById(`step${targetStep}`);

    if (currentStepEl && prevStepEl) {
        currentStepEl.classList.remove('active');
        currentStepEl.style.display = 'none';
        
        prevStepEl.classList.add('active');
        prevStepEl.style.display = 'block';
        
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

// ===== PROGRESS BAR =====
function updateProgress(step) {
    const percentage = (step / CONFIG.totalSteps) * 100;
    
    // Direct DOM Manipulation
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.cssText = `width: ${percentage}% !important; transition: width 0.5s ease;`;
    }
    
    // Update Text Counters
    const percentText = document.getElementById('progressPercent');
    if(percentText) percentText.innerText = Math.round(percentage) + '%';
    
    const timeText = document.getElementById('timeEstimate');
    if(timeText) timeText.innerText = CONFIG.timeEstimates[step - 1] || '';
    
    // Update Icons (Colors)
    for (let i = 1; i <= CONFIG.totalSteps; i++) {
        const label = document.getElementById(`stepLabel${i}`);
        if (!label) continue;

        const iconDiv = label.querySelector('div:first-child'); 
        const textDiv = label.querySelector('div:last-child');
        
        // Reset Defaults
        iconDiv.className = 'text-white text-lg mb-1 opacity-50';
        textDiv.className = 'text-xs font-semibold text-white opacity-50';
        label.classList.remove('active');

        if (i === step) {
            // Active Step (Gold)
            label.classList.add('active');
            iconDiv.className = 'text-pccr-gold text-lg mb-1 opacity-100';
            textDiv.className = 'text-xs font-semibold text-white opacity-100';
        } else if (i < step) {
            // Completed Steps (Green check)
            iconDiv.innerHTML = '<i class="fas fa-check-circle"></i>';
            iconDiv.className = 'text-pccr-gold text-lg mb-1 opacity-100';
            textDiv.className = 'text-xs font-semibold text-white opacity-100';
        } else {
            // Future steps - ensure icon is reset if we went backwards
             const icons = ['fa-clipboard-list', 'fa-user', 'fa-graduation-cap', 'fa-check-circle'];
             iconDiv.innerHTML = `<i class="fas ${icons[i-1]}"></i>`;
        }
    }
}

function setupAgentDropdown() {
    const select = document.querySelector('select[name="agent"]');
    if(!select) return;

    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Sales Partner', 
            fields: ['name', 'partner_name'],
            limit_page_length: 0
        },
        callback: function(r) {
            if(r.message) {
                r.message.forEach(agent => {
                    const opt = document.createElement('option');
                    opt.value = agent.name; 
                    opt.innerText = agent.partner_name || agent.name;
                    select.appendChild(opt);
                });
            }
            
            // ADD MANUAL OPTION AT THE END
            const manualOpt = document.createElement('option');
            manualOpt.value = "Manual_Entry";
            manualOpt.innerText = "My Agent is not in the list";
            manualOpt.style.fontWeight = "bold";
            manualOpt.style.color = "#7b0200";
            select.appendChild(manualOpt);
        }
    });
}


function toggleManualAgent(selectElement) {
    const manualDiv = document.getElementById('manualAgentDiv');
    const manualInput = manualDiv.querySelector('input');
    
    if (selectElement.value === 'Manual_Entry') {
        manualDiv.classList.remove('hidden');
        manualInput.setAttribute('required', 'true');
        // Clear the select validation style just in case
        clearValidation(selectElement);
    } else {
        manualDiv.classList.add('hidden');
        manualInput.removeAttribute('required');
        manualInput.value = ''; // Clear input if they switch back
    }
}

// ===== SUMMARY GENERATOR (UPDATED) =====
function generateSummary() {
    const form = document.getElementById('admissionForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const summaryTable = document.getElementById('summaryTable'); 
    
    if (!summaryTable) return;

    // 1. Convert FormData to object
    const data = {};
    formData.forEach((value, key) => { data[key] = value });

    // 2. PROCESS AGENT DISPLAY LOGIC
    let agentDisplay = '';
    const agentSelect = document.getElementById('agentSelect'); // Ensure your select has id="agentSelect"

    if (data['agent'] === 'Manual_Entry') {
        // Use the manual input text
        agentDisplay = data['manual_agent_name'] ? `${data['manual_agent_name']} (Manual)` : 'Manual Entry';
    } else if (data['agent']) {
        // Use the dropdown text (not the ID)
        if (agentSelect) {
            const selectedOption = agentSelect.querySelector(`option[value="${data['agent']}"]`);
            agentDisplay = selectedOption ? selectedOption.innerText : data['agent'];
        } else {
            agentDisplay = data['agent'];
        }
    }
    // Save processed agent name to data object
    data['agent_display'] = agentDisplay;

    // 3. PROCESS PARENT FULL NAMES (Optional aesthetics)
    if (data['father_last_name']) {
        data['father_full_name'] = `${data['father_first_name']} ${data['father_last_name']} ${data['father_suffix'] || ''}`.trim();
    }
    if (data['mother_last_name']) {
        data['mother_full_name'] = `${data['mother_first_name']} ${data['mother_last_name']}`.trim();
    }

    // 4. DEFINE LABELS
    const labels = {
        // --- Admission Details ---
        'student_category': 'Category',
        'program': 'Program',
        'agent_display': 'Referral Agent', // Uses our processed key

        // --- Personal Details ---
        'first_name': 'First Name',
        'middle_name': 'Middle Name',
        'last_name': 'Last Name',
        'gender': 'Gender',
        'date_of_birth': 'Date of Birth',
        'student_email_id': 'Email',
        'student_mobile_number': 'Mobile',

        // --- Address ---
        'address_line_1': 'Address Line 1',
        'address_line_2': 'Address Line 2',
        'city': 'City',
        'province': 'Province',
        'region': 'Region',
        'pincode': 'Zip Code',

        // --- Family / Guardian (New) ---
        'living_with_parents': 'Living with Parents?',
        'father_full_name': 'Father Name', 
        'mother_full_name': 'Mother Name',

        // --- Emergency Contact (New) ---
        'emergency_contact_name': 'Emergency Contact',
        'emergency_relationship': 'Relationship',
        'emergency_contact_number': 'Emergency #'
    };

    // 5. GENERATE HTML
    let html = '';
    for (const [key, label] of Object.entries(labels)) {
        // Only show row if data exists and is not empty
        if (data[key] && data[key].trim() !== '') {
            html += `
                <div class="flex justify-between border-b border-gray-200 py-3">
                    <span class="text-gray-500 font-medium text-sm">${label}</span>
                    <span class="text-gray-900 font-bold text-sm text-right break-words max-w-[60%]">${data[key]}</span>
                </div>
            `;
        }
    }
    
    summaryTable.innerHTML = html;

    // 6. UPDATE SCHOOL SUMMARY LIST
    const summarySchools = document.getElementById('summarySchoolList');
    if (summarySchools) {
        // Check if global 'addedSchools' array exists (from index.html script)
        if (typeof addedSchools !== 'undefined' && addedSchools.length > 0) {
            let schoolHtml = '<ul class="list-disc pl-4 space-y-1">';
            addedSchools.forEach(s => {
                schoolHtml += `<li><b>${s.level}</b>: ${s.name}</li>`;
            });
            schoolHtml += '</ul>';
            summarySchools.innerHTML = schoolHtml;
        } else if (document.getElementById('alsCheckbox') && document.getElementById('alsCheckbox').checked) {
            summarySchools.innerHTML = '<span class="text-blue-600 font-bold">ALS Passer</span>';
        } else {
            summarySchools.innerHTML = '<span class="text-gray-400 italic">No schools added.</span>';
        }
    }
}
// ===== FORM SUBMIT (UPDATED FOR SUCCESS SCREEN) =====
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
                // Populate Success Screen Data
                populateSuccessDetails(data, r.message.name);
                
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

function populateSuccessDetails(data, refNumber) {
    // 1. Reference Number
    const refEl = document.getElementById('successRefNo');
    if(refEl) refEl.innerText = refNumber || "PENDING";

    // 2. Greeting Name
    const successNameEl = document.getElementById('successName');
    if(successNameEl) successNameEl.innerText = data.first_name || "Student";

    // 3. Grid Details
    const fullName = `${data.first_name} ${data.last_name}`;
    document.getElementById('summaryName').innerText = fullName.toUpperCase();
    document.getElementById('summaryType').innerText = data.student_category || "-";
    document.getElementById('summaryProgram').innerText = data.program || "-";
    document.getElementById('summaryEmail').innerText = data.student_email_id || "-";
    document.getElementById('summaryMobile').innerText = data.student_mobile_number || "-";
}

// ===== UTILITIES =====
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    field.style.borderColor = "#e5e7eb"; // Reset

    if (field.hasAttribute('required') && !value) isValid = false;
    
    if (!isValid) {
        field.style.borderColor = "#ef4444";
    } else {
        field.style.borderColor = "#7b0200";
    }
    return isValid;
}

function clearValidation(field) {
    field.style.borderColor = "#7b0200"; // Focus color
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

// Dummy functions for optional features to prevent errors
function createConfetti() { 
    // Simple confetti implementation or placeholder
    const colors = ['#7b0200', '#fcb31c', '#ffffff'];
    for(let i=0; i<50; i++) {
        const conf = document.createElement('div');
        conf.classList.add('confetti');
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear`;
        document.body.appendChild(conf);
    }
}
function setupScrollToTop() { 
    const btn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 300) btn.classList.remove('hidden');
        else btn.classList.add('hidden');
    });
    btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}

// Expose to HTML
window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitForm = submitForm;