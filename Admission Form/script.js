// ========================================
// PCCR Admission Form - JavaScript
// ========================================

// ===== CONFIGURATION =====
const CONFIG = {
    currentStep: 1,
    totalSteps: 5,
    timeEstimates: ['~8 min remaining', '~6 min remaining', '~3 min remaining', '~2 min remaining', 'Almost done!'],
    validationRules: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^(09|\+639)\d{9}$/
    }
};

// ===== INITIALIZATION =====
frappe.ready(function() {
    initializeApp();
    setupProgramAutocomplete();
    setupPSGC();
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
    setupHonorableDismissalVisibility();
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
    // Student category change: show/hide Honorable Dismissal (Transferee only)
    const studentCategorySelect = document.querySelector('select[name="student_category"]');
    if (studentCategorySelect) {
        studentCategorySelect.addEventListener('change', setupHonorableDismissalVisibility);
    }
}

// ===== HONORABLE DISMISSAL (TRANSFEREES ONLY) =====
function setupHonorableDismissalVisibility() {
    const group = document.getElementById('honorableDismissalGroup');
    const input = document.querySelector('input[name="honorable_dismissal"]');
    const category = document.querySelector('select[name="student_category"]');
    if (!group || !input || !category) return;
    const isTransferee = category.value === 'Transferee';
    group.style.display = isTransferee ? 'block' : 'none';
    if (input) {
        if (isTransferee) {
            input.setAttribute('required', 'required');
        } else {
            input.removeAttribute('required');
            input.value = '';
        }
    }
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
    
    // Generate summary only if we are on the Review Step (5)
    if (targetStep === 5) {
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
            const icons = ['fa-clipboard-list', 'fa-user', 'fa-graduation-cap', 'fa-file-upload', 'fa-check-circle'];
            iconDiv.innerHTML = `<i class="fas ${icons[i-1]}"></i>`;
        }
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

        // --- Personal Details ---
        'first_name': 'First Name',
        'middle_name': 'Middle Name',
        'last_name': 'Last Name',
        'suffix': 'Suffix',
        'gender': 'Gender',
        'date_of_birth': 'Date of Birth',
        'student_email_id': 'Email',
        'student_mobile_number': 'Mobile',

        // --- Address ---
        'address_line_1': 'Address Line 1',
        'region_text': 'Region',
        'province_text': 'Province',
        'city_text': 'City',
        'barangay_text': 'Barangay',
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

    // 7. UPDATE DOCUMENTS SUMMARY (step 4 file inputs)
    const summaryDocumentList = document.getElementById('summaryDocumentList');
    if (summaryDocumentList) {
        const docLabels = {
            form_138: 'Form 138 (Grade 12)',
            photo_2x2: '2x2 Photo',
            government_id: 'School/Government ID',
            birth_certificate: 'PSA Birth Certificate',
            good_moral: 'Good Moral Character',
            form_137: 'Form 137 (if available)',
            honorable_dismissal: 'Honorable Dismissal'
        };
        const form = document.getElementById('admissionForm');
        const fileInputs = form ? form.querySelectorAll('input[type="file"]') : [];
        const uploaded = [];
        fileInputs.forEach(function(inp) {
            if (inp.files && inp.files.length > 0 && docLabels[inp.name]) {
                uploaded.push(docLabels[inp.name]);
            }
        });
        summaryDocumentList.innerHTML = uploaded.length ? uploaded.join(', ') : '<span class="text-gray-400 italic">None</span>';
    }
}
// ===== FORM SUBMIT (UPDATED FOR SUCCESS SCREEN + FILE UPLOADS) =====
function submitForm() {
    const btn = document.getElementById('submitBtn');
    const originalContent = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';

    // 1. Collect form data (excluding file inputs)
    const inputs = document.querySelectorAll('#admissionForm input:not([type="file"]), #admissionForm select');
    const data = {
        doctype: "Student Applicant",
        naming_series: "EDU-APP-.YYYY.-"
    };

    inputs.forEach(input => {
        if (input.name) {
            if (input.type === 'checkbox') {
                data[input.name] = input.checked ? 1 : 0;
            } else {
                data[input.name] = input.value;
            }
        }
    });

    // 2. Collect file inputs that have a file selected
    const fileInputs = document.querySelectorAll('#admissionForm input[type="file"]');
    const filesToUpload = [];
    fileInputs.forEach(function(input) {
        if (input.files && input.files.length > 0 && input.name) {
            filesToUpload.push({ name: input.name, file: input.files[0] });
        }
    });

    function doInsert() {
        frappe.call({
            method: 'frappe.client.insert',
            args: { doc: data },
            freeze: true,
            callback: function(r) {
                if (!r.exc) {
                    populateSuccessDetails(data, r.message.name);
                    showSuccessScreen();
                    clearDraft();
                }
            },
            error: function(r) {
                btn.disabled = false;
                btn.innerHTML = originalContent;
                var errorMsg = 'Error submitting form.';
                if (r._server_messages) {
                    try {
                        errorMsg = JSON.parse(r._server_messages).join('\n');
                    } catch (e) { /* ignore */ }
                }
                if (typeof frappe !== 'undefined') {
                    frappe.msgprint({ title: 'Submission Error', message: errorMsg, indicator: 'red' });
                } else {
                    alert(errorMsg);
                }
                console.error("Server Error:", r);
            }
        });
    }

    function resetButton() {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }

    if (filesToUpload.length === 0) {
        doInsert();
        return;
    }

    // 3. Insert applicant first, then upload each file with doctype/docname/fieldname so File is linked
    frappe.call({
        method: 'frappe.client.insert',
        args: { doc: data },
        freeze: true,
        callback: function(r) {
            if (r.exc) {
                resetButton();
                var errorMsg = (r._server_messages && (function() { try { return JSON.parse(r._server_messages).join('\n'); } catch (e) { return r._server_messages; } })()) || 'Error creating application.';
                frappe.msgprint({ title: 'Submission Error', message: errorMsg, indicator: 'red' });
                return;
            }
            var applicantName = r.message.name;
            var fileIndex = 0;
            var uploadUrl = window.location.origin + '/api/method/frappe.handler.upload_file';

            function uploadNext() {
                if (fileIndex >= filesToUpload.length) {
                    populateSuccessDetails(data, applicantName);
                    showSuccessScreen();
                    clearDraft();
                    return;
                }
                var item = filesToUpload[fileIndex];
                var fileName = item.file.name || item.name + '_' + fileIndex + (item.file.type && item.file.type.indexOf('pdf') !== -1 ? '.pdf' : '.jpg');

                var formData = new FormData();
                formData.append('cmd', 'frappe.handler.upload_file');
                formData.append('file', item.file, fileName);
                formData.append('file_name', fileName);
                formData.append('is_private', 0);
                formData.append('doctype', 'Student Applicant');
                formData.append('docname', applicantName);
                formData.append('fieldname', item.name);
                if (typeof frappe.csrf_token !== 'undefined') {
                    formData.append('csrf_token', frappe.csrf_token);
                }

                $.ajax({
                    url: uploadUrl,
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(uploadResp) {
                        if (uploadResp && uploadResp.exc) {
                            resetButton();
                            var errMsg = (uploadResp._server_messages && (function() { try { return JSON.parse(uploadResp._server_messages).join('\n'); } catch (e) { return uploadResp._server_messages; } })()) || ('Failed to upload ' + item.name);
                            frappe.msgprint({ title: 'Upload Error', message: errMsg, indicator: 'red' });
                            return;
                        }
                        var msg = uploadResp && uploadResp.message;
                        var fileUrl = msg ? (msg.file_url || (msg.file_name ? ('/files/' + msg.file_name) : null)) : null;
                        if (!fileUrl) {
                            fileIndex++;
                            uploadNext();
                            return;
                        }
                        data[item.name] = fileUrl;
                        frappe.call({
                            method: 'frappe.client.set_value',
                            args: {
                                doctype: 'Student Applicant',
                                name: applicantName,
                                fieldname: item.name,
                                value: fileUrl
                            },
                            callback: function(sr) {
                                if (sr.exc) {
                                    resetButton();
                                    frappe.msgprint({ title: 'Error', message: (sr._server_messages && (function() { try { return JSON.parse(sr._server_messages).join('\n'); } catch (e) { return sr._server_messages; } })()) || 'Failed to save file link.', indicator: 'red' });
                                    return;
                                }
                                fileIndex++;
                                uploadNext();
                            }
                        });
                    },
                    error: function(xhr) {
                        resetButton();
                        var errMsg = 'Failed to upload document.';
                        if (xhr.responseJSON && xhr.responseJSON._server_messages) {
                            try {
                                errMsg = JSON.parse(xhr.responseJSON._server_messages).join('\n');
                            } catch (e) {}
                        } else if (xhr.responseText) {
                            try {
                                var j = JSON.parse(xhr.responseText);
                                if (j._server_messages) errMsg = JSON.parse(j._server_messages).join('\n');
                            } catch (e) {}
                        }
                        frappe.msgprint({ title: 'Upload Error', message: errMsg, indicator: 'red' });
                    }
                });
            }
            uploadNext();
        },
        error: function(r) {
            resetButton();
            var errorMsg = (r._server_messages && (function() { try { return JSON.parse(r._server_messages).join('\n'); } catch (e) { return r._server_messages; } })()) || 'Error submitting form.';
            frappe.msgprint({ title: 'Submission Error', message: errorMsg, indicator: 'red' });
        }
    });
}

function populateSuccessDetails(data, refNumber) {
    // 1. Basic Details
    const refEl = document.getElementById('successRefNo');
    if(refEl) refEl.innerText = refNumber || "PENDING";

    const successNameEl = document.getElementById('successName');
    if(successNameEl) successNameEl.innerText = data.first_name || "Student";

    document.getElementById('summaryName').innerText = `${data.first_name} ${data.last_name}`.toUpperCase();
    document.getElementById('summaryType').innerText = data.student_category || "-";
    document.getElementById('summaryProgram').innerText = data.program || "-";
    document.getElementById('summaryMobile').innerText = data.student_mobile_number || "-";
    document.getElementById('summaryEmail').innerText = data.student_email_id || "-";

    // 2. AUTO-CALCULATE MISSING FIELDS
    // Since these are not form inputs, we guess them based on the Program Name
    let dept = "College";
    let level = "Tertiary";
    
    // Get program name safely
    const prog = (data.program || "").toLowerCase();

    if (prog.includes("master") || prog.includes("doctor") || prog.includes("phd")) {
        dept = "Graduate School";
        level = "Post-Graduate";
    } else if (prog.includes("grade") || prog.includes("senior high") || prog.includes("stem") || prog.includes("abm") || prog.includes("humss") || prog.includes("general academic")) {
        dept = "Senior High School";
        level = "Secondary";
    }

    // 3. Inject calculated values into the HTML
    // These IDs must exist in your index.html
    const deptEl = document.getElementById('summaryDepartment');
    const levelEl = document.getElementById('summaryLevel');
    
    if(deptEl) deptEl.innerText = dept;
    if(levelEl) levelEl.innerText = level;
}
// ===== UTILITIES =====
// REPLACE THE EXISTING validateField FUNCTION IN script.js WITH THIS:

// ===== UTILITIES (VALIDATION FIX) =====
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = ""; // Custom error message store

    // Reset styles
    field.style.borderColor = "#e5e7eb"; 
    const errorDisplay = field.parentElement.querySelector('.error-message');
    if (errorDisplay) errorDisplay.innerText = "";

    // 1. Standard Required Check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = "This field is required.";
    }

    // 2. STRICT EMAIL VALIDATION (Must have @ and a domain extension like .com)
    else if (field.name === 'student_email_id' && value) {
        // Regex: Text + @ + Text + . + Text (at least 2 chars)
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(value)) {
            isValid = false;
            errorMessage = "Please enter a valid email (e.g., name@domain.com)";
        }
    }

    // 3. STRICT MOBILE NUMBER VALIDATION (Exactly 11 digits, starts with 09)
    else if ((field.name === 'student_mobile_number' || field.name === 'emergency_contact_number') && value) {
        const mobilePattern = /^09\d{9}$/; // Starts with 09, followed by 9 digits
        if (!mobilePattern.test(value)) {
            isValid = false;
            errorMessage = "Must be 11 digits starting with 09 (e.g., 09123456789)";
        }
    }

    // 4. DATE OF BIRTH VALIDATION
    else if (field.name === 'date_of_birth' && value) {
        const birthDate = new Date(value);
        const today = new Date();
        const minYear = 1900;
        const minAge = 16; 

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (birthDate.getFullYear() < minYear) {
            isValid = false;
            errorMessage = "Invalid Birth Year.";
        } else if (age < minAge) {
            isValid = false;
            errorMessage = `You must be at least ${minAge} years old.`;
        }
    }
    
    // 5. Apply Visual Feedback
    if (!isValid) {
        field.style.borderColor = "#ef4444"; // Red border
        field.classList.add('invalid');
        
        // Show error message text if the element exists in HTML
        if (errorDisplay) {
            errorDisplay.innerText = errorMessage;
            errorDisplay.style.color = "#ef4444";
            errorDisplay.style.fontSize = "11px";
            errorDisplay.style.marginTop = "4px";
        }
        
        // Optional: Shake effect
        setTimeout(() => field.classList.remove('invalid'), 500);
    } else {
        field.style.borderColor = "#7b0200"; // Valid color
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

    // 1. Standard Field Validation (skip file inputs in step 4 - validated below)
    requiredFields.forEach(field => {
        if (step === 4 && field.type === 'file') return;
        if (!validateField(field)) isValid = false;
    });

    // 2. EXTRA RULE: Educational Background (Step 3)
    if (step === 3) {
        const isAls = document.getElementById('alsCheckbox').checked;
        // If not ALS and no schools added, prevent next step
        if (!isAls && (typeof addedSchools === 'undefined' || addedSchools.length === 0)) {
            if (typeof frappe !== 'undefined') {
                frappe.msgprint({
                    title: 'Education Required',
                    message: 'Please add at least one school or check "ALS Passer".',
                    indicator: 'red'
                });
            } else {
                alert('Please add at least one school or check "ALS Passer".');
            }
            return false;
        }
    }

    // 3. EXTRA RULE: Required Documents (Step 4)
    if (step === 4) {
        const requiredDocNames = ['form_138', 'photo_2x2', 'government_id', 'birth_certificate', 'good_moral'];
        const honorableGroup = document.getElementById('honorableDismissalGroup');
        if (honorableGroup && honorableGroup.style.display !== 'none') {
            requiredDocNames.push('honorable_dismissal');
        }
        requiredDocNames.forEach(function(name) {
            const fileInput = stepEl.querySelector(`input[type="file"][name="${name}"]`);
            if (!fileInput) return;
            const hasFile = fileInput.files && fileInput.files.length > 0;
            const errorDisplay = fileInput.parentElement.querySelector('.error-message');
            if (!hasFile) {
                isValid = false;
                fileInput.style.borderColor = '#ef4444';
                if (errorDisplay) {
                    errorDisplay.innerText = 'Please upload this document.';
                    errorDisplay.style.display = 'block';
                }
            } else {
                fileInput.style.borderColor = '#7b0200';
                if (errorDisplay) errorDisplay.innerText = '';
            }
        });
    }

    if (!isValid) {
        if (typeof frappe !== 'undefined') {
            frappe.show_alert({message: 'Please fill in all required fields.', indicator: 'red'});
        } else {
            alert('Please fill in all required fields.');
        }
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

    // Safety Check: Stop if frappe is missing
    if (typeof frappe === 'undefined') return; 

    input.setAttribute('list', 'program-list');
    const datalist = document.createElement('datalist');
    datalist.id = 'program-list';
    document.body.appendChild(datalist);

    frappe.call({
        method: 'get_programs_guest', 
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

// ========================================
// PCCR Admission Form - JavaScript (FIXED)
// ========================================

// ===== INITIALIZATION (UPDATED) =====
// This checks if the page is loaded, regardless of whether 'frappe' exists
document.addEventListener('DOMContentLoaded', function() {
    setupPSGC();
    initializeApp();
    setupProgramAutocomplete();
     // This populates the region
});

// Keep this if you are actually using Frappe context, but the listener above ensures it works locally too
if (typeof frappe !== 'undefined') {
    frappe.ready(function() {
        // Any specific frappe-only logic can go here
    });
}


function setupPSGC() {
    const apiBase = 'https://psgc.gitlab.io/api';
    const regionSelect = document.getElementById('regionSelect');
    const provinceSelect = document.getElementById('provinceSelect');
    const citySelect = document.getElementById('citySelect');
    const barangaySelect = document.getElementById('barangaySelect');

    // 1. HARDCODED REGIONS (Instantly loads, no API needed for this part)
    const regions = [
        { code: '130000000', name: 'National Capital Region (NCR)' },
        { code: '040000000', name: 'Region IV-A (CALABARZON)' },
        { code: '030000000', name: 'Region III (Central Luzon)' },
        { code: '010000000', name: 'Region I (Ilocos Region)' },
        { code: '020000000', name: 'Region II (Cagayan Valley)' },
        { code: '170000000', name: 'Region IV-B (MIMAROPA)' },
        { code: '050000000', name: 'Region V (Bicol Region)' },
        { code: '060000000', name: 'Region VI (Western Visayas)' },
        { code: '070000000', name: 'Region VII (Central Visayas)' },
        { code: '080000000', name: 'Region VIII (Eastern Visayas)' },
        { code: '090000000', name: 'Region IX (Zamboanga Peninsula)' },
        { code: '100000000', name: 'Region X (Northern Mindanao)' },
        { code: '110000000', name: 'Region XI (Davao Region)' },
        { code: '120000000', name: 'Region XII (SOCCSKSARGEN)' },
        { code: '160000000', name: 'Region XIII (Caraga)' },
        { code: '140000000', name: 'Bangsamoro Autonomous Region (BARMM)' },
        { code: '150000000', name: 'Cordillera Administrative Region (CAR)' }
    ];

    // Populate dropdown immediately
    populateSelect(regionSelect, regions, 'name', 'code');

    // 2. Handle Region Change
    regionSelect.addEventListener('change', function() {
        const code = this.value;
        const text = this.options[this.selectedIndex].text;
        
        const regionTextEl = document.getElementById('regionText');
        if(regionTextEl) regionTextEl.value = text;

        resetSelect(provinceSelect, 'Select Province');
        resetSelect(citySelect, 'Select City');
        resetSelect(barangaySelect, 'Select Barangay');

        if (!code) return;

        // Special Case: NCR (No Provinces)
        if (code === '130000000') {
            provinceSelect.disabled = true;
            provinceSelect.innerHTML = '<option value="NCR">Metro Manila (NCR)</option>';
            const provTextEl = document.getElementById('provinceText');
            if(provTextEl) provTextEl.value = "Metro Manila";
            
            // Fetch Cities for NCR
            fetchData(`${apiBase}/regions/${code}/cities-municipalities/`, citySelect);
        } else {
            // Fetch Provinces for other regions
            fetchData(`${apiBase}/regions/${code}/provinces/`, provinceSelect);
        }
    });

    // 3. Handle Province Change
    provinceSelect.addEventListener('change', function() {
        const code = this.value;
        const text = this.options[this.selectedIndex].text;
        document.getElementById('provinceText').value = text;

        resetSelect(citySelect, 'Select City');
        resetSelect(barangaySelect, 'Select Barangay');

        if (code) {
            fetchData(`${apiBase}/provinces/${code}/cities-municipalities/`, citySelect);
        }
    });

    // 4. Handle City Change
    citySelect.addEventListener('change', function() {
        const code = this.value;
        const text = this.options[this.selectedIndex].text;
        document.getElementById('cityText').value = text;

        resetSelect(barangaySelect, 'Select Barangay');

        if (code) {
            fetchData(`${apiBase}/cities-municipalities/${code}/barangays/`, barangaySelect);
        }
    });

    // 5. Handle Barangay Change
    barangaySelect.addEventListener('change', function() {
        const text = this.options[this.selectedIndex].text;
        document.getElementById('barangayText').value = text;
    });

    // --- Helpers ---

    function fetchData(url, targetElement) {
        targetElement.innerHTML = '<option>Loading...</option>';
        targetElement.disabled = true;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => populateSelect(targetElement, data, 'name', 'code'))
            .catch(err => {
                console.error("API Error:", err);
                targetElement.innerHTML = '<option value="">Error loading data</option>';
            });
    }

    function populateSelect(element, data, nameKey, valueKey) {
        element.innerHTML = '<option value="">Select Option</option>';
        data.sort((a, b) => a[nameKey].localeCompare(b[nameKey]));
        data.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item[valueKey];
            opt.innerText = item[nameKey];
            element.appendChild(opt);
        });
        element.disabled = false;
    }

    function resetSelect(element, placeholder) {
        element.innerHTML = `<option value="">${placeholder}</option>`;
        element.disabled = true;
    }
}



// ===== PDF DOWNLOAD FUNCTION (COMPACT & CLEAN) =====
function downloadPDF() {
    const refNo = document.getElementById('successRefNo').innerText || 'PENDING';
    const studentName = document.getElementById('successName').innerText || 'Student';
    const filename = `PCCR_Application_${refNo}.pdf`;
    const element = document.getElementById('pdf-content');
    
    // 1. Clone the element
    const clone = element.cloneNode(true);

    // 2. FORCE COMPACT STYLES (Fits everything on one page)
    clone.style.cssText = `
        width: 800px;
        margin: 0 auto;
        background-color: white;
        color: black;
        padding: 20px; /* Reduced padding */
        font-family: Arial, Helvetica, sans-serif !important;
        line-height: 1.3 !important; /* Tighter lines */
    `;

    // 3. NUCLEAR TEXT FIX (Fixes jumbled/garbled letters)
    const allElements = clone.querySelectorAll('*');
    allElements.forEach(el => {
        el.style.fontFamily = 'Arial, Helvetica, sans-serif';
        el.style.letterSpacing = '0px';
        el.style.wordSpacing = '0px';
        if (getComputedStyle(el).color !== 'rgb(255, 255, 255)') { 
            el.style.color = '#000000'; 
        }
    });

    // 4. FIX LOGO (Smaller size to save space)
    const cloneLogo = clone.querySelector('img');
    if (cloneLogo) {
        cloneLogo.src = window.location.origin + "/files/pccr-logo.png";
        cloneLogo.style.width = "70px"; // Smaller logo
        cloneLogo.style.height = "auto";
        cloneLogo.style.marginBottom = "10px";
        cloneLogo.crossOrigin = "Anonymous";
    }

    // 5. FIX REFERENCE BOX (Compact)
    const refContainer = clone.querySelector('.bg-yellow-50'); 
    if (refContainer) {
        refContainer.innerHTML = ''; 
        refContainer.style.cssText = `
            border: 2px dashed #fcb31c;
            background-color: #fffbeb;
            padding: 10px; /* Compact padding */
            text-align: center;
            margin: 10px auto; 
            width: 60%; /* Narrower box */
            display: block;
        `;
        
        const label = document.createElement('div');
        label.innerText = 'YOUR REFERENCE NUMBER';
        label.style.fontSize = '10px';
        label.style.color = '#666';
        refContainer.appendChild(label);

        const number = document.createElement('div');
        number.innerText = refNo;
        number.style.fontSize = '20px'; // Smaller font
        number.style.fontWeight = 'bold';
        number.style.color = '#7b0200';
        number.style.fontFamily = 'Arial, sans-serif';
        refContainer.appendChild(number);
    }

    // 6. COMPACT GRID (Side-by-side items)
    const grids = clone.querySelectorAll('.grid');
    grids.forEach(grid => {
        grid.style.display = 'flex';
        grid.style.flexWrap = 'wrap';
        grid.style.gap = '0';
        grid.style.marginTop = '10px'; // Reduce top gap
    });

    const gridItems = clone.querySelectorAll('.grid > div');
    gridItems.forEach(item => {
        item.style.width = '50%'; 
        item.style.marginBottom = '8px'; // Tighter spacing
        item.style.boxSizing = 'border-box';
        item.style.paddingRight = '5px';
        
        // Ensure Email is full width
        if (item.classList.contains('col-span-2')) {
            item.style.width = '100%';
        }
    });

    // 7. FIX STUDENT NAME
    const nameEl = clone.querySelector('#successName');
    if(nameEl) nameEl.innerText = studentName;

    // 8. GENERATE
    const opt = {
        margin: [0.3, 0.3, 0.3, 0.3], // Small margins
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            letterRendering: true,
            scrollY: 0
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    const btn = document.querySelector('button[onclick="downloadPDF()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Generating...';
    btn.disabled = true;

    html2pdf().set(opt).from(clone).save().then(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }).catch(err => {
        console.error(err);
        btn.innerHTML = 'Error';
        setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 2000);
    });
}
// Expose to HTML
window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitForm = submitForm;