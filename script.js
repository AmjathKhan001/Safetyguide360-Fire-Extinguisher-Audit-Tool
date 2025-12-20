// Fire Extinguisher Audit Tool - Script.js
// Global Variables
let extinguishers = [];
let currentSno = 1;
let currentStep = 1;
let visitorCount = 0;

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fire Extinguisher Audit Tool loaded');
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const auditDateInput = document.getElementById('auditDate');
    if (auditDateInput) {
        auditDateInput.value = today;
    }
    
    // Set expiry date to 1 year from today
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.value = nextYear.toISOString().split('T')[0];
    }
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load any saved data from localStorage
    loadSavedData();
    
    // Set up search functionality
    setupSearchFunctionality();
    
    // Initialize visitor counter
    initializeVisitorCounter();
    
    // Initialize social links
    initializeSocialLinks();
});

function initializeEventListeners() {
    console.log('Initializing event listeners');
    
    // Step navigation
    const nextToStep2Btn = document.getElementById('nextToStep2');
    if (nextToStep2Btn) {
        nextToStep2Btn.addEventListener('click', () => goToStep(2));
    }
    
    const skipBasicBtn = document.getElementById('skipBasicBtn');
    if (skipBasicBtn) {
        skipBasicBtn.addEventListener('click', () => goToStep(2));
    }
    
    const nextToStep3Btn = document.getElementById('nextToStep3');
    if (nextToStep3Btn) {
        nextToStep3Btn.addEventListener('click', () => goToStep(3));
    }
    
    const backToStep1Btn = document.getElementById('backToStep1');
    if (backToStep1Btn) {
        backToStep1Btn.addEventListener('click', () => goToStep(1));
    }
    
    const nextToStep4Btn = document.getElementById('nextToStep4');
    if (nextToStep4Btn) {
        nextToStep4Btn.addEventListener('click', () => goToStep(4));
    }
    
    const backToStep2Btn = document.getElementById('backToStep2');
    if (backToStep2Btn) {
        backToStep2Btn.addEventListener('click', () => goToStep(2));
    }
    
    const backToStep3Btn = document.getElementById('backToStep3');
    if (backToStep3Btn) {
        backToStep3Btn.addEventListener('click', () => goToStep(3));
    }
    
    const addToAuditBtn = document.getElementById('addToAuditBtn');
    if (addToAuditBtn) {
        addToAuditBtn.addEventListener('click', addExtinguisherFromReview);
    }
    
    const addAndNewBtn = document.getElementById('addAndNewBtn');
    if (addAndNewBtn) {
        addAndNewBtn.addEventListener('click', addExtinguisherAndStartNew);
    }
    
    // New Audit button
    const newAuditBtn = document.getElementById('newAuditBtn');
    if (newAuditBtn) {
        newAuditBtn.addEventListener('click', startNewAudit);
    }
    
    // Clear list button
    const clearListBtn = document.getElementById('clearListBtn');
    if (clearListBtn) {
        clearListBtn.addEventListener('click', function() {
            showConfirmModal(
                'Clear All Items',
                'Are you sure you want to clear all extinguishers from the list? This action cannot be undone.',
                clearAllExtinguishers
            );
        });
    }
    
    // Export list button
    const exportListBtn = document.getElementById('exportListBtn');
    if (exportListBtn) {
        exportListBtn.addEventListener('click', exportToCSV);
    }
    
    // Print button
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', printReport);
    }
    
    // Export PDF button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToPDF);
    }
    
    // Save PDF button
    const savePdfBtn = document.getElementById('savePdfBtn');
    if (savePdfBtn) {
        savePdfBtn.addEventListener('click', saveAsPDF);
    }
    
    // Generate report button
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
    
    // Load sample data button
    const loadSampleBtn = document.getElementById('loadSampleBtn');
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', loadSampleData);
    }
    
    // Footer links
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    const printGuide = document.getElementById('printGuide');
    if (printGuide) {
        printGuide.addEventListener('click', function(e) {
            e.preventDefault();
            showSuccessModal('Printing Guide', 'For best results, use landscape orientation and check "Background graphics" in print settings.');
        });
    }
    
    // Auto-save on input changes
    setupAutoSave();
    
    // Update review when any form field changes
    document.querySelectorAll('#step1 input, #step1 textarea').forEach(input => {
        input.addEventListener('change', updateReviewFromStep1);
    });
    
    document.querySelectorAll('#step2 input, #step2 select, #step2 textarea').forEach(input => {
        input.addEventListener('change', updateReviewFromStep2);
    });
    
    document.querySelectorAll('#step3 input:not(.hazard-checkboxes input), #step3 select, #step3 textarea').forEach(input => {
        input.addEventListener('change', updateReviewFromStep3);
    });
    
    // Update review when hazard checkboxes change
    document.querySelectorAll('.hazard-option input').forEach(cb => {
        cb.addEventListener('change', updateReviewFromStep3);
    });
    
    // Update recommended type based on area type and hazards
    const areaTypeSelect = document.getElementById('areaType');
    if (areaTypeSelect) {
        areaTypeSelect.addEventListener('change', updateRecommendedType);
    }
    
    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            const extinguisherResults = document.getElementById('extinguisherSearchResults');
            const capacityResults = document.getElementById('capacitySearchResults');
            
            if (extinguisherResults) extinguisherResults.style.display = 'none';
            if (capacityResults) capacityResults.style.display = 'none';
        }
    });
}

function initializeVisitorCounter() {
    // Load visitor count from localStorage
    const savedCount = localStorage.getItem('visitorCount');
    visitorCount = savedCount ? parseInt(savedCount) : 0;
    
    // Increment visitor count
    visitorCount++;
    localStorage.setItem('visitorCount', visitorCount.toString());
    
    // Update display
    const visitorCountElement = document.getElementById('visitorCount');
    if (visitorCountElement) {
        visitorCountElement.textContent = visitorCount.toLocaleString();
    }
}

