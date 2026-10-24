import React, { useState, useEffect } from 'react';
import { CurriculumLesson, QuestionItem, LessonStatus } from '../types';
import { StorageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import { LessonEditorModal } from './LessonEditorModal';
import { OFFICIAL_TEXTBOOK_LINKS } from '../data/grade2CurriculumCatalog';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  Edit3, 
  Plus, 
  Search, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft,
  FileText,
  Gamepad2,
  Award,
  Bot,
  RotateCcw,
  Square,
  Play
} from 'lucide-react';

interface VietnameseRoomProps {
  currentGrade?: 2;
  onOpenMamAIWithContext: (topicTitle: string, questionPrompt: string) => void;
  initialTopicId?: string;
  isTeacherMode?: boolean;
}

export const VietnameseRoom: React.FC<VietnameseRoomProps> = ({ 
  onOpenMamAIWithContext, 
  initialTopicId,
  isTeacherMode = true 
}) => {
  // Load Grade 2 Vietnamese lessons from StorageService
  const [allLessons, setAllLessons] = useState<CurriculumLesson[]>(() =>
    StorageService.getGrade2Lessons('vietnamese')
  );

  // Volume filter: 1 (Tập một) or 2 (Tập hai)
  const [selectedVolume, setSelectedVolume] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<string>('all');

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

  // Activities Tab inside Lesson:
  // 1: Đọc hiểu, 2: Luyện từ và câu, 3: Luyện viết, 4: Nói và nghe, 5: Trò chơi, 6: Củng cố
  const [activeTab, setActiveTab] = useState<
    'reading' | 'vocab_grammar' | 'writing' | 'speaking' | 'games' | 'consolidation'
  >('reading');

  // Audio & TTS State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(-1);
  const [speechRate, setSpeechRate] = useState<number>(0.88); // 0.88x optimal for Grade 2

  // STRICT VOICE CHECK: Only allow TTS if device has supported Vietnamese voice
  const [hasViVoice, setHasViVoice] = useState<boolean>(() => audioService.hasVietnameseVoice());
  const [isTtsPermitted, setIsTtsPermitted] = useState<boolean>(() => audioService.isTtsPermitted());

  useEffect(() => {
    // Check voice support on mount & when voices change
    const checkVoice = () => {
      setHasViVoice(audioService.hasVietnameseVoice());
      setIsTtsPermitted(audioService.isTtsPermitted());
    };
    checkVoice();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = checkVoice;
    }
  }, []);

  // Questions and Exercise State
  const questions: QuestionItem[] = activeLesson?.activities?.practice?.questions || [];
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [fillInput, setFillInput] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQ: QuestionItem | undefined = questions[currentQIndex];

  // Writing practice input
  const [studentWritingInput, setStudentWritingInput] = useState('');
  const [writingFeedback, setWritingFeedback] = useState<string | null>(null);

  // Filter lessons based on volume, topic, week, and search
  const volumeLessons = allLessons.filter(l => l.volume === selectedVolume);
  const availableTopics = Array.from(new Set(volumeLessons.map(l => l.topic)));
  const availableWeeks = Array.from(new Set(volumeLessons.map(l => l.week || 'Tuần khác')));

  const filteredLessons = volumeLessons.filter(l => {
    const matchesSearch = 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `bài ${l.lessonNumber}`.includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopicFilter === 'all' || l.topic === selectedTopicFilter;
    const matchesWeek = selectedWeekFilter === 'all' || l.week === selectedWeekFilter;
    return matchesSearch && matchesTopic && matchesWeek;
  });

  const handleSelectLesson = (lessonId: string) => {
    stopCurrentAudio();
    setActiveLessonId(lessonId);
    setCurrentQIndex(0);
    resetQuestionState();
    setActiveTab('reading');
    setStudentWritingInput('');
    setWritingFeedback(null);
  };

  const resetQuestionState = () => {
    setSelectedOption('');
    setFillInput('');
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  const stopCurrentAudio = () => {
    audioService.stopSpeaking();
    setIsPlayingAudio(false);
    setCurrentSentenceIndex(-1);
  };

  // Sentences for reading highlight
  const readingContent = activeLesson?.readingPassage?.content || '';
  const sentences = readingContent
    .split(/([.?!:\n]+)/)
    .filter(s => s && s.trim().length > 0)
    .map(s => s.trim());

  const handleToggleReadPassage = () => {
    if (isPlayingAudio) {
      stopCurrentAudio();
      return;
    }

    // If teacher provided a custom MP3 audio recording, prioritize playing it
    if (activeLesson?.readingPassage?.audioUrl) {
      setIsPlayingAudio(true);
      audioService.playCustomAudio(activeLesson.readingPassage.audioUrl, () => {
        setIsPlayingAudio(false);
      });
      return;
    }

    // STRICT CHECK: If device has NO Vietnamese voice, do NOT use TTS!
    if (!hasViVoice) {
      alert('Thiết bị này chưa cài đặt giọng đọc Tiếng Việt (vi-VN). Hệ thống đã chặn phát âm thanh để tránh đọc bằng giọng tiếng Anh.');
      return;
    }

    if (!readingContent.trim()) return;

    setIsPlayingAudio(true);
    setCurrentSentenceIndex(0);

    const validSentences = readingContent
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    audioService.speakSentences(
      validSentences,
      idx => setCurrentSentenceIndex(idx),
      () => {
        setIsPlayingAudio(false);
        setCurrentSentenceIndex(-1);
      },
      speechRate
    );
  };

  const handleCheckQuestionAnswer = () => {
    if (!currentQ || isSubmitted) return;

    let studentAns = '';
    if (currentQ.format === 'multiple_choice') {
      studentAns = selectedOption;
    } else {
      studentAns = fillInput.trim();
    }

    if (!studentAns) return;

    const correctAns = currentQ.correctAnswer.trim();
    const correct = 
      studentAns.toLowerCase() === correctAns.toLowerCase() ||
      (currentQ.format === 'multiple_choice' && studentAns.startsWith(correctAns.substring(0, 2)));

    setIsSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      audioService.playCorrect();
      confetti({ particleCount: 50 });
      StorageService.recordAnswer(currentQ.id, true);
    } else {
      audioService.playIncorrect();
      StorageService.recordAnswer(currentQ.id, false, 'Đọc hiểu / Từ và câu');
    }
  };

  const handleEvaluateWriting = () => {
    if (!studentWritingInput.trim()) return;
    if (studentWritingInput.trim().length < 15) {
      setWritingFeedback('Đoạn văn của em còn hơi ngắn. Em hãy viết thêm 1-2 câu nữa để ý văn thêm rõ ràng và sinh động nhé!');
      return;
    }
    audioService.playCelebration();
    confetti({ particleCount: 60 });
    setWritingFeedback('Mầm AI khen ngợi: Em viết câu văn rất có cảm xúc, đúng ngữ pháp và biết dùng dấu câu phù hợp! Tiếp tục phát huy nhé!');
  };

  const handleOpenAddLesson = () => {
    setEditingLesson(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditLesson = (item: CurriculumLesson, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingLesson(item);
    setIsEditorOpen(true);
  };

  const handleLessonSaved = (saved: CurriculumLesson) => {
    const updated = StorageService.getGrade2Lessons('vietnamese');
    setAllLessons(updated);
    setActiveLessonId(saved.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Banner Xanh Ngọc (Emerald / Teal) */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-teal-800/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" /> PHÒNG TIẾNG VIỆT AI – LỚP 2
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              KHÁM PHÁ TIẾNG VIỆT YÊU THƯƠNG
            </h2>
            <p className="text-xs sm:text-sm text-teal-100">
              Chương trình chuẩn GDPT 2018 (Kết nối tri thức với cuộc sống). Đọc hiểu, Luyện từ và câu, Luyện viết và bồi dưỡng tình yêu quê hương đất nước.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={selectedVolume === 1 ? OFFICIAL_TEXTBOOK_LINKS.vietnameseVol1 : OFFICIAL_TEXTBOOK_LINKS.vietnameseVol2}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 flex items-center gap-1.5 transition-all"
              title="Mở sách gốc Tiếng Việt 2 trên taphuan.nxbgd.vn"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              <span>Mở SGK Tiếng Việt 2 Tập {selectedVolume}</span>
            </a>

            {isTeacherMode && (
              <button
                onClick={handleOpenAddLesson}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> + Thêm bài Tiếng Việt
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Volume Selector: [ Tập một ] [ Tập hai ] */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedVolume(1);
              setSelectedTopicFilter('all');
              setSelectedWeekFilter('all');
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              selectedVolume === 1
                ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>📖 TIẾNG VIỆT 2 – TẬP MỘT</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md">32 bài + Ôn tập</span>
          </button>

          <button
            onClick={() => {
              setSelectedVolume(2);
              setSelectedTopicFilter('all');
              setSelectedWeekFilter('all');
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              selectedVolume === 2
                ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>📗 TIẾNG VIỆT 2 – TẬP HAI</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md">30 bài + Ôn tập</span>
          </button>
        </div>

        {/* Toolbar: [ Tìm bài... ] [ Chọn chủ điểm ] [ Chọn tuần ] */}
        <div className="flex flex-wrap items-center gap-2 flex-1 sm:flex-initial">
          <div className="relative min-w-[180px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm bài học..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={selectedTopicFilter}
            onChange={e => setSelectedTopicFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 max-w-[190px] truncate focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Tất cả chủ điểm ({availableTopics.length})</option>
            {availableTopics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={selectedWeekFilter}
            onChange={e => setSelectedWeekFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 max-w-[130px] truncate focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Tất cả tuần</option>
            {availableWeeks.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Vertical Lesson Catalog Cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Danh mục bài học ({filteredLessons.length} bài)
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Tập {selectedVolume}</span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredLessons.map(item => {
              const isActive = activeLessonId === item.id;
              const isPublished = item.status === 'published';
              const hasReading = !!item.readingPassage?.content;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectLesson(item.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 ${
                    isActive
                      ? 'bg-teal-50/90 border-teal-600 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        isActive ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.lessonNumber > 100 ? 'ÔT' : item.lessonNumber}
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
                          className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-teal-600 transition-colors"
                          title="Sửa bài Tiếng Việt"
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
                      {hasReading ? '📖 Có bài đọc' : 'Chưa có bài đọc'}
                    </span>
                    <span className={`font-bold flex items-center gap-0.5 ${isActive ? 'text-teal-700' : 'text-slate-500'}`}>
                      {isActive ? 'Đang học' : 'Học ngay'} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Vietnamese Lesson Workspace (6 Tabs) */}
        <div className="lg:col-span-8 space-y-4">
          {activeLesson ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
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
                    onClick={() => onOpenMamAIWithContext(activeLesson.title, activeLesson.readingPassage?.content || '')}
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

              {/* 6 Tabs: 1. Đọc hiểu, 2. Luyện từ và câu, 3. Luyện viết, 4. Nói và nghe, 5. Trò chơi, 6. Củng cố */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 bg-slate-100 p-1.5 rounded-2xl">
                {[
                  { id: 'reading', label: '1. Đọc hiểu' },
                  { id: 'vocab_grammar', label: '2. Từ & Câu' },
                  { id: 'writing', label: '3. Luyện viết' },
                  { id: 'speaking', label: '4. Nói & Nghe' },
                  { id: 'games', label: '5. Trò chơi' },
                  { id: 'consolidation', label: '6. Củng cố' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      stopCurrentAudio();
                      setActiveTab(tab.id as any);
                    }}
                    className={`py-2 px-1 text-center text-[11px] font-black rounded-xl transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-white text-teal-800 shadow-xs ring-1 ring-teal-100'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: ĐỌC HIỂU & NGỮ LIỆU */}
              {activeTab === 'reading' && (
                <div className="space-y-4 animate-in fade-in">
                  
                  {activeLesson.readingPassage ? (
                    <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-4">
                      
                      {/* Audio Toolbar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-teal-200">
                        <div>
                          <h4 className="text-sm font-black text-teal-950">
                            {activeLesson.readingPassage.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 italic">
                            {activeLesson.readingPassage.authorOrOrigin || 'Ngữ liệu chuẩn GDPT 2018'}
                          </span>
                        </div>

                        {/* STRICT TTS BUTTON: ONLY SHOWN IF VIETNAMESE VOICE EXISTS OR TEACHER AUDIO EXISTS */}
                        {(hasViVoice || activeLesson.readingPassage.audioUrl) ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleToggleReadPassage}
                              className={`px-4 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-2 transition-all cursor-pointer ${
                                isPlayingAudio
                                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                                  : 'bg-teal-600 hover:bg-teal-700 text-white'
                              }`}
                            >
                              {isPlayingAudio ? (
                                <>
                                  <Square className="w-3.5 h-3.5" /> Dừng đọc
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-current" /> Nghe đọc mẫu Tiếng Việt
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => setSpeechRate(r => (r === 0.88 ? 1.0 : 0.88))}
                              className="px-2 py-1.5 bg-white border border-teal-200 text-teal-900 rounded-lg text-[10px] font-bold"
                              title="Tốc độ đọc phù hợp cho học sinh lớp 2"
                            >
                              Tốc độ: {speechRate === 0.88 ? '0.88x (Chậm rõ)' : '1.0x (Chuẩn)'}
                            </button>
                          </div>
                        ) : (
                          <div className="text-[11px] bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200 font-medium">
                            🌱 Thiết bị chưa có giọng đọc Tiếng Việt (vi-VN). Đã tự động ẩn nút nghe để tránh phát âm tiếng Anh.
                          </div>
                        )}
                      </div>

                      {/* Reading Passage Text with Sentence-by-Sentence Highlight */}
                      <div className="bg-white p-5 rounded-2xl border border-teal-200/80 shadow-2xs text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 font-serif">
                        {readingContent.split('\n\n').map((paragraph, pIdx) => (
                          <p key={pIdx}>
                            {paragraph.split(/(?<=[.?!])\s+/).map((sentence, sIdx) => {
                              const overallIdx = pIdx * 10 + sIdx;
                              const isHighlighted = isPlayingAudio && currentSentenceIndex === overallIdx;
                              return (
                                <span
                                  key={sIdx}
                                  className={`transition-all rounded px-1 ${
                                    isHighlighted
                                      ? 'bg-amber-200 text-amber-950 font-bold shadow-2xs'
                                      : ''
                                  }`}
                                >
                                  {sentence}{' '}
                                </span>
                              );
                            })}
                          </p>
                        ))}
                      </div>

                      {/* Vocabulary Notes */}
                      {activeLesson.readingPassage.vocabularyNotes && activeLesson.readingPassage.vocabularyNotes.length > 0 && (
                        <div className="p-3 bg-white rounded-xl border border-teal-200 space-y-1.5 text-xs">
                          <span className="font-black text-teal-900 uppercase text-[10px]">Từ ngữ cần hiểu nghĩa:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {activeLesson.readingPassage.vocabularyNotes.map((v, i) => (
                              <div key={i} className="text-slate-700">
                                <strong className="text-teal-800">{v.word}:</strong> {v.meaning}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                      <p className="text-xs text-slate-600 font-medium">
                        Bài học này đang được chuẩn bị ngữ liệu đọc. Thầy/Cô có thể nhấn "Sửa bài" để thêm bài đọc tự biên soạn hoặc tạo bằng AI!
                      </p>
                    </div>
                  )}

                  {/* Quick Reading Comprehension Questions */}
                  {questions.length > 0 && (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800">
                          Câu hỏi đọc hiểu (Câu {currentQIndex + 1}/{questions.length})
                        </span>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                          {currentQ?.cognitiveLevel}
                        </span>
                      </div>

                      {currentQ && (
                        <div className="space-y-3">
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            {currentQ.prompt}
                          </p>

                          {currentQ.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {currentQ.options.map((opt, i) => {
                                const isSelected = selectedOption === opt;
                                return (
                                  <button
                                    key={i}
                                    disabled={isSubmitted}
                                    onClick={() => setSelectedOption(opt)}
                                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                                      isSubmitted && opt.toLowerCase() === currentQ.correctAnswer.toLowerCase()
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                        : isSelected
                                        ? 'bg-teal-50 border-teal-500 text-teal-900'
                                        : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {!isSubmitted ? (
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={handleCheckQuestionAnswer}
                                disabled={!selectedOption}
                                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2 rounded-xl disabled:opacity-40 shadow-xs"
                              >
                                Trả lời
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2 pt-1">
                              <div className={`p-3 rounded-xl text-xs font-bold ${
                                isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                              }`}>
                                {isCorrect ? '✅ Chính xác! +5 sao thưởng.' : `❌ Chưa đúng. Đáp án là: ${currentQ.correctAnswer}`}
                                <p className="text-[11px] font-normal text-slate-700 mt-1">{currentQ.solutionExplanation}</p>
                              </div>

                              <div className="flex justify-between items-center pt-1">
                                <button
                                  onClick={() => {
                                    if (currentQIndex > 0) {
                                      setCurrentQIndex(q => q - 1);
                                      resetQuestionState();
                                    }
                                  }}
                                  disabled={currentQIndex === 0}
                                  className="text-xs font-bold text-slate-500 disabled:opacity-30"
                                >
                                  Câu trước
                                </button>
                                <button
                                  onClick={() => {
                                    if (currentQIndex < questions.length - 1) {
                                      setCurrentQIndex(q => q + 1);
                                      resetQuestionState();
                                    } else {
                                      setActiveTab('vocab_grammar');
                                    }
                                  }}
                                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl flex items-center gap-1"
                                >
                                  {currentQIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Sang phần Từ & Câu'} →
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: LUYỆN TỪ VÀ CÂU */}
              {activeTab === 'vocab_grammar' && (
                <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-4 animate-in fade-in">
                  <span className="text-xs font-black uppercase bg-sky-200 text-sky-900 px-2 py-0.5 rounded-md">
                    2. Luyện Từ và Câu Lớp 2
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-sky-200 space-y-1">
                      <span className="font-black text-sky-900">Từ chỉ sự vật:</span>
                      <p className="text-slate-600 leading-relaxed">Cây dừa, dòng kênh, cặp sách, học sinh, con cò, hoa điên điển.</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-sky-200 space-y-1">
                      <span className="font-black text-sky-900">Từ chỉ hoạt động:</span>
                      <p className="text-slate-600 leading-relaxed">Đọc bài, viết chữ, tưới hoa, bơi lội, ca hát, giúp đỡ mẹ.</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-sky-200 space-y-1">
                      <span className="font-black text-sky-900">Từ chỉ đặc điểm:</span>
                      <p className="text-slate-600 leading-relaxed">Chăm chỉ, vàng tươi, mát lành, xinh xắn, ngoan ngoãn.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-sky-200 space-y-2 text-xs">
                    <span className="font-bold text-slate-800">Quy tắc kiểu câu:</span>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      <li><strong>Ai là gì?:</strong> Giới thiệu người hoặc vật (VD: <em>Em là học sinh lớp 2A.</em>)</li>
                      <li><strong>Ai làm gì?:</strong> Kể hoạt động (VD: <em>Bác Ba đang chèo xuồng trên kênh Vĩnh Điều.</em>)</li>
                      <li><strong>Ai thế nào?:</strong> Miêu tả đặc điểm (VD: <em>Bông điên điển vàng rực rỡ dưới nắng ban mai.</em>)</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: LUYỆN VIẾT */}
              {activeTab === 'writing' && (
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4 animate-in fade-in">
                  <span className="text-xs font-black uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                    3. Luyện Viết Đoạn Văn Ngắn (3–5 câu)
                  </span>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-800">
                      Đề bài gợi ý: Hãy viết 3-4 câu kể về một hoạt động học tập hoặc niềm vui của em tại Trường TH-THCS Vĩnh Điều.
                    </p>

                    <textarea
                      value={studentWritingInput}
                      onChange={e => setStudentWritingInput(e.target.value)}
                      rows={5}
                      className="w-full bg-white border border-amber-300 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 leading-relaxed font-serif"
                      placeholder="Em hãy viết đoạn văn của mình vào đây (chú ý viết hoa đầu câu và đặt dấu chấm cuối câu nhé)..."
                    />

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[11px] text-slate-500">
                        Độ dài: {studentWritingInput.trim().split(/\s+/).filter(Boolean).length} từ
                      </span>

                      <button
                        onClick={handleEvaluateWriting}
                        disabled={!studentWritingInput.trim()}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-5 py-2 rounded-xl disabled:opacity-40 shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Mầm AI nhận xét câu văn
                      </button>
                    </div>

                    {writingFeedback && (
                      <div className="p-3 bg-white rounded-xl border border-amber-300 text-xs text-amber-950 font-medium animate-in fade-in flex items-start gap-2">
                        <Bot className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p>{writingFeedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: NÓI VÀ NGHE */}
              {activeTab === 'speaking' && (
                <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4 animate-in fade-in">
                  <span className="text-xs font-black uppercase bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md">
                    4. Nói và Nghe Tương Tác
                  </span>

                  <div className="p-4 bg-white rounded-xl border border-purple-200 space-y-2 text-xs">
                    <h5 className="font-bold text-purple-950">Tình huống giao tiếp thân thiện:</h5>
                    <p className="text-slate-700 leading-relaxed">
                      Khi đến lớp học buổi sáng, em gặp thầy cô giáo và bạn bè bên cạnh. Em sẽ nói lời chào và nụ cười như thế nào để mọi người đều cảm thấy vui vẻ?
                    </p>
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-900 font-medium">
                      💡 Mẫu câu gợi ý: <em>"Con chào thầy Danh Thanh ạ! Chào bạn An, hôm nay chúng mình cùng học thật tốt nhé!"</em>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: TRÒ CHƠI TIẾNG VIỆT */}
              {activeTab === 'games' && (
                <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-4 animate-in fade-in">
                  <span className="text-xs font-black uppercase bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-md">
                    5. Thử Thách Trò Chơi Tiếng Việt Lớp 2
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-4 bg-white rounded-xl border border-indigo-200 space-y-2">
                      <span className="font-black text-indigo-950">Trò chơi: Phân biệt S hay X</span>
                      <p className="text-slate-600">Quy tắc chính tả: Cây <strong>x</strong>anh, dòng <strong>s</strong>ông, dòng <strong>s</strong>uối, buổi <strong>s</strong>áng.</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-indigo-200 space-y-2">
                      <span className="font-black text-indigo-950">Trò chơi: Ghép cặp Từ - Nghĩa</span>
                      <p className="text-slate-600">Ghép nối từ ngữ chỉ phẩm chất tốt đẹp của người học sinh chăm ngoan.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: CỦNG CỐ */}
              {activeTab === 'consolidation' && (
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 animate-in fade-in">
                  <span className="text-xs font-black uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                    6. Củng Cố & Tự Đánh Giá
                  </span>

                  <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-3 text-xs">
                    <p className="font-bold text-slate-800">
                      Hôm nay em đã hoàn thành bài học Tiếng Việt: <strong>{activeLesson.title}</strong>
                    </p>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 flex items-center gap-2 italic">
                      <Bot className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>"Mỗi học sinh một hành trình, mỗi tiến bộ một niềm vui! Mầm AI chúc em đọc bài ngày càng diễn cảm!"</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              Vui lòng chọn một bài học từ danh sách bên trái.
            </div>
          )}
        </div>

      </div>

      {/* Lesson Editor Modal */}
      {isEditorOpen && (
        <LessonEditorModal
          lesson={editingLesson}
          defaultSubject="vietnamese"
          defaultVolume={selectedVolume}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSaved={handleLessonSaved}
        />
      )}

    </div>
  );
};
