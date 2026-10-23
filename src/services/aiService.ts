import { ErrorDiagnosis, GeneratedWorksheet, GradeLevel, SubjectType, CognitiveLevel } from '../types';

export async function askMamAI(
  message: string,
  grade: GradeLevel,
  subject: SubjectType,
  topic: string = '',
  context: string = ''
): Promise<{ reply: string; source: string }> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, grade, subject, topic, context }),
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('Using client fallback for Mầm AI:', err);
    return {
      reply: getClientFallbackReply(message, grade, subject),
      source: 'client_fallback',
    };
  }
}

export async function requestErrorDiagnosis(
  question: string,
  studentAnswer: string,
  correctAnswer: string,
  subject: SubjectType,
  grade: GradeLevel,
  topic: string = ''
): Promise<ErrorDiagnosis> {
  try {
    const res = await fetch('/api/ai/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        studentAnswer,
        correctAnswer,
        subject,
        grade,
        topic,
      }),
    });
    if (!res.ok) throw new Error('Diagnosis network error');
    return await res.json();
  } catch (err) {
    console.warn('Fallback error diagnosis:', err);
    return {
      errorCategory: subject === 'math' ? 'Thao tác tính toán chưa khớp' : 'Từ ngữ hoặc ngữ cảnh câu chưa chính xác',
      explanation: `Em chọn "${studentAnswer}", trong khi đáp án đúng là "${correctAnswer}".`,
      pedagogicalHint: 'Em hãy đọc thật chậm lại câu hỏi, kiểm tra từng bước một để tự tin tìm ra đáp án nhé!',
      source: 'offline_heuristic',
    };
  }
}

export async function generateWorksheet(
  grade: GradeLevel,
  subject: SubjectType,
  topic: string,
  requirement: string,
  questionCount: number = 5,
  difficulty: CognitiveLevel = 'Vận dụng'
): Promise<GeneratedWorksheet> {
  try {
    const res = await fetch('/api/ai/generate-worksheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grade,
        subject,
        topic,
        requirement,
        questionCount,
        difficulty,
      }),
    });
    if (!res.ok) throw new Error('Worksheet generation failed');
    const data = await res.json();
    return {
      id: 'ws-' + Date.now(),
      title: data.title || `Phiếu học tập ${subject === 'math' ? 'Toán' : 'Tiếng Việt'} Lớp ${grade}`,
      grade,
      subject,
      topic,
      difficulty,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      questions: data.questions || [],
    };
  } catch (err) {
    console.warn('Fallback worksheet:', err);
    return {
      id: 'ws-' + Date.now(),
      title: `Phiếu củng cố kiến thức môn ${subject === 'math' ? 'Toán' : 'Tiếng Việt'} Lớp ${grade} - ${topic}`,
      grade,
      subject,
      topic,
      difficulty,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      questions: [
        {
          id: 1,
          type: 'multiple_choice',
          prompt: `[Chuẩn GDPT 2018 - Lớp ${grade}] Câu hỏi ôn tập chủ đề ${topic}: Em hãy lựa chọn đáp án phù hợp nhất.`,
          options: ['A. Phương án thứ nhất', 'B. Phương án thứ hai (Chính xác)', 'C. Phương án thứ ba', 'D. Phương án thứ tư'],
          correctAnswer: 'B. Phương án thứ hai (Chính xác)',
          explanation: 'Áp dụng định nghĩa và kiến thức cốt lõi đã học trong sách giáo khoa.',
          commonErrorNote: 'Học sinh thường nhầm lẫn giữa hai khái niệm tương đồng.',
        },
        {
          id: 2,
          type: 'fill_blank',
          prompt: `Em hãy ghi lại quy tắc hoặc kết quả đúng cho bài toán về ${topic}.`,
          correctAnswer: 'Kết quả mẫu',
          explanation: 'Thực hiện từng bước cẩn thận theo sách giáo khoa Kết nối tri thức.',
          commonErrorNote: 'Lỗi tính toán hoặc thiếu đơn vị đo.',
        },
      ],
    };
  }
}

function getClientFallbackReply(msg: string, grade: GradeLevel, subject: SubjectType): string {
  const lower = msg.toLowerCase();
  if (lower.includes('chào') || lower.includes('hello')) {
    return `Chào bạn nhỏ Lớp ${grade}! Mình là Mầm AI – Bạn đồng hành tri thức đây! Cùng khám phá bài học hôm nay nhé!`;
  }
  if (lower.includes('toán') || subject === 'math') {
    return `Toán học rất thú vị! Em hãy đọc kỹ các con số và xem bài toán yêu cầu tìm cái gì nhé!`;
  }
  return `Tiếng Việt mến yêu của chúng mình thật giàu đẹp! Em hãy đọc to từng câu để cảm nhận giai điệu nhé!`;
}