function initializeSocialLinks() {
    // Social links are already in HTML, just ensure they open in new tab
    document.querySelectorAll('.social-link').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

function setupSearchFunctionality() {
    const extinguisherNameInput = document.getElementById('extinguisherName');
    const capacityInput = document.getElementById('capacity');
    const extinguisherResults = document.getElementById('extinguisherSearchResults');
    const capacityResults = document.getElementById('capacitySearchResults');
    
    if (!extinguisherNameInput || !capacityInput) return;
    
    // Get unique capacities
    const uniqueCapacities = getUniqueCapacities();
    
    // Populate capacity suggestions
    if (capacityResults && uniqueCapacities) {
        capacityResults.innerHTML = uniqueCapacities.map(capacity => 
            `<div class="search-result-item" onclick="selectCapacity('${capacity}')">${capacity}</div>`
        ).join('');
    }
    
    // Extinguisher name search
    if (extinguisherNameInput) {
        extinguisherNameInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            if (query.length < 2) {
                if (extinguisherResults) extinguisherResults.style.display = 'none';
                return;
            }
            
            const results = searchFireExtinguishers(query);
            
            if (extinguisherResults && results.length > 0) {
                extinguisherResults.innerHTML = results.map(ext => {
                    const displayText = `${ext.name} - ${ext.type} - ${ext.body} - ${ext.operating} - ${ext.agent} - ${ext.agentName} - ${ext.capacity}`;
                    const highlightedText = displayText.replace(new RegExp(query, 'gi'), match => `<span class="highlight">${match}</span>`);
                    
                    return `<div class="search-result-item" onclick="selectExtinguisher(${JSON.stringify(ext).replace(/"/g, '&quot;')})">
                        ${highlightedText}
                    </div>`;
                }).join('');
                
                extinguisherResults.style.display = 'block';
            } else if (extinguisherResults) {
                extinguisherResults.style.display = 'none';
            }
        });
    }
    
    // Capacity search
    if (capacityInput) {
        capacityInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            
            if (query.length < 1) {
                if (capacityResults) capacityResults.style.display = 'none';
                return;
            }
            
            const filteredCapacities = uniqueCapacities.filter(capacity => 
                capacity.toLowerCase().includes(query)
            );
            
            if (capacityResults && filteredCapacities.length > 0) {
                capacityResults.innerHTML = filteredCapacities.map(capacity => {
                    const highlighted = capacity.replace(new RegExp(query, 'gi'), match => `<span class="highlight">${match}</span>`);
                    return `<div class="search-result-item" onclick="selectCapacity('${capacity}')">${highlighted}</div>`;
                }).join('');
                
                capacityResults.style.display = 'block';
            } else if (capacityResults) {
                capacityResults.style.display = 'none';
            }
        });
    }
    
    // Focus management
    if (extinguisherNameInput) {
        extinguisherNameInput.addEventListener('focus', function() {
            if (this.value.length >= 2 && extinguisherResults) {
                extinguisherResults.style.display = 'block';
            }
        });
    }
    
    if (capacityInput) {
        capacityInput.addEventListener('focus', function() {
            if (capacityResults) {
                capacityResults.style.display = 'block';
            }
        });
    }
}

function selectExtinguisher(extinguisher) {
    autoFillExtinguisherDetails(extinguisher);
    updateReviewFromStep2();
}

function selectCapacity(capacity) {
    const capacityInput = document.getElementById('capacity');
    if (capacityInput) {
        capacityInput.value = capacity;
    }
    
    const capacityResults = document.getElementById('capacitySearchResults');
    if (capacityResults) {
        capacityResults.style.display = 'none';
    }
    
    updateReviewFromStep2();
}

