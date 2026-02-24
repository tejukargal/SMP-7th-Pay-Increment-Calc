const masterPayScale = [
    27000, 27650, 28300, 28950, 29600, 30325, 31050, 31775, 32500,
    33300, 34100, 34900, 35700, 36600, 37500, 38400, 39300, 40300,
    41300, 42300, 43300, 44425, 45550, 46675, 47800, 49050, 50300,
    51550, 52800, 54175, 55550, 56925, 58300, 59800, 61300, 62800,
    64300, 65950, 67600, 69250, 70900, 72550, 74200, 76100, 78000,
    79900, 81800, 83700, 85600, 87900, 90200, 92500, 94800, 97100,
    99400, 102100, 104800, 107500, 110200, 112900, 115600, 118700,
    121800, 124900, 128000, 131000, 134200, 137700, 141200, 144700,
    148200, 151700, 155200, 159200, 163200, 167200, 171200, 175200,
    179200, 183700, 188200, 192700, 197200, 201700, 206200, 211200,
    216200, 221200, 226200, 231200, 236200, 241200
];

function calculateIncrements() {
    const currentBasic = parseFloat(document.getElementById('currentBasic').value);
    const incrementMonth = document.getElementById('incrementMonth').value;
    const currentYear = parseInt(document.getElementById('currentYear').value);

    if (isNaN(currentBasic) || currentBasic <= 0) {
        alert('Please enter a valid current basic salary.');
        return;
    }

    if (isNaN(currentYear) || currentYear < 2020 || currentYear > 2030) {
        alert('Please enter a valid year between 2020 and 2030.');
        return;
    }

    const results = calculateNextIncrements(currentBasic, incrementMonth, currentYear);
    displayResults(results);
}

function calculateNextIncrements(currentBasic, incrementMonth, startYear) {
    let basicSalary = currentBasic;
    const results = [];
    const yearsToCalculate = 10;
    let previousIncrement = null;
    
    for (let i = 0; i < yearsToCalculate; i++) {
        const year = startYear + i;
        let incrementDate;
        
        if (incrementMonth === 'january') {
            incrementDate = `January ${year + 1}`;
        } else {
            incrementDate = `July ${year + 1}`;
        }
        
        const currentBasicForYear = basicSalary;
        const nextIncrement = getNextIncrement(basicSalary);
        const incrementAmount = nextIncrement - basicSalary;
        
        // Check if increment rate has changed
        const incrementRateChanged = previousIncrement !== null && previousIncrement !== incrementAmount;
        
        results.push({
            year: year + 1,
            month: incrementMonth === 'january' ? 'January' : 'July',
            currentBasic: currentBasicForYear,
            newBasic: nextIncrement,
            increment: incrementAmount,
            isCurrentSalary: i === 0,
            incrementRateChanged: incrementRateChanged
        });
        
        previousIncrement = incrementAmount;
        basicSalary = nextIncrement;
    }
    
    return results;
}

function getNextIncrement(currentBasic) {
    for (let i = 0; i < masterPayScale.length; i++) {
        if (currentBasic < masterPayScale[i]) {
            return masterPayScale[i];
        }
    }
    return currentBasic;
}

