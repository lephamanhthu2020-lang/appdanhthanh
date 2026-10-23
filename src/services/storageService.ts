import { StudentProfile, TopicCompetency, MasteryLevel, GeneratedWorksheet, CompetitionEvidenceData } from '../types';
import { INITIAL_STUDENT_PROFILE, DEMO_EVIDENCE_DATA } from '../data/demoStudents';
import { CURRICULUM_DATA } from '../data/curriculumData';

const STORAGE_KEYS = {
  STUDENT_PROFILE: 'vd_smart_ai_student_profile',
  TEACHER_WORKSHEETS: 'vd_smart_ai_teacher_worksheets',
  EVIDENCE_DATA: 'vd_smart_ai_evidence_data',
  SETTINGS: 'vd_smart_ai_settings',
};

export class StorageService {
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
    const topic = CURRICULUM_DATA.find(t => t.questions.some(q => q.id === questionId));

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

  // Calculate 4T Model Topic Competency (0 - 100 points transparent formula)
  public static calculateTopicCompetencies(profile: StudentProfile): TopicCompetency[] {
    const list: TopicCompetency[] = [];

    CURRICULUM_DATA.forEach(topic => {
      // Find all questions for this topic
      const qIds = topic.questions.map(q => q.id);
      const records = profile.answeredRecords.filter(r => r.topicId === topic.id || qIds.includes(r.questionId));

      const totalAttempts = records.length;
      const correctAnswers = records.filter(r => r.isCorrect).length;

      // Mastery Formula:
      // If 0 attempts: 0%
      // Base accuracy = (correct / total) * 80% + (uniqueCompleted / totalQuestionsInTopic) * 20%
      let mastery = 0;
      if (totalAttempts > 0) {
        const accuracyRate = (correctAnswers / totalAttempts) * 80;
        const uniqueCompleted = topic.questions.filter(q => profile.completedQuestionIds.includes(q.id)).length;
        const coverageRate = (uniqueCompleted / topic.questions.length) * 20;
        mastery = Math.min(100, Math.round(accuracyRate + coverageRate));
      }

      // Map to 4T levels:
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

      // Identify top error
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

  // Worksheets created by teachers
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

  // Evidence data for competition
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
  }
}
