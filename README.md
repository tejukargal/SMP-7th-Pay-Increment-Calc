# SMP 7th Pay Increment Calculator

A simple, offline-ready web app for calculating annual salary increments under the **7th Pay Commission** — covering both **Karnataka State government employees** and **AICTE-scale staff in Govt/Aided Polytechnics**.

---

## Features

### State Pay Scale — Increment Calculator
- Enter your current basic, increment month (January / July), and year
- Projects the next **10 annual increments** step-by-step
- Highlights the first upcoming increment in blue
- Flags rows where the increment **amount changes** (in red)

### State Pay Scales
- Full **Master Pay Scale** (27,000 – 2,41,200 | 87 cells)
- All **25 individual pay scales** in compressed format

### DA & HRA Orders
- Current DA rate: **12.25%** (effective 1 Jan 2025)
- Complete DA history from **2003 – 2025** with GO numbers
- HRA rates by city classification (X / Y / Z)

### AICTE Pay Scale — Increment Calculator
Dedicated calculator for diploma institution staff under the **7th CPC AICTE scale**:

| Level | Designation | AGP | Pay Range |
|---|---|---|---|
| Level 9A | Lecturer (Entry) | 5400 | ₹56,100 – ₹1,82,400 |
| Level 13A.1 | HOD / Principal | 9000 | ₹1,31,400 – ₹2,04,700 |

- Full **pay matrix** (cell-by-cell progression) displayed for both levels
- Annual increment = one cell progression (~3% of basic)
- Pay fixation factor: **2.57**

---

## How to Use

No installation needed. Just open `index.html` in any modern browser.

```
index.html   ← open this
script.js    ← all calculator logic
styles.css   ← styling
```

---

## Pay Commission Basis

- **State scales** — Karnataka 7th Pay Commission (effective 1 Jan 2016, fitment factor 2.57)
- **AICTE scales** — 7th CPC pay matrix for Govt/Aided Polytechnics (Annexure-I)
- Increment date: 1 January or 1 July depending on date of joining / promotion
