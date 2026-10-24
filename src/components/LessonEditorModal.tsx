import React, { useState } from 'react';
import { CurriculumLesson, LessonStatus, SubjectType, QuestionItem, CognitiveLevel } from '../types';
import { StorageService } from '../services/storageService';
import { generateLessonContent } from '../services/aiService';
import { 
  X, 
  Save, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  BookOpen, 
  Calculator, 
  HelpCircle,
  FileText,
  Volume2,
  Eye,
  AlertCircle,
  Layers,
  Copy
} from 'lucide-react';

interface LessonEditorModalProps {
  lesson?: CurriculumLesson | null; // if null, create new
  defaultSubject?: SubjectType;
  defaultVolume?: 1 | 2;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (savedLesson: CurriculumLesson) => void;
}

export const LessonEditorModal: React.FC<LessonEditorModalProps> = ({
  lesson,
  defaultSubject = 'math',
  defaultVolume = 1,
  isOpen,
  onClose,
  onSaved,
}) => {
  if (!isOpen) return null;

  const isEditing = !!lesson;

  // Form State
  const [subject, setSubject] = useState<SubjectType>(lesson ? lesson.subject : defaultSubject);
  const [volume, setVolume] = useState<1 | 2>(lesson ? lesson.volume : defaultVolume);
  const [topic, setTopic] = useState<string>(lesson ? lesson.topic : (subject === 'math' ? 'Chủ đề 1: Ôn tập và bổ sung' : 'Chủ điểm 1: Em lớn lên từng ngày'));
  const [week, setWeek] = useState<string>(lesson?.week || 'Tuần 1');
  const [lessonNumber, setLessonNumber] = useState<number>(lesson?.lessonNumber || 1);
  const [title, setTitle] = useState<string>(lesson?.title || '');
  const [objectivesText, setObjectivesText] = useState<string>(lesson?.objectives.join('\n') || 'Nắm vững kiến thức trọng tâm\nThực hành giải bài tập tự tin');
  const [status, setStatus] = useState<LessonStatus>(lesson?.status || 'published');
  const [sourceUrl, setSourceUrl] = useState<string>(lesson?.sourceUrl || 'https://taphuan.nxbgd.vn');

  // Active Tab in editor
  const [editorTab, setEditorTab] = useState<'info' | 'activities' | 'reading' | 'questions' | 'audio'>('info');

  // Activities State
  const [warmupScenario, setWarmupScenario] = useState(lesson?.activities?.warmup?.scenario || '');
  const [warmupQuestion, setWarmupQuestion] = useState(lesson?.activities?.warmup?.question || '');
  const [warmupAnswer, setWarmupAnswer] = useState(lesson?.activities?.warmup?.answer || '');

  const [exploreKeyPointsText, setExploreKeyPointsText] = useState(
    lesson?.activities?.explore?.keyPoints?.join('\n') || ''
  );
  const [exploreExampleProblem, setExploreExampleProblem] = useState(
    lesson?.activities?.explore?.examples?.[0]?.problem || ''
  );
  const [exploreExampleSolution, setExploreExampleSolution] = useState(
    lesson?.activities?.explore?.examples?.[0]?.solution || ''
  );

  const [applicationScenario, setApplicationScenario] = useState(lesson?.activities?.application?.scenario || '');
  const [applicationTask, setApplicationTask] = useState(lesson?.activities?.application?.task || '');
  const [applicationAnswer, setApplicationAnswer] = useState(lesson?.activities?.application?.answer || '');
  const [localContext, setLocalContext] = useState(lesson?.activities?.application?.localContext || 'Xã Vĩnh Điều, An Giang');

  const [consolidationSummary, setConsolidationSummary] = useState(lesson?.activities?.consolidation?.summary || '');
  const [consolidationMamAINote, setConsolidationMamAINote] = useState(
    lesson?.activities?.consolidation?.mamAINote || 'Mầm AI luôn đồng hành cùng em!'
  );

  // Reading Passage (For Vietnamese)
  const [readingTitle, setReadingTitle] = useState(lesson?.readingPassage?.title || '');
  const [readingContent, setReadingContent] = useState(lesson?.readingPassage?.content || '');
  const [audioUrl, setAudioUrl] = useState(lesson?.readingPassage?.audioUrl || lesson?.sourceUrl || '');

  // Questions State
  const [questions, setQuestions] = useState<QuestionItem[]>(
    lesson?.activities?.practice?.questions ? JSON.parse(JSON.stringify(lesson.activities.practice.questions)) : []
  );

  // AI Generator Loading
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Handle AI Auto-generation
  const handleAIGenerate = async () => {
    if (!title.trim()) {
      alert('Vui lòng nhập Tên bài học trước khi tạo bằng AI.');
      return;
    }
    setIsAiGenerating(true);
    setAiMessage(null);

    const result = await generateLessonContent({
      subject,
      title,
      topic,
      objectives: objectivesText.split('\n').filter(o => o.trim().length > 0),
      questionCount: 4,
      difficulty: 'Vận dụng',
    });

    setIsAiGenerating(false);

    if (result.success && result.data) {
      const d = result.data;
      if (d.warmup) {
        setWarmupScenario(d.warmup.scenario || '');
        setWarmupQuestion(d.warmup.question || '');
        setWarmupAnswer(d.warmup.answer || '');
      }
      if (d.explore) {
        setExploreKeyPointsText(d.explore.keyPoints?.join('\n') || '');
        if (d.explore.examples?.[0]) {
          setExploreExampleProblem(d.explore.examples[0].problem || '');
          setExploreExampleSolution(d.explore.examples[0].solution || '');
        }
      }
      if (d.application) {
        setApplicationScenario(d.application.scenario || '');
        setApplicationTask(d.application.task || '');
        setApplicationAnswer(d.application.answer || '');
        setLocalContext(d.application.localContext || 'Xã Vĩnh Điều, An Giang');
      }
      if (d.consolidation) {
        setConsolidationSummary(d.consolidation.summary || '');
        setConsolidationMamAINote(d.consolidation.mamAINote || 'Mầm AI rất tự hào về em!');
      }
      if (d.readingPassage && subject === 'vietnamese') {
        setReadingTitle(d.readingPassage.title || title);
        setReadingContent(d.readingPassage.content || '');
      }
      if (d.practice?.questions && d.practice.questions.length > 0) {
        const formattedQuestions: QuestionItem[] = d.practice.questions.map((q: any, idx: number) => ({
          id: `q-ai-${Date.now()}-${idx}`,
          grade: 2,
          subject,
          topicId: lesson?.id || `lesson-temp-${Date.now()}`,
          format: q.format || 'multiple_choice',
          prompt: q.prompt,
          options: q.options || ['A. Lựa chọn A', 'B. Lựa chọn B', 'C. Lựa chọn C', 'D. Lựa chọn D'],
          correctAnswer: q.correctAnswer || (q.options?.[0] || 'A'),
          solutionExplanation: q.solutionExplanation || 'Lời giải chi tiết từ Mầm AI.',
          cognitiveLevel: (q.cognitiveLevel as CognitiveLevel) || 'Thông hiểu',
        }));
        setQuestions(formattedQuestions);
      }
      setAiMessage('✨ Gemini AI đã biên soạn nội dung 5 hoạt động thành công! Thầy/Cô vui lòng kiểm tra và bấm "Lưu bài học".');
    }
  };

  // Add Question Manually
  const handleAddQuestion = () => {
    const newQ: QuestionItem = {
      id: `q-manual-${Date.now()}`,
      grade: 2,
      subject,
      topicId: lesson?.id || 'temp-lesson',
      format: 'multiple_choice',
      prompt: 'Nhập câu hỏi bài tập...',
      options: ['A. ', 'B. ', 'C. ', 'D. '],
      correctAnswer: 'A. ',
      solutionExplanation: 'Giải thích đáp án đúng...',
      cognitiveLevel: 'Vận dụng',
    };
    setQuestions([...questions, newQ]);
  };

  const handleUpdateQuestion = (index: number, updated: QuestionItem) => {
    const list = [...questions];
    list[index] = updated;
    setQuestions(list);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Save Lesson
  const handleSave = () => {
    if (!title.trim()) {
      alert('Vui lòng nhập Tên bài học!');
      return;
    }

    const lessonId = lesson?.id || `${subject === 'math' ? 'toan' : 'tv'}-2-t${volume}-b${lessonNumber}-${Date.now()}`;

    const updatedQuestions = questions.map(q => ({
      ...q,
      grade: 2 as const,
      subject,
      topicId: lessonId,
    }));

    const completeLesson: CurriculumLesson = {
      id: lessonId,
      grade: 2,
      subject,
      semester: volume,
      volume,
      topic: topic.trim(),
      week: week.trim(),
      lessonNumber: Number(lessonNumber) || 1,
      title: title.trim(),
      objectives: objectivesText.split('\n').map(o => o.trim()).filter(o => o.length > 0),
      status,
      sourceUrl,
      sourceStatus: 'custom',
      activities: {
        warmup: warmupScenario ? {
          scenario: warmupScenario,
          question: warmupQuestion,
          answer: warmupAnswer,
        } : undefined,
        explore: {
          keyPoints: exploreKeyPointsText.split('\n').map(p => p.trim()).filter(p => p.length > 0),
          examples: exploreExampleProblem ? [{
            problem: exploreExampleProblem,
            solution: exploreExampleSolution,
          }] : undefined,
        },
        practice: {
          questions: updatedQuestions,
        },
        application: applicationTask ? {
          scenario: applicationScenario,
          task: applicationTask,
          answer: applicationAnswer,
          localContext: localContext,
        } : undefined,
        consolidation: {
          summary: consolidationSummary || `Nắm vững bài học: ${title}`,
          mamAINote: consolidationMamAINote,
        },
      },
      readingPassage: subject === 'vietnamese' && readingContent ? {
        title: readingTitle || title,
        content: readingContent,
        authorOrOrigin: 'Biên soạn bởi Giáo viên Danh Thanh',
        audioUrl: audioUrl.trim() || undefined,
      } : undefined,
      createdAt: lesson?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: 'Thầy Danh Thanh (Trường TH-THCS Vĩnh Điều)',
    };

    StorageService.saveGrade2Lesson(completeLesson);
    onSaved(completeLesson);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-xl">
              {subject === 'math' ? '📐' : '📖'}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {isEditing ? 'Chỉnh Sửa Bài Học Lớp 2' : 'Thêm Bài Học Mới Lớp 2'}
              </h3>
              <p className="text-xs text-slate-300">
                Chương trình GDPT 2018 – Kết nối tri thức với cuộc sống | Trường TH-THCS Vĩnh Điều
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 gap-2 overflow-x-auto">
          <button
            onClick={() => setEditorTab('info')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              editorTab === 'info' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" /> A. Thông tin bài
          </button>
          <button
            onClick={() => setEditorTab('activities')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              editorTab === 'activities' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" /> B. 5 Hoạt động dạy học
          </button>
          {subject === 'vietnamese' && (
            <button
              onClick={() => setEditorTab('reading')}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                editorTab === 'reading' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" /> C. Ngữ liệu đọc hiểu
            </button>
          )}
          <button
            onClick={() => setEditorTab('questions')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              editorTab === 'questions' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> D. Ngân hàng câu hỏi ({questions.length})
          </button>
          <button
            onClick={() => setEditorTab('audio')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              editorTab === 'audio' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Volume2 className="w-4 h-4" /> E. Âm thanh & Nguồn SGK
          </button>
        </div>

        {/* AI Generator Action Bar */}
        <div className="bg-gradient-to-r from-teal-50 via-blue-50 to-indigo-50 border-b border-blue-100 p-3 px-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Trợ giảng AI sư phạm:</span>
            <span className="text-[11px] text-slate-500">Tự động soạn 5 hoạt động và bài tập chuẩn lớp 2</span>
          </div>

          <button
            onClick={handleAIGenerate}
            disabled={isAiGenerating}
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            {isAiGenerating ? 'Gemini đang biên soạn...' : '✨ TẠO NỘI DUNG BÀI HỌC BẰNG AI'}
          </button>
        </div>

        {aiMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {aiMessage}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          
          {/* TAB 1: THÔNG TIN BÀI HỌC */}
          {editorTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Môn học</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value as SubjectType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="math">Toán Lớp 2</option>
                    <option value="vietnamese">Tiếng Việt Lớp 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tập sách</label>
                  <select
                    value={volume}
                    onChange={e => setVolume(Number(e.target.value) as 1 | 2)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value={1}>Tập một (Học kì I)</option>
                    <option value={2}>Tập hai (Học kì II)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số bài (Thứ tự)</label>
                  <input
                    type="number"
                    value={lessonNumber}
                    onChange={e => setLessonNumber(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tuần học</label>
                  <input
                    type="text"
                    value={week}
                    onChange={e => setWeek(e.target.value)}
                    placeholder="VD: Tuần 3"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề hoặc Chủ điểm SGK</label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="VD: Chủ đề 2: Phép cộng, phép trừ trong phạm vi 20"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên bài học <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="VD: Bài 7. Phép cộng qua 10 trong phạm vi 20"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Yêu cầu cần đạt (mỗi dòng một ý)</label>
                <textarea
                  value={objectivesText}
                  onChange={e => setObjectivesText(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                  placeholder="Mỗi dòng là một mục tiêu cần đạt..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái xuất bản</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as LessonStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="published">Đã xuất bản (Học sinh thấy và làm bài được)</option>
                    <option value="draft">Bản nháp (Đang biên soạn - Ẩn với học sinh)</option>
                    <option value="archived">Lưu trữ (Tạm ngưng)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Đường dẫn tham khảo SGK</label>
                  <input
                    type="text"
                    value={sourceUrl}
                    onChange={e => setSourceUrl(e.target.value)}
                    placeholder="https://taphuan.nxbgd.vn/..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NỘI DUNG 5 HOẠT ĐỘNG DẠY HỌC */}
          {editorTab === 'activities' && (
            <div className="space-y-4">
              {/* Hoạt động 1: Khởi động */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <span className="text-xs font-black uppercase text-amber-800">1. Khởi động (Tình huống trực quan)</span>
                <input
                  type="text"
                  value={warmupScenario}
                  onChange={e => setWarmupScenario(e.target.value)}
                  placeholder="Mô tả tình huống mở đầu..."
                  className="w-full bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={warmupQuestion}
                    onChange={e => setWarmupQuestion(e.target.value)}
                    placeholder="Câu hỏi tình huống..."
                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={warmupAnswer}
                    onChange={e => setWarmupAnswer(e.target.value)}
                    placeholder="Đáp án gợi mở..."
                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Hoạt động 2: Khám phá */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <span className="text-xs font-black uppercase text-blue-800">2. Khám phá kiến thức cốt lõi</span>
                <label className="block text-[11px] font-bold text-slate-600">Quy tắc / Trọng tâm (mỗi dòng một ý):</label>
                <textarea
                  value={exploreKeyPointsText}
                  onChange={e => setExploreKeyPointsText(e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-blue-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="Ví dụ quy tắc cộng qua 10..."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={exploreExampleProblem}
                    onChange={e => setExploreExampleProblem(e.target.value)}
                    placeholder="Ví dụ mẫu (Bài toán mẫu)..."
                    className="w-full bg-white border border-blue-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={exploreExampleSolution}
                    onChange={e => setExploreExampleSolution(e.target.value)}
                    placeholder="Hướng dẫn giải từng bước..."
                    className="w-full bg-white border border-blue-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Hoạt động 3: Vận dụng */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <span className="text-xs font-black uppercase text-emerald-800">3. Vận dụng thực tế cuộc sống (Gắn với An Giang)</span>
                <input
                  type="text"
                  value={applicationScenario}
                  onChange={e => setApplicationScenario(e.target.value)}
                  placeholder="Tình huống thực tế đời sống..."
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={applicationTask}
                    onChange={e => setApplicationTask(e.target.value)}
                    placeholder="Nhiệm vụ cho học sinh..."
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={localContext}
                    onChange={e => setLocalContext(e.target.value)}
                    placeholder="Bối cảnh địa phương: Xã Vĩnh Điều, An Giang"
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Hoạt động 4: Củng cố */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                <span className="text-xs font-black uppercase text-purple-800">4. Củng cố & Động viên từ Mầm AI</span>
                <input
                  type="text"
                  value={consolidationSummary}
                  onChange={e => setConsolidationSummary(e.target.value)}
                  placeholder="Tóm tắt ngắn gọn bài học..."
                  className="w-full bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
                <input
                  type="text"
                  value={consolidationMamAINote}
                  onChange={e => setConsolidationMamAINote(e.target.value)}
                  placeholder="Lời nhắn khích lệ từ Mầm AI..."
                  className="w-full bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TAB 3: NGỮ LIỆU ĐỌC HIỂU (TIẾNG VIỆT) */}
          {editorTab === 'reading' && subject === 'vietnamese' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề bài đọc</label>
                <input
                  type="text"
                  value={readingTitle}
                  onChange={e => setReadingTitle(e.target.value)}
                  placeholder="Tên bài đọc..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Văn bản bài đọc luyện đọc (Tự biên soạn chuẩn mực)
                </label>
                <textarea
                  value={readingContent}
                  onChange={e => setReadingContent(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="Nhập nội dung bài đọc..."
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                💡 <strong>Lưu ý bản quyền:</strong> Các bài đọc được giáo viên tự biên soạn hoặc phỏng theo chủ đề SGK Kết nối tri thức, đảm bảo tính trong sáng và gần gũi với học sinh tiểu học.
              </div>
            </div>
          )}

          {/* TAB 4: CÂU HỎI BÀI TẬP */}
          {editorTab === 'questions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Danh sách bài tập tương tác ({questions.length} câu)
                </span>
                <button
                  onClick={handleAddQuestion}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm câu hỏi
                </button>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  Chưa có câu hỏi bài tập. Nhấn <strong>"Thêm câu hỏi"</strong> hoặc dùng <strong>"✨ TẠO NỘI DUNG BÀI HỌC BẰNG AI"</strong>.
                </div>
              ) : (
                questions.map((q, qIndex) => (
                  <div key={q.id || qIndex} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-xs text-blue-900 bg-blue-100 px-2 py-0.5 rounded-lg">
                        Câu {qIndex + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <select
                          value={q.cognitiveLevel}
                          onChange={e => handleUpdateQuestion(qIndex, { ...q, cognitiveLevel: e.target.value as CognitiveLevel })}
                          className="text-[11px] font-bold bg-white border border-slate-300 rounded-lg px-2 py-1"
                        >
                          <option value="Nhận biết">Nhận biết</option>
                          <option value="Thông hiểu">Thông hiểu</option>
                          <option value="Vận dụng">Vận dụng</option>
                          <option value="Vận dụng nâng cao">Vận dụng nâng cao</option>
                        </select>
                        <button
                          onClick={() => handleDeleteQuestion(qIndex)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="Xóa câu hỏi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={q.prompt}
                      onChange={e => handleUpdateQuestion(qIndex, { ...q, prompt: e.target.value })}
                      placeholder="Nội dung đề bài..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(q.options || ['A. ', 'B. ', 'C. ', 'D. ']).map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={opt}
                            onChange={e => {
                              const newOpts = [...(q.options || [])];
                              newOpts[optIndex] = e.target.value;
                              handleUpdateQuestion(qIndex, { ...q, options: newOpts });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Đáp án đúng chính xác:</label>
                        <input
                          type="text"
                          value={q.correctAnswer}
                          onChange={e => handleUpdateQuestion(qIndex, { ...q, correctAnswer: e.target.value })}
                          placeholder="Nhập đáp án đúng (ví dụ: A. ... hoặc số)"
                          className="w-full bg-emerald-50 border border-emerald-300 rounded-lg px-2.5 py-1 text-xs font-bold text-emerald-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Lời giải thích chi tiết:</label>
                        <input
                          type="text"
                          value={q.solutionExplanation}
                          onChange={e => handleUpdateQuestion(qIndex, { ...q, solutionExplanation: e.target.value })}
                          placeholder="Hướng dẫn giải cho học sinh..."
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: ÂM THANH & TÀI LIỆU */}
          {editorTab === 'audio' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-black text-slate-900">Âm thanh bài đọc (Giáo viên tự ghi âm hoặc tải tệp MP3)</span>
                <p className="text-xs text-slate-500">
                  Thầy/Cô có thể dán đường dẫn tệp âm thanh MP3 giọng đọc chuẩn Tiếng Việt để thay thế cho TTS khi học sinh nghe đọc mẫu.
                </p>
                <input
                  type="text"
                  value={audioUrl}
                  onChange={e => setAudioUrl(e.target.value)}
                  placeholder="https://.../bai-doc-tieng-viet-lop-2.mp3"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-2">
                <span className="font-bold">Đồng bộ với Kho học liệu:</span>
                <p>
                  Bài học sau khi lưu sẽ được lưu giữ vĩnh viễn trên thiết bị này trong <strong>"QUẢN LÝ NGÂN HÀNG BÀI HỌC"</strong>. Thầy/Cô có thể giao bài tập này cho học sinh Lớp 2 hoặc xuất ra tệp CSV để dùng cho máy khác.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 p-4 px-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Trạng thái: <strong>{status === 'published' ? 'Đã xuất bản' : status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" /> Lưu bài học thật
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