function goToStep(step) {
    console.log(`Going to step ${step}`);
    
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
        return;
    }
    
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show target step
    const targetStep = document.getElementById(`step${step}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }
    
    // Update navigation steps
    document.querySelectorAll('.nav-step').forEach((navStep, index) => {
        navStep.classList.remove('active', 'completed');
        if (index + 1 === step) {
            navStep.classList.add('active');
        } else if (index + 1 < step) {
            navStep.classList.add('completed');
        }
    });
    
    // Update review if going to step 4
    if (step === 4) {
        updateReviewSummary();
    }
    
    currentStep = step;
    
    // Scroll to form section
    const formSection = document.querySelector('.audit-form-section');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            const accountName = document.getElementById('accountName')?.value.trim();
            const address = document.getElementById('address')?.value.trim();
            const auditDate = document.getElementById('auditDate')?.value;
            const contactPerson = document.getElementById('contactPerson')?.value.trim();
            
            if (!accountName || !address || !auditDate || !contactPerson) {
                showSuccessModal('Required Fields', 'Please fill in all required fields (marked with *) in Basic Information.');
                return false;
            }
            break;
            
        case 2:
            const location = document.getElementById('location')?.value.trim();
            const extinguisherName = document.getElementById('extinguisherName')?.value.trim();
            const extinguisherType = document.getElementById('extinguisherType')?.value;
            const capacity = document.getElementById('capacity')?.value;
            const quantity = document.getElementById('quantity')?.value;
            const expiryDate = document.getElementById('expiryDate')?.value;
            const status = document.getElementById('status')?.value;
            
            if (!location || !extinguisherName || !extinguisherType || !capacity || !quantity || !expiryDate || !status) {
                showSuccessModal('Required Fields', 'Please fill in all required fields (marked with *) in Extinguisher Details.');
                return false;
            }
            break;
            
        case 3:
            const areaType = document.getElementById('areaType')?.value;
            const hasHazards = document.querySelectorAll('.hazard-option input:checked').length > 0;
            
            if (!areaType) {
                showSuccessModal('Required Fields', 'Please select the Area Type in Hazard Assessment.');
                return false;
            }
            
            if (!hasHazards) {
                const proceed = confirm('No hazard classes selected. Are you sure you want to continue?');
                if (!proceed) return false;
            }
            break;
    }
    
    return true;
}

function startNewAudit() {
    showConfirmModal(
        'Start New Audit',
        'Are you sure you want to start a new audit? All unsaved changes will be lost.',
        function() {
            // Clear all data
            extinguishers = [];
            currentSno = 1;
            
            // Clear form
            const accountName = document.getElementById('accountName');
            const address = document.getElementById('address');
            const auditDate = document.getElementById('auditDate');
            const contactPerson = document.getElementById('contactPerson');
            const contactPhone = document.getElementById('contactPhone');
            const contactEmail = document.getElementById('contactEmail');
            
            if (accountName) accountName.value = '';
            if (address) address.value = '';
            if (auditDate) auditDate.value = new Date().toISOString().split('T')[0];
            if (contactPerson) contactPerson.value = '';
            if (contactPhone) contactPhone.value = '';
            if (contactEmail) contactEmail.value = '';
            
            // Reset to step 1
            goToStep(1);
            
            // Update UI
            updateExtinguisherTable();
            updateCounters();
            updateReportPreview();
            
            // Clear localStorage
            localStorage.removeItem('fireExtinguisherAudit');
            
            showSuccessModal('New Audit Started', 'You can now begin a new fire extinguisher audit.');
        }
    );
}

function updateReviewFromStep1() {
    const reviewCompany = document.getElementById('reviewCompany');
    const reviewAddress = document.getElementById('reviewAddress');
    const reviewContact = document.getElementById('reviewContact');
    
    if (reviewCompany) {
        const accountName = document.getElementById('accountName');
        reviewCompany.textContent = accountName ? accountName.value || '-' : '-';
    }
    
    if (reviewAddress) {
        const address = document.getElementById('address');
        reviewAddress.textContent = address ? address.value || '-' : '-';
    }
    
    if (reviewContact) {
        const contactPerson = document.getElementById('contactPerson')?.value;
        const contactPhone = document.getElementById('contactPhone')?.value;
        const contactEmail = document.getElementById('contactEmail')?.value;
        
        let contactInfo = contactPerson || '-';
        if (contactPhone) contactInfo += ` | ${contactPhone}`;
        if (contactEmail) contactInfo += ` | ${contactEmail}`;
        
        reviewContact.textContent = contactInfo;
    }
}

function updateReviewFromStep2() {
    const elements = {
        reviewLocation: 'location',
        reviewName: 'extinguisherName',
        reviewType: 'extinguisherType',
        reviewCapacity: 'capacity',
        reviewQuantity: 'quantity',
        reviewStatus: 'status',
        reviewExpiry: 'expiryDate',
        reviewRecommend: 'recommendReplacement'
    };
    
    for (const [reviewId, inputId] of Object.entries(elements)) {
        const reviewElement = document.getElementById(reviewId);
        if (reviewElement) {
            if (inputId === 'recommendReplacement') {
                const checkbox = document.getElementById(inputId);
                reviewElement.textContent = checkbox && checkbox.checked ? 'Yes' : 'No';
            } else {
                const inputElement = document.getElementById(inputId);
                reviewElement.textContent = inputElement ? inputElement.value || (inputId === 'quantity' ? '1' : '-') : '-';
                
                // Special formatting for dates
                if (inputId === 'expiryDate' && inputElement && inputElement.value) {
                    reviewElement.textContent = formatDate(inputElement.value) || '-';
                }
            }
        }
    }
}

function updateReviewFromStep3() {
    const reviewAreaType = document.getElementById('reviewAreaType');
    const reviewRiskLevel = document.getElementById('reviewRiskLevel');
    const reviewHazards = document.getElementById('reviewHazards');
    const reviewRemarks = document.getElementById('reviewRemarks');
    
    if (reviewAreaType) {
        const areaType = document.getElementById('areaType');
        reviewAreaType.textContent = areaType ? areaType.value || '-' : '-';
    }
    
    if (reviewRiskLevel) {
        const riskLevel = document.getElementById('riskLevel');
        reviewRiskLevel.textContent = riskLevel ? riskLevel.value || '-' : '-';
    }
    
    if (reviewHazards) {
        // Get selected hazards
        const selectedHazards = Array.from(document.querySelectorAll('.hazard-option input:checked'))
            .map(cb => cb.value)
            .join(', ');
        
        reviewHazards.textContent = selectedHazards || 'None selected';
    }
    
    if (reviewRemarks) {
        // Update remarks
        const hazardDesc = document.getElementById('hazardDescription')?.value;
        const hazardRemarks = document.getElementById('hazardRemarks')?.value;
        let remarks = '';
        
        if (hazardDesc) remarks += hazardDesc;
        if (hazardRemarks) remarks += (remarks ? '\n' : '') + hazardRemarks;
        
        reviewRemarks.textContent = remarks || '-';
    }
}

function updateRecommendedType() {
    const areaType = document.getElementById('areaType')?.value;
    const selectedHazards = Array.from(document.querySelectorAll('.hazard-option input:checked'))
        .map(cb => cb.value);
    
    let recommendedType = '';
    
    if (areaType === 'Kitchen' || selectedHazards.includes('Class K')) {
        recommendedType = 'KITCHEN';
    } else if (selectedHazards.includes('Class C')) {
        recommendedType = 'CO2';
    } else if (selectedHazards.includes('Class B') && !selectedHazards.includes('Class A')) {
        recommendedType = 'FOAM';
    } else if (selectedHazards.length > 0) {
        recommendedType = 'ABC / DCP';
    }
    
    const recommendedTypeSelect = document.getElementById('recommendedType');
    if (recommendedTypeSelect && recommendedType) {
        recommendedTypeSelect.value = recommendedType;
    }
}

function updateReviewSummary() {
    updateReviewFromStep1();
    updateReviewFromStep2();
    updateReviewFromStep3();
}

function addExtinguisherFromReview() {
    // Get all form values
    const extinguisherData = {
        // Basic Info
        accountName: document.getElementById('accountName')?.value.trim() || '',
        address: document.getElementById('address')?.value.trim() || '',
        auditDate: document.getElementById('auditDate')?.value || '',
        contactPerson: document.getElementById('contactPerson')?.value.trim() || '',
        contactPhone: document.getElementById('contactPhone')?.value.trim() || '',
        contactEmail: document.getElementById('contactEmail')?.value.trim() || '',
        
        // Extinguisher Details
        sno: currentSno++,
        location: document.getElementById('location')?.value.trim() || '',
        extinguisherName: document.getElementById('extinguisherName')?.value.trim() || '',
        type: document.getElementById('extinguisherType')?.value || '',
        bodyType: document.getElementById('bodyType')?.value || '',
        operatingType: document.getElementById('operatingType')?.value || '',
        fireAgentType: document.getElementById('fireAgentType')?.value || '',
        fireAgentName: document.getElementById('fireAgentName')?.value.trim() || '',
        capacity: document.getElementById('capacity')?.value || '',
        quantity: parseInt(document.getElementById('quantity')?.value) || 1,
        brand: document.getElementById('brand')?.value.trim() || '',
        serialNumber: document.getElementById('serialNumber')?.value.trim() || '',
        installDate: document.getElementById('installationDate')?.value || '',
        expiryDate: document.getElementById('expiryDate')?.value || '',
        status: document.getElementById('status')?.value || 'Good',
        recommendReplacement: document.getElementById('recommendReplacement')?.checked || false,
        extinguisherRemarks: document.getElementById('extinguisherRemarks')?.value.trim() || '',
        
        // Hazard Assessment
        areaType: document.getElementById('areaType')?.value || '',
        trafficLevel: document.getElementById('trafficLevel')?.value || 'Medium',
        hazards: Array.from(document.querySelectorAll('.hazard-option input:checked'))
            .map(cb => cb.value)
            .join(', '),
        hazardDescription: document.getElementById('hazardDescription')?.value.trim() || '',
        recommendedType: document.getElementById('recommendedType')?.value || '',
        riskLevel: document.getElementById('riskLevel')?.value || 'Medium',
        hazardRemarks: document.getElementById('hazardRemarks')?.value.trim() || ''
    };
    
    // Validate required fields
    if (!extinguisherData.location || !extinguisherData.extinguisherName || !extinguisherData.capacity) {
        showSuccessModal('Validation Error', 'Please fill in all required fields: Location, Extinguisher Name, and Capacity.');
        goToStep(2);
        return;
    }
    
    if (!extinguisherData.areaType) {
        showSuccessModal('Validation Error', 'Please select Area Type in Hazard Assessment.');
        goToStep(3);
        return;
    }
    
    // Add to array
    extinguishers.push(extinguisherData);
    
    // Update table and counters
    updateExtinguisherTable();
    updateCounters();
    
    // Show success message
    showSuccessModal('Success!', 'Fire extinguisher added to the audit list successfully.');
    
    // Save to localStorage
    saveToLocalStorage();
}

function addExtinguisherAndStartNew() {
    addExtinguisherFromReview();
    
    // Clear form for next entry (keep basic info)
    const clearFields = [
        'location', 'extinguisherName', 'extinguisherType', 'bodyType', 'operatingType',
        'fireAgentType', 'fireAgentName', 'capacity', 'brand', 'serialNumber',
        'installationDate', 'extinguisherRemarks'
    ];
    
    clearFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) element.value = '';
    });
    
    // Reset specific fields
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) quantityInput.value = '1';
    
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        expiryDateInput.value = nextYear.toISOString().split('T')[0];
    }
    
    const statusSelect = document.getElementById('status');
    if (statusSelect) statusSelect.value = 'Good';
    
    const recommendCheckbox = document.getElementById('recommendReplacement');
    if (recommendCheckbox) recommendCheckbox.checked = false;
    
    // Reset hazard assessment
    const areaTypeSelect = document.getElementById('areaType');
    if (areaTypeSelect) areaTypeSelect.value = '';
    
    const trafficLevelSelect = document.getElementById('trafficLevel');
    if (trafficLevelSelect) trafficLevelSelect.value = 'Medium';
    
    document.querySelectorAll('.hazard-option input').forEach(cb => {
        cb.checked = false;
    });
    
    const hazardDescription = document.getElementById('hazardDescription');
    if (hazardDescription) hazardDescription.value = '';
    
    const recommendedType = document.getElementById('recommendedType');
    if (recommendedType) recommendedType.value = '';
    
    const riskLevel = document.getElementById('riskLevel');
    if (riskLevel) riskLevel.value = 'Medium';
    
    const hazardRemarks = document.getElementById('hazardRemarks');
    if (hazardRemarks) hazardRemarks.value = '';
    
    // Go back to step 2
    goToStep(2);
}

function updateExtinguisherTable() {
    const tableBody = document.getElementById('extinguisherTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    extinguishers.forEach(ext => {
        const row = document.createElement('tr');
        row.className = 'fade-in';
        
        // Status badge
        let statusClass = 'status-good';
        if (ext.status === 'Needs Service' || ext.status === 'Expired' || ext.status === 'Not Accessible') {
            statusClass = 'status-warning';
        } else if (ext.status === 'Damaged' || ext.status === 'Missing') {
            statusClass = 'status-danger';
        }
        
        // Risk badge
        let riskClass = 'risk-' + (ext.riskLevel || 'Medium').toLowerCase();
        
        // Prepare extinguisher display name
        const extinguisherDisplay = ext.extinguisherName.length > 30 ? 
            ext.extinguisherName.substring(0, 30) + '...' : ext.extinguisherName;
        
        row.innerHTML = `
            <td>${ext.sno}</td>
            <td>${ext.location}</td>
            <td>${extinguisherDisplay}</td>
            <td>${ext.capacity}</td>
            <td>${ext.quantity}</td>
            <td><span class="status-badge ${statusClass}">${ext.status}</span></td>
            <td>${formatDate(ext.expiryDate)}</td>
            <td><span class="risk-badge ${riskClass}">${ext.riskLevel || 'Medium'}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editExtinguisher(${ext.sno})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteExtinguisher(${ext.sno})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function updateCounters() {
    const totalItems = extinguishers.length;
    const totalQuantity = extinguishers.reduce((sum, ext) => sum + ext.quantity, 0);
    const attentionCount = extinguishers.filter(ext => 
        ext.status !== 'Good' && ext.status !== 'Not Accessible'
    ).reduce((sum, ext) => sum + ext.quantity, 0);
    
    const totalCountElement = document.getElementById('totalCount');
    const totalQuantityElement = document.getElementById('totalQuantity');
    const attentionCountElement = document.getElementById('attentionCount');
    const previewTotalElement = document.getElementById('previewTotal');
    const previewGoodElement = document.getElementById('previewGood');
    const previewAttentionElement = document.getElementById('previewAttention');
    
    if (totalCountElement) totalCountElement.textContent = totalItems;
    if (totalQuantityElement) totalQuantityElement.textContent = totalQuantity;
    if (attentionCountElement) attentionCountElement.textContent = attentionCount;
    if (previewTotalElement) previewTotalElement.textContent = totalQuantity;
    if (previewGoodElement) previewGoodElement.textContent = totalQuantity - attentionCount;
    if (previewAttentionElement) previewAttentionElement.textContent = attentionCount;
}

function deleteExtinguisher(sno) {
    showConfirmModal(
        'Delete Extinguisher',
        'Are you sure you want to delete this extinguisher from the list?',
        function() {
            extinguishers = extinguishers.filter(ext => ext.sno !== sno);
            updateExtinguisherTable();
            updateCounters();
            saveToLocalStorage();
        }
    );
}

function editExtinguisher(sno) {
    const ext = extinguishers.find(e => e.sno === sno);
    if (!ext) return;
    
    // Populate basic info if not already set
    const accountName = document.getElementById('accountName');
    const address = document.getElementById('address');
    const auditDate = document.getElementById('auditDate');
    const contactPerson = document.getElementById('contactPerson');
    const contactPhone = document.getElementById('contactPhone');
    const contactEmail = document.getElementById('contactEmail');
    
    if (accountName && !accountName.value) accountName.value = ext.accountName || '';
    if (address && !address.value) address.value = ext.address || '';
    if (auditDate && !auditDate.value) auditDate.value = ext.auditDate || '';
    if (contactPerson && !contactPerson.value) contactPerson.value = ext.contactPerson || '';
    if (contactPhone && !contactPhone.value) contactPhone.value = ext.contactPhone || '';
    if (contactEmail && !contactEmail.value) contactEmail.value = ext.contactEmail || '';
    
    // Populate extinguisher details
    const fields = {
        'location': ext.location,
        'extinguisherName': ext.extinguisherName,
        'extinguisherType': ext.type,
        'bodyType': ext.bodyType,
        'operatingType': ext.operatingType,
        'fireAgentType': ext.fireAgentType,
        'fireAgentName': ext.fireAgentName,
        'capacity': ext.capacity,
        'quantity': ext.quantity,
        'brand': ext.brand,
        'serialNumber': ext.serialNumber,
        'installationDate': ext.installDate,
        'expiryDate': ext.expiryDate,
        'status': ext.status,
        'extinguisherRemarks': ext.extinguisherRemarks
    };
    
    for (const [id, value] of Object.entries(fields)) {
        const element = document.getElementById(id);
        if (element) element.value = value || '';
    }
    
    const recommendCheckbox = document.getElementById('recommendReplacement');
    if (recommendCheckbox) recommendCheckbox.checked = ext.recommendReplacement || false;
    
    // Populate hazard assessment
    const hazardFields = {
        'areaType': ext.areaType,
        'trafficLevel': ext.trafficLevel,
        'hazardDescription': ext.hazardDescription,
        'recommendedType': ext.recommendedType,
        'riskLevel': ext.riskLevel,
        'hazardRemarks': ext.hazardRemarks
    };
    
    for (const [id, value] of Object.entries(hazardFields)) {
        const element = document.getElementById(id);
        if (element) element.value = value || '';
    }
    
    // Set hazard checkboxes
    const hazards = ext.hazards ? ext.hazards.split(', ') : [];
    document.querySelectorAll('.hazard-option input').forEach(cb => {
        cb.checked = hazards.includes(cb.value);
    });
    
    // Remove from list (will be re-added when saved)
    extinguishers = extinguishers.filter(e => e.sno !== sno);
    updateExtinguisherTable();
    updateCounters();
    
    // Go to step 2
    goToStep(2);
    
    showSuccessModal('Edit Mode', 'Extinguisher loaded for editing. Make your changes and proceed through the steps to save.');
}

function clearAllExtinguishers() {
    extinguishers = [];
    currentSno = 1;
    updateExtinguisherTable();
    updateCounters();
    updateReportPreview();
    saveToLocalStorage();
    showSuccessModal('Cleared', 'All extinguishers have been removed from the list.');
}

function generateReport() {
    if (extinguishers.length === 0) {
        showSuccessModal('No Data', 'Please add at least one fire extinguisher before generating a report.');
        return;
    }
    
    updateReportPreview();
    
    // Add save PDF button if not exists
    if (!document.getElementById('savePdfBtn')) {
        const reportHeader = document.querySelector('.report-preview-section .section-header');
        if (reportHeader) {
            const savePdfBtn = document.createElement('button');
            savePdfBtn.id = 'savePdfBtn';
            savePdfBtn.className = 'btn btn-print';
            savePdfBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Save as PDF';
            savePdfBtn.addEventListener('click', saveAsPDF);
            reportHeader.appendChild(savePdfBtn);
        }
    }
    
    // Scroll to report section
    const reportSection = document.getElementById('reportSection');
    if (reportSection) {
        reportSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    showSuccessModal('Report Generated', 'Your fire extinguisher audit report has been generated successfully.');
}

function updateReportPreview() {
    const reportDetails = document.querySelector('.report-details');
    if (!reportDetails) return;
    
    if (extinguishers.length === 0) {
        reportDetails.innerHTML = `
            <p class="no-data">No audit data available. Please add extinguishers and generate a report.</p>
        `;
        return;
    }
    
    // Use first extinguisher's basic info (all should be same)
    const firstExt = extinguishers[0];
    
    // Update report header
    const reportElements = {
        'reportAccountName': firstExt.accountName || 'Not specified',
        'reportAddress': firstExt.address || 'Not specified',
        'reportDate': formatDate(firstExt.auditDate) || 'Not specified',
        'reportContact': firstExt.contactPerson || 'Not specified'
    };
    
    for (const [id, value] of Object.entries(reportElements)) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }
    
    // Generate report details
    let reportHTML = `
        <div class="report-executive">
            <h4>Executive Summary</h4>
            <div class="summary-grid">
                <div class="summary-box">
                    <span class="summary-title">Total Extinguishers</span>
                    <span class="summary-number">${extinguishers.length}</span>
                </div>
                <div class="summary-box">
                    <span class="summary-title">Total Quantity</span>
                    <span class="summary-number">${extinguishers.reduce((sum, ext) => sum + ext.quantity, 0)}</span>
                </div>
                <div class="summary-box">
                    <span class="summary-title">Good Condition</span>
                    <span class="summary-number" style="color: #34bf49;">${extinguishers.filter(ext => ext.status === 'Good').length}</span>
                </div>
                <div class="summary-box">
                    <span class="summary-title">Needs Attention</span>
                    <span class="summary-number" style="color: #ff4c4c;">${extinguishers.filter(ext => ext.status !== 'Good').length}</span>
                </div>
            </div>
        </div>
        
        <h4>Detailed Audit Report</h4>
        <div class="report-table-container">
            <table class="report-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Location</th>
                        <th>Extinguisher</th>
                        <th>Capacity</th>
                        <th>Qty</th>
                        <th>Status</th>
                        <th>Expiry Date</th>
                        <th>Risk Level</th>
                        <th>Recommendation</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    extinguishers.forEach(ext => {
        const recommendation = ext.recommendReplacement ? 'Replace/Add' : 'OK';
        reportHTML += `
            <tr>
                <td>${ext.sno}</td>
                <td>${ext.location}</td>
                <td>${ext.extinguisherName}</td>
                <td>${ext.capacity}</td>
                <td>${ext.quantity}</td>
                <td><span class="status-badge status-${ext.status === 'Good' ? 'good' : 'warning'}">${ext.status}</span></td>
                <td>${formatDate(ext.expiryDate)}</td>
                <td><span class="risk-badge risk-${(ext.riskLevel || 'Medium').toLowerCase()}">${ext.riskLevel || 'Medium'}</span></td>
                <td>${recommendation}</td>
            </tr>
        `;
    });
    
    reportHTML += `
                </tbody>
            </table>
        </div>
        
        <h4>Key Findings & Recommendations</h4>
        <div class="findings">
    `;
    
    // Generate findings
    const needsAttention = extinguishers.filter(ext => ext.status !== 'Good');
    const recommendedReplacements = extinguishers.filter(ext => ext.recommendReplacement);
    
    if (needsAttention.length === 0 && recommendedReplacements.length === 0) {
        reportHTML += '<p><strong>✓ All fire extinguishers are in good working condition.</strong></p>';
    } else {
        reportHTML += '<ul class="findings-list">';
        
        if (needsAttention.length > 0) {
            reportHTML += `<li><strong>Extinguishers Needing Attention (${needsAttention.length}):</strong>`;
            needsAttention.forEach(ext => {
                reportHTML += `<br>• ${ext.location}: ${ext.extinguisherName} - ${ext.status}`;
            });
            reportHTML += '</li>';
        }
        
        if (recommendedReplacements.length > 0) {
            reportHTML += `<li><strong>Recommended for Replacement/Addition (${recommendedReplacements.length}):</strong>`;
            recommendedReplacements.forEach(ext => {
                reportHTML += `<br>• ${ext.location}: ${ext.extinguisherName}`;
            });
            reportHTML += '</li>';
        }
        
        reportHTML += '</ul>';
    }
    
    // High risk areas
    const highRisk = extinguishers.filter(ext => (ext.riskLevel || 'Medium') === 'High' || (ext.riskLevel || 'Medium') === 'Critical');
    if (highRisk.length > 0) {
        reportHTML += `<p><strong>High Risk Areas Identified:</strong> ${highRisk.map(e => e.location).join(', ')}</p>`;
    }
    
    reportHTML += `
        </div>
        
        <div class="report-footer">
            <div class="signature-section">
                <div class="signature-box">
                    <p><strong>Audit Conducted By:</strong></p>
                    <p class="signature-line">${firstExt.contactPerson || '_________________'}</p>
                </div>
                <div class="signature-box">
                    <p><strong>Date:</strong></p>
                    <p>${formatDate(firstExt.auditDate)}</p>
                </div>
            </div>
            <div class="report-notes">
                <p><strong>Note:</strong> This report is generated by Fire Extinguisher Audit Tool. Regular inspections are recommended as per NFPA 10 standards.</p>
                <p><strong>Website:</strong> https://safetyguide360-fire-extinguisher-au.vercel.app/</p>
                <p><strong>Contact:</strong> contact@amjathkhan.com | +91-9750816163</p>
            </div>
        </div>
    `;
    
    reportDetails.innerHTML = reportHTML;
}

function loadSampleData() {
    showConfirmModal(
        'Load Sample Data',
        'This will replace any existing data with sample fire extinguisher records. Continue?',
        function() {
            // Clear existing data
            extinguishers = [];
            currentSno = 1;
            
            // Sample data
            const sampleExtinguishers = [
                {
                    sno: 1,
                    accountName: 'Sample Manufacturing Company Inc.',
                    address: '123 Industrial Estate, Safety City, SC 12345',
                    auditDate: new Date().toISOString().split('T')[0],
                    contactPerson: 'John Safety Manager',
                    contactPhone: '(555) 987-6543',
                    contactEmail: 'john.safety@samplecompany.com',
                    
                    location: 'Main Production Floor',
                    extinguisherName: 'ABC / DCP - PORTABLE - MILD STEEL - STORE PRESSURE - POWDER - MAP 90% - 9 KG',
                    type: 'PORTABLE',
                    bodyType: 'MILD STEEL',
                    operatingType: 'STORE PRESSURE',
                    fireAgentType: 'POWDER',
                    fireAgentName: 'MAP 90%',
                    capacity: '9 KG',
                    quantity: 3,
                    brand: 'FireSafe Pro',
                    serialNumber: 'FSP-2023-001',
                    installDate: '2023-03-15',
                    expiryDate: '2024-03-15',
                    status: 'Good',
                    recommendReplacement: false,
                    extinguisherRemarks: 'Properly mounted near exit',
                    
                    areaType: 'Manufacturing',
                    trafficLevel: 'Medium',
                    hazards: 'Class A, Class B, Class C',
                    hazardDescription: 'Production area with machinery and flammable materials',
                    recommendedType: 'ABC / DCP',
                    riskLevel: 'High',
                    hazardRemarks: 'Regular inspection required due to high risk'
                },
                {
                    sno: 2,
                    accountName: 'Sample Manufacturing Company Inc.',
                    address: '123 Industrial Estate, Safety City, SC 12345',
                    auditDate: new Date().toISOString().split('T')[0],
                    contactPerson: 'John Safety Manager',
                    contactPhone: '(555) 987-6543',
                    contactEmail: 'john.safety@samplecompany.com',
                    
                    location: 'Electrical Control Room',
                    extinguisherName: 'CO2 - PORTABLE - MILD STEEL - STORE PRESSURE - GAS - CO2 - 4.5 KG',
                    type: 'PORTABLE',
                    bodyType: 'MILD STEEL',
                    operatingType: 'STORE PRESSURE',
                    fireAgentType: 'GAS',
                    fireAgentName: 'CO2',
                    capacity: '4.5 KG',
                    quantity: 1,
                    brand: 'ElectricalSafe',
                    serialNumber: 'ES-2023-002',
                    installDate: '2023-05-20',
                    expiryDate: '2024-05-20',
                    status: 'Good',
                    recommendReplacement: false,
                    extinguisherRemarks: 'For electrical equipment protection',
                    
                    areaType: 'Electrical Room',
                    trafficLevel: 'Low',
                    hazards: 'Class C',
                    hazardDescription: 'Critical electrical control panels',
                    recommendedType: 'CO2',
                    riskLevel: 'Critical',
                    hazardRemarks: 'Critical area - monthly inspection required'
                },
                {
                    sno: 3,
                    accountName: 'Sample Manufacturing Company Inc.',
                    address: '123 Industrial Estate, Safety City, SC 12345',
                    auditDate: new Date().toISOString().split('T')[0],
                    contactPerson: 'John Safety Manager',
                    contactPhone: '(555) 987-6543',
                    contactEmail: 'john.safety@samplecompany.com',
                    
                    location: 'Staff Kitchen',
                    extinguisherName: 'KITCHEN (K/F CLASS) - PORTABLE - STAINLESS STEEL - STORE PRESSURE - KITCHEN - WET CHEMICAL - 6 LTR',
                    type: 'PORTABLE',
                    bodyType: 'STAINLESS STEEL',
                    operatingType: 'STORE PRESSURE',
                    fireAgentType: 'KITCHEN',
                    fireAgentName: 'WET CHEMICAL',
                    capacity: '6 LTR',
                    quantity: 1,
                    brand: 'KitchenGuard',
                    serialNumber: 'KG-2022-003',
                    installDate: '2022-11-10',
                    expiryDate: '2023-11-10',
                    status: 'Expired',
                    recommendReplacement: true,
                    extinguisherRemarks: 'EXPIRED - NEEDS IMMEDIATE REPLACEMENT',
                    
                    areaType: 'Kitchen',
                    trafficLevel: 'Medium',
                    hazards: 'Class K, Class A',
                    hazardDescription: 'Cooking area with deep fryers and flammable oils',
                    recommendedType: 'KITCHEN',
                    riskLevel: 'High',
                    hazardRemarks: 'Expired extinguisher - replace immediately with wet chemical type'
                }
            ];
            
            // Add sample data
            extinguishers = sampleExtinguishers;
            currentSno = sampleExtinguishers.length + 1;
            
            // Fill basic info
            const accountName = document.getElementById('accountName');
            const address = document.getElementById('address');
            const auditDate = document.getElementById('auditDate');
            const contactPerson = document.getElementById('contactPerson');
            const contactPhone = document.getElementById('contactPhone');
            const contactEmail = document.getElementById('contactEmail');
            
            if (accountName) accountName.value = 'Sample Manufacturing Company Inc.';
            if (address) address.value = '123 Industrial Estate, Safety City, SC 12345';
            if (auditDate) auditDate.value = new Date().toISOString().split('T')[0];
            if (contactPerson) contactPerson.value = 'John Safety Manager';
            if (contactPhone) contactPhone.value = '(555) 987-6543';
            if (contactEmail) contactEmail.value = 'john.safety@samplecompany.com';
            
            // Update UI
            updateExtinguisherTable();
            updateCounters();
            
            showSuccessModal('Sample Data Loaded', 'Sample fire extinguisher data has been loaded. You can now generate a report or modify the data as needed.');
        }
    );
}

function exportToCSV() {
    if (extinguishers.length === 0) {
        showSuccessModal('No Data', 'There is no data to export. Please add extinguishers first.');
        return;
    }
    
    // Create CSV content
    const headers = ['S.No', 'Location', 'Extinguisher Name', 'Type', 'Body Type', 'Operating Type', 'Fire Agent Type', 'Fire Agent Name', 'Capacity', 'Quantity', 'Brand', 'Serial Number', 'Install Date', 'Expiry Date', 'Status', 'Recommend Replacement', 'Area Type', 'Traffic Level', 'Hazards', 'Risk Level', 'Remarks'];
    const rows = extinguishers.map(ext => [
        ext.sno,
        ext.location,
        ext.extinguisherName,
        ext.type,
        ext.bodyType,
        ext.operatingType,
        ext.fireAgentType,
        ext.fireAgentName,
        ext.capacity,
        ext.quantity,
        ext.brand,
        ext.serialNumber,
        formatDate(ext.installDate),
        formatDate(ext.expiryDate),
        ext.status,
        ext.recommendReplacement ? 'Yes' : 'No',
        ext.areaType,
        ext.trafficLevel,
        ext.hazards,
        ext.riskLevel,
        ext.extinguisherRemarks
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `fire_extinguisher_audit_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccessModal('CSV Exported', 'Your fire extinguisher data has been exported to CSV file.');
}

async function exportToPDF() {
    if (extinguishers.length === 0) {
        showSuccessModal('No Data', 'There is no data to export. Please add extinguishers first.');
        return;
    }
    
    try {
        // Load jsPDF dynamically
        if (typeof window.jspdf === 'undefined') {
            showSuccessModal('PDF Error', 'PDF library not loaded. Please try again.');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Add title
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text('FIRE EXTINGUISHER AUDIT REPORT', 105, 20, { align: 'center' });
        
        // Add company info
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        
        const firstExt = extinguishers[0];
        
        doc.text(`Company: ${firstExt.accountName || 'Not specified'}`, 20, 35);
        doc.text(`Address: ${firstExt.address || 'Not specified'}`, 20, 42);
        doc.text(`Audit Date: ${formatDate(firstExt.auditDate) || 'Not specified'}`, 20, 49);
        doc.text(`Audited By: ${firstExt.contactPerson || 'Not specified'}`, 20, 56);
        
        // Add summary
        doc.setFontSize(14);
        doc.setTextColor(255, 76, 76);
        doc.text('Summary', 20, 70);
        
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        const total = extinguishers.reduce((sum, ext) => sum + ext.quantity, 0);
        const good = extinguishers.filter(ext => ext.status === 'Good').reduce((sum, ext) => sum + ext.quantity, 0);
        const attention = extinguishers.filter(ext => ext.status !== 'Good').reduce((sum, ext) => sum + ext.quantity, 0);
        const replacements = extinguishers.filter(ext => ext.recommendReplacement).length;
        
        doc.text(`Total Extinguishers: ${total}`, 20, 80);
        doc.text(`In Good Condition: ${good}`, 20, 87);
        doc.text(`Need Attention: ${attention}`, 20, 94);
        doc.text(`Recommended Replacements: ${replacements}`, 20, 101);
        
        // Add table
        const tableData = extinguishers.map(ext => [
            ext.sno,
            ext.location.substring(0, 20),
            ext.extinguisherName.substring(0, 25),
            ext.capacity,
            ext.quantity,
            ext.status,
            formatDate(ext.expiryDate),
            ext.recommendReplacement ? 'Yes' : 'No'
        ]);
        
        if (typeof doc.autoTable !== 'undefined') {
            doc.autoTable({
                startY: 110,
                head: [['S.No', 'Location', 'Extinguisher', 'Capacity', 'Qty', 'Status', 'Expiry', 'Replace']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [0, 0, 0] },
                margin: { top: 110 }
            });
        } else {
            // Fallback if autoTable is not available
            let yPos = 110;
            tableData.forEach(row => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(row.join(', '), 20, yPos);
                yPos += 10;
            });
        }
        
        // Save the PDF
        doc.save(`fire_extinguisher_audit_${new Date().toISOString().split('T')[0]}.pdf`);
        
        showSuccessModal('PDF Exported', 'Your fire extinguisher audit report has been exported as PDF.');
    } catch (error) {
        console.error('PDF export error:', error);
        showSuccessModal('Export Error', 'There was an error generating the PDF. Please try again.');
    }
}

function saveAsPDF() {
    if (extinguishers.length === 0) {
        showSuccessModal('No Data', 'There is no data to save. Please add extinguishers first.');
        return;
    }
    
    // Update report preview first
    updateReportPreview();
    
    // Create a more detailed PDF with better formatting
    exportToPDF();
}

function printReport() {
    if (extinguishers.length === 0) {
        showSuccessModal('No Data', 'There is no data to print. Please add extinguishers first.');
        return;
    }
    
    // Update report preview before printing
    updateReportPreview();
    
    // Create print window content
    const printContent = document.getElementById('reportPreview').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Fire Extinguisher Audit Report</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 40px; 
                    color: #333;
                    line-height: 1.6;
                }
                h1, h2, h3, h4 { 
                    color: #000; 
                    margin-bottom: 1rem;
                }
                .report-header { 
                    text-align: center; 
                    margin-bottom: 30px; 
                    border-bottom: 3px solid #ff4c4c; 
                    padding-bottom: 20px; 
                }
                .report-header h3 { 
                    font-size: 24px; 
                    margin-bottom: 20px; 
                    color: #000;
                }
                .report-meta { 
                    text-align: left; 
                    margin-top: 20px; 
                }
                .report-meta p { 
                    margin: 5px 0; 
                }
                .summary-grid { 
                    display: grid; 
                    grid-template-columns: repeat(4, 1fr); 
                    gap: 15px; 
                    margin: 20px 0; 
                }
                .summary-box { 
                    background: #f8f9fa; 
                    padding: 15px; 
                    border-radius: 8px; 
                    text-align: center; 
                    border: 1px solid #dee2e6; 
                }
                .summary-title { 
                    display: block; 
                    font-size: 12px; 
                    color: #6c757d; 
                    margin-bottom: 5px; 
                }
                .summary-number { 
                    display: block; 
                    font-size: 24px; 
                    font-weight: bold; 
                    color: #ff4c4c; 
                }
                .report-table-container { 
                    overflow-x: auto; 
                    margin: 30px 0; 
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 20px 0;
                }
                th, td { 
                    border: 1px solid #dee2e6; 
                    padding: 8px; 
                    text-align: left; 
                }
                th { 
                    background-color: #000; 
                    color: white; 
                    font-weight: 600;
                }
                .status-badge, .risk-badge { 
                    padding: 4px 8px; 
                    border-radius: 12px; 
                    font-size: 12px; 
                    display: inline-block; 
                }
                .status-good { 
                    background-color: #d4edda; 
                    color: #155724; 
                }
                .status-warning { 
                    background-color: #fff3cd; 
                    color: #856404; 
                }
                .risk-low { 
                    background-color: #d4edda; 
                    color: #155724; 
                }
                .risk-medium { 
                    background-color: #fff3cd; 
                    color: #856404; 
                }
                .risk-high { 
                    background-color: #f8d7da; 
                    color: #721c24; 
                }
                .findings { 
                    margin: 30px 0; 
                }
                .findings-list { 
                    margin-left: 20px; 
                }
                .signature-section { 
                    display: flex; 
                    justify-content: space-between; 
                    margin-top: 50px; 
                }
                .signature-box { 
                    width: 45%; 
                }
                .signature-line { 
                    border-bottom: 1px solid #333; 
                    margin-top: 20px; 
                    padding-bottom: 5px; 
                    min-height: 30px;
                }
                .report-notes { 
                    margin-top: 30px; 
                    padding-top: 20px; 
                    border-top: 1px solid #dee2e6; 
                    font-size: 12px; 
                    color: #6c757d; 
                }
                @media print {
                    body { 
                        margin: 0; 
                        padding: 20px;
                    }
                    .no-print { 
                        display: none !important; 
                    }
                    @page {
                        margin: 2cm;
                    }
                }
            </style>
        </head>
        <body>
            ${printContent}
            <div class="report-notes">
                <p><strong>Note:</strong> This report is generated automatically by Fire Extinguisher Audit Tool. Regular fire extinguisher inspections are required by NFPA 10 standards.</p>
                <p><strong>Website:</strong> https://safetyguide360-fire-extinguisher-au.vercel.app/</p>
                <p><strong>Contact:</strong> contact@amjathkhan.com | +91-9750816163</p>
                <p>Printed: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
            </div>
        </body>
        </html>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    updateExtinguisherTable(); // Restore table functionality
}

