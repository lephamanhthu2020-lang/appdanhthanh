import React, { useState } from 'react';
import { GradeLevel, LessonTopic, QuestionItem, ErrorDiagnosis } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { StorageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import { requestErrorDiagnosis } from '../services/aiService';
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
  BrainCircuit
} from 'lucide-react';

interface MathRoomProps {
  currentGrade: GradeLevel;
  onOpenMamAIWithContext: (topicTitle: string, questionPrompt: string) => void;
}

export const MathRoom: React.FC<MathRoomProps> = ({ currentGrade, onOpenMamAIWithContext }) => {
  const mathTopics = CURRICULUM_DATA.filter(t => t.grade === currentGrade && t.subject === 'math');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(mathTopics[0]?.id || '');
  const activeTopic = mathTopics.find(t => t.id === selectedTopicId) || mathTopics[0];

  // Pedagogical Phase Navigation (1 to 7)
  const [activePhase, setActivePhase] = useState<number>(3); // default to Luyện tập

  // Exercise state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [fillBlankInput, setFillBlankInput] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [activeDiagnosis, setActiveDiagnosis] = useState<ErrorDiagnosis | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const questions = activeTopic?.questions || [];
  const currentQuestion: QuestionItem | undefined = questions[currentQuestionIndex];

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setCurrentQuestionIndex(0);
    resetAnswerState();
  };

  const resetAnswerState = () => {
    setSelectedOption('');
    setFillBlankInput('');
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(null);
    setActiveDiagnosis(null);
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
    // Normalize comparison: check exact or letter match
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
      // Error diagnosis: check defined pattern first, then query server AI
      setIsDiagnosing(true);
      const matchedPattern = currentQuestion.commonErrors?.find(
        e => e.pattern.toLowerCase() === studentAns.toLowerCase() || studentAns.startsWith(e.pattern)
      );

      if (matchedPattern) {
        const diag: ErrorDiagnosis = {
          errorCategory: matchedPattern.category,
          explanation: matchedPattern.explanation,
          pedagogicalHint: matchedPattern.hint,
          similarPracticeQuestion: `Em hãy thử áp dụng quy tắc vào phép tính: ${currentQuestion.prompt}`,
          source: 'rule_engine',
        };
        setActiveDiagnosis(diag);
        StorageService.recordAnswer(currentQuestion.id, false, matchedPattern.category);
        setIsDiagnosing(false);
      } else {
        // Query Gemini API
        try {
          const diag = await requestErrorDiagnosis(
            currentQuestion.prompt,
            studentAns,
            correctAns,
            'math',
            currentGrade,
            activeTopic.title
          );
          setActiveDiagnosis(diag);
          StorageService.recordAnswer(currentQuestion.id, false, diag.errorCategory);
        } catch {
          // Fallback
          setActiveDiagnosis({
            errorCategory: 'Nhầm phép tính hoặc số nhớ',
            explanation: `Em chọn "${studentAns}", trong khi kết quả đúng là "${correctAns}".`,
            pedagogicalHint: 'Em hãy đặt tính ra giấy nháp cẩn thận từng hàng từ phải sang trái nhé!',
            source: 'offline_heuristic',
          });
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5" /> PHÒNG TOÁN HỌC AI - LỚP {currentGrade}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                Chuẩn GDPT 2018
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Khám Phá & Chinh Phục Toán Học
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Hệ thống hướng dẫn 7 bước chuẩn sư phạm: từ khám phá trực quan, luyện tập có phản hồi đến sửa chữa lỗi sai bằng AI.
            </p>
          </div>

          <button
            onClick={() => onOpenMamAIWithContext(activeTopic.title, currentQuestion?.prompt || '')}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all shrink-0 text-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            Hỏi Mầm AI về bài này
          </button>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
          {mathTopics.map(t => {
            const isSel = t.id === selectedTopicId;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTopic(t.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 border ${
                  isSel
                    ? 'bg-white text-blue-900 border-white shadow-md shadow-blue-950/40'
                    : 'bg-white/10 hover:bg-white/20 text-blue-100 border-white/10'
                }`}
              >
                {t.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7-Step Pedagogical Navigation */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none text-xs font-bold">
          {[
            { step: 1, label: '1. Khám phá kiến thức' },
            { step: 2, label: '2. Ví dụ trực quan' },
            { step: 3, label: '3. Luyện tập cơ bản' },
            { step: 4, label: '4. Luyện tập thông hiểu' },
            { step: 5, label: '5. Vận dụng thực tế' },
            { step: 6, label: '6. Thử thách nâng cao' },
            { step: 7, label: '7. Tổng kết kiến thức' },
          ].map(s => {
            const isCurrent = activePhase === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setActivePhase(s.step)}
                className={`px-3 py-2 rounded-xl transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Phase 1 & 2: Theory and Visual Examples */}
      {(activePhase === 1 || activePhase === 2 || activePhase === 7) && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl">
              💡
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase text-blue-600 tracking-wider">
                {activePhase === 1 ? 'Khám phá kiến thức mới' : activePhase === 2 ? 'Ví dụ trực quan sinh động' : 'Ghi nhớ & Tổng kết'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">{activeTopic.title}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100 space-y-3">
              <h4 className="font-extrabold text-blue-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" /> Mục tiêu học tập cần đạt:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {activeTopic.learningGoals.map((g, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-100 space-y-3">
              <h4 className="font-extrabold text-emerald-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" /> Gắn liền thực tiễn An Giang:
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeTopic.anGiangNote || 'Kiến thức được kết nối gần gũi với đời sống nông thôn, chợ nổi sông nước và tinh thần vượt khó của học sinh Trường TH-THCS Vĩnh Điều.'}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActivePhase(3)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 text-sm shadow-sm transition-all"
            >
              Bắt đầu luyện tập bài tập ngay <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Phase 3, 4, 5, 6: Interactive Exercise Engine */}
      {(activePhase >= 3 && activePhase <= 6) && currentQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Question Card (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* Question Progress & Meta */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full">
                  Câu hỏi {currentQuestionIndex + 1} / {questions.length}
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Mức độ: {currentQuestion.cognitiveLevel}
                </span>
              </div>

              {currentQuestion.isAnGiangContext && (
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" /> Bối cảnh An Giang
                </span>
              )}
            </div>

            {/* Prompt */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                {currentQuestion.prompt}
              </h3>
              {currentQuestion.visualAid && (
                <div className="text-3xl p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                  {currentQuestion.visualAid}
                </div>
              )}
            </div>

            {/* Options or Fill Blank */}
            {currentQuestion.format === 'multiple_choice' && currentQuestion.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let optStyle = 'border-slate-200 hover:border-blue-400 bg-white text-slate-800';

                  if (isAnswerSubmitted) {
                    if (opt.startsWith(currentQuestion.correctAnswer.substring(0, 2)) || opt === currentQuestion.correctAnswer) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-400';
                    } else if (isSelected && !isAnswerCorrect) {
                      optStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !isAnswerSubmitted && setSelectedOption(opt)}
                      disabled={isAnswerSubmitted}
                      className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && (opt.startsWith(currentQuestion.correctAnswer.substring(0, 2)) || opt === currentQuestion.correctAnswer) && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !isAnswerCorrect && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.format === 'fill_blank' && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-500 mb-2">
                  Nhập câu trả lời của em:
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={fillBlankInput}
                    onChange={e => setFillBlankInput(e.target.value)}
                    disabled={isAnswerSubmitted}
                    placeholder="Ví dụ: 12 hoặc 5,2..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-base font-bold text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                  />
                  {!isAnswerSubmitted && (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={!fillBlankInput.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold px-6 py-3 rounded-2xl transition-all"
                    >
                      Kiểm tra
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Submit & Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                >
                  ← Câu trước
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                >
                  Câu tiếp theo →
                </button>
              </div>

              {!isAnswerSubmitted ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={currentQuestion.format === 'multiple_choice' ? !selectedOption : !fillBlankInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-extrabold px-6 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all text-sm flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Nộp bài kiểm tra
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {!isAnswerCorrect && (
                    <button
                      onClick={resetAnswerState}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Thử làm lại
                    </button>
                  )}
                  {currentQuestionIndex < questions.length - 1 && (
                    <button
                      onClick={handleNextQuestion}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      Sang câu kế tiếp <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Correct Solution Box */}
            {isAnswerSubmitted && isAnswerCorrect && (
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Xuất sắc! Em đã trả lời hoàn toàn chính xác! (+5 Sao thưởng)
                </div>
                <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
                  {currentQuestion.solutionExplanation}
                </p>
              </div>
            )}
          </div>

          {/* AI Pedagogical Error Diagnostics Panel (1 Col - Core Feature) */}
          <div className="space-y-4">
            {/* Diagnostics Header Card */}
            <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-sm border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                <BrainCircuit className="w-4 h-4" />
                HỆ THỐNG AI PHÁT HIỆN LỖI SAI
              </div>
              <h4 className="text-base font-extrabold text-white">Chẩn đoán Sư phạm GDPT 2018</h4>
              <p className="text-xs text-slate-300 mt-1">
                AI không chỉ nói đúng hay sai mà chỉ ra nguyên nhân nhận thức, giúp em hiểu tận gốc vấn đề.
              </p>
            </div>

            {/* Diagnostic Result State */}
            {isDiagnosing && (
              <div className="bg-white rounded-3xl p-6 border border-amber-200 text-center space-y-3 shadow-xs">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700">Mầm AI đang phân tích nguyên nhân nhầm lẫn...</p>
              </div>
            )}

            {isAnswerSubmitted && !isAnswerCorrect && activeDiagnosis && (
              <div className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-md space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                    ⚠️
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider">
                      Phát hiện dạng lỗi
                    </span>
                    <h5 className="text-sm font-extrabold text-rose-950">{activeDiagnosis.errorCategory}</h5>
                  </div>
                </div>

                <div className="bg-rose-50/70 rounded-2xl p-3.5 border border-rose-100 text-xs text-slate-800 leading-relaxed">
                  <span className="font-bold text-rose-900">Giải thích: </span>
                  {activeDiagnosis.explanation}
                </div>

                <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-xs text-slate-800 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                    <Lightbulb className="w-4 h-4 text-amber-600" /> Gợi ý định hướng tư duy:
                  </div>
                  {activeDiagnosis.pedagogicalHint}
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Nguồn: {activeDiagnosis.source === 'gemini' ? 'Gemini 3.8 AI' : 'Bộ quy tắc sư phạm'}
                  </span>
                  <button
                    onClick={() => onOpenMamAIWithContext(activeTopic.title, currentQuestion.prompt)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Hỏi sâu hơn <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Waiting State */}
            {(!isAnswerSubmitted || isAnswerCorrect) && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-xl">
                  🌱
                </div>
                <h5 className="text-sm font-bold text-slate-800">Mầm AI luôn lắng nghe</h5>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Hãy làm bài cẩn thận. Nếu gặp khó khăn hay trả lời chưa đúng, Mầm AI sẽ lập tức đưa ra lời gợi ý giúp em tự làm lại!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
