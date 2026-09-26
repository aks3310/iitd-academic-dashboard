# RUNNER // IIT DELHI ACADEMIC TELEMETRY DASHBOARD
> Tactical First-Year Marks & Margin Tracker inspired by **Bungie's Marathon**

A high-octane academic performance tracking and error-margin HUD engineered specifically for IIT Delhi first-year engineering students.

---

## ⚡ Key Highlights & Features

- **Inspired by Marathon (2025/2026)**:
  - High-contrast obsidian void & acid volt (`#E5FE00`), cyber crimson (`#FF1E56`), and electric cyan palette.
  - Brutalist chamfered HUD geometry, coordinate readouts (`28.5450° N, 77.1926° E • Hauz Khas`), tech telemetry matrix, and subtle scanlines.
  - **Tactical Web Audio Synthesizer**: Zero external audio downloads. Generates instant futuristic micro-clicks, success chimes, and warning blips directly via Web Audio API oscillators (with a dedicated SFX MUTE toggle).

- **Objective & Margin Engine**:
  - Configurable target threshold (defaults to **> 85.0%**; customizable via slider or 80%, 85%, 90%, 95% quick buttons).
  - **Dynamic Error Margin Display**: Tells you in real-time exactly how many weighted percentage points you can still afford to lose before dropping below your target!
  - **Status Zones**:
    - `[ OPTIMAL CUSHION ]` (Margin > 7.0%) - Volt Green
    - `[ CAUTION ZONE ]` (Margin between 3.0% and 7.0%) - Amber Alert
    - `[ CRITICAL MARGIN ]` (Margin <= 3.0% or negative) - Crimson Alarm
  - **Real-Time Run-Rate**: Computes the exact percentage average you must score on all future unattempted papers to hit your target.
  - **Max Ceiling**: Computes the theoretical maximum grade achievable if you ace all remaining tests.

- **Pre-Configured Courses**:
  - **CML1001 (Molecular Science & Chemistry - 3 Credits)**:
    1. Common Quiz 1 (10% weightage)
    2. Mid Semester Exam (30% weightage)
    3. Common Quiz 2 (10% weightage)
    4. Major Exam (40% weightage)
    5. Tutorial Quiz (10% weightage, with Tut 2, 4, 8, 10, 12 breakdown)
  - **CMP1000 (Chemistry Laboratory - 2 Credits)**:
    1. Continuous Lab Performance (40% weightage)
    2. Pre-Lab Quizzes & Viva (20% weightage, with Pre-Lab 1 through 5 sub-quizzes)
    3. Lab Reports & Records (15% weightage)
    4. End-Sem Lab Practical & Viva Exam (25% weightage)

- **Total Syllabus Flexibility & Custom Weightages**:
  - **Inline Component Weight Setting**: Change the weightage of ANY component directly on its card (e.g. adjust a quiz from 10% to 15%); all margins and run-rates recalculate in real-time.
  - **Subsection Weights Configuration**:
    - Each sub-quiz / pre-lab experiment can have its own custom weight (e.g. 4.0% each).
    - Rename sub-items on click (e.g., "Pre-Lab 1", "Exp 2 Viva", "Lab Record").
    - `+ ADD SUBSECTION` to add extra labs or tests.
    - `✕` button to remove any subsection.
    - `⚖ BALANCE WEIGHTS EVENLY` to automatically split the parent weight equally across all sub-items.
  - **Add Custom Components**: Click `+ ADD ASSESSMENT COMPONENT / SUBSECTION` to add any custom element (e.g. Term Projects, Surprise Quizzes, Class Participation).
  - **Convert to Subsections**: Break down any single assessment into multi-part sub-quizzes with 1 click.
  - **Dynamic Course Weight Allocation Tracker**: Real-time status badge showing whether your course components total `100% [BALANCED]`, `UNASSIGNED`, or `OVERFLOW`.

- **Multi-Subject Extensibility**:
  - Includes a `+ ADD SUBJECT` interface with quick presets for IITD 1st-Year staples:
    - `MTL100` (Calculus & Linear Algebra - 4 Credits)
    - `COL100` (Intro to Computer Science - 4 Credits)
    - `ELL100` (Basic Electrical Engineering - 4 Credits)
    - `PYL100` (Physics - Electromagnetism & Quantum - 3 Credits)
    - `APL100` (Engineering Mechanics - 4 Credits)
    - Or any fully custom course!

- **"What-If" Performance Simulator**:
  - Interactive tactical sliders for pending exams so you can test scenarios (e.g., *"What if I get 34/40 on the Major and 8/10 on CQ2?"*) and view the immediate final grade projection.

- **Data Persistence & Portability**:
  - Automatically saves all entered marks, customized targets, and subjects to browser `localStorage`.
  - Export Telemetry JSON backup button for saving or transferring data.
  - Baseline Reset button to restore fresh state at any time.

---

## 🚀 How to Run Locally

### Option 1: Native Local Server (Active)
Run:
```bash
node server.js
```
Then open your browser at:
```
http://localhost:3000
```

### Option 2: Direct File Open
You can also open [index.html](file:///c:/Users/Akshit%20Kumar%20Singh/Desktop/dashboard/index.html) directly in any browser (Chrome, Edge, Firefox, Brave) — no build step or node installation required!

---

## 📐 The Margin Calculation Formula

For a target score $T$ (e.g., $85\%$):

1. **Max Permissible Loss Across Semester**:
   $$\text{Max Allowed Loss} = 100\% - T = 15.0\%$$

2. **For each assessment $i$** with weight $W_i$, marks scored $A_i$, and total marks $M_i$:
   $$\text{Weight Earned} = \left(\frac{A_i}{M_i}\right) \times W_i$$
   $$\text{Weight Lost} = W_i - \text{Weight Earned}$$

3. **Margin Remaining (Safety Cushion)**:
   $$\text{Margin Left} = \text{Max Allowed Loss} - \sum \text{Weight Lost}$$
   - When **Margin Left > 0**: You have positive room for error.
   - When **Margin Left = 0**: You must score 100% on every remaining mark.
   - When **Margin Left < 0**: The target is mathematically missed; the UI displays the deficit and your max possible ceiling.
