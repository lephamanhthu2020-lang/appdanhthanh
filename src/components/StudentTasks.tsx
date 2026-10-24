import React, { useState } from 'react';
import { GradeLevel, StudentProfile, AssignedTask, QuestionItem } from '../types';
import { StorageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import confetti from 'canvas-confetti';
import { 
  ClipboardList, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  ArrowRight, 
  RotateCcw, 
  AlertCircle,
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface StudentTasksProps {
  currentGrade: GradeLevel;
  studentProfile: StudentProfile;
}

export const StudentTasks: React.FC<StudentTasksProps> = ({ currentGrade, studentProfile }) => {
  const [tasks, setTasks] = useState<AssignedTask[]>(() => StorageService.getAssignedTasks());
  const [activeTask, setActiveTask] = useState<AssignedTask | null>(null);

  // In-task test taking state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<{ [qId: string]: string }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ score: number; total: number } | null>(null);

  // Filter tasks for this grade
  const gradeTasks = tasks.filter(t => t.grade === currentGrade);

  const handleStartTask = (task: AssignedTask) => {
    setActiveTask(task);
    setCurrentQIndex(0);
    setStudentAnswers({});
    setIsCompleted(false);
    setSubmissionResult(null);
  };

  const handleSelectAnswer = (qId: string, answer: string) => {
    setStudentAnswers(prev => ({
      ...prev,
      [qId]: answer,
    }));
  };

  const handleSubmitTask = () => {
    if (!activeTask) return;

    let correctCount = 0;
    const wrongAnswers: { questionPrompt: string; studentAnswer: string; correctAnswer: string }[] = [];

    activeTask.questions.forEach(q => {
      const studentAns = (studentAnswers[q.id] || '').trim();
      const correctAns = q.correctAnswer.trim();

      const isMatch =
        studentAns.toLowerCase() === correctAns.toLowerCase() ||
        (q.format === 'multiple_choice' && studentAns.startsWith(correctAns.substring(0, 2)));

      if (isMatch) {
        correctCount++;
        StorageService.recordAnswer(q.id, true);
      } else {
        wrongAnswers.push({
          questionPrompt: q.prompt,
          studentAnswer: studentAns || 'Chưa trả lời',
          correctAnswer: correctAns,
        });
        StorageService.recordAnswer(q.id, false, 'Sai bài tập về nhà');
      }
    });

    const submission = {
      studentId: studentProfile.id,
      studentName: studentProfile.displayName,
      submittedAt: new Date().toLocaleString('vi-VN'),
      score: correctCount,
      total: activeTask.questions.length,
      isPassed: correctCount >= Math.ceil(activeTask.questions.length * 0.6),
      notes: correctCount === activeTask.questions.length ? 'Hoàn thành xuất sắc!' : 'Đã nộp bài cho Thầy Danh Thanh.',
      wrongAnswers,
    };

    StorageService.submitTask(activeTask.id, submission);
    setTasks(StorageService.getAssignedTasks());

    setSubmissionResult({
      score: correctCount,
      total: activeTask.questions.length,
    });
    setIsCompleted(true);

    if (correctCount >= Math.ceil(activeTask.questions.length * 0.6)) {
      audioService.playCelebration();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } else {
      audioService.playIncorrect();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-900 via-amber-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-orange-500/30 text-orange-200 border border-orange-400/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                <ClipboardList className="w-3.5 h-3.5" /> NHIỆM VỤ ĐƯỢC GIAO
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Giáo viên: Thầy Danh Thanh
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Bài Tập Về Nhà & Nhiệm Vụ Rèn Luyện Lớp {currentGrade}
            </h2>
            <p className="text-orange-200 text-xs sm:text-sm mt-1 max-w-xl">
              Nơi nhận và hoàn thành các bài tập, nhiệm vụ được Thầy Danh Thanh (Trường TH-THCS Vĩnh Điều, xã Vĩnh Điều, An Giang) giao trực tiếp cho lớp.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-amber-300" />
            <div>
              <div className="text-[10px] text-orange-200 uppercase font-bold">Học sinh</div>
              <div className="text-xs sm:text-sm font-extrabold text-white">
                {studentProfile.displayName} ({studentProfile.id})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* If not currently doing a task: show task list */}
      {!activeTask && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Danh Sách Bài Tập Cần Hoàn Thành ({gradeTasks.length})
            </h3>
            <span className="text-xs text-slate-500">
              Trường TH-THCS Vĩnh Điều, xã Vĩnh Điều, An Giang
            </span>
          </div>

          {gradeTasks.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
              <div className="text-4xl">🎉</div>
              <h4 className="text-base font-bold text-slate-800">Hiện tại không có bài tập chưa làm!</h4>
              <p className="text-xs text-slate-500">
                Thầy Danh Thanh chưa giao thêm bài tập mới cho khối Lớp {currentGrade}. Em hãy vào Phòng Toán AI hoặc Tiếng Việt AI để tự luyện tập nhé!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gradeTasks.map(task => {
                const mySubmission = task.submissions.find(s => s.studentId === studentProfile.id);
                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-orange-100 text-orange-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                          {task.targetClass} • Môn {task.subject === 'math' ? 'Toán' : 'Tiếng Việt'}
                        </span>
                        {mySubmission ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã nộp ({mySubmission.score}/{mySubmission.total} điểm)
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Chưa làm
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                        {task.title}
                      </h4>

                      <div className="text-xs text-slate-500 space-y-1">
                        <div>
                          <strong>Người giao:</strong> {task.assignedBy}
                        </div>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span>Ngày giao: {task.createdAt}</span>
                          <span>Hạn nộp: <strong className="text-rose-600">{task.dueDate}</strong></span>
                        </div>
                        {task.note && (
                          <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            " {task.note} "
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">
                        {task.questions.length} câu hỏi
                      </span>
                      <button
                        onClick={() => handleStartTask(task)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all ${
                          mySubmission
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                      >
                        {mySubmission ? 'Làm lại bài' : 'Bắt đầu làm bài'} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Doing the task */}
      {activeTask && !isCompleted && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-orange-600 uppercase tracking-wider">
                Đang làm: {activeTask.targetClass} • {activeTask.assignedBy}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                {activeTask.title}
              </h3>
            </div>
            <button
              onClick={() => setActiveTask(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl"
            >
              Thoát ra danh sách
            </button>
          </div>

          {/* Question navigator */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {activeTask.questions.map((q, idx) => {
              const isAnswered = !!studentAnswers[q.id];
              const isCurrent = currentQIndex === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-orange-600 text-white shadow-sm'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Active Question Box */}
          {(() => {
            const q = activeTask.questions[currentQIndex];
            const currentAns = studentAnswers[q.id] || '';
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Câu {currentQIndex + 1} / {activeTask.questions.length}</span>
                  <span className="bg-slate-100 px-2.5 py-0.5 rounded-full">{q.cognitiveLevel}</span>
                </div>

                <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {q.prompt}
                </div>

                {q.format === 'multiple_choice' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = currentAns === opt;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectAnswer(q.id, opt)}
                          className={`p-4 rounded-2xl border text-sm font-bold text-left transition-all ${
                            isSelected
                              ? 'bg-orange-600 text-white border-orange-700 shadow-sm'
                              : 'bg-white hover:bg-orange-50 text-slate-800 border-slate-200'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.format === 'fill_blank' && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Nhập kết quả hoặc đáp án của em:
                    </label>
                    <input
                      type="text"
                      value={currentAns}
                      onChange={e => handleSelectAnswer(q.id, e.target.value)}
                      placeholder="Nhập câu trả lời..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-orange-500"
                    />
                  </div>
                )}
              </div>
            );
          })()}

          {/* Navigation & Submit footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="px-4 py-2 text-xs font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-100 rounded-xl"
            >
              ← Câu trước
            </button>

            {currentQIndex < activeTask.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQIndex(prev => prev + 1)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
              >
                Câu tiếp theo →
              </button>
            ) : (
              <button
                onClick={handleSubmitTask}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Nộp bài cho Thầy Danh Thanh
              </button>
            )}
          </div>
        </div>
      )}

      {/* Task Result View after completion */}
      {activeTask && isCompleted && submissionResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6 max-w-2xl mx-auto text-center animate-in fade-in">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-4xl mx-auto shadow-inner">
            {submissionResult.score === submissionResult.total ? '🌟' : '📝'}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
              Nộp bài tập thành công
            </span>
            <h3 className="text-2xl font-black text-slate-900">{activeTask.title}</h3>
            <p className="text-xs text-slate-500">
              Giáo viên nhận bài: <strong>{activeTask.assignedBy}</strong> • Trường TH-THCS Vĩnh Điều, xã Vĩnh Điều, An Giang
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 max-w-xs mx-auto">
            <div className="text-xs text-slate-500 font-bold">Kết quả bài làm của em:</div>
            <div className="text-4xl font-black text-emerald-600 mt-1">
              {submissionResult.score} / {submissionResult.total}
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-1">
              {submissionResult.score === submissionResult.total
                ? 'Em đã hoàn thành xuất sắc tất cả các câu!'
                : `Em làm đúng ${submissionResult.score} câu. Thầy Danh Thanh đã ghi nhận kết quả rèn luyện.`}
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setActiveTask(null)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition-all"
            >
              Về danh sách nhiệm vụ
            </button>
            <button
              onClick={() => handleStartTask(activeTask)}
              className="bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Làm lại bài này
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
