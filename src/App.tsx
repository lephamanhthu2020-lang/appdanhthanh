/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GradeLevel, StudentProfile, SubjectType } from './types';
import { StorageService } from './services/storageService';
import { audioService } from './services/audioService';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { MathRoom } from './components/MathRoom';
import { VietnameseRoom } from './components/VietnameseRoom';
import { GamesHub } from './components/GamesHub';
import { CompetencyMap } from './components/CompetencyMap';
import { TeacherDashboard } from './components/TeacherDashboard';
import { EvidenceDashboard } from './components/EvidenceDashboard';
import { AnGiangSpace } from './components/AnGiangSpace';
import { CompetitionAbout } from './components/CompetitionAbout';
import { MamAIChat } from './components/MamAIChat';
import { StudentTasks } from './components/StudentTasks';

export default function App() {
  const currentGrade: GradeLevel = 2;
  const [activeTab, setActiveTab] = useState<string>('home');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isMamAIOpen, setIsMamAIOpen] = useState<boolean>(false);

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() =>
    StorageService.getStudentProfile()
  );

  const [mamAIContextTopic, setMamAIContextTopic] = useState<string>('');

  useEffect(() => {
    // Sync sound setting
    audioService.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  const handleToggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const handleToggleMotion = () => {
    setReducedMotion(prev => !prev);
  };

  const handleOpenMamAIWithContext = (topicTitle: string, questionPrompt: string) => {
    setMamAIContextTopic(topicTitle);
    setIsMamAIOpen(true);
  };

  const [targetTopicId, setTargetTopicId] = useState<string | undefined>(undefined);

  const handleOpenTopicFromCompetency = (subject: SubjectType, topicId: string) => {
    setTargetTopicId(topicId);
    if (subject === 'math') {
      setActiveTab('math');
    } else {
      setActiveTab('vietnamese');
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col selection:bg-blue-200 selection:text-blue-900 ${reducedMotion ? 'motion-reduce' : ''}`}>
      {/* Universal Header with Navigation, Grade Ribbon and Audio Controls */}
      <Header
        currentGrade={currentGrade}
        onSelectGrade={_g => {
          setTargetTopicId(undefined);
        }}
        activeTab={activeTab}
        onSelectTab={t => {
          setActiveTab(t);
          setTargetTopicId(undefined);
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        }}
        studentProfile={studentProfile}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        reducedMotion={reducedMotion}
        onToggleMotion={handleToggleMotion}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' && (
          <HomeDashboard
            currentGrade={currentGrade}
            onSelectGrade={_g => {
              setTargetTopicId(undefined);
            }}
            onNavigate={t => {
              setActiveTab(t);
              setTargetTopicId(undefined);
              window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
            }}
            studentProfile={studentProfile}
            onOpenMamAI={() => setIsMamAIOpen(true)}
          />
        )}

        {activeTab === 'math' && (
          <MathRoom
            currentGrade={currentGrade}
            onOpenMamAIWithContext={handleOpenMamAIWithContext}
            initialTopicId={targetTopicId}
          />
        )}

        {activeTab === 'vietnamese' && (
          <VietnameseRoom
            currentGrade={currentGrade}
            onOpenMamAIWithContext={handleOpenMamAIWithContext}
            initialTopicId={targetTopicId}
          />
        )}

        {activeTab === 'tasks' && (
          <StudentTasks
            currentGrade={currentGrade}
            studentProfile={studentProfile}
          />
        )}

        {activeTab === 'games' && <GamesHub currentGrade={currentGrade} />}

        {activeTab === 'competency' && (
          <CompetencyMap
            currentGrade={currentGrade}
            studentProfile={studentProfile}
            onOpenTopic={handleOpenTopicFromCompetency}
          />
        )}

        {activeTab === 'teacher' && <TeacherDashboard />}

        {activeTab === 'evidence' && <EvidenceDashboard />}

        {activeTab === 'angiang' && <AnGiangSpace />}

        {activeTab === 'about' && (
          <CompetitionAbout
            onStartDemoStep={tab => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
            }}
          />
        )}
      </main>

      {/* Floating Mầm AI Companion Mascot */}
      <MamAIChat
        currentGrade={currentGrade}
        currentSubject={activeTab === 'vietnamese' ? 'vietnamese' : 'math'}
        currentTopicTitle={mamAIContextTopic}
        isOpen={isMamAIOpen}
        onToggle={() => setIsMamAIOpen(prev => !prev)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 border-t border-slate-800 text-xs no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="text-white font-extrabold text-sm tracking-wide">
              VĨNH ĐIỀU SMART AI – LỚP 2
            </div>
            <p className="text-slate-400 text-xs">
              Hệ sinh thái học tập thông minh môn Toán & Tiếng Việt Lớp 2 • Kết nối tri thức với cuộc sống
            </p>
            <p className="text-slate-300 text-[11px]">
              Tác giả: <strong>Giáo viên Danh Thanh</strong> • Đơn vị: <strong>Trường TH-THCS Vĩnh Điều</strong>, xã Vĩnh Điều, An Giang (Năm học 2026 – 2027)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
            <span className="bg-blue-900/60 text-blue-300 border border-blue-700/50 px-3 py-1 rounded-full font-bold">
              Chương trình GDPT 2018
            </span>
            <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 px-3 py-1 rounded-full font-bold">
              Bảo vệ Dữ liệu Trẻ em
            </span>
            <span className="bg-amber-900/60 text-amber-300 border border-amber-700/50 px-3 py-1 rounded-full font-bold">
              Dự thi AI Giáo Dục 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
