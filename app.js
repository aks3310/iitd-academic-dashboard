// MARATHON // IITD ACADEMIC MARGIN TELEMETRY ENGINE
// Reactive State Management, Custom Weightages, Subsections & Simulator

const STORAGE_KEY = 'iitd_runner_courses_v1';
const ACTIVE_COURSE_KEY = 'iitd_runner_active_course_v1';
const INITIALIZED_KEY = 'iitd_runner_initialized';

// Baseline starts empty with zero subjects
const DEFAULT_COURSES = [];

// Presets for common IITD 1st-Year courses
const COURSE_PRESETS = {
  CML1001: {
    code: 'CML1001',
    title: 'Molecular Science & Chemistry',
    credits: 3,
    target: 85.0,
    assessments: [
      { id: 'cq1', name: 'Common Quiz 1', date: 'Tue, 1 Sep 2026', weight: 10, achieved: null, total: 10 },
      { id: 'midsem', name: 'Mid Semester Exam', date: 'Mid-Sem Week (Oct 2026)', weight: 30, achieved: null, total: 30 },
      { id: 'cq2', name: 'Common Quiz 2', date: '27 Oct 2026', weight: 10, achieved: null, total: 10 },
      { id: 'major', name: 'Major Exam', date: 'Major Week (Nov 2026)', weight: 40, achieved: null, total: 40 },
      {
        id: 'tut',
        name: 'Tutorial Quiz',
        date: 'Continuous (Tut 2, 4, 8, 10, 12)',
        weight: 10,
        achieved: null,
        total: 10,
        hasSubitems: true,
        subitems: [
          { id: 'tut2', name: 'Tut 2', weight: 2, achieved: null, total: 10 },
          { id: 'tut4', name: 'Tut 4', weight: 2, achieved: null, total: 10 },
          { id: 'tut8', name: 'Tut 8', weight: 2, achieved: null, total: 10 },
          { id: 'tut10', name: 'Tut 10', weight: 2, achieved: null, total: 10 },
          { id: 'tut12', name: 'Tut 12', weight: 2, achieved: null, total: 10 }
        ]
      }
    ]
  },
  CMP1000: {
    code: 'CMP1000',
    title: 'Chemistry Laboratory',
    credits: 2,
    target: 85.0,
    assessments: [
      { id: 'lab_perf', name: 'Continuous Lab Performance', date: 'Weekly Lab Sessions', weight: 40, achieved: null, total: 100 },
      {
        id: 'pre_lab',
        name: 'Pre-Lab Quizzes & Viva',
        date: 'Before Each Experiment',
        weight: 20,
        achieved: null,
        total: 20,
        hasSubitems: true,
        subitems: [
          { id: 'pl1', name: 'Pre-Lab 1', weight: 4, achieved: null, total: 10 },
          { id: 'pl2', name: 'Pre-Lab 2', weight: 4, achieved: null, total: 10 },
          { id: 'pl3', name: 'Pre-Lab 3', weight: 4, achieved: null, total: 10 },
          { id: 'pl4', name: 'Pre-Lab 4', weight: 4, achieved: null, total: 10 },
          { id: 'pl5', name: 'Pre-Lab 5', weight: 4, achieved: null, total: 10 }
        ]
      },
      { id: 'reports', name: 'Lab Reports & Records', date: 'Weekly Submissions', weight: 15, achieved: null, total: 50 },
      { id: 'major_lab', name: 'End-Sem Lab Practical & Viva', date: 'End of Semester', weight: 25, achieved: null, total: 50 }
    ]
  },
  MTL100: {
    code: 'MTL100',
    title: 'Calculus',
    credits: 4,
    target: 85.0,
    assessments: [
      { id: 'q1', name: 'Quiz 1', date: 'Sep 2026', weight: 10, achieved: null, total: 10 },
      { id: 'mid', name: 'Mid Semester', date: 'Oct 2026', weight: 30, achieved: null, total: 30 },
      { id: 'q2', name: 'Quiz 2', date: 'Oct 2026', weight: 10, achieved: null, total: 10 },
      { id: 'tut', name: 'Tutorial Tests', date: 'Throughout', weight: 10, achieved: null, total: 10 },
      { id: 'major', name: 'Major Exam', date: 'Nov 2026', weight: 40, achieved: null, total: 40 }
    ]
  },
  COL100: {
    code: 'COL100',
    title: 'Introduction to Computer Science',
    credits: 4,
    target: 85.0,
    assessments: [
      { id: 'lab', name: 'Weekly Lab Assignments', date: 'Continuous', weight: 20, achieved: null, total: 100 },
      { id: 'mid', name: 'Mid Semester Exam', date: 'Oct 2026', weight: 25, achieved: null, total: 50 },
      { id: 'pract', name: 'Lab Practical Exam', date: 'Nov 2026', weight: 15, achieved: null, total: 30 },
      { id: 'major', name: 'Major Exam', date: 'Nov 2026', weight: 40, achieved: null, total: 80 }
    ]
  },
  ELL100: {
    code: 'ELL100',
    title: 'Basic Electrical Engineering',
    credits: 4,
    target: 85.0,
    assessments: [
      { id: 'q1', name: 'Quiz 1', date: 'Sep 2026', weight: 10, achieved: null, total: 20 },
      { id: 'mid', name: 'Mid Semester', date: 'Oct 2026', weight: 30, achieved: null, total: 60 },
      { id: 'q2', name: 'Quiz 2', date: 'Oct 2026', weight: 10, achieved: null, total: 20 },
      { id: 'lab', name: 'Lab Experiments', date: 'Continuous', weight: 15, achieved: null, total: 50 },
      { id: 'major', name: 'Major Exam', date: 'Nov 2026', weight: 35, achieved: null, total: 70 }
    ]
  },
  PYL100: {
    code: 'PYL100',
    title: 'Electromagnetic Waves and Quantum Mechanics',
    credits: 3,
    target: 85.0,
    assessments: [
      { id: 'cq1', name: 'Common Quiz 1', date: 'Sep 2026', weight: 10, achieved: null, total: 15 },
      { id: 'mid', name: 'Mid Semester', date: 'Oct 2026', weight: 30, achieved: null, total: 40 },
      { id: 'cq2', name: 'Common Quiz 2', date: 'Oct 2026', weight: 10, achieved: null, total: 15 },
      { id: 'tut', name: 'Tutorial Quizzes', date: 'Continuous', weight: 10, achieved: null, total: 25 },
      { id: 'major', name: 'Major Exam', date: 'Nov 2026', weight: 40, achieved: null, total: 60 }
    ]
  },
  APL100: {
    code: 'APL100',
    title: 'Engineering Mechanics',
    credits: 4,
    target: 85.0,
    assessments: [
      { id: 'q1', name: 'Quiz 1', date: 'Sep 2026', weight: 10, achieved: null, total: 20 },
      { id: 'mid', name: 'Mid Semester', date: 'Oct 2026', weight: 30, achieved: null, total: 50 },
      { id: 'q2', name: 'Quiz 2', date: 'Oct 2026', weight: 10, achieved: null, total: 20 },
      { id: 'tut', name: 'Tutorial Submissions', date: 'Continuous', weight: 10, achieved: null, total: 50 },
      { id: 'major', name: 'Major Exam', date: 'Nov 2026', weight: 40, achieved: null, total: 70 }
    ]
  }
};

class AcademicRunnerApp {
  constructor() {
    // Check if the user has opened the app before
    const hasExistingData = localStorage.getItem('iitd_runner_courses_v1') || localStorage.getItem('iitd_runner_courses_v2');
    const hasInitialized = localStorage.getItem(INITIALIZED_KEY);
    
    // Only mark as first ever open if there is completely zero prior history
    this.isFirstEverOpen = !hasExistingData && !hasInitialized;
    if (this.isFirstEverOpen) {
      localStorage.setItem(INITIALIZED_KEY, 'true');
    }

    this.courses = this.loadCourses();
    this.activeCourseId = localStorage.getItem(ACTIVE_COURSE_KEY) || localStorage.getItem('iitd_runner_active_course_v2') || 'home';
    this.simulatedValues = {};
    
    // Ensure activeCourseId is valid ('home' or existing course id)
    if (this.courses.length === 0 || (this.activeCourseId !== 'home' && !this.courses.some(c => c.id === this.activeCourseId))) {
      this.activeCourseId = this.courses.length > 0 ? this.courses[0].id : 'home';
    }

    // Ensure all parent assessments with subitems have scores recalculated with full assumption
    this.courses.forEach(c => {
      if (c.assessments) {
        c.assessments.forEach(item => {
          if (item.hasSubitems) {
            this.recalculateParentScore(item);
          }
        });
      }
    });
  }