function generatePayScales() {
    const payScales = [];
    
    // Define 25 pay scale ranges
    const scaleRanges = [
        [27000, 46675], [29600, 52800], [31775, 52800], [34100, 67600], [37500, 76100],
        [41300, 81800], [44425, 83700], [49050, 92500], [54175, 99400], [58300, 107500],
        [61300, 112900], [65950, 124900], [69250, 134200], [72550, 141200], [78000, 148200],
        [83700, 155200], [90200, 159200], [97100, 163200], [107500, 167200], [112900, 171200],
        [118700, 175200], [131000, 188200], [144700, 197200], [155200, 226200], [167200, 241200]
    ];
    
    scaleRanges.forEach((range, index) => {
        const startSalary = range[0];
        const endSalary = range[1];
        const scaleSteps = [];
        
        let currentSalary = startSalary;
        let currentIncrement = null;
        scaleSteps.push(currentSalary);
        
        while (currentSalary < endSalary) {
            const nextIndex = masterPayScale.indexOf(currentSalary);
            if (nextIndex !== -1 && nextIndex < masterPayScale.length - 1) {
                const nextSalary = masterPayScale[nextIndex + 1];
                if (nextSalary <= endSalary) {
                    const increment = nextSalary - currentSalary;
                    
                    // Only add increment if it's different from the previous one
                    if (currentIncrement !== increment) {
                        scaleSteps.push(increment);
                        currentIncrement = increment;
                    }
                    
                    // Find the next salary where increment changes or reaches end
                    let tempSalary = currentSalary;
                    let lastValidSalary = currentSalary;
                    
                    while (tempSalary < endSalary) {
                        const tempIndex = masterPayScale.indexOf(tempSalary);
                        if (tempIndex !== -1 && tempIndex < masterPayScale.length - 1) {
                            const tempNextSalary = masterPayScale[tempIndex + 1];
                            if (tempNextSalary <= endSalary) {
                                const tempIncrement = tempNextSalary - tempSalary;
                                if (tempIncrement === increment) {
                                    lastValidSalary = tempNextSalary;
                                    tempSalary = tempNextSalary;
                                } else {
                                    break;
                                }
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    
                    scaleSteps.push(lastValidSalary);
                    currentSalary = lastValidSalary;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        
        payScales.push({
            range: `${startSalary}-${endSalary}`,
            scale: scaleSteps.join('-')
        });
    });
    
    return payScales;
}

function generateMasterScale() {
    const masterScaleText = [];
    let currentIncrement = null;
    
    masterScaleText.push(masterPayScale[0]); // Start with first salary
    
    for (let i = 0; i < masterPayScale.length - 1; i++) {
        const current = masterPayScale[i];
        const next = masterPayScale[i + 1];
        const increment = next - current;
        
        // Only add increment if it's different from the previous one
        if (currentIncrement !== increment) {
            masterScaleText.push(increment);
            currentIncrement = increment;
            
            // Find the last salary with this same increment
            let j = i;
            while (j < masterPayScale.length - 1) {
                const tempCurrent = masterPayScale[j];
                const tempNext = masterPayScale[j + 1];
                const tempIncrement = tempNext - tempCurrent;
                
                if (tempIncrement === increment) {
                    j++;
                } else {
                    break;
                }
            }
            
            // Add the last salary with this increment
            masterScaleText.push(masterPayScale[j]);
            i = j - 1; // Adjust loop counter
        }
    }
    
    // Split the master scale into two balanced lines
    const fullScale = masterScaleText.join('-');
    
    // Find a better split point closer to 60% to create more balanced lines
    const splitPoint = Math.floor(fullScale.length * 0.6);
    const breakPoint = fullScale.indexOf('-', splitPoint);
    
    // If no good break point found, use the midpoint
    const finalBreakPoint = breakPoint !== -1 ? breakPoint : Math.floor(fullScale.length / 2);
    
    const line1 = fullScale.substring(0, finalBreakPoint);
    const line2 = fullScale.substring(finalBreakPoint + 1);
    
    return line1 + '\n' + line2;
}

function displayResults(results) {
    const tableBody = document.getElementById('incrementTableBody');
    const resultsContainer = document.getElementById('resultsContainer');
    
    tableBody.innerHTML = '';
    
    // Display increment table
    results.forEach((result, index) => {
        const row = tableBody.insertRow();
        const yearCell = row.insertCell(0);
        const monthCell = row.insertCell(1);
        const currentBasicCell = row.insertCell(2);
        const incrementCell = row.insertCell(3);
        const newBasicCell = row.insertCell(4);
        
        yearCell.textContent = result.year;
        monthCell.textContent = result.month;
        currentBasicCell.textContent = `₹${result.currentBasic.toLocaleString('en-IN')}`;
        newBasicCell.textContent = `₹${result.newBasic.toLocaleString('en-IN')}`;
        
        if (result.increment > 0) {
            incrementCell.textContent = `+₹${result.increment.toLocaleString('en-IN')}`;
            incrementCell.className = 'increment-positive';
            
            // Change increment cell color when rate changes
            if (result.incrementRateChanged) {
                incrementCell.style.color = '#dc2626';
                incrementCell.style.fontWeight = '700';
            }
        } else {
            incrementCell.textContent = 'No increment';
            incrementCell.className = 'increment-zero';
        }
        
        // Apply styling based on row type
        if (index === 0) {
            // Highlight the first row (next increment) for user attention
            row.style.backgroundColor = '#f0f9ff';
            row.style.border = '2px solid #3b82f6';
            row.style.fontWeight = '600';
        }
    });
    
    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('currentBasic').value = '';
    document.getElementById('incrementMonth').value = 'january';
    document.getElementById('currentYear').value = new Date().getFullYear();
    
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.style.display = 'none';
    
    document.getElementById('currentBasic').focus();
}

document.getElementById('currentBasic').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        calculateIncrements();
    }
});

document.getElementById('currentYear').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        calculateIncrements();
    }
});

