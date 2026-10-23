import React, { useState, useEffect } from 'react';
import { GradeLevel, SubjectType } from '../types';
import { audioService } from '../services/audioService';
import { StorageService } from '../services/storageService';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  Trees, 
  Layers, 
  ListOrdered, 
  Trophy, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Heart,
  Star
} from 'lucide-react';

interface GamesHubProps {
  currentGrade: GradeLevel;
}

export const GamesHub: React.FC<GamesHubProps> = ({ currentGrade }) => {
  const [selectedGame, setSelectedGame] = useState<'game1' | 'game2' | 'game3' | 'game4'>('game1');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> TRÒ CHƠI TRI THỨC TƯƠNG TÁC
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Vừa Chơi Vừa Học – Tích Lũy Ngàn Sao
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-xl">
              4 trò chơi rèn luyện trí tuệ, phản xạ và tư duy logic được thiết kế riêng cho học sinh Lớp {currentGrade}.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-4 py-3 rounded-2xl">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <div className="text-left">
              <div className="text-[10px] text-amber-200 uppercase font-bold">Thành tích</div>
              <div className="text-sm font-extrabold text-white">Chơi vui học giỏi</div>
            </div>
          </div>
        </div>

        {/* Game Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <button
            onClick={() => setSelectedGame('game1')}
            className={`p-3.5 rounded-2xl text-left border transition-all flex items-center gap-3 ${
              selectedGame === 'game1'
                ? 'bg-white text-slate-900 border-white shadow-lg'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 font-bold shrink-0">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-extrabold">1. AI Nhanh Hơn</div>
              <div className="text-[11px] opacity-80">Phản xạ tính nhẩm</div>
            </div>
          </button>

          <button
            onClick={() => setSelectedGame('game2')}
            className={`p-3.5 rounded-2xl text-left border transition-all flex items-center gap-3 ${
              selectedGame === 'game2'
                ? 'bg-white text-slate-900 border-white shadow-lg'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-bold shrink-0">
              <Trees className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="text-xs font-extrabold">2. Giải Cứu Khu Vườn</div>
              <div className="text-[11px] opacity-80">Vượt 5 thử thách</div>
            </div>
          </button>

          <button
            onClick={() => setSelectedGame('game3')}
            className={`p-3.5 rounded-2xl text-left border transition-all flex items-center gap-3 ${
              selectedGame === 'game3'
                ? 'bg-white text-slate-900 border-white shadow-lg'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-300 font-bold shrink-0">
              <Layers className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="text-xs font-extrabold">3. Ghép Đôi Thông Minh</div>
              <div className="text-[11px] opacity-80">Tìm cặp tương ứng</div>
            </div>
          </button>

          <button
            onClick={() => setSelectedGame('game4')}
            className={`p-3.5 rounded-2xl text-left border transition-all flex items-center gap-3 ${
              selectedGame === 'game4'
                ? 'bg-white text-slate-900 border-white shadow-lg'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold shrink-0">
              <ListOrdered className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="text-xs font-extrabold">4. Sắp Xếp Tài Tình</div>
              <div className="text-[11px] opacity-80">Trật tự bước giải/câu</div>
            </div>
          </button>
        </div>
      </div>

      {/* Active Game Rendering */}
      {selectedGame === 'game1' && <Game1SpeedQuiz grade={currentGrade} />}
      {selectedGame === 'game2' && <Game2GardenRescue grade={currentGrade} />}
      {selectedGame === 'game3' && <Game3MatchPair grade={currentGrade} />}
      {selectedGame === 'game4' && <Game4StepSorter grade={currentGrade} />}
    </div>
  );
};

