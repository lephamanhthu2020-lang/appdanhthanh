import { 
  StudentProfile, 
  TopicCompetency, 
  MasteryLevel, 
  GeneratedWorksheet, 
  CompetitionEvidenceData,
  LessonTopic,
  QuestionItem,
  TextbookMaterial,
  AssignedTask,
  TaskSubmission,
  CurriculumLesson,
  LessonStatus
} from '../types';
import { INITIAL_STUDENT_PROFILE, DEMO_EVIDENCE_DATA } from '../data/demoStudents';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { ALL_GRADE_2_LESSONS } from '../data/grade2CurriculumCatalog';

const STORAGE_KEYS = {
  STUDENT_PROFILE: 'vd_smart_ai_student_profile',
  TEACHER_WORKSHEETS: 'vd_smart_ai_teacher_worksheets',
  EVIDENCE_DATA: 'vd_smart_ai_evidence_data',
  SETTINGS: 'vd_smart_ai_settings',
  TOPICS: 'vd_smart_ai_curriculum_topics',
  TEXTBOOK_MATERIALS: 'vd_smart_ai_textbook_materials',
  ASSIGNED_TASKS: 'vd_smart_ai_assigned_tasks',
  GRADE_2_LESSONS: 'vd_smart_ai_grade2_lessons',
  BACKUP_NON_G2: 'vd_smart_ai_non_g2_backup',
};

// Initial sample assigned task from Thầy Danh Thanh
const INITIAL_ASSIGNED_TASKS: AssignedTask[] = [
  {
    id: 'task-init-1',
    title: 'Bài tập tuần: Ôn tập phép nhân và bảng nhân 2, 5',
    targetClass: 'Lớp 2A',
    grade: 2,
    subject: 'math',
    assignedBy: 'Thầy Danh Thanh',
    createdAt: '22/10/2026',
    dueDate: '25/10/2026',
    note: 'Các em học sinh Lớp 2A đọc kỹ đề bài, tự giác tính toán không dùng máy tính cầm tay.',
    questions: [
      {
        id: 'task-q1',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-multdiv',
        format: 'multiple_choice',
        prompt: 'Mỗi bạn học sinh có 2 bàn tay. Hỏi 5 bạn học sinh có tất cả bao nhiêu bàn tay?',
        options: ['A. 10 bàn tay', 'B. 7 bàn tay', 'C. 12 bàn tay', 'D. 8 bàn tay'],
        correctAnswer: 'A. 10 bàn tay',
        solutionExplanation: 'Ta lấy 2 x 5 = 10 bàn tay.',
        cognitiveLevel: 'Vận dụng',
      },
      {
        id: 'task-q2',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-multdiv',
        format: 'fill_blank',
        prompt: 'Tính: 5 x 4 = ? (Nhập số)',
        correctAnswer: '20',
        solutionExplanation: '5 được lấy 4 lần: 5 + 5 + 5 + 5 = 20.',
        cognitiveLevel: 'Thông hiểu',
      },
      {
        id: 'task-q3',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-multdiv',
        format: 'multiple_choice',
        prompt: 'Bác Ba ở xã Vĩnh Điều đóng 15 kg cá linh vào 3 thùng đều nhau. Hỏi mỗi thùng có bao nhiêu kg cá linh?',
        options: ['A. 5 kg', 'B. 12 kg', 'C. 18 kg', 'D. 6 kg'],
        correctAnswer: 'A. 5 kg',
        solutionExplanation: 'Phép chia: 15 : 3 = 5 (kg).',
        cognitiveLevel: 'Vận dụng',
      }
    ],
    submissions: [
      {
        studentId: 'VD-2026-001',
        studentName: 'Trần Văn An',
        submittedAt: '22/10/2026 14:30',
        score: 3,
        total: 3,
        isPassed: true,
        notes: 'Làm bài xuất sắc, nắm chắc bài.'
      },
      {
        studentId: 'VD-2026-002',
        studentName: 'Lê Thị Bích',
        submittedAt: '22/10/2026 15:10',
        score: 2,
        total: 3,
        isPassed: true,
        notes: 'Sai câu 3, cần chú ý đọc kỹ dữ kiện đề bài.',
        wrongAnswers: [
          {
            questionPrompt: 'Bác Ba ở xã Vĩnh Điều đóng 15 kg cá linh...',
            studentAnswer: 'B. 12 kg',
            correctAnswer: 'A. 5 kg'
          }
        ]
      }
    ]
  }
];

