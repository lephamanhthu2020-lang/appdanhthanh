import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    app: 'Vĩnh Điều Smart AI',
    time: new Date().toISOString(),
  });
});

// 1. Mầm AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message, grade = 2, subject = 'math', topic = '', context = '' } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!ai) {
    return res.json({
      reply: getLocalMamAIReply(message, grade, subject),
      source: 'offline_heuristic',
    });
  }

  try {
    const prompt = `Bạn là "Mầm AI" - Bạn đồng hành tri thức thân thiện, thông minh của học sinh tiểu học (Lớp ${grade}), tại Trường TH-THCS Vĩnh Điều, xã Vĩnh Điều, An Giang. Giáo viên hướng dẫn: Thầy Danh Thanh.
Chương trình học: GDPT 2018 (môn ${subject === 'math' ? 'Toán' : 'Tiếng Việt'}).
Chủ đề hiện tại: ${topic || 'Học tập thường ngày'}.
Ngữ cảnh bài tập: ${context || 'Học sinh đang hỏi bài'}.

NGUYÊN TẮC QUAN TRỌNG:
1. TRẢ LỜI CỤ THỂ, KHÔNG NÓI CHUNG CHUNG:
   - Nếu học sinh hỏi về một bài toán hay phép tính, hãy phân tích trực tiếp các con số trong bài!
   - Chia rõ thành Bước 1 (Đề bài cho biết gì?), Bước 2 (Cần tìm gì?), Bước 3 (Dùng phép tính nào?).
   - Ví dụ: Thay vì chỉ nói "em hãy suy nghĩ", hãy nói: "Trong bài toán này, em thấy có 12 cây chuối, sau đó được trồng thêm 3 cây. 'Trồng thêm' nghĩa là số cây tăng lên, vậy ta dùng phép cộng: 12 + 3 = ? Em hãy thử cộng hàng đơn vị 2 + 3 trước xem nào!"
   - Nếu học sinh hỏi về môn Tiếng Việt (chính tả, từ ngữ, câu kể), hãy lấy ví dụ cụ thể, giải nghĩa từng từ và phân biệt rõ ràng.
2. XƯNG HÔ THÂN MẬT: Xưng "Mầm AI" hoặc "mình", gọi học sinh là "bạn" hoặc "em".
3. TẬP TRUNG TƯ DUY: Hướng dẫn chi tiết từng bước nhưng để học sinh thực hiện bước tính cuối cùng để tự khám phá đáp án.
4. KHUYẾN KHÍCH: Động viên chân thành, vui tươi, chuẩn mực văn phong giáo dục Việt Nam.

Câu hỏi/thắc mắc của học sinh: "${message}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      reply: response.text || 'Mầm AI luôn ở đây hướng dẫn em từng bước giải bài!',
      source: 'gemini',
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.json({
      reply: getLocalMamAIReply(message, grade, subject),
      source: 'offline_heuristic',
      fallbackNotice: 'Đang dùng phản hồi dự phòng',
    });
  }
});

// 2. AI Error Diagnosis & Pedagogical Hint
app.post('/api/ai/diagnose', async (req, res) => {
  const { question, studentAnswer, correctAnswer, subject, grade, topic } = req.body;

  if (!ai) {
    return res.json(getLocalDiagnosis(question, studentAnswer, correctAnswer, subject, grade));
  }

  try {
    const systemPrompt = `Bạn là chuyên gia sư phạm tiểu học GDPT 2018. Phân tích nguyên nhân lỗi sai của học sinh và đưa ra lời gợi ý định hướng tư duy (scaffolding), KHÔNG cho đáp án trực tiếp.
Khối lớp: Lớp ${grade}
Môn: ${subject === 'math' ? 'Toán' : 'Tiếng Việt'}
Chủ đề: ${topic || 'Kiến thức cốt lõi'}
Đề bài: "${question}"
Học sinh chọn/trả lời: "${studentAnswer}"
Đáp án đúng: "${correctAnswer}"

Trả về JSON với cấu trúc:
{
  "errorCategory": "Tên loại lỗi (ví dụ: Nhầm phép tính, Nhầm thứ tự, Nhầm đơn vị đo, Hiểu sai từ, Sai chính tả...)",
  "explanation": "Lời giải thích ngắn gọn, dịu dàng cho học sinh hiểu chỗ chưa đúng",
  "pedagogicalHint": "1 câu hỏi gợi mở hoặc bước hành động cụ thể để em tự làm lại",
  "similarPracticeQuestion": "1 câu hỏi tương tự cùng dạng để em khắc phục"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      ...parsed,
      source: 'gemini',
    });
  } catch (err) {
    console.error('Diagnosis error:', err);
    res.json(getLocalDiagnosis(question, studentAnswer, correctAnswer, subject, grade));
  }
});

