import React, { useState } from 'react';
import { GradeLevel, SubjectType, CognitiveLevel, GeneratedWorksheet } from '../types';
import { DEMO_CLASSES } from '../data/demoStudents';
import { generateWorksheet } from '../services/aiService';
import { StorageService } from '../services/storageService';
import { 
  Users, 
  FileText, 
  Printer, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  Download, 
  Edit3, 
  Search,
  BookOpen,
  Calculator,
  Calendar,
  AlertTriangle,
  Award
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'classes' | 'ai_worksheet' | 'errors' | 'bank'>('ai_worksheet');

  // AI Worksheet Generator State
  const [grade, setGrade] = useState<GradeLevel>(2);
  const [subject, setSubject] = useState<SubjectType>('math');
  const [topic, setTopic] = useState<string>('Phép nhân và Bảng nhân 2, 5');
  const [requirement, setRequirement] = useState<string>('Học sinh hiểu bản chất phép nhân và tính nhẩm chính xác');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<CognitiveLevel>('Vận dụng');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentWorksheet, setCurrentWorksheet] = useState<GeneratedWorksheet | null>(null);

  // Saved worksheets
  const [savedWorksheets, setSavedWorksheets] = useState<GeneratedWorksheet[]>(() =>
    StorageService.getTeacherWorksheets()
  );

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const ws = await generateWorksheet(grade, subject, topic, requirement, questionCount, difficulty);
      setCurrentWorksheet(ws);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveWorksheet = () => {
    if (!currentWorksheet) return;
    StorageService.saveTeacherWorksheet(currentWorksheet);
    setSavedWorksheets(StorageService.getTeacherWorksheets());
    alert('Đã lưu phiếu học tập vào Ngân hàng câu hỏi giáo viên thành công!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    // Generate CSV data from demo classes
    let csv = 'Mã lớp,Tên lớp,Khối lớp,Sĩ số,Điểm TB khảo sát đầu,Điểm TB sau áp dụng,Tỉ lệ hoàn thành (%),Lỗi sai trọng tâm,Giáo viên phụ trách\n';
    DEMO_CLASSES.forEach(c => {
      csv += `${c.id},"${c.className}",${c.grade},${c.studentCount},${c.preTestAvg},${c.postTestAvg},${c.completionRate}%,"${c.topWeakness}","${c.teacherName}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bao_cao_lop_hoc_Vinh_Dieu_Smart_AI_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden no-print">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> KHÔNG GIAN GIÁO VIÊN AI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Quản Trị Dạy Học & Biên Soạn Đề Thông Minh
            </h2>
            <p className="text-purple-200 text-xs sm:text-sm mt-1 max-w-xl">
              Hỗ trợ thầy cô Trường TH-THCS Vĩnh Điều thiết kế phiếu học tập chuẩn GDPT 2018 bằng Gemini AI, theo dõi phân hóa năng lực và giảm tải thời gian soạn bài.
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

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('ai_worksheet')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 border ${
              activeSubTab === 'ai_worksheet'
                ? 'bg-white text-purple-900 border-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-purple-100 border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1" /> Tạo Phiếu Học Tập Bằng AI
          </button>

          <button
            onClick={() => setActiveSubTab('classes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 border ${
              activeSubTab === 'classes'
                ? 'bg-white text-purple-900 border-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-purple-100 border-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5 inline mr-1" /> Quản Lý Lớp Học & Học Sinh ({DEMO_CLASSES.length})
          </button>

          <button
            onClick={() => setActiveSubTab('errors')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 border ${
              activeSubTab === 'errors'
                ? 'bg-white text-purple-900 border-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-purple-100 border-white/10'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 inline mr-1" /> Thống Kê Các Lỗi Sai Phổ Biến
          </button>
        </div>
      </div>

      {/* SubTab 1: AI Worksheet Generator */}
      {activeSubTab === 'ai_worksheet' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6 no-print">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">
                Biên Soạn Phiếu Học Tập Tự Động (Gemini 3.8 AI)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Giáo viên cấu hình mục tiêu cần đạt, AI sẽ tự động sinh ngân hàng câu hỏi phân hóa theo các mức độ nhận thức. Thầy cô hoàn toàn có quyền duyệt và chỉnh sửa trước khi in.
              </p>
            </div>

            {/* Generator Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Khối lớp:</label>
                <select
                  value={grade}
                  onChange={e => setGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800"
                >
                  <option value={1}>Lớp 1</option>
                  <option value={2}>Lớp 2</option>
                  <option value={3}>Lớp 3</option>
                  <option value={4}>Lớp 4</option>
                  <option value={5}>Lớp 5</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Môn học:</label>
                <select
                  value={subject}
                  onChange={e => {
                    const s = e.target.value as SubjectType;
                    setSubject(s);
                    if (s === 'math') setTopic('Phép tính cộng trừ có nhớ');
                    else setTopic('Đọc hiểu và mở rộng vốn từ quê hương');
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800"
                >
                  <option value="math">Toán học</option>
                  <option value="vietnamese">Tiếng Việt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Số lượng câu hỏi:</label>
                <select
                  value={questionCount}
                  onChange={e => setQuestionCount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800"
                >
                  <option value={3}>3 câu củng cố</option>
                  <option value={5}>5 câu tiêu chuẩn (Khuyên dùng)</option>
                  <option value={10}>10 câu kiểm tra 15 phút</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Mức độ nhận thức:</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as CognitiveLevel)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800"
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
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="Ví dụ: Phân số, Bảng nhân 2, Từ láy, Trạng ngữ..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Yêu cầu cần đạt (GDPT 2018):</label>
                <input
                  type="text"
                  value={requirement}
                  onChange={e => setRequirement(e.target.value)}
                  placeholder="Ví dụ: Học sinh phân biệt được từ ghép và từ láy..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-extrabold px-6 py-3 rounded-2xl text-sm shadow-md flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {isGenerating ? 'AI đang biên soạn câu hỏi...' : 'Tạo Phiếu Bằng Gemini AI'}
              </button>
            </div>
          </div>

          {/* Generated Worksheet Preview & Print Area */}
          {currentWorksheet && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6 print-page">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="text-xs uppercase font-extrabold text-slate-500">
                    Trường TH-THCS Vĩnh Điều – Tỉnh An Giang
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {currentWorksheet.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    Khối lớp: {currentWorksheet.grade} • Môn: {currentWorksheet.subject === 'math' ? 'Toán' : 'Tiếng Việt'} • Ngày tạo: {currentWorksheet.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={handleSaveWorksheet}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Lưu ngân hàng
                  </button>
                  <button
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-4 h-4" /> In phiếu A4 (PDF)
                  </button>
                </div>
              </div>

              {/* Student header on printed worksheet */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600 border border-slate-200 p-3 rounded-xl bg-slate-50/50">
                <div>Họ và tên học sinh: ................................................................</div>
                <div>Lớp: ......................... Điểm: ......................</div>
              </div>

              {/* Questions list */}
              <div className="space-y-6 pt-2">
                {currentWorksheet.questions.map((q, idx) => (
                  <div key={idx} className="space-y-2 border-b border-slate-100 pb-4 last:border-0">
                    <div className="flex items-start gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">Câu {idx + 1}:</span>
                      <p className="text-sm text-slate-800 leading-relaxed font-medium">{q.prompt}</p>
                    </div>

                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="text-xs sm:text-sm text-slate-700">
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Teacher Guide & Error note (hidden or collapsible) */}
                    <div className="mt-2 pl-6 pt-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-slate-600 space-y-1 no-print">
                      <div>
                        <strong className="text-emerald-700">Đáp án chuẩn: </strong> {q.correctAnswer}
                      </div>
                      <div>
                        <strong className="text-blue-700">Hướng dẫn giải: </strong> {q.explanation}
                      </div>
                      {q.commonErrorNote && (
                        <div>
                          <strong className="text-rose-700">Lưu ý lỗi thường gặp: </strong> {q.commonErrorNote}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SubTab 2: Class Management */}
      {activeSubTab === 'classes' && (
        <div className="space-y-4">
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
        </div>
      )}

      {/* SubTab 3: Common Error Statistics */}
      {activeSubTab === 'errors' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-slate-900">
              Nhật Ký & Thống Kê Các Lỗi Sai Trọng Tâm Toàn Trường
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Dữ liệu được trích xuất tự động từ hệ thống AI phát hiện lỗi sai trong các đợt luyện tập của học sinh.
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
                    <strong className="text-emerald-700">Khuyến nghị sư phạm: </strong> {e.action}
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
    </div>
  );
};