export class StorageService {
  // 1. Topic and Question management
  public static getAllTopics(): LessonTopic[] {
    if (typeof window === 'undefined') return CURRICULUM_DATA;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TOPICS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(CURRICULUM_DATA));
        return CURRICULUM_DATA;
      }
      const storedTopics: LessonTopic[] = JSON.parse(raw);
      // Auto-merge: Ensure any new curriculum topics from updated data are present
      let hasChange = false;
      for (const curTopic of CURRICULUM_DATA) {
        const foundIndex = storedTopics.findIndex(t => t.id === curTopic.id);
        if (foundIndex === -1) {
          storedTopics.push(curTopic);
          hasChange = true;
        } else {
          // If stored topic has fewer questions than the default curriculum, merge missing questions
          const storedTopic = storedTopics[foundIndex];
          for (const q of curTopic.questions) {
            if (!storedTopic.questions.some(sq => sq.id === q.id)) {
              storedTopic.questions.push(q);
              hasChange = true;
            }
          }
        }
      }
      if (hasChange) {
        localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(storedTopics));
      }
      return storedTopics;
    } catch {
      return CURRICULUM_DATA;
    }
  }

  public static saveTopic(topic: LessonTopic): void {
    const list = this.getAllTopics();
    const idx = list.findIndex(t => t.id === topic.id);
    if (idx >= 0) {
      list[idx] = topic;
    } else {
      list.push(topic);
    }
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(list));
  }

  public static updateQuestion(topicId: string, updatedQ: QuestionItem): void {
    const list = this.getAllTopics();
    const topic = list.find(t => t.id === topicId);
    if (!topic) return;

    const qIdx = topic.questions.findIndex(q => q.id === updatedQ.id);
    if (qIdx >= 0) {
      topic.questions[qIdx] = updatedQ;
    } else {
      topic.questions.push(updatedQ);
    }
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(list));
  }

  public static addQuestionToTopic(topicId: string, newQ: QuestionItem): void {
    const list = this.getAllTopics();
    const topic = list.find(t => t.id === topicId);
    if (!topic) return;

    topic.questions.push(newQ);
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(list));
  }

  public static deleteQuestion(topicId: string, questionId: string): void {
    const list = this.getAllTopics();
    const topic = list.find(t => t.id === topicId);
    if (!topic) return;

    topic.questions = topic.questions.filter(q => q.id !== questionId);
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(list));
  }

  // 2. Student Profile
  public static getStudentProfile(): StudentProfile {
    if (typeof window === 'undefined') return INITIAL_STUDENT_PROFILE;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(INITIAL_STUDENT_PROFILE));
        return INITIAL_STUDENT_PROFILE;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_STUDENT_PROFILE;
    }
  }

  public static saveStudentProfile(profile: StudentProfile): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(profile));
    } catch (err) {
      console.error('Save profile error:', err);
    }
  }

  public static recordAnswer(
    questionId: string,
    isCorrect: boolean,
    errorType?: string
  ): StudentProfile {
    const profile = this.getStudentProfile();
    const topics = this.getAllTopics();
    const topic = topics.find(t => t.questions.some(q => q.id === questionId));

    profile.answeredRecords.push({
      questionId,
      subject: topic ? topic.subject : 'math',
      topicId: topic ? topic.id : 'unknown',
      isCorrect,
      timestamp: Date.now(),
      errorType,
    });

    if (isCorrect) {
      profile.stars += 5;
      if (!profile.completedQuestionIds.includes(questionId)) {
        profile.completedQuestionIds.push(questionId);
      }
    }

    this.saveStudentProfile(profile);
    return profile;
  }

  // 3. 4T Model Topic Competencies
  public static calculateTopicCompetencies(profile: StudentProfile): TopicCompetency[] {
    const list: TopicCompetency[] = [];
    const topics = this.getAllTopics();

    topics.forEach(topic => {
      const qIds = topic.questions.map(q => q.id);
      const records = profile.answeredRecords.filter(r => r.topicId === topic.id || qIds.includes(r.questionId));

      const totalAttempts = records.length;
      const correctAnswers = records.filter(r => r.isCorrect).length;

      let mastery = 0;
      if (totalAttempts > 0) {
        const accuracyRate = (correctAnswers / totalAttempts) * 80;
        const uniqueCompleted = topic.questions.filter(q => profile.completedQuestionIds.includes(q.id)).length;
        const coverageRate = topic.questions.length > 0 ? (uniqueCompleted / topic.questions.length) * 20 : 0;
        mastery = Math.min(100, Math.round(accuracyRate + coverageRate));
      }

      let masteryLevel: MasteryLevel;
      if (mastery >= 85) {
        masteryLevel = {
          score: mastery,
          label: 'Vững vàng',
          color: 'text-emerald-700',
          bgLight: 'bg-emerald-50 border-emerald-200',
        };
      } else if (mastery >= 70) {
        masteryLevel = {
          score: mastery,
          label: 'Đạt mục tiêu luyện tập',
          color: 'text-sky-700',
          bgLight: 'bg-sky-50 border-sky-200',
        };
      } else if (mastery >= 50) {
        masteryLevel = {
          score: mastery,
          label: 'Đang hình thành',
          color: 'text-amber-700',
          bgLight: 'bg-amber-50 border-amber-200',
        };
      } else {
        masteryLevel = {
          score: mastery,
          label: 'Cần hỗ trợ thêm',
          color: 'text-rose-700',
          bgLight: 'bg-rose-50 border-rose-200',
        };
      }

      const errorRecords = records.filter(r => !r.isCorrect && r.errorType);
      const topError = errorRecords.length > 0 ? errorRecords[errorRecords.length - 1].errorType : undefined;

      let aiRecommendation = 'Hãy bắt đầu khám phá chủ đề này cùng Mầm AI!';
      if (mastery >= 85) {
        aiRecommendation = 'Em đã làm chủ rất tốt kiến thức này! Có thể thử sức với các bài toán vận dụng nâng cao.';
      } else if (mastery >= 70) {
        aiRecommendation = 'Tiến bộ rõ rệt! Hãy luyện thêm 1-2 câu để đạt mức độ Vững vàng.';
      } else if (mastery >= 50) {
        aiRecommendation = topError ? `Lưu ý củng cố lỗi: "${topError}". Hãy xem lại ví dụ trực quan.` : 'Cần luyện tập thêm các câu cơ bản.';
      } else if (totalAttempts > 0) {
        aiRecommendation = 'Cần được hỗ trợ: Em hãy xem kỹ phần Khám phá kiến thức trước khi tiếp tục làm bài nhé!';
      }

      list.push({
        topicId: topic.id,
        topicTitle: topic.title,
        subject: topic.subject,
        grade: topic.grade,
        totalAttempts,
        correctAnswers,
        masteryPercentage: mastery,
        masteryLevel,
        topError,
        aiRecommendation,
      });
    });

    return list;
  }

  // 4. Worksheets created by teachers
  public static getTeacherWorksheets(): GeneratedWorksheet[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TEACHER_WORKSHEETS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public static saveTeacherWorksheet(ws: GeneratedWorksheet): void {
    const list = this.getTeacherWorksheets();
    list.unshift(ws);
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHER_WORKSHEETS, JSON.stringify(list));
    } catch (err) {
      console.error('Error saving worksheet:', err);
    }
  }

  // 5. Textbook Materials uploaded by teachers
  public static getTextbookMaterials(): TextbookMaterial[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TEXTBOOK_MATERIALS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public static saveTextbookMaterial(material: TextbookMaterial): void {
    const list = this.getTextbookMaterials();
    list.unshift(material);
    localStorage.setItem(STORAGE_KEYS.TEXTBOOK_MATERIALS, JSON.stringify(list));
  }

  // 6. Assigned Tasks & Submissions
  public static getAssignedTasks(): AssignedTask[] {
    if (typeof window === 'undefined') return INITIAL_ASSIGNED_TASKS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ASSIGNED_TASKS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.ASSIGNED_TASKS, JSON.stringify(INITIAL_ASSIGNED_TASKS));
        return INITIAL_ASSIGNED_TASKS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_ASSIGNED_TASKS;
    }
  }

  public static saveAssignedTask(task: AssignedTask): void {
    const list = this.getAssignedTasks();
    list.unshift(task);
    localStorage.setItem(STORAGE_KEYS.ASSIGNED_TASKS, JSON.stringify(list));
  }

  public static submitTask(taskId: string, submission: TaskSubmission): void {
    const list = this.getAssignedTasks();
    const task = list.find(t => t.id === taskId);
    if (!task) return;

    // Remove old submission from same student if redoing
    task.submissions = task.submissions.filter(s => s.studentId !== submission.studentId);
    task.submissions.push(submission);
    localStorage.setItem(STORAGE_KEYS.ASSIGNED_TASKS, JSON.stringify(list));
  }

  // 7. Evidence data for competition
  public static getEvidenceData(): CompetitionEvidenceData {
    if (typeof window === 'undefined') return DEMO_EVIDENCE_DATA;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EVIDENCE_DATA);
      return raw ? JSON.parse(raw) : DEMO_EVIDENCE_DATA;
    } catch {
      return DEMO_EVIDENCE_DATA;
    }
  }

  public static saveEvidenceData(data: CompetitionEvidenceData): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EVIDENCE_DATA, JSON.stringify(data));
    } catch (err) {
      console.error('Error saving evidence data:', err);
    }
  }

  // Reset demo
  public static resetToDemo(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(INITIAL_STUDENT_PROFILE));
    localStorage.setItem(STORAGE_KEYS.EVIDENCE_DATA, JSON.stringify(DEMO_EVIDENCE_DATA));
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(CURRICULUM_DATA));
    localStorage.setItem(STORAGE_KEYS.ASSIGNED_TASKS, JSON.stringify(INITIAL_ASSIGNED_TASKS));
    localStorage.setItem(STORAGE_KEYS.GRADE_2_LESSONS, JSON.stringify(ALL_GRADE_2_LESSONS));
  }

  // 8. Grade 2 Lessons Management (75 Math + 66 Vietnamese)
  public static getGrade2Lessons(filterSubject?: 'math' | 'vietnamese'): CurriculumLesson[] {
    if (typeof window === 'undefined') {
      return filterSubject ? ALL_GRADE_2_LESSONS.filter(l => l.subject === filterSubject) : ALL_GRADE_2_LESSONS;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GRADE_2_LESSONS);
      let list: CurriculumLesson[] = [];
      if (!raw) {
        list = JSON.parse(JSON.stringify(ALL_GRADE_2_LESSONS));
        localStorage.setItem(STORAGE_KEYS.GRADE_2_LESSONS, JSON.stringify(list));
      } else {
        list = JSON.parse(raw);
        // Auto-merge: make sure any newly added lesson from catalog is included without overriding existing
        let hasNew = false;
        for (const defaultL of ALL_GRADE_2_LESSONS) {
          const found = list.find(l => l.id === defaultL.id);
          if (!found) {
            list.push(defaultL);
            hasNew = true;
          }
        }
        if (hasNew) {
          localStorage.setItem(STORAGE_KEYS.GRADE_2_LESSONS, JSON.stringify(list));
        }
      }
      return filterSubject ? list.filter(l => l.subject === filterSubject) : list;
    } catch {
      return filterSubject ? ALL_GRADE_2_LESSONS.filter(l => l.subject === filterSubject) : ALL_GRADE_2_LESSONS;
    }
  }

  public static getGrade2LessonById(id: string): CurriculumLesson | undefined {
    const list = this.getGrade2Lessons();
    return list.find(l => l.id === id);
  }

  public static saveGrade2Lesson(lesson: CurriculumLesson): void {
    const list = this.getGrade2Lessons();
    const idx = list.findIndex(l => l.id === lesson.id);
    const updated = {
      ...lesson,
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: lesson.updatedBy || 'Thầy Danh Thanh',
    };
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.push(updated);
    }
    localStorage.setItem(STORAGE_KEYS.GRADE_2_LESSONS, JSON.stringify(list));
  }

  public static duplicateGrade2Lesson(lessonId: string): CurriculumLesson | null {
    const original = this.getGrade2LessonById(lessonId);
    if (!original) return null;
    const duplicated: CurriculumLesson = {
      ...JSON.parse(JSON.stringify(original)),
      id: `${original.id}-copy-${Date.now()}`,
      title: `${original.title} (Bản sao)`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: 'Thầy Danh Thanh'
    };
    this.saveGrade2Lesson(duplicated);
    return duplicated;
  }

  public static setGrade2LessonStatus(lessonId: string, status: LessonStatus): void {
    const lesson = this.getGrade2LessonById(lessonId);
    if (!lesson) return;
    lesson.status = status;
    this.saveGrade2Lesson(lesson);
  }

  // Backup non-grade-2 data safely (Lớp 1, 3, 4, 5) so it is never permanently deleted
  public static backupNonGrade2Data(): void {
    if (typeof window === 'undefined') return;
    try {
      const nonG2 = CURRICULUM_DATA.filter(t => t.grade !== 2);
      localStorage.setItem(STORAGE_KEYS.BACKUP_NON_G2, JSON.stringify({
        backedUpAt: new Date().toISOString(),
        topicsCount: nonG2.length,
        data: nonG2,
        notice: 'Bản lưu trữ an toàn các khối lớp 1, 3, 4, 5 của Trường TH-THCS Vĩnh Điều.'
      }));
    } catch {}
  }

  // CSV Template and Import
  public static generateCSVTemplate(): string {
    return `MaBai,MonHoc,TapSach,ChuDe,Tuan,SoBai,TenBai,TrangThai,YeuCauCanDat,CauHoi1_NoiDung,CauHoi1_DapAnA,CauHoi1_DapAnB,CauHoi1_DapAnC,CauHoi1_DapAnD,CauHoi1_DapAnDung,CauHoi1_GiaiThich
toan-2-t1-b99,math,1,Chủ đề ôn tập,Tuần 1,99,Bài 99: Luyện tập thêm,draft,Nắm vững kiến thức,15 + 5 bằng bao nhiêu?,18,19,20,21,20,15 + 5 = 20
tv-2-t1-b99,vietnamese,1,Chủ điểm quê hương,Tuần 2,99,Bài 99: Dòng kênh quê em,draft,Đọc hiểu văn bản,Con kênh chảy qua xã nào?,Vĩnh Điều,Thành phố,Miền núi,Ven biển,Vĩnh Điều,Con kênh chảy qua xã Vĩnh Điều`;
  }

  public static importLessonsFromCSV(csvContent: string): { successCount: number; errors: string[] } {
    const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const errors: string[] = [];
    let successCount = 0;

    if (lines.length <= 1) {
      return { successCount: 0, errors: ['Tệp CSV rỗng hoặc chỉ có dòng tiêu đề.'] };
    }

    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const expectedHeaders = ['mabai', 'monhoc', 'tapsach', 'chude', 'sobai', 'tenbai'];
    for (const exp of expectedHeaders) {
      if (!header.includes(exp)) {
        errors.push(`Thiếu cột bắt buộc: ${exp}`);
      }
    }
    if (errors.length > 0) return { successCount: 0, errors };

    const colIdx = {
      id: header.indexOf('mabai'),
      subject: header.indexOf('monhoc'),
      volume: header.indexOf('tapsach'),
      topic: header.indexOf('chude'),
      week: header.indexOf('tuan'),
      lessonNumber: header.indexOf('sobai'),
      title: header.indexOf('tenbai'),
      status: header.indexOf('trangthai'),
      objectives: header.indexOf('yeucaucandat'),
      q1Prompt: header.indexOf('cauhoi1_noidung'),
      q1A: header.indexOf('cauhoi1_dapana'),
      q1B: header.indexOf('cauhoi1_dapanb'),
      q1C: header.indexOf('cauhoi1_dapanc'),
      q1D: header.indexOf('cauhoi1_dapand'),
      q1Correct: header.indexOf('cauhoi1_dapandung'),
      q1Explanation: header.indexOf('cauhoi1_giaithich'),
    };

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length < 6) continue;

      const rawId = parts[colIdx.id] || `csv-lesson-${Date.now()}-${i}`;
      const subject = (parts[colIdx.subject]?.toLowerCase() === 'math' || parts[colIdx.subject]?.toLowerCase() === 'toán') ? 'math' : 'vietnamese';
      const volume = Number(parts[colIdx.volume]) === 2 ? 2 : 1;
      const topic = parts[colIdx.topic] || (subject === 'math' ? 'Toán học lớp 2' : 'Tiếng Việt lớp 2');
      const week = colIdx.week >= 0 ? parts[colIdx.week] : 'Tuần bổ sung';
      const lessonNumber = Number(parts[colIdx.lessonNumber]) || (80 + i);
      const title = parts[colIdx.title] || `Bài ${lessonNumber}`;
      const status: LessonStatus = parts[colIdx.status]?.toLowerCase() === 'published' ? 'published' : 'draft';
      const objectives = parts[colIdx.objectives] ? [parts[colIdx.objectives]] : ['Rèn luyện kỹ năng thực hành'];

      const questions: QuestionItem[] = [];
      if (colIdx.q1Prompt >= 0 && parts[colIdx.q1Prompt]) {
        const prompt = parts[colIdx.q1Prompt];
        const a = parts[colIdx.q1A] || 'A';
        const b = parts[colIdx.q1B] || 'B';
        const c = parts[colIdx.q1C] || 'C';
        const d = parts[colIdx.q1D] || 'D';
        const correct = parts[colIdx.q1Correct] || a;
        const explanation = parts[colIdx.q1Explanation] || 'Dựa vào kiến thức bài học.';

        questions.push({
          id: `csv-q-${rawId}-1`,
          grade: 2,
          subject,
          topicId: rawId,
          format: 'multiple_choice',
          prompt,
          options: [`A. ${a}`, `B. ${b}`, `C. ${c}`, `D. ${d}`],
          correctAnswer: correct.startsWith('A') || correct.startsWith('B') || correct.startsWith('C') || correct.startsWith('D') ? correct : `A. ${correct}`,
          solutionExplanation: explanation,
          cognitiveLevel: 'Thông hiểu',
        });
      }

      const newLesson: CurriculumLesson = {
        id: rawId,
        grade: 2,
        subject,
        semester: volume,
        volume,
        topic,
        week,
        lessonNumber,
        title,
        objectives,
        status,
        activities: {
          explore: {
            keyPoints: ['Nội dung được nhập từ danh mục CSV của giáo viên.']
          },
          practice: {
            questions
          }
        },
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        updatedBy: 'Thầy Danh Thanh (CSV Import)'
      };

      this.saveGrade2Lesson(newLesson);
      successCount++;
    }

    return { successCount, errors };
  }
}