// 3. AI Teacher Worksheet & Test Generator
app.post('/api/ai/generate-worksheet', async (req, res) => {
  const { grade, subject, topic, requirement, questionCount = 5, difficulty = 'Vận dụng' } = req.body;

  if (!ai) {
    return res.json({
      title: `Phiếu học tập môn ${subject === 'math' ? 'Toán' : 'Tiếng Việt'} Lớp ${grade} - Chủ đề: ${topic}`,
      questions: getLocalSampleQuestions(grade, subject, topic, questionCount),
      source: 'local_preset',
    });
  }

  try {
    const prompt = `Bạn là chuyên gia giáo dục tiểu học Việt Nam biên soạn phiếu học tập môn ${subject === 'math' ? 'Toán' : 'Tiếng Việt'} lớp ${grade} theo định hướng GDPT 2018.
Chủ đề: ${topic}
Yêu cầu cần đạt: ${requirement || 'Phù hợp chuẩn kiến thức kỹ năng'}
Số lượng câu hỏi: ${questionCount} câu
Mức độ nhận thức: ${difficulty} (Nhận biết, Thông hiểu, Vận dụng, Vận dụng sáng tạo)
Khung cảnh địa phương (tùy chọn): Có thể lồng ghép nét đẹp sông nước, văn hóa hoặc đời sống An Giang nếu tự nhiên.

Trả về mảng JSON câu hỏi có cấu trúc chính xác:
{
  "title": "Tiêu đề phiếu học tập",
  "description": "Hướng dẫn làm bài",
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice" | "fill_blank" | "word_problem",
      "prompt": "Nội dung câu hỏi rõ ràng",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "Đáp án đúng chính xác",
      "explanation": "Hướng dẫn giải chi tiết dễ hiểu cho học sinh tiểu học",
      "commonErrorNote": "Dạng lỗi học sinh hay mắc phải"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({
      ...data,
      source: 'gemini',
    });
  } catch (err) {
    console.error('Worksheet generator error:', err);
    res.json({
      title: `Phiếu học tập môn ${subject === 'math' ? 'Toán' : 'Tiếng Việt'} Lớp ${grade} - ${topic}`,
      questions: getLocalSampleQuestions(grade, subject, topic, questionCount),
      source: 'local_preset_fallback',
    });
  }
});

// 4. Parse textbook material and automatically generate comprehension and practice questions
app.post('/api/ai/parse-textbook-material', async (req, res) => {
  const { rawText, bookSeries = 'Kết nối tri thức', grade = 2, subject = 'vietnamese', unitLesson = '' } = req.body;
  if (!rawText || !rawText.trim()) {
    return res.status(400).json({ error: 'Textbook material content is required' });
  }

  if (!ai) {
    return res.json({
      title: unitLesson || `Bài học SGK ${bookSeries} - Lớp ${grade}`,
      content: rawText.trim(),
      vocabularyNotes: [
        { word: 'Từ vựng trọng tâm', meaning: 'Từ ngữ hoặc thuật ngữ quan trọng cần ghi nhớ trong bài học SGK' },
      ],
      questions: [
        {
          id: 'tb-q1',
          prompt: `Dựa vào ngữ liệu vừa tải lên, nội dung chính hoặc quy tắc cần ghi nhớ là gì?`,
          format: 'multiple_choice',
          options: ['A. Nội dung thứ nhất', 'B. Nội dung cốt lõi của bài học (Đúng)', 'C. Nội dung thứ ba', 'D. Nội dung thứ tư'],
          correctAnswer: 'B. Nội dung cốt lõi của bài học (Đúng)',
          solutionExplanation: 'Dựa vào câu chữ và dữ kiện được nêu trực tiếp trong ngữ liệu sách giáo khoa.',
          cognitiveLevel: 'Thông hiểu',
        },
      ],
      source: 'local_preset',
    });
  }

  try {
    const prompt = `Bạn là chuyên gia thẩm định chương trình tiểu học GDPT 2018 (sách ${bookSeries}).
Giáo viên (Thầy Danh Thanh, Trường TH-THCS Vĩnh Điều, xã Vĩnh Điều, An Giang) vừa tải lên một đoạn ngữ liệu sách giáo khoa cho Lớp ${grade}, môn ${subject === 'math' ? 'Toán' : 'Tiếng Việt'}.
Tên bài/Chủ đề: "${unitLesson || 'Bài học theo sách giáo khoa'}"
Nội dung ngữ liệu SGK:
"""
${rawText}
"""

NHIỆM VỤ CỦA BẠN:
1. Đọc và hiệu đính văn bản ngữ liệu thành một bài đọc/bài toán hoàn chỉnh, chuẩn ngữ pháp tiếng Việt.
2. Trích xuất 2-3 từ khó hoặc thuật ngữ quan trọng kèm lời giải nghĩa ngắn gọn, dễ hiểu cho học sinh Lớp ${grade}.
3. TỰ ĐỘNG BIÊN SOẠN từ 3 đến 5 câu hỏi tương tác bám sát chuẩn kiến thức kỹ năng của ngữ liệu này:
   - Câu hỏi 1: Nhận biết chi tiết trong bài
   - Câu hỏi 2: Thông hiểu ý nghĩa / cách tính
   - Câu hỏi 3: Vận dụng / liên hệ thực tế
   - Mỗi câu có 4 phương án lựa chọn (A, B, C, D) hoặc dạng điền khuyết.
   - Chỉ rõ đáp án đúng và lời giải chi tiết.

Trả về JSON có cấu trúc sau:
{
  "title": "Tên bài đọc hoặc chủ đề bài học",
  "content": "Văn bản bài đọc hoặc đề toán đã được định dạng rõ ràng",
  "vocabularyNotes": [
    { "word": "Từ khó 1", "meaning": "Nghĩa ngắn gọn" },
    { "word": "Từ khó 2", "meaning": "Nghĩa ngắn gọn" }
  ],
  "questions": [
    {
      "id": "tb-1",
      "format": "multiple_choice",
      "prompt": "Câu hỏi bám sát văn bản...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A. ...",
      "solutionExplanation": "Giải thích chi tiết vì sao phương án đó đúng",
      "cognitiveLevel": "Nhận biết" | "Thông hiểu" | "Vận dụng"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      ...parsed,
      source: 'gemini',
    });
  } catch (err) {
    console.error('Error parsing textbook material:', err);
    res.json({
      title: unitLesson || `Bài học SGK ${bookSeries} - Lớp ${grade}`,
      content: rawText.trim(),
      vocabularyNotes: [],
      questions: [
        {
          id: 'tb-q1',
          prompt: `Câu hỏi củng cố: Nội dung chính của ngữ liệu trên là gì?`,
          format: 'multiple_choice',
          options: ['A. Phương án A', 'B. Phương án B (Đúng)', 'C. Phương án C', 'D. Phương án D'],
          correctAnswer: 'B. Phương án B (Đúng)',
          solutionExplanation: 'Dựa trực tiếp vào thông tin trong đoạn ngữ liệu.',
          cognitiveLevel: 'Thông hiểu',
        },
      ],
      source: 'fallback',
    });
  }
});

// 5. Complete Lesson Generator for Grade 2 (Math & Vietnamese)
app.post('/api/ai/generate-lesson', async (req, res) => {
  const { subject = 'math', title = '', topic = '', objectives = [], questionCount = 4, difficulty = 'Vận dụng' } = req.body;

  if (!ai) {
    return res.json(getLocalGeneratedLesson(subject, title, topic, questionCount));
  }

  try {
    const isMath = subject === 'math';
    const prompt = `Bạn là chuyên gia sư phạm tiểu học GDPT 2018 (sách Kết nối tri thức với cuộc sống), đồng hành cùng Thầy Danh Thanh, Trường TH-THCS Vĩnh Điều, xã Vĩnh Điều, An Giang.
Hãy biên soạn TOÀN BỘ NỘI DUNG 5 HOẠT ĐỘNG của bài học Lớp 2:
- Môn học: ${isMath ? 'Toán Lớp 2' : 'Tiếng Việt Lớp 2'}
- Tên bài: "${title}"
- Chủ đề/Chủ điểm: "${topic}"
- Yêu cầu cần đạt: ${Array.isArray(objectives) && objectives.length > 0 ? objectives.join('; ') : 'Chuẩn kiến thức kỹ năng Lớp 2'}
- Số câu hỏi luyện tập: ${questionCount} câu
- Mức độ nhận thức: ${difficulty}

${isMath ? `
YÊU CẦU CHO MÔN TOÁN:
1. KHỞI ĐỘNG: Tình huống trực quan sinh động gần gũi với học sinh lớp 2 (có thể gắn với cảnh vật, cây trái quê hương An Giang/Vĩnh Điều), kèm câu hỏi và đáp án.
2. KHÁM PHÁ: Các kiến thức trọng tâm ngắn gọn, dễ nhớ; 1-2 ví dụ mẫu có lời giải từng bước.
3. LUYỆN TẬP: ${questionCount} câu hỏi trắc nghiệm hoặc điền khuyết tự biên soạn 100% chuẩn xác. Có 4 đáp án A, B, C, D rõ ràng, chỉ rõ đáp án đúng và lời giải sư phạm chi tiết.
4. VẬN DỤNG: Bài toán thực tế đời sống.
5. CỦNG CỐ: Tóm tắt 1 câu cốt lõi, câu hỏi nhanh, lời nhắn nhủ từ Mầm AI.
` : `
YÊU CẦU CHO MÔN TIẾNG VIỆT:
1. ĐỌC HIỂU: Biên soạn 1 đoạn văn hoặc bài thơ luyện đọc ngắn (80-120 chữ) trong sáng, giàu tính giáo dục nhân ái hoặc tình yêu thiên nhiên quê hương Vĩnh Điều, An Giang (TUYỆT ĐỐI KHÔNG sao chép nguyên văn SGK). Kèm 2 từ khó giải nghĩa.
2. LUYỆN TẬP: ${questionCount} câu hỏi trắc nghiệm tự biên soạn gồm câu hỏi đọc hiểu nội dung, câu hỏi từ và câu (Ai là gì, Ai làm gì, Ai thế nào, từ chỉ sự vật/hoạt động/đặc điểm), và câu hỏi chính tả (s/x, r/d/gi, c/k, an/ang).
3. LUYỆN VIẾT & VẬN DỤNG: Gợi ý viết 1-2 câu ngắn liên hệ bản thân hoặc quê hương.
4. CỦNG CỐ: Lời nhắn nhủ nhẹ nhàng từ Mầm AI.
`}

Trả về JSON đúng cấu trúc sau:
{
  "warmup": {
    "scenario": "Mô tả tình huống khởi động vui nhộn",
    "question": "Câu hỏi tình huống?",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "A. ..."
  },
  "explore": {
    "keyPoints": ["Quy tắc 1", "Quy tắc 2"],
    "examples": [
      { "problem": "Ví dụ 1", "solution": "Lời giải từng bước" }
    ]
  },
  "practice": {
    "questions": [
      {
        "id": "gen-1",
        "format": "multiple_choice",
        "prompt": "Câu hỏi...",
        "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
        "correctAnswer": "A. ...",
        "solutionExplanation": "Giải thích chi tiết",
        "cognitiveLevel": "Nhận biết"
      }
    ]
  },
  "application": {
    "scenario": "Tình huống thực tế",
    "task": "Nhiệm vụ vận dụng",
    "answer": "Gợi ý kết quả",
    "localContext": "Xã Vĩnh Điều, An Giang"
  },
  "consolidation": {
    "summary": "Tóm tắt bài học",
    "quickQuestion": "Câu hỏi củng cố?",
    "quickAnswer": "Đáp án nhanh",
    "mamAINote": "Lời nhắn từ Mầm AI"
  },
  "readingPassage": {
    "title": "Tên bài đọc",
    "content": "Văn bản bài đọc tự biên soạn...",
    "vocabularyNotes": [
      { "word": "Từ khó", "meaning": "Nghĩa" }
    ]
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      data: parsed,
      source: 'gemini',
    });
  } catch (err: any) {
    console.error('Generate lesson error:', err);
    res.json({
      success: true,
      data: getLocalGeneratedLesson(subject, title, topic, questionCount),
      source: 'fallback',
    });
  }
});

function getLocalGeneratedLesson(subject: string, title: string, topic: string, questionCount: number) {
  const isMath = subject === 'math';
  return {
    warmup: {
      scenario: `Các bạn nhỏ Trường TH-THCS Vĩnh Điều hào hứng bước vào bài học ${title}.`,
      question: isMath ? 'Em hãy quan sát xem có bao nhiêu bông hoa hướng dương?' : 'Bạn nhỏ trong câu chuyện đang cảm thấy như thế nào?',
      options: ['A. 5 bông', 'B. 10 bông', 'C. 15 bông', 'D. 20 bông'],
      answer: 'B. 10 bông',
    },
    explore: {
      keyPoints: [
        `Kiến thức cốt lõi của bài học: ${title}`,
        'Đọc kỹ đề bài, nhận biết các dữ kiện và thực hiện từng bước cẩn thận.',
        'Kiểm tra lại kết quả sau khi làm bài.'
      ],
      examples: [
        {
          problem: isMath ? 'Thực hiện phép tính mẫu theo yêu cầu bài học.' : 'Tìm từ ngữ chỉ sự vật trong câu mẫu.',
          solution: 'Phân tích từng thành phần và đưa ra kết luận chuẩn xác.'
        }
      ]
    },
    practice: {
      questions: [
        {
          id: `local-gen-1`,
          format: 'multiple_choice',
          prompt: isMath ? `[Toán 2] Câu hỏi thực hành trọng tâm bài ${title}: Kết quả chính xác là bao nhiêu?` : `[Tiếng Việt 2] Đọc hiểu bài ${title}: Chi tiết nào thể hiện đúng nhất nội dung bài?`,
          options: ['A. Lựa chọn A (Chưa đúng)', 'B. Lựa chọn B (Đáp án chuẩn)', 'C. Lựa chọn C (Chưa đúng)', 'D. Lựa chọn D (Chưa đúng)'],
          correctAnswer: 'B. Lựa chọn B (Đáp án chuẩn)',
          solutionExplanation: 'Dựa trực tiếp vào lý thuyết và các ví dụ đã học trong bài.',
          cognitiveLevel: 'Thông hiểu',
        },
        {
          id: `local-gen-2`,
          format: 'fill_blank',
          prompt: `Em hãy điền số hoặc từ thích hợp vào chỗ trống để hoàn thành bài tập về: ${title}.`,
          correctAnswer: 'Đúng',
          solutionExplanation: 'Ghi nhớ quy tắc cốt lõi của bài học.',
          cognitiveLevel: 'Vận dụng',
        }
      ]
    },
    application: {
      scenario: 'Ứng dụng kiến thức vào thực tế cuộc sống tại xã Vĩnh Điều, An Giang.',
      task: 'Em hãy áp dụng bài học để giải quyết tình huống thường ngày cùng cha mẹ hoặc bạn bè.',
      answer: 'Thực hành đều đặn mỗi ngày.',
      localContext: 'Xã Vĩnh Điều, An Giang'
    },
    consolidation: {
      summary: `Bài học ${title} giúp em vững vàng hơn trong chương trình môn ${isMath ? 'Toán' : 'Tiếng Việt'} Lớp 2.`,
      quickQuestion: 'Em đã nắm vững bài học hôm nay chưa?',
      quickAnswer: 'Em đã hiểu bài rất tốt!',
      mamAINote: 'Mầm AI chúc mừng em đã tích cực học tập!'
    },
    readingPassage: !isMath ? {
      title: title,
      content: `Mỗi sớm mai thức dậy ở vùng quê Vĩnh Điều, tiếng chim hót líu lo trên cành cây xanh. Em cùng bạn bè cắp sách đến trường với bao niềm vui rộn rã. Lớp học thân thương vang lên tiếng đọc bài ấm áp của thầy cô. Chúng em hăng say học tập để ngày mai xây dựng quê hương thêm giàu đẹp.`,
      vocabularyNotes: [
        { word: 'Líu lo', meaning: 'Tiếng chim hót trong trẻo, vui tươi liên tiếp.' },
        { word: 'Rộn rã', meaning: 'Âm thanh hoặc không khí tưng bừng, náo nhiệt.' }
      ]
    } : undefined
  };
}


// Local Fallback Heuristics
function getLocalMamAIReply(msg: string, grade: number, subject: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('chào') || lower.includes('hello') || lower.includes('hi')) {
    return `Chào bạn nhỏ Lớp ${grade}! Mình là Mầm AI đây. Hôm nay chúng mình cùng học ${subject === 'math' ? 'Toán học kỳ diệu' : 'Tiếng Việt yêu thương'} nhé!`;
  }
  if (lower.includes('khó') || lower.includes('không hiểu') || lower.includes('giúp')) {
    return `Đừng lo lắng nhé! Bài nào khó, em hãy chia nhỏ thành từng bước. Em đọc kỹ đề bài xem bài toán đã cho mình biết điều gì trước tiên nào?`;
  }
  if (lower.includes('đáp án') || lower.includes('kết quả là gì')) {
    return `Mầm AI tin em tự tìm ra được đấy! Hãy thử nêu cách nghĩ của em trước, Mầm AI sẽ gợi ý xem em đã đi đúng hướng chưa nhé!`;
  }
  return `Tuyệt vời lắm! Mầm AI luôn đồng hành cùng em trong từng bài học tại Trường TH-THCS Vĩnh Điều. Em hãy tự tin thử làm bài nhé!`;
}

function getLocalDiagnosis(question: string, studentAnswer: string, correctAnswer: string, subject: string, grade: number) {
  let errorCat = 'Chưa chính xác';
  let explanation = 'Câu trả lời của em chưa khớp với kết quả chuẩn.';
  let hint = 'Em hãy đọc lại từng dữ kiện của đề bài và thực hiện từng bước cẩn thận nhé.';

  if (subject === 'math') {
    errorCat = 'Nhầm phép tính hoặc thao tác cộng trừ nhẩm';
    explanation = `Em đang chọn "${studentAnswer}", trong khi kết quả đúng là "${correctAnswer}". Có thể em đã nhẩm nhầm một bước tính hoặc chưa nhớ số dư/số nhớ.`;
    hint = 'Em hãy viết phép tính ra giấy nháp, đặt tính thẳng cột từ phải sang trái rồi kiểm tra lại từng chữ số nhé!';
  } else {
    errorCat = 'Chưa hiểu rõ nghĩa từ hoặc yêu cầu ngữ cảnh';
    explanation = `Phương án "${studentAnswer}" chưa đúng ngữ cảnh bài tập. Đáp án chuẩn là "${correctAnswer}".`;
    hint = 'Em hãy thử thay từng từ vào câu và đọc to lên xem câu nào nghe tự nhiên và đúng nghĩa nhất nhé!';
  }

  return {
    errorCategory: errorCat,
    explanation: explanation,
    pedagogicalHint: hint,
    similarPracticeQuestion: `Câu tương tự: Em hãy tính lại phép tính tương tự với các số nhỏ hơn để quen tay nhé!`,
    source: 'local_heuristic',
  };
}

function getLocalSampleQuestions(grade: number, subject: string, topic: string, count: number) {
  return [
    {
      id: 1,
      type: 'multiple_choice',
      prompt: `[Lớp ${grade} - ${subject === 'math' ? 'Toán' : 'Tiếng Việt'}] Câu hỏi củng cố chủ đề ${topic}: Tính chất hoặc quy tắc cơ bản là gì?`,
      options: ['A. Lựa chọn thứ nhất', 'B. Lựa chọn thứ hai (Đúng)', 'C. Lựa chọn thứ ba', 'D. Lựa chọn thứ tư'],
      correctAnswer: 'B. Lựa chọn thứ hai (Đúng)',
      explanation: 'Theo kiến thức chương trình GDPT 2018, quy tắc được áp dụng chính xác ở phương án B.',
      commonErrorNote: 'Học sinh thường vội vàng không đọc hết 4 phương án.',
    },
    {
      id: 2,
      type: 'fill_blank',
      prompt: `Điền vào chỗ trống kết quả hoặc từ ngữ thích hợp liên quan đến: ${topic}.`,
      options: [],
      correctAnswer: 'Kết quả chuẩn xác',
      explanation: 'Dựa vào định nghĩa và ví dụ mẫu trong sách giáo khoa Kết nối tri thức.',
      commonErrorNote: 'Lỗi nhầm lẫn khái niệm tương đồng.',
    },
  ];
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Vĩnh Điều Smart AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