// ========================================================
// TRÒ CHƠI 1: AI NHANH HƠN (Speed Quiz)
// ========================================================
const Game1SpeedQuiz: React.FC<{ grade: GradeLevel }> = ({ grade }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [useTimer, setUseTimer] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // 5 Questions customized by grade
  const questions = [
    { q: grade === 1 ? '5 + 3 = ?' : grade === 2 ? '4 x 5 = ?' : grade === 3 ? '48 : 6 = ?' : grade === 4 ? '1/4 + 2/4 = ?' : '0,5 x 10 = ?', options: grade === 1 ? ['7', '8', '9', '6'] : grade === 2 ? ['15', '20', '25', '10'] : grade === 3 ? ['7', '8', '9', '6'] : grade === 4 ? ['3/4', '3/8', '2/4', '1'] : ['5', '0,50', '50', '0,05'], correct: grade === 1 ? '8' : grade === 2 ? '20' : grade === 3 ? '8' : grade === 4 ? '3/4' : '5' },
    { q: 'Từ nào chỉ người trong trường học?', options: ['Bác sĩ', 'Thầy giáo', 'Kỹ sư', 'Phi công'], correct: 'Thầy giáo' },
    { q: grade === 1 ? '10 - 4 = ?' : grade === 2 ? '18 : 2 = ?' : grade === 3 ? '25 x 4 = ?' : grade === 4 ? 'Tìm số TB cộng của 10 và 20:' : '25% của 100 là:', options: grade === 1 ? ['6', '5', '7', '4'] : grade === 2 ? ['9', '8', '7', '6'] : grade === 3 ? ['100', '80', '90', '120'] : grade === 4 ? ['15', '30', '10', '20'] : ['25', '50', '10', '75'], correct: grade === 1 ? '6' : grade === 2 ? '9' : grade === 3 ? '100' : grade === 4 ? '15' : '25' },
    { q: 'Rừng tràm nổi tiếng của tỉnh An Giang tên là gì?', options: ['Trà Sư', 'U Minh', 'Cúc Phương', 'Nam Cát Tiên'], correct: 'Trà Sư' },
    { q: grade === 1 ? 'Số lớn nhất có một chữ số là:' : grade === 2 ? '3 x 6 = ?' : grade === 3 ? '19 : 3 được mấy dư mấy?' : grade === 4 ? 'Góc bẹt bằng bao nhiêu độ?' : '1,5 giờ = ... phút?', options: grade === 1 ? ['9', '10', '8', '7'] : grade === 2 ? ['18', '15', '12', '21'] : grade === 3 ? ['6 dư 1', '6 dư 2', '5 dư 4', '7 dư 0'] : grade === 4 ? ['180°', '90°', '60°', '120°'] : ['90 phút', '60 phút', '150 phút', '75 phút'], correct: grade === 1 ? '9' : grade === 2 ? '18' : grade === 3 ? '6 dư 1' : grade === 4 ? '180°' : '90 phút' },
  ];

  useEffect(() => {
    let timer: any;
    if (isPlaying && useTimer && !isGameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (isPlaying && useTimer && timeLeft === 0 && !isGameOver) {
      handleAnswer(''); // time out
    }
    return () => clearInterval(timer);
  }, [isPlaying, useTimer, timeLeft, isGameOver]);

  const startGame = () => {
    setIsPlaying(true);
    setCurrentIndex(0);
    setScore(0);
    setIsGameOver(false);
    setTimeLeft(15);
    setSelectedAnswer(null);
  };

  const handleAnswer = (ans: string) => {
    setSelectedAnswer(ans);
    const curr = questions[currentIndex];
    const isCorrect = ans === curr.correct;

    if (isCorrect) {
      audioService.playCorrect();
      setScore(s => s + 1);
    } else {
      audioService.playIncorrect();
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(c => c + 1);
        setTimeLeft(15);
        setSelectedAnswer(null);
      } else {
        setIsGameOver(true);
        audioService.playCelebration();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    }, 800);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
            Trò chơi 1: AI Nhanh Hơn
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Thử Thách Phản Xạ 5 Câu Hỏi
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={useTimer}
              onChange={e => setUseTimer(e.target.checked)}
              disabled={isPlaying}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            Bật đồng hồ đếm ngược (15s/câu)
          </label>
        </div>
      </div>

      {!isPlaying && !isGameOver && (
        <div className="text-center py-10 space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-4xl mx-auto shadow-inner">
            ⚡
          </div>
          <h4 className="text-lg font-bold text-slate-800">Sẵn sàng phản xạ tính nhẩm và ngôn ngữ?</h4>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Mỗi lượt gồm 5 câu hỏi nhanh. Trả lời thật chính xác để đạt danh hiệu "Bậc thầy tính nhẩm"!
          </p>
          <button
            onClick={startGame}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-8 py-3.5 rounded-2xl text-sm shadow-md hover:scale-105 transition-all"
          >
            Bắt đầu lượt chơi ngay
          </button>
        </div>
      )}

      {isPlaying && !isGameOver && (
        <div className="space-y-6 max-w-xl mx-auto">
          {/* Header Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
              Câu {currentIndex + 1} / 5
            </span>
            {useTimer && (
              <span className={`text-xs font-extrabold flex items-center gap-1 px-3 py-1 rounded-full ${
                timeLeft <= 5 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-700'
              }`}>
                <Clock className="w-3.5 h-3.5" /> Còn {timeLeft} giây
              </span>
            )}
            <span className="text-xs font-bold text-slate-600">
              Điểm: <strong className="text-amber-600">{score}</strong> / 5
            </span>
          </div>

          {/* Question Box */}
          <div className="bg-amber-50/60 rounded-3xl p-6 sm:p-8 border border-amber-200 text-center space-y-2">
            <span className="text-xs font-bold text-amber-700">Câu hỏi {currentIndex + 1}:</span>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900">
              {questions[currentIndex].q}
            </h4>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {questions[currentIndex].options.map((opt, i) => {
              const isChosen = selectedAnswer === opt;
              const isCorrect = opt === questions[currentIndex].correct;
              let style = 'bg-white hover:bg-amber-50 border-slate-200 text-slate-800';

              if (selectedAnswer !== null) {
                if (isCorrect) style = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
              }

              return (
                <button
                  key={i}
                  onClick={() => selectedAnswer === null && handleAnswer(opt)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 rounded-2xl border text-sm sm:text-base font-extrabold transition-all shadow-xs ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="text-center py-10 space-y-5 animate-in fade-in duration-300">
          <div className="w-20 h-20 rounded-3xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-4xl mx-auto">
            🏆
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900">Hoàn Thành Thử Thách!</h4>
            <p className="text-sm text-slate-600 mt-1">
              Em đã trả lời đúng <strong className="text-amber-600 text-lg">{score}</strong> / 5 câu hỏi!
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={startGame}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Chơi lại lượt mới
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================================
// TRÒ CHƠI 2: GIẢI CỨU KHU VƯỜN TRI THỨC (Garden Rescue)
// ========================================================
const Game2GardenRescue: React.FC<{ grade: GradeLevel }> = ({ grade }) => {
  const characters = [
    { name: 'Bé Thỏ Thông Thái', icon: '🐰', desc: 'Thỏ con lạc trong rừng tràm' },
    { name: 'Bé Sóc Nhanh Nhẹn', icon: '🐿️', desc: 'Sóc con tìm hạt quả thốt nốt' },
    { name: 'Chú Voi Tốt Bụng', icon: '🐘', desc: 'Voi con bị mắc kẹt chân' },
    { name: 'Chim Sâu Chăm Chỉ', icon: '🐦', desc: 'Chim non tìm về tổ ấm' },
    { name: 'Mầm Non Xanh Tươi', icon: '🌱', desc: 'Hạt giống cần nước mát phù sa' },
  ];

  const challenges = [
    { q: 'Phép tính nào đúng?', options: ['2 x 3 = 6', '2 x 3 = 5', '2 x 3 = 8'], correct: '2 x 3 = 6' },
    { q: 'Chữ nào viết ĐÚNG chính tả?', options: ['Xinh xắn', 'Sinh xắn', 'Xinh sắn'], correct: 'Xinh xắn' },
    { q: 'Mùa nước nổi ở An Giang có loài hoa nào nở vàng rực bờ sông?', options: ['Hoa điên điển', 'Hoa đào', 'Hoa mai anh đào'], correct: 'Hoa điên điển' },
    { q: 'Một con mèo có 4 chân. Hỏi 3 con mèo có tất cả bao nhiêu chân?', options: ['12 chân', '7 chân', '14 chân'], correct: '12 chân' },
    { q: 'Khi gặp người lớn tuổi, em cần chào như thế nào?', options: ['Khoanh tay lễ phép chào ạ', 'Cười rồi chạy đi', 'Không nói gì'], correct: 'Khoanh tay lễ phép chào ạ' },
  ];

  const [currentLevel, setCurrentLevel] = useState(0);
  const [rescuedList, setRescuedList] = useState<boolean[]>([false, false, false, false, false]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);

  const handleSelect = (opt: string) => {
    setSelectedOpt(opt);
    const curr = challenges[currentLevel];
    if (opt === curr.correct) {
      audioService.playCorrect();
      const updated = [...rescuedList];
      updated[currentLevel] = true;
      setRescuedList(updated);

      setTimeout(() => {
        if (currentLevel < challenges.length - 1) {
          setCurrentLevel(lvl => lvl + 1);
          setSelectedOpt(null);
        } else {
          setIsCompleted(true);
          audioService.playCelebration();
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        }
      }, 700);
    } else {
      audioService.playIncorrect();
      setTimeout(() => setSelectedOpt(null), 800);
    }
  };

  const handleRestart = () => {
    setCurrentLevel(0);
    setRescuedList([false, false, false, false, false]);
    setIsCompleted(false);
    setSelectedOpt(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
            Trò chơi 2: Giải Cứu Khu Vườn Tri Thức
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Vượt 5 Thử Thách – Giải Cứu 5 Bạn Nhỏ
          </h3>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {characters.map((c, i) => {
          const isRescued = rescuedList[i];
          const isCurrent = currentLevel === i && !isCompleted;
          return (
            <div
              key={i}
              className={`p-3 rounded-2xl text-center border transition-all ${
                isRescued
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold scale-102'
                  : isCurrent
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 animate-pulse'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              }`}
            >
              <div className="text-2xl sm:text-3xl">{c.icon}</div>
              <div className="text-[11px] font-extrabold mt-1 truncate">{c.name}</div>
              <div className="text-[10px] text-slate-500">
                {isRescued ? '✓ Đã cứu' : isCurrent ? 'Đang cứu' : 'Bị giữ'}
              </div>
            </div>
          );
        })}
      </div>

      {!isCompleted ? (
        <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100 space-y-5 max-w-xl mx-auto">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-emerald-700">
              Thử thách {currentLevel + 1}: Giải cứu {characters[currentLevel].name}
            </span>
            <h4 className="text-lg sm:text-xl font-black text-slate-900">
              {challenges[currentLevel].q}
            </h4>
          </div>

          <div className="space-y-2.5">
            {challenges[currentLevel].options.map((opt, i) => {
              const isChosen = selectedOpt === opt;
              const isCorrect = opt === challenges[currentLevel].correct;
              let style = 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-200';
              if (selectedOpt !== null) {
                if (isCorrect) style = 'bg-emerald-600 text-white border-emerald-700 font-bold';
                else if (isChosen) style = 'bg-rose-500 text-white border-rose-600';
              }

              return (
                <button
                  key={i}
                  onClick={() => selectedOpt === null && handleSelect(opt)}
                  disabled={selectedOpt !== null}
                  className={`w-full p-4 rounded-2xl border text-sm font-bold text-left transition-all ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-4 animate-in fade-in duration-300">
          <div className="text-5xl">🎉 🌳 🐰 🐿️ 🐘 🐦 🌱</div>
          <h4 className="text-2xl font-black text-emerald-900">Khu Vườn Tri Thức Đã Được Bình Yên!</h4>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Em thật dũng cảm và thông minh! Tất cả các bạn nhỏ ở Vĩnh Điều đều gửi lời cảm ơn sâu sắc đến em!
          </p>
          <button
            onClick={handleRestart}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 mx-auto shadow-md"
          >
            <RotateCcw className="w-4 h-4" /> Chơi lại trò chơi
          </button>
        </div>
      )}
    </div>
  );
};

// ========================================================
// TRÒ CHƠI 3: GHÉP ĐÔI THÔNG MINH (Match Pair)
// ========================================================
const Game3MatchPair: React.FC<{ grade: GradeLevel }> = ({ grade }) => {
  const pairs = [
    { id: 1, left: '3 x 4', right: '12' },
    { id: 2, left: 'Hoa điên điển', right: 'Màu vàng tươi' },
    { id: 3, left: '1 dm', right: '10 cm' },
    { id: 4, left: 'Rừng Trà Sư', right: 'An Giang' },
  ];

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);

  // Shuffle right items on start
  const [shuffledRights] = useState(() => [...pairs].sort(() => Math.random() - 0.5));

  const handleLeftClick = (val: string) => {
    if (selectedLeft === val) setSelectedLeft(null);
    else setSelectedLeft(val);
  };

  const handleRightClick = (val: string) => {
    if (!selectedLeft) return;
    const pair = pairs.find(p => p.left === selectedLeft && p.right === val);
    if (pair) {
      audioService.playCorrect();
      setMatchedPairs(prev => [...prev, pair.id]);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (matchedPairs.length + 1 === pairs.length) {
        audioService.playCelebration();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } else {
      audioService.playIncorrect();
      setSelectedRight(val);
      setTimeout(() => {
        setSelectedRight(null);
      }, 500);
    }
  };

  const resetGame = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-black text-sky-600 uppercase tracking-wider">
            Trò chơi 3: Ghép Đôi Thông Minh
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Chạm & Ghép Cột Phép Tính / Ý Nghĩa
          </h3>
        </div>
        <button
          onClick={resetGame}
          className="bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-sky-200 flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Chơi lại
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Hướng dẫn: Chọn 1 ô bên trái (cột xanh lá), sau đó chạm vào ô có nghĩa tương ứng bên phải (cột xanh dương).
      </p>

      <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Left Column */}
        <div className="space-y-3">
          <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider text-center">Cột A</h5>
          {pairs.map(p => {
            const isMatched = matchedPairs.includes(p.id);
            const isSelected = selectedLeft === p.left;
            return (
              <button
                key={p.id}
                onClick={() => !isMatched && handleLeftClick(p.left)}
                disabled={isMatched}
                className={`w-full p-4 rounded-2xl border text-sm font-bold text-center transition-all ${
                  isMatched
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800 line-through opacity-70'
                    : isSelected
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102'
                    : 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-200 shadow-2xs'
                }`}
              >
                {p.left}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider text-center">Cột B</h5>
          {shuffledRights.map(p => {
            const isMatched = matchedPairs.includes(p.id);
            const isWrong = selectedRight === p.right;
            return (
              <button
                key={p.id}
                onClick={() => !isMatched && handleRightClick(p.right)}
                disabled={isMatched}
                className={`w-full p-4 rounded-2xl border text-sm font-bold text-center transition-all ${
                  isMatched
                    ? 'bg-sky-100 border-sky-300 text-sky-800 line-through opacity-70'
                    : isWrong
                    ? 'bg-rose-500 text-white border-rose-600 animate-shake'
                    : 'bg-white hover:bg-sky-50 text-slate-800 border-slate-200 shadow-2xs'
                }`}
              >
                {p.right}
              </button>
            );
          })}
        </div>
      </div>

      {matchedPairs.length === pairs.length && (
        <div className="text-center py-4 text-emerald-700 font-black text-base animate-in fade-in">
          🎉 Tuyệt vời! Em đã ghép đúng toàn bộ các cặp thẻ!
        </div>
      )}
    </div>
  );
};

// ========================================================
// TRÒ CHƠI 4: SẮP XẾP TÀI TÌNH (Step Sorter)
// ========================================================
const Game4StepSorter: React.FC<{ grade: GradeLevel }> = ({ grade }) => {
  // Unscramble words to make a Vietnamese sentence: "Em yêu quê hương An Giang tươi đẹp"
  const targetWords = ['Em', 'yêu', 'quê hương', 'An Giang', 'tươi đẹp'];
  const [availableWords, setAvailableWords] = useState<string[]>(() =>
    [...targetWords].sort(() => Math.random() - 0.5)
  );
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePickWord = (w: string, index: number) => {
    setPlacedWords(prev => [...prev, w]);
    setAvailableWords(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleRemoveWord = (w: string, index: number) => {
    setAvailableWords(prev => [...prev, w]);
    setPlacedWords(prev => prev.filter((_, idx) => idx !== index));
    setIsSuccess(false);
  };

  const handleCheck = () => {
    if (placedWords.join(' ') === targetWords.join(' ')) {
      setIsSuccess(true);
      audioService.playCelebration();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } else {
      audioService.playIncorrect();
    }
  };

  const handleReset = () => {
    setAvailableWords([...targetWords].sort(() => Math.random() - 0.5));
    setPlacedWords([]);
    setIsSuccess(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-black text-purple-600 uppercase tracking-wider">
            Trò chơi 4: Sắp Xếp Tài Tình
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Ghép Từ Thành Câu Hoàn Chỉnh
          </h3>
        </div>
        <button
          onClick={handleReset}
          className="bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Làm lại
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Hãy nhấp vào các từ rời rạc bên dưới theo đúng thứ tự để tạo thành một câu có nghĩa ngợi ca quê hương:
      </p>

      {/* Target Placement Area */}
      <div className="min-h-16 bg-purple-50/70 border-2 border-dashed border-purple-300 rounded-2xl p-4 flex flex-wrap items-center gap-2">
        {placedWords.length === 0 ? (
          <span className="text-xs text-purple-400 italic">Nhấp vào các từ bên dưới để đưa vào câu...</span>
        ) : (
          placedWords.map((w, i) => (
            <button
              key={i}
              onClick={() => handleRemoveWord(w, i)}
              className="bg-purple-600 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-xs hover:bg-purple-700 transition-colors"
              title="Nhấp để trả lại"
            >
              {w} ✕
            </button>
          ))
        )}
      </div>

      {/* Available Word Pool */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        {availableWords.map((w, i) => (
          <button
            key={i}
            onClick={() => handlePickWord(w, i)}
            className="bg-white hover:bg-purple-50 text-slate-800 font-extrabold px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm shadow-xs transition-all hover:scale-105"
          >
            {w}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          Đã ghép {placedWords.length} / {targetWords.length} từ
        </span>
        <button
          onClick={handleCheck}
          disabled={placedWords.length !== targetWords.length}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-extrabold px-6 py-2.5 rounded-2xl text-xs sm:text-sm shadow-sm transition-all"
        >
          Kiểm tra câu hoàn chỉnh
        </button>
      </div>

      {isSuccess && (
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center text-emerald-800 font-bold text-sm animate-in fade-in">
          🎉 Chính xác! "Em yêu quê hương An Giang tươi đẹp." – Một câu văn đầy ý nghĩa!
        </div>
      )}
    </div>
  );
};