// Navigation functionality
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected page
    document.getElementById(pageId + 'Page').classList.add('active');
    
    // Add active class to selected tab
    event.target.classList.add('active');
    
    // Load pay scales data for pay scales page
    if (pageId === 'payscales') {
        loadPayScalesPage();
    }
}

function loadPayScalesPage() {
    const masterScaleTextPage2 = document.getElementById('masterScaleTextPage2');
    const payScalesGridPage2 = document.getElementById('payScalesGridPage2');

    // Clear existing content
    masterScaleTextPage2.innerHTML = '';
    payScalesGridPage2.innerHTML = '';

    // Load master scale
    const masterScale = generateMasterScale();
    masterScaleTextPage2.textContent = masterScale;

    // Load pay scales
    const payScales = generatePayScales();
    payScales.forEach((payScale, index) => {
        const scaleItem = document.createElement('div');
        scaleItem.className = 'pay-scale-item';
        scaleItem.innerHTML = `<strong>Scale ${index + 1}:</strong><br>${payScale.scale}`;
        payScalesGridPage2.appendChild(scaleItem);
    });
}

function loadStatePayMatrixPage1() {
    const masterScaleEl = document.getElementById('masterScaleTextPage1');
    const payScalesGridEl = document.getElementById('payScalesGridPage1');
    if (!masterScaleEl || !payScalesGridEl) return;

    masterScaleEl.textContent = generateMasterScale();

    const payScales = generatePayScales();
    payScales.forEach((payScale, index) => {
        const scaleItem = document.createElement('div');
        scaleItem.className = 'pay-scale-item';
        scaleItem.innerHTML = `<strong>Scale ${index + 1}:</strong><br>${payScale.scale}`;
        payScalesGridEl.appendChild(scaleItem);
    });
}

