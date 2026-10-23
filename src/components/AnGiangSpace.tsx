import React, { useState } from 'react';
import { AN_GIANG_STORIES } from '../data/demoStudents';
import { audioService } from '../services/audioService';
import { 
  MapPin, 
  BookOpen, 
  ShoppingBag, 
  Trees, 
  Droplets, 
  Heart, 
  CheckCircle2, 
  Sparkles,
  Calculator
} from 'lucide-react';

export const AnGiangSpace: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState(AN_GIANG_STORIES[0]);
  const [userMathAnswer, setUserMathAnswer] = useState('');
  const [mathChecked, setMathChecked] = useState(false);
  const [mathIsCorrect, setMathIsCorrect] = useState(false);

  // Practical Math Problem in An Giang: Chợ Vĩnh Điều
  const handleCheckMath = () => {
    // Problem: Mẹ đi chợ Vĩnh Điều mua 2 kg đường thốt nốt (giá 35 000 đồng/kg) và 1 nải chuối giá 20 000 đồng. Mẹ đưa cô bán hàng tờ 100 000 đồng. Hỏi cô bán hàng trả lại mẹ bao nhiêu tiền?
    // 2 x 35000 = 70000; 70000 + 20000 = 90000; 100000 - 90000 = 10 000
    const ans = userMathAnswer.replace(/\D/g, '');
    const correct = ans === '10000' || ans === '10';
    setMathChecked(true);
    setMathIsCorrect(correct);
    if (correct) {
      audioService.playCorrect();
    } else {
      audioService.playIncorrect();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> GIÁO DỤC ĐỊA PHƯƠNG
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Em Yêu Quê Hương An Giang
            </h2>
            <p className="text-emerald-200 text-xs sm:text-sm mt-1 max-w-xl">
              Đưa vẻ đẹp sông nước Vĩnh Điều, Bảy Núi, rặng thốt nốt và rừng tràm Trà Sư vào từng bài toán thực tế và bài tập đọc mến yêu.
            </p>
          </div>

          <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center text-3xl shadow-inner shrink-0">
            🌾
          </div>
        </div>
      </div>

      {/* Grid: Practical Rural Problem & Cultural Reading */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cultural Stories List (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" /> Địa danh & Nét đẹp Vĩnh Điều
          </h3>
          <div className="space-y-2.5">
            {AN_GIANG_STORIES.map(story => {
              const isSel = selectedStory.id === story.id;
              return (
                <button
                  key={story.id}
                  onClick={() => setSelectedStory(story)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all ${
                    isSel
                      ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                      : 'bg-slate-50 hover:bg-emerald-50/50 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">{story.category}</span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">{story.title}</h4>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {story.location}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Story Content & Local Math Challenge (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detail Reading */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
                  {selectedStory.category}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{selectedStory.title}</h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {selectedStory.location}
              </span>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed font-serif text-justify bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100">
              {selectedStory.summary}
            </p>

            <div className="text-[11px] text-slate-500 italic">
              * Nguồn tham khảo: Tài liệu Giáo dục địa phương tỉnh An Giang – Nhà xuất bản Giáo dục Việt Nam.
            </div>
          </div>

          {/* Localized Practical Math Problem */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                  Toán thực tế nông thôn
                </span>
                <h4 className="text-base font-extrabold text-slate-900">
                  Bài toán tính tiền: Đi chợ Vĩnh Điều
                </h4>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
              <p>
                "Mẹ bạn Nam đi chợ Vĩnh Điều mua <strong>2 kg đường thốt nốt</strong> (giá <strong>35 000 đồng/kg</strong>) và <strong>1 nải chuối</strong> giá <strong>20 000 đồng</strong>. Mẹ đưa cô bán hàng tờ tiền <strong>100 000 đồng</strong>. Hỏi cô bán hàng phải trả lại cho mẹ Nam bao nhiêu tiền?"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Nhập số tiền trả lại (đồng)..."
                  value={userMathAnswer}
                  onChange={e => {
                    setUserMathAnswer(e.target.value);
                    setMathChecked(false);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
              <button
                onClick={handleCheckMath}
                disabled={!userMathAnswer.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shrink-0"
              >
                Kiểm tra kết quả
              </button>
            </div>

            {mathChecked && (
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm ${
                  mathIsCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {mathIsCorrect ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> Hoàn toàn chính xác! Cô bán hàng trả lại mẹ 10 000 đồng.
                    </div>
                    <p className="font-normal text-xs text-slate-700">
                      Cách giải: Tiền mua đường thốt nốt = 35 000 x 2 = 70 000 (đồng). Tổng tiền mua hàng = 70 000 + 20 000 = 90 000 (đồng). Tiền trả lại = 100 000 - 90 000 = 10 000 (đồng).
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold">Chưa đúng rồi! </span>
                    Em hãy tính tiền 2 kg đường thốt nốt trước (35 000 x 2 = 70 000 đồng), sau đó cộng thêm 20 000 đồng tiền chuối, rồi lấy 100 000 đồng trừ đi nhé!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
