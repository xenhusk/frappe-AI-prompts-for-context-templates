// ========================================
// PCCR Admission Form - JavaScript
// Modern, Interactive Form with Animations
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
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Hide loading screen
    setTimeout(() => {
        gsap.to('#loadingScreen', {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                document.getElementById('loadingScreen').style.display = 'none';
            }
        });
    }, 1200);

    // Setup event listeners
    setupEventListeners();
    
    // Initialize GSAP animations
    initializeAnimations();
    
    // Load saved draft
    loadDraft();
    
    // Setup auto-save
    setupAutoSave();
    
    // Setup scroll to top button
    setupScrollToTop();
    
    // Show keyboard shortcuts hint
    showKeyboardHint();
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Form input validation
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearValidation(this);
        });

        // Focus animation
        input.addEventListener('focus', function() {
            gsap.to(this.closest('.form-group'), {
                y: -2,
                duration: 0.2
            });
        });

        input.addEventListener('blur', function() {
            gsap.to(this.closest('.form-group'), {
                y: 0,
                duration: 0.2
            });
        });
    });

    // Checkbox animations
    document.querySelectorAll('.custom-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            const input = this.querySelector('.checkbox-input');
            if (input.checked) {
                gsap.to(this, {
                    scale: 1.05,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// ===== GSAP ANIMATIONS =====
function initializeAnimations() {
    // Animate form card entrance
    gsap.from('.bg-white.rounded-b-2xl', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 1.3,
        ease: 'power3.out'
    });

    // Animate header
    gsap.from('.bg-gradient-to-r', {
        opacity: 0,
        y: -20,
        duration: 0.6,
        delay: 1.3,
        ease: 'power3.out'
    });
}

// ===== NAVIGATION =====
function nextStep(targetStep) {
    const currentStepEl = document.getElementById(`step${CONFIG.currentStep}`);
    
    // Validate current step
    if (!validateStep(CONFIG.currentStep)) {
        return;
    }

    // Animate out current step
    gsap.to(currentStepEl, {
        opacity: 0,
        x: -30,
        duration: 0.3,
        onComplete: () => {
            currentStepEl.classList.remove('active');
            
            // Show next step
            const nextStepEl = document.getElementById(`step${targetStep}`);
            nextStepEl.classList.add('active');
            
            gsap.fromTo(nextStepEl,
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, duration: 0.3 }
            );

            // Update progress
            CONFIG.currentStep = targetStep;
            updateProgress(targetStep);
            
            // Generate summary if on review step
            if (targetStep === 4) {
                generateSummary();
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Show toast
            showToast(`Step ${targetStep} of ${CONFIG.totalSteps}`, 'success');
        }
    });
}

function prevStep(targetStep) {
    const currentStepEl = document.getElementById(`step${CONFIG.currentStep}`);
    
    // Animate out current step
    gsap.to(currentStepEl, {
        opacity: 0,
        x: 30,
        duration: 0.3,
        onComplete: () => {
            currentStepEl.classList.remove('active');
            
            // Show previous step
            const prevStepEl = document.getElementById(`step${targetStep}`);
            prevStepEl.classList.add('active');
            
            gsap.fromTo(prevStepEl,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.3 }
            );

            // Update progress
            CONFIG.currentStep = targetStep;
            updateProgress(targetStep);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// ===== PROGRESS BAR =====
function updateProgress(step) {
    const percentage = (step / CONFIG.totalSteps) * 100;
    
    // Animate progress bar
    gsap.to('#progressBar', {
        width: `${percentage}%`,
        duration: 0.6,
        ease: 'power2.inOut'
    });
    
    // Update percentage text
    document.getElementById('progressPercent').textContent = `${percentage}%`;
    
    // Update time estimate
    document.getElementById('timeEstimate').textContent = CONFIG.timeEstimates[step - 1];
    
    // Update step labels
    for (let i = 1; i <= CONFIG.totalSteps; i++) {
        const label = document.getElementById(`stepLabel${i}`);
        label.classList.remove('active', 'completed');
        
        if (i === step) {
            label.classList.add('active');
            gsap.fromTo(label,
                { scale: 1 },
                { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1 }
            );
        } else if (i < step) {
            label.classList.add('completed');
        }
    }
}

// ===== VALIDATION =====
function validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    const formGroup = field.closest('.form-group');
    const errorMsg = formGroup?.querySelector('.error-message');
    
    // Remove existing validation icons
    formGroup?.querySelectorAll('.validation-icon').forEach(icon => icon.remove());
    
    let isValid = true;
    let message = '';

    // Required field check
    if (field.required && !value) {
        isValid = false;
        message = 'This field is required';
    }

    // Email validation
    if (name === 'student_email_id' && value && !CONFIG.validationRules.email.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
    }

    // Phone validation
    if (name === 'student_mobile_number' && value && !CONFIG.validationRules.phone.test(value)) {
        isValid = false;
        message = 'Please enter a valid Philippine mobile number (09XXXXXXXXX)';
    }

    // Update field state
    if (!isValid) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.classList.add('show');
        }

        // Add error icon
        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-circle validation-icon error';
        if (formGroup) {
            formGroup.style.position = 'relative';
            formGroup.appendChild(icon);
        }

        // Shake animation
        gsap.fromTo(field,
            { x: -10 },
            { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power1.inOut' }
        );
    } else if (value) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        
        if (errorMsg) {
            errorMsg.classList.remove('show');
        }

        // Add success icon
        const icon = document.createElement('i');
        icon.className = 'fas fa-check-circle validation-icon success';
        if (formGroup) {
            formGroup.style.position = 'relative';
            formGroup.appendChild(icon);
        }

        // Success animation
        gsap.fromTo(icon,
            { scale: 0 },
            { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
    }

    return isValid;
}

function clearValidation(field) {
    field.classList.remove('invalid', 'valid');
    const formGroup = field.closest('.form-group');
    const errorMsg = formGroup?.querySelector('.error-message');
    
    if (errorMsg) {
        errorMsg.classList.remove('show');
    }

    // Remove validation icons
    formGroup?.querySelectorAll('.validation-icon').forEach(icon => icon.remove());
}

function validateStep(step) {
    const stepEl = document.getElementById(`step${step}`);
    const requiredFields = stepEl.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalid = null;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
            if (!firstInvalid) {
                firstInvalid = field;
            }
        }
    });

    if (!isValid) {
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        showToast('Please complete all required fields correctly', 'error');
    }

    return isValid;
}

// ===== SUMMARY GENERATION =====
function generateSummary() {
    const form = document.getElementById('admissionForm');
    const formData = new FormData(form);
    const summaryTable = document.getElementById('summaryTable');
    
    const fieldLabels = {
        'student_category': 'Student Category',
        'program': 'Program Applied For',
        'first_name': 'First Name',
        'middle_name': 'Middle Name',
        'last_name': 'Last Name',
        'date_of_birth': 'Date of Birth',
        'gender': 'Gender',
        'student_email_id': 'Email Address',
        'student_mobile_number': 'Mobile Number',
        'previous_school_name': 'Previous School',
        'lms_only': 'LMS Only',
        'paid': 'Paid Application'
    };

    let html = '';
    
    for (let [key, value] of formData.entries()) {
        if (fieldLabels[key] && value) {
            // Handle checkboxes
            if (key === 'lms_only' || key === 'paid') {
                value = value === 'on' ? 'Yes' : 'No';
            }
            
            html += `
                <tr>
                    <td>${fieldLabels[key]}</td>
                    <td>${value}</td>
                </tr>
            `;
        }
    }

    // Handle unchecked checkboxes
    if (!formData.has('lms_only')) {
        html += `<tr><td>LMS Only</td><td>No</td></tr>`;
    }
    if (!formData.has('paid')) {
        html += `<tr><td>Paid Application</td><td>No</td></tr>`;
    }

    summaryTable.innerHTML = html;

    // Animate summary rows
    gsap.from('#summaryTable tr', {
        opacity: 0,
        x: -20,
        duration: 0.3,
        stagger: 0.05
    });
}

// ===== FORM SUBMISSION =====
function submitForm() {
    const btn = document.getElementById('submitBtn');
    const originalText = btn.innerHTML;
    
    // Disable button and show loading
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';

    // Collect form data
    const form = document.getElementById('admissionForm');
    const formData = new FormData(form);
    
    const data = {
        doctype: "Student Applicant",
        naming_series: "EDU-APP-.YYYY.-"
    };

    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    // Handle checkboxes
    data.lms_only = formData.has('lms_only') ? 1 : 0;
    data.paid = formData.has('paid') ? 1 : 0;

    // Submit to Frappe
    frappe.call({
        method: 'frappe.client.insert',
        args: { doc: data },
        callback: function(r) {
            if (!r.exc) {
                // Success
                setTimeout(() => {
                    showSuccessScreen();
                    clearDraft();
                    createConfetti();
                }, 500);
            }
        },
        error: function(err) {
            // Error
            btn.disabled = false;
            btn.innerHTML = originalText;
            showToast('Submission failed. Please try again.', 'error');
            console.error('Submission error:', err);
        }
    });
}

// ===== SUCCESS SCREEN =====
function showSuccessScreen() {
    const form = document.getElementById('admissionForm');
    const success = document.getElementById('successScreen');
    
    gsap.to(form, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
            form.style.display = 'none';
            success.classList.remove('hidden');
            
            gsap.fromTo(success,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
            );

            // Hide progress bar
            document.querySelector('.bg-white\\/10').style.display = 'none';
        }
    });
}