// DA Rates Data
const daRatesData = [
    { date: '01-01-2003', prevPercentage: '-', percentage: '55%', increase: 'NA', order: 'FD 8 SRP 2003 Dt.7-6-2003' },
    { date: '01-07-2003', prevPercentage: '55%', percentage: '59%', increase: '4%', order: 'FD 24 SRP 2003 Dt.29-1-2004' },
    { date: '01-01-2004', prevPercentage: '59%', percentage: '61%', increase: '2%', order: 'FD 5 SRP 2004 Dt.5-7-2004' },
    { date: '01-07-2004', prevPercentage: '61%', percentage: '64%', increase: '3%', order: 'FD 17 SRP 2004 Dt.3-11-2004' },
    { date: '01-01-2005', prevPercentage: '64%', percentage: '67%', increase: '3%', order: 'NA' },
    { date: '01-07-2005', prevPercentage: '67%', percentage: '71%', increase: '4%', order: 'NA' },
    { date: '01-01-2006', prevPercentage: '71%', percentage: '74%', increase: '3%', order: 'FD 15 SRP 2006 Dt.27-4-2006' },
    { date: '01-04-2006', prevPercentage: '74%', percentage: '2.625%', increase: '-71.375%', order: 'FD 19 SRP 2007 Dt.16-5-2007' },
    { date: '01-07-2006', prevPercentage: '2.625%', percentage: '7%', increase: '4.375%', order: 'FD 19 SRP 2007 Dt.16-5-2007' },
    { date: '01-01-2007', prevPercentage: '7%', percentage: '12.25%', increase: '5.25%', order: 'FD 21 SRP 2007 Dt.28-5-2007' },
    { date: '01-07-2007', prevPercentage: '12.25%', percentage: '17.50%', increase: '5.25%', order: 'NA' },
    { date: '01-01-2008', prevPercentage: '17.50%', percentage: '22.75%', increase: '5.25%', order: 'FD 3 SRP 2008 Dt.2-4-2008' },
    { date: '01-07-2008', prevPercentage: '22.75%', percentage: '26.75%', increase: '4%', order: 'FD 12 SRP 2008 Dt.12-11-2008' },
    { date: '01-01-2009', prevPercentage: '26.75%', percentage: '32.75%', increase: '6%', order: 'FD 5 SRP 2009 Dt.19-5-2009' },
    { date: '01-07-2009', prevPercentage: '32.75%', percentage: '38%', increase: '5.25%', order: 'FD 14 SRP 2009 Dt.24-10-2009' },
    { date: '01-01-2010', prevPercentage: '38%', percentage: '46%', increase: '8%', order: 'FD 14 SRP 2010 Dt.12-4-2010' },
    { date: '01-07-2010', prevPercentage: '46%', percentage: '56.25%', increase: '10.25%', order: 'FD 26 SRP 2010 Dt.29-9-2010' },
    { date: '01-01-2011', prevPercentage: '56.25%', percentage: '62.50%', increase: '6.25%', order: 'FD 21SRP 2011 Dt.7-4-2011' },
    { date: '01-07-2011', prevPercentage: '62.50%', percentage: '69.50%', increase: '7%', order: 'FD 35 SRP 2011 Dt.15-10-2011' },
    { date: '01-01-2012', prevPercentage: '69.50%', percentage: '76.75%', increase: '7.25%', order: 'FD 17 SRP 2012 Dt.14-5-2012' },
    { date: '01-07-2012', prevPercentage: '76.75%', percentage: '4%', increase: '-72.75%', order: 'FD 25 SRP 2012 Dt.17-10-2012' },
    { date: '01-01-2013', prevPercentage: '4%', percentage: '9%', increase: '5%', order: 'FD 9 SRP 2013 Dt.8-5-2013' },
    { date: '01-07-2013', prevPercentage: '9%', percentage: '15%', increase: '6%', order: 'FD 21 SRP 2013 Dt.3-10-2013' },
    { date: '01-01-2014', prevPercentage: '15%', percentage: '21%', increase: '6%', order: 'FD 5 SRP 2014 Dt.8-4-2014' },
    { date: '01-07-2014', prevPercentage: '21%', percentage: '25.25%', increase: '4.25%', order: 'FD 17 SRP 2014 Dt.26-9-2014' },
    { date: '01-01-2015', prevPercentage: '25.25%', percentage: '28.75%', increase: '3.5%', order: 'FD 11 SRP 2015 Dt.24-4-2015' },
    { date: '01-07-2015', prevPercentage: '28.75%', percentage: '32.50%', increase: '3.75%', order: 'FD 18 SRP 2015 Dt.30-9-2015' },
    { date: '01-01-2016', prevPercentage: '32.50%', percentage: '36%', increase: '3.5%', order: 'FD 12 SRP 2016 Dt.13-4-2016' },
    { date: '01-07-2016', prevPercentage: '36%', percentage: '40.25%', increase: '4.25%', order: 'FD 33 SRP 2016 Dt.21-10-2016' },
    { date: '01-01-2017', prevPercentage: '40.25%', percentage: '43.25%', increase: '3%', order: 'FD 16 SRP 2017 Dt.30-4-2017' },
    { date: '01-07-2017', prevPercentage: '43.25%', percentage: '45.25%', increase: '2%', order: 'FD 39 SRP 2017 Dt.6-10-2017' },
    { date: '01-01-2018', prevPercentage: '45.25%', percentage: '1.75%', increase: '-43.5%', order: 'FD 12 SRP 2018 Dt.18-6-2018' },
    { date: '01-07-2018', prevPercentage: '1.75%', percentage: '3.75%', increase: '2%', order: 'FD 21 SRP 2018 Dt.12-10-2018' },
    { date: '01-01-2019', prevPercentage: '3.75%', percentage: '6.50%', increase: '2.75%', order: 'FD 1 SRP 2019 Dt.28-3-2019' },
    { date: '01-07-2019', prevPercentage: '6.50%', percentage: '11.25%', increase: '4.75%', order: 'FD 15 SRP 2003 Dt.19-10-2019' },
    { date: '01-01-2020', prevPercentage: '11.25%', percentage: 'NA', increase: 'NA', order: 'NO DA revised (Covid reason)' },
    { date: '01-07-2020', prevPercentage: '11.25%', percentage: 'NA', increase: 'NA', order: 'NO DA revised (Covid reason)' },
    { date: '01-01-2021', prevPercentage: '11.25%', percentage: '21.50%', increase: '10.25%', order: 'FD 18 SRP 2021 Dt.26-7-2021' },
    { date: '01-07-2021', prevPercentage: '21.50%', percentage: '24.50%', increase: '3%', order: 'FD 30 SRP 2021 Dt.27-10-2021' },
    { date: '01-01-2022', prevPercentage: '24.50%', percentage: '27.25%', increase: '2.75%', order: 'FD 22 SRP 2022 Dt.5-4-2022' },
    { date: '01-07-2022', prevPercentage: '27.25%', percentage: '31%', increase: '3.75%', order: 'FD 40 SRP 2022 Dt.7-10-2022' },
    { date: '01-01-2023', prevPercentage: '31%', percentage: '35%', increase: '4%', order: 'FD 9 SRP 2023 Dt.30-5-2023' },
    { date: '01-07-2023', prevPercentage: '35%', percentage: '38.75%', increase: '3.75%', order: 'FD 19 SRP 2023 Dt.21-10-2023' },
    { date: '01-01-2024', prevPercentage: '38.75%', percentage: '42.5%', increase: '3.75%', order: 'FD 18 SRP 2024 Dt.12-03-2024' },
    { date: '01-07-2024', prevPercentage: '42.5', percentage: '45.25%', increase: '2.75% (Limited to Jul-24 only)', order: 'FD 43 SRP(I) 2024 Dt.28-11-2024' },
    { date: '01-08-2024', prevPercentage: '42.5% (Merged for 7th Pay)', percentage: '8.5%', increase: '8.5%', order: 'New DA as Per 7th Pay' },
    { date: '01-08-2024', prevPercentage: '8.5%', percentage: '10.75% (Effect from 01.07.2024)', increase: '2.25%', order: 'FD 43 SRP 2024 Dt.27-11-2024' },
    { date: '01-01-2025', prevPercentage: '10.75%', percentage: '12.25% (Effect from 01.01.2025)', increase: '1.5%', order: 'FD 8 SRP 2025 Dt.07-05-2025' },
    { date: '01-07-2025', prevPercentage: '12.25%', percentage: '14.25%', increase: '2%', order: 'FD 18 SRP 2025 Dt.15-10-2025' }
];

