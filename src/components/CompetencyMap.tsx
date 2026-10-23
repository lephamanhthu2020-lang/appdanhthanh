import React, { useState } from 'react';
import { GradeLevel, StudentProfile, TopicCompetency, SubjectType } from '../types';
import { StorageService } from '../services/storageService';
import { 
  Award, 
  TrendingUp, 
  Compass, 
  AlertCircle, 
  CheckCircle, 
  Sparkles, 
  Filter, 
  ChevronRight, 
  Layers, 
  BookOpen, 
  Calculator,
  UserCheck
} from 'lucide-react';

interface CompetencyMapProps {
  currentGrade: GradeLevel;
  studentProfile: StudentProfile;
  onOpenTopic: (subject: SubjectType, topicId: string) => void;
}

export const CompetencyMap: React.FC<CompetencyMapProps> = ({
  currentGrade,
  studentProfile,
  onOpenTopic,
}) => {
  const [filterSubject, setFilterSubject] = useState<'all' | 'math' | 'vietnamese'>('all');

  const competencies = StorageService.calculateTopicCompetencies(studentProfile).filter(
    c => c.grade === currentGrade
  );

  const filteredCompetencies = competencies.filter(c => {
    if (filterSubject === 'all') return true;
    return c.subject === filterSubject;
  });

  const avgMastery =
    competencies.length > 0
      ? Math.round(competencies.reduce((acc, c) => acc + c.masteryPercentage, 0) / competencies.length)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> MÔ HÌNH 4T – CÁ NHÂN HÓA HỌC TẬP
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Bản Đồ Năng Lực & Tri Thức Của Em
            </h2>
            <p className="text-indigo-200 text-xs sm:text-sm mt-1 max-w-xl">
              Thấu hiểu – Thích ứng – Thực hành – Tiến bộ: Thang điểm 0–100 đánh giá mức độ làm chủ kiến thức theo từng chủ đề GDPT 2018.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-black text-lg shadow-inner">
              {avgMastery}%
            </div>
            <div>
              <div className="text-[11px] text-indigo-300 font-bold uppercase">Mức độ làm chủ Lớp {currentGrade}</div>
              <div className="text-sm font-black text-white">
                {avgMastery >= 85 ? 'Vững vàng' : avgMastery >= 70 ? 'Đạt mục tiêu' : avgMastery >= 50 ? 'Đang hình thành' : 'Cần hỗ trợ thêm'}
              </div>
            </div>
          </div>
        </div>

        {/* 4T Pillar Diagram */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
            <div className="text-xs font-black text-amber-300">1. THẤU HIỂU</div>
            <p className="text-[11px] text-slate-300 mt-0.5">Khảo sát & chẩn đoán loại lỗi sai ban đầu</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
            <div className="text-xs font-black text-sky-300">2. THÍCH ỨNG</div>
            <p className="text-[11px] text-slate-300 mt-0.5">Tự động điều chỉnh độ khó và bài luyện phù hợp</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
            <div className="text-xs font-black text-emerald-300">3. THỰC HÀNH</div>
            <p className="text-[11px] text-slate-300 mt-0.5">Luyện tập sâu với phản hồi gợi ý sư phạm tức thì</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl">
            <div className="text-xs font-black text-purple-300">4. TIẾN BỘ</div>
            <p className="text-[11px] text-slate-300 mt-0.5">Đo lường tiến bộ rõ rệt qua từng đợt học</p>
          </div>
        </div>
      </div>

      {/* Student ID & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900">
              Mã học sinh: <span className="text-indigo-600">{studentProfile.id}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {studentProfile.displayName} • {studentProfile.school}
            </div>
          </div>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterSubject('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterSubject === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({competencies.length})
          </button>
          <button
            onClick={() => setFilterSubject('math')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterSubject === 'math' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            Toán học
          </button>
          <button
            onClick={() => setFilterSubject('vietnamese')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterSubject === 'vietnamese' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-teal-700'
            }`}
          >
            Tiếng Việt
          </button>
        </div>
      </div>

      {/* Competency Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCompetencies.map(item => {
          const isMath = item.subject === 'math';
          return (
            <div
              key={item.topicId}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                      isMath ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'
                    }`}
                  >
                    {isMath ? <Calculator className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {isMath ? 'Môn Toán' : 'Môn Tiếng Việt'} • Lớp {item.grade}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 line-clamp-1">
                      {item.topicTitle}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-slate-900">{item.masteryPercentage}%</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.masteryLevel.bgLight} ${item.masteryLevel.color}`}>
                    {item.masteryLevel.label}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.masteryPercentage >= 85
                        ? 'bg-emerald-500'
                        : item.masteryPercentage >= 70
                        ? 'bg-sky-500'
                        : item.masteryPercentage >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.max(item.masteryPercentage, 5)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Đã làm: {item.totalAttempts} lượt</span>
                  <span>Đúng: {item.correctAnswers} câu</span>
                </div>
              </div>

              {/* Top Error Note if exists */}
              {item.topError && (
                <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3 text-xs text-rose-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Lỗi phổ biến cần chú ý: </span>
                    {item.topError}
                  </div>
                </div>
              )}

              {/* AI Recommendation */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs text-slate-700 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Mầm AI khuyến nghị: </span>
                  {item.aiRecommendation}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenTopic(item.subject, item.topicId)}
                className={`w-full py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors ${
                  isMath
                    ? 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                    : 'bg-teal-50 hover:bg-teal-100 text-teal-700'
                }`}
              >
                Vào luyện tập chủ đề này <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
