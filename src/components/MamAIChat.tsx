import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Volume2, Sparkles, X, Minimize2, Maximize2, MessageCircleQuestion, HelpCircle, Heart } from 'lucide-react';
import { GradeLevel, SubjectType } from '../types';
import { askMamAI } from '../services/aiService';
import { audioService } from '../services/audioService';

interface MamAIChatProps {
  currentGrade: GradeLevel;
  currentSubject: SubjectType;
  currentTopicTitle?: string;
  isOpen: boolean;
  onToggle: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'mam_ai' | 'student';
  text: string;
  timestamp: string;
}

export const MamAIChat: React.FC<MamAIChatProps> = ({
  currentGrade,
  currentSubject,
  currentTopicTitle = '',
  isOpen,
  onToggle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'mam_ai',
      text: `Xin chào bạn nhỏ Lớp ${currentGrade}! Mình là Mầm AI – Bạn đồng hành tri thức đây! Hôm nay chúng mình cùng học ${currentSubject === 'math' ? 'Toán thật vui' : 'Tiếng Việt thật hay'} nhé!`,
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Mầm AI ơi, hướng dẫn em bài này từng bước với!',
    'Em hay nhầm dấu tính, có mẹo nào dễ nhớ không?',
    'Kể cho em nghe một câu chuyện về rừng tràm Trà Sư!',
    'Cho em một lời khen động viên đi ạ!',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'student',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await askMamAI(
        text,
        currentGrade,
        currentSubject,
        currentTopicTitle,
        'Học sinh đang nhắn tin trực tiếp với Mầm AI trong giao diện học tập'
      );

      const aiMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'mam_ai',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
      audioService.playCorrect();
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: 'msg-' + (Date.now() + 1),
          sender: 'mam_ai',
          text: 'Mầm AI luôn ở đây cổ vũ em! Em hãy tiếp tục cố gắng nhé!',
          timestamp: 'Vừa xong',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      audioService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      audioService.speakText(text, () => setIsSpeaking(false));
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-teal-600 via-emerald-500 to-amber-500 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all group no-print"
        aria-label="Mở Mầm AI Trợ Giảng"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-white text-teal-700 flex items-center justify-center font-black shadow-inner">
            🌱
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-300 border-2 border-white rounded-full animate-ping" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-100 flex items-center gap-1">
            Trợ giảng AI <Sparkles className="w-3 h-3 text-amber-300" />
          </div>
          <div className="text-sm font-extrabold text-white">Mầm AI – Bạn đồng hành</div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[95vw] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-teal-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 no-print">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 text-white p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-2xl shadow-inner">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base text-white tracking-tight">MẦM AI</h3>
              <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                TH-THCS VĨNH ĐIỀU
              </span>
            </div>
            <p className="text-xs text-teal-100 font-medium">Bạn đồng hành tri thức Lớp {currentGrade}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white"
            title="Thu nhỏ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="bg-teal-50/70 border-b border-teal-100 p-2 overflow-x-auto flex gap-1.5 scrollbar-none">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] font-semibold text-teal-800 bg-white hover:bg-teal-100 border border-teal-200/80 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {messages.map(msg => {
          const isAI = msg.sender === 'mam_ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center text-sm shadow-xs shrink-0 mt-0.5">
                  🌱
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  isAI
                    ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                    : 'bg-teal-600 text-white rounded-tr-xs font-medium'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-slate-100/50 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {isAI && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="hover:text-teal-600 text-slate-400 transition-colors p-0.5"
                      title="Nghe Mầm AI đọc"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-2xl w-fit shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
            <span className="ml-1 font-medium">Mầm AI đang suy nghĩ...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Hỏi Mầm AI bài học..."
            className="flex-1 bg-slate-100 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden transition-all placeholder:text-slate-400 font-medium"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white p-2.5 rounded-xl font-bold shadow-xs transition-colors shrink-0"
            aria-label="Gửi tin nhắn"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-[10px] text-center text-slate-400 mt-1.5">
          Mầm AI hướng dẫn tư duy từng bước • An toàn dữ liệu trẻ em GDPT 2018
        </div>
      </div>
    </div>
  );
};
