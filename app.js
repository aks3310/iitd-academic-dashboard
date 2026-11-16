// MARATHON // IITD ACADEMIC MARGIN TELEMETRY ENGINE
// Reactive State Management, Custom Weightages, Subsections & Simulator

const STORAGE_KEY = 'iitd_runner_courses_v1';
const ACTIVE_COURSE_KEY = 'iitd_runner_active_course_v1';
const INITIALIZED_KEY = 'iitd_runner_initialized';
const CUTOFFS_STORAGE_KEY = 'iitd_runner_grade_cutoffs_v1';
const SEMESTERS_KEY = 'iitd_runner_semesters_v1';
const CURRENT_SEMESTER_KEY = 'iitd_runner_current_semester_v1';
const COLLAPSED_SEMESTERS_KEY = 'iitd_runner_collapsed_semesters_v1';
// Courses saved before semesters existed are migrated into this semester
const DEFAULT_SEMESTER_ID = 'sem_1';
const DEFAULT_SEMESTER_NAME = 'Semester 1';

// Padlock glyphs used for the per-course marks lock
const LOCK_SVG_CLOSED = '<svg class="lock-glyph" width="__S__" height="__S__" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="1"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>';
const LOCK_SVG_OPEN = '<svg class="lock-glyph" width="__S__" height="__S__" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="1"></rect><path d="M8 11V7a4 4 0 0 1 7.75-1.4"></path></svg>';

// Baseline starts empty with zero subjects
const DEFAULT_COURSES = [];

