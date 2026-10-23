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
    const prompt = `Bạn là "Mầm AI" - Bạn đồng hành tri thức thân thiện, đáng yêu của học sinh tiểu học (Lớp ${grade}), tại Trường TH-THCS Vĩnh Điều, tỉnh An Giang.
Chương trình học: GDPT 2018 (môn ${subject === 'math' ? 'Toán' : 'Tiếng Việt'}).
Chủ đề hiện tại: ${topic || 'Học tập thường ngày'}.
Ngữ cảnh bổ sung: ${context || 'Học sinh đang tự luyện tập'}.

NGUYÊN TẮC:
- Luôn xưng "Mầm AI" hoặc "mình", gọi học sinh là "bạn" hoặc "em".
- Giọng văn ấm áp, tươi vui, ngắn gọn, phù hợp trình độ học sinh lớp ${grade}.
- Tuyệt đối KHÔNG đưa thẳng đáp án bài tập khi học sinh hỏi bài, hãy đặt câu hỏi gợi mở, gợi ý từng bước để học sinh tự suy nghĩ.
- Khuyến khích sự tò mò, kiên trì, không chê bai khi sai.
- Dùng tiếng Việt chuẩn mực, trong sáng, có thể gắn với hình ảnh thiên nhiên đồng quê An Giang khi phù hợp.

Câu hỏi/tâm sự của học sinh: "${message}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      reply: response.text || 'Mầm AI luôn ở đây cổ vũ bạn học tập thật tốt!',
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