// Modal Functions
function showSuccessModal(title, message) {
    console.log(`Showing success modal: ${title} - ${message}`);
    const successMessage = document.getElementById('successMessage');
    const modalTitle = document.querySelector('#successModal h3');
    const modal = document.getElementById('successModal');
    
    if (successMessage) successMessage.textContent = message;
    if (modalTitle) modalTitle.textContent = title;
    if (modal) modal.style.display = 'flex';
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.style.display = 'none';
}

let confirmedAction = null;

function showConfirmModal(title, message, action) {
    confirmedAction = action;
    const confirmMessage = document.getElementById('confirmMessage');
    const modalTitle = document.querySelector('#confirmModal h3');
    const modal = document.getElementById('confirmModal');
    
    if (confirmMessage) confirmMessage.textContent = message;
    if (modalTitle) modalTitle.textContent = title;
    if (modal) modal.style.display = 'flex';
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.style.display = 'none';
    confirmedAction = null;
}

function executeConfirmedAction() {
    if (confirmedAction) {
        confirmedAction();
    }
    closeConfirmModal();
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString || dateString === 'Not specified' || dateString === '-') return '-';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// LocalStorage Functions
function saveToLocalStorage() {
    const data = {
        extinguishers,
        currentSno,
        basicInfo: {
            accountName: document.getElementById('accountName')?.value || '',
            address: document.getElementById('address')?.value || '',
            auditDate: document.getElementById('auditDate')?.value || '',
            contactPerson: document.getElementById('contactPerson')?.value || '',
            contactPhone: document.getElementById('contactPhone')?.value || '',
            contactEmail: document.getElementById('contactEmail')?.value || ''
        }
    };
    
    localStorage.setItem('fireExtinguisherAudit', JSON.stringify(data));
}

