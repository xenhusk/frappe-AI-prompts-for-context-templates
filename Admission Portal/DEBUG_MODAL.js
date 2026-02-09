// DIAGNOSTIC SCRIPT - Run this in browser console when modal is open
// Copy and paste this entire script into the console and press Enter

(function() {
    console.log('=== MODAL DIAGNOSTIC REPORT ===\n');
    
    const modal = document.getElementById('assignmentModal');
    const modalContent = modal?.querySelector('.modal-content');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    
    if (!modal) {
        console.error('❌ Modal element not found!');
        return;
    }
    
    console.log('1. MODAL CONTAINER:');
    const modalStyles = window.getComputedStyle(modal);
    console.log('   Display:', modalStyles.display);
    console.log('   Position:', modalStyles.position);
    console.log('   Z-index:', modalStyles.zIndex);
    console.log('   Visibility:', modalStyles.visibility);
    console.log('   Opacity:', modalStyles.opacity);
    console.log('   Pointer-events:', modalStyles.pointerEvents);
    
    const modalRect = modal.getBoundingClientRect();
    console.log('   Position on screen:', {
        top: modalRect.top,
        left: modalRect.left,
        width: modalRect.width,
        height: modalRect.height,
        bottom: modalRect.bottom,
        right: modalRect.right
    });
    console.log('   Is in viewport:', 
        modalRect.top >= 0 && 
        modalRect.left >= 0 && 
        modalRect.bottom <= window.innerHeight && 
        modalRect.right <= window.innerWidth
    );
    
    console.log('\n2. MODAL OVERLAY:');
    if (modalOverlay) {
        const overlayStyles = window.getComputedStyle(modalOverlay);
        console.log('   Display:', overlayStyles.display);
        console.log('   Background:', overlayStyles.background);
        console.log('   Z-index:', overlayStyles.zIndex);
        console.log('   Opacity:', overlayStyles.opacity);
        const overlayRect = modalOverlay.getBoundingClientRect();
        console.log('   Size:', overlayRect.width + 'x' + overlayRect.height);
    } else {
        console.error('   ❌ Overlay not found');
    }
    
    console.log('\n3. MODAL CONTENT:');
    if (modalContent) {
        const contentStyles = window.getComputedStyle(modalContent);
        console.log('   Display:', contentStyles.display);
        console.log('   Position:', contentStyles.position);
        console.log('   Z-index:', contentStyles.zIndex);
        console.log('   Visibility:', contentStyles.visibility);
        console.log('   Opacity:', contentStyles.opacity);
        console.log('   Background:', contentStyles.backgroundColor);
        console.log('   Width:', contentStyles.width);
        console.log('   Height:', contentStyles.height);
        console.log('   Transform:', contentStyles.transform);
        
        const contentRect = modalContent.getBoundingClientRect();
        console.log('   Position on screen:', {
            top: contentRect.top,
            left: contentRect.left,
            width: contentRect.width,
            height: contentRect.height
        });
        console.log('   Is in viewport:', 
            contentRect.top >= 0 && 
            contentRect.left >= 0 && 
            contentRect.bottom <= window.innerHeight && 
            contentRect.right <= window.innerWidth
        );
    } else {
        console.error('   ❌ Modal content not found');
    }
    
    console.log('\n4. ELEMENTS WITH HIGHER Z-INDEX:');
    const allElements = document.querySelectorAll('*');
    const highZElements = [];
    allElements.forEach(el => {
        const z = parseInt(window.getComputedStyle(el).zIndex);
        if (z >= 99999 && el !== modal && el !== modalOverlay && el !== modalContent) {
            highZElements.push({
                element: el,
                zIndex: z,
                tag: el.tagName,
                id: el.id,
                classes: el.className
            });
        }
    });
    
    if (highZElements.length > 0) {
        console.warn('   ⚠️  Found elements with z-index >= 99999:');
        highZElements.forEach(item => {
            console.log(`   - ${item.tag}#${item.id}.${item.classes} (z-index: ${item.zIndex})`);
        });
    } else {
        console.log('   ✅ No elements with higher z-index found');
    }
    
    console.log('\n5. PARENT ELEMENTS OVERFLOW:');
    let parent = modal.parentElement;
    let level = 0;
    while (parent && level < 5) {
        const parentStyles = window.getComputedStyle(parent);
        if (parentStyles.overflow !== 'visible' || parentStyles.transform !== 'none') {
            console.warn(`   ⚠️  Level ${level} (${parent.tagName}):`, {
                overflow: parentStyles.overflow,
                transform: parentStyles.transform,
                position: parentStyles.position
            });
        }
        parent = parent.parentElement;
        level++;
    }
    
    console.log('\n6. QUICK TESTS:');
    
    // Test 1: Add red border
    console.log('   Test 1: Adding red border to modal...');
    modal.style.border = '10px solid red';
    
    // Test 2: Add background to modal content
    console.log('   Test 2: Adding bright background to modal content...');
    if (modalContent) {
        modalContent.style.backgroundColor = 'lime';
        modalContent.style.border = '5px solid blue';
    }
    
    // Test 3: Add text to body
    console.log('   Test 3: Adding test text to modal content...');
    if (modalContent) {
        const testDiv = document.createElement('div');
        testDiv.style.cssText = 'font-size: 50px; color: red; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 999999;';
        testDiv.textContent = 'CAN YOU SEE THIS?';
        modalContent.appendChild(testDiv);
    }
    
    console.log('\n7. ELEMENT AT SCREEN CENTER:');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const elementAtCenter = document.elementFromPoint(centerX, centerY);
    console.log('   Element at center of screen:', {
        tag: elementAtCenter?.tagName,
        id: elementAtCenter?.id,
        classes: elementAtCenter?.className,
        zIndex: window.getComputedStyle(elementAtCenter).zIndex
    });
    
    console.log('\n=== END DIAGNOSTIC ===');
    console.log('\nLook at your screen now. Do you see:');
    console.log('- A red border around the entire viewport?');
    console.log('- A lime green box with blue border in the center?');
    console.log('- Red text saying "CAN YOU SEE THIS?"');
    console.log('\nIf NO: The modal is being rendered but something is blocking it.');
    console.log('If YES: The modal IS visible, there might be a CSS styling issue making the actual content hard to see.');
})();
