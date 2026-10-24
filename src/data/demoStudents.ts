import { CompetitionEvidenceData, SurveyClassData, StudentProfile } from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'VD-2026-089',
  displayName: 'Nguyễn Minh Trí',
  grade: 2,
  school: 'Trường TH-THCS Vĩnh Điều',
  avatarSeed: 'robot-green',
  stars: 48,
  streakDays: 5,
  completedQuestionIds: ['m1-1', 'm1-2', 'm2-1', 'tv2-1'],
  answeredRecords: [
    {
      questionId: 'm2-1',
      subject: 'math',
      topicId: 'math-g2-multdiv',
      isCorrect: true,
      timestamp: Date.now() - 3600000,
    },
    {
      questionId: 'tv2-1',
      subject: 'vietnamese',
      topicId: 'tv-g2-reading',
      isCorrect: true,
      timestamp: Date.now() - 7200000,
    },
    {
      questionId: 'm2-as1',
      subject: 'math',
      topicId: 'math-g2-addsubcarry',
      isCorrect: false,
      errorType: 'Quên thêm số nhớ vào hàng chục',
      timestamp: Date.now() - 10800000,
    }
  ]
};

export const DEMO_CLASSES: SurveyClassData[] = [
  {
    id: 'class-2a',
    className: 'Lớp 2A',
    grade: 2,
    studentCount: 32,
    preTestAvg: 5.65,
    postTestAvg: 8.24,
    completionRate: 96.8,
    topWeakness: 'Nhầm lẫn phép nhân thành phép cộng (3 x 4 = 7)',
    teacherName: 'Cô Lê Thị Kim Yến'
  },
  {
    id: 'class-2b',
    className: 'Lớp 2B',
    grade: 2,
    studentCount: 30,
    preTestAvg: 5.40,
    postTestAvg: 7.95,
    completionRate: 93.3,
    topWeakness: 'Quên số nhớ khi cộng trừ trong phạm vi 100',
    teacherName: 'Thầy Trần Văn Cường'
  },
  {
    id: 'class-3a',
    className: 'Lớp 3A',
    grade: 3,
    studentCount: 34,
    preTestAvg: 5.80,
    postTestAvg: 8.15,
    completionRate: 94.1,
    topWeakness: 'Số dư lớn hơn số chia trong phép chia có dư',
    teacherName: 'Cô Nguyễn Thị Mai'
  },
  {
    id: 'class-4a',
    className: 'Lớp 4A',
    grade: 4,
    studentCount: 33,
    preTestAvg: 5.95,
    postTestAvg: 8.30,
    completionRate: 97.0,
    topWeakness: 'Cộng trực tiếp mẫu số hai phân số khác mẫu',
    teacherName: 'Thầy Danh Thanh'
  },
  {
    id: 'class-5a',
    className: 'Lớp 5A',
    grade: 5,
    studentCount: 35,
    preTestAvg: 6.10,
    postTestAvg: 8.45,
    completionRate: 94.3,
    topWeakness: 'Quy đổi sai đơn vị thời gian (phút sang giờ) trong toán chuyển động',
    teacherName: 'Thầy Danh Thanh'
  }
];

export const DEMO_EVIDENCE_DATA: CompetitionEvidenceData = {
  academicYear: '2026 - 2027',
  schoolName: 'Trường TH-THCS Vĩnh Điều, xã Vĩnh Điều, An Giang',
  author: 'Giáo viên: Thầy Danh Thanh',
  province: 'Xã Vĩnh Điều, An Giang',
  classesCount: 5,
  totalStudents: 164,
  totalPracticeSessions: 2450,
  preInterventionAvg: 5.78,
  postInterventionAvg: 8.22,
  completionRate: 95.1,
  teacherPrepTimeSavedMinutes: 50, // minutes per day saved on generating worksheets and correcting mistakes
  satisfactionRate: 96.5,
  sampleClasses: DEMO_CLASSES,
  isDemoData: true
};

export const AN_GIANG_STORIES = [
  {
    id: 'ag-1',
    title: 'Hạt ngọc phù sa Vĩnh Điều',
    category: 'Văn hóa & Đời sống',
    summary: 'Vùng đất đầu nguồn sông Vĩnh Tế màu mỡ, nơi cây lúa trĩu bông và đàn cá linh non mùa lũ nuôi lớn tuổi thơ học trò nghèo hiếu học.',
    location: 'Xã Vĩnh Điều, Huyện Giang Thành - Tri Tôn'
  },
  {
    id: 'ag-2',
    title: 'Huyền thoại rừng tràm Trà Sư',
    category: 'Thiên nhiên & Môi trường',
    summary: 'Lá phổi xanh nguyên sinh với thảm bèo cám ngút ngàn, ngôi nhà chung của hơn 70 loài chim và 140 loài thực vật quý hiếm.',
    location: 'Thị xã Tịnh Biên, An Giang'
  },
  {
    id: 'ag-3',
    title: 'Hương vị thốt nốt Bảy Núi',
    category: 'Nghề truyền thống',
    summary: 'Cây thốt nốt kiên cường vượt qua mùa khô hạn, cho giọt nước thanh ngọt để nấu nên những bánh đường thơm lừng nổi tiếng.',
    location: 'Tri Tôn - Tịnh Biên, An Giang'
  },
  {
    id: 'ag-4',
    title: 'Chợ nổi Long Xuyên - Sức sống sông nước',
    category: 'Thương hồ Miền Tây',
    summary: 'Cây bẹo treo lủng lẳng rau củ, tiếng cười giòn tan của các cô chú lái ghe trên dòng sông Hậu hiền hòa chở nặng ân tình.',
    location: 'Thành phố Long Xuyên, An Giang'
  }
];
