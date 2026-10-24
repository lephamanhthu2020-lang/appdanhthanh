import React from 'react';
import { GradeLevel, StudentProfile } from '../types';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Gamepad2, 
  Users, 
  FileCheck2, 
  MapPin, 
  Presentation,
  Flame,
  Star,
  ClipboardList
} from 'lucide-react';
import { audioService } from '../services/audioService';

interface HeaderProps {
  currentGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  studentProfile: StudentProfile;
  soundEnabled: boolean;
  onToggleSound: () => void;
  reducedMotion: boolean;
  onToggleMotion: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentGrade: _currentGrade,
  onSelectGrade: _onSelectGrade,
  activeTab,
  onSelectTab,
  studentProfile,
  soundEnabled,
  onToggleSound,
  reducedMotion,
  onToggleMotion,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs no-print">
      {/* Top Banner Information */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-4 py-2 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> GDPT 2018
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span>Trường TH-THCS Vĩnh Điều, xã Vĩnh Điều, An Giang</span>
            <span className="hidden lg:inline text-amber-300 font-bold text-xs bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">Giáo viên: Danh Thanh</span>
            <span className="hidden md:inline text-slate-400 text-xs">(Năm học 2026 – 2027)</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-xs font-semibold text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{studentProfile.stars} sao</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-xs font-semibold text-orange-300">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span>{studentProfile.streakDays} ngày liên tục</span>
            </div>
            <button
              onClick={onToggleSound}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              aria-label="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              onClick={onToggleMotion}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                reducedMotion ? 'bg-amber-400/20 border-amber-300 text-amber-200' : 'bg-white/10 border-white/20 text-slate-300 hover:bg-white/20'
              }`}
              title="Chế độ giảm chuyển động cho thiết bị yếu hoặc người dùng nhạy cảm"
            >
              {reducedMotion ? 'Giảm c.động: Bật' : 'Giảm c.động: Tắt'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Brand & Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('home')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-teal-500 p-0.5 shadow-md flex items-center justify-center text-white">
              <div className="w-full h-full rounded-[14px] bg-slate-900/10 flex flex-col items-center justify-center">
                <span className="font-extrabold text-sm tracking-wider">VĐ</span>
                <span className="text-[9px] font-bold text-amber-300 -mt-0.5">LỚP 2</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  VĨNH ĐIỀU <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">SMART AI – LỚP 2</span>
                </h1>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border border-amber-300">
                  Chuyên Biệt Lớp 2
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium italic">
                Hệ sinh thái học tập Toán & Tiếng Việt • Kết nối tri thức với cuộc sống
              </p>
            </div>
          </div>

          {/* Dedicated Grade 2 Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 px-3.5 py-1.5 rounded-2xl shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left">
              <div className="text-[10px] font-extrabold uppercase text-blue-700 tracking-wider">Không gian học tập</div>
              <div className="text-xs font-black text-slate-900">LỚP 2 • GDPT 2018</div>
            </div>
            <span className="text-[11px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-lg shadow-xs ml-1">
              Toán & Tiếng Việt
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto mt-3 pt-2 border-t border-slate-100 scrollbar-none text-xs sm:text-sm font-semibold text-slate-600">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'home' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Trang chủ Lớp 2
          </button>

          <button
            onClick={() => onSelectTab('math')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'math' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:bg-blue-50 text-blue-700'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-blue-500" /> Phòng Toán AI
          </button>

          <button
            onClick={() => onSelectTab('vietnamese')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'vietnamese' ? 'bg-teal-600 text-white font-bold shadow-xs' : 'hover:bg-teal-50 text-teal-700'
            }`}
          >
            <BookOpen className="w-4 h-4 text-teal-500" /> Tiếng Việt AI
          </button>

          <button
            onClick={() => onSelectTab('tasks')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'tasks' ? 'bg-orange-600 text-white font-bold shadow-xs' : 'hover:bg-orange-50 text-orange-700'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-orange-500" /> Nhiệm vụ được giao
          </button>

          <button
            onClick={() => onSelectTab('games')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'games' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'hover:bg-amber-50 text-amber-700'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-amber-500" /> Trò chơi Tri thức
          </button>

          <button
            onClick={() => onSelectTab('competency')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'competency' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'hover:bg-indigo-50 text-indigo-700'
            }`}
          >
            <Award className="w-4 h-4 text-indigo-500" /> Bản đồ Năng lực 4T
          </button>

          <button
            onClick={() => onSelectTab('angiang')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'angiang' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'hover:bg-emerald-50 text-emerald-700'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-500" /> Em Yêu An Giang
          </button>

          <button
            onClick={() => onSelectTab('teacher')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'teacher' ? 'bg-purple-600 text-white font-bold shadow-xs' : 'hover:bg-purple-50 text-purple-700'
            }`}
          >
            <Users className="w-4 h-4 text-purple-500" /> Không gian Giáo viên
          </button>

          <button
            onClick={() => onSelectTab('evidence')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'evidence' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'hover:bg-rose-50 text-rose-700'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-rose-500" /> Minh chứng Hội thi
          </button>

          <button
            onClick={() => onSelectTab('about')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'about' ? 'bg-slate-800 text-white font-bold shadow-xs' : 'hover:bg-slate-100 text-slate-800'
            }`}
          >
            <Presentation className="w-4 h-4 text-amber-400" /> Giới thiệu & Trình diễn
          </button>
        </nav>
      </div>
    </header>
  );
};