// Crowd-sourced official responses for IITD First-Year Grade Cutoffs
const OFFICIAL_COURSE_CUTOFFS = [
  {
    code: 'CML1001',
    title: 'Molecular Science & Chemistry',
    credits: 3,
    maxMarks: 100,
    cycle: 'chemistry',
    enabled: true,
    userScore: 78.0,
    cutoffs: { 10: 82.4, 9: 73.0, 8: 67.3, 7: 61.2, 6: 55.0, 5: 48.0, 4: 40.0, 3: 35.0, 2: 30.0, 1: 25.0, 0: 0.0 },
    verifiedGrades: [10, 9, 8, 7]
  },
  {
    code: 'CML1002',
    title: 'Chemistry - Structure & Reactivity',
    credits: 3,
    maxMarks: 100,
    cycle: 'chemistry',
    enabled: false,
    userScore: 74.0,
    cutoffs: { 10: 79.25, 9: 69.5, 8: 62.0, 7: 55.0, 6: 48.0, 5: 42.0, 4: 35.0, 3: 30.0, 2: 25.0, 1: 20.0, 0: 0.0 },
    verifiedGrades: [10, 9]
  },
  {
    code: 'MTL1001',
    title: 'Calculus & Linear Algebra',
    credits: 4,
    maxMarks: 100,
    cycle: 'common',
    enabled: true,
    userScore: 71.0,
    cutoffs: { 10: 79.5, 9: 69.0, 8: 59.25, 7: 49.75, 6: 41.5, 5: 35.0, 4: 30.0, 3: 25.0, 2: 20.0, 1: 15.0, 0: 0.0 },
    verifiedGrades: [10, 9, 8, 7, 6, 5]
  },
  {
    code: 'ELL1000',
    title: 'Introduction to Electrical Engineering',
    credits: 4,
    maxMarks: 100,
    cycle: 'chemistry',
    enabled: true,
    userScore: 72.0,
    cutoffs: { 10: 80.0, 9: 70.0, 8: 60.0, 7: 51.0, 6: 43.0, 5: 36.0, 4: 30.0, 3: 25.0, 2: 20.0, 1: 15.0, 0: 0.0 },
    verifiedGrades: [10, 9, 8, 7]
  },
  {
    code: 'CMP1000',
    title: 'Chemistry Laboratory',
    credits: 2,
    maxMarks: 100,
    cycle: 'chemistry',
    enabled: true,
    userScore: 86.0,
    cutoffs: { 10: 89.5, 9: 84.0, 8: 78.5, 7: 72.0, 6: 65.0, 5: 58.0, 4: 50.0, 3: 42.0, 2: 35.0, 1: 25.0, 0: 0.0 },
    verifiedGrades: [10, 9, 8]
  },
  {
    code: 'PYP1000',
    title: 'Physics Laboratory',
    credits: 2,
    maxMarks: 160,
    cycle: 'physics',
    enabled: false,
    userScore: 142.0,
    cutoffs: { 10: 152.5, 9: 136.0, 8: 122.0, 7: 110.0, 6: 98.0, 5: 86.0, 4: 74.0, 3: 60.0, 2: 50.0, 1: 40.0, 0: 0.0 },
    verifiedGrades: [10, 9]
  },
  {
    code: 'MEP1001',
    title: 'Product Realization through Manufacturing',
    credits: 2,
    maxMarks: 100,
    cycle: 'physics',
    enabled: false,
    userScore: 75.0,
    cutoffs: { 10: 80.25, 9: 72.0, 8: 64.0, 7: 56.0, 6: 48.0, 5: 42.0, 4: 35.0, 3: 30.0, 2: 25.0, 1: 20.0, 0: 0.0 },
    verifiedGrades: [10, 9]
  },
  {
    code: 'PYL1001',
    title: 'Electromagnetic Waves & Quantum Mechanics',
    credits: 3,
    maxMarks: 100,
    cycle: 'physics',
    enabled: false,
    userScore: 68.0,
    cutoffs: { 10: 87.0, 9: 77.0, 8: 60.0, 7: 52.0, 6: 45.0, 5: 38.0, 4: 30.0, 3: 25.0, 2: 20.0, 1: 15.0, 0: 0.0 },
    verifiedGrades: [10, 9, 8]
  },
  {
    code: 'COL1000',
    title: 'Introduction to Computer Science',
    credits: 4,
    maxMarks: 100,
    cycle: 'physics',
    enabled: false,
    userScore: 76.0,
    cutoffs: { 10: 82.0, 9: 72.57, 8: 61.14, 7: 52.0, 6: 44.0, 5: 37.0, 4: 30.0, 3: 25.0, 2: 20.0, 1: 15.0, 0: 0.0 },
    verifiedGrades: [10, 9, 8]
  },
  {
    code: 'MEP1000',
    title: 'Engineering Graphics',
    credits: 2,
    maxMarks: 100,
    cycle: 'chemistry',
    enabled: true,
    userScore: 78.5,
    cutoffs: { 10: 83.72, 9: 76.0, 8: 68.21, 7: 60.0, 6: 52.0, 5: 45.0, 4: 38.0, 3: 30.0, 2: 25.0, 1: 20.0, 0: 0.0 },
    verifiedGrades: [10, 9, 8]
  }
];

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
  CML1002: {
    code: 'CML1002',
    title: 'Chemistry - Structure & Reactivity',
    credits: 3,
    target: 85.0,
    assessments: [
      { id: 'cq1', name: 'Quiz 1', date: 'Sep 2026', weight: 10, achieved: null, total: 10 },
      { id: 'midsem', name: 'Mid Semester Exam', date: 'Oct 2026', weight: 30, achieved: null, total: 30 },
      { id: 'cq2', name: 'Quiz 2', date: 'Oct 2026', weight: 10, achieved: null, total: 10 },
      { id: 'tut', name: 'Tutorial Quizzes', date: 'Continuous', weight: 10, achieved: null, total: 10 },
      { id: 'major', name: 'Major Exam', date: 'Nov 2026', weight: 40, achieved: null, total: 40 }
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
  MTL1001: {
    code: 'MTL1001',
    title: 'Calculus & Linear Algebra',
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
  COL1000: {
    code: 'COL1000',
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
  ELL1000: {
    code: 'ELL1000',
    title: 'Introduction to Electrical Engineering',
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
  PYL1001: {
    code: 'PYL1001',
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
  PYP1000: {
    code: 'PYP1000',
    title: 'Physics Laboratory',
    credits: 2,
    target: 85.0,
    assessments: [
      { id: 'lab_eval', name: 'Continuous Lab Work & Viva', date: 'Weekly Experiments', weight: 50, achieved: null, total: 80 },
      { id: 'reports', name: 'Reports & Logbook', date: 'Continuous', weight: 20, achieved: null, total: 40 },
      { id: 'major_exam', name: 'End Semester Lab Practical & Viva', date: 'Nov 2026', weight: 30, achieved: null, total: 40 }
    ]
  },
  MEP1000: {
    code: 'MEP1000',
    title: 'Engineering Graphics',
    credits: 2,
    target: 85.0,
    assessments: [
      { id: 'cad_labs', name: 'Weekly Drafting & CAD Exercises', date: 'Continuous', weight: 40, achieved: null, total: 100 },
      { id: 'midsem', name: 'Mid Semester Practical Evaluation', date: 'Oct 2026', weight: 20, achieved: null, total: 50 },
      { id: 'project', name: 'Term Modeling Project', date: 'Nov 2026', weight: 10, achieved: null, total: 25 },
      { id: 'major', name: 'Major Practical Exam', date: 'Nov 2026', weight: 30, achieved: null, total: 75 }
    ]
  },
  MEP1001: {
    code: 'MEP1001',
    title: 'Product Realization through Manufacturing',
    credits: 2,
    target: 85.0,
    assessments: [
      { id: 'shop_pract', name: 'Workshop Practical Jobs (Foundry/Welding/Machining)', date: 'Weekly', weight: 50, achieved: null, total: 100 },
      { id: 'viva', name: 'Continuous Viva & Safety Assessments', date: 'Throughout', weight: 20, achieved: null, total: 40 },
      { id: 'major_shop', name: 'Major Practical & Comprehensive Viva', date: 'Nov 2026', weight: 30, achieved: null, total: 60 }
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

    // Semesters: every course belongs to one. Older saves have no semester info,
    // so those courses are migrated into the current (or a default) semester.
    const semesterState = this.reconcileSemesters(
      this.loadSemesters(),
      this.courses,
      localStorage.getItem(CURRENT_SEMESTER_KEY)
    );
    this.semesters = semesterState.semesters;
    this.currentSemesterId = semesterState.currentSemesterId;
    this.collapsedSemesters = this.loadCollapsedSemesters();

    // Ensure all enrolled courses have cutoffs initialized from official baselines or defaults
    this.courses.forEach(c => this.ensureCourseCutoffs(c));
    this.cutoffFilterQuery = '';
    this.activeCourseId = localStorage.getItem(ACTIVE_COURSE_KEY) || localStorage.getItem('iitd_runner_active_course_v2') || 'home';
    this.simulatedValues = {};
    
    // Ensure activeCourseId is valid ('home', 'cgpa' or existing course id)
    if (this.courses.length === 0 || (this.activeCourseId !== 'home' && this.activeCourseId !== 'cgpa' && !this.courses.some(c => c.id === this.activeCourseId))) {
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

    // Persist the semester migration so older saves are upgraded once
    if (this.courses.length > 0) {
      this.saveCourses();
    }
  }

  ensureCourseCutoffs(course) {
    if (!course) return;
    if (course.cutoffs && Object.keys(course.cutoffs).length >= 11) {
      return;
    }
    const cleanCode = (course.code || '').trim().toUpperCase();
    const official = OFFICIAL_COURSE_CUTOFFS.find(o => o.code === cleanCode);
    if (official) {
      course.cutoffs = JSON.parse(JSON.stringify(official.cutoffs));
      course.verifiedGrades = official.verifiedGrades ? [...official.verifiedGrades] : [];
      course.maxMarks = official.maxMarks || 100;
    } else {
      course.cutoffs = {
        10: 82.0, 9: 72.0, 8: 62.0, 7: 52.0, 6: 42.0, 5: 35.0, 4: 30.0, 3: 25.0, 2: 20.0, 1: 15.0, 0: 0.0
      };
      course.verifiedGrades = [];
      course.maxMarks = 100;
    }
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
    if (this.semesters) {
      localStorage.setItem(SEMESTERS_KEY, JSON.stringify(this.semesters));
      localStorage.setItem(CURRENT_SEMESTER_KEY, this.currentSemesterId);
    }
  }

  // ---- Semesters ------------------------------------------------------
  loadSemesters() {
    try {
      const stored = localStorage.getItem(SEMESTERS_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse stored semesters:', e);
    }
    return [];
  }

  loadCollapsedSemesters() {
    try {
      const parsed = JSON.parse(localStorage.getItem(COLLAPSED_SEMESTERS_KEY) || '[]');
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      return new Set();
    }
  }

  saveCollapsedSemesters() {
    try {
      localStorage.setItem(COLLAPSED_SEMESTERS_KEY, JSON.stringify([...this.collapsedSemesters]));
    } catch (e) { /* per-viewer convenience only */ }
  }

  newSemesterId() {
    return `sem_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  }

  // Cleans a semester list and makes sure every course points at one of them.
  // Accepts courses carrying `semesterId` (current format) or a `semester`
  // name/number (hand-written JSON). Courses with neither land in the current
  // semester. Mutates the courses; returns { semesters, currentSemesterId }.
  reconcileSemesters(rawSemesters, courses, preferredCurrentId) {
    const list = [];
    const byId = new Map();
    const add = (id, name) => {
      const sem = { id, name: name || `Semester ${list.length + 1}` };
      list.push(sem);
      byId.set(id, sem);
      return sem;
    };

    (Array.isArray(rawSemesters) ? rawSemesters : []).forEach(raw => {
      if (!raw || typeof raw !== 'object') return;
      const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : this.newSemesterId();
      if (byId.has(id)) return;
      add(id, String(raw.name || '').trim().slice(0, 40));
    });

    const unassigned = [];
    courses.forEach(c => {
      const label = typeof c.semester === 'number'
        ? `Semester ${c.semester}`
        : (typeof c.semester === 'string' ? c.semester.trim().slice(0, 40) : '');
      delete c.semester;

      if (typeof c.semesterId === 'string' && byId.has(c.semesterId)) return;
      if (label) {
        const match = list.find(sem => sem.name.toLowerCase() === label.toLowerCase());
        c.semesterId = match ? match.id : add(this.newSemesterId(), label).id;
      } else if (typeof c.semesterId === 'string' && c.semesterId.trim()) {
        // Semester id we have no record of: keep the grouping, give it a name
        add(c.semesterId.trim(), '');
        c.semesterId = c.semesterId.trim();
      } else {
        unassigned.push(c);
      }
    });

    if (list.length === 0) add(DEFAULT_SEMESTER_ID, DEFAULT_SEMESTER_NAME);
    const currentSemesterId = byId.has(preferredCurrentId) ? preferredCurrentId : list[list.length - 1].id;
    unassigned.forEach(c => { c.semesterId = currentSemesterId; });

    return { semesters: list, currentSemesterId };
  }

  getSemester(semesterId) {
    return this.semesters.find(s => s.id === semesterId) || null;
  }

  getCurrentSemester() {
    return this.getSemester(this.currentSemesterId) || this.semesters[this.semesters.length - 1];
  }

  getSemesterCourses(semesterId) {
    return this.courses.filter(c => c.semesterId === semesterId);
  }

  semesterName(semesterId) {
    const sem = this.getSemester(semesterId);
    return sem ? sem.name : 'Unassigned';
  }

  escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  // Credit-weighted grade point average over a list of courses
  calculateGpa(courses) {
    let credits = 0;
    let points = 0;
    courses.forEach(course => {
      const cr = parseFloat(course.credits) || 0;
      credits += cr;
      points += this.calculateCourseGrade(course).assignedGrade * cr;
    });
    return { gpa: credits > 0 ? points / credits : 0, credits, points };
  }

  addSemester() {
    const suggested = `Semester ${this.semesters.length + 1}`;
    const input = prompt('Name for the new semester:', suggested);
    if (input === null) return;
    const name = input.trim().slice(0, 40) || suggested;
    if (this.semesters.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      this.showToast(`A SEMESTER NAMED ${name.toUpperCase()} ALREADY EXISTS`);
      window.sfx.playWarning();
      return;
    }
    const sem = { id: this.newSemesterId(), name };
    this.semesters.push(sem);
    this.currentSemesterId = sem.id;
    this.saveCourses();
    this.render();
    this.showToast(`${name.toUpperCase()} CREATED // SET AS CURRENT SEMESTER`);
    window.sfx.playSuccess();
  }

  renameSemester(semesterId) {
    const sem = this.getSemester(semesterId);
    if (!sem) return;
    const input = prompt('Rename semester:', sem.name);
    if (input === null) return;
    const name = input.trim().slice(0, 40);
    if (!name || name === sem.name) return;
    if (this.semesters.some(s => s.id !== sem.id && s.name.toLowerCase() === name.toLowerCase())) {
      this.showToast(`A SEMESTER NAMED ${name.toUpperCase()} ALREADY EXISTS`);
      window.sfx.playWarning();
      return;
    }
    sem.name = name;
    this.saveCourses();
    this.render();
    this.showToast(`SEMESTER RENAMED // ${name.toUpperCase()}`);
    window.sfx.playClick();
  }

  deleteSemester(semesterId) {
    const sem = this.getSemester(semesterId);
    if (!sem) return;
    const count = this.getSemesterCourses(semesterId).length;
    if (count > 0) {
      this.showToast(`${sem.name.toUpperCase()} HAS ${count} COURSE(S) // MOVE OR REMOVE THEM FIRST`);
      window.sfx.playWarning();
      return;
    }
    if (this.semesters.length <= 1) {
      this.showToast('AT LEAST ONE SEMESTER IS REQUIRED');
      window.sfx.playWarning();
      return;
    }
    if (!confirm(`Delete empty semester "${sem.name}"?`)) return;
    this.semesters = this.semesters.filter(s => s.id !== semesterId);
    this.collapsedSemesters.delete(semesterId);
    this.saveCollapsedSemesters();
    if (this.currentSemesterId === semesterId) {
      this.currentSemesterId = this.semesters[this.semesters.length - 1].id;
    }
    this.saveCourses();
    this.render();
    this.showToast('SEMESTER DELETED');
    window.sfx.playClick();
  }

  setCurrentSemester(semesterId) {
    if (!this.getSemester(semesterId)) return;
    this.currentSemesterId = semesterId;
    this.collapsedSemesters.delete(semesterId);
    this.saveCollapsedSemesters();
    this.saveCourses();
    this.render();
    this.showToast(`${this.semesterName(semesterId).toUpperCase()} IS NOW THE CURRENT SEMESTER`);
    window.sfx.playClick();
  }

  toggleSemesterCollapsed(semesterId) {
    if (this.collapsedSemesters.has(semesterId)) {
      this.collapsedSemesters.delete(semesterId);
    } else {
      this.collapsedSemesters.add(semesterId);
    }
    this.saveCollapsedSemesters();
    this.renderHomeCockpit();
    window.sfx.playClick();
  }

  moveCourseToSemester(courseId, semesterId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course || !this.getSemester(semesterId) || course.semesterId === semesterId) return;
    if (this.blockIfLocked(course)) { this.render(); return; }
    course.semesterId = semesterId;
    this.saveCourses();
    this.render();
    this.showToast(`${course.code} MOVED TO ${this.semesterName(semesterId).toUpperCase()}`);
    window.sfx.playClick();
  }

  // Drag a course (home card or ribbon tab) onto another semester to move it.
  // Uses the same move path as the Semester dropdown, so the lock rule and
  // saving behave identically.
  setupCourseDragAndDrop() {
    const DRAG_SOURCE = '.home-subject-card[data-course-id], .course-tab-item[draggable="true"][data-course-id]';
    const DROP_ZONE = '.semester-group[data-semester-id], .ribbon-semester-group[data-semester-id]';
    const asElement = (node) => (node && node.nodeType === 1 ? node : node?.parentElement) || null;
    let dragCourse = null;

    const cleanup = () => {
      dragCourse = null;
      document.body.classList.remove('course-drag-active');
      document.querySelectorAll('.is-dragging, .drop-target-active, .drag-origin').forEach(el => {
        el.classList.remove('is-dragging', 'drop-target-active', 'drag-origin');
      });
    };

    const zoneFor = (e) => {
      const zone = asElement(e.target)?.closest(DROP_ZONE);
      if (!zone || !dragCourse || zone.dataset.semesterId === dragCourse.semesterId) return null;
      return zone;
    };

    document.addEventListener('dragstart', (e) => {
      const source = asElement(e.target)?.closest(DRAG_SOURCE);
      if (!source) return;
      const course = this.courses.find(c => c.id === source.dataset.courseId);
      if (!course) return;
      if (this.isCourseLocked(course)) {
        e.preventDefault();
        this.showToast(`${course.code} IS LOCKED // UNLOCK TO MOVE IT`);
        window.sfx.playWarning();
        return;
      }
      if (this.semesters.length < 2) {
        e.preventDefault();
        this.showToast('ADD ANOTHER SEMESTER TO MOVE COURSES BETWEEN THEM');
        return;
      }
      dragCourse = course;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', course.code); // Firefox needs data to start a drag
      // Defer so the drag image is captured before the source is dimmed
      requestAnimationFrame(() => {
        if (dragCourse !== course) return;
        source.classList.add('is-dragging');
        document.body.classList.add('course-drag-active');
        document.querySelectorAll(DROP_ZONE).forEach(zone => {
          if (zone.dataset.semesterId === course.semesterId) zone.classList.add('drag-origin');
        });
      });
    });

    document.addEventListener('dragover', (e) => {
      if (!dragCourse) return;
      const zone = zoneFor(e);
      if (!zone) {
        e.dataTransfer.dropEffect = 'none';
        document.querySelectorAll('.drop-target-active').forEach(el => el.classList.remove('drop-target-active'));
        return;
      }
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (!zone.classList.contains('drop-target-active')) {
        document.querySelectorAll('.drop-target-active').forEach(el => el.classList.remove('drop-target-active'));
        zone.classList.add('drop-target-active');
      }
    });

    document.addEventListener('drop', (e) => {
      if (!dragCourse) return;
      const zone = zoneFor(e);
      const course = dragCourse;
      cleanup();
      if (!zone) return;
      e.preventDefault();
      this.moveCourseToSemester(course.id, zone.dataset.semesterId);
    });

    // The source element may already be re-rendered away after a drop, so
    // dragend is a fallback; drop does the main cleanup.
    document.addEventListener('dragend', cleanup);
  }

  semesterOptionsHtml(selectedId) {
    return this.semesters.map(s =>
      `<option value="${this.escapeHtml(s.id)}" ${s.id === selectedId ? 'selected' : ''}>${this.escapeHtml(s.name.toUpperCase())}${s.id === this.currentSemesterId ? ' (CURRENT)' : ''}</option>`
    ).join('');
  }

  loadCutoffCourses() {
    try {
      const stored = localStorage.getItem(CUTOFFS_STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with official baseline if missing any course
          const existingCodes = new Set(parsed.map(c => c.code));
          OFFICIAL_COURSE_CUTOFFS.forEach(official => {
            if (!existingCodes.has(official.code)) {
              parsed.push(JSON.parse(JSON.stringify(official)));
            }
          });
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored cutoffs:', e);
    }
    return JSON.parse(JSON.stringify(OFFICIAL_COURSE_CUTOFFS));
  }

  saveCutoffCourses() {
    localStorage.setItem(CUTOFFS_STORAGE_KEY, JSON.stringify(this.cutoffCourses));
  }

  getActiveCourse() {
    if (this.courses.length === 0) {
      return null;
    }
    if (this.activeCourseId === 'home' || this.activeCourseId === 'cgpa') {
      return this.courses[0];
    }
    return this.courses.find(c => c.id === this.activeCourseId) || this.courses[0];
  }

  setActiveCourse(courseId) {
    if (courseId === 'home' || courseId === 'cgpa' || this.courses.some(c => c.id === courseId)) {
      this.activeCourseId = courseId;
      this.simulatedValues = {};
      this.saveCourses();
      this.render();
      window.sfx.playClick();
    }
  }

  // ---- Course marks lock ----------------------------------------------
  isCourseLocked(course) {
    return !!(course && course.locked);
  }

  lockIcon(locked, size = 11) {
    return (locked ? LOCK_SVG_CLOSED : LOCK_SVG_OPEN).replace(/__S__/g, size);
  }

  lockPillHtml(course) {
    const locked = this.isCourseLocked(course);
    return `<span class="lock-pill ${locked ? 'locked' : 'unlocked'}" title="${locked ? 'Marks are locked. Unlock the course to edit them.' : 'Marks are editable'}">${this.lockIcon(locked, 10)}<span>${locked ? 'LOCKED' : 'UNLOCKED'}</span></span>`;
  }

  // variant: 'banner' (full tactical button), 'card' (compact card action), 'micro' (cutoff matrix)
  lockToggleBtnHtml(course, variant = 'banner') {
    const locked = this.isCourseLocked(course);
    const label = locked ? 'UNLOCK MARKS' : 'LOCK MARKS';
    const title = locked ? 'Unlock this course so marks can be edited' : 'Lock this course to prevent accidental changes to entered marks';
    const cls = variant === 'micro' ? 'btn-micro' : variant === 'card' ? 'card-action-btn' : 'tactical-btn';
    return `<button type="button" class="${cls} lock-toggle-btn ${locked ? 'is-locked' : ''}" data-lock-id="${course.id}" title="${title}" aria-pressed="${locked}">${this.lockIcon(!locked, variant === 'banner' ? 12 : 10)}<span>${label}</span></button>`;
  }

  // Returns true (and warns) when an edit is attempted on a locked course
  blockIfLocked(course) {
    if (!this.isCourseLocked(course)) return false;
    this.showToast(`${course.code} IS LOCKED // UNLOCK TO EDIT MARKS`);
    window.sfx.playWarning();
    return true;
  }

  toggleCourseLock(courseId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;
    course.locked = !course.locked;
    this.saveCourses();
    this.render();
    this.showToast(course.locked ? `${course.code} LOCKED // MARKS PROTECTED` : `${course.code} UNLOCKED // MARKS EDITABLE`);
    if (course.locked) {
      window.sfx.playSuccess();
    } else {
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
    if (this.blockIfLocked(course)) { this.render(); return; }
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
    if (this.blockIfLocked(course)) { this.render(); return; }
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
    if (this.blockIfLocked(course)) { this.render(); return; }
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
    if (this.blockIfLocked(course)) { this.render(); return; }
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
    if (this.blockIfLocked(course)) { this.render(); return; }
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
    if (this.blockIfLocked(course)) { this.render(); return; }
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
    if (this.blockIfLocked(course)) { this.render(); return; }
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
    if (this.blockIfLocked(course)) { this.render(); return; }
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
    if (this.blockIfLocked(course)) return;
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
    if (this.blockIfLocked(course)) return;
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
    if (this.blockIfLocked(course)) { this.render(); return; }
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
    if (this.blockIfLocked(course)) { this.render(); return; }
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
    const cgpaSection = document.getElementById('cgpaCutoffsSection');

    if (this.activeCourseId === 'cgpa') {
      if (homeSection) homeSection.style.display = 'none';
      if (singleSection) singleSection.style.display = 'none';
      if (cgpaSection) cgpaSection.style.display = 'block';
      this.renderCgpaSection();
    } else if (this.activeCourseId === 'home' || this.courses.length === 0) {
      this.activeCourseId = 'home';
      if (homeSection) homeSection.style.display = 'block';
      if (singleSection) singleSection.style.display = 'none';
      if (cgpaSection) cgpaSection.style.display = 'none';
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
      if (cgpaSection) cgpaSection.style.display = 'none';
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
    const isCgpaActive = this.activeCourseId === 'cgpa';

    const homeTabHtml = `
      <div class="course-tab-item home-tab ${isHomeActive ? 'active' : ''}" data-course-id="home">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>HOME // ALL SUBJECTS</span>
      </div>
    `;

    const cgpaTabHtml = `
      <div class="course-tab-item cgpa-tab ${isCgpaActive ? 'active' : ''}" data-course-id="cgpa">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 20V10M12 20V4M6 20v-6"></path>
        </svg>
        <span>GRADE CUTOFFS & CGPA</span>
      </div>
    `;

    const courseTabHtml = course => {
      const isActive = course.id === this.activeCourseId;
      const locked = this.isCourseLocked(course);
      return `
        <div class="course-tab-item ${isActive ? 'active' : ''} ${locked ? 'is-locked' : ''}" data-course-id="${course.id}" draggable="true" title="${locked ? 'Locked. Unlock to move it to another semester' : 'Drag onto another semester to move it'}">
          <span class="tab-lock-indicator ${locked ? 'locked' : 'unlocked'}" title="${locked ? 'Marks locked' : 'Marks editable'}">${this.lockIcon(locked, 11)}</span>
          <span style="font-weight:800;letter-spacing:0.06em;">${course.code}</span>
          <span class="tab-credits">[ ${course.credits} CR ]</span>
          ${locked ? '' : `
          <button class="tab-delete-btn" data-delete-id="${course.id}" title="Remove course">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>`}
        </div>
      `;
    };

    // One labelled group per semester that has courses
    const coursesTabsHtml = this.semesters.map(sem => {
      const semCourses = this.getSemesterCourses(sem.id);
      const isCurrent = sem.id === this.currentSemesterId;
      // Empty semesters stay in the DOM so they can take a dragged course;
      // CSS only shows them while a drag is in progress.
      const isEmpty = semCourses.length === 0;
      return `
        <div class="ribbon-semester-group ${isCurrent ? 'is-current' : ''} ${isEmpty ? 'is-empty' : ''}" data-semester-id="${this.escapeHtml(sem.id)}">
          <span class="ribbon-semester-label" title="${isCurrent ? 'Current semester' : 'Semester'}">${this.escapeHtml(sem.name.toUpperCase())}</span>
          ${isEmpty ? '<span class="ribbon-drop-placeholder">DROP HERE</span>' : semCourses.map(courseTabHtml).join('')}
        </div>
      `;
    }).join('');

    listEl.innerHTML = homeTabHtml + cgpaTabHtml + coursesTabsHtml;
  }

  renderHomeCockpit() {
    const gridEl = document.getElementById('homeSubjectsGrid');
    if (!gridEl) return;

    // Top HUD tracks the current semester; past semesters are listed below it
    const currentSem = this.getCurrentSemester();
    const hudCourses = this.getSemesterCourses(currentSem.id);
    const semLabel = currentSem.name.toUpperCase();

    let totalCredits = 0;
    let weightedTargetSum = 0;
    let weightedScoreSum = 0;
    let marginRemainingSum = 0;
    let atRiskCount = 0;
    let lowestMarginCourse = null;
    let lowestMarginVal = 999;

    const courseStatsList = hudCourses.map(course => {
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

    const currentSemEl = document.getElementById('homeCurrentSemesterText');
    if (currentSemEl) currentSemEl.textContent = semLabel;
    if (creditsEl) creditsEl.textContent = `${totalCredits} CREDITS ENROLLED`;
    if (summaryCountEl) {
      const semCount = this.semesters.length;
      summaryCountEl.textContent = `${this.courses.length} COURSES • ${semCount} SEMESTER${semCount === 1 ? '' : 'S'}`;
    }
    if (statusTextEl) {
      if (hudCourses.length === 0) {
        statusTextEl.textContent = `NO SUBJECTS IN ${semLabel} // CLICK + ADD SUBJECT`;
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
      if (hudCourses.length === 0) {
        avgMarginEl.textContent = '--%';
        avgMarginEl.className = 'stat-cell-val';
      } else {
        avgMarginEl.textContent = `${avgMargin >= 0 ? '+' : ''}${avgMargin.toFixed(2)}%`;
        avgMarginEl.className = `stat-cell-val ${avgMargin > 7 ? 'accent-volt' : avgMargin > 3 ? 'accent-amber' : 'accent-crimson'}`;
      }
    }

    if (avgScoreEl) {
      if (hudCourses.length === 0) {
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
      atRiskEl.textContent = `${atRiskCount} / ${hudCourses.length}`;
      atRiskEl.className = `stat-cell-val ${atRiskCount === 0 ? 'accent-volt' : 'accent-crimson'}`;
    }

    // Render Subject Cards
    const cardHtml = (course) => {
      const stats = this.calculateCourseStats(course);
      const credits = parseInt(course.credits) || 3;
      let cushionPct = stats.maxLossAllowed > 0 ? (stats.marginRemaining / stats.maxLossAllowed) * 100 : 0;
      cushionPct = Math.max(0, Math.min(100, cushionPct));

      const gradedAssessments = course.assessments.filter(a => a.achieved !== null && a.total !== null && a.total > 0).length;
      const evaluatedPct = stats.totalWeightCompleted > 0 
        ? ((stats.totalEarned / stats.totalWeightCompleted) * 100).toFixed(1) + '%'
        : '100% (Assumed)';

      return `
        <div class="home-subject-card tactical-card-corners ${stats.statusZone} ${this.isCourseLocked(course) ? 'is-locked' : ''}" data-course-id="${course.id}" draggable="true">
          <span class="hud-corner-crosshair tl"></span>
          <span class="hud-corner-crosshair tr"></span>
          <span class="hud-corner-crosshair bl"></span>
          <span class="hud-corner-crosshair br"></span>
          ${stats.statusZone !== 'safe' ? '<div class="hazard-stripe-strip" style="margin-bottom:12px;" aria-hidden="true"></div>' : ''}
          <div class="home-card-header">
            <div>
              <div class="home-card-code-line">
                <span class="home-card-code">${course.code}</span>
                <span class="meta-pill">[ ${credits} CR ]</span>
                <span class="home-card-target-pill">GOAL &gt;${stats.target}%</span>
                ${this.lockPillHtml(course)}
                <span style="font-family:var(--font-mono);font-size:9.5px;color:var(--text-muted);letter-spacing:0.1em;">SN-IITD-${course.code}</span>
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
            <div class="home-card-footer-actions">
            ${this.lockToggleBtnHtml(course, 'card')}
            <button class="tactical-btn primary home-jump-course-btn" data-jump-id="${course.id}">
              <span>OPEN SUBJECT HUD</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            </div>
          </div>
        </div>
      `;
    };

    const addCardHtml = (sem) => `
      <div class="home-add-card tactical-card-corners" data-semester-id="${this.escapeHtml(sem.id)}">
        <span class="hud-corner-crosshair tl"></span>
        <span class="hud-corner-crosshair tr"></span>
        <span class="hud-corner-crosshair bl"></span>
        <span class="hud-corner-crosshair br"></span>
        <div class="home-add-card-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <div class="home-add-card-title">ENROLL NEW SUBJECT</div>
        <div class="home-add-card-desc">Add a preset or custom course to ${this.escapeHtml(sem.name.toUpperCase())}</div>
        <span style="font-family:var(--font-mono);font-size:9.5px;color:var(--neon-volt);letter-spacing:0.14em;margin-top:6px;">[ + INITIALIZE ]</span>
      </div>
    `;

    const chevron = `<svg class="semester-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

    const groupsHtml = this.semesters.map(sem => {
      const semCourses = this.getSemesterCourses(sem.id);
      const isCurrent = sem.id === this.currentSemesterId;
      const collapsed = this.collapsedSemesters.has(sem.id);
      const credits = semCourses.reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0);
      const lockedCount = semCourses.filter(c => this.isCourseLocked(c)).length;
      const gpa = this.calculateGpa(semCourses);
      const sid = this.escapeHtml(sem.id);

      return `
        <section class="semester-group ${isCurrent ? 'is-current' : ''} ${collapsed ? 'is-collapsed' : ''}" data-semester-id="${sid}">
          <div class="semester-header-bar">
            <button type="button" class="semester-toggle-btn" data-semester-toggle="${sid}" aria-expanded="${!collapsed}" title="${collapsed ? 'Expand' : 'Collapse'} semester">
              ${chevron}
              <span class="semester-name">${this.escapeHtml(sem.name.toUpperCase())}</span>
            </button>
            ${isCurrent ? '<span class="semester-current-pill">CURRENT</span>' : ''}
            <div class="semester-header-meta">
              <span>${semCourses.length} COURSE${semCourses.length === 1 ? '' : 'S'}</span>
              <span>${credits} CR</span>
              <span>SGPA <strong>${gpa.credits > 0 ? gpa.gpa.toFixed(2) : '--.--'}</strong></span>
              ${lockedCount > 0 ? `<span class="semester-locked-count">${this.lockIcon(true, 10)} ${lockedCount} LOCKED</span>` : ''}
            </div>
            <span class="semester-drop-label" aria-hidden="true">DROP TO MOVE HERE</span>
            <div class="semester-header-actions">
              ${isCurrent ? '' : `<button type="button" class="btn-micro semester-set-current-btn" data-semester-id="${sid}" title="Track this semester in the top stats">SET CURRENT</button>`}
              <button type="button" class="btn-micro semester-rename-btn" data-semester-id="${sid}">RENAME</button>
              ${semCourses.length === 0 && this.semesters.length > 1 ? `<button type="button" class="btn-micro danger-micro semester-delete-btn" data-semester-id="${sid}">DELETE</button>` : ''}
            </div>
          </div>
          ${collapsed ? '' : `
          <div class="home-subjects-grid">
            ${semCourses.map(cardHtml).join('')}
            ${addCardHtml(sem)}
          </div>`}
        </section>
      `;
    }).join('');

    const dragHint = this.semesters.length > 1
      ? '<div class="semester-drag-hint">// DRAG A SUBJECT CARD ONTO ANOTHER SEMESTER TO MOVE IT. LOCKED SUBJECTS STAY PUT.</div>'
      : '';
    gridEl.innerHTML = dragHint + groupsHtml;
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

    const semRow = document.getElementById('subjectSemesterRow');
    if (semRow) {
      const locked = this.isCourseLocked(course);
      semRow.innerHTML = `
        <span class="semester-row-label">SEMESTER</span>
        <select class="semester-move-select" data-course-id="${course.id}" ${locked ? 'disabled title="Unlock the course to move it to another semester"' : 'title="Move this course to another semester"'}>
          ${this.semesterOptionsHtml(course.semesterId)}
        </select>
      `;
    }

    const lockRow = document.getElementById('subjectLockRow');
    if (lockRow) {
      const locked = this.isCourseLocked(course);
      lockRow.innerHTML = `
        ${this.lockPillHtml(course)}
        <span class="lock-row-caption">${locked ? 'MARKS ENTRY FROZEN // UNLOCK TO EDIT' : 'MARKS ENTRY OPEN // LOCK TO PREVENT ACCIDENTAL EDITS'}</span>
        ${this.lockToggleBtnHtml(course, 'banner')}
      `;
    }
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

    const locked = this.isCourseLocked(course);
    const dis = locked ? 'disabled' : '';
    container.classList.toggle('roster-locked', locked);

    const rosterLockBadge = document.getElementById('rosterLockBadge');
    if (rosterLockBadge) rosterLockBadge.innerHTML = this.lockPillHtml(course);

    const addCompBtn = document.getElementById('openAddComponentBtn');
    if (addCompBtn) {
      addCompBtn.disabled = locked;
      addCompBtn.classList.toggle('is-locked', locked);
      addCompBtn.title = locked ? 'Course is locked. Unlock it to add components.' : '';
    }

    container.innerHTML = course.assessments.map(item => {
      const isCompleted = item.achieved !== null && item.total !== null && item.total > 0;
      const scorePct = isCompleted ? (item.achieved / item.total) * 100 : 0;
      const weightedEarned = isCompleted ? (scorePct / 100) * item.weight : 0;
      const weightedLost = isCompleted ? item.weight - weightedEarned : 0;

      return `
        <div class="assessment-card tactical-card-corners ${isCompleted ? 'completed' : 'pending'} ${locked ? 'locked' : ''}" id="card-${item.id}">
          <span class="hud-corner-crosshair tl"></span>
          <span class="hud-corner-crosshair tr"></span>
          <span class="hud-corner-crosshair bl"></span>
          <span class="hud-corner-crosshair br"></span>
          <div class="card-main-row">
            <div class="item-identity">
              <!-- Editable Weightage Badge & Serial Stamp -->
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
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
                      ${dis}
                    />
                    <span class="weight-suffix">%</span>
                  </div>
                </div>
                <span style="font-family:var(--font-mono);font-size:9.5px;color:var(--neon-cyan);letter-spacing:0.1em;">SN-ASSESS-${item.id.toUpperCase()}</span>
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
                ${locked ? `
                  <span class="card-locked-note">${this.lockIcon(true, 10)}<span>LOCKED // UNLOCK COURSE TO EDIT</span></span>
                ` : `
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
                `}
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
                  ${dis}
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
                  ${dis}
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
                        title="${locked ? 'Course locked' : 'Click to rename'}"
                        ${dis}
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
                          ${dis}
                        />
                        <span>%</span>
                        ${locked ? '' : `<button class="tut-delete-btn" data-parent-id="${item.id}" data-sub-id="${sub.id}" title="Remove this subsection">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          <span>DEL</span>
                        </button>`}
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
                        ${dis}
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
                        ${dis}
                      />
                    </div>
                  </div>
                `;
                }).join('')}
              </div>

              ${locked ? '' : `
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
              `}
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
    const netMargin = stats.maxLossAllowed - (stats.totalAllocatedWeight - projectedEarned);
    const isSafe = projectedEarned >= stats.target && netMargin >= 0;

    if (scoreEl) {
      scoreEl.textContent = `${projectedEarned.toFixed(2)}%`;
      scoreEl.style.color = isSafe ? 'var(--neon-volt)' : 'var(--neon-crimson)';
      scoreEl.style.textShadow = isSafe ? '0 0 20px var(--neon-volt-glow)' : '0 0 20px var(--neon-crimson-glow)';
      if (isSafe) {
        scoreEl.classList.remove('critical');
        scoreEl.classList.add('safe');
      } else {
        scoreEl.classList.remove('safe');
        scoreEl.classList.add('critical');
      }
    }

    if (statusEl) {
      if (isSafe) {
        statusEl.textContent = `TARGET MET (+${(projectedEarned - stats.target).toFixed(2)}% CLEAR)`;
        statusEl.className = 'sim-outcome-status status-pill safe';
      } else {
        statusEl.textContent = `SHORT BY ${(stats.target - projectedEarned).toFixed(2)}%`;
        statusEl.className = 'sim-outcome-status status-pill critical';
      }
    }

    if (marginDiffEl) {
      marginDiffEl.textContent = `Projected Final Cushion: ${netMargin >= 0 ? '+' : ''}${netMargin.toFixed(2)}%`;
      marginDiffEl.style.color = isSafe ? 'var(--text-mid)' : 'var(--neon-crimson)';
      marginDiffEl.style.textShadow = isSafe ? 'none' : '0 0 10px var(--neon-crimson-glow)';
    }

    const cardEl = scoreEl ? scoreEl.closest('.sim-outcome-card') : null;
    if (cardEl) {
      if (isSafe) {
        cardEl.classList.remove('critical');
      } else {
        cardEl.classList.add('critical');
      }
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

  getGradeLetter(point) {
    const pt = Math.round(Number(point));
    switch (pt) {
      case 10: return 'A';
      case 9: return 'A-';
      case 8: return 'B';
      case 7: return 'B-';
      case 6: return 'C';
      case 5: return 'C-';
      case 4: return 'D';
      case 3: return 'E+';
      case 2: return 'E';
      case 1: return 'F+';
      case 0: return 'F';
      default: return pt >= 4 ? 'P' : 'F';
    }
  }

  getCourseScore(course) {
    if (course.scoreOverride !== undefined && course.scoreOverride !== null && course.scoreOverride !== '') {
      return parseFloat(course.scoreOverride);
    }
    const stats = this.calculateCourseStats(course);
    return parseFloat(stats.maxPossibleScore.toFixed(1));
  }

  calculateCourseGrade(course) {
    this.ensureCourseCutoffs(course);
    const score = this.getCourseScore(course);
    const cutoffs = course.cutoffs || {};
    const gradeLevels = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

    // Find highest grade where score >= cutoff
    let assignedGrade = 0;
    for (let i = 0; i < gradeLevels.length; i++) {
      const g = gradeLevels[i];
      const cutoffVal = parseFloat(cutoffs[g]);
      if (!isNaN(cutoffVal) && score >= cutoffVal) {
        assignedGrade = g;
        break;
      }
    }

    const currentCutoff = parseFloat(cutoffs[assignedGrade]) || 0;
    const nextHigherGrade = assignedGrade < 10 ? assignedGrade + 1 : null;
    const nextCutoff = nextHigherGrade !== null ? (parseFloat(cutoffs[nextHigherGrade]) || 0) : null;
    const marginToHigher = nextCutoff !== null ? Math.max(0, nextCutoff - score) : null;

    const lowerGrade = assignedGrade > 0 ? assignedGrade - 1 : null;
    const lowerCutoff = lowerGrade !== null ? (parseFloat(cutoffs[lowerGrade]) || 0) : null;
    const marginToLower = assignedGrade > 0 ? (score - currentCutoff) : 0;

    // Relative position on ladder
    const maxGrade10Cutoff = parseFloat(cutoffs[10]) || 80;
    const relativePositionPct = Math.min(100, Math.max(0, (score / maxGrade10Cutoff) * 100));

    return {
      assignedGrade,
      letterGrade: this.getGradeLetter(assignedGrade),
      currentCutoff,
      nextHigherGrade,
      nextCutoff,
      marginToHigher,
      lowerGrade,
      lowerCutoff,
      marginToLower,
      relativePositionPct,
      score
    };
  }

  calculateCgpaStats() {
    let totalCredits = 0;
    let totalPoints = 0;
    let gradeDistribution = { 10: 0, 9: 0, 8: 0, 7: 0, 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, 0: 0 };
    let easiestJump = null;
    let minMarginToHigher = 999999;

    this.courses.forEach(course => {
      const credits = parseFloat(course.credits) || 0;
      const gradeInfo = this.calculateCourseGrade(course);
      course.computedGrade = gradeInfo;

      totalCredits += credits;
      totalPoints += (gradeInfo.assignedGrade * credits);
      gradeDistribution[gradeInfo.assignedGrade] = (gradeDistribution[gradeInfo.assignedGrade] || 0) + 1;

      if (gradeInfo.nextHigherGrade !== null && gradeInfo.marginToHigher !== null && gradeInfo.marginToHigher > 0) {
        if (gradeInfo.marginToHigher < minMarginToHigher) {
          minMarginToHigher = gradeInfo.marginToHigher;
          easiestJump = {
            code: course.code,
            title: course.title,
            currentGrade: gradeInfo.assignedGrade,
            targetGrade: gradeInfo.nextHigherGrade,
            marginNeeded: gradeInfo.marginToHigher,
            credits: credits
          };
        }
      }
    });

    // Across every semester this is the CGPA (kept as `sgpa` for the existing readout code)
    const sgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0.0;

    let jumpBoostText = 'Smallest gap to the next higher grade tier.';
    if (easiestJump && totalCredits > 0) {
      const boost = (easiestJump.credits / totalCredits);
      const newSgpa = sgpa + boost;
      jumpBoostText = `Needs +${easiestJump.marginNeeded.toFixed(2)} pts in ${easiestJump.code} for Grade ${easiestJump.targetGrade} [${this.getGradeLetter(easiestJump.targetGrade)}] (+${boost.toFixed(2)} CGPA → ${newSgpa.toFixed(2)})`;
    }

    const semesterBreakdown = this.semesters
      .map(sem => ({ sem, ...this.calculateGpa(this.getSemesterCourses(sem.id)) }))
      .filter(row => row.credits > 0);

    return {
      sgpa,
      totalCredits,
      totalPoints,
      gradeDistribution,
      activeCourseCount: this.courses.length,
      easiestJump,
      jumpBoostText,
      semesterBreakdown
    };
  }

  renderCgpaSection() {
    const stats = this.calculateCgpaStats();

    // Update Banner & Global HUD Elements
    const activeCountEl = document.getElementById('cgpaActiveCountText');
    const totalCreditsBannerEl = document.getElementById('cgpaTotalCreditsText');
    const valueDisplayEl = document.getElementById('cgpaValueDisplay');
    const statusPillEl = document.getElementById('cgpaStatusPill');
    const creditsSumEl = document.getElementById('cgpaCreditsSum');
    const pointsSumEl = document.getElementById('cgpaPointsSum');
    const progressFillEl = document.getElementById('cgpaProgressFill');

    const statCreditsEl = document.getElementById('statCgpaTotalCredits');
    const statPointsEl = document.getElementById('statCgpaTotalPoints');
    const statJumpTitleEl = document.getElementById('statCgpaNextJumpTitle');
    const statJumpDescEl = document.getElementById('statCgpaNextJumpDesc');

    if (activeCountEl) activeCountEl.textContent = `${stats.activeCourseCount} ENROLLED SUBJECTS`;
    if (totalCreditsBannerEl) totalCreditsBannerEl.textContent = `${stats.totalCredits} REGISTERED CREDITS`;
    if (valueDisplayEl) {
      valueDisplayEl.textContent = stats.totalCredits > 0 ? stats.sgpa.toFixed(2) : '--.--';
      if (stats.sgpa >= 9.0) {
        valueDisplayEl.style.color = 'var(--neon-volt)';
        valueDisplayEl.style.textShadow = '0 0 25px var(--neon-volt-glow)';
      } else if (stats.sgpa >= 8.0) {
        valueDisplayEl.style.color = 'var(--neon-cyan)';
        valueDisplayEl.style.textShadow = '0 0 25px var(--neon-cyan-glow)';
      } else if (stats.sgpa >= 7.0) {
        valueDisplayEl.style.color = 'var(--neon-amber)';
        valueDisplayEl.style.textShadow = '0 0 25px var(--neon-amber-glow)';
      } else {
        valueDisplayEl.style.color = 'var(--neon-crimson)';
        valueDisplayEl.style.textShadow = '0 0 25px var(--neon-crimson-glow)';
      }
    }

    if (statusPillEl) {
      if (stats.totalCredits === 0) {
        statusPillEl.textContent = '[ NO COURSES ENROLLED ]';
        statusPillEl.className = 'status-pill';
      } else if (stats.sgpa >= 9.0) {
        statusPillEl.textContent = '[ DISTINCTION / HIGH HONORS ]';
        statusPillEl.className = 'status-pill safe';
      } else if (stats.sgpa >= 8.0) {
        statusPillEl.textContent = '[ FIRST DIVISION WITH HONORS ]';
        statusPillEl.className = 'status-pill safe';
      } else if (stats.sgpa >= 6.75) {
        statusPillEl.textContent = '[ FIRST DIVISION ]';
        statusPillEl.className = 'status-pill warning';
      } else {
        statusPillEl.textContent = '[ ATTENTION REQUIRED ]';
        statusPillEl.className = 'status-pill critical';
      }
    }

    if (creditsSumEl) creditsSumEl.textContent = stats.totalCredits;
    if (pointsSumEl) pointsSumEl.textContent = stats.totalPoints.toFixed(1);

    if (progressFillEl) {
      const pct = Math.min(100, Math.max(0, (stats.sgpa / 10.0) * 100));
      progressFillEl.style.width = `${pct}%`;
    }

    if (statCreditsEl) statCreditsEl.textContent = `${stats.totalCredits} CR`;
    if (statPointsEl) statPointsEl.textContent = `${stats.totalPoints.toFixed(1)} PTS`;

    if (statJumpTitleEl) {
      if (stats.easiestJump) {
        statJumpTitleEl.textContent = `${stats.easiestJump.code} (+${stats.easiestJump.marginNeeded.toFixed(2)})`;
      } else {
        statJumpTitleEl.textContent = 'NONE';
      }
    }

    if (statJumpDescEl) {
      statJumpDescEl.textContent = stats.jumpBoostText;
    }

    const breakdownEl = document.getElementById('cgpaSemesterBreakdown');
    if (breakdownEl) {
      breakdownEl.innerHTML = stats.semesterBreakdown.map(row => `
        <span class="cgpa-semester-chip ${row.sem.id === this.currentSemesterId ? 'is-current' : ''}">
          <span>${this.escapeHtml(row.sem.name.toUpperCase())}</span>
          <strong>${row.gpa.toFixed(2)}</strong>
          <span class="cgpa-semester-chip-cr">${row.credits} CR</span>
        </span>
      `).join('');
      breakdownEl.style.display = stats.semesterBreakdown.length > 0 ? 'flex' : 'none';
    }

    // Render Grade Distribution Chips
    this.renderGradeDistributionBar(stats.gradeDistribution);

    // Render Cutoff Cards
    this.renderCutoffCards();
  }

  renderGradeDistributionBar(dist) {
    const barEl = document.getElementById('gradeDistributionBar');
    if (!barEl) return;

    let html = `<span style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);font-weight:700;">// GRADE SUMMARY:</span>`;
    const levels = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    levels.forEach(g => {
      const count = dist[g] || 0;
      html += `
        <div class="grade-dist-chip ${count > 0 ? 'active' : ''}">
          <span>GR ${g} [${this.getGradeLetter(g)}]:</span>
          <span class="grade-dist-count">${count}</span>
        </div>
      `;
    });
    barEl.innerHTML = html;
  }

  renderCutoffCards() {
    const container = document.getElementById('cutoffCoursesContainer');
    if (!container) return;

    if (this.courses.length === 0) {
      container.innerHTML = `
        <div class="cgpa-empty-state tactical-card-corners">
          <span class="hud-corner-crosshair tl"></span>
          <span class="hud-corner-crosshair tr"></span>
          <span class="hud-corner-crosshair bl"></span>
          <span class="hud-corner-crosshair br"></span>
          <div class="cgpa-empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <h3 class="cgpa-empty-state-title">// NO SUBJECTS ENROLLED IN DASHBOARD</h3>
          <p class="cgpa-empty-state-desc">
            Your CGPA and Grade Cutoff Matrix automatically derives <strong>marks</strong>, <strong>course name</strong>, and <strong>credit per course</strong> directly from the subjects you enroll on the dashboard.
          </p>

          <div style="font-family:var(--font-mono);font-size:10.5px;color:var(--text-muted);margin-bottom:12px;letter-spacing:0.08em;">
            QUICK ENROLL FIRST-YEAR SUBJECTS WITH CROWD-SOURCED CUTOFFS:
          </div>

          <div class="cgpa-preset-enroll-grid">
            <button type="button" class="preset-enroll-btn" data-preset="CML1001">+ CML1001 (3 CR)</button>
            <button type="button" class="preset-enroll-btn" data-preset="CML1002">+ CML1002 (3 CR)</button>
            <button type="button" class="preset-enroll-btn" data-preset="MTL1001">+ MTL1001 (4 CR)</button>
            <button type="button" class="preset-enroll-btn" data-preset="ELL1000">+ ELL1000 (4 CR)</button>
            <button type="button" class="preset-enroll-btn" data-preset="CMP1000">+ CMP1000 (2 CR)</button>
            <button type="button" class="preset-enroll-btn" data-preset="PYP1000">+ PYP1000 (2 CR)</button>
            <button type="button" class="preset-enroll-btn" data-preset="MEP1001">+ MEP1001 (2 CR)</button>
            <button type="button" class="preset-enroll-btn" data-preset="PYL1001">+ PYL1001 (3 CR)</button>
            <button type="button" class="preset-enroll-btn" data-preset="COL1000">+ COL1000 (4 CR)</button>
            <button type="button" class="preset-enroll-btn" data-preset="MEP1000">+ MEP1000 (2 CR)</button>
          </div>

          <button class="tactical-btn primary" id="openAddCourseFromEmptyBtn" style="margin-top:10px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>+ ENROLL NEW SUBJECT</span>
          </button>
        </div>
      `;
      return;
    }

    const query = (this.cutoffFilterQuery || '').trim().toLowerCase();
    const filtered = this.courses.filter(c => {
      if (!query) return true;
      return c.code.toLowerCase().includes(query) || c.title.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="padding:40px;text-align:center;background:var(--bg-surface-1);border:1px dashed var(--border-mid);font-family:var(--font-mono);color:var(--text-mid);">
          NO ENROLLED SUBJECTS MATCHING "${this.cutoffFilterQuery.toUpperCase()}" // CLEAR SEARCH TO VIEW ALL
        </div>
      `;
      return;
    }

    const gradeLevels = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

    const cutoffCardHtml = course => {
      this.ensureCourseCutoffs(course);
      const stats = this.calculateCourseStats(course);
      const autoScore = parseFloat(stats.maxPossibleScore.toFixed(1));
      const isOverridden = course.scoreOverride !== undefined && course.scoreOverride !== null && course.scoreOverride !== '';
      const activeScore = isOverridden ? parseFloat(course.scoreOverride) : autoScore;
      const gradeInfo = course.computedGrade || this.calculateCourseGrade(course);
      const verifiedSet = new Set(course.verifiedGrades || []);
      const locked = this.isCourseLocked(course);
      const dis = locked ? 'disabled' : '';

      // Delta to higher and lower
      let marginStripHtml = '';
      if (gradeInfo.assignedGrade === 10) {
        marginStripHtml = `
          <div class="margin-text-item">
            <span>★ <strong style="color:var(--neon-volt)">GRADE 10 [A] ACHIEVED</strong> (Marks: ${activeScore.toFixed(1)} / Cutoff: ${gradeInfo.currentCutoff})</span>
          </div>
          <div class="margin-text-item">
            <span>▼ Cushion above Grade 9 (${course.cutoffs[9] || 0}): <strong style="color:var(--neon-volt)">+${(activeScore - (course.cutoffs[9] || 0)).toFixed(2)} pts buffer</strong></span>
          </div>
        `;
      } else {
        marginStripHtml = `
          <div class="margin-text-item">
            <span>▲ TARGET GRADE ${gradeInfo.nextHigherGrade} [${this.getGradeLetter(gradeInfo.nextHigherGrade)}]: <strong style="color:var(--neon-cyan)">${gradeInfo.marginToHigher.toFixed(2)} pts needed</strong> (Cutoff: ${gradeInfo.nextCutoff})</span>
          </div>
          <div class="margin-text-item">
            <span>▼ Cushion above current floor [${gradeInfo.assignedGrade}]: <strong style="color:var(--neon-volt)">+${gradeInfo.marginToLower.toFixed(2)} pts</strong> (Cutoff: ${gradeInfo.currentCutoff})</span>
          </div>
        `;
      }

      // 11 column cutoffs
      const cutoffColsHtml = gradeLevels.map(g => {
        const isCurrent = gradeInfo.assignedGrade === g;
        const isVerified = verifiedSet.has(g);
        const cutoffVal = course.cutoffs[g] !== undefined ? course.cutoffs[g] : 0;
        const diff = activeScore - cutoffVal;

        let deltaClass = 'behind';
        let deltaText = `${diff.toFixed(2)}`;
        if (diff > 0) {
          deltaClass = 'ahead';
          deltaText = `+${diff.toFixed(2)}`;
        } else if (diff === 0) {
          deltaClass = 'exact';
          deltaText = `0.00`;
        }

        return `
          <div class="cutoff-grade-col ${isCurrent ? 'current-grade-highlight' : ''} ${isVerified ? 'verified-cutoff' : ''}" title="${isVerified ? 'Crowd-Sourced IITD Student Response' : 'Configurable Threshold'}">
            <div class="cutoff-grade-badge">
              <span>${g}</span>
              <span class="cutoff-letter-sub">${this.getGradeLetter(g)}</span>
              ${isVerified ? '<span class="verified-star" title="Crowd-Sourced IITD Data">★</span>' : ''}
            </div>
            <input 
              type="number" 
              step="0.01" 
              class="cutoff-val-input" 
              data-course-id="${course.id}" 
              data-grade="${g}" 
              value="${cutoffVal}" 
            />
            <div class="cutoff-delta-label ${deltaClass}">
              ${deltaText}
            </div>
          </div>
        `;
      }).join('');

      const stripTone = gradeInfo.assignedGrade >= 9 ? 'volt' : gradeInfo.assignedGrade >= 8 ? 'cyan' : gradeInfo.assignedGrade >= 6 ? 'amber' : 'crimson';

      return `
        <div class="cutoff-course-card tactical-card-corners ${locked ? 'is-locked' : ''}" data-course-id="${course.id}">
          <span class="hud-corner-crosshair tl"></span>
          <span class="hud-corner-crosshair tr"></span>
          <span class="hud-corner-crosshair bl"></span>
          <span class="hud-corner-crosshair br"></span>

          <!-- Topbar (NO CHECKBOXES - DIRECT FROM ENROLLED SUBJECT) -->
          <div class="cutoff-course-topbar">
            <div class="cutoff-course-identity">
              <div class="cutoff-course-badges">
                <span class="course-code-pill">${course.code}</span>
                <span class="course-credits-badge">[ ${course.credits} CREDITS ]</span>
                <span class="course-synced-pill" title="Derived directly from your dashboard">[ENROLLED SUBJECT]</span>
                ${this.lockPillHtml(course)}
              </div>
              <h3 class="cutoff-course-name">${course.title.toUpperCase()}</h3>
              <button class="btn-micro jump-course-hud-btn" data-course-id="${course.id}" title="Open this subject's detailed marks & assessment roster">
                OPEN ASSESSMENT HUD →
              </button>
              ${this.lockToggleBtnHtml(course, 'micro')}
            </div>

            <div class="cutoff-course-inputs-group">
              <div class="input-labeled-cell">
                <label>COURSE CREDITS</label>
                <div class="credits-input-wrap">
                  <input type="number" min="1" max="10" step="1" value="${course.credits}" class="course-credits-input" data-course-id="${course.id}" title="${locked ? 'Course locked' : 'Edit course credits (weights in CGPA)'}" ${dis} />
                  <span>CR</span>
                </div>
              </div>

              <div class="input-labeled-cell score-cell">
                <div class="score-label-row">
                  <label>MARKS / SCORE</label>
                  ${isOverridden && !locked ? `
                    <button class="sync-dashboard-btn" data-course-id="${course.id}" title="Revert to auto-calculated dashboard score">RESET AUTO (${autoScore}%)</button>
                  ` : `
                    <span style="font-size:9.5px;color:var(--neon-volt);">${isOverridden ? '[MANUAL SCORE]' : `[AUTO: ${autoScore}%]`}</span>
                  `}
                </div>
                <div class="score-input-wrap">
                  <input type="number" min="0" max="${course.maxMarks || 100}" step="0.1" value="${activeScore}" placeholder="Score" class="course-score-input" data-course-id="${course.id}" title="${locked ? 'Course locked. Unlock to edit marks.' : 'Marks from dashboard (edit to simulate different scores)'}" ${dis} />
                  <span>/ ${course.maxMarks || 100}</span>
                </div>
                <div class="score-eval-subtext">
                  ${stats.totalWeightCompleted > 0 ? `${stats.totalWeightCompleted}% evaluated (${stats.totalEarned.toFixed(1)} pts earned)` : '100% pending (assumed full)'}
                </div>
              </div>

              <div class="grade-result-cell grade-accent-${gradeInfo.assignedGrade}">
                <div class="grade-result-label">ASSIGNED GRADE</div>
                <div class="grade-result-value">${gradeInfo.assignedGrade} <span class="grade-letter">(${gradeInfo.letterGrade})</span></div>
                <div class="grade-points-sub">${(gradeInfo.assignedGrade * course.credits).toFixed(1)} PTS (${course.credits} CR)</div>
              </div>
            </div>
          </div>

          <!-- Margin Strip -->
          <div class="cutoff-margin-strip ${stripTone}">
            <div class="margin-strip-content">
              ${marginStripHtml}
            </div>
            <div class="course-grade-meter">
              <div class="course-grade-meter-fill" style="width: ${gradeInfo.relativePositionPct}%;"></div>
            </div>
          </div>

          <!-- Cutoff Inputs Grid -->
          <div class="cutoff-grid-wrapper">
            <div class="cutoff-grid-header">
              <span class="grid-title">// EDITABLE GRADE CUTOFFS (10 DOWN TO 0)</span>
              <div class="grid-tools">
                <span class="verified-legend"><span class="verified-dot"></span> Crowd-Sourced Responses</span>
                <button class="btn-micro reset-course-btn" data-course-id="${course.id}" title="Reset cutoffs to crowd-sourced baseline">RESET CUTOFFS</button>
                ${locked ? '' : `<button class="btn-micro danger-micro delete-cutoff-course-btn" data-course-id="${course.id}" title="Remove this course from enrolled dashboard subjects">REMOVE</button>`}
              </div>
            </div>

            <div class="cutoff-inputs-grid">
              ${cutoffColsHtml}
            </div>
          </div>
        </div>
      `;
    };

    const cardsHtml = this.semesters.map(sem => {
      const semCourses = filtered.filter(c => c.semesterId === sem.id);
      if (semCourses.length === 0) return '';
      const gpa = this.calculateGpa(this.getSemesterCourses(sem.id));
      return `
        <div class="cutoff-semester-header ${sem.id === this.currentSemesterId ? 'is-current' : ''}">
          <span class="cutoff-semester-name">${this.escapeHtml(sem.name.toUpperCase())}</span>
          ${sem.id === this.currentSemesterId ? '<span class="semester-current-pill">CURRENT</span>' : ''}
          <span class="cutoff-semester-meta">${gpa.credits} CR • SGPA <strong>${gpa.gpa.toFixed(2)}</strong></span>
        </div>
        ${semCourses.map(cutoffCardHtml).join('')}
      `;
    }).join('');

    container.innerHTML = cardsHtml;
  }

  updateCutoffValue(courseId, grade, val) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;

    this.ensureCourseCutoffs(course);
    const parsed = parseFloat(val);
    course.cutoffs[grade] = !isNaN(parsed) ? parsed : 0;
    this.saveCourses();
    this.renderCgpaSection();
    window.sfx.playInputTick();
  }

  updateCourseUserScore(courseId, scoreVal) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;
    if (this.blockIfLocked(course)) { this.renderCgpaSection(); return; }

    course.scoreOverride = scoreVal !== '' && !isNaN(scoreVal) ? parseFloat(scoreVal) : null;
    this.saveCourses();
    this.renderCgpaSection();
    window.sfx.playInputTick();
  }

  updateCourseCredits(courseId, creditsVal) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;
    if (this.blockIfLocked(course)) { this.renderCgpaSection(); return; }

    course.credits = Math.max(1, parseInt(creditsVal) || 1);
    this.saveCourses();
    this.renderCourseTabs();
    this.renderCgpaSection();
    window.sfx.playInputTick();
  }

  syncFromDashboard(courseId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;
    if (this.blockIfLocked(course)) { this.renderCgpaSection(); return; }

    delete course.scoreOverride;
    this.saveCourses();
    this.renderCgpaSection();
    this.showToast(`SYNCED ${course.code} TO AUTO-CALCULATED MARKS`);
    window.sfx.playSuccess();
  }

  resetCourseCutoffs(courseId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;

    const baseline = OFFICIAL_COURSE_CUTOFFS.find(o => o.code === course.code.toUpperCase());
    if (baseline) {
      course.cutoffs = JSON.parse(JSON.stringify(baseline.cutoffs));
      course.verifiedGrades = [...baseline.verifiedGrades];
      course.maxMarks = baseline.maxMarks;
    } else {
      course.cutoffs = {
        10: 82.0, 9: 72.0, 8: 62.0, 7: 52.0, 6: 42.0, 5: 35.0, 4: 30.0, 3: 25.0, 2: 20.0, 1: 15.0, 0: 0.0
      };
      course.verifiedGrades = [];
      course.maxMarks = 100;
    }
    if (!this.isCourseLocked(course)) delete course.scoreOverride;
    this.saveCourses();
    this.renderCgpaSection();
    this.showToast(`CUTOFFS RESET FOR ${course.code}`);
    window.sfx.playClick();
  }

  resetAllCutoffs() {
    if (confirm('Reset all enrolled course cutoffs to crowd-sourced baselines? Any custom cutoffs you edited will be restored.')) {
      this.courses.forEach(course => {
        const baseline = OFFICIAL_COURSE_CUTOFFS.find(o => o.code === course.code.toUpperCase());
        if (baseline) {
          course.cutoffs = JSON.parse(JSON.stringify(baseline.cutoffs));
          course.verifiedGrades = [...baseline.verifiedGrades];
          course.maxMarks = baseline.maxMarks;
        } else {
          course.cutoffs = {
            10: 82.0, 9: 72.0, 8: 62.0, 7: 52.0, 6: 42.0, 5: 35.0, 4: 30.0, 3: 25.0, 2: 20.0, 1: 15.0, 0: 0.0
          };
          course.verifiedGrades = [];
          course.maxMarks = 100;
        }
        if (!this.isCourseLocked(course)) delete course.scoreOverride;
      });
      this.saveCourses();
      this.renderCgpaSection();
      this.showToast('ALL ENROLLED CUTOFFS RESTORED TO CROWD-SOURCED BASELINES');
      window.sfx.playWarning();
    }
  }

  enrollPresetCourse(code, semesterId = this.currentSemesterId) {
    const cleanCode = (code || '').trim().toUpperCase();
    const preset = COURSE_PRESETS[cleanCode];
    if (!preset) return;

    if (this.courses.some(c => c.semesterId === semesterId && c.code.toUpperCase() === cleanCode)) {
      this.showToast(`SUBJECT ${cleanCode} ALREADY ENROLLED IN ${this.semesterName(semesterId).toUpperCase()}`);
      return;
    }

    const official = OFFICIAL_COURSE_CUTOFFS.find(o => o.code === cleanCode);
    const cutoffs = official ? JSON.parse(JSON.stringify(official.cutoffs)) : {
      10: 82.0, 9: 72.0, 8: 62.0, 7: 52.0, 6: 42.0, 5: 35.0, 4: 30.0, 3: 25.0, 2: 20.0, 1: 15.0, 0: 0.0
    };

    const newId = cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Date.now();
    const newCourse = {
      id: newId,
      code: preset.code,
      title: preset.title,
      credits: preset.credits,
      target: preset.target || 85.0,
      assessments: JSON.parse(JSON.stringify(preset.assessments)),
      cutoffs: cutoffs,
      verifiedGrades: official ? [...official.verifiedGrades] : [],
      maxMarks: official ? official.maxMarks : 100,
      semesterId
    };

    this.courses.push(newCourse);
    this.saveCourses();
    this.render();
    this.showToast(`ENROLLED ${cleanCode} // MARKS & CUTOFFS ONLINE`);
    window.sfx.playSuccess();
  }

  // semesterId: the semester to preselect. Defaults to the open course's
  // semester when viewing one, otherwise the current semester.
  openAddCourseModal(semesterId) {
    const modalOverlay = document.getElementById('addCourseModal');
    if (!modalOverlay) return;
    let target = semesterId && this.getSemester(semesterId) ? semesterId : null;
    if (!target && this.activeCourseId !== 'home' && this.activeCourseId !== 'cgpa') {
      const active = this.courses.find(c => c.id === this.activeCourseId);
      if (active) target = active.semesterId;
    }
    const select = document.getElementById('newCourseSemester');
    if (select) select.innerHTML = this.semesterOptionsHtml(target || this.currentSemesterId);
    modalOverlay.classList.add('active');
    if (window.sfx) window.sfx.playClick();
  }

  closeAddCourseModal() {
    const modalOverlay = document.getElementById('addCourseModal');
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      window.sfx.playClick();
    }
  }

  bindEvents() {
    // Target Slider and Inputs
    const targetSlider = document.getElementById('targetScoreSlider');
    let lastTargetVal = targetSlider ? parseFloat(targetSlider.value) : 85;
    if (targetSlider) {
      targetSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (Math.abs(val - lastTargetVal) >= 1) {
          window.sfx.playScrollClick(val > lastTargetVal ? 1 : -1);
          lastTargetVal = val;
        }
        this.updateTargetScore(val);
      });
    }

    this.setupCourseDragAndDrop();

    // Delegated click listeners
    document.addEventListener('click', (e) => {
      // Course marks lock toggle (banner, home cards, cutoff cards)
      const lockBtn = e.target.closest('.lock-toggle-btn');
      if (lockBtn) {
        e.stopPropagation();
        this.toggleCourseLock(lockBtn.dataset.lockId || this.getActiveCourse()?.id);
        return;
      }

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

      // Home Cockpit & CGPA Tab - Add Course Button or Empty State Action
      const addCard = e.target.closest('.home-add-card');
      if (addCard) {
        this.openAddCourseModal(addCard.dataset.semesterId);
        return;
      }
      if (
        e.target.closest('#homeAddCourseBtn') || 
        e.target.closest('#cgpaAddSubjectBtn') ||
        e.target.closest('#openAddCourseFromEmptyBtn')
      ) {
        this.openAddCourseModal();
        return;
      }

      // Semester controls
      if (e.target.closest('#addSemesterBtn')) {
        this.addSemester();
        return;
      }
      const semToggle = e.target.closest('.semester-toggle-btn');
      if (semToggle) {
        this.toggleSemesterCollapsed(semToggle.dataset.semesterToggle);
        return;
      }
      const semCurrentBtn = e.target.closest('.semester-set-current-btn');
      if (semCurrentBtn) {
        this.setCurrentSemester(semCurrentBtn.dataset.semesterId);
        return;
      }
      const semRenameBtn = e.target.closest('.semester-rename-btn');
      if (semRenameBtn) {
        this.renameSemester(semRenameBtn.dataset.semesterId);
        return;
      }
      const semDeleteBtn = e.target.closest('.semester-delete-btn');
      if (semDeleteBtn) {
        this.deleteSemester(semDeleteBtn.dataset.semesterId);
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

      // Jump to CGPA View
      if (e.target.closest('#homeJumpCgpaBtn')) {
        this.setActiveCourse('cgpa');
        return;
      }

      // Reset All Cutoffs
      if (e.target.closest('#resetAllCutoffsBtn')) {
        this.resetAllCutoffs();
        return;
      }

      // Quick Enroll Preset from CGPA Empty State
      const presetEnrollBtn = e.target.closest('.preset-enroll-btn');
      if (presetEnrollBtn) {
        this.enrollPresetCourse(presetEnrollBtn.dataset.preset);
        return;
      }

      // Jump to Course Telemetry HUD from Cutoff Card
      const jumpCourseHudBtn = e.target.closest('.jump-course-hud-btn');
      if (jumpCourseHudBtn) {
        this.setActiveCourse(jumpCourseHudBtn.dataset.courseId);
        return;
      }

      // Reset Individual Course Cutoffs
      const resetCourseBtn = e.target.closest('.reset-course-btn');
      if (resetCourseBtn) {
        this.resetCourseCutoffs(resetCourseBtn.dataset.courseId);
        return;
      }

      // Delete / Remove Course from Dashboard
      const delCutoffBtn = e.target.closest('.delete-cutoff-course-btn');
      if (delCutoffBtn) {
        this.deleteCourse(delCutoffBtn.dataset.courseId);
        return;
      }

      // Sync Score from Active Dashboard Course
      const syncBtn = e.target.closest('.sync-dashboard-btn');
      if (syncBtn) {
        this.syncFromDashboard(syncBtn.dataset.courseId);
        return;
      }
    });

    // Input changes on scores, weights, subsections, and cutoffs
    document.addEventListener('input', (e) => {
      // Cutoff Course Search Filter
      if (e.target.id === 'cutoffSearchInput') {
        this.cutoffFilterQuery = e.target.value.trim().toLowerCase();
        this.renderCutoffCards();
        return;
      }

      // Course Score Input in Cutoff Matrix
      if (e.target.classList.contains('course-score-input')) {
        const id = e.target.dataset.courseId;
        this.updateCourseUserScore(id, e.target.value);
        return;
      }

      // Course Credits Input in Cutoff Matrix
      if (e.target.classList.contains('course-credits-input')) {
        const id = e.target.dataset.courseId;
        this.updateCourseCredits(id, e.target.value);
        return;
      }

      // Grade Cutoff Margin Input (10 down to 0)
      if (e.target.classList.contains('cutoff-val-input')) {
        const id = e.target.dataset.courseId;
        const grade = parseInt(e.target.dataset.grade);
        this.updateCutoffValue(id, grade, e.target.value);
        return;
      }

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
        const prevVal = e.target._lastVal !== undefined ? e.target._lastVal : val;
        if (Math.abs(val - prevVal) >= 1) {
          window.sfx.playScrollClick(val > prevVal ? 1 : -1);
          e.target._lastVal = val;
        }
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
        this.openAddCourseModal();
      });
    }

    // Move a course to another semester (single course banner)
    document.addEventListener('change', (e) => {
      if (e.target.classList && e.target.classList.contains('semester-move-select')) {
        this.moveCourseToSemester(e.target.dataset.courseId, e.target.value);
      }
    });

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
        const semSelect = document.getElementById('newCourseSemester');
        const semesterId = semSelect && this.getSemester(semSelect.value) ? semSelect.value : this.currentSemesterId;

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
          assessments,
          semesterId
        };
        this.ensureCourseCutoffs(newCourse);

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
        if (this.blockIfLocked(this.getActiveCourse())) return;
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
        // Object form keeps semester names; older versions of the app read `courses` from it too
        const payload = {
          version: 2,
          semesters: this.semesters,
          currentSemesterId: this.currentSemesterId,
          activeCourseId: this.activeCourseId,
          courses: this.courses
        };
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
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

    // Upload / Import Telemetry JSON
    const uploadBtn = document.getElementById('uploadDataBtn');
    const uploadInput = document.getElementById('uploadJsonInput');
    if (uploadBtn && uploadInput) {
      uploadBtn.addEventListener('click', () => {
        uploadInput.click();
        window.sfx.playClick();
      });

      uploadInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          this.handleJsonUpload(file);
          uploadInput.value = '';
        }
      });

      // Drag and drop support on upload button
      uploadBtn.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBtn.classList.add('drag-over');
      });
      uploadBtn.addEventListener('dragleave', () => {
        uploadBtn.classList.remove('drag-over');
      });
      uploadBtn.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBtn.classList.remove('drag-over');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.handleJsonUpload(e.dataTransfer.files[0]);
        }
      });
    }

    // Reset to Default Baseline
    const resetBtn = document.getElementById('resetDataBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const lockedCount = this.courses.filter(c => this.isCourseLocked(c)).length;
        const lockedNote = lockedCount > 0 ? ` This includes ${lockedCount} locked course(s).` : '';
        if (confirm(`Reset dashboard to fresh baseline? All subjects and telemetry will be cleared.${lockedNote}`)) {
          this.courses = [];
          this.semesters = [{ id: DEFAULT_SEMESTER_ID, name: DEFAULT_SEMESTER_NAME }];
          this.currentSemesterId = DEFAULT_SEMESTER_ID;
          this.collapsedSemesters.clear();
          this.saveCollapsedSemesters();
          this.activeCourseId = 'home';
          this.saveCourses();
          this.render();
          this.showToast('SYSTEM RESET TO EMPTY BASELINE');
          window.sfx.playWarning();
          this.openAddCourseModal();
        }
      });
    }

    // Footer Reset Purge Trigger
    const footerResetBtn = document.getElementById('footerResetTrigger');
    if (footerResetBtn) {
      footerResetBtn.addEventListener('click', () => {
        const resetBtn = document.getElementById('resetDataBtn');
        if (resetBtn) resetBtn.click();
      });
    }

  }

  handleJsonUpload(file) {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json') && file.type && file.type !== 'application/json') {
      this.showToast('ERROR: PLEASE SELECT A .JSON FILE');
      window.sfx.playWarning();
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        if (!content || !content.trim()) {
          this.showToast('ERROR: JSON FILE IS EMPTY');
          window.sfx.playWarning();
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(content);
        } catch (parseErr) {
          console.error('JSON parse error:', parseErr);
          this.showToast('ERROR: INVALID JSON SYNTAX');
          window.sfx.playWarning();
          return;
        }

        let importedCourses = null;
        let importedActiveId = null;
        let importedSemesters = null;
        let importedCurrentSemesterId = null;

        if (Array.isArray(parsed)) {
          importedCourses = parsed;
        } else if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.courses)) {
            importedCourses = parsed.courses;
            if (parsed.activeCourseId) {
              importedActiveId = parsed.activeCourseId;
            }
            if (Array.isArray(parsed.semesters)) {
              importedSemesters = parsed.semesters;
            }
            if (typeof parsed.currentSemesterId === 'string') {
              importedCurrentSemesterId = parsed.currentSemesterId;
            }
          } else if (Array.isArray(parsed.telemetry)) {
            importedCourses = parsed.telemetry;
          } else if (parsed.code || parsed.assessments) {
            importedCourses = [parsed];
          } else {
            const vals = Object.values(parsed);
            if (vals.length > 0 && vals.every(v => v && typeof v === 'object' && (v.code || v.assessments || v.title))) {
              importedCourses = vals;
            }
          }
        }

        if (!importedCourses || !Array.isArray(importedCourses) || importedCourses.length === 0) {
          this.showToast('ERROR: NO RECOGNIZED COURSE DATA IN JSON');
          window.sfx.playWarning();
          return;
        }

        // Sanitize and validate every course and its assessments
        const sanitized = importedCourses.map((c, idx) => {
          const code = String(c.code || `COURSE_${idx + 1}`).trim().toUpperCase();
          const title = String(c.title || code).trim();
          const credits = Math.max(1, Math.min(10, parseInt(c.credits) || 3));
          const target = Math.max(0, Math.min(100, parseFloat(c.target) || 85.0));
          const id = c.id && typeof c.id === 'string'
            ? c.id
            : `${code.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now()}_${idx}`;

          let assessments = Array.isArray(c.assessments) ? c.assessments : [];
          if (assessments.length === 0 && COURSE_PRESETS[code]) {
            assessments = JSON.parse(JSON.stringify(COURSE_PRESETS[code].assessments));
          }

          const cleanAssessments = assessments.map((a, aIdx) => {
            const aId = a.id && typeof a.id === 'string' ? a.id : `comp_${Date.now()}_${aIdx}`;
            const aName = String(a.name || `Assessment ${aIdx + 1}`).trim();
            const weight = Math.max(0, parseFloat(a.weight) || 10);
            const total = a.total !== null && a.total !== undefined && !isNaN(a.total) && parseFloat(a.total) > 0 
              ? parseFloat(a.total) 
              : weight;
            const achieved = a.achieved !== null && a.achieved !== undefined && !isNaN(a.achieved) && a.achieved !== ''
              ? parseFloat(a.achieved) 
              : null;
            const date = String(a.date || 'Throughout Semester').trim();
            const hasSubitems = Boolean(a.hasSubitems && Array.isArray(a.subitems) && a.subitems.length > 0);

            let subitems = [];
            if (hasSubitems) {
              subitems = a.subitems.map((sub, sIdx) => ({
                id: sub.id && typeof sub.id === 'string' ? sub.id : `sub_${Date.now()}_${sIdx}`,
                name: String(sub.name || `Part ${sIdx + 1}`).trim(),
                weight: Math.max(0, parseFloat(sub.weight) || (weight / a.subitems.length)),
                achieved: sub.achieved !== null && sub.achieved !== undefined && !isNaN(sub.achieved) && sub.achieved !== ''
                  ? parseFloat(sub.achieved)
                  : null,
                total: sub.total !== null && sub.total !== undefined && !isNaN(sub.total) && parseFloat(sub.total) > 0
                  ? parseFloat(sub.total)
                  : 10
              }));
            }

            const itemObj = {
              id: aId,
              name: aName,
              weight,
              achieved,
              total,
              date,
              hasSubitems,
              subitems
            };

            if (hasSubitems) {
              this.recalculateParentScore(itemObj);
            }
            return itemObj;
          });

          const courseObj = {
            id,
            code,
            title,
            credits,
            target,
            assessments: cleanAssessments
          };

          if (c.locked) {
            courseObj.locked = true;
          }
          if (typeof c.semesterId === 'string') {
            courseObj.semesterId = c.semesterId;
          }
          if (typeof c.semester === 'string' || typeof c.semester === 'number') {
            courseObj.semester = c.semester;
          }

          if (c.cutoffs && typeof c.cutoffs === 'object') {
            courseObj.cutoffs = { ...c.cutoffs };
          }
          if (Array.isArray(c.verifiedGrades)) {
            courseObj.verifiedGrades = [...c.verifiedGrades];
          }
          if (c.maxMarks) {
            courseObj.maxMarks = parseFloat(c.maxMarks);
          }
          if (c.userScore !== undefined && c.userScore !== null) {
            courseObj.userScore = parseFloat(c.userScore);
          }

          this.ensureCourseCutoffs(courseObj);
          return courseObj;
        });

        if (sanitized.length === 0) {
          this.showToast('ERROR: NO VALID COURSES EXTRACTED');
          window.sfx.playWarning();
          return;
        }

        // Files exported before semesters existed carry no semester info:
        // keep the current semesters and put those courses in the current one.
        const semesterState = this.reconcileSemesters(
          importedSemesters || this.semesters,
          sanitized,
          importedSemesters ? importedCurrentSemesterId : this.currentSemesterId
        );

        const countStr = sanitized.length === 1 ? '1 course' : `${sanitized.length} courses`;
        if (this.courses.length > 0) {
          const lockedCount = this.courses.filter(c => this.isCourseLocked(c)).length;
          const lockedNote = lockedCount > 0 ? ` ${lockedCount} locked course(s) will also be replaced.` : '';
          if (!confirm(`Import ${countStr} from JSON? This will replace your current active courses.${lockedNote}`)) {
            return;
          }
        }

        this.courses = sanitized;
        this.semesters = semesterState.semesters;
        this.currentSemesterId = semesterState.currentSemesterId;
        if (importedActiveId && this.courses.some(c => c.id === importedActiveId)) {
          this.activeCourseId = importedActiveId;
        } else if (this.activeCourseId === 'home' || this.activeCourseId === 'cgpa') {
          // preserve home or cgpa active view
        } else if (this.courses.length > 0) {
          this.activeCourseId = this.courses[0].id;
        } else {
          this.activeCourseId = 'home';
        }

        this.saveCourses();
        localStorage.setItem(INITIALIZED_KEY, 'true');
        this.render();
        const semUsed = new Set(sanitized.map(c => c.semesterId)).size;
        this.showToast(`TELEMETRY LOADED // ${sanitized.length} SUBJECT(S) IN ${semUsed} SEMESTER(S)`);
        window.sfx.playSuccess();
      } catch (err) {
        console.error('Failed to import JSON telemetry:', err);
        this.showToast('ERROR: FAILED TO PROCESS JSON FILE');
        window.sfx.playWarning();
      }
    };

    reader.onerror = () => {
      this.showToast('ERROR: COULD NOT READ FILE');
      window.sfx.playWarning();
    };

    reader.readAsText(file);
  }

  deleteCourse(courseId) {
    const course = this.courses.find(c => c.id === courseId);
    if (this.blockIfLocked(course)) return;
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