  loadCourses() {
    try {
      // Prioritize existing saved user data from v1, fallback to v2
      const stored = localStorage.getItem('iitd_runner_courses_v1') || localStorage.getItem('iitd_runner_courses_v2');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored courses:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_COURSES));
  }

  saveCourses() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.courses));
    localStorage.setItem(ACTIVE_COURSE_KEY, this.activeCourseId);
  }

  getActiveCourse() {
    if (this.courses.length === 0) {
      return null;
    }
    if (this.activeCourseId === 'home') {
      return this.courses[0];
    }
    return this.courses.find(c => c.id === this.activeCourseId) || this.courses[0];
  }

  setActiveCourse(courseId) {
    if (courseId === 'home' || this.courses.some(c => c.id === courseId)) {
      this.activeCourseId = courseId;
      this.simulatedValues = {};
      this.saveCourses();
      this.render();
      window.sfx.playClick();
    }
  }

  updateTargetScore(newTarget) {
    const course = this.getActiveCourse();
    course.target = Math.min(100, Math.max(0, parseFloat(newTarget) || 85));
    this.saveCourses();

    // Synchronize UI controls & numerical readout
    const targetSlider = document.getElementById('targetScoreSlider');
    const targetValEl = document.getElementById('targetDisplayValue');
    if (targetSlider) targetSlider.value = course.target;
    if (targetValEl) targetValEl.textContent = `${course.target.toFixed(1)}%`;

    // Highlight matching preset button if any
    document.querySelectorAll('.preset-target-btn').forEach(btn => {
      const btnTarget = parseFloat(btn.dataset.target);
      if (Math.abs(btnTarget - course.target) < 0.05) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.renderTelemetry();
    this.renderSimulator();
  }

  updateAssessmentScore(assessmentId, achieved, total) {
    const course = this.getActiveCourse();
    const item = course.assessments.find(a => a.id === assessmentId);
    if (!item) return;

    item.achieved = achieved !== '' && !isNaN(achieved) ? parseFloat(achieved) : null;
    item.total = total !== '' && !isNaN(total) && parseFloat(total) > 0 ? parseFloat(total) : null;

    this.saveCourses();
    this.renderTelemetry();
    this.renderCardDiagnostics(assessmentId);
    this.renderSimulator();
    window.sfx.playInputTick();
  }

  updateAssessmentWeight(assessmentId, newWeight) {
    const course = this.getActiveCourse();
    const item = course.assessments.find(a => a.id === assessmentId);
    if (!item) return;

    const parsedWeight = Math.max(0.1, parseFloat(newWeight) || 0);
    item.weight = parsedWeight;

    // If item has subitems, proportionately scale sub-items
    if (item.hasSubitems && item.subitems && item.subitems.length > 0) {
      const perSub = parseFloat((parsedWeight / item.subitems.length).toFixed(1));
      item.subitems.forEach(s => s.weight = perSub);
      this.recalculateParentScore(item);
    }

    this.saveCourses();
    this.renderTelemetry();
    this.renderCardDiagnostics(assessmentId);
    this.renderSimulator();
    window.sfx.playInputTick();
  }

  updateSubitem(assessmentId, subitemId, field, val) {
    const course = this.getActiveCourse();
    const item = course.assessments.find(a => a.id === assessmentId);
    if (!item || !item.subitems) return;

    const sub = item.subitems.find(s => s.id === subitemId);
    if (!sub) return;

    if (field === 'name') {
      sub.name = val.trim() || 'Sub-part';
    } else if (field === 'weight') {
      sub.weight = val !== '' && !isNaN(val) ? Math.max(0, parseFloat(val)) : 0;
      // Recompute parent weight as sum of subitems
      const sumWeight = item.subitems.reduce((acc, s) => acc + (parseFloat(s.weight) || 0), 0);
      if (sumWeight > 0) {
        item.weight = parseFloat(sumWeight.toFixed(1));
      }
    } else if (field === 'achieved') {
      sub.achieved = val !== '' && !isNaN(val) ? parseFloat(val) : null;
    } else if (field === 'total') {
      sub.total = val !== '' && !isNaN(val) && parseFloat(val) > 0 ? parseFloat(val) : 10;
    }

    this.recalculateParentScore(item);
    this.saveCourses();
    this.renderTelemetry();
    this.renderCardDiagnostics(assessmentId);
    this.renderSimulator();
    window.sfx.playInputTick();
  }

  recalculateParentScore(item) {
    if (!item.hasSubitems || !item.subitems || item.subitems.length === 0) return;
    let totalScore = 0;
    let anyExplicitlyFilled = false;
    let anyUnfilled = false;

    item.subitems.forEach(s => {
      const subWeight = parseFloat(s.weight) || 0;
      const subTotal = s.total !== null && !isNaN(s.total) && parseFloat(s.total) > 0 ? parseFloat(s.total) : 10;

      if (s.achieved !== null && !isNaN(s.achieved) && s.achieved !== '') {
        anyExplicitlyFilled = true;
        const subAchieved = Math.max(0, parseFloat(s.achieved));
        const subFraction = subAchieved / subTotal;
        totalScore += subFraction * subWeight;
      } else {
        // Initial assumption for unfilled subitem is FULL marks (100% of its weight)
        anyUnfilled = true;
        totalScore += subWeight; // full marks contribution
      }
    });

    if (anyExplicitlyFilled) {
      item.achieved = parseFloat(totalScore.toFixed(2));
      item.total = item.weight;
      item.isPartiallyFilled = anyUnfilled;
    } else {
      // If none of the subsections have marks entered yet, parent is pending
      // (with baseline assumption that upcoming tests score 100% full)
      item.achieved = null;
      item.total = item.weight;
      item.isPartiallyFilled = false;
    }
  }

  addSubitem(assessmentId) {
    const course = this.getActiveCourse();
    const item = course.assessments.find(a => a.id === assessmentId);
    if (!item) return;

    if (!item.subitems) item.subitems = [];
    item.hasSubitems = true;

    const count = item.subitems.length + 1;
    const defaultWeight = parseFloat((item.weight / Math.max(1, count)).toFixed(1));
    const newSub = {
      id: 'sub_' + Date.now(),
      name: `Part ${count}`,
      weight: defaultWeight,
      achieved: null,
      total: 10
    };

    item.subitems.push(newSub);
    const perSub = parseFloat((item.weight / item.subitems.length).toFixed(1));
    item.subitems.forEach(s => s.weight = perSub);

    this.recalculateParentScore(item);
    this.saveCourses();
    this.render();
    this.showToast(`SUBSECTION ADDED TO ${item.name.toUpperCase()}`);
    window.sfx.playClick();
  }

  deleteSubitem(assessmentId, subitemId) {
    const course = this.getActiveCourse();
    const item = course.assessments.find(a => a.id === assessmentId);
    if (!item || !item.subitems) return;

    const sub = item.subitems.find(s => s.id === subitemId);
    const subName = sub ? sub.name : 'subsection';

    if (item.subitems.length <= 1) {
      if (confirm(`Remove "${subName}" and revert ${item.name} to a single paper without subsections?`)) {
        item.hasSubitems = false;
        item.subitems = [];
        this.saveCourses();
        this.render();
        this.showToast(`REVERTED ${item.name.toUpperCase()} TO SINGLE PAPER`);
        window.sfx.playClick();
      }
      return;
    }

    if (!confirm(`Delete subsection "${subName}" from ${item.name}?`)) return;

    item.subitems = item.subitems.filter(s => s.id !== subitemId);
    this.recalculateParentScore(item);
    this.saveCourses();
    this.render();
    this.showToast(`REMOVED ${subName.toUpperCase()}`);
    window.sfx.playClick();
  }

  removeSubsections(assessmentId) {
    const course = this.getActiveCourse();
    const item = course.assessments.find(a => a.id === assessmentId);
    if (!item) return;

    if (confirm(`Remove all subsections from "${item.name}" and revert to a single paper with direct marks entry?`)) {
      item.hasSubitems = false;
      item.subitems = [];
      this.saveCourses();
      this.render();
      this.showToast(`SUBSECTIONS REMOVED // DIRECT PAPER MODE`);
      window.sfx.playClick();
    }
  }

  balanceSubitemWeights(assessmentId) {
    const course = this.getActiveCourse();
    const item = course.assessments.find(a => a.id === assessmentId);
    if (!item || !item.subitems || item.subitems.length === 0) return;

    const perSub = parseFloat((item.weight / item.subitems.length).toFixed(2));
    item.subitems.forEach(s => s.weight = perSub);
    this.recalculateParentScore(item);
    this.saveCourses();
    this.render();
    this.showToast(`SUBSECTIONS BALANCED EVENLY (${perSub}% EACH)`);
    window.sfx.playClick();
  }

  convertAssessmentToSubsections(assessmentId) {
    const course = this.getActiveCourse();
    const item = course.assessments.find(a => a.id === assessmentId);
    if (!item) return;

    item.hasSubitems = true;
    const initialCount = 4;
    const perSub = parseFloat((item.weight / initialCount).toFixed(1));
    item.subitems = [
      { id: 'sub_' + Date.now() + '_1', name: 'Sub-part 1', weight: perSub, achieved: null, total: 10 },
      { id: 'sub_' + Date.now() + '_2', name: 'Sub-part 2', weight: perSub, achieved: null, total: 10 },
      { id: 'sub_' + Date.now() + '_3', name: 'Sub-part 3', weight: perSub, achieved: null, total: 10 },
      { id: 'sub_' + Date.now() + '_4', name: 'Sub-part 4', weight: perSub, achieved: null, total: 10 }
    ];

    this.saveCourses();
    this.render();
    this.showToast(`SUBSECTIONS INITIALIZED FOR ${item.name.toUpperCase()}`);
    window.sfx.playSuccess();
  }

  addAssessmentComponent(name, weight, total, date, hasSubs) {
    const course = this.getActiveCourse();
    const newId = 'comp_' + Date.now();
    const parsedWeight = parseFloat(weight) || 10;
    let subitems = [];

    if (hasSubs) {
      const perSub = parseFloat((parsedWeight / 4).toFixed(1));
      subitems = [
        { id: newId + '_1', name: 'Part 1', weight: perSub, achieved: null, total: 10 },
        { id: newId + '_2', name: 'Part 2', weight: perSub, achieved: null, total: 10 },
        { id: newId + '_3', name: 'Part 3', weight: perSub, achieved: null, total: 10 },
        { id: newId + '_4', name: 'Part 4', weight: perSub, achieved: null, total: 10 }
      ];
    }

    course.assessments.push({
      id: newId,
      name: name.trim(),
      weight: parsedWeight,
      achieved: null,
      total: parseFloat(total) || 10,
      date: date.trim() || 'Throughout Semester',
      hasSubitems: !!hasSubs,
      subitems
    });

    this.saveCourses();
    this.render();
    this.showToast(`COMPONENT "${name.toUpperCase()}" ADDED`);
    window.sfx.playSuccess();
  }

  deleteAssessmentComponent(assessmentId) {
    const course = this.getActiveCourse();
    if (course.assessments.length <= 1) {
      alert('Cannot delete the last remaining assessment component.');
      return;
    }
    const item = course.assessments.find(a => a.id === assessmentId);
    if (!confirm(`Delete assessment component "${item ? item.name : ''}"?`)) return;

    course.assessments = course.assessments.filter(a => a.id !== assessmentId);
    this.saveCourses();
    this.render();
    this.showToast('COMPONENT REMOVED');
    window.sfx.playClick();
  }

  openEditComponentModal(assessmentId) {
    const course = this.getActiveCourse();
    const item = course.assessments.find(a => a.id === assessmentId);
    if (!item) return;

    document.getElementById('editComponentId').value = item.id;
    document.getElementById('editComponentName').value = item.name;
    document.getElementById('editComponentDate').value = item.date;
    document.getElementById('editComponentModal').classList.add('active');
    window.sfx.playClick();
  }

  saveEditComponent(assessmentId, newName, newDate) {
    const course = this.getActiveCourse();
    const item = course.assessments.find(a => a.id === assessmentId);
    if (!item) return;

    item.name = newName.trim();
    item.date = newDate.trim();
    this.saveCourses();
    this.render();
    this.showToast(`COMPONENT UPDATED`);
    window.sfx.playClick();
  }

  calculateCourseStats(course) {
    const target = course.target || 85.0;

    let totalAllocatedWeight = 0;
    let totalWeightCompleted = 0;
    let totalEarned = 0;
    let totalLost = 0;
    let pendingAssessments = [];

    course.assessments.forEach(item => {
      const weight = parseFloat(item.weight) || 0;
      totalAllocatedWeight += weight;

      const isCompleted = item.achieved !== null && item.total !== null && item.total > 0;
      if (isCompleted) {
        const itemPct = (item.achieved / item.total);
        const weightedEarned = itemPct * weight;
        const weightedLost = weight - weightedEarned;

        totalWeightCompleted += weight;
        totalEarned += weightedEarned;
        totalLost += weightedLost;
      } else {
        pendingAssessments.push(item);
      }
    });

    const maxLossAllowed = Math.max(0, totalAllocatedWeight - target);
    const remainingWeight = Math.max(0, totalAllocatedWeight - totalWeightCompleted);
    const marginRemaining = maxLossAllowed - totalLost;
    const maxPossibleScore = totalEarned + remainingWeight;
    const marksNeededFromRemaining = Math.max(0, target - totalEarned);

    let requiredRunRate = 0;
    if (remainingWeight > 0) {
      requiredRunRate = (marksNeededFromRemaining / remainingWeight) * 100.0;
    } else {
      requiredRunRate = totalEarned >= target ? 0 : 999;
    }

    // Status Determination
    let statusZone = 'safe'; // safe, warning, critical
    let statusLabel = 'BUFFER OPTIMAL';

    if (marginRemaining < 0) {
      statusZone = 'critical';
      statusLabel = 'DEFICIT ALERT';
    } else if (marginRemaining <= 3.0) {
      statusZone = 'critical';
      statusLabel = 'CRITICAL MARGIN';
    } else if (marginRemaining <= 7.0) {
      statusZone = 'warning';
      statusLabel = 'CAUTION ZONE';
    } else {
      statusZone = 'safe';
      statusLabel = 'OPTIMAL CUSHION';
    }

    return {
      target,
      totalAllocatedWeight,
      maxLossAllowed,
      totalWeightCompleted,
      remainingWeight,
      totalEarned,
      totalLost,
      marginRemaining,
      maxPossibleScore,
      marksNeededFromRemaining,
      requiredRunRate,
      statusZone,
      statusLabel,
      pendingAssessments
    };
  }

  init() {
    this.render();
    this.bindEvents();
    this.initClock();

    if (this.isFirstEverOpen) {
      this.openAddCourseModal();
    }
  }

  openAddCourseModal() {
    const modal = document.getElementById('addCourseModal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  initClock() {
    const clockEl = document.getElementById('liveClock');
    const updateTime = () => {
      if (clockEl) {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hrs}:${mins}:${secs} IST`;
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  render() {
    this.renderCourseTabs();
    const homeSection = document.getElementById('homeCockpitSection');
    const singleSection = document.getElementById('singleCourseSection');

    if (this.activeCourseId === 'home' || this.courses.length === 0) {
      this.activeCourseId = 'home';
      if (homeSection) homeSection.style.display = 'block';
      if (singleSection) singleSection.style.display = 'none';
      this.renderHomeCockpit();
    } else {
      const course = this.getActiveCourse();
      if (!course) {
        this.activeCourseId = 'home';
        this.render();
        return;
      }
      if (homeSection) homeSection.style.display = 'none';
      if (singleSection) singleSection.style.display = 'block';
      this.renderHeaderBanner();
      this.renderTelemetry();
      this.renderAssessmentCards();
      this.renderSimulator();
    }
  }

  renderCourseTabs() {
    const listEl = document.getElementById('courseTabsList');
    if (!listEl) return;

    const isHomeActive = this.activeCourseId === 'home' || this.courses.length === 0;
    const homeTabHtml = `
      <div class="course-tab-item home-tab ${isHomeActive ? 'active' : ''}" data-course-id="home">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>HOME // ALL SUBJECTS</span>
      </div>
    `;

    const coursesTabsHtml = this.courses.map(course => {
      const isActive = course.id === this.activeCourseId;
      return `
        <div class="course-tab-item ${isActive ? 'active' : ''}" data-course-id="${course.id}">
          <span>${course.code}</span>
          <span class="tab-credits">${course.credits} CR</span>
          <button class="tab-delete-btn" data-delete-id="${course.id}" title="Remove course">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;
    }).join('');

    listEl.innerHTML = homeTabHtml + coursesTabsHtml;
  }

  renderHomeCockpit() {
    const gridEl = document.getElementById('homeSubjectsGrid');
    if (!gridEl) return;

    let totalCredits = 0;
    let weightedTargetSum = 0;
    let weightedScoreSum = 0;
    let marginRemainingSum = 0;
    let atRiskCount = 0;
    let lowestMarginCourse = null;
    let lowestMarginVal = 999;

    const courseStatsList = this.courses.map(course => {
      const stats = this.calculateCourseStats(course);
      const credits = parseInt(course.credits) || 3;
      totalCredits += credits;
      weightedTargetSum += (stats.target * credits);
      weightedScoreSum += (stats.maxPossibleScore * credits);
      marginRemainingSum += stats.marginRemaining;

      if (stats.marginRemaining <= 5.0) {
        atRiskCount++;
      }

      if (stats.marginRemaining < lowestMarginVal) {
        lowestMarginVal = stats.marginRemaining;
        lowestMarginCourse = { code: course.code, margin: stats.marginRemaining, target: stats.target };
      }

      return { course, stats, credits };
    });

    const avgMargin = courseStatsList.length > 0 ? (marginRemainingSum / courseStatsList.length) : 0;
    const avgScore = totalCredits > 0 ? (weightedScoreSum / totalCredits) : 0;
    const avgTarget = totalCredits > 0 ? (weightedTargetSum / totalCredits) : 85;

    // Update Global Cockpit Telemetry
    const creditsEl = document.getElementById('homeTotalCreditsText');
    const statusTextEl = document.getElementById('homeGlobalStatusText');
    const avgMarginEl = document.getElementById('homeAvgMarginVal');
    const avgScoreEl = document.getElementById('homeAvgScoreVal');
    const lowestMarginEl = document.getElementById('homeLowestMarginVal');
    const lowestMarginDesc = document.getElementById('homeLowestMarginDesc');
    const atRiskEl = document.getElementById('homeAtRiskCountVal');
    const summaryCountEl = document.getElementById('homeSummaryCourseCount');

    if (creditsEl) creditsEl.textContent = `${totalCredits} CREDITS ENROLLED`;
    if (summaryCountEl) summaryCountEl.textContent = `${this.courses.length} COURSES LOADED`;
    if (statusTextEl) {
      if (this.courses.length === 0) {
        statusTextEl.textContent = `NO ENROLLED SUBJECTS // CLICK + ADD SUBJECT`;
        statusTextEl.style.color = 'var(--text-muted)';
      } else if (atRiskCount > 0) {
        statusTextEl.textContent = `CAUTION: ${atRiskCount} COURSE(S) AT RISK`;
        statusTextEl.style.color = 'var(--neon-crimson)';
      } else {
        statusTextEl.textContent = `ALL ENROLLED COURSES MONITORED // OPTIMAL`;
        statusTextEl.style.color = 'var(--neon-volt)';
      }
    }

    if (avgMarginEl) {
      if (this.courses.length === 0) {
        avgMarginEl.textContent = '--%';
        avgMarginEl.className = 'stat-cell-val';
      } else {
        avgMarginEl.textContent = `${avgMargin >= 0 ? '+' : ''}${avgMargin.toFixed(2)}%`;
        avgMarginEl.className = `stat-cell-val ${avgMargin > 7 ? 'accent-volt' : avgMargin > 3 ? 'accent-amber' : 'accent-crimson'}`;
      }
    }

    if (avgScoreEl) {
      if (this.courses.length === 0) {
        avgScoreEl.textContent = '--%';
        avgScoreEl.className = 'stat-cell-val';
      } else {
        avgScoreEl.textContent = `${avgScore.toFixed(1)}%`;
        avgScoreEl.className = `stat-cell-val ${avgScore >= avgTarget ? 'accent-cyan' : 'accent-crimson'}`;
      }
    }

    if (lowestMarginEl) {
      if (lowestMarginCourse) {
        lowestMarginEl.textContent = `${lowestMarginCourse.code} (${lowestMarginCourse.margin >= 0 ? '+' : ''}${lowestMarginCourse.margin.toFixed(1)}%)`;
        lowestMarginEl.className = `stat-cell-val ${lowestMarginCourse.margin > 7 ? 'accent-volt' : lowestMarginCourse.margin > 3 ? 'accent-amber' : 'accent-crimson'}`;
      } else {
        lowestMarginEl.textContent = 'NONE';
        lowestMarginEl.className = 'stat-cell-val';
      }
    }

    if (lowestMarginDesc) {
      if (lowestMarginCourse) {
        lowestMarginDesc.textContent = lowestMarginCourse.margin >= 0 
          ? `Smallest safety buffer remaining. Target: >${lowestMarginCourse.target}%`
          : `Deficit detected! Currently below target by ${Math.abs(lowestMarginCourse.margin).toFixed(1)}%`;
      } else {
        lowestMarginDesc.textContent = 'Enroll subjects to begin margin tracking';
      }
    }

    if (atRiskEl) {
      atRiskEl.textContent = `${atRiskCount} / ${this.courses.length}`;
      atRiskEl.className = `stat-cell-val ${atRiskCount === 0 ? 'accent-volt' : 'accent-crimson'}`;
    }

    // Render Subject Cards
    const cardsHtml = courseStatsList.map(({ course, stats, credits }) => {
      let cushionPct = stats.maxLossAllowed > 0 ? (stats.marginRemaining / stats.maxLossAllowed) * 100 : 0;
      cushionPct = Math.max(0, Math.min(100, cushionPct));

      const gradedAssessments = course.assessments.filter(a => a.achieved !== null && a.total !== null && a.total > 0).length;
      const evaluatedPct = stats.totalWeightCompleted > 0 
        ? ((stats.totalEarned / stats.totalWeightCompleted) * 100).toFixed(1) + '%'
        : '100% (Assumed)';

      return `
        <div class="home-subject-card ${stats.statusZone}" data-course-id="${course.id}">
          <div class="home-card-header">
            <div>
              <div class="home-card-code-line">
                <span class="home-card-code">${course.code}</span>
                <span class="meta-pill">${credits} CREDITS</span>
                <span class="home-card-target-pill">GOAL &gt;${stats.target}%</span>
              </div>
              <h3 class="home-card-title">${course.title.toUpperCase()}</h3>
            </div>
            <div class="status-pill ${stats.statusZone}">[ ${stats.statusLabel} ]</div>
          </div>

          <!-- Error Margin Available Highlight Box -->
          <div class="home-card-margin-box">
            <div class="home-margin-title-row">
              <span class="home-margin-sub">// ERROR MARGIN AVAILABLE</span>
              <span style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);">${cushionPct.toFixed(0)}% INTACT</span>
            </div>
            <div class="home-margin-value ${stats.statusZone}">
              ${stats.marginRemaining >= 0 ? '+' : ''}${stats.marginRemaining.toFixed(2)}%
            </div>
            <div class="home-margin-caption">
              ${stats.marginRemaining > 0 
                ? `You can afford to lose at most <strong style="color:var(--neon-volt)">${stats.marginRemaining.toFixed(2)}%</strong> across future tests to secure &gt;${stats.target}%` 
                : stats.marginRemaining === 0 
                ? `<strong style="color:var(--neon-amber)">Razor-thin wire.</strong> Zero room for further loss.`
                : `<strong style="color:var(--neon-crimson)">Margin exceeded by ${Math.abs(stats.marginRemaining).toFixed(2)}%.</strong>`}
            </div>

            <!-- Visual Cushion Progress Meter -->
            <div class="margin-meter-wrapper" style="margin-top:10px;">
              <div class="margin-meter-bar">
                <div class="margin-meter-fill ${stats.statusZone}" style="width: ${cushionPct}%;"></div>
              </div>
              <div class="margin-meter-labels">
                <span>0% EXHAUSTED</span>
                <span>${Math.max(0, stats.marginRemaining).toFixed(1)}% / ${stats.maxLossAllowed.toFixed(1)}% BUFFER</span>
                <span>SAFE</span>
              </div>
            </div>
          </div>

          <!-- Current Evaluated vs Projected Final % -->
          <div class="home-card-stats-grid">
            <div class="home-stat-box">
              <span class="home-stat-box-label">CURRENT EVAL</span>
              <div class="home-stat-box-val accent-volt">${evaluatedPct}</div>
              <span class="home-stat-box-sub">${stats.totalEarned.toFixed(1)}% / ${stats.totalWeightCompleted.toFixed(1)}% done</span>
            </div>

            <div class="home-stat-box">
              <span class="home-stat-box-label">PROJECTED FINAL</span>
              <div class="home-stat-box-val ${stats.maxPossibleScore >= stats.target ? 'accent-cyan' : 'accent-crimson'}">${stats.maxPossibleScore.toFixed(1)}%</div>
              <span class="home-stat-box-sub">Unfilled full</span>
            </div>

            <div class="home-stat-box">
              <span class="home-stat-box-label">WEIGHT LOST</span>
              <div class="home-stat-box-val ${stats.totalLost <= 0.01 ? 'accent-volt' : 'accent-crimson'}">-${stats.totalLost.toFixed(2)}%</div>
              <span class="home-stat-box-sub">of ${stats.maxLossAllowed.toFixed(1)}% allowed</span>
            </div>
          </div>

          <!-- Card Footer with Jump Button -->
          <div class="home-card-footer">
            <div class="home-card-eval-status">
              ${gradedAssessments} OF ${course.assessments.length} GRADED • ${stats.remainingWeight.toFixed(0)}% PENDING
            </div>
            <button class="tactical-btn primary home-jump-course-btn" data-jump-id="${course.id}">
              <span>OPEN SUBJECT HUD</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    const addCardHtml = `
      <div class="home-add-card" id="homeAddCardTrigger">
        <div class="home-add-card-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <div class="home-add-card-title">ENROLL NEW SUBJECT</div>
        <div class="home-add-card-desc">Add MTL100, COL100, ELL100, PYL100, APL100 or custom course breakdown</div>
      </div>
    `;

    gridEl.innerHTML = cardsHtml + addCardHtml;
  }

  renderHeaderBanner() {
    const course = this.getActiveCourse();
    const codeEl = document.getElementById('subjectCodeDisplay');
    const titleEl = document.getElementById('subjectTitleDisplay');
    const creditsEl = document.getElementById('subjectCreditsDisplay');
    const targetSlider = document.getElementById('targetScoreSlider');
    const targetValEl = document.getElementById('targetDisplayValue');

    const target = course.target || 85;
    if (codeEl) codeEl.textContent = course.code;
    if (titleEl) titleEl.textContent = course.title.toUpperCase();
    if (creditsEl) creditsEl.textContent = `${course.credits} CREDITS`;
    if (targetSlider) targetSlider.value = target;
    if (targetValEl) targetValEl.textContent = `${target.toFixed(1)}%`;

    // Highlight active preset button if applicable
    document.querySelectorAll('.preset-target-btn').forEach(btn => {
      const btnTarget = parseFloat(btn.dataset.target);
      if (Math.abs(btnTarget - target) < 0.05) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  renderTelemetry() {
    const course = this.getActiveCourse();
    const stats = this.calculateCourseStats(course);

    // Hero Margin Readout
    const marginHuge = document.getElementById('heroMarginValue');
    const marginDesc = document.getElementById('heroMarginDesc');
    const statusPill = document.getElementById('heroStatusPill');
    const meterFill = document.getElementById('heroMeterFill');
    const meterPercent = document.getElementById('meterPercentLabel');

    if (marginHuge) {
      const sign = stats.marginRemaining > 0 ? '+' : '';
      marginHuge.textContent = `${sign}${stats.marginRemaining.toFixed(2)}%`;
      marginHuge.className = `margin-readout-huge ${stats.statusZone}`;
    }

    if (statusPill) {
      statusPill.textContent = `[ ${stats.statusLabel} ]`;
      statusPill.className = `status-pill ${stats.statusZone}`;
    }

    if (marginDesc) {
      if (stats.marginRemaining > 0) {
        marginDesc.innerHTML = `You can afford to lose at most <strong style="color:var(--neon-volt)">${stats.marginRemaining.toFixed(2)}%</strong> across the rest of the course to secure &gt;${stats.target}%. <span style="display:block;font-size:10px;color:var(--neon-cyan);margin-top:4px;">[Baseline assumes 100% full marks on all unfilled tests]</span>`;
      } else if (stats.marginRemaining === 0) {
        marginDesc.innerHTML = `<strong style="color:var(--neon-amber)">Razor-thin wire.</strong> Zero room for further marks loss. Must score 100% on all remaining tests.`;
      } else {
        marginDesc.innerHTML = `<strong style="color:var(--neon-crimson)">Margin exceeded by ${Math.abs(stats.marginRemaining).toFixed(2)}%.</strong> Max possible score capped at ${stats.maxPossibleScore.toFixed(2)}%.`;
      }
    }

    // Meter Fill Calculation
    if (meterFill) {
      let pctLeft = stats.maxLossAllowed > 0 ? (stats.marginRemaining / stats.maxLossAllowed) * 100 : 0;
      pctLeft = Math.max(0, Math.min(100, pctLeft));
      meterFill.style.width = `${pctLeft}%`;
      meterFill.className = `margin-meter-fill ${stats.statusZone}`;
    }

    if (meterPercent) {
      meterPercent.textContent = `${Math.max(0, stats.marginRemaining).toFixed(1)}% / ${stats.maxLossAllowed.toFixed(1)}% CUSHION`;
    }

    // Telemetry Stat Cells
    const cellEarned = document.getElementById('statEarnedVal');
    const cellLost = document.getElementById('statLostVal');
    const cellRunRate = document.getElementById('statRunRateVal');
    const cellMaxScore = document.getElementById('statMaxScoreVal');

    if (cellEarned) {
      cellEarned.textContent = `${stats.totalEarned.toFixed(2)}%`;
    }
    if (cellLost) {
      cellLost.textContent = `${stats.totalLost.toFixed(2)}%`;
    }
    if (cellRunRate) {
      if (stats.remainingWeight === 0) {
        cellRunRate.textContent = stats.totalEarned >= stats.target ? 'ACHIEVED' : 'MISSED';
        cellRunRate.className = `stat-cell-val ${stats.totalEarned >= stats.target ? 'accent-volt' : 'accent-crimson'}`;
      } else if (stats.requiredRunRate > 100) {
        cellRunRate.textContent = '>100%';
        cellRunRate.className = 'stat-cell-val accent-crimson';
      } else if (stats.requiredRunRate <= 0) {
        cellRunRate.textContent = '0.0%';
        cellRunRate.className = 'stat-cell-val accent-volt';
      } else {
        cellRunRate.textContent = `${stats.requiredRunRate.toFixed(1)}%`;
        cellRunRate.className = `stat-cell-val ${stats.requiredRunRate > 85 ? 'accent-amber' : 'accent-volt'}`;
      }
    }
    if (cellMaxScore) {
      cellMaxScore.textContent = `${stats.maxPossibleScore.toFixed(1)}%`;
      cellMaxScore.className = `stat-cell-val ${stats.maxPossibleScore >= stats.target ? 'accent-volt' : 'accent-crimson'}`;
    }

    // Total Weight Allocation Badge in Section Header
    const allocBadge = document.getElementById('weightAllocationBadge');
    if (allocBadge) {
      const diff = stats.totalAllocatedWeight - 100.0;
      if (Math.abs(diff) < 0.1) {
        allocBadge.textContent = `TOTAL WEIGHT: 100% [BALANCED]`;
        allocBadge.className = 'weight-allocation-badge balanced';
      } else if (diff < 0) {
        allocBadge.textContent = `ALLOCATED: ${stats.totalAllocatedWeight.toFixed(1)}% // ${Math.abs(diff).toFixed(1)}% UNASSIGNED`;
        allocBadge.className = 'weight-allocation-badge unallocated';
      } else {
        allocBadge.textContent = `ALLOCATED: ${stats.totalAllocatedWeight.toFixed(1)}% // OVERFLOW +${diff.toFixed(1)}%`;
        allocBadge.className = 'weight-allocation-badge overflow';
      }
    }

    // Summary in Section Header
    const sectionSummary = document.getElementById('sectionSummaryText');
    if (sectionSummary) {
      sectionSummary.textContent = `${stats.totalWeightCompleted.toFixed(1)}% EVALUATED // ${stats.remainingWeight.toFixed(1)}% PENDING (ASSUMED FULL)`;
    }
  }

  renderAssessmentCards() {
    const course = this.getActiveCourse();
    const container = document.getElementById('assessmentsContainer');
    if (!container) return;

    container.innerHTML = course.assessments.map(item => {
      const isCompleted = item.achieved !== null && item.total !== null && item.total > 0;
      const scorePct = isCompleted ? (item.achieved / item.total) * 100 : 0;
      const weightedEarned = isCompleted ? (scorePct / 100) * item.weight : 0;
      const weightedLost = isCompleted ? item.weight - weightedEarned : 0;

      return `
        <div class="assessment-card ${isCompleted ? 'completed' : 'pending'}" id="card-${item.id}">
          <div class="card-main-row">
            <div class="item-identity">
              <!-- Editable Weightage Badge -->
              <div style="display:flex;align-items:center;gap:8px;">
                <div class="card-weight-ctrl">
                  <div class="weight-input-flex" title="Click to edit weightage of this assessment">
                    <span style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);margin-right:2px;">WT:</span>
                    <input 
                      type="number" 
                      class="card-weight-input item-weight-input" 
                      min="0.5" 
                      max="100" 
                      step="0.5" 
                      value="${item.weight}" 
                      data-assessment-id="${item.id}"
                    />
                    <span class="weight-suffix">%</span>
                  </div>
                </div>
              </div>

              <h3 class="item-name">${item.name}</h3>
              
              <div class="item-date">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>${item.date}</span>
              </div>

              <!-- Action Bar on Card -->
              <div class="card-actions-bar">
                <button class="card-action-btn edit-component-btn" data-assessment-id="${item.id}">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span>RENAME</span>
                </button>

                ${item.hasSubitems ? `
                  <button class="card-action-btn danger remove-all-subsections-btn" data-parent-id="${item.id}" title="Remove subsections breakdown and revert to direct single paper score">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span>REMOVE SUBSECTIONS</span>
                  </button>
                ` : `
                  <button class="card-action-btn add-subsections-btn" data-assessment-id="${item.id}" title="Split into multiple sub-quizzes / labs">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>ADD SUBSECTIONS</span>
                  </button>
                `}

                ${course.assessments.length > 1 ? `
                  <button class="card-action-btn danger delete-component-btn" data-assessment-id="${item.id}" title="Delete this component">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span>REMOVE</span>
                  </button>
                ` : ''}
              </div>
            </div>

            <div class="marks-input-group">
              <div class="input-field-wrap">
                <label class="input-label" for="achieved-${item.id}">MARKS SCORED</label>
                <input 
                  type="number" 
                  id="achieved-${item.id}"
                  class="marks-number-input score-input" 
                  step="0.25"
                  min="0"
                  max="${item.total || 500}"
                  placeholder="Full (${item.total || item.weight})"
                  value="${item.achieved !== null ? item.achieved : ''}"
                  data-assessment-id="${item.id}"
                  data-field="achieved"
                  title="${item.achieved === null ? 'Initially assumed Full Marks (' + (item.total || item.weight) + ')' : 'Marks scored'}"
                />
              </div>

              <div class="marks-divider">/</div>

              <div class="input-field-wrap">
                <label class="input-label" for="total-${item.id}">PAPER TOTAL</label>
                <input 
                  type="number" 
                  id="total-${item.id}"
                  class="marks-number-input total-input" 
                  step="0.5"
                  min="0.1"
                  placeholder="Total"
                  value="${item.total !== null ? item.total : ''}"
                  data-assessment-id="${item.id}"
                  data-field="total"
                />
              </div>
            </div>

            <div class="item-diagnostics" id="diag-${item.id}">
              ${isCompleted ? `
                <div class="diag-score-percentage">${scorePct.toFixed(1)}%</div>
                <div class="diag-weighted-contrib">
                  Earned: <strong>+${weightedEarned.toFixed(2)}</strong> / ${item.weight}%
                  ${item.isPartiallyFilled ? '<span style="display:block;font-size:9px;color:var(--neon-cyan);margin-top:2px;">[UNGRADED SUBS ASSUMED FULL]</span>' : ''}
                </div>
                <div class="diag-loss-tag ${weightedLost <= 0.01 ? 'good' : 'loss'}">
                  ${weightedLost <= 0.01 ? '0.00% LOST' : `-${weightedLost.toFixed(2)}% LOST`}
                </div>
              ` : `
                <div class="diag-score-percentage pending">100% (ASSUMED)</div>
                <div class="diag-weighted-contrib">Contributes: +${item.weight.toFixed(1)} / ${item.weight}% (Full)</div>
                <div class="diag-loss-tag good">0.00% LOST</div>
              `}
            </div>
          </div>

          ${item.hasSubitems && item.subitems ? `
            <div class="tutorial-subgrid">
              <div class="tutorial-subgrid-header">
                <div class="tutorial-subgrid-title">// DETAILED SUBSECTIONS FOR ${item.name.toUpperCase()}</div>
                <div style="font-family:var(--font-mono);font-size:10px;color:var(--neon-cyan);">
                  ${item.subitems.length} Sub-parts • Sub-weight Sum: ${item.subitems.reduce((s, x) => s + (parseFloat(x.weight) || 0), 0).toFixed(1)}% / ${item.weight}%
                </div>
              </div>

              <div class="tutorial-cards-row">
                ${item.subitems.map(sub => {
                  const isSubCompleted = sub.achieved !== null && !isNaN(sub.achieved) && sub.achieved !== '';
                  const subScoreVal = isSubCompleted ? parseFloat(sub.achieved) : '';
                  const subMax = sub.total !== null && !isNaN(sub.total) && parseFloat(sub.total) > 0 ? parseFloat(sub.total) : 10;
                  return `
                  <div class="tut-mini-card ${isSubCompleted ? 'completed' : 'pending-assumed'}">
                    <div class="tut-mini-title">
                      <input 
                        type="text" 
                        class="tut-name-input" 
                        value="${sub.name}" 
                        data-parent-id="${item.id}"
                        data-sub-id="${sub.id}"
                        data-field="name"
                        title="Click to rename"
                      />
                      <div class="tut-weight-flex">
                        <input 
                          type="number" 
                          class="tut-weight-input" 
                          step="0.5" 
                          min="0.1" 
                          max="100" 
                          value="${sub.weight}" 
                          data-parent-id="${item.id}"
                          data-sub-id="${sub.id}"
                          data-field="weight"
                          title="Subsection weightage (%)"
                        />
                        <span>%</span>
                        <button class="tut-delete-btn" data-parent-id="${item.id}" data-sub-id="${sub.id}" title="Remove this subsection">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          <span>DEL</span>
                        </button>
                      </div>
                    </div>

                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px;">
                      ${isSubCompleted ? `
                        <span style="font-family:var(--font-mono);font-size:9px;color:var(--neon-cyan);">EVALUATED</span>
                      ` : `
                        <span class="tut-assumed-badge">[ASSUMED FULL]</span>
                      `}
                      <span style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);">${sub.weight}% wt</span>
                    </div>

                    <div class="tut-inputs-flex">
                      <input 
                        type="number" 
                        class="tut-input tut-achieved" 
                        placeholder="Full (${subMax})" 
                        step="0.25"
                        min="0"
                        value="${subScoreVal}" 
                        data-parent-id="${item.id}"
                        data-sub-id="${sub.id}"
                        data-field="achieved"
                        title="${isSubCompleted ? 'Recorded score' : 'Unfilled: Initially assumed Full Marks (' + subMax + ')'}"
                      />
                      <span style="color:var(--text-disabled);font-size:12px;">/</span>
                      <input 
                        type="number" 
                        class="tut-input tut-total" 
                        placeholder="Max" 
                        step="0.5"
                        min="0.1"
                        value="${sub.total !== null ? sub.total : 10}" 
                        data-parent-id="${item.id}"
                        data-sub-id="${sub.id}"
                        data-field="total"
                      />
                    </div>
                  </div>
                `;
                }).join('')}
              </div>

              <div class="subgrid-actions-bar">
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <button class="card-action-btn add-subitem-btn" data-parent-id="${item.id}">
                    + ADD SUBSECTION
                  </button>
                  <button class="card-action-btn balance-subitems-btn" data-parent-id="${item.id}" title="Divide parent ${item.weight}% weight equally">
                    ⚖ BALANCE WEIGHTS EVENLY (${(item.weight / Math.max(1, item.subitems.length)).toFixed(1)}% each)
                  </button>
                </div>
                <button class="card-action-btn danger remove-all-subsections-btn" data-parent-id="${item.id}" title="Remove all subsections and revert to direct single marks entry">
                  ✕ REMOVE ALL SUBSECTIONS
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  renderCardDiagnostics(assessmentId) {
    const course = this.getActiveCourse();
    const item = course.assessments.find(a => a.id === assessmentId);
    const diagEl = document.getElementById(`diag-${assessmentId}`);
    const cardEl = document.getElementById(`card-${assessmentId}`);
    if (!item || !diagEl || !cardEl) return;

    const isCompleted = item.achieved !== null && item.total !== null && item.total > 0;
    if (isCompleted) {
      cardEl.classList.remove('pending');
      cardEl.classList.add('completed');
      const scorePct = (item.achieved / item.total) * 100;
      const weightedEarned = (scorePct / 100) * item.weight;
      const weightedLost = item.weight - weightedEarned;

      diagEl.innerHTML = `
        <div class="diag-score-percentage">${scorePct.toFixed(1)}%</div>
        <div class="diag-weighted-contrib">
          Earned: <strong>+${weightedEarned.toFixed(2)}</strong> / ${item.weight}%
          ${item.isPartiallyFilled ? '<span style="display:block;font-size:9px;color:var(--neon-cyan);margin-top:2px;">[UNGRADED SUBS ASSUMED FULL]</span>' : ''}
        </div>
        <div class="diag-loss-tag ${weightedLost <= 0.01 ? 'good' : 'loss'}">
          ${weightedLost <= 0.01 ? '0.00% LOST' : `-${weightedLost.toFixed(2)}% LOST`}
        </div>
      `;
    } else {
      cardEl.classList.remove('completed');
      cardEl.classList.add('pending');
      diagEl.innerHTML = `
        <div class="diag-score-percentage pending">100% (ASSUMED)</div>
        <div class="diag-weighted-contrib">Contributes: +${item.weight.toFixed(1)} / ${item.weight}% (Full)</div>
        <div class="diag-loss-tag good">0.00% LOST</div>
      `;
    }
  }

  renderSimulator() {
    const course = this.getActiveCourse();
    const stats = this.calculateCourseStats(course);
    const slidersList = document.getElementById('simSlidersList');
    if (!slidersList) return;

    if (stats.pendingAssessments.length === 0) {
      slidersList.innerHTML = `
        <div style="font-family:var(--font-mono);font-size:12px;color:var(--neon-volt);padding:12px;background:var(--bg-surface-2);border:1px dashed var(--border-mid);">
          // ALL ASSESSMENTS COMPLETED! Final score is locked at ${stats.totalEarned.toFixed(2)}%.
        </div>
      `;
      this.updateSimulatorOutcome();
      return;
    }

    slidersList.innerHTML = stats.pendingAssessments.map(item => {
      const currentSim = this.simulatedValues[item.id] !== undefined ? this.simulatedValues[item.id] : 100;
      return `
        <div class="sim-slider-row">
          <div class="sim-slider-header">
            <span class="sim-item-name">${item.name} (${item.weight}% wt)</span>
            <span class="sim-item-val" id="simVal-${item.id}">${currentSim}% (${((currentSim / 100) * item.weight).toFixed(1)} pts)</span>
          </div>
          <input 
            type="range" 
            class="sim-slider-input" 
            min="0" 
            max="100" 
            step="1"
            value="${currentSim}" 
            data-sim-id="${item.id}"
            data-item-weight="${item.weight}"
          />
        </div>
      `;
    }).join('');

    this.updateSimulatorOutcome();
  }

  updateSimulatorOutcome() {
    const course = this.getActiveCourse();
    const stats = this.calculateCourseStats(course);

    let projectedEarned = stats.totalEarned;
    stats.pendingAssessments.forEach(item => {
      const simPct = this.simulatedValues[item.id] !== undefined ? this.simulatedValues[item.id] : 100;
      projectedEarned += (simPct / 100) * item.weight;
    });

    const scoreEl = document.getElementById('simProjectedScore');
    const statusEl = document.getElementById('simProjectedStatus');
    const marginDiffEl = document.getElementById('simMarginDiff');

    if (scoreEl) {
      scoreEl.textContent = `${projectedEarned.toFixed(2)}%`;
      scoreEl.style.color = projectedEarned >= stats.target ? 'var(--neon-volt)' : 'var(--neon-crimson)';
    }

    if (statusEl) {
      if (projectedEarned >= stats.target) {
        statusEl.textContent = `TARGET MET (+${(projectedEarned - stats.target).toFixed(2)}% CLEAR)`;
        statusEl.className = 'sim-outcome-status status-pill safe';
      } else {
        statusEl.textContent = `SHORT BY ${(stats.target - projectedEarned).toFixed(2)}%`;
        statusEl.className = 'sim-outcome-status status-pill critical';
      }
    }

    if (marginDiffEl) {
      const netMargin = stats.maxLossAllowed - (stats.totalAllocatedWeight - projectedEarned);
      marginDiffEl.textContent = `Projected Final Cushion: ${netMargin >= 0 ? '+' : ''}${netMargin.toFixed(2)}%`;
    }
  }

  setAllSimulatorValues(val) {
    const course = this.getActiveCourse();
    const stats = this.calculateCourseStats(course);
    const targetVal = val === 'target' ? stats.target : Math.min(100, Math.max(0, parseFloat(val) || 100));
    stats.pendingAssessments.forEach(item => {
      this.simulatedValues[item.id] = targetVal;
    });
    this.renderSimulator();
    this.showToast(`SIMULATOR SET TO ${targetVal.toFixed(0)}% ACROSS PENDING TESTS`);
    window.sfx.playClick();
  }

  showToast(message) {
    const toast = document.getElementById('tacticalToast');
    const text = document.getElementById('toastMessageText');
    if (!toast || !text) return;

    text.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  bindEvents() {
    // Target Slider and Inputs
    const targetSlider = document.getElementById('targetScoreSlider');
    if (targetSlider) {
      targetSlider.addEventListener('input', (e) => {
        this.updateTargetScore(e.target.value);
      });
    }

    // Delegated click listeners
    document.addEventListener('click', (e) => {
      // Preset Target Buttons
      const presetBtn = e.target.closest('.preset-target-btn');
      if (presetBtn) {
        const val = parseFloat(presetBtn.dataset.target);
        this.updateTargetScore(val);
        window.sfx.playClick();
        return;
      }

      // Simulator Quick Preset Buttons
      const simPresetBtn = e.target.closest('.sim-preset-btn');
      if (simPresetBtn) {
        this.setAllSimulatorValues(simPresetBtn.dataset.simVal);
        return;
      }

      // Home Cockpit - Jump to Course Button
      const jumpBtn = e.target.closest('.home-jump-course-btn');
      if (jumpBtn) {
        this.setActiveCourse(jumpBtn.dataset.jumpId);
        return;
      }

      // Home Cockpit - Add Course Button or Tile
      if (e.target.closest('#homeAddCourseBtn') || e.target.closest('#homeAddCardTrigger')) {
        const modalOverlay = document.getElementById('addCourseModal');
        if (modalOverlay) {
          modalOverlay.classList.add('active');
          window.sfx.playClick();
        }
        return;
      }

      // Home Cockpit - Clicking on a card directly
      const subjectCard = e.target.closest('.home-subject-card');
      if (subjectCard && !e.target.closest('button') && !e.target.closest('input')) {
        this.setActiveCourse(subjectCard.dataset.courseId);
        return;
      }

      // Course Tab Switch
      const tab = e.target.closest('.course-tab-item');
      if (tab && !e.target.closest('.tab-delete-btn')) {
        const courseId = tab.dataset.courseId;
        this.setActiveCourse(courseId);
        return;
      }

      // Course Delete
      const deleteTabBtn = e.target.closest('.tab-delete-btn');
      if (deleteTabBtn) {
        e.stopPropagation();
        this.deleteCourse(deleteTabBtn.dataset.deleteId);
        return;
      }

      // Add Subitem Button
      const addSubBtn = e.target.closest('.add-subitem-btn');
      if (addSubBtn) {
        this.addSubitem(addSubBtn.dataset.parentId);
        return;
      }

      // Delete Subitem Button
      const delSubBtn = e.target.closest('.tut-delete-btn');
      if (delSubBtn) {
        this.deleteSubitem(delSubBtn.dataset.parentId, delSubBtn.dataset.subId);
        return;
      }

      // Balance Subitems Button
      const balanceBtn = e.target.closest('.balance-subitems-btn');
      if (balanceBtn) {
        this.balanceSubitemWeights(balanceBtn.dataset.parentId);
        return;
      }

      // Convert to Subsections Button
      const addSubsBtn = e.target.closest('.add-subsections-btn');
      if (addSubsBtn) {
        this.convertAssessmentToSubsections(addSubsBtn.dataset.assessmentId);
        return;
      }

      // Remove All Subsections Button
      const removeSubsBtn = e.target.closest('.remove-all-subsections-btn');
      if (removeSubsBtn) {
        this.removeSubsections(removeSubsBtn.dataset.parentId);
        return;
      }

      // Delete Assessment Component Button
      const delCompBtn = e.target.closest('.delete-component-btn');
      if (delCompBtn) {
        this.deleteAssessmentComponent(delCompBtn.dataset.assessmentId);
        return;
      }

      // Edit Assessment Component Info Button
      const editCompBtn = e.target.closest('.edit-component-btn');
      if (editCompBtn) {
        this.openEditComponentModal(editCompBtn.dataset.assessmentId);
        return;
      }
    });

    // Input changes on scores, weights, and subsections
    document.addEventListener('input', (e) => {
      // Assessment Score / Total
      if (e.target.classList.contains('score-input') || e.target.classList.contains('total-input')) {
        const assessmentId = e.target.dataset.assessmentId;
        const achievedInput = document.getElementById(`achieved-${assessmentId}`);
        const totalInput = document.getElementById(`total-${assessmentId}`);
        this.updateAssessmentScore(
          assessmentId, 
          achievedInput ? achievedInput.value : '', 
          totalInput ? totalInput.value : ''
        );
      }

      // Assessment Weight change
      if (e.target.classList.contains('item-weight-input')) {
        const assessmentId = e.target.dataset.assessmentId;
        this.updateAssessmentWeight(assessmentId, e.target.value);
      }

      // Subitem inputs (achieved, total, weight, name)
      if (e.target.classList.contains('tut-input') || e.target.classList.contains('tut-weight-input') || e.target.classList.contains('tut-name-input')) {
        const parentId = e.target.dataset.parentId;
        const subId = e.target.dataset.subId;
        const field = e.target.dataset.field;
        this.updateSubitem(parentId, subId, field, e.target.value);
      }

      // Simulator Sliders
      if (e.target.classList.contains('sim-slider-input')) {
        const simId = e.target.dataset.simId;
        const weight = parseFloat(e.target.dataset.itemWeight);
        const val = parseFloat(e.target.value);
        this.simulatedValues[simId] = val;

        const valDisplay = document.getElementById(`simVal-${simId}`);
        if (valDisplay) {
          valDisplay.textContent = `${val}% (${((val / 100) * weight).toFixed(1)} pts)`;
        }
        this.updateSimulatorOutcome();
      }
    });

    // Add Course Modal Triggers
    const openAddModalBtn = document.getElementById('openAddCourseBtn');
    const closeAddModalBtn = document.getElementById('closeAddCourseModal');
    const modalOverlay = document.getElementById('addCourseModal');
    const addCourseForm = document.getElementById('addCourseForm');

    if (openAddModalBtn && modalOverlay) {
      openAddModalBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
        window.sfx.playClick();
      });
    }

    if (closeAddModalBtn && modalOverlay) {
      closeAddModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        window.sfx.playClick();
      });
    }

    // Preset pills inside Modal
    document.querySelectorAll('.preset-pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const presetKey = e.currentTarget.dataset.preset;
        const preset = COURSE_PRESETS[presetKey];
        if (preset) {
          document.getElementById('newCourseCode').value = preset.code;
          document.getElementById('newCourseTitle').value = preset.title;
          document.getElementById('newCourseCredits').value = preset.credits;
          document.getElementById('newCourseTarget').value = preset.target;
          window.sfx.playClick();
        }
      });
    });

    // Handle Add Course Submission
    if (addCourseForm) {
      addCourseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('newCourseCode').value.trim().toUpperCase();
        const title = document.getElementById('newCourseTitle').value.trim();
        const credits = parseInt(document.getElementById('newCourseCredits').value) || 3;
        const target = parseFloat(document.getElementById('newCourseTarget').value) || 85;

        if (!code || !title) return;

        let assessments = [];
        if (COURSE_PRESETS[code]) {
          assessments = JSON.parse(JSON.stringify(COURSE_PRESETS[code].assessments));
        } else {
          assessments = [
            { id: 'q1', name: 'Quiz 1 / Assessment 1', date: 'Sep 2026', weight: 10, achieved: null, total: 10 },
            { id: 'mid', name: 'Mid Semester Exam', date: 'Oct 2026', weight: 30, achieved: null, total: 30 },
            { id: 'q2', name: 'Quiz 2 / Assessment 2', date: 'Oct 2026', weight: 10, achieved: null, total: 10 },
            { id: 'tut', name: 'Tutorial / Assignment Component', date: 'Continuous', weight: 10, achieved: null, total: 10 },
            { id: 'major', name: 'Major Exam', date: 'Nov / Dec 2026', weight: 40, achieved: null, total: 40 }
          ];
        }

        const newId = code.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Date.now();
        const newCourse = {
          id: newId,
          code,
          title,
          credits,
          target,
          assessments
        };

        this.courses.push(newCourse);
        this.activeCourseId = newId;
        this.saveCourses();
        modalOverlay.classList.remove('active');
        addCourseForm.reset();
        this.render();
        this.showToast(`SUBJECT ${code} INITIALIZED // TELEMETRY ACTIVE`);
        window.sfx.playSuccess();
      });
    }

    // Add Component Modal
    const openCompBtn = document.getElementById('openAddComponentBtn');
    const closeCompBtn = document.getElementById('closeAddComponentModal');
    const compModal = document.getElementById('addComponentModal');
    const addCompForm = document.getElementById('addComponentForm');

    if (openCompBtn && compModal) {
      openCompBtn.addEventListener('click', () => {
        compModal.classList.add('active');
        window.sfx.playClick();
      });
    }

    if (closeCompBtn && compModal) {
      closeCompBtn.addEventListener('click', () => {
        compModal.classList.remove('active');
        window.sfx.playClick();
      });
    }

    if (addCompForm) {
      addCompForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('newComponentName').value;
        const weight = document.getElementById('newComponentWeight').value;
        const total = document.getElementById('newComponentTotal').value;
        const date = document.getElementById('newComponentDate').value;
        const hasSubs = document.getElementById('newComponentHasSubs').checked;

        this.addAssessmentComponent(name, weight, total, date, hasSubs);
        compModal.classList.remove('active');
        addCompForm.reset();
      });
    }

    // Edit Component Modal
    const closeEditBtn = document.getElementById('closeEditComponentModal');
    const editModal = document.getElementById('editComponentModal');
    const editForm = document.getElementById('editComponentForm');

    if (closeEditBtn && editModal) {
      closeEditBtn.addEventListener('click', () => {
        editModal.classList.remove('active');
        window.sfx.playClick();
      });
    }

    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const compId = document.getElementById('editComponentId').value;
        const name = document.getElementById('editComponentName').value;
        const date = document.getElementById('editComponentDate').value;

        this.saveEditComponent(compId, name, date);
        editModal.classList.remove('active');
      });
    }

    // Audio SFX Toggle
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundStatusLabel = document.getElementById('soundStatusLabel');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        const isMuted = window.sfx.toggleMute();
        if (soundStatusLabel) {
          soundStatusLabel.textContent = isMuted ? 'SFX: OFF' : 'SFX: ON';
        }
        this.showToast(isMuted ? 'AUDIO MUTE ENGAGED' : 'AUDIO SYNTH ONLINE');
      });
    }

    // Export Backup JSON
    const exportBtn = document.getElementById('exportDataBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.courses, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `iitd_academic_telemetry_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        this.showToast('TELEMETRY DATA BACKUP EXPORTED');
        window.sfx.playClick();
      });
    }

    // Reset to Default Baseline
    const resetBtn = document.getElementById('resetDataBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset dashboard to fresh baseline? All subjects and telemetry will be cleared.')) {
          this.courses = [];
          this.activeCourseId = 'home';
          this.saveCourses();
          this.render();
          this.showToast('SYSTEM RESET TO EMPTY BASELINE');
          window.sfx.playWarning();
          this.openAddCourseModal();
        }
      });
    }
  }

  deleteCourse(courseId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!confirm(`Delete course ${course ? course.code : ''}?`)) return;

    this.courses = this.courses.filter(c => c.id !== courseId);
    if (this.activeCourseId === courseId || this.courses.length === 0) {
      this.activeCourseId = 'home';
    }
    this.saveCourses();
    this.render();
    this.showToast(`COURSE REMOVED`);
    window.sfx.playClick();
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AcademicRunnerApp();
  window.app.init();
});