// ===== CONFETTI ANIMATION =====
function createConfetti() {
    const colors = ['#7b0200', '#fcb31c', '#10b981', '#3b82f6'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        document.body.appendChild(confetti);

        gsap.to(confetti, {
            y: window.innerHeight + 50,
            rotation: Math.random() * 720 - 360,
            opacity: 0,
            duration: Math.random() * 2 + 2,
            ease: 'power1.in',
            onComplete: () => confetti.remove()
        });
    }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===== AUTO-SAVE =====
function setupAutoSave() {
    let saveTimeout;
    
    document.querySelectorAll('.form-input, .checkbox-input').forEach(input => {
        input.addEventListener('change', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveDraft, 1000);
        });
    });
}

function saveDraft() {
    const form = document.getElementById('admissionForm');
    const formData = new FormData(form);
    const draft = {};

    for (let [key, value] of formData.entries()) {
        draft[key] = value;
    }

    localStorage.setItem('pccr_admission_draft', JSON.stringify(draft));
    console.log('Draft saved');
}

function loadDraft() {
    const draft = localStorage.getItem('pccr_admission_draft');
    
    if (draft) {
        try {
            const data = JSON.parse(draft);
            
            for (let [key, value] of Object.entries(data)) {
                const field = document.querySelector(`[name="${key}"]`);
                
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = value === 'on' || value === '1';
                    } else {
                        field.value = value;
                    }
                }
            }
            
            console.log('Draft loaded');
        } catch (e) {
            console.error('Failed to load draft:', e);
        }
    }
}

