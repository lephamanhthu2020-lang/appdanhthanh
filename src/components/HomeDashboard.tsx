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
  currentGrade,
  onSelectGrade,
  onNavigate,
  studentProfile,
  onOpenMamAI,
}) => {
  const gradeCards: { grade: GradeLevel; title: string; subtitle: string; icon: string; bgGrad: string; borderCol: string }[] = [
    { grade: 1, title: 'LỚP 1', subtitle: 'Làm quen số & ghép âm vần', icon: '🐣', bgGrad: 'from-pink-500/10 to-rose-500/10', borderCol: 'border-pink-300' },
    { grade: 2, title: 'LỚP 2', subtitle: 'Phép nhân chia & đọc hiểu', icon: '🌟', bgGrad: 'from-amber-500/10 to-orange-500/10', borderCol: 'border-amber-300' },
    { grade: 3, title: 'LỚP 3', subtitle: 'Bảng nhân lớn & câu kể', icon: '🚀', bgGrad: 'from-emerald-500/10 to-teal-500/10', borderCol: 'border-emerald-300' },
    { grade: 4, title: 'LỚP 4', subtitle: 'Phân số & trạng ngữ câu', icon: '🏆', bgGrad: 'from-sky-500/10 to-blue-500/10', borderCol: 'border-sky-300' },
    { grade: 5, title: 'LỚP 5', subtitle: 'Số thập phân & tập làm văn', icon: '🎓', bgGrad: 'from-indigo-500/10 to-purple-500/10', borderCol: 'border-indigo-300' },
  ];

  const features = [
    {
      id: 'math',
      number: '1',
      title: 'HỌC TOÁN CÙNG AI',
      desc: `Luyện tập số học, hình học Lớp ${currentGrade} với bộ phát hiện lỗi sai thông minh.`,
      icon: <Calculator className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 text-blue-900 border-blue-200 hover:border-blue-500',
      tag: 'Phát hiện lỗi sai',
      action: () => onNavigate('math'),
    },
    {
      id: 'vietnamese',
      number: '2',
      title: 'KHÁM PHÁ TIẾNG VIỆT',
      desc: 'Luyện đọc diễn cảm TTS, mở rộng vốn từ quê hương và luyện viết văn.',
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
      id: 'daily',
      number: '5',
      title: 'THỬ THÁCH HÔM NAY',
      desc: 'Thử thách phản xạ nhanh 5 câu hỏi ngẫu nhiên để tích lũy thêm sao.',
      icon: <Zap className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-50 text-orange-900 border-orange-200 hover:border-orange-500',
      tag: '5 câu mỗi ngày',
      action: () => onNavigate('games'),
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
      desc: 'Tạo phiếu học tập bằng AI, quản lý danh sách học sinh và xuất báo cáo.',
      icon: <Users className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50 text-purple-900 border-purple-200 hover:border-purple-500',
      tag: 'Dành cho giáo viên',
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
            Ứng dụng công nghệ Gemini AI sư phạm hỗ trợ cá nhân hóa học tập cho học sinh Trường TH-THCS Vĩnh Điều (An Giang). Giúp em tự tin sửa lỗi sai, phát triển tư duy và làm chủ kiến thức tiểu học.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('math')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Vào Phòng Học Toán Lớp {currentGrade} <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('vietnamese')}
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Khám Phá Tiếng Việt <ChevronRight className="w-4 h-4" />
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

      {/* Grade Selector Section (IV. HỆ THỐNG LỰA CHỌN LỚP) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
              Khối lớp tiểu học
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Chọn Khối Lớp Học (Lớp 1 đến Lớp 5)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
            Đang học: <strong className="text-blue-600">Lớp {currentGrade}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {gradeCards.map(item => {
            const isSelected = currentGrade === item.grade;
            return (
              <div
                key={item.grade}
                onClick={() => {
                  audioService.playCorrect();
                  onSelectGrade(item.grade);
                }}
                className={`cursor-pointer rounded-3xl p-5 border-2 transition-all flex flex-col justify-between text-left ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 shadow-lg scale-102 ring-4 ring-blue-100'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h4 className="text-lg font-black text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.subtitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-xs font-extrabold ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                    {isSelected ? 'Đang chọn' : 'Vào lớp học'}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8 Main Functional Hub Cards */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
            Các tính năng cốt lõi
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Không Gian Học Tập Toàn Diện Lớp {currentGrade}
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