function loadDAHistory() {
    const tableBody = document.getElementById('daHistoryTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Reverse the array to show most recent first
    const reversedData = [...daRatesData].reverse();
    
    reversedData.forEach(rate => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = rate.date;
        row.insertCell(1).textContent = rate.prevPercentage;
        row.insertCell(2).textContent = rate.percentage;
        row.insertCell(3).textContent = rate.increase;
        row.insertCell(4).textContent = rate.order;
        
        // Highlight recent entries (2024-2025)
        if (rate.date.includes('2024') || rate.date.includes('2025')) {
            row.style.backgroundColor = '#f0f9ff';
            row.style.fontWeight = '600';
        }
    });
}

window.addEventListener('load', function() {
    document.getElementById('currentYear').value = new Date().getFullYear();
    document.getElementById('currentBasic').focus();

    // Load pay scales for Page 1 (below calculator) and Page 2
    loadStatePayMatrixPage1();
    loadPayScalesPage();

    // Load DA history when page loads
    loadDAHistory();

    // Load AICTE pay matrix on initial load
    loadAICTEPayMatrix();
    document.getElementById('aicteCurrentYear').value = new Date().getFullYear();
});

// ─────────────────────────────────────────────────────────────────────────────
// AICTE Pay Scale Data – 7th CPC (Govt / Aided Polytechnics)
// Source: Annexure-I, 7th Pay Commission – AICTE Scales
// ─────────────────────────────────────────────────────────────────────────────