function loadSavedData() {
    const saved = localStorage.getItem('fireExtinguisherAudit');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            extinguishers = data.extinguishers || [];
            currentSno = data.currentSno || 1;
            
            if (data.basicInfo) {
                const accountName = document.getElementById('accountName');
                const address = document.getElementById('address');
                const auditDate = document.getElementById('auditDate');
                const contactPerson = document.getElementById('contactPerson');
                const contactPhone = document.getElementById('contactPhone');
                const contactEmail = document.getElementById('contactEmail');
                
                if (accountName) accountName.value = data.basicInfo.accountName || '';
                if (address) address.value = data.basicInfo.address || '';
                if (auditDate) auditDate.value = data.basicInfo.auditDate || '';
                if (contactPerson) contactPerson.value = data.basicInfo.contactPerson || '';
                if (contactPhone) contactPhone.value = data.basicInfo.contactPhone || '';
                if (contactEmail) contactEmail.value = data.basicInfo.contactEmail || '';
            }
            
            updateExtinguisherTable();
            updateCounters();
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
}

function setupAutoSave() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', saveToLocalStorage);
    });
}

// Add report preview styles
const style = document.createElement('style');
style.textContent = `
    .report-executive { margin: 1.5rem 0; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 1rem 0; }
    .summary-box { background: #f8f9fa; padding: 1rem; border-radius: var(--border-radius); text-align: center; border: 1px solid #dee2e6; }
    .summary-title { display: block; font-size: 0.85rem; color: var(--gray-medium); margin-bottom: 0.5rem; }
    .summary-number { display: block; font-size: 1.25rem; font-weight: 700; color: var(--primary-color); }
    .report-table-container { overflow-x: auto; margin: 1rem 0; }
    .report-table { width: 100%; border-collapse: collapse; }
    .report-table th { background: var(--dark-color); color: white; padding: 0.75rem; font-size: 0.85rem; }
    .report-table td { padding: 0.75rem; border-bottom: 1px solid var(--gray-light); font-size: 0.85rem; }
    .report-table tr:nth-child(even) { background: var(--light-color); }
    .findings { background: var(--light-color); padding: 1.5rem; border-radius: var(--border-radius); margin: 1rem 0; }
    .findings-list { margin-left: 1.5rem; }
    .findings-list li { margin-bottom: 0.5rem; }
    .signature-section { display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid var(--gray-light); }
    .signature-box { width: 45%; }
    .signature-line { border-bottom: 1px solid var(--gray-dark); margin-top: 1.5rem; padding-bottom: 0.5rem; min-height: 1.5rem; }
    .report-notes { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--gray-light); font-size: 0.85rem; color: var(--gray-medium); line-height: 1.5; }
`;
document.head.appendChild(style);

// Add event listeners for modal close buttons
document.addEventListener('DOMContentLoaded', function() {
    // Close modals on X click
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // OK button for success modal
    const modalOkBtn = document.getElementById('modalOkBtn');
    if (modalOkBtn) {
        modalOkBtn.addEventListener('click', closeSuccessModal);
    }
    
    // Cancel button for confirm modal
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', closeConfirmModal);
    }
    
    // Confirm button for confirm modal
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', executeConfirmedAction);
    }
});
