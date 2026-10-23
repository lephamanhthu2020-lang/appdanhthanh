import React, { useState } from 'react';
import { 
  Presentation, 
  Sparkles, 
  CheckCircle, 
  Award, 
  ChevronRight, 
  ShieldCheck, 
  Layers, 
  BrainCircuit, 
  Cpu, 
  School,
  ArrowRight,
  PlayCircle
} from 'lucide-react';

interface CompetitionAboutProps {
  onStartDemoStep: (tab: string) => void;
}

export const CompetitionAbout: React.FC<CompetitionAboutProps> = ({ onStartDemoStep }) => {
  const [activeDemoStep, setActiveDemoStep] = useState<number>(1);

  const demoSteps = [
    {
      step: 1,
      title: 'Bước 1: Học sinh bắt đầu khảo sát & làm bài',
      desc: 'Học sinh đăng nhập bằng mã ẩn danh (VD-2026-089), mở bài học môn Toán hoặc Tiếng Việt để thực hiện bài luyện tập ban đầu.',
      targetTab: 'math',
      badge: 'Khảo sát đầu vào',
    },
    {
      step: 2,
      title: 'Bước 2: AI phát hiện & chẩn đoán loại lỗi sai',
      desc: 'Khi học sinh làm sai (ví dụ 3 x 4 = 7), công nghệ AI không chỉ chấm sai mà phân tích ngay nguyên nhân nhận thức (nhầm nhân thành cộng) và đưa ra gợi ý sư phạm.',
      targetTab: 'math',
      badge: 'Chẩn đoán Sư phạm AI',
    },
    {
      step: 3,
      title: 'Bước 3: Điều chỉnh bài luyện cá nhân hóa (4T)',
      desc: 'Hệ thống thích ứng theo kết quả, tự động đề xuất câu hỏi củng cố cùng dạng với số liệu trực quan để học sinh tự làm lại và khắc phục lỗi.',
      targetTab: 'competency',
      badge: 'Thích ứng thông minh',
    },
    {
      step: 4,
      title: 'Bước 4: Củng cố qua Trò chơi Tri thức',
      desc: 'Học sinh tham gia 4 trò chơi tương tác (AI Nhanh Hơn, Giải Cứu Khu Vườn...) để củng cố kiến thức trong niềm vui và tích lũy ngôi sao khen thưởng.',
      targetTab: 'games',
      badge: 'Gamification giáo dục',
    },
    {
      step: 5,
      title: 'Bước 5: Giáo viên xem minh chứng & báo cáo',
      desc: 'Giáo viên theo dõi biểu đồ tiến bộ của từng lớp, phân loại nhóm năng lực và xuất Báo cáo minh chứng A4 để đánh giá hiệu quả thực tế.',
      targetTab: 'evidence',
      badge: 'Đo lường & Minh chứng',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-300/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-300" /> Giải Thưởng Tiên Phong Ứng Dụng AI Giáo Dục Việt Nam 2026
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            VĨNH ĐIỀU SMART AI
          </h2>
          <p className="text-lg text-slate-200 font-semibold">
            Hệ sinh thái học tập thông minh, cá nhân hóa môn Toán và Tiếng Việt cho học sinh tiểu học
          </p>
          <div className="text-xs sm:text-sm text-slate-300 space-y-1">
            <p>• <strong>Tác giả:</strong> Thầy Danh Thanh</p>
            <p>• <strong>Đơn vị:</strong> Trường TH-THCS Vĩnh Điều, Huyện Giang Thành, Tỉnh An Giang</p>
            <p>• <strong>Năm học:</strong> 2026 – 2027</p>
            <p className="italic text-amber-200 font-medium pt-1">
              Khẩu hiệu: "Mỗi học sinh một hành trình, mỗi tiến bộ một niềm vui!"
            </p>
          </div>
        </div>
      </div>

      {/* Guided Walk-through for Competition Judges (CHẾ ĐỘ TRÌNH DIỄN HỘI THI) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="bg-amber-100 text-amber-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit">
              <Presentation className="w-3.5 h-3.5" /> Dành cho Ban Giám Khảo & Quý Thầy Cô
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Chế Độ Trình Diễn Hội Thi (5 Bước Tương Tác)
            </h3>
            <p className="text-xs text-slate-500">
              Trình diễn trực tiếp luồng vận hành khép kín của ứng dụng trên màn hình lớn hoặc máy chiếu.
            </p>
          </div>

          <div className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            Bước {activeDemoStep} / 5
          </div>
        </div>

        {/* Step Cards Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {demoSteps.map(s => {
            const isCurrent = activeDemoStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setActiveDemoStep(s.step)}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md scale-102 font-extrabold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 text-xs font-semibold'
                }`}
              >
                <div className="text-[10px] uppercase opacity-80">Bước {s.step}</div>
                <div className="text-xs font-bold mt-0.5 line-clamp-2">{s.title.split(':')[1]}</div>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase */}
        {(() => {
          const curr = demoSteps[activeDemoStep - 1];
          return (
            <div className="bg-amber-50/70 rounded-2xl p-6 border border-amber-200 space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full">
                  {curr.badge}
                </span>
                <h4 className="text-lg font-black text-slate-900">{curr.title}</h4>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {curr.desc}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  {activeDemoStep > 1 && (
                    <button
                      onClick={() => setActiveDemoStep(s => s - 1)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    >
                      ← Bước trước
                    </button>
                  )}
                  {activeDemoStep < 5 && (
                    <button
                      onClick={() => setActiveDemoStep(s => s + 1)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    >
                      Bước tiếp theo →
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onStartDemoStep(curr.targetTab)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <PlayCircle className="w-4 h-4" /> Mở ngay màn hình này để thử nghiệm
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h4 className="text-base font-extrabold text-slate-900">1. Công nghệ AI Phát hiện Lỗi sai</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Trọng tâm giải pháp: Phát hiện 7 nhóm lỗi toán học và 7 nhóm lỗi tiếng Việt phổ biến ở tiểu học, giải thích nguyên nhân và đưa ra lời gợi ý định hướng tư duy (scaffolding).
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl">
            <Layers className="w-6 h-6" />
          </div>
          <h4 className="text-base font-extrabold text-slate-900">2. Mô hình Cá nhân hóa 4T</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Thấu hiểu – Thích ứng – Thực hành – Tiến bộ: Thang điểm 0–100 công khai, minh bạch, giúp học sinh vùng sâu Vĩnh Điều tự tin làm chủ kiến thức theo năng lực riêng.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="text-base font-extrabold text-slate-900">3. Đạo đức AI & Bảo vệ Trẻ em</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hoàn toàn không thu thập CCCD, số điện thoại hay thông tin nhạy cảm của trẻ. Dùng mã ẩn danh. Gemini API được bảo vệ nghiêm ngặt ở phía máy chủ (Server-side proxy).
          </p>
        </div>
      </div>
    </div>
  );
};
