import React from 'react';
import { GradeLevel, StudentProfile, SubjectType } from '../types';
import { 
  Calculator, 
  BookOpen, 
  Gamepad2, 
  Bot, 
  Zap, 
  Award, 
  Star, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  MapPin,
  Flame,
  Presentation
} from 'lucide-react';
import { audioService } from '../services/audioService';

interface HomeDashboardProps {
  currentGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onNavigate: (tab: string) => void;
  studentProfile: StudentProfile;
  onOpenMamAI: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  currentGrade: _currentGrade,
  onSelectGrade: _onSelectGrade,
  onNavigate,
  studentProfile,
  onOpenMamAI,
}) => {
  const features = [
    {
      id: 'math',
      number: '1',
      title: 'HỌC TOÁN CÙNG AI',
      desc: 'Luyện tập 75 bài học Toán Lớp 2 (Tập 1 & Tập 2) với bộ phát hiện lỗi sai thông minh.',
      icon: <Calculator className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 text-blue-900 border-blue-200 hover:border-blue-500',
      tag: 'Phát hiện lỗi sai',
      action: () => onNavigate('math'),
    },
    {
      id: 'vietnamese',
      number: '2',
      title: 'KHÁM PHÁ TIẾNG VIỆT',
      desc: 'Luyện đọc diễn cảm TTS chuẩn vi-VN, phân tích đọc hiểu và mở rộng vốn từ quê hương.',
      icon: <BookOpen className="w-6 h-6 text-teal-600" />,
      color: 'bg-teal-50 text-teal-900 border-teal-200 hover:border-teal-500',
      tag: 'Luyện đọc & Viết',
      action: () => onNavigate('vietnamese'),
    },
    {
      id: 'games',
      number: '3',
      title: 'TRÒ CHƠI TRI THỨC',
      desc: '4 trò chơi tương tác: AI Nhanh Hơn, Giải Cứu Khu Vườn, Ghép Đôi, Sắp Xếp.',
      icon: <Gamepad2 className="w-6 h-6 text-amber-600" />,
      color: 'bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-500',
      tag: 'Học mà chơi',
      action: () => onNavigate('games'),
    },
    {
      id: 'mam_ai',
      number: '4',
      title: 'TRỢ GIẢNG AI',
      desc: 'Mầm AI – Bạn đồng hành tri thức, luôn lắng nghe và gợi mở từng bước.',
      icon: <Bot className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:border-emerald-500',
      tag: 'Gemini 3.8 AI',
      action: onOpenMamAI,
    },
    {
      id: 'tasks',
      number: '5',
      title: 'NHIỆM VỤ ĐƯỢC GIAO',
      desc: 'Bài tập và nhiệm vụ rèn luyện do Thầy Danh Thanh giao trực tiếp cho lớp.',
      icon: <Zap className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-50 text-orange-900 border-orange-200 hover:border-orange-500',
      tag: 'Thầy Danh Thanh giao',
      action: () => onNavigate('tasks'),
    },
    {
      id: 'competency',
      number: '6',
      title: 'BẢN ĐỒ NĂNG LỰC',
      desc: 'Mô hình 4T (Thấu hiểu – Thích ứng – Thực hành – Tiến bộ) thang điểm 0–100.',
      icon: <Award className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:border-indigo-500',
      tag: 'Mô hình 4T',
      action: () => onNavigate('competency'),
    },
    {
      id: 'achievements',
      number: '7',
      title: 'THÀNH TÍCH CỦA EM',
      desc: `Đã tích lũy ${studentProfile.stars} sao vàng và ${studentProfile.streakDays} ngày học liên tục.`,
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-50 text-yellow-900 border-yellow-200 hover:border-yellow-500',
      tag: 'Huy hiệu khen thưởng',
      action: () => onNavigate('competency'),
    },
    {
      id: 'teacher',
      number: '8',
      title: 'KHÔNG GIAN GIÁO VIÊN',
      desc: 'Tự do thêm/sửa bài tập, tải ngữ liệu SGK, giao bài và kiểm tra tiến độ học sinh.',
      icon: <Users className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50 text-purple-900 border-purple-200 hover:border-purple-500',
      tag: 'Giáo viên: Danh Thanh',
      action: () => onNavigate('teacher'),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Big Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-12 shadow-2xl overflow-hidden border border-blue-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Hệ Sinh Thái Học Tập Thông Minh GDPT 2018
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            CHÀO MỪNG ĐẾN VỚI<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-amber-300">
              THẾ GIỚI HỌC TẬP THÔNG MINH!
            </span>
          </h2>

          <p className="text-base sm:text-xl font-bold text-slate-200">
            "Học Toán thật vui – Khám phá Tiếng Việt thật hay!"
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Ứng dụng công nghệ Gemini AI sư phạm hỗ trợ cá nhân hóa học tập cho học sinh Trường TH-THCS Vĩnh Điều, xã Vĩnh Điều, An Giang. Giáo viên hướng dẫn: <strong>Thầy Danh Thanh</strong>. Giúp em tự tin sửa lỗi sai, phát triển tư duy và làm chủ kiến thức tiểu học.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('math')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Vào Phòng Học Toán 2 <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('vietnamese')}
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Khám Phá Tiếng Việt 2 <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <Presentation className="w-4 h-4 text-amber-300" /> Trình diễn Hội thi
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Grade 2 Curriculum Hub (Toán & Tiếng Việt Kết Nối Tri Thức) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
              Khung chương trình GDPT 2018
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Không Gian Chuyên Biệt Lớp 2 – Bộ Sách Kết Nối Tri Thức
            </h3>
          </div>
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            75 Bài Toán • 66 Bài Tiếng Việt
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Math 2 Showcase Card */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white shadow-xl border border-blue-700/50 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-black px-3 py-1 rounded-full uppercase">
                  Môn Toán Lớp 2
                </span>
                <span className="text-xs text-amber-300 font-bold bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                  14 Chủ đề • 75 Bài
                </span>
              </div>
              <h4 className="text-2xl font-black text-white">Khám Phá & Chinh Phục Toán Học</h4>
              <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
                Hệ thống 75 bài học theo 2 tập sách Kết nối tri thức. Rèn luyện phép cộng, trừ có nhớ, bảng nhân chia 2 & 5, hình học và đại lượng đo lường với chẩn đoán sai lầm AI sư phạm.
              </p>
              
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold">
                <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                  <div className="text-amber-300 font-bold text-[11px]">Tập Một: 36 Bài</div>
                  <div className="text-slate-300 text-[10px]">Chủ đề 1 đến 7 (Số & phép tính 100)</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                  <div className="text-emerald-300 font-bold text-[11px]">Tập Hai: 39 Bài</div>
                  <div className="text-slate-300 text-[10px]">Chủ đề 8 đến 14 (Phép nhân chia, số 1000)</div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
              <a
                href="https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-toan-2-tap-mot.4698648594#page=0"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-200 hover:text-white underline font-semibold flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" /> Mở SGK Toán gốc
              </a>
              <button
                onClick={() => onNavigate('math')}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                Vào Phòng Học Toán 2 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Vietnamese 2 Showcase Card */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-950 text-white shadow-xl border border-teal-700/50 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-teal-500/30 text-teal-200 border border-teal-400/30 text-xs font-black px-3 py-1 rounded-full uppercase">
                  Môn Tiếng Việt Lớp 2
                </span>
                <span className="text-xs text-emerald-300 font-bold bg-emerald-400/20 px-2.5 py-0.5 rounded-full border border-emerald-300/30">
                  9 Chủ điểm • 66 Bài
                </span>
              </div>
              <h4 className="text-2xl font-black text-white">Thế Giới Diệu Kỳ Của Tiếng Việt</h4>
              <p className="text-xs sm:text-sm text-teal-100 mt-2 leading-relaxed">
                Hệ thống 66 bài học & tuần ôn tập theo Kết nối tri thức. Giọng đọc mẫu tiếng Việt chuẩn vi-VN, phân tích đọc hiểu, mở rộng vốn từ quê hương và luyện câu đố vui.
              </p>
              
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold">
                <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                  <div className="text-emerald-300 font-bold text-[11px]">Tập Một: 34 Bài/Tuần</div>
                  <div className="text-slate-300 text-[10px]">Chủ điểm 1 đến 4 (Em lớn lên, Mái trường)</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                  <div className="text-amber-300 font-bold text-[11px]">Tập Hai: 32 Bài/Tuần</div>
                  <div className="text-slate-300 text-[10px]">Chủ điểm 5 đến 9 (Bốn mùa, Đất nước con người)</div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
              <a
                href="https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tieng-viet-2-tap-mot.4698590737#page=0"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-teal-200 hover:text-white underline font-semibold flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" /> Mở SGK Tiếng Việt gốc
              </a>
              <button
                onClick={() => onNavigate('vietnamese')}
                className="bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                Vào Phòng Tiếng Việt 2 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Main Functional Hub Cards */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
            Các tính năng cốt lõi
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Không Gian Học Tập Toàn Diện Lớp 2
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(f => (
            <div
              key={f.id}
              onClick={f.action}
              className={`rounded-3xl p-6 border-2 transition-all cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${f.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-2xl bg-white shadow-2xs">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {f.tag}
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900">{f.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{f.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Khám phá ngay</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Local Culture Banner */}
      <div
        onClick={() => onNavigate('angiang')}
        className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shrink-0">
            🌾
          </div>
          <div>
            <span className="bg-emerald-400/20 text-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              Tự hào quê hương
            </span>
            <h4 className="text-lg font-black text-white mt-0.5">Em Yêu Quê Hương An Giang</h4>
            <p className="text-xs text-emerald-100">
              Khám phá bài toán tính tiền đi chợ Vĩnh Điều, câu chuyện rừng tràm Trà Sư và hạt ngọc Ba Chúc.
            </p>
          </div>
        </div>

        <button className="bg-white text-emerald-950 font-black px-5 py-2.5 rounded-2xl text-xs shrink-0 shadow-sm">
          Khám phá góc địa phương →
        </button>
      </div>
    </div>
  );
};
