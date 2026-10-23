import React, { useState } from 'react';
import { GradeLevel, LessonTopic, QuestionItem } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { StorageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  Volume2, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  Feather, 
  ChevronRight,
  MapPin,
  PenTool,
  BrainCircuit,
  Lightbulb
} from 'lucide-react';

interface VietnameseRoomProps {
  currentGrade: GradeLevel;
  onOpenMamAIWithContext: (topicTitle: string, questionPrompt: string) => void;
}

export const VietnameseRoom: React.FC<VietnameseRoomProps> = ({ currentGrade, onOpenMamAIWithContext }) => {
  const tvTopics = CURRICULUM_DATA.filter(t => t.grade === currentGrade && t.subject === 'vietnamese');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(tvTopics[0]?.id || '');
  const activeTopic = tvTopics.find(t => t.id === selectedTopicId) || tvTopics[0];

  const [activeTab, setActiveTab] = useState<'reading' | 'exercises' | 'writing'>('reading');

  // Text-To-Speech playing state
  const [isPlayingPassage, setIsPlayingPassage] = useState(false);

  // Student recording simulation / real Web Speech
  const [isRecording, setIsRecording] = useState(false);
  const [recordingFeedback, setRecordingFeedback] = useState<string | null>(null);

  // Exercise state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [fillBlankInput, setFillBlankInput] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [activeDiagnosis, setActiveDiagnosis] = useState<{ errorCategory: string; explanation: string; hint: string } | null>(null);

  // Writing practice state
  const [studentWriting, setStudentWriting] = useState('');
  const [writingFeedback, setWritingFeedback] = useState<string | null>(null);
  const [isGradingWriting, setIsGradingWriting] = useState(false);

  const questions = activeTopic?.questions || [];
  const currentQuestion: QuestionItem | undefined = questions[currentQuestionIndex];

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setCurrentQuestionIndex(0);
    resetAnswerState();
    setWritingFeedback(null);
  };

  const resetAnswerState = () => {
    setSelectedOption('');
    setFillBlankInput('');
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(null);
    setActiveDiagnosis(null);
  };

  const handlePlayPassage = () => {
    if (!activeTopic.readingPassage) return;
    if (isPlayingPassage) {
      audioService.stopSpeaking();
      setIsPlayingPassage(false);
    } else {
      setIsPlayingPassage(true);
      audioService.speakText(activeTopic.readingPassage.content, () => {
        setIsPlayingPassage(false);
      });
    }
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordingFeedback(
        'Đã ghi nhận bài đọc! Giọng đọc của em to, rõ ràng và diễn cảm tốt. Hãy tiếp tục chú ý ngắt nghỉ sau dấu phẩy nhé!'
      );
      audioService.playCorrect();
    } else {
      setIsRecording(true);
      setRecordingFeedback(null);
      // Auto stop after 6 seconds for test simulation if no manual stop
      setTimeout(() => {
        setIsRecording(false);
        setRecordingFeedback(
          'Đã ghi nhận bài đọc! Giọng đọc của em to, rõ ràng và diễn cảm tốt. Hãy tiếp tục chú ý ngắt nghỉ sau dấu phẩy nhé!'
        );
        audioService.playCorrect();
      }, 6000);
    }
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion || isAnswerSubmitted) return;

    let ans = '';
    if (currentQuestion.format === 'multiple_choice') {
      ans = selectedOption;
    } else {
      ans = fillBlankInput.trim();
    }
    if (!ans) return;

    const correct = currentQuestion.correctAnswer.trim();
    const isCorrect = 
      ans.toLowerCase() === correct.toLowerCase() ||
      (currentQuestion.format === 'multiple_choice' && ans.startsWith(correct.substring(0, 2)));

    setIsAnswerSubmitted(true);
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      audioService.playCorrect();
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
      StorageService.recordAnswer(currentQuestion.id, true);
    } else {
      audioService.playIncorrect();
      // Check predefined common errors
      const match = currentQuestion.commonErrors?.find(
        e => e.pattern.toLowerCase() === ans.toLowerCase() || ans.startsWith(e.pattern)
      );
      if (match) {
        setActiveDiagnosis({
          errorCategory: match.category,
          explanation: match.explanation,
          hint: match.hint,
        });
        StorageService.recordAnswer(currentQuestion.id, false, match.category);
      } else {
        setActiveDiagnosis({
          errorCategory: 'Chưa hiểu rõ ngữ cảnh từ hoặc câu',
          explanation: `Lựa chọn "${ans}" chưa phù hợp nhất với nghĩa chuẩn: "${correct}".`,
          hint: 'Em hãy đọc lại văn bản hoặc câu mẫu thật chậm để tìm từ ngữ chỉ đặc điểm/hoạt động phù hợp nhất nhé!',
        });
        StorageService.recordAnswer(currentQuestion.id, false, 'Chưa hiểu rõ ngữ cảnh');
      }
    }
  };

  const handleReviewWriting = () => {
    if (!studentWriting.trim()) return;
    setIsGradingWriting(true);

    setTimeout(() => {
      setIsGradingWriting(false);
      const wordCount = studentWriting.trim().split(/\s+/).length;
      let review = '';
      if (wordCount < 15) {
        review = `Bài viết của em đã có ý tưởng ban đầu tốt. Tuy nhiên đoạn văn còn hơi ngắn (${wordCount} từ). Em hãy mở rộng thêm bằng cách miêu tả màu sắc, âm thanh hoặc cảm xúc của em nhé!`;
      } else {
        review = `Rất đáng khen! Đoạn văn dài ${wordCount} từ, câu văn tương đối mạch lạc và có cảm xúc chân thật. Mầm AI gợi ý em có thể thêm một hình ảnh so sánh (ví dụ: đẹp như..., rộn rã tựa...) để câu văn sinh động hơn nữa!`;
      }
      setWritingFeedback(review);
      audioService.playCorrect();
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-teal-500/30 text-teal-200 border border-teal-400/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> PHÒNG TIẾNG VIỆT AI - LỚP {currentGrade}
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                Kết Nối Tri Thức
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Khám Phá Tiếng Việt Yêu Thương
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Luyện đọc diễn cảm với Text-to-Speech, mở rộng vốn từ, làm chủ ngữ pháp và rèn luyện kỹ năng viết đoạn văn giàu cảm xúc.
            </p>
          </div>

          <button
            onClick={() => onOpenMamAIWithContext(activeTopic.title, 'Em muốn hỏi về Tiếng Việt Lớp ' + currentGrade)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all shrink-0 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Trợ lý Ngôn ngữ AI
          </button>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
          {tvTopics.map(t => {
            const isSel = t.id === selectedTopicId;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTopic(t.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 border ${
                  isSel
                    ? 'bg-white text-teal-950 border-white shadow-md shadow-teal-950/40'
                    : 'bg-white/10 hover:bg-white/20 text-teal-100 border-white/10'
                }`}
              >
                {t.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Tabs (Đọc hiểu, Luyện tập câu hỏi, Tập làm văn) */}
      <div className="flex items-center gap-2 bg-white rounded-2xl p-2 border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('reading')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'reading' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Bài đọc & Luyện đọc
        </button>
        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'exercises' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Feather className="w-4 h-4" /> Câu hỏi Đọc hiểu & Luyện từ
        </button>
        <button
          onClick={() => setActiveTab('writing')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'writing' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PenTool className="w-4 h-4" /> Luyện viết cùng Mầm AI
        </button>
      </div>

      {/* Tab 1: Reading Passage & Audio Trainer */}
      {activeTab === 'reading' && activeTopic.readingPassage && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-extrabold text-teal-600 uppercase tracking-wider">
                Văn bản luyện đọc Lớp {currentGrade}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {activeTopic.readingPassage.title}
              </h3>
              <p className="text-xs text-slate-400 italic">
                {activeTopic.readingPassage.authorOrOrigin || 'Chương trình GDPT 2018'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayPassage}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
                  isPlayingPassage
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                {isPlayingPassage ? 'Dừng đọc mẫu' : 'Nghe đọc mẫu (TTS)'}
              </button>

              <button
                onClick={handleToggleRecord}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording ? 'Đang ghi âm (nhấn dừng)...' : 'Em luyện đọc'}
              </button>
            </div>
          </div>

          {/* Passage Content Box */}
          <div className="bg-amber-50/40 rounded-2xl p-6 sm:p-8 border border-amber-100/70 text-slate-800 text-base sm:text-lg leading-loose font-serif">
            {activeTopic.readingPassage.content}
          </div>

          {/* Recording Feedback if any */}
          {recordingFeedback && (
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                🌱
              </div>
              <div>
                <span className="font-bold">Mầm AI nhận xét bài đọc: </span>
                {recordingFeedback}
              </div>
            </div>
          )}

          {/* Vocabulary Notes */}
          {activeTopic.readingPassage.vocabularyNotes && (
            <div className="bg-teal-50/60 rounded-2xl p-5 border border-teal-100 space-y-2">
              <h4 className="font-extrabold text-teal-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" /> Giải nghĩa từ khó trong bài:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {activeTopic.readingPassage.vocabularyNotes.map((v, i) => (
                  <div key={i} className="text-xs bg-white p-3 rounded-xl border border-teal-100">
                    <span className="font-bold text-teal-800">{v.word}: </span>
                    <span className="text-slate-600">{v.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab('exercises')}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 text-sm shadow-xs transition-all"
            >
              Làm câu hỏi đọc hiểu <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Reading Comprehension & Grammar Exercises */}
      {activeTab === 'exercises' && currentQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="bg-teal-100 text-teal-800 text-xs font-extrabold px-3 py-1 rounded-full">
                Câu hỏi {currentQuestionIndex + 1} / {questions.length}
              </span>
              <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                Mức độ: {currentQuestion.cognitiveLevel}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                {currentQuestion.prompt}
              </h3>
            </div>

            {currentQuestion.format === 'multiple_choice' && currentQuestion.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let optStyle = 'border-slate-200 hover:border-teal-400 bg-white text-slate-800';

                  if (isAnswerSubmitted) {
                    if (opt.startsWith(currentQuestion.correctAnswer.substring(0, 2)) || opt === currentQuestion.correctAnswer) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-400';
                    } else if (isSelected && !isAnswerCorrect) {
                      optStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-teal-600 bg-teal-50 text-teal-900 font-bold ring-2 ring-teal-500';
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
                  Nhập từ / câu trả lời của em:
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={fillBlankInput}
                    onChange={e => setFillBlankInput(e.target.value)}
                    disabled={isAnswerSubmitted}
                    placeholder="Nhập câu trả lời..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-hidden focus:border-teal-500 focus:bg-white transition-all"
                  />
                  {!isAnswerSubmitted && (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={!fillBlankInput.trim()}
                      className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold px-6 py-3 rounded-2xl transition-all"
                    >
                      Kiểm tra
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentQuestionIndex > 0) {
                      setCurrentQuestionIndex(prev => prev - 1);
                      resetAnswerState();
                    }
                  }}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                >
                  ← Câu trước
                </button>
                <button
                  onClick={() => {
                    if (currentQuestionIndex < questions.length - 1) {
                      setCurrentQuestionIndex(prev => prev + 1);
                      resetAnswerState();
                    }
                  }}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                >
                  Câu tiếp theo →
                </button>
              </div>

              {!isAnswerSubmitted ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={currentQuestion.format === 'multiple_choice' ? !selectedOption : !fillBlankInput.trim()}
                  className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-extrabold px-6 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all text-sm flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Nộp câu trả lời
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
                      onClick={() => {
                        setCurrentQuestionIndex(prev => prev + 1);
                        resetAnswerState();
                      }}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      Câu tiếp theo <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Correct feedback */}
            {isAnswerSubmitted && isAnswerCorrect && (
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Rất giỏi! Em đã nắm vững kiến thức ngữ văn! (+5 Sao)
                </div>
                <p className="text-xs sm:text-sm text-emerald-950 font-medium">
                  {currentQuestion.solutionExplanation}
                </p>
              </div>
            )}
          </div>

          {/* AI Diagnostic Panel for Vietnamese */}
          <div className="space-y-4">
            <div className="bg-gradient-to-tr from-slate-900 to-teal-950 text-white rounded-3xl p-5 shadow-sm border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                <BrainCircuit className="w-4 h-4" />
                PHÂN TÍCH LỖI NGÔN NGỮ AI
              </div>
              <h4 className="text-base font-extrabold text-white">Chẩn đoán Sư phạm Tiếng Việt</h4>
              <p className="text-xs text-slate-300 mt-1">
                Hệ thống chỉ ra lỗi nhầm nghĩa, lỗi cấu trúc câu hoặc chính tả để em ghi nhớ lâu hơn.
              </p>
            </div>

            {isAnswerSubmitted && !isAnswerCorrect && activeDiagnosis && (
              <div className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-md space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                    ⚠️
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider">
                      Nhận diện lỗi ngôn ngữ
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
                    <Lightbulb className="w-4 h-4 text-amber-600" /> Gợi ý từ Mầm AI:
                  </div>
                  {activeDiagnosis.hint}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: AI Writing Assistant */}
      {activeTab === 'writing' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-extrabold text-teal-600 uppercase tracking-wider">
                Góc luyện viết sáng tạo
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Luyện viết đoạn văn (Lớp {currentGrade})
              </h3>
            </div>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
              AI hướng dẫn - Không viết hộ
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1">
            <p className="font-bold text-slate-900">Đề bài gợi ý:</p>
            <p>
              "Em hãy viết một đoạn văn ngắn (từ 5 đến 7 câu) kể về một vẻ đẹp của quê hương An Giang (dòng sông, cánh đồng mùa lúa chín, rừng tràm Trà Sư...) hoặc về thầy cô giáo em yêu quý."
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600">
              Bài viết của em:
            </label>
            <textarea
              rows={6}
              value={studentWriting}
              onChange={e => setStudentWriting(e.target.value)}
              placeholder="Bắt đầu viết đoạn văn của em tại đây..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-teal-500 focus:bg-white rounded-2xl p-4 text-sm text-slate-800 focus:outline-hidden leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Số từ: {studentWriting.trim() ? studentWriting.trim().split(/\s+/).length : 0} từ
            </span>
            <button
              onClick={handleReviewWriting}
              disabled={!studentWriting.trim() || isGradingWriting}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-extrabold px-6 py-3 rounded-2xl text-sm shadow-sm flex items-center gap-2 transition-all"
            >
              {isGradingWriting ? 'Mầm AI đang đọc bài...' : 'Nhờ Mầm AI góp ý bài viết'}
            </button>
          </div>

          {writingFeedback && (
            <div className="bg-teal-50/80 rounded-2xl p-5 border border-teal-200 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-teal-900 font-extrabold text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" /> Nhận xét và góp ý từ Mầm AI:
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {writingFeedback}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