const aictePayScales = {
    // Level 9A  – Lecturer (AGP 5400) | Entry Pay: ₹21,000
    '9A': [
        56100, 57700, 59500, 61300, 63100, 65000, 67000, 69000,
        71100, 73200, 75400, 77700, 80000, 82400, 84900, 87400,
        90000, 92700, 95500, 101100, 104100, 107200, 110400, 113700,
        117100, 120600, 124200, 127900, 131700, 135700, 139800, 144000,
        148300, 152700, 157300, 162000, 166900, 171900, 177100, 182400
    ],
    // Level 13A.1 – HOD / Principal (AGP 9000) | Entry Pay: ₹49,200
    '13A1': [
        131400, 135300, 139400, 143600, 147900, 152300,
        156900, 161600, 166400, 171400, 176500, 181800,
        187300, 192900, 198700, 204700
    ]
};

const aicteLevelInfo = {
    '9A':   { label: 'Level 9A',   designation: 'Lecturer',        agp: 'AGP 5400', range: '₹56,100 – ₹1,82,400',   cells: 40 },
    '13A1': { label: 'Level 13A.1', designation: 'HOD / Principal', agp: 'AGP 9000', range: '₹1,31,400 – ₹2,04,700', cells: 16 }
};

// ─── Core lookup ──────────────────────────────────────────────────────────────

function getNextAICTEIncrement(currentBasic, level) {
    const scale = aictePayScales[level];
    for (let i = 0; i < scale.length; i++) {
        if (currentBasic < scale[i]) {
            return scale[i];
        }
    }
    return currentBasic; // already at maximum cell
}

// ─── Projection engine ────────────────────────────────────────────────────────

function calculateAICTENextIncrements(currentBasic, level, incrementMonth, startYear) {
    let basicSalary = currentBasic;
    const results = [];
    const yearsToCalculate = 10;
    let previousIncrement = null;

    for (let i = 0; i < yearsToCalculate; i++) {
        const year = startYear + i;
        const currentBasicForYear = basicSalary;
        const nextBasic = getNextAICTEIncrement(basicSalary, level);
        const incrementAmount = nextBasic - basicSalary;
        const incrementRateChanged = previousIncrement !== null && previousIncrement !== incrementAmount;

        results.push({
            year: year + 1,
            month: incrementMonth === 'january' ? 'January' : 'July',
            currentBasic: currentBasicForYear,
            newBasic: nextBasic,
            increment: incrementAmount,
            isCurrentSalary: i === 0,
            incrementRateChanged: incrementRateChanged
        });

        previousIncrement = incrementAmount;
        basicSalary = nextBasic;
    }

    return results;
}

// ─── Entry point (called by button) ──────────────────────────────────────────

