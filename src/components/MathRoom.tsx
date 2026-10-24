import React, { useState, useEffect } from 'react';
import { CurriculumLesson, QuestionItem, ErrorDiagnosis, LessonStatus } from '../types';
import { StorageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import { requestErrorDiagnosis } from '../services/aiService';
import { LessonEditorModal } from './LessonEditorModal';
import { OFFICIAL_TEXTBOOK_LINKS } from '../data/grade2CurriculumCatalog';
import confetti from 'canvas-confetti';
import { 
  Calculator, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Lightbulb, 
  Award, 
  BookOpen, 
  MapPin,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Search,
  Plus,
  Edit3,
  ExternalLink,
  Layers,
  ChevronLeft,
  Bot
} from 'lucide-react';

interface MathRoomProps {
  currentGrade?: 2;
  onOpenMamAIWithContext: (topicTitle: string, questionPrompt: string) => void;
  initialTopicId?: string;
  isTeacherMode?: boolean;
}

export const MathRoom: React.FC<MathRoomProps> = ({ 
  onOpenMamAIWithContext, 
  initialTopicId,
  isTeacherMode = true 
}) => {
  // Load Grade 2 Math lessons from StorageService (auto-merged with 75 official lessons)
  const [allLessons, setAllLessons] = useState<CurriculumLesson[]>(() =>
    StorageService.getGrade2Lessons('math')
  );

  // Volume filter: 1 (Tập một) or 2 (Tập hai)
  const [selectedVolume, setSelectedVolume] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');

  // Currently viewing/learning lesson
  const [activeLessonId, setActiveLessonId] = useState<string | null>(() => {
    if (initialTopicId && allLessons.some(l => l.id === initialTopicId)) return initialTopicId;
    return allLessons.find(l => l.status === 'published')?.id || allLessons[0]?.id || null;
  });

  const activeLesson = allLessons.find(l => l.id === activeLessonId);

  // Synchronize on initialTopicId
  useEffect(() => {
    if (initialTopicId && allLessons.some(l => l.id === initialTopicId)) {
      setActiveLessonId(initialTopicId);
      const found = allLessons.find(l => l.id === initialTopicId);
      if (found) setSelectedVolume(found.volume);
    }
  }, [initialTopicId]);

  // Editor Modal State
  const [editingLesson, setEditingLesson] = useState<CurriculumLesson | null | undefined>(undefined);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // 5 Activities Phase (1: Khởi động, 2: Khám phá, 3: Luyện tập, 4: Vận dụng, 5: Củng cố)
  const [activeActivityPhase, setActiveActivityPhase] = useState<number>(3); // Default to Practice

  // Practice Questions State
  const questions: QuestionItem[] = activeLesson?.activities?.practice?.questions || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [fillBlankInput, setFillBlankInput] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [activeDiagnosis, setActiveDiagnosis] = useState<ErrorDiagnosis | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const currentQuestion: QuestionItem | undefined = questions[currentQuestionIndex];

  // Warmup Activity State
  const [warmupSelected, setWarmupSelected] = useState<string>('');
  const [warmupRevealed, setWarmupRevealed] = useState(false);

  // Topics list for filtering based on volume
  const volumeLessons = allLessons.filter(l => l.volume === selectedVolume);
  const availableTopics = Array.from(new Set(volumeLessons.map(l => l.topic)));

  // Filtered lessons
  const filteredLessons = volumeLessons.filter(l => {
    const matchesSearch = 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `bài ${l.lessonNumber}`.includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopicFilter === 'all' || l.topic === selectedTopicFilter;
    return matchesSearch && matchesTopic;
  });

  const resetAnswerState = () => {
    setSelectedOption('');
    setFillBlankInput('');
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(null);
    setActiveDiagnosis(null);
  };

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setCurrentQuestionIndex(0);
    resetAnswerState();
    setWarmupSelected('');
    setWarmupRevealed(false);
    setActiveActivityPhase(3); // Start at practice or explore
  };

  const handleCheckAnswer = async () => {
    if (!currentQuestion || isAnswerSubmitted) return;

    let studentAns = '';
    if (currentQuestion.format === 'multiple_choice') {
      studentAns = selectedOption;
    } else {
      studentAns = fillBlankInput.trim();
    }

    if (!studentAns) return;

    const correctAns = currentQuestion.correctAnswer.trim();
    const isCorrect = 
      studentAns.toLowerCase() === correctAns.toLowerCase() ||
      (currentQuestion.format === 'multiple_choice' && studentAns.startsWith(correctAns.substring(0, 2)));

    setIsAnswerSubmitted(true);
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      audioService.playCorrect();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
      StorageService.recordAnswer(currentQuestion.id, true);
    } else {
      audioService.playIncorrect();
      setIsDiagnosing(true);
      const matchedPattern = currentQuestion.commonErrors?.find(
        e => e.pattern.toLowerCase() === studentAns.toLowerCase() || studentAns.startsWith(e.pattern)
      );

      if (matchedPattern) {
        const diag: ErrorDiagnosis = {
          errorCategory: matchedPattern.category,
          explanation: matchedPattern.explanation,
          pedagogicalHint: matchedPattern.hint,
          source: 'rule_engine',
        };
        setActiveDiagnosis(diag);
        setIsDiagnosing(false);
        StorageService.recordAnswer(currentQuestion.id, false, matchedPattern.category);
      } else {
        try {
          const diag = await requestErrorDiagnosis(
            currentQuestion.prompt,
            studentAns,
            currentQuestion.correctAnswer,
            'math',
            2,
            activeLesson?.title || ''
          );
          setActiveDiagnosis(diag);
          StorageService.recordAnswer(currentQuestion.id, false, diag.errorCategory);
        } catch {
          setActiveDiagnosis({
            errorCategory: 'Nhầm lẫn kết quả tính toán',
            explanation: 'Kết quả chưa trùng khớp với đáp án chính xác của bài toán.',
            pedagogicalHint: 'Em hãy đặt tính thẳng cột từ phải sang trái rồi kiểm tra lại từng số nhé!',
            source: 'offline_heuristic',
          });
          StorageService.recordAnswer(currentQuestion.id, false, 'Nhầm lẫn kết quả');
        } finally {
          setIsDiagnosing(false);
        }
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetAnswerState();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      resetAnswerState();
    }
  };

  const handleOpenAddLesson = () => {
    setEditingLesson(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditLesson = (lessonItem: CurriculumLesson, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingLesson(lessonItem);
    setIsEditorOpen(true);
  };

  const handleLessonSaved = (saved: CurriculumLesson) => {
    const updated = StorageService.getGrade2Lessons('math');
    setAllLessons(updated);
    setActiveLessonId(saved.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Hero Banner Navy - Educational AI Premium */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-blue-800/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-blue-400" /> PHÒNG TOÁN AI – LỚP 2
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              KHÁM PHÁ & CHINH PHỤC TOÁN HỌC
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Chương trình chuẩn GDPT 2018 (Kết nối tri thức với cuộc sống). Gồm 75 bài học với 5 hoạt động sư phạm và chẩn đoán lỗi sai AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={selectedVolume === 1 ? OFFICIAL_TEXTBOOK_LINKS.mathVol1 : OFFICIAL_TEXTBOOK_LINKS.mathVol2}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 flex items-center gap-1.5 transition-all"
              title="Mở sách giáo khoa Toán 2 gốc trên taphuan.nxbgd.vn trong tab riêng"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              <span>Mở SGK Toán 2 Tập {selectedVolume}</span>
            </a>

            {isTeacherMode && (
              <button
                onClick={handleOpenAddLesson}
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> + Thêm bài Toán
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Volume Tabs: [ Tập một ] [ Tập hai ] */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedVolume(1);
              setSelectedTopicFilter('all');
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              selectedVolume === 1
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>📘 TOÁN 2 – TẬP MỘT</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md">36 bài</span>
          </button>

          <button
            onClick={() => {
              setSelectedVolume(2);
              setSelectedTopicFilter('all');
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              selectedVolume === 2
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>📗 TOÁN 2 – TẬP HAI</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md">39 bài</span>
          </button>
        </div>

        {/* Toolbar: [ Tìm bài học... ] [ Chọn chủ đề ] */}
        <div className="flex flex-1 sm:flex-initial items-center gap-2 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm tên bài, số bài..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedTopicFilter}
            onChange={e => setSelectedTopicFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 max-w-[200px] truncate focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả chủ đề ({availableTopics.length})</option>
            {availableTopics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Workspace Grid: Lesson Catalog (Left Column) + Active Lesson Interactive Room (Right Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lesson Cards List (Scrollable Vertical) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Danh mục bài học ({filteredLessons.length} bài)
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Tập {selectedVolume}
            </span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredLessons.map(item => {
              const isActive = activeLessonId === item.id;
              const isPublished = item.status === 'published';
              const qCount = item.activities?.practice?.questions?.length || 0;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectLesson(item.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 relative ${
                    isActive
                      ? 'bg-blue-50/90 border-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.lessonNumber}
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-medium line-clamp-1">
                          {item.topic}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isTeacherMode && (
                        <button
                          onClick={e => handleOpenEditLesson(item, e)}
                          className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-blue-600 transition-colors"
                          title="Chỉnh sửa bài học"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                        isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isPublished ? 'Đã duyệt' : 'Đang biên soạn'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                    <span className="text-slate-400 font-medium">
                      {qCount > 0 ? `${qCount} câu hỏi` : 'Chưa có câu hỏi'}
                    </span>
                    <span className={`font-bold flex items-center gap-0.5 ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>
                      {isActive ? 'Đang học' : 'Học ngay'} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Lesson 5 Activities Workspace */}
        <div className="lg:col-span-8 space-y-4">
          {activeLesson ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
              
              {/* Header Active Lesson */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                      {activeLesson.topic}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {activeLesson.week || 'Tuần học'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {activeLesson.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenMamAIWithContext(activeLesson.title, currentQuestion?.prompt || '')}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-all"
                  >
                    <Bot className="w-4 h-4 text-emerald-600" />
                    <span>Hỏi Mầm AI</span>
                  </button>

                  {isTeacherMode && (
                    <button
                      onClick={() => handleOpenEditLesson(activeLesson)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sửa bài</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 5 Activities Navigation Tabs (A. Khởi động -> B. Khám phá -> C. Luyện tập -> D. Vận dụng -> E. Củng cố) */}
              <div className="grid grid-cols-5 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                {[
                  { phase: 1, label: 'A. Khởi động' },
                  { phase: 2, label: 'B. Khám phá' },
                  { phase: 3, label: 'C. Luyện tập' },
                  { phase: 4, label: 'D. Vận dụng' },
                  { phase: 5, label: 'E. Củng cố' },
                ].map(p => (
                  <button
                    key={p.phase}
                    onClick={() => setActiveActivityPhase(p.phase)}
                    className={`py-2 px-1 text-center text-[11px] font-black rounded-xl transition-all cursor-pointer ${
                      activeActivityPhase === p.phase
                        ? 'bg-white text-blue-800 shadow-xs ring-1 ring-blue-100'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* ACTIVITY 1: KHỞI ĐỘNG */}
              {activeActivityPhase === 1 && (
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md">
                      Hoạt động A
                    </span>
                    <h4 className="text-sm font-extrabold text-amber-950">Khởi Động & Kết Nối</h4>
                  </div>

                  {activeLesson.activities?.warmup ? (
                    <div className="space-y-3">
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                        {activeLesson.activities.warmup.scenario}
                      </p>

                      {activeLesson.activities.warmup.visualAid && (
                        <div className="p-3 bg-white rounded-xl border border-amber-200 font-mono text-center text-sm font-bold text-amber-900">
                          {activeLesson.activities.warmup.visualAid}
                        </div>
                      )}

                      {activeLesson.activities.warmup.question && (
                        <div className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-2">
                          <p className="text-xs font-bold text-slate-900">
                            ❓ {activeLesson.activities.warmup.question}
                          </p>

                          {activeLesson.activities.warmup.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {activeLesson.activities.warmup.options.map(opt => (
                                <button
                                  key={opt}
                                  onClick={() => setWarmupSelected(opt)}
                                  className={`p-2 rounded-lg text-xs font-bold text-left border transition-all ${
                                    warmupSelected === opt
                                      ? 'bg-amber-100 border-amber-500 text-amber-900'
                                      : 'bg-slate-50 border-slate-200 text-slate-700'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={() => setWarmupRevealed(true)}
                            className="text-xs font-bold text-amber-700 hover:text-amber-800 underline pt-1 block"
                          >
                            Xem gợi ý khởi động →
                          </button>

                          {warmupRevealed && activeLesson.activities.warmup.answer && (
                            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 font-bold animate-in fade-in">
                              💡 Đáp án gợi mở: {activeLesson.activities.warmup.answer}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-white rounded-xl text-xs text-slate-500 border border-amber-200 text-center">
                      Bài học này đang được giáo viên biên soạn hoạt động Khởi động. Thầy/Cô có thể nhấn "Sửa bài" hoặc tạo tự động bằng AI!
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => setActiveActivityPhase(2)}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      Sang phần Khám phá <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ACTIVITY 2: KHÁM PHÁ */}
              {activeActivityPhase === 2 && (
                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase bg-blue-200 text-blue-900 px-2 py-0.5 rounded-md">
                      Hoạt động B
                    </span>
                    <h4 className="text-sm font-extrabold text-blue-950">Khám Phá Kiến Thức Trọng Tâm</h4>
                  </div>

                  {activeLesson.activities?.explore?.keyPoints ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-white rounded-xl border border-blue-200 space-y-2">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                          Kiến thức cốt lõi cần nhớ:
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-800 leading-relaxed list-disc list-inside">
                          {activeLesson.activities.explore.keyPoints.map((pt, i) => (
                            <li key={i} className="font-medium">{pt}</li>
                          ))}
                        </ul>
                      </div>

                      {activeLesson.activities.explore.examples && (
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-slate-700">Ví dụ minh họa từng bước:</span>
                          {activeLesson.activities.explore.examples.map((ex, i) => (
                            <div key={i} className="p-3 bg-white rounded-xl border border-blue-200 space-y-1 text-xs">
                              <p className="font-bold text-blue-900">Bài toán: {ex.problem}</p>
                              <p className="text-slate-600 leading-relaxed font-mono">👉 {ex.solution}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-white rounded-xl text-xs text-slate-500 border border-blue-200 text-center">
                      Nội dung Khám phá đang được hoàn thiện.
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setActiveActivityPhase(1)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Quay lại Khởi động
                    </button>
                    <button
                      onClick={() => setActiveActivityPhase(3)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      Vào Luyện tập ngay <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ACTIVITY 3: LUYỆN TẬP (INTERACTIVE QUESTIONS) */}
              {activeActivityPhase === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md">
                        Hoạt động C
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        Luyện Tập Thực Hành ({questions.length} câu)
                      </h4>
                    </div>

                    {questions.length > 0 && (
                      <span className="text-xs font-bold text-slate-500">
                        Câu {currentQuestionIndex + 1} / {questions.length}
                      </span>
                    )}
                  </div>

                  {questions.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                      <p className="text-xs text-slate-600 font-medium">
                        Bài học này đang ở trạng thái <strong>"Đang biên soạn"</strong>.
                      </p>
                      {isTeacherMode && (
                        <button
                          onClick={() => handleOpenEditLesson(activeLesson)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-4 py-2 rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Tạo câu hỏi bằng AI cho bài này</span>
                        </button>
                      )}
                    </div>
                  ) : currentQuestion ? (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                      
                      {/* Question Prompt */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase bg-white px-2 py-0.5 rounded-md border border-slate-200 text-blue-700">
                            {currentQuestion.cognitiveLevel}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                          {currentQuestion.prompt}
                        </h4>
                      </div>

                      {/* Multiple Choice Options */}
                      {currentQuestion.format === 'multiple_choice' && currentQuestion.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {currentQuestion.options.map((opt, i) => {
                            const isSelected = selectedOption === opt;
                            let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-blue-300';

                            if (isAnswerSubmitted) {
                              const isCorrectOpt = opt.toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ||
                                (opt.startsWith(currentQuestion.correctAnswer.substring(0, 2)));
                              if (isCorrectOpt) {
                                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200';
                              } else if (isSelected) {
                                btnStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                              }
                            } else if (isSelected) {
                              btnStyle = 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-100';
                            }

                            return (
                              <button
                                key={i}
                                disabled={isAnswerSubmitted}
                                onClick={() => setSelectedOption(opt)}
                                className={`p-3 rounded-xl border-2 text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {isAnswerSubmitted && opt.toLowerCase() === currentQuestion.correctAnswer.toLowerCase() && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Fill Blank Input */}
                      {currentQuestion.format === 'fill_blank' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            disabled={isAnswerSubmitted}
                            value={fillBlankInput}
                            onChange={e => setFillBlankInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleCheckAnswer()}
                            placeholder="Nhập câu trả lời hoặc số..."
                            className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                          />
                        </div>
                      )}

                      {/* Check Answer Button & Feedback */}
                      {!isAnswerSubmitted ? (
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={handleCheckAnswer}
                            disabled={!selectedOption && !fillBlankInput.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md disabled:opacity-40 transition-all cursor-pointer"
                          >
                            Kiểm tra kết quả
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 pt-2">
                          {isAnswerCorrect ? (
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-1 text-xs">
                                <p className="font-black text-emerald-900">Chính xác tuyệt vời! +5 sao thưởng 🌟</p>
                                <p className="text-emerald-800 leading-relaxed font-medium">
                                  {currentQuestion.solutionExplanation}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 space-y-2">
                              <div className="flex items-start gap-2.5">
                                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                <div className="space-y-1 text-xs">
                                  <p className="font-black text-rose-900">
                                    Chưa chính xác rồi. Đáp án đúng là: <strong>{currentQuestion.correctAnswer}</strong>
                                  </p>
                                  <p className="text-slate-700 leading-relaxed">
                                    {currentQuestion.solutionExplanation}
                                  </p>
                                </div>
                              </div>

                              {/* AI Error Diagnosis Card */}
                              {activeDiagnosis && (
                                <div className="mt-2 p-3 bg-white rounded-lg border border-amber-300 space-y-1 text-xs">
                                  <span className="font-black text-amber-900 flex items-center gap-1">
                                    <Lightbulb className="w-4 h-4 text-amber-600" />
                                    Mầm AI gợi ý sư phạm: {activeDiagnosis.errorCategory}
                                  </span>
                                  <p className="text-slate-600 leading-relaxed">
                                    {activeDiagnosis.pedagogicalHint}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Navigation between questions */}
                          <div className="flex items-center justify-between pt-2">
                            <button
                              onClick={handlePrevQuestion}
                              disabled={currentQuestionIndex === 0}
                              className="text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 flex items-center gap-1 cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" /> Câu trước
                            </button>

                            {currentQuestionIndex < questions.length - 1 ? (
                              <button
                                onClick={handleNextQuestion}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                              >
                                Câu tiếp theo <ArrowRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => setActiveActivityPhase(4)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                              >
                                Sang phần Vận dụng <ArrowRight className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  ) : null}
                </div>
              )}

              {/* ACTIVITY 4: VẬN DỤNG */}
              {activeActivityPhase === 4 && (
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                      Hoạt động D
                    </span>
                    <h4 className="text-sm font-extrabold text-emerald-950">Vận Dụng Thực Tế (An Giang)</h4>
                  </div>

                  {activeLesson.activities?.application ? (
                    <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-black">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span>Bối cảnh: {activeLesson.activities.application.localContext || 'Xã Vĩnh Điều, An Giang'}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {activeLesson.activities.application.scenario}
                      </p>
                      <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 font-bold text-emerald-950">
                        Nhiệm vụ: {activeLesson.activities.application.task}
                      </div>
                      {activeLesson.activities.application.answer && (
                        <p className="text-slate-600 text-[11px] pt-1">
                          💡 Gợi ý giải: {activeLesson.activities.application.answer}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-white rounded-xl text-xs text-slate-500 border border-emerald-200 text-center">
                      Nội dung vận dụng đang được hoàn thiện.
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setActiveActivityPhase(3)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Quay lại Luyện tập
                    </button>
                    <button
                      onClick={() => setActiveActivityPhase(5)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      Củng cố bài học <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ACTIVITY 5: CỦNG CỐ */}
              {activeActivityPhase === 5 && (
                <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md">
                      Hoạt động E
                    </span>
                    <h4 className="text-sm font-extrabold text-purple-950">Củng Cố & Đánh Giá Năng Lực</h4>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-purple-200 space-y-3 text-xs">
                    <p className="text-slate-800 font-bold">
                      {activeLesson.activities?.consolidation?.summary || `Chúc mừng em đã hoàn thành bài học ${activeLesson.title}!`}
                    </p>

                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 flex items-center gap-2">
                      <Bot className="w-5 h-5 text-purple-600 shrink-0" />
                      <p className="text-purple-900 italic font-medium">
                        "{activeLesson.activities?.consolidation?.mamAINote || 'Mỗi học sinh một hành trình, mỗi tiến bộ một niềm vui! Mầm AI tự hào về em!'}"
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setActiveActivityPhase(3)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Luyện tập lại
                    </button>
                    <button
                      onClick={() => {
                        confetti({ particleCount: 50 });
                        audioService.playCelebration();
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      🎉 Hoàn thành bài học
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              Vui lòng chọn bài học từ danh sách bên trái.
            </div>
          )}
        </div>

      </div>

      {/* Lesson Editor Modal */}
      {isEditorOpen && (
        <LessonEditorModal
          lesson={editingLesson}
          defaultSubject="math"
          defaultVolume={selectedVolume}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSaved={handleLessonSaved}
        />
      )}

    </div>
  );
};