function clearDraft() {
    localStorage.removeItem('pccr_admission_draft');
}

// ===== SCROLL TO TOP =====
function setupScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== KEYBOARD SHORTCUTS =====
function handleKeyboardShortcuts(e) {
    // Don't trigger if typing in input
    if (e.target.matches('input, select, textarea')) {
        // Enter key moves to next field
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const inputs = Array.from(document.querySelectorAll('.form-input:not([type="hidden"])'));
            const currentIndex = inputs.indexOf(e.target);
            
            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus();
            }
        }
        return;
    }

    // Escape key - go back
    if (e.key === 'Escape' && CONFIG.currentStep > 1) {
        prevStep(CONFIG.currentStep - 1);
    }

    // Alt + Right Arrow - next step
    if (e.altKey && e.key === 'ArrowRight' && CONFIG.currentStep < CONFIG.totalSteps) {
        nextStep(CONFIG.currentStep + 1);
    }

    // Alt + Left Arrow - previous step
    if (e.altKey && e.key === 'ArrowLeft' && CONFIG.currentStep > 1) {
        prevStep(CONFIG.currentStep - 1);
    }
}

// ===== KEYBOARD SHORTCUTS HINT =====
function showKeyboardHint() {
    if (localStorage.getItem('pccr_shortcuts_shown')) {
        return;
    }

    setTimeout(() => {
        const hint = document.createElement('div');
        hint.className = 'fixed bottom-24 right-6 bg-gradient-to-br from-pccr-red to-pccr-red-dark text-white p-4 rounded-lg shadow-2xl max-w-xs z-50';
        hint.innerHTML = `
            <div class="font-bold mb-2 flex items-center gap-2">
                <i class="fas fa-keyboard"></i> Keyboard Shortcuts
            </div>
            <div class="text-sm space-y-1">
                <div><kbd class="bg-white/20 px-2 py-1 rounded">Enter</kbd> - Next field</div>
                <div><kbd class="bg-white/20 px-2 py-1 rounded">Alt + →</kbd> - Next step</div>
                <div><kbd class="bg-white/20 px-2 py-1 rounded">Esc</kbd> - Previous step</div>
            </div>
            <button onclick="this.parentElement.remove(); localStorage.setItem('pccr_shortcuts_shown', 'true');" 
                    class="mt-3 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm font-semibold transition-colors">
                Got it!
            </button>
        `;
        
        document.body.appendChild(hint);

        gsap.from(hint, {
            y: 50,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });

        // Auto-hide after 10 seconds
        setTimeout(() => {
            gsap.to(hint, {
                y: 50,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    hint.remove();
                    localStorage.setItem('pccr_shortcuts_shown', 'true');
                }
            });
        }, 10000);
    }, 3000);
}

// ===== FRAPPE READY =====
if (typeof frappe !== 'undefined') {
    frappe.ready(function() {
        console.log('Frappe is ready');
        
        // Setup program autocomplete
        const programInput = document.querySelector('[name="program"]');
        
        if (programInput) {
            programInput.addEventListener('input', function() {
                const value = this.value;
                
                if (value.length < 2) return;
                
                frappe.call({
                    method: "frappe.client.get_list",
                    args: {
                        doctype: "Program",
                        fields: ["program_name"],
                        filters: [["program_name", "like", "%" + value + "%"]],
                        limit: 5
                    },
                    callback: function(r) {
                        if (r.message && r.message.length > 0) {
                            // You can implement autocomplete dropdown here
                            console.log('Program suggestions:', r.message);
                        }
                    }
                });
            });
        }
    });
}

// Make functions globally available
window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitForm = submitForm;