function calculateAICTEIncrements() {
    const level = document.getElementById('aicteLevel').value;
    const currentBasic = parseFloat(document.getElementById('aicteCurrentBasic').value);
    const incrementMonth = document.getElementById('aicteIncrementMonth').value;
    const currentYear = parseInt(document.getElementById('aicteCurrentYear').value);

    if (isNaN(currentBasic) || currentBasic <= 0) {
        alert('Please enter a valid current basic salary.');
        return;
    }

    if (isNaN(currentYear) || currentYear < 2020 || currentYear > 2030) {
        alert('Please enter a valid year between 2020 and 2030.');
        return;
    }

    const scale = aictePayScales[level];
    const minPay = scale[0];
    const maxPay = scale[scale.length - 1];
    if (currentBasic < minPay || currentBasic > maxPay) {
        const info = aicteLevelInfo[level];
        alert(`For ${info.label} (${info.designation}), the basic salary must be within ${info.range}.`);
        return;
    }

    const results = calculateAICTENextIncrements(currentBasic, level, incrementMonth, currentYear);
    displayAICTEResults(results, level);
}

// ─── Display ──────────────────────────────────────────────────────────────────

function displayAICTEResults(results, level) {
    const tableBody = document.getElementById('aicteIncrementTableBody');
    const resultsContainer = document.getElementById('aicteResultsContainer');
    const levelBadge = document.getElementById('aicteLevelBadge');

    const info = aicteLevelInfo[level];
    levelBadge.textContent = `${info.label} – ${info.designation} (${info.agp}) | ${info.range}`;

    tableBody.innerHTML = '';

    results.forEach((result, index) => {
        const row = tableBody.insertRow();
        const yearCell         = row.insertCell(0);
        const monthCell        = row.insertCell(1);
        const currentBasicCell = row.insertCell(2);
        const incrementCell    = row.insertCell(3);
        const newBasicCell     = row.insertCell(4);

        yearCell.textContent         = result.year;
        monthCell.textContent        = result.month;
        currentBasicCell.textContent = `₹${result.currentBasic.toLocaleString('en-IN')}`;
        newBasicCell.textContent     = `₹${result.newBasic.toLocaleString('en-IN')}`;

        if (result.increment > 0) {
            incrementCell.textContent = `+₹${result.increment.toLocaleString('en-IN')}`;
            incrementCell.className   = 'increment-positive';
            if (result.incrementRateChanged) {
                incrementCell.style.color      = '#dc2626';
                incrementCell.style.fontWeight = '700';
            }
        } else {
            incrementCell.textContent = 'No increment';
            incrementCell.className   = 'increment-zero';
        }

        if (index === 0) {
            row.style.backgroundColor = '#f0f9ff';
            row.style.border          = '2px solid #3b82f6';
            row.style.fontWeight      = '600';
        }
    });

    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// ─── Pay Matrix text generator ────────────────────────────────────────────────

function generateAICTEScaleText(level) {
    const scale = aictePayScales[level];
    const lines = [];
    // 8 cells per line for readability
    for (let i = 0; i < scale.length; i += 8) {
        const chunk = scale.slice(i, i + 8);
        lines.push(chunk.map(v => '₹' + v.toLocaleString('en-IN')).join('  →  '));
    }
    return lines.join('\n');
}

function loadAICTEPayMatrix() {
    document.getElementById('aicteScale9A').textContent    = generateAICTEScaleText('9A');
    document.getElementById('aicteScale13A1').textContent  = generateAICTEScaleText('13A1');
}

// ─── Reset ────────────────────────────────────────────────────────────────────

function resetAICTEForm() {
    document.getElementById('aicteLevel').value          = '9A';
    document.getElementById('aicteCurrentBasic').value   = '';
    document.getElementById('aicteIncrementMonth').value = 'january';
    document.getElementById('aicteCurrentYear').value    = new Date().getFullYear();
    resetAICTEResults();
    document.getElementById('aicteCurrentBasic').focus();
}

function resetAICTEResults() {
    document.getElementById('aicteResultsContainer').style.display = 'none';
}

// ─── Keyboard shortcut ───────────────────────────────────────────────────────

document.getElementById('aicteCurrentBasic').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') { calculateAICTEIncrements(); }
});

document.getElementById('aicteCurrentYear').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') { calculateAICTEIncrements(); }
});