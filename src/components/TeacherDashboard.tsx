import React, { useState, useEffect } from 'react';
import { 
  GradeLevel, 
  SubjectType, 
  CognitiveLevel, 
  GeneratedWorksheet, 
  QuestionItem, 
  LessonTopic, 
  TextbookMaterial, 
  AssignedTask, 
  BookSeries,
  CurriculumLesson,
  LessonStatus
} from '../types';
import { DEMO_CLASSES } from '../data/demoStudents';
import { generateWorksheet, parseTextbookMaterial } from '../services/aiService';
import { StorageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import { LessonEditorModal } from './LessonEditorModal';
import { 
  Users, 
  FileText, 
  Printer, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  Download, 
  Edit3, 
  Trash2, 
  Search,
  BookOpen,
  Calculator,
  Calendar,
  AlertTriangle,
  Award,
  Upload,
  Send,
  Eye,
  Clock,
  Layers,
  Save,
  X,
  Volume2,
  VolumeX,
  Play,
  Copy,
  Plus
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'curriculum_bank' | 'assign_tasks' | 'edit_questions' | 'textbook_upload' | 'ai_worksheet' | 'audio_settings' | 'classes' | 'errors'
  >('curriculum_bank');

  // Grade 2 Curriculum Bank state
  const [grade2Lessons, setGrade2Lessons] = useState<CurriculumLesson[]>(() =>
    StorageService.getGrade2Lessons()
  );
  const [curriculumSearch, setCurriculumSearch] = useState('');
  const [curriculumSubjectFilter, setCurriculumSubjectFilter] = useState<'all' | 'math' | 'vietnamese'>('all');
  const [curriculumVolumeFilter, setCurriculumVolumeFilter] = useState<'all' | 1 | 2>('all');
  const [curriculumStatusFilter, setCurriculumStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [isLessonEditorOpen, setIsLessonEditorOpen] = useState(false);
  const [editingCurriculumLesson, setEditingCurriculumLesson] = useState<CurriculumLesson | null>(null);

  // CSV Import / Export State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvInputText, setCsvInputText] = useState('');
  const [csvImportResult, setCsvImportResult] = useState<{ successCount: number; errors: string[] } | null>(null);

  // Audio & TTS Verification State
  const [ttsPermitted, setTtsPermitted] = useState<boolean>(() => audioService.isTtsPermitted());
  const [voiceTestMessage, setVoiceTestMessage] = useState<string | null>(null);
  const [voiceTestStatus, setVoiceTestStatus] = useState<string>('');

  const refreshGrade2Lessons = () => {
    setGrade2Lessons(StorageService.getGrade2Lessons());
  };

  const handleOpenAddCurriculumLesson = () => {
    setEditingCurriculumLesson(null);
    setIsLessonEditorOpen(true);
  };

  const handleOpenEditCurriculumLesson = (item: CurriculumLesson) => {
    setEditingCurriculumLesson(item);
    setIsLessonEditorOpen(true);
  };

  const handleDuplicateCurriculumLesson = (item: CurriculumLesson) => {
    StorageService.duplicateGrade2Lesson(item.id);
    refreshGrade2Lessons();
  };

  const handleToggleLessonStatus = (item: CurriculumLesson) => {
    const newStatus: LessonStatus = item.status === 'published' ? 'draft' : 'published';
    StorageService.setGrade2LessonStatus(item.id, newStatus);
    refreshGrade2Lessons();
  };

  const handleDownloadCsvTemplate = () => {
    const template = StorageService.generateCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mau_Nhap_Hoc_Lieu_Lop_2_Vinh_Dieu.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAllLessonsCSV = () => {
    let csv = 'MaBai,MonHoc,TapSach,ChuDe,Tuan,SoBai,TenBai,TrangThai,SoLuongCauHoi,CapNhatLuc\n';
    grade2Lessons.forEach(l => {
      const qCount = l.activities?.practice?.questions?.length || 0;
      csv += `"${l.id}","${l.subject === 'math' ? 'Toán' : 'Tiếng Việt'}",${l.volume},"${l.topic}","${l.week || ''}",${l.lessonNumber},"${l.title}","${l.status}",${qCount},"${l.updatedAt}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Danh_Sach_Bai_Hoc_Lop_2_Vinh_Dieu_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunCsvImport = () => {
    if (!csvInputText.trim()) return;
    const res = StorageService.importLessonsFromCSV(csvInputText);
    setCsvImportResult(res);
    refreshGrade2Lessons();
  };

  const handleTestVietnameseVoice = () => {
    const info = audioService.getVietnameseVoiceInfo();
    if (!info.hasVoice) {
      setVoiceTestMessage('❌ Thiết bị này hiện không có Voice Tiếng Việt (vi-VN). Hệ thống đã chặn phát âm để tránh đọc sai ngữ âm bằng tiếng Anh.');
      return;
    }
    setVoiceTestMessage(`Đang phát âm thử nghiệm bằng giọng: ${info.voiceName}...`);
    const success = audioService.testVietnameseVoice(() => {
      setVoiceTestMessage(`✅ Đã đọc xong bằng giọng: ${info.voiceName}. Phát âm rõ ràng, chuẩn tiếng Việt!`);
    });
    if (!success) {
      setVoiceTestMessage('Không thể phát âm thử.');
    }
  };

  const handleToggleTtsPermitted = (enabled: boolean) => {
    audioService.setTtsPermitted(enabled);
    setTtsPermitted(enabled);
  };

  // Topics and Questions state for editing
  const [allTopics, setAllTopics] = useState<LessonTopic[]>(() => StorageService.getAllTopics());
  const [filterGrade, setFilterGrade] = useState<GradeLevel>(2);
  const [filterSubject, setFilterSubject] = useState<SubjectType>('math');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');

  // Editing Question Modal state
  const [editingQuestion, setEditingQuestion] = useState<{
    topicId: string;
    question: QuestionItem;
    isNew: boolean;
  } | null>(null);

  // Homework Assignment State
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>(() => StorageService.getAssignedTasks());
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskClass, setNewTaskClass] = useState('Lớp 2A');
  const [newTaskGrade, setNewTaskGrade] = useState<GradeLevel>(2);
  const [newTaskSubject, setNewTaskSubject] = useState<SubjectType>('math');
  const [newTaskDueDate, setNewTaskDueDate] = useState('25/10/2026');
  const [newTaskNote, setNewTaskNote] = useState('Các em hoàn thành trước tiết học ngày mai.');
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<AssignedTask | null>(null);

  // Textbook Material Upload State
  const [bookSeries, setBookSeries] = useState<BookSeries>('Kết nối tri thức');
  const [tbGrade, setTbGrade] = useState<GradeLevel>(2);
  const [tbSubject, setTbSubject] = useState<SubjectType>('vietnamese');
  const [tbUnitLesson, setTbUnitLesson] = useState('Bài 14: Em yêu dòng kênh xanh quê hương');
  const [tbRawText, setTbRawText] = useState(
    'Dọc theo các con kênh ở xã Vĩnh Điều, mùa nước nổi mang về bao nhiêu phù sa màu mỡ. Đàn cá linh non bơi lội tung tăng dưới chân cầu khỉ. Ven bờ, bông điên điển nở vàng rực rỡ dưới nắng ban mai.'
  );
  const [isParsingTb, setIsParsingTb] = useState(false);
  const [parsedTbMaterial, setParsedTbMaterial] = useState<TextbookMaterial | null>(null);
  const [savedTbMaterials, setSavedTbMaterials] = useState<TextbookMaterial[]>(() =>
    StorageService.getTextbookMaterials()
  );

  // AI Worksheet Generator State
  const [wsGrade, setWsGrade] = useState<GradeLevel>(2);
  const [wsSubject, setWsSubject] = useState<SubjectType>('math');
  const [wsTopic, setWsTopic] = useState<string>('Phép nhân và Bảng nhân 2, 5');
  const [wsRequirement, setWsRequirement] = useState<string>('Học sinh hiểu bản chất phép nhân và tính nhẩm chính xác');
  const [wsCount, setWsCount] = useState<number>(5);
  const [wsDifficulty, setWsDifficulty] = useState<CognitiveLevel>('Vận dụng');
  const [isGeneratingWs, setIsGeneratingWs] = useState<boolean>(false);
  const [currentWorksheet, setCurrentWorksheet] = useState<GeneratedWorksheet | null>(null);

  // 1. Edit Question Handlers
  const currentTopicsList = allTopics.filter(t => t.grade === filterGrade && t.subject === filterSubject);
  const activeTopic = currentTopicsList.find(t => t.id === selectedTopicId) || currentTopicsList[0];

  const handleOpenAddQuestion = () => {
    if (!activeTopic) return;
    const newQ: QuestionItem = {
      id: 'custom-q-' + Date.now(),
      grade: filterGrade,
      subject: filterSubject,
      topicId: activeTopic.id,
      prompt: '',
      format: 'multiple_choice',
      options: ['A. ', 'B. ', 'C. ', 'D. '],
      correctAnswer: 'A. ',
      solutionExplanation: '',
      cognitiveLevel: 'Vận dụng',
      commonErrors: [
        {
          pattern: '',
          category: 'Nhầm lẫn khái niệm',
          explanation: 'Lỗi học sinh thường mắc phải.',
          hint: 'Gợi ý để học sinh tự làm lại.',
        },
      ],
    };
    setEditingQuestion({ topicId: activeTopic.id, question: newQ, isNew: true });
  };

  const handleOpenEditQuestion = (q: QuestionItem) => {
    if (!activeTopic) return;
    setEditingQuestion({
      topicId: activeTopic.id,
      question: JSON.parse(JSON.stringify(q)),
      isNew: false,
    });
  };

  const handleSaveEditedQuestion = () => {
    if (!editingQuestion) return;
    const { topicId, question, isNew } = editingQuestion;
    if (isNew) {
      StorageService.addQuestionToTopic(topicId, question);
    } else {
      StorageService.updateQuestion(topicId, question);
    }
    setAllTopics(StorageService.getAllTopics());
    setEditingQuestion(null);
    alert('Đã lưu câu hỏi thành công vào kho học liệu của trường!');
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!activeTopic) return;
    if (confirm('Thầy cô có chắc chắn muốn xóa bài tập này khỏi kho học liệu?')) {
      StorageService.deleteQuestion(activeTopic.id, qId);
      setAllTopics(StorageService.getAllTopics());
    }
  };

  // 2. Assign Task Handler
  const handleCreateAssignedTask = () => {
    if (!newTaskTitle.trim()) {
      alert('Vui lòng nhập tên bài tập hoặc nhiệm vụ cần giao!');
      return;
    }

    // Pick 3-5 questions from active topic or current topics
    const sourceQuestions = activeTopic?.questions?.slice(0, 4) || [];
    if (sourceQuestions.length === 0) {
      alert('Chưa có câu hỏi nào trong chủ đề này để giao. Vui lòng thêm câu hỏi trước!');
      return;
    }

    const task: AssignedTask = {
      id: 'task-' + Date.now(),
      title: newTaskTitle.trim(),
      targetClass: newTaskClass,
      grade: newTaskGrade,
      subject: newTaskSubject,
      assignedBy: 'Thầy Danh Thanh',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      dueDate: newTaskDueDate,
      note: newTaskNote,
      questions: sourceQuestions,
      submissions: [],
    };

    StorageService.saveAssignedTask(task);
    setAssignedTasks(StorageService.getAssignedTasks());
    setNewTaskTitle('');
    alert(`Đã giao bài tập thành công cho ${newTaskClass}! Học sinh có thể vào tab "Nhiệm vụ được giao" để làm bài ngay.`);
  };

  // 3. Textbook Material Parsing Handler
  const handleParseTextbook = async () => {
    if (!tbRawText.trim()) return;
    setIsParsingTb(true);
    try {
      const parsed = await parseTextbookMaterial(tbRawText, bookSeries, tbGrade, tbSubject, tbUnitLesson);
      const material: TextbookMaterial = {
        id: 'tb-' + Date.now(),
        title: parsed.title || tbUnitLesson,
        bookSeries,
        grade: tbGrade,
        subject: tbSubject,
        unitLesson: tbUnitLesson,
        content: parsed.content || tbRawText,
        vocabularyNotes: parsed.vocabularyNotes,
        questions: parsed.questions?.map((q, idx) => ({
          id: `tb-q-${Date.now()}-${idx}`,
          grade: tbGrade,
          subject: tbSubject,
          topicId: 'textbook-material',
          prompt: q.prompt,
          format: q.format || 'multiple_choice',
          options: q.options || [],
          correctAnswer: q.correctAnswer || '',
          solutionExplanation: q.solutionExplanation || 'Căn cứ theo ngữ liệu SGK.',
          cognitiveLevel: q.cognitiveLevel || 'Thông hiểu',
        })) || [],
        uploadedBy: 'Thầy Danh Thanh',
        createdAt: new Date().toLocaleDateString('vi-VN'),
      };
      setParsedTbMaterial(material);
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsingTb(false);
    }
  };

  const handleSaveTextbookToCurriculum = () => {
    if (!parsedTbMaterial) return;
    StorageService.saveTextbookMaterial(parsedTbMaterial);
    setSavedTbMaterials(StorageService.getTextbookMaterials());

    // Also add as a new topic into the curriculum so students can study immediately
    const newTopic: LessonTopic = {
      id: parsedTbMaterial.id,
      grade: parsedTbMaterial.grade,
      subject: parsedTbMaterial.subject,
      title: parsedTbMaterial.title,
      weekRange: 'Bài học bổ sung SGK ' + parsedTbMaterial.bookSeries,
      description: `Ngữ liệu sách giáo khoa ${parsedTbMaterial.bookSeries} do Thầy Danh Thanh tải lên`,
      iconName: 'BookOpen',
      badgeColor: 'teal',
      learningGoals: ['Đọc hiểu văn bản SGK', 'Thực hành câu hỏi củng cố'],
      questions: parsedTbMaterial.questions,
      readingPassage: {
        title: parsedTbMaterial.title,
        content: parsedTbMaterial.content,
        authorOrOrigin: parsedTbMaterial.bookSeries,
        vocabularyNotes: parsedTbMaterial.vocabularyNotes,
      },
    };
    StorageService.saveTopic(newTopic);
    setAllTopics(StorageService.getAllTopics());
    alert('Đã lưu bài học SGK thành công vào kho học liệu! Học sinh khối lớp này có thể vào học ngay.');
  };

  // 4. AI Worksheet Handler
  const handleGenerateWs = async () => {
    setIsGeneratingWs(true);
    try {
      const ws = await generateWorksheet(wsGrade, wsSubject, wsTopic, wsRequirement, wsCount, wsDifficulty);
      setCurrentWorksheet(ws);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingWs(false);
    }
  };

  const handleExportCSV = () => {
    let csv = 'Mã lớp,Tên lớp,Khối lớp,Sĩ số,Điểm TB khảo sát đầu,Điểm TB sau áp dụng,Tỉ lệ hoàn thành (%),Lỗi sai trọng tâm,Giáo viên phụ trách\n';
    DEMO_CLASSES.forEach(c => {
      csv += `${c.id},"${c.className}",${c.grade},${c.studentCount},${c.preTestAvg},${c.postTestAvg},${c.completionRate}%,"${c.topWeakness}","Thầy Danh Thanh"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bao_cao_hoc_sinh_Vinh_Dieu_An_Giang_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden no-print">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> KHÔNG GIAN GIÁO VIÊN AI
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300/30">
                Giáo viên: Thầy Danh Thanh
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Quản Trị Học Liệu, Giao Bài & Theo Dõi Học Sinh
            </h2>
            <p className="text-purple-200 text-xs sm:text-sm mt-1 max-w-2xl">
              Trường TH-THCS Vĩnh Điều, xã Vĩnh Điều, An Giang: Tự do thêm/sửa bài tập, tải ngữ liệu SGK (*Kết nối tri thức, Cánh diều, Chân trời sáng tạo*), giao bài và kiểm tra quá trình nộp bài của học sinh.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 border border-white/20 transition-colors"
            >
              <Download className="w-4 h-4 text-purple-300" /> Xuất dữ liệu CSV
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('curriculum_bank')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 border flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'curriculum_bank'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-purple-100 border-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" /> 1. Quản Lý Ngân Hàng Bài Học ({grade2Lessons.length})
          </button>

          <button
            onClick={() => setActiveSubTab('assign_tasks')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 border flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'assign_tasks'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-purple-100 border-white/10'
            }`}
          >
            <Send className="w-4 h-4" /> 2. Giao Bài & Kiểm Tra Tiến Độ ({assignedTasks.length})
          </button>

          <button
            onClick={() => setActiveSubTab('edit_questions')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 border flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'edit_questions'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-purple-100 border-white/10'
            }`}
          >
            <Edit3 className="w-4 h-4" /> 3. Chỉnh Sửa Câu Hỏi Chi Tiết
          </button>

          <button
            onClick={() => setActiveSubTab('textbook_upload')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 border flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'textbook_upload'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-purple-100 border-white/10'
            }`}
          >
            <Upload className="w-4 h-4" /> 4. Tải Ngữ Liệu Sách Giáo Khoa
          </button>

          <button
            onClick={() => setActiveSubTab('ai_worksheet')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 border flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'ai_worksheet'
                ? 'bg-white text-purple-900 border-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-purple-100 border-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4" /> 5. AI Tạo Phiếu Học Tập
          </button>

          <button
            onClick={() => setActiveSubTab('audio_settings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 border flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'audio_settings'
                ? 'bg-white text-purple-900 border-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-purple-100 border-white/10'
            }`}
          >
            <Volume2 className="w-4 h-4" /> 6. Giọng Đọc Mẫu & Âm Thanh
          </button>

          <button
            onClick={() => setActiveSubTab('classes')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 border flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'classes'
                ? 'bg-white text-purple-900 border-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-purple-100 border-white/10'
            }`}
          >
            <Users className="w-4 h-4" /> 7. Lớp Học Lớp 2
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUBTAB 0: QUẢN LÝ NGÂN HÀNG BÀI HỌC (LỚP 2) */}
      {/* ======================================================== */}
      {activeSubTab === 'curriculum_bank' && (
        <div className="space-y-6">
          {/* Top Control Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-black text-blue-700 uppercase tracking-wider">
                  Kho học liệu số GDPT 2018 - Lớp 2
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Quản Lý Ngân Hàng Bài Học Toán 2 & Tiếng Việt 2
                </h3>
                <p className="text-xs text-slate-500">
                  Lưu trữ trực tiếp trên thiết bị này. Thầy/Cô có thể tạo bài mới, sửa nội dung, tạo bằng AI hoặc nhập/xuất tệp CSV.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleDownloadCsvTemplate}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Tải mẫu bảng tính CSV để soạn bài hàng loạt"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" /> Tải mẫu CSV
                </button>
                <button
                  onClick={() => setIsCsvModalOpen(true)}
                  className="bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold px-3 py-2 rounded-xl border border-teal-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-teal-600" /> Nhập từ CSV
                </button>
                <button
                  onClick={handleExportAllLessonsCSV}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" /> Xuất DS bài học
                </button>
                <button
                  onClick={handleOpenAddCurriculumLesson}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> + Thêm bài học mới
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={curriculumSearch}
                  onChange={e => setCurriculumSearch(e.target.value)}
                  placeholder="Tìm bài học, mã bài..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <select
                  value={curriculumSubjectFilter}
                  onChange={e => setCurriculumSubjectFilter(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả môn (Toán & Tiếng Việt)</option>
                  <option value="math">📐 Môn Toán Lớp 2</option>
                  <option value="vietnamese">📖 Môn Tiếng Việt Lớp 2</option>
                </select>
              </div>

              <div>
                <select
                  value={curriculumVolumeFilter}
                  onChange={e => setCurriculumVolumeFilter(e.target.value === 'all' ? 'all' : Number(e.target.value) as 1 | 2)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả tập sách</option>
                  <option value={1}>Tập một (Học kì I)</option>
                  <option value={2}>Tập hai (Học kì II)</option>
                </select>
              </div>

              <div>
                <select
                  value={curriculumStatusFilter}
                  onChange={e => setCurriculumStatusFilter(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đã xuất bản (Học sinh thấy)</option>
                  <option value="draft">Bản nháp (Đang biên soạn)</option>
                  <option value="archived">Đã lưu trữ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table of Lessons */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Mã bài</th>
                    <th className="py-3.5 px-4">Tên bài học</th>
                    <th className="py-3.5 px-4">Môn & Tập</th>
                    <th className="py-3.5 px-4">Chủ đề / Tuần</th>
                    <th className="py-3.5 px-4 text-center">Câu hỏi</th>
                    <th className="py-3.5 px-4 text-center">Trạng thái</th>
                    <th className="py-3.5 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {grade2Lessons
                    .filter(l => {
                      const matchesSearch = 
                        l.title.toLowerCase().includes(curriculumSearch.toLowerCase()) ||
                        l.id.toLowerCase().includes(curriculumSearch.toLowerCase()) ||
                        l.topic.toLowerCase().includes(curriculumSearch.toLowerCase());
                      const matchesSubject = curriculumSubjectFilter === 'all' || l.subject === curriculumSubjectFilter;
                      const matchesVolume = curriculumVolumeFilter === 'all' || l.volume === curriculumVolumeFilter;
                      const matchesStatus = curriculumStatusFilter === 'all' || l.status === curriculumStatusFilter;
                      return matchesSearch && matchesSubject && matchesVolume && matchesStatus;
                    })
                    .map((item) => {
                      const qCount = item.activities?.practice?.questions?.length || 0;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{item.id}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{item.title}</span>
                            <span className="text-[10px] text-slate-400">Cập nhật: {item.updatedAt}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black ${
                              item.subject === 'math' ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'
                            }`}>
                              {item.subject === 'math' ? 'Toán 2' : 'Tiếng Việt 2'} - Tập {item.volume}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <div className="line-clamp-1">{item.topic}</div>
                            <span className="text-[10px] text-slate-400">{item.week || 'Tuần học'}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-black px-2 py-0.5 rounded-full text-[11px] ${
                              qCount > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {qCount}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleLessonStatus(item)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                                item.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }`}
                              title="Bấm để chuyển đổi trạng thái"
                            >
                              {item.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditCurriculumLesson(item)}
                                className="p-1.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-lg transition-colors cursor-pointer"
                                title="Chỉnh sửa chi tiết bài học"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDuplicateCurriculumLesson(item)}
                                className="p-1.5 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 rounded-lg transition-colors cursor-pointer"
                                title="Nhân bản bài học"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 2: GIAO BÀI & KIỂM TRA TIẾN ĐỘ HỌC SINH */}
      {/* ======================================================== */}
      {activeSubTab === 'assign_tasks' && (
        <div className="space-y-6">
          {/* Create Task Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-black text-amber-700 uppercase tracking-wider">
                  Chức năng giao bài tập
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Giao Nhiệm Vụ Mới Cho Học Sinh
                </h3>
              </div>
              <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-full">
                Giáo viên giao: Thầy Danh Thanh
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Lớp được giao:</label>
                <select
                  value={newTaskClass}
                  onChange={e => setNewTaskClass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="Lớp 1A">Lớp 1A</option>
                  <option value="Lớp 2A">Lớp 2A</option>
                  <option value="Lớp 2B">Lớp 2B</option>
                  <option value="Lớp 3A">Lớp 3A</option>
                  <option value="Lớp 4A">Lớp 4A</option>
                  <option value="Lớp 5A">Lớp 5A</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Khối lớp:</label>
                <select
                  value={newTaskGrade}
                  onChange={e => setNewTaskGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  {[1, 2, 3, 4, 5].map(g => (
                    <option key={g} value={g}>Lớp {g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Môn học:</label>
                <select
                  value={newTaskSubject}
                  onChange={e => setNewTaskSubject(e.target.value as SubjectType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="math">Toán học</option>
                  <option value="vietnamese">Tiếng Việt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Hạn nộp bài:</label>
                <input
                  type="text"
                  value={newTaskDueDate}
                  onChange={e => setNewTaskDueDate(e.target.value)}
                  placeholder="Ví dụ: 25/10/2026"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Tên bài tập / Tiêu đề nhiệm vụ:</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="Ví dụ: Bài tập tuần 8: Luyện tính nhẩm nhân chia & đọc hiểu"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Lời dặn của Thầy Danh Thanh:</label>
              <input
                type="text"
                value={newTaskNote}
                onChange={e => setNewTaskNote(e.target.value)}
                placeholder="Ví dụ: Các em đọc kỹ đề, tự giác làm bài và nộp trước 17h."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleCreateAssignedTask}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-4 h-4" /> Giao Bài Ngay Cho Học Sinh
              </button>
            </div>
          </div>

          {/* Assigned Tasks and Tracking Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Bảng Kiểm Tra Quá Trình Học Tập & Nộp Bài Của Học Sinh
                </h3>
                <p className="text-xs text-slate-500">
                  Thầy cô nhấp vào từng bài để xem chi tiết danh sách học sinh đã nộp, điểm số và các câu làm sai.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {assignedTasks.map(task => (
                <div
                  key={task.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-100 text-orange-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                          {task.targetClass} • Môn {task.subject === 'math' ? 'Toán' : 'Tiếng Việt'}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          Hạn nộp: <strong className="text-rose-600">{task.dueDate}</strong>
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1">{task.title}</h4>
                      <p className="text-xs text-slate-500">Người giao: {task.assignedBy}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-black text-emerald-600">
                          {task.submissions.length} học sinh đã nộp
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {task.questions.length} câu hỏi
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedTaskDetail(selectedTaskDetail?.id === task.id ? null : task)}
                        className="bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        {selectedTaskDetail?.id === task.id ? 'Ẩn kết quả' : 'Xem kết quả'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Submissions Detail */}
                  {selectedTaskDetail?.id === task.id && (
                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 animate-in fade-in">
                      <h5 className="text-xs font-bold text-slate-700">
                        Danh sách học sinh {task.targetClass} đã nộp bài:
                      </h5>
                      {task.submissions.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Chưa có học sinh nào nộp bài.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                            <thead className="bg-slate-100 text-slate-800 font-bold">
                              <tr>
                                <th className="p-2.5">Mã HS</th>
                                <th className="p-2.5">Họ và tên</th>
                                <th className="p-2.5 text-center">Thời gian nộp</th>
                                <th className="p-2.5 text-center">Điểm số</th>
                                <th className="p-2.5 text-center">Đánh giá</th>
                                <th className="p-2.5">Chi tiết câu sai</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {task.submissions.map((sub, sIdx) => (
                                <tr key={sIdx} className="hover:bg-slate-50">
                                  <td className="p-2.5 font-bold text-indigo-600">{sub.studentId}</td>
                                  <td className="p-2.5 font-bold text-slate-800">{sub.studentName}</td>
                                  <td className="p-2.5 text-center text-slate-500">{sub.submittedAt}</td>
                                  <td className="p-2.5 text-center font-extrabold text-emerald-600">
                                    {sub.score} / {sub.total}
                                  </td>
                                  <td className="p-2.5 text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      sub.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}>
                                      {sub.isPassed ? 'Đạt' : 'Cần hỗ trợ'}
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-slate-600">
                                    {sub.wrongAnswers && sub.wrongAnswers.length > 0 ? (
                                      <span className="text-rose-600">
                                        Sai {sub.wrongAnswers.length} câu: {sub.wrongAnswers.map(w => `"${w.questionPrompt.slice(0, 20)}..."`).join(', ')}
                                      </span>
                                    ) : (
                                      <span className="text-emerald-600 font-semibold">Làm đúng 100%</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 2: KHO HỌC LIỆU & CHỈNH SỬA / THÊM BÀI TẬP */}
      {/* ======================================================== */}
      {activeSubTab === 'edit_questions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-purple-600 uppercase tracking-wider">
                  Quản lý kho học liệu trường TH-THCS Vĩnh Điều
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  Chỉnh Sửa & Bổ Sung Bài Tập Theo Ý Giáo Viên
                </h3>
                <p className="text-xs text-slate-500">
                  Thầy cô có thể thêm câu hỏi mới, sửa đổi nội dung câu hỏi hiện có, đổi phương án đúng hoặc giải thích.
                </p>
              </div>

              <button
                onClick={handleOpenAddQuestion}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all shrink-0"
              >
                <PlusCircle className="w-4 h-4" /> + Thêm Bài Tập Mới
              </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Chọn Khối Lớp:</label>
                <select
                  value={filterGrade}
                  onChange={e => setFilterGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  {[1, 2, 3, 4, 5].map(g => (
                    <option key={g} value={g}>Lớp {g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Chọn Môn Học:</label>
                <select
                  value={filterSubject}
                  onChange={e => setFilterSubject(e.target.value as SubjectType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="math">Toán học</option>
                  <option value="vietnamese">Tiếng Việt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Chọn Chủ Đề / Bài Học:</label>
                <select
                  value={selectedTopicId || activeTopic?.id || ''}
                  onChange={e => setSelectedTopicId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  {currentTopicsList.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Questions List for the selected topic */}
            {activeTopic && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-800">
                    Danh sách bài tập trong chủ đề: <span className="text-purple-700">"{activeTopic.title}"</span> ({activeTopic.questions.length} câu)
                  </h4>
                </div>

                <div className="space-y-3">
                  {activeTopic.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-purple-300 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-purple-700">Câu {idx + 1}</span>
                            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {q.format === 'multiple_choice' ? 'Trắc nghiệm 4 lựa chọn' : 'Điền kết quả'}
                            </span>
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {q.cognitiveLevel}
                            </span>
                          </div>
                          <h5 className="text-sm font-extrabold text-slate-900 leading-snug">{q.prompt}</h5>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleOpenEditQuestion(q)}
                            className="bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 p-1.5 rounded-xl text-xs transition-colors"
                            title="Xóa câu hỏi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pl-4">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className={opt.startsWith(q.correctAnswer.substring(0, 2)) || opt === q.correctAnswer ? 'font-bold text-emerald-700' : ''}>
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-100 space-y-1">
                        <div><strong className="text-emerald-700">Đáp án chuẩn: </strong>{q.correctAnswer}</div>
                        <div><strong className="text-blue-700">Lời giải chi tiết: </strong>{q.solutionExplanation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal / Overlay for Adding or Editing Question */}
          {editingQuestion && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-lg font-black text-slate-900">
                    {editingQuestion.isNew ? 'Thêm Bài Tập Mới Theo Ý Giáo Viên' : 'Chỉnh Sửa Bài Tập'}
                  </h4>
                  <button
                    onClick={() => setEditingQuestion(null)}
                    className="p-1 hover:bg-slate-100 rounded-xl"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Nội dung câu hỏi:</label>
                    <textarea
                      rows={3}
                      value={editingQuestion.question.prompt}
                      onChange={e =>
                        setEditingQuestion({
                          ...editingQuestion,
                          question: { ...editingQuestion.question, prompt: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Dạng câu hỏi:</label>
                      <select
                        value={editingQuestion.question.format}
                        onChange={e =>
                          setEditingQuestion({
                            ...editingQuestion,
                            question: { ...editingQuestion.question, format: e.target.value as any },
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      >
                        <option value="multiple_choice">Trắc nghiệm 4 lựa chọn</option>
                        <option value="fill_blank">Điền kết quả / từ khuyết</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Mức độ nhận thức:</label>
                      <select
                        value={editingQuestion.question.cognitiveLevel}
                        onChange={e =>
                          setEditingQuestion({
                            ...editingQuestion,
                            question: { ...editingQuestion.question, cognitiveLevel: e.target.value as any },
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      >
                        <option value="Nhận biết">Nhận biết</option>
                        <option value="Thông hiểu">Thông hiểu</option>
                        <option value="Vận dụng">Vận dụng</option>
                        <option value="Vận dụng nâng cao">Vận dụng nâng cao</option>
                      </select>
                    </div>
                  </div>

                  {editingQuestion.question.format === 'multiple_choice' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-600">4 Phương án lựa chọn (A, B, C, D):</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[0, 1, 2, 3].map(i => (
                          <input
                            key={i}
                            type="text"
                            placeholder={`Phương án ${String.fromCharCode(65 + i)}...`}
                            value={editingQuestion.question.options?.[i] || ''}
                            onChange={e => {
                              const opts = [...(editingQuestion.question.options || ['', '', '', ''])];
                              opts[i] = e.target.value;
                              setEditingQuestion({
                                ...editingQuestion,
                                question: { ...editingQuestion.question, options: opts },
                              });
                            }}
                            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Đáp án đúng chính xác:</label>
                    <input
                      type="text"
                      value={editingQuestion.question.correctAnswer}
                      onChange={e =>
                        setEditingQuestion({
                          ...editingQuestion,
                          question: { ...editingQuestion.question, correctAnswer: e.target.value },
                        })
                      }
                      placeholder="Ví dụ: A. 12 hoặc 20..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Hướng dẫn giải chi tiết cho học sinh:</label>
                    <textarea
                      rows={2}
                      value={editingQuestion.question.solutionExplanation}
                      onChange={e =>
                        setEditingQuestion({
                          ...editingQuestion,
                          question: { ...editingQuestion.question, solutionExplanation: e.target.value },
                        })
                      }
                      placeholder="Giải thích từng bước để học sinh hiểu vì sao đáp án đúng..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setEditingQuestion(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleSaveEditedQuestion}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-4 h-4" /> Lưu cập nhật bài tập
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 3: TẢI NGỮ LIỆU SÁCH GIÁO KHOA (SGK) */}
      {/* ======================================================== */}
      {activeSubTab === 'textbook_upload' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-teal-600 uppercase tracking-wider">
                Số hóa ngữ liệu học tập
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                Tải & Nhập Ngữ Liệu Sách Giáo Khoa (SGK)
              </h3>
              <p className="text-xs text-slate-500">
                Thầy cô dán bài đọc hoặc đề toán từ sách giáo khoa (*Kết nối tri thức, Cánh diều, Chân trời sáng tạo*), AI sẽ tự động sinh câu hỏi tương tác để học sinh làm bài ngay.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Bộ sách giáo khoa:</label>
                <select
                  value={bookSeries}
                  onChange={e => setBookSeries(e.target.value as BookSeries)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="Kết nối tri thức">Kết nối tri thức với cuộc sống</option>
                  <option value="Cánh diều">Cánh diều</option>
                  <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Khối lớp:</label>
                <select
                  value={tbGrade}
                  onChange={e => setTbGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  {[1, 2, 3, 4, 5].map(g => (
                    <option key={g} value={g}>Lớp {g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Môn học:</label>
                <select
                  value={tbSubject}
                  onChange={e => setTbSubject(e.target.value as SubjectType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="vietnamese">Tiếng Việt</option>
                  <option value="math">Toán học</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tên bài học / Tiết học:</label>
                <input
                  type="text"
                  value={tbUnitLesson}
                  onChange={e => setTbUnitLesson(e.target.value)}
                  placeholder="Ví dụ: Bài 12: Đầm sen..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Dán nội dung đoạn văn / bài toán từ sách giáo khoa:
              </label>
              <textarea
                rows={5}
                value={tbRawText}
                onChange={e => setTbRawText(e.target.value)}
                placeholder="Dán toàn bộ văn bản bài đọc, bài thơ hoặc đề toán từ sách giáo khoa vào đây..."
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-teal-500 font-serif leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleParseTextbook}
                disabled={isParsingTb || !tbRawText.trim()}
                className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {isParsingTb ? 'AI đang phân tích & sinh câu hỏi...' : 'AI Xử Lý & Tạo Bài Tập Từ Ngữ Liệu SGK'}
              </button>
            </div>
          </div>

          {/* Parsed Result Preview */}
          {parsedTbMaterial && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-extrabold text-teal-600 uppercase">
                    Ngữ liệu SGK: {parsedTbMaterial.bookSeries} • Lớp {parsedTbMaterial.grade}
                  </span>
                  <h4 className="text-xl font-black text-slate-900 mt-0.5">{parsedTbMaterial.title}</h4>
                </div>

                <button
                  onClick={handleSaveTextbookToCurriculum}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" /> Lưu & Đưa Vào Kho Học Liệu Cho Học Sinh Làm
                </button>
              </div>

              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 text-slate-800 text-sm font-serif leading-relaxed">
                {parsedTbMaterial.content}
              </div>

              {parsedTbMaterial.vocabularyNotes && parsedTbMaterial.vocabularyNotes.length > 0 && (
                <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-100 text-xs space-y-1.5">
                  <span className="font-bold text-teal-900">Từ khó trích xuất từ bài:</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {parsedTbMaterial.vocabularyNotes.map((v, idx) => (
                      <span key={idx} className="bg-white px-2.5 py-1 rounded-lg border border-teal-200">
                        <strong>{v.word}:</strong> {v.meaning}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h5 className="text-sm font-black text-slate-900">
                  Câu hỏi AI tự động sinh bám sát ngữ liệu ({parsedTbMaterial.questions.length} câu):
                </h5>
                {parsedTbMaterial.questions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-purple-700">Câu {idx + 1}:</span>
                      <span className="text-xs font-extrabold text-slate-800">{q.prompt}</span>
                    </div>
                    {q.options && (
                      <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 pl-4">
                        {q.options.map((opt: string, oIdx: number) => (
                          <div key={oIdx}>{opt}</div>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-emerald-800 font-bold bg-white p-2 rounded-lg border border-emerald-100">
                      Đáp án đúng: {q.correctAnswer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 4: AI WORKSHEET GENERATOR */}
      {/* ======================================================== */}
      {activeSubTab === 'ai_worksheet' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6 no-print">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">
                Biên Soạn Phiếu Học Tập Tự Động (Gemini 3.8 AI)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Giáo viên cấu hình mục tiêu cần đạt, AI tự động sinh ngân hàng câu hỏi phân hóa. Thầy Danh Thanh có thể chỉnh sửa và in ấn A4.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Khối lớp:</label>
                <select
                  value={wsGrade}
                  onChange={e => setWsGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  {[1, 2, 3, 4, 5].map(g => (
                    <option key={g} value={g}>Lớp {g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Môn học:</label>
                <select
                  value={wsSubject}
                  onChange={e => setWsSubject(e.target.value as SubjectType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="math">Toán học</option>
                  <option value="vietnamese">Tiếng Việt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Số lượng câu hỏi:</label>
                <select
                  value={wsCount}
                  onChange={e => setWsCount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value={3}>3 câu củng cố</option>
                  <option value={5}>5 câu tiêu chuẩn</option>
                  <option value={10}>10 câu kiểm tra 15 phút</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Mức độ nhận thức:</label>
                <select
                  value={wsDifficulty}
                  onChange={e => setWsDifficulty(e.target.value as CognitiveLevel)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="Nhận biết">Nhận biết</option>
                  <option value="Thông hiểu">Thông hiểu</option>
                  <option value="Vận dụng">Vận dụng</option>
                  <option value="Vận dụng nâng cao">Vận dụng nâng cao</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tên chủ đề / Bài học:</label>
                <input
                  type="text"
                  value={wsTopic}
                  onChange={e => setWsTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Yêu cầu cần đạt:</label>
                <input
                  type="text"
                  value={wsRequirement}
                  onChange={e => setWsRequirement(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGenerateWs}
                disabled={isGeneratingWs || !wsTopic.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {isGeneratingWs ? 'AI đang biên soạn...' : 'Tạo Phiếu Bằng Gemini AI'}
              </button>
            </div>
          </div>

          {currentWorksheet && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6 print-page">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="text-xs uppercase font-extrabold text-slate-500">
                    Trường TH-THCS Vĩnh Điều, xã Vĩnh Điều, An Giang
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {currentWorksheet.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    Khối lớp: {currentWorksheet.grade} • Giáo viên: Thầy Danh Thanh • Ngày tạo: {currentWorksheet.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" /> In phiếu A4 (PDF)
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {currentWorksheet.questions.map((q, idx) => (
                  <div key={idx} className="space-y-1.5 border-b border-slate-100 pb-3">
                    <div className="flex items-start gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">Câu {idx + 1}:</span>
                      <p className="text-sm text-slate-800 leading-relaxed font-medium">{q.prompt}</p>
                    </div>
                    {q.options && (
                      <div className="grid grid-cols-2 gap-1 pl-6 text-xs text-slate-700">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx}>{opt}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 5: QUẢN LÝ LỚP HỌC */}
      {/* ======================================================== */}
      {activeSubTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_CLASSES.map(cls => (
            <div
              key={cls.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="bg-purple-100 text-purple-800 text-xs font-black px-2.5 py-1 rounded-full">
                  {cls.className}
                </span>
                <span className="text-xs font-bold text-slate-500">{cls.studentCount} học sinh</span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-500">Giáo viên phụ trách:</div>
                <div className="text-sm font-extrabold text-slate-900">{cls.teacherName}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl text-xs">
                <div>
                  <span className="text-slate-400">Khảo sát đầu:</span>
                  <div className="font-extrabold text-slate-800 text-sm">{cls.preTestAvg}/10</div>
                </div>
                <div>
                  <span className="text-slate-400">Sau áp dụng:</span>
                  <div className="font-extrabold text-emerald-600 text-sm">{cls.postTestAvg}/10</div>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
                <span className="font-bold text-rose-900">Vấn đề cần củng cố: </span>
                {cls.topWeakness}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 6: THỐNG KÊ LỖI SAI PHỔ BIẾN */}
      {/* ======================================================== */}
      {activeSubTab === 'errors' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xl font-black text-slate-900">
              Nhật Ký & Thống Kê Các Lỗi Sai Trọng Tâm Toàn Trường
            </h3>
            <p className="text-xs text-slate-500">
              Trường TH-THCS Vĩnh Điều, xã Vĩnh Điều, An Giang: Trích xuất tự động từ hệ thống AI phát hiện lỗi sai.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { subject: 'Toán học', error: 'Nhầm phép nhân thành phép cộng (ví dụ 3 x 4 = 7 thay vì 12)', count: 68, freq: 'Rất cao (Lớp 2 - 3)', action: 'Cho học sinh biểu diễn 4 nhóm đồ vật trực quan' },
              { subject: 'Toán học', error: 'Cộng tử với tử, mẫu với mẫu hai phân số khác mẫu (1/2 + 1/3 = 2/5)', count: 54, freq: 'Cao (Lớp 4)', action: 'Ôn tập bước quy đồng mẫu số chung trước khi cộng' },
              { subject: 'Toán học', error: 'Quên số nhớ khi thực hiện phép cộng trừ trong phạm vi 100', count: 47, freq: 'Trung bình (Lớp 2)', action: 'Dùng bút chì chấm nhẹ số 1 lên hàng chục khi đặt tính' },
              { subject: 'Tiếng Việt', error: 'Nhầm lẫn giữa Chủ ngữ và Trạng ngữ đứng đầu câu', count: 41, freq: 'Cao (Lớp 4 - 5)', action: 'Rèn luyện câu hỏi tìm vị ngữ (Ai? làm gì? ở đâu?)' },
              { subject: 'Tiếng Việt', error: 'Sai chính tả phân biệt s/x, d/gi/r', count: 39, freq: 'Thường xuyên', action: 'Tập chép và mở rộng vốn từ theo ngữ cảnh địa phương' },
            ].map((e, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      e.subject === 'Toán học' ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'
                    }`}>
                      {e.subject}
                    </span>
                    <span className="text-xs font-bold text-slate-500">Tần suất: {e.freq}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">{e.error}</h4>
                  <p className="text-xs text-slate-600">
                    <strong className="text-emerald-700">Khuyến nghị sư phạm của Thầy Danh Thanh: </strong> {e.action}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-black text-rose-600">{e.count} lượt</div>
                  <div className="text-[10px] text-slate-400">ghi nhận từ hệ thống</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 6: CÀI ĐẶT GIỌNG ĐỌC MẪU TIẾNG VIỆT (TTS) */}
      {/* ======================================================== */}
      {activeSubTab === 'audio_settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-black uppercase text-purple-700 tracking-wider">
                Cấu hình âm thanh & giọng đọc chuẩn
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Kiểm Tra Giọng Đọc Tiếng Việt (Web Speech TTS)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Bảo vệ trải nghiệm học sinh: Tuyệt đối không đọc sai nội dung hoặc đọc bằng giọng tiếng Anh. Chỉ kích hoạt khi thiết bị có Voice tiếng Việt chuẩn.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Trạng thái giọng đọc trên thiết bị này:</span>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                  audioService.hasVietnameseVoice() ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {audioService.hasVietnameseVoice() ? 'Hỗ trợ tiếng Việt chuẩn' : 'Chưa có Voice vi-VN'}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Voice phát hiện:</strong> {audioService.getVietnameseVoiceInfo().voiceName}</p>
                <p><strong>Mã ngôn ngữ:</strong> {audioService.getVietnameseVoiceInfo().lang || 'Chưa nhận diện'}</p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleTestVietnameseVoice}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Phát âm thử giọng đọc
                </button>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ttsToggle"
                    checked={ttsPermitted}
                    onChange={e => handleToggleTtsPermitted(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <label htmlFor="ttsToggle" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Cho phép hiển thị nút "Nghe đọc mẫu" cho học sinh Lớp 2
                  </label>
                </div>
              </div>

              {voiceTestMessage && (
                <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs font-bold text-purple-900 animate-in fade-in">
                  📢 {voiceTestMessage}
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-2">
              <span className="font-bold">Phương án âm thanh MP3 tự ghi âm của Thầy Cô:</span>
              <p className="leading-relaxed">
                Thầy/Cô có thể tự ghi âm bài đọc hoặc tải tệp âm thanh MP3 vào từng bài trong mục <strong>"1. Quản lý ngân hàng bài học"</strong>. Khi có tệp MP3, hệ thống sẽ ưu tiên phát âm thanh ghi âm thật của giáo viên, mang lại sự ấm áp và truyền cảm tự nhiên nhất cho học sinh Lớp 2.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl max-w-2xl w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-black text-slate-900">Nhập Học Liệu Hàng Loạt Từ Tệp CSV</h4>
                <p className="text-xs text-slate-500">Dán nội dung tệp CSV theo đúng định dạng mẫu của hệ thống</p>
              </div>
              <button onClick={() => setIsCsvModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <textarea
                value={csvInputText}
                onChange={e => setCsvInputText(e.target.value)}
                rows={8}
                placeholder="Dán nội dung CSV vào đây (Bao gồm dòng tiêu đề)..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-between items-center text-xs">
                <button
                  onClick={handleDownloadCsvTemplate}
                  className="text-blue-600 hover:underline font-bold"
                >
                  📥 Tải tệp CSV mẫu chuẩn
                </button>
                <span className="text-slate-400">Kiểm tra cột: MaBai, MonHoc, TapSach, ChuDe, SoBai, TenBai...</span>
              </div>
            </div>

            {csvImportResult && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                csvImportResult.errors.length > 0 ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              }`}>
                {csvImportResult.errors.length > 0 ? (
                  <div>
                    <p>Có lỗi trong quá trình nhập:</p>
                    <ul className="list-disc list-inside font-normal">
                      {csvImportResult.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>🎉 Nhập thành công {csvImportResult.successCount} bài học mới vào ngân hàng học liệu!</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Đóng
              </button>
              <button
                onClick={handleRunCsvImport}
                className="bg-teal-600 hover:bg-teal-700 text-white font-black text-xs px-5 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Bắt đầu nhập dữ liệu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Editor Modal */}
      {isLessonEditorOpen && (
        <LessonEditorModal
          lesson={editingCurriculumLesson}
          isOpen={isLessonEditorOpen}
          onClose={() => setIsLessonEditorOpen(false)}
          onSaved={() => {
            refreshGrade2Lessons();
          }}
        />
      )}
    </div>
  );
};
