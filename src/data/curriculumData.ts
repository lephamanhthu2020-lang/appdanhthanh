import { LessonTopic } from '../types';

export const CURRICULUM_DATA: LessonTopic[] = [
  // ==========================================
  // LỚP 1 - TOÁN
  // ==========================================
  {
    id: 'math-g1-count',
    grade: 1,
    subject: 'math',
    title: 'Số và Phép đếm trong phạm vi 10',
    weekRange: 'Tuần 1 - 4',
    description: 'Nhận biết các chữ số từ 0 đến 10, đếm số lượng đồ vật, so sánh nhiều hơn - ít hơn.',
    iconName: 'Calculator',
    badgeColor: 'emerald',
    learningGoals: [
      'Đếm thành thạo số lượng trong phạm vi 10',
      'Đọc, viết đúng chữ số 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10',
      'So sánh được hai nhóm đồ vật bằng các thuật ngữ nhiều hơn, ít hơn, bằng nhau'
    ],
    anGiangNote: 'Đếm đàn chim cò bay về rừng tràm Trà Sư, đếm chùm quả thốt nốt ngọt lành.',
    questions: [
      {
        id: 'm1-1',
        grade: 1,
        subject: 'math',
        topicId: 'math-g1-count',
        format: 'multiple_choice',
        prompt: 'Em hãy đếm xem trong hình có bao nhiêu quả táo? 🍎 🍎 🍎 🍎 🍎',
        options: ['A. 4 quả', 'B. 5 quả', 'C. 6 quả', 'D. 3 quả'],
        correctAnswer: 'B. 5 quả',
        solutionExplanation: 'Ta đếm lần lượt từng quả: một, hai, ba, bốn, năm. Vậy có tất cả 5 quả táo.',
        visualAid: '🍎🍎🍎🍎🍎',
        cognitiveLevel: 'Nhận biết',
        commonErrors: [
          {
            pattern: 'A. 4 quả',
            category: 'Đếm sót đồ vật',
            explanation: 'Có vẻ em đã đếm vội nên bỏ sót 1 quả táo rồi.',
            hint: 'Em hãy dùng ngón tay chỉ vào từng quả táo và đếm thật chậm từ 1 nhé!'
          },
          {
            pattern: 'C. 6 quả',
            category: 'Đếm lặp đồ vật',
            explanation: 'Có vẻ em đã đếm một quả táo hai lần.',
            hint: 'Hãy đếm từ trái sang phải, mỗi quả chỉ đếm đúng một lần thôi nha!'
          }
        ]
      },
      {
        id: 'm1-2',
        grade: 1,
        subject: 'math',
        topicId: 'math-g1-count',
        format: 'multiple_choice',
        prompt: 'Điền dấu thích hợp vào chỗ chấm: 7 ... 4',
        options: ['A. >', 'B. <', 'C. =', 'D. +'],
        correctAnswer: 'A. >',
        solutionExplanation: 'Số 7 đứng sau số 4 trong dãy số tự nhiên, nên 7 lớn hơn 4 (7 > 4).',
        cognitiveLevel: 'Thông hiểu',
        commonErrors: [
          {
            pattern: 'B. <',
            category: 'Nhầm lẫn chiều dấu lớn hơn và bé hơn',
            explanation: 'Em đang chọn dấu bé hơn (<), nhưng 7 nhiều hơn 4 mà!',
            hint: 'Mẹo nhỏ cho em: miệng chú cá sấu há to luôn quay về phía số lớn hơn nhé!'
          }
        ]
      },
      {
        id: 'm1-3',
        grade: 1,
        subject: 'math',
        topicId: 'math-g1-count',
        format: 'fill_blank',
        prompt: 'Tính: 4 + 3 = ?',
        correctAnswer: '7',
        solutionExplanation: 'Có 4, thêm 3: đếm thêm 5, 6, 7. Kết quả là 7.',
        cognitiveLevel: 'Vận dụng',
        commonErrors: [
          {
            pattern: '1',
            category: 'Nhầm phép cộng thành phép trừ',
            explanation: 'Dấu "+" là phép cộng (thêm vào), không phải phép trừ bớt đi.',
            hint: 'Hãy gom 4 ngón tay với 3 ngón tay lại xem có tất cả bao nhiêu ngón nhé!'
          },
          {
            pattern: '6',
            category: 'Đếm thêm thiếu 1 đơn vị',
            explanation: 'Em gần đúng rồi, chỉ thiếu 1 đơn vị thôi.',
            hint: 'Bắt đầu từ 4, đếm thêm 3 bước: 5... 6... rồi đến mấy nào?'
          }
        ]
      },
      {
        id: 'm1-4',
        grade: 1,
        subject: 'math',
        topicId: 'math-g1-count',
        format: 'multiple_choice',
        prompt: 'Bé Lan có 6 bông hoa, Lan tặng bạn Mai 2 bông hoa. Hỏi bé Lan còn lại bao nhiêu bông hoa?',
        options: ['A. 4 bông hoa', 'B. 8 bông hoa', 'C. 3 bông hoa', 'D. 5 bông hoa'],
        correctAnswer: 'A. 4 bông hoa',
        solutionExplanation: 'Tặng bạn là bớt đi, ta làm phép trừ: 6 - 2 = 4 bông hoa.',
        cognitiveLevel: 'Vận dụng',
        commonErrors: [
          {
            pattern: 'B. 8 bông hoa',
            category: 'Nhầm lẫn giữa thêm vào và bớt đi',
            explanation: 'Lan tặng bạn thì số hoa của Lan phải ít đi chứ không tăng lên.',
            hint: 'Tặng bạn tức là bớt đi, em hãy dùng phép tính trừ (6 - 2) nhé!'
          }
        ]
      }
    ]
  },
  {
    id: 'math-g1-shapes',
    grade: 1,
    subject: 'math',
    title: 'Hình học phẳng trực quan',
    weekRange: 'Tuần 5 - 8',
    description: 'Làm quen hình vuông, hình tròn, hình tam giác, hình chữ nhật trong thực tế.',
    iconName: 'Shapes',
    badgeColor: 'sky',
    learningGoals: ['Nhận biết hình vuông, hình tròn, hình tam giác, hình chữ nhật', 'Liên hệ đồ vật quanh lớp học và gia đình'],
    questions: [
      {
        id: 'm1-s1',
        grade: 1,
        subject: 'math',
        topicId: 'math-g1-shapes',
        format: 'multiple_choice',
        prompt: 'Mặt chiếc đồng hồ treo tường hình tròn giống hình nào sau đây? ⭕',
        options: ['A. Hình tròn', 'B. Hình vuông', 'C. Hình tam giác', 'D. Hình chữ nhật'],
        correctAnswer: 'A. Hình tròn',
        solutionExplanation: 'Mặt đồng hồ tròn xoe không có góc, đó là hình tròn.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'm1-s2',
        grade: 1,
        subject: 'math',
        topicId: 'math-g1-shapes',
        format: 'multiple_choice',
        prompt: 'Chiếc khăn quàng đỏ hoặc mái nhà thường có dạng hình gì?',
        options: ['A. Hình tam giác', 'B. Hình tròn', 'C. Hình vuông', 'D. Khối lập phương'],
        correctAnswer: 'A. Hình tam giác',
        solutionExplanation: 'Khăn quàng đỏ có 3 cạnh và 3 đỉnh, đó là hình tam giác.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'm1-s3',
        grade: 1,
        subject: 'math',
        topicId: 'math-g1-shapes',
        format: 'fill_blank',
        prompt: 'Hình tam giác có tất cả bao nhiêu cạnh? (Nhập chữ số)',
        correctAnswer: '3',
        solutionExplanation: 'Hình tam giác là hình khép kín gồm 3 cạnh.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'm1-s4',
        grade: 1,
        subject: 'math',
        topicId: 'math-g1-shapes',
        format: 'multiple_choice',
        prompt: 'Hình chữ nhật và hình vuông có điểm gì giống nhau?',
        options: ['A. Đều có 4 góc', 'B. Đều tròn xoe', 'C. Đều chỉ có 3 cạnh', 'D. Không có cạnh nào'],
        correctAnswer: 'A. Đều có 4 góc',
        solutionExplanation: 'Cả hình vuông và hình chữ nhật đều có 4 cạnh và 4 góc.',
        cognitiveLevel: 'Thông hiểu'
      }
    ]
  },
  {
    id: 'math-g1-addsub20',
    grade: 1,
    subject: 'math',
    title: 'Phép cộng, phép trừ trong phạm vi 20',
    weekRange: 'Tuần 9 - 14',
    description: 'Cộng trừ không nhớ trong phạm vi 20, bài toán thực tế đơn giản.',
    iconName: 'PlusCircle',
    badgeColor: 'amber',
    learningGoals: ['Tính nhẩm cộng trừ dạng 10 + 3, 14 - 4, 12 + 5', 'Giải toán có lời văn 1 phép tính'],
    questions: [
      {
        id: 'm1-as1',
        grade: 1,
        subject: 'math',
        topicId: 'math-g1-addsub20',
        format: 'fill_blank',
        prompt: 'Tính nhẩm: 10 + 6 = ?',
        correctAnswer: '16',
        solutionExplanation: '1 chục và 6 đơn vị là số 16. Vậy 10 + 6 = 16.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'm1-as2',
        grade: 1,
        subject: 'math',
        topicId: 'math-g1-addsub20',
        format: 'fill_blank',
        prompt: 'Tính: 17 - 5 = ?',
        correctAnswer: '12',
        solutionExplanation: 'Ta lấy hàng đơn vị trừ trước: 7 - 5 = 2, giữ nguyên hàng chục là 1, được 12.',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'm1-as3',
        grade: 1,
        subject: 'math',
        topicId: 'math-g1-addsub20',
        format: 'multiple_choice',
        prompt: 'Vườn nhà bà ở Vĩnh Điều có 12 cây chuối, bà trồng thêm 3 cây chuối nữa. Hỏi vườn nhà bà có tất cả bao nhiêu cây chuối?',
        options: ['A. 15 cây', 'B. 9 cây', 'C. 16 cây', 'D. 14 cây'],
        correctAnswer: 'A. 15 cây',
        solutionExplanation: 'Trồng thêm ta làm phép cộng: 12 + 3 = 15 cây chuối.',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'm1-as4',
        grade: 1,
        subject: 'math',
        topicId: 'math-g1-addsub20',
        format: 'multiple_choice',
        prompt: 'Phép tính nào dưới đây có kết quả bằng 14?',
        options: ['A. 10 + 4', 'B. 18 - 5', 'C. 12 + 1', 'D. 15 - 2'],
        correctAnswer: 'A. 10 + 4',
        solutionExplanation: '10 + 4 = 14. Còn 18 - 5 = 13, 12 + 1 = 13, 15 - 2 = 13.',
        cognitiveLevel: 'Thông hiểu'
      }
    ]
  },

  // ==========================================
  // LỚP 1 - TIẾNG VIỆT
  // ==========================================
  {
    id: 'tv-g1-vowels',
    grade: 1,
    subject: 'vietnamese',
    title: 'Âm, Chữ và Dấu thanh',
    weekRange: 'Tuần 1 - 6',
    description: 'Nhận biết bảng chữ cái tiếng Việt, dấu sắc, huyền, hỏi, ngã, nặng.',
    iconName: 'BookOpen',
    badgeColor: 'teal',
    learningGoals: ['Đọc đúng các nguyên âm: a, o, ô, ơ, e, ê, u, ư, i', 'Nhận biết và phân biệt 5 dấu thanh tiếng Việt'],
    readingPassage: {
      title: 'Bé và hoa búp sen',
      content: 'Mẹ dắt bé ra bờ hồ. Bờ hồ có nhiều nụ hoa sen. Gió nhè nhẹ thổi, hương sen thoang thoảng bay.',
      authorOrOrigin: 'Bài đọc luyện tập Lớp 1'
    },
    questions: [
      {
        id: 'tv1-1',
        grade: 1,
        subject: 'vietnamese',
        topicId: 'tv-g1-vowels',
        format: 'multiple_choice',
        prompt: 'Tiếng "mẹ" mang dấu thanh nào?',
        options: ['A. Thanh nặng', 'B. Thanh sắc', 'C. Thanh huyền', 'D. Thanh hỏi'],
        correctAnswer: 'A. Thanh nặng',
        solutionExplanation: 'Dưới chữ "e" có dấu chấm nhỏ, đó là thanh nặng (.) trong tiếng "mẹ".',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'tv1-2',
        grade: 1,
        subject: 'vietnamese',
        topicId: 'tv-g1-vowels',
        format: 'multiple_choice',
        prompt: 'Tìm tiếng có chứa âm "a":',
        options: ['A. Ba', 'B. Bố', 'C. Mẹ', 'D. Bé'],
        correctAnswer: 'A. Ba',
        solutionExplanation: 'Tiếng "Ba" gồm âm "b" đứng trước, âm "a" đứng sau: b - a - ba.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'tv1-3',
        grade: 1,
        subject: 'vietnamese',
        topicId: 'tv-g1-vowels',
        format: 'fill_blank',
        prompt: 'Điền chữ cái còn thiếu vào chỗ chấm: "C... cá" (chỉ con cá bơi dưới nước)',
        correctAnswer: 'on',
        solutionExplanation: 'Từ hoàn chỉnh là "Con cá". Chỗ chấm cần điền vần "on".',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv1-4',
        grade: 1,
        subject: 'vietnamese',
        topicId: 'tv-g1-vowels',
        format: 'multiple_choice',
        prompt: 'Từ nào sau đây viết ĐÚNG chính tả?',
        options: ['A. Quả cam', 'B. Của cam', 'C. Quả kam', 'D. Quã cam'],
        correctAnswer: 'A. Quả cam',
        solutionExplanation: 'Quy tắc chính tả: "c" đi với "a" thành "cam", thanh hỏi trên chữ a thành "quả".',
        cognitiveLevel: 'Thông hiểu'
      }
    ]
  },
  {
    id: 'tv-g1-compound',
    grade: 1,
    subject: 'vietnamese',
    title: 'Ghép vần và Đọc câu đơn',
    weekRange: 'Tuần 7 - 12',
    description: 'Ghép vần: an, at, am, ap, on, ot... Luyện đọc câu ngắn.',
    iconName: 'Sparkles',
    badgeColor: 'rose',
    learningGoals: ['Đánh vần và đọc trơn từ ngữ hai tiếng', 'Hiểu nghĩa câu đơn giản về gia đình, trường học'],
    readingPassage: {
      title: 'Quê hương em',
      content: 'Nhà em ở gần dòng kênh xanh mát. Buổi sớm, tiếng gà gáy vang rộn rã. Em cùng bạn tung tăng đến trường mến yêu.',
      authorOrOrigin: 'Văn bản kết nối Vĩnh Điều'
    },
    questions: [
      {
        id: 'tv1-c1',
        grade: 1,
        subject: 'vietnamese',
        topicId: 'tv-g1-compound',
        format: 'multiple_choice',
        prompt: 'Trong bài "Quê hương em", buổi sớm có tiếng gì gáy vang?',
        options: ['A. Tiếng gà gáy', 'B. Tiếng vịt kêu', 'C. Tiếng còi xe', 'D. Tiếng suối reo'],
        correctAnswer: 'A. Tiếng gà gáy',
        solutionExplanation: 'Bài đọc viết: "Buổi sớm, tiếng gà gáy vang rộn rã."',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'tv1-c2',
        grade: 1,
        subject: 'vietnamese',
        topicId: 'tv-g1-compound',
        format: 'multiple_choice',
        prompt: 'Chọn từ thích hợp điền vào câu: "Em rất yêu ... của em."',
        options: ['A. mái trường', 'B. quyển sách bay', 'C. xe đạp kêu', 'D. cái ghế chạy'],
        correctAnswer: 'A. mái trường',
        solutionExplanation: 'Từ "mái trường" tạo nên câu có nghĩa và giàu tình cảm: "Em rất yêu mái trường của em."',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'tv1-c3',
        grade: 1,
        subject: 'vietnamese',
        topicId: 'tv-g1-compound',
        format: 'fill_blank',
        prompt: 'Điền từ còn thiếu: "Cô giáo như mẹ ..." (nhập 1 từ)',
        correctAnswer: 'hiền',
        solutionExplanation: 'Câu hát quen thuộc: "Cô giáo như mẹ hiền, cô yêu em biết mấy."',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv1-c4',
        grade: 1,
        subject: 'vietnamese',
        topicId: 'tv-g1-compound',
        format: 'multiple_choice',
        prompt: 'Tiếng nào có chứa vần "anh"?',
        options: ['A. Xanh', 'B. Sông', 'C. Suối', 'D. Mây'],
        correctAnswer: 'A. Xanh',
        solutionExplanation: 'Tiếng "Xanh" gồm âm x và vần anh (x - anh - xanh).',
        cognitiveLevel: 'Nhận biết'
      }
    ]
  },
  {
    id: 'tv-g1-family',
    grade: 1,
    subject: 'vietnamese',
    title: 'Từ ngữ về Gia đình và Thầy cô',
    weekRange: 'Tuần 13 - 18',
    description: 'Mở rộng vốn từ về người thân, lời chào hỏi lễ phép.',
    iconName: 'HeartHandshake',
    badgeColor: 'amber',
    learningGoals: ['Biết xưng hô lễ phép với ông bà, cha mẹ, thầy cô', 'Viết đúng các từ ngữ xưng hô thường ngày'],
    questions: [
      {
        id: 'tv1-f1',
        grade: 1,
        subject: 'vietnamese',
        topicId: 'tv-g1-family',
        format: 'multiple_choice',
        prompt: 'Khi gặp thầy cô giáo ở sân trường, em nên nói gì?',
        options: [
          'A. Em chào thầy (cô) ạ!',
          'B. Chào bạn nhé!',
          'C. Đi đâu đấy?',
          'D. Không nói gì'
        ],
        correctAnswer: 'A. Em chào thầy (cô) ạ!',
        solutionExplanation: 'Học sinh ngoan ngoãn gặp thầy cô khoanh tay chào lễ phép: "Em chào thầy (cô) ạ!".',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'tv1-f2',
        grade: 1,
        subject: 'vietnamese',
        topicId: 'tv-g1-family',
        format: 'multiple_choice',
        prompt: 'Từ nào chỉ người trong gia đình?',
        options: ['A. Bác sĩ', 'B. Ông nội', 'C. Bạn bè', 'D. Hàng xóm'],
        correctAnswer: 'B. Ông nội',
        solutionExplanation: 'Ông nội là người thân sinh ra bố trong gia đình.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'tv1-f3',
        grade: 1,
        subject: 'vietnamese',
        topicId: 'tv-g1-family',
        format: 'fill_blank',
        prompt: 'Khi được người lớn tặng quà hoặc giúp đỡ, em cần nói lời: "Em cảm ... ạ!"',
        correctAnswer: 'ơn',
        solutionExplanation: 'Nói lời cảm ơn thể hiện văn hóa ứng xử lịch sự và biết ơn.',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'tv1-f4',
        grade: 1,
        subject: 'vietnamese',
        topicId: 'tv-g1-family',
        format: 'multiple_choice',
        prompt: 'Tìm từ đúng để hoàn chỉnh: "Con ... mẹ"',
        options: ['A. thương', 'B. bay', 'C. cười bò', 'D. nhảy cao'],
        correctAnswer: 'A. thương',
        solutionExplanation: 'Từ "thương" thể hiện tình cảm con cái dành cho cha mẹ: "Con thương mẹ".',
        cognitiveLevel: 'Thông hiểu'
      }
    ]
  },

  // ==========================================
  // LỚP 2 - TOÁN
  // ==========================================
  {
    id: 'math-g2-multdiv',
    grade: 2,
    subject: 'math',
    title: 'Phép nhân và Phép chia (Bảng nhân 2, 5)',
    weekRange: 'Tuần 16 - 20',
    description: 'Hình thành khái niệm phép nhân là tổng các số hạng bằng nhau. Bảng nhân chia cơ bản.',
    iconName: 'Calculator',
    badgeColor: 'emerald',
    learningGoals: ['Thuộc bảng nhân 2 và 5', 'Hiểu bản chất phép nhân 3 x 4 là 4 nhóm, mỗi nhóm 3 đồ vật'],
    anGiangNote: 'Mỗi thuyền ba lá chở 5 thúng lúa. Hỏi 4 thuyền chở bao nhiêu thúng lúa?',
    questions: [
      {
        id: 'm2-1',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-multdiv',
        format: 'multiple_choice',
        prompt: 'Tính: 3 x 4 = ?',
        options: ['A. 7', 'B. 12', 'C. 14', 'D. 10'],
        correctAnswer: 'B. 12',
        solutionExplanation: '3 x 4 nghĩa là 3 được lấy 4 lần: 3 + 3 + 3 + 3 = 12.',
        cognitiveLevel: 'Thông hiểu',
        commonErrors: [
          {
            pattern: 'A. 7',
            category: 'Nhầm phép nhân thành phép cộng',
            explanation: 'Có vẻ em đã lấy 3 + 4 = 7 thay vì thực hiện phép nhân!',
            hint: 'Phép nhân 3 x 4 nghĩa là có 4 nhóm, mỗi nhóm có 3 đồ vật: 3 + 3 + 3 + 3 = ?'
          },
          {
            pattern: 'C. 14',
            category: 'Nhầm kết quả trong bảng nhân liền kề',
            explanation: '14 là kết quả của 2 x 7, không phải 3 x 4.',
            hint: 'Hãy nhẩm lại bảng nhân 3: 3 x 1 = 3, 3 x 2 = 6, 3 x 3 = 9, 3 x 4 = ?'
          }
        ]
      },
      {
        id: 'm2-2',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-multdiv',
        format: 'multiple_choice',
        prompt: 'Mỗi chiếc ghe ở chợ nổi Châu Đốc chở 5 giỏ bưởi. Hỏi 6 chiếc ghe như thế chở tất cả bao nhiêu giỏ bưởi?',
        options: ['A. 30 giỏ', 'B. 25 giỏ', 'C. 11 giỏ', 'D. 35 giỏ'],
        correctAnswer: 'A. 30 giỏ',
        solutionExplanation: 'Số giỏ bưởi là: 5 x 6 = 30 (giỏ bưởi).',
        cognitiveLevel: 'Vận dụng',
        isAnGiangContext: true,
        commonErrors: [
          {
            pattern: 'C. 11 giỏ',
            category: 'Lấy số cộng lại do hiểu sai bài toán',
            explanation: 'Bài toán có 6 chiếc ghe, mỗi ghe 5 giỏ nên phải nhân chứ không cộng (5 + 6 = 11 là sai).',
            hint: '5 giỏ được lặp lại 6 lần, em hãy dùng phép nhân 5 x 6 nhé!'
          }
        ]
      },
      {
        id: 'm2-3',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-multdiv',
        format: 'fill_blank',
        prompt: 'Tính: 10 : 2 = ?',
        correctAnswer: '5',
        solutionExplanation: 'Có 10 quả chia đều cho 2 bạn, mỗi bạn được 5 quả: 10 : 2 = 5.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'm2-4',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-multdiv',
        format: 'multiple_choice',
        prompt: 'Tổng 2 + 2 + 2 + 2 + 2 được viết dưới dạng phép nhân là:',
        options: ['A. 2 x 5', 'B. 2 x 4', 'C. 5 x 5', 'D. 2 + 5'],
        correctAnswer: 'A. 2 x 5',
        solutionExplanation: 'Số 2 được lấy 5 lần, nên ta viết là 2 x 5.',
        cognitiveLevel: 'Nhận biết'
      }
    ]
  },
  {
    id: 'math-g2-addsubcarry',
    grade: 2,
    subject: 'math',
    title: 'Phép cộng, phép trừ có nhớ trong phạm vi 100',
    weekRange: 'Tuần 8 - 14',
    description: 'Thực hiện đặt tính rồi tính phép cộng trừ có nhớ, bài toán về nhiều hơn, ít hơn.',
    iconName: 'PlusCircle',
    badgeColor: 'sky',
    learningGoals: ['Đặt tính thẳng cột và tính đúng phép cộng có nhớ', 'Nhớ 1 sang hàng chục khi cộng hàng đơn vị vượt qua 10'],
    questions: [
      {
        id: 'm2-as1',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-addsubcarry',
        format: 'fill_blank',
        prompt: 'Đặt tính rồi tính: 38 + 25 = ?',
        correctAnswer: '63',
        solutionExplanation: '8 + 5 = 13, viết 3 nhớ 1. 3 + 2 = 5, thêm 1 bằng 6. Kết quả là 63.',
        cognitiveLevel: 'Vận dụng',
        commonErrors: [
          {
            pattern: '53',
            category: 'Quên thêm số nhớ vào hàng chục',
            explanation: 'Em đã quên cộng thêm 1 đơn vị nhớ từ hàng đơn vị sang hàng chục rồi!',
            hint: '8 + 5 = 13 (viết 3 nhớ 1). Khi cộng 3 + 2 = 5, em nhớ cộng thêm 1 nữa nhé!'
          }
        ]
      },
      {
        id: 'm2-as2',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-addsubcarry',
        format: 'fill_blank',
        prompt: 'Tính: 52 - 18 = ?',
        correctAnswer: '34',
        solutionExplanation: '2 không trừ được 8, lấy 12 - 8 = 4, viết 4 nhớ 1. 1 thêm 1 là 2; 5 - 2 = 3. Kết quả là 34.',
        cognitiveLevel: 'Vận dụng',
        commonErrors: [
          {
            pattern: '44',
            category: 'Quên trả số nhớ ở phép trừ',
            explanation: 'Em đã quên trừ bớt 1 ở hàng chục sau khi mượn 1 chục ở hàng đơn vị.',
            hint: 'Sau khi lấy 12 - 8 = 4 nhớ 1, em nhớ lấy 5 trừ 1 rồi trừ tiếp 1 nữa nhé!'
          }
        ]
      },
      {
        id: 'm2-as3',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-addsubcarry',
        format: 'multiple_choice',
        prompt: 'Lớp 2A có 34 học sinh, lớp 2B có nhiều hơn lớp 2A 5 học sinh. Hỏi lớp 2B có bao nhiêu học sinh?',
        options: ['A. 39 học sinh', 'B. 29 học sinh', 'C. 40 học sinh', 'D. 38 học sinh'],
        correctAnswer: 'A. 39 học sinh',
        solutionExplanation: 'Nhiều hơn ta làm phép cộng: 34 + 5 = 39 (học sinh).',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'm2-as4',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-addsubcarry',
        format: 'multiple_choice',
        prompt: 'Độ dài đoạn thẳng AB là 15cm, đoạn thẳng CD ngắn hơn AB 6cm. Độ dài đoạn CD là:',
        options: ['A. 9cm', 'B. 21cm', 'C. 11cm', 'D. 8cm'],
        correctAnswer: 'A. 9cm',
        solutionExplanation: 'Ngắn hơn là ít hơn: 15 - 6 = 9 (cm).',
        cognitiveLevel: 'Thông hiểu'
      }
    ]
  },
  {
    id: 'math-g2-measurement',
    grade: 2,
    subject: 'math',
    title: 'Đại lượng và Đo lường: Đề-xi-mét, Lít, Ki-lô-gam',
    weekRange: 'Tuần 10 - 15',
    description: 'Làm quen đơn vị đo độ dài dm, dung tích lít (l), khối lượng ki-lô-gam (kg).',
    iconName: 'Scale',
    badgeColor: 'violet',
    learningGoals: ['Biết 1 dm = 10 cm', 'Thực hiện phép tính với đơn vị đo l, kg, dm'],
    questions: [
      {
        id: 'm2-m1',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-measurement',
        format: 'fill_blank',
        prompt: 'Điền số thích hợp: 1 dm = ... cm',
        correctAnswer: '10',
        solutionExplanation: '1 đề-xi-mét bằng 10 xăng-ti-mét.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'm2-m2',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-measurement',
        format: 'multiple_choice',
        prompt: 'Một can chứa 10 lít nước ngọt thốt nốt, rót ra các chai hết 4 lít. Hỏi trong can còn lại bao nhiêu lít nước?',
        options: ['A. 6 lít', 'B. 14 lít', 'C. 5 lít', 'D. 7 lít'],
        correctAnswer: 'A. 6 lít',
        solutionExplanation: '10 - 4 = 6 (lít).',
        cognitiveLevel: 'Vận dụng',
        isAnGiangContext: true
      },
      {
        id: 'm2-m3',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-measurement',
        format: 'fill_blank',
        prompt: 'Tính: 15 kg + 8 kg = ... kg (chỉ nhập số)',
        correctAnswer: '23',
        solutionExplanation: '15 + 8 = 23 kg.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'm2-m4',
        grade: 2,
        subject: 'math',
        topicId: 'math-g2-measurement',
        format: 'multiple_choice',
        prompt: 'Đồng hồ chỉ mấy giờ khi kim ngắn chỉ số 3, kim dài chỉ số 12?',
        options: ['A. 3 giờ đúng', 'B. 12 giờ 15 phút', 'C. 3 giờ 30 phút', 'D. 12 giờ đúng'],
        correctAnswer: 'A. 3 giờ đúng',
        solutionExplanation: 'Kim ngắn chỉ giờ (số 3), kim dài chỉ phút ở số 12 là đúng 3 giờ.',
        cognitiveLevel: 'Nhận biết'
      }
    ]
  },

  // ==========================================
  // LỚP 2 - TIẾNG VIỆT
  // ==========================================
  {
    id: 'tv-g2-reading',
    grade: 2,
    subject: 'vietnamese',
    title: 'Đọc hiểu và Mở rộng vốn từ về Thiên nhiên',
    weekRange: 'Tuần 10 - 14',
    description: 'Đọc hiểu văn bản về quê hương đồng bằng sông Cửu Long, nhận biết từ chỉ sự vật, hoạt động, đặc điểm.',
    iconName: 'BookOpen',
    badgeColor: 'teal',
    learningGoals: ['Đọc đúng, ngắt nghỉ câu rõ ràng', 'Phân biệt từ chỉ sự vật, hoạt động, đặc điểm'],
    readingPassage: {
      title: 'Mùa hoa điên điển An Giang',
      content: 'Cứ mỗi độ mùa nước nổi tràn về trên cánh đồng Vĩnh Điều, hoa điên điển lại nở vàng rực dọc theo các bờ kênh. Từng chùm hoa vàng tươi đung đưa trong gió sớm. Người dân chèo xuồng hái hoa về nấu canh chua cá linh - món quà thơm thảo, mộc mạc của quê hương xứ sở.',
      authorOrOrigin: 'Theo Đất rừng phương Nam',
      vocabularyNotes: [
        { word: 'Mùa nước nổi', meaning: 'Mùa nước sông Cửu Long dâng cao ngập đồng (khoảng tháng 7 - 10 âm lịch)' },
        { word: 'Điên điển', meaning: 'Loài cây thân xốp mọc hoang dại ở vùng ngập nước Miền Tây, hoa màu vàng ăn rất ngon' }
      ]
    },
    questions: [
      {
        id: 'tv2-1',
        grade: 2,
        subject: 'vietnamese',
        topicId: 'tv-g2-reading',
        format: 'multiple_choice',
        prompt: 'Hoa điên điển trong bài đọc có màu gì đặc trưng?',
        options: ['A. Màu vàng tươi', 'B. Màu đỏ rực', 'C. Màu tím biếc', 'D. Màu trắng muốt'],
        correctAnswer: 'A. Màu vàng tươi',
        solutionExplanation: 'Bài đọc nêu rõ: "Từng chùm hoa vàng tươi đung đưa trong gió sớm."',
        cognitiveLevel: 'Nhận biết',
        isAnGiangContext: true
      },
      {
        id: 'tv2-2',
        grade: 2,
        subject: 'vietnamese',
        topicId: 'tv-g2-reading',
        format: 'multiple_choice',
        prompt: 'Từ nào sau đây là từ chỉ ĐẶC ĐIỂM?',
        options: ['A. Vàng rực', 'B. Chèo xuồng', 'C. Dòng kênh', 'D. Cánh đồng'],
        correctAnswer: 'A. Vàng rực',
        solutionExplanation: '"Vàng rực" chỉ màu sắc (đặc điểm), còn "chèo xuồng" là hoạt động, "dòng kênh" là sự vật.',
        cognitiveLevel: 'Thông hiểu',
        commonErrors: [
          {
            pattern: 'B. Chèo xuồng',
            category: 'Nhầm lẫn từ chỉ hoạt động với từ chỉ đặc điểm',
            explanation: '"Chèo xuồng" là một hành động cụ thể của con người, không phải đặc điểm.',
            hint: 'Từ chỉ đặc điểm thường trả lời cho câu hỏi: như thế nào? (Màu sắc, hình dáng, tính nết...)'
          }
        ]
      },
      {
        id: 'tv2-3',
        grade: 2,
        subject: 'vietnamese',
        topicId: 'tv-g2-reading',
        format: 'multiple_choice',
        prompt: 'Món ăn nào được nhắc đến gắn liền với hoa điên điển?',
        options: ['A. Canh chua cá linh', 'B. Bánh tét', 'C. Phở bò', 'D. Chè sen'],
        correctAnswer: 'A. Canh chua cá linh',
        solutionExplanation: 'Bài viết có câu: "hái hoa về nấu canh chua cá linh - món quà thơm thảo của quê hương".',
        cognitiveLevel: 'Nhận biết',
        isAnGiangContext: true
      },
      {
        id: 'tv2-4',
        grade: 2,
        subject: 'vietnamese',
        topicId: 'tv-g2-reading',
        format: 'fill_blank',
        prompt: 'Điền từ chỉ hoạt động thích hợp: "Bác nông dân đang ... xuồng trên dòng sông."',
        correctAnswer: 'chèo',
        solutionExplanation: 'Hành động điều khiển xuồng bằng mái chèo gọi là "chèo" (hoặc bơi xuồng).',
        cognitiveLevel: 'Vận dụng'
      }
    ]
  },
  {
    id: 'tv-g2-sentences',
    grade: 2,
    subject: 'vietnamese',
    title: 'Câu kể "Ai là gì?", "Ai làm gì?", "Ai thế nào?"',
    weekRange: 'Tuần 15 - 20',
    description: 'Xác định các kiểu câu kể cơ bản và đặt câu đúng cấu trúc ngữ pháp.',
    iconName: 'PenTool',
    badgeColor: 'amber',
    learningGoals: ['Nhận biết đúng mẫu câu Ai là gì?, Ai làm gì?, Ai thế nào?', 'Biết đặt dấu chấm kết thúc câu'],
    questions: [
      {
        id: 'tv2-s1',
        grade: 2,
        subject: 'vietnamese',
        topicId: 'tv-g2-sentences',
        format: 'multiple_choice',
        prompt: 'Câu "Mẹ em là cô giáo vùng biên giới Vĩnh Điều." thuộc mẫu câu nào?',
        options: ['A. Ai là gì?', 'B. Ai làm gì?', 'C. Ai thế nào?', 'D. Câu cảm thán'],
        correctAnswer: 'A. Ai là gì?',
        solutionExplanation: 'Câu dùng từ "là" để giới thiệu nghề nghiệp của mẹ ("Mẹ em" là Ai, "là cô giáo..." là gì).',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv2-s2',
        grade: 2,
        subject: 'vietnamese',
        topicId: 'tv-g2-sentences',
        format: 'multiple_choice',
        prompt: 'Câu "Đàn cá tung tăng bơi lội dưới chân cầu." thuộc mẫu câu nào?',
        options: ['A. Ai làm gì?', 'B. Ai là gì?', 'C. Ai thế nào?', 'D. Ai ở đâu?'],
        correctAnswer: 'A. Ai làm gì?',
        solutionExplanation: '"Tung tăng bơi lội" là từ chỉ hoạt động, nên câu thuộc mẫu Ai (con gì) làm gì?',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv2-s3',
        grade: 2,
        subject: 'vietnamese',
        topicId: 'tv-g2-sentences',
        format: 'multiple_choice',
        prompt: 'Dấu câu nào thích hợp điền vào cuối câu: "Hôm nay thời tiết thật đẹp biết bao ..."',
        options: ['A. Dấu chấm than (!)', 'B. Dấu chấm hỏi (?)', 'C. Dấu hai chấm (:)', 'D. Dấu phẩy (,)'],
        correctAnswer: 'A. Dấu chấm than (!)',
        solutionExplanation: 'Đây là câu bộc lộ cảm xúc khen ngợi ("thật đẹp biết bao"), cuối câu dùng dấu chấm than (!).',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'tv2-s4',
        grade: 2,
        subject: 'vietnamese',
        topicId: 'tv-g2-sentences',
        format: 'fill_blank',
        prompt: 'Chọn từ điền vào chỗ chấm để tạo câu "Ai thế nào?": "Dòng sông quê em rất ... mát."',
        correctAnswer: 'trong',
        solutionExplanation: '"Trong mát" là từ chỉ đặc điểm của dòng sông.',
        cognitiveLevel: 'Vận dụng'
      }
    ]
  },
  {
    id: 'tv-g2-spelling',
    grade: 2,
    subject: 'vietnamese',
    title: 'Phân biệt chính tả: s/x, r/d/gi, l/n',
    weekRange: 'Tuần 5 - 10',
    description: 'Quy tắc chính tả, phân biệt âm đầu và dấu thanh dễ nhầm lẫn.',
    iconName: 'Sparkles',
    badgeColor: 'rose',
    learningGoals: ['Viết đúng chính tả s/x, d/gi/r', 'Sửa lỗi chính tả trong đoạn văn ngắn'],
    questions: [
      {
        id: 'tv2-sp1',
        grade: 2,
        subject: 'vietnamese',
        topicId: 'tv-g2-spelling',
        format: 'multiple_choice',
        prompt: 'Điền s hay x vào chỗ chấm: "...inh đẹp", "...ạch sẽ"',
        options: ['A. x / s (xinh đẹp, sạch sẽ)', 'B. s / x (sinh đẹp, xạch sẽ)', 'C. s / s', 'D. x / x'],
        correctAnswer: 'A. x / s (xinh đẹp, sạch sẽ)',
        solutionExplanation: 'Chính tả chuẩn: "xinh xắn/xinh đẹp" dùng "x", "sạch sẽ" dùng "s".',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv2-sp2',
        grade: 2,
        subject: 'vietnamese',
        topicId: 'tv-g2-spelling',
        format: 'multiple_choice',
        prompt: 'Từ nào viết ĐÚNG chính tả?',
        options: ['A. Dòng sông', 'B. Giòng sông', 'C. Ròng sông', 'D. Zòng sông'],
        correctAnswer: 'A. Dòng sông',
        solutionExplanation: '"Dòng sông" viết bằng chữ "d".',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'tv2-sp3',
        grade: 2,
        subject: 'vietnamese',
        topicId: 'tv-g2-spelling',
        format: 'fill_blank',
        prompt: 'Điền chữ cái thích hợp (l hay n): "Nước non ...gàn dặm"',
        correctAnswer: 'n',
        solutionExplanation: '"Ngàn dặm" bắt đầu bằng âm ng, còn nước non thì non bắt đầu bằng chữ n.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv2-sp4',
        grade: 2,
        subject: 'vietnamese',
        topicId: 'tv-g2-spelling',
        format: 'multiple_choice',
        prompt: 'Tìm từ viết SAI chính tả trong các từ sau:',
        options: ['A. Dành dụm', 'B. Gian nan', 'C. Rộn ràng', 'D. Giành dụm'],
        correctAnswer: 'D. Giành dụm',
        solutionExplanation: '"Dành dụm" (tiết kiệm) viết bằng d, viết "giành dụm" là sai chính tả.',
        cognitiveLevel: 'Vận dụng'
      }
    ]
  },

  // ==========================================
  // LỚP 3 - TOÁN
  // ==========================================
  {
    id: 'math-g3-multdivlarge',
    grade: 3,
    subject: 'math',
    title: 'Nhân, Chia trong phạm vi 1 000 & Phép chia có dư',
    weekRange: 'Tuần 12 - 18',
    description: 'Nhân số có hai, ba chữ số với số có một chữ số. Phép chia hết và phép chia có dư.',
    iconName: 'Calculator',
    badgeColor: 'emerald',
    learningGoals: ['Thực hiện thành thạo phép chia có dư: số dư luôn bé hơn số chia', 'Giải bài toán thực tế rút về đơn vị'],
    questions: [
      {
        id: 'm3-1',
        grade: 3,
        subject: 'math',
        topicId: 'math-g3-multdivlarge',
        format: 'multiple_choice',
        prompt: 'Thực hiện phép chia: 19 : 4 = ?',
        options: ['A. 4 (dư 3)', 'B. 4 (dư 5)', 'C. 5 (dư 1)', 'D. 3 (dư 7)'],
        correctAnswer: 'A. 4 (dư 3)',
        solutionExplanation: 'Ta có 4 x 4 = 16; 19 - 16 = 3 (số dư 3 bé hơn số chia 4). Vậy 19 : 4 = 4 (dư 3).',
        cognitiveLevel: 'Thông hiểu',
        commonErrors: [
          {
            pattern: 'B. 4 (dư 5)',
            category: 'Số dư lớn hơn số chia',
            explanation: 'Trong phép chia, số dư bắt buộc phải NHỎ HƠN số chia (5 > 4 là sai quy tắc).',
            hint: 'Vì số dư là 5 vẫn chia tiếp cho 4 được 1 lần nữa, nên thương phải tăng lên!'
          }
        ]
      },
      {
        id: 'm3-2',
        grade: 3,
        subject: 'math',
        topicId: 'math-g3-multdivlarge',
        format: 'multiple_choice',
        prompt: 'Có 35 bạn học sinh đi đò qua sông Hậu ở An Giang. Mỗi chuyến đò chở tối đa 6 bạn. Hỏi cần ít nhất bao nhiêu chuyến đò để chở hết các bạn?',
        options: ['A. 6 chuyến', 'B. 5 chuyến', 'C. 7 chuyến', 'D. 4 chuyến'],
        correctAnswer: 'A. 6 chuyến',
        solutionExplanation: 'Ta có: 35 : 6 = 5 (dư 5). 5 chuyến chở được 30 bạn, còn dư 5 bạn nên cần thêm 1 chuyến nữa. Tổng cộng cần ít nhất 5 + 1 = 6 chuyến đò.',
        cognitiveLevel: 'Vận dụng',
        isAnGiangContext: true,
        commonErrors: [
          {
            pattern: 'B. 5 chuyến',
            category: 'Bỏ quên số dư trong bài toán thực tế',
            explanation: 'Nếu chỉ đi 5 chuyến thì mới chở được 30 bạn, vẫn còn 5 bạn bị bỏ lại ở bến đò!',
            hint: 'Em hãy đọc kỹ: để chở HẾT tất cả 35 bạn, phần dư 5 bạn cũng cần thêm 1 chuyến đò nữa nhé!'
          }
        ]
      },
      {
        id: 'm3-3',
        grade: 3,
        subject: 'math',
        topicId: 'math-g3-multdivlarge',
        format: 'fill_blank',
        prompt: 'Tính: 124 x 3 = ?',
        correctAnswer: '372',
        solutionExplanation: '3 x 4 = 12 (viết 2 nhớ 1); 3 x 2 = 6 thêm 1 là 7; 3 x 1 = 3. Kết quả 372.',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'm3-4',
        grade: 3,
        subject: 'math',
        topicId: 'math-g3-multdivlarge',
        format: 'multiple_choice',
        prompt: 'Số dư lớn nhất có thể có trong phép chia cho 7 là số nào?',
        options: ['A. 6', 'B. 7', 'C. 8', 'D. 5'],
        correctAnswer: 'A. 6',
        solutionExplanation: 'Số dư luôn nhỏ hơn số chia. Trong phép chia cho 7, số dư lớn nhất có thể là 6.',
        cognitiveLevel: 'Thông hiểu'
      }
    ]
  },
  {
    id: 'math-g3-geometry',
    grade: 3,
    subject: 'math',
    title: 'Chu vi và Diện tích: Hình vuông, Hình chữ nhật',
    weekRange: 'Tuần 22 - 28',
    description: 'Công thức tính chu vi và diện tích hình vuông, hình chữ nhật; đơn vị cm, cm².',
    iconName: 'Shapes',
    badgeColor: 'sky',
    learningGoals: ['Phân biệt công thức tính chu vi và diện tích', 'Tính đúng chu vi và diện tích hình chữ nhật'],
    questions: [
      {
        id: 'm3-g1',
        grade: 3,
        subject: 'math',
        topicId: 'math-g3-geometry',
        format: 'multiple_choice',
        prompt: 'Một thửa ruộng hình chữ nhật có chiều dài 8m, chiều rộng 5m. Chu vi của thửa ruộng đó là:',
        options: ['A. 26m', 'B. 40m', 'C. 13m', 'D. 40m²'],
        correctAnswer: 'A. 26m',
        solutionExplanation: 'Chu vi hình chữ nhật bằng (dài + rộng) x 2 = (8 + 5) x 2 = 13 x 2 = 26 (m).',
        cognitiveLevel: 'Vận dụng',
        commonErrors: [
          {
            pattern: 'B. 40m',
            category: 'Nhầm lẫn công thức chu vi với diện tích',
            explanation: '40 là diện tích (8 x 5 = 40), trong khi đề bài hỏi chu vi!',
            hint: 'Chu vi là viền xung quanh: (dài + rộng) x 2. Diện tích mới là dài x rộng nhé!'
          }
        ]
      },
      {
        id: 'm3-g2',
        grade: 3,
        subject: 'math',
        topicId: 'math-g3-geometry',
        format: 'fill_blank',
        prompt: 'Một cái sân hình vuông có cạnh dài 6m. Diện tích của cái sân đó là bao nhiêu mét vuông (m²)? (Nhập số)',
        correctAnswer: '36',
        solutionExplanation: 'Diện tích hình vuông = cạnh x cạnh = 6 x 6 = 36 m².',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'm3-g3',
        grade: 3,
        subject: 'math',
        topicId: 'math-g3-geometry',
        format: 'multiple_choice',
        prompt: 'Muốn tính chu vi hình vuông, ta lấy:',
        options: ['A. Độ dài một cạnh nhân với 4', 'B. Độ dài một cạnh nhân với chính nó', 'C. Độ dài một cạnh nhân với 2', 'D. Độ dài một cạnh cộng với 4'],
        correctAnswer: 'A. Độ dài một cạnh nhân với 4',
        solutionExplanation: 'Hình vuông có 4 cạnh bằng nhau nên chu vi = cạnh x 4.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'm3-g4',
        grade: 3,
        subject: 'math',
        topicId: 'math-g3-geometry',
        format: 'fill_blank',
        prompt: 'Hình chữ nhật có chu vi là 30cm, nửa chu vi của hình chữ nhật đó là ... cm?',
        correctAnswer: '15',
        solutionExplanation: 'Nửa chu vi = Chu vi : 2 = 30 : 2 = 15 cm.',
        cognitiveLevel: 'Thông hiểu'
      }
    ]
  },
  {
    id: 'math-g3-numbers100k',
    grade: 3,
    subject: 'math',
    title: 'Các số trong phạm vi 100 000',
    weekRange: 'Tuần 25 - 30',
    description: 'Đọc, viết, so sánh các số có 4, 5 chữ số; làm tròn số đến hàng nghìn, chục nghìn.',
    iconName: 'BarChart2',
    badgeColor: 'amber',
    learningGoals: ['Đọc viết thành thạo số có 5 chữ số', 'Xác định giá trị theo hàng của từng chữ số'],
    questions: [
      {
        id: 'm3-n1',
        grade: 3,
        subject: 'math',
        topicId: 'math-g3-numbers100k',
        format: 'multiple_choice',
        prompt: 'Số "Bốn mươi lăm nghìn không trăm linh tám" được viết là:',
        options: ['A. 45 008', 'B. 45 080', 'C. 45 800', 'D. 40 508'],
        correctAnswer: 'A. 45 008',
        solutionExplanation: 'Chữ số 4 hàng chục nghìn, 5 hàng nghìn, 0 hàng trăm, 0 hàng chục, 8 hàng đơn vị: 45 008.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'm3-n2',
        grade: 3,
        subject: 'math',
        topicId: 'math-g3-numbers100k',
        format: 'multiple_choice',
        prompt: 'Chữ số 7 trong số 67 241 có giá trị là bao nhiêu?',
        options: ['A. 7 000', 'B. 70 000', 'C. 700', 'D. 70'],
        correctAnswer: 'A. 7 000',
        solutionExplanation: 'Chữ số 7 đứng ở hàng nghìn nên có giá trị là 7 000.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'm3-n3',
        grade: 3,
        subject: 'math',
        topicId: 'math-g3-numbers100k',
        format: 'fill_blank',
        prompt: 'Số liền sau của số 99 999 là số nào? (Viết liền các chữ số)',
        correctAnswer: '100000',
        solutionExplanation: '99 999 + 1 = 100 000 (Một trăm nghìn).',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'm3-n4',
        grade: 3,
        subject: 'math',
        topicId: 'math-g3-numbers100k',
        format: 'multiple_choice',
        prompt: 'Làm tròn số 42 780 đến hàng nghìn ta được số:',
        options: ['A. 43 000', 'B. 42 000', 'C. 42 800', 'D. 40 000'],
        correctAnswer: 'A. 43 000',
        solutionExplanation: 'Chữ số hàng trăm là 7 (>= 5) nên làm tròn lên hàng nghìn được 43 000.',
        cognitiveLevel: 'Vận dụng'
      }
    ]
  },

  // ==========================================
  // LỚP 3 - TIẾNG VIỆT
  // ==========================================
  {
    id: 'tv-g3-reading',
    grade: 3,
    subject: 'vietnamese',
    title: 'Đọc hiểu Văn bản & Biện pháp So sánh, Nhân hóa',
    weekRange: 'Tuần 8 - 14',
    description: 'Cảm thụ vẻ đẹp văn học qua hình ảnh so sánh, nhân hóa. Hiểu nội dung thông điệp bài đọc.',
    iconName: 'BookOpen',
    badgeColor: 'teal',
    learningGoals: ['Nhận biết hình ảnh so sánh và các từ so sánh (như, là, tựa...)', 'Hiểu tác dụng gợi tả của phép nhân hóa'],
    readingPassage: {
      title: 'Bình minh trên rừng tràm Trà Sư',
      content: 'Khi mặt trời đỏ ối như quả cầu lửa nhô lên khỏi rặng thốt nốt, cả khu rừng tràm Trà Sư bừng tỉnh giấc. Thảm bèo cám xanh mướt như tấm nhung khổng lồ trải dài tít tắp. Những chú chim cồng cộc, le le cất tiếng hót líu lo, ríu rít gọi bầy như muốn chào đón một ngày mới an lành trên đất mẹ An Giang.',
      authorOrOrigin: 'Tài liệu giáo dục địa phương An Giang',
      vocabularyNotes: [
        { word: 'Bèo cám', meaning: 'Loài bèo nhỏ li ti phủ kín mặt nước tạo nên màu xanh đặc trưng của Trà Sư' },
        { word: 'Tấm nhung', meaning: 'Loại vải dày mịn màng, quý giá' }
      ]
    },
    questions: [
      {
        id: 'tv3-1',
        grade: 3,
        subject: 'vietnamese',
        topicId: 'tv-g3-reading',
        format: 'multiple_choice',
        prompt: 'Trong đoạn văn trên, mặt trời lúc bình minh được so sánh với hình ảnh nào?',
        options: [
          'A. Quả cầu lửa',
          'B. Tấm nhung khổng lồ',
          'C. Quả thốt nốt',
          'D. Chiếc thuyền nan'
        ],
        correctAnswer: 'A. Quả cầu lửa',
        solutionExplanation: 'Tác giả viết: "Khi mặt trời đỏ ối như quả cầu lửa nhô lên..."',
        cognitiveLevel: 'Nhận biết',
        isAnGiangContext: true
      },
      {
        id: 'tv3-2',
        grade: 3,
        subject: 'vietnamese',
        topicId: 'tv-g3-reading',
        format: 'multiple_choice',
        prompt: 'Câu "Thảm bèo cám xanh mướt như tấm nhung khổng lồ" chứa biện pháp tu từ nào?',
        options: ['A. So sánh', 'B. Điệp từ', 'C. Nói quá', 'D. Đảo ngữ'],
        correctAnswer: 'A. So sánh',
        solutionExplanation: 'Câu có sự vật 1 (thảm bèo cám) được so sánh với sự vật 2 (tấm nhung khổng lồ) qua từ so sánh "như".',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv3-3',
        grade: 3,
        subject: 'vietnamese',
        topicId: 'tv-g3-reading',
        format: 'fill_blank',
        prompt: 'Tìm từ so sánh trong câu sau: "Mặt hồ phẳng lặng tựa chiếc gương soi." (chỉ nhập 1 từ)',
        correctAnswer: 'tựa',
        solutionExplanation: 'Từ "tựa" (hoặc tựa như) đóng vai trò là từ so sánh giữa mặt hồ và chiếc gương soi.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv3-4',
        grade: 3,
        subject: 'vietnamese',
        topicId: 'tv-g3-reading',
        format: 'multiple_choice',
        prompt: 'Hình ảnh nào sau đây sử dụng biện pháp NHÂN HÓA?',
        options: [
          'A. Chị gió nhẹ nhàng lay từng nhành lá',
          'B. Ngọn núi cao chót vót',
          'C. Dòng sông chảy xiết',
          'D. Mặt trăng tròn xoe'
        ],
        correctAnswer: 'A. Chị gió nhẹ nhàng lay từng nhành lá',
        solutionExplanation: 'Gió được gọi là "chị" và có hành động "lay nhẹ nhàng" như con người, đó là phép nhân hóa.',
        cognitiveLevel: 'Vận dụng'
      }
    ]
  },
  {
    id: 'tv-g3-vocab',
    grade: 3,
    subject: 'vietnamese',
    title: 'Mở rộng vốn từ: Cộng đồng, Quê hương, Sáng tạo',
    weekRange: 'Tuần 15 - 20',
    description: 'Từ ngữ chỉ tình cảm gắn bó xóm giềng, quê hương và các hoạt động trí tuệ.',
    iconName: 'Sparkles',
    badgeColor: 'amber',
    learningGoals: ['Hiểu và dùng đúng các thành ngữ tục ngữ về quê hương, tương thân tương ái', 'Đặt câu với các từ ngữ chủ điểm'],
    questions: [
      {
        id: 'tv3-v1',
        grade: 3,
        subject: 'vietnamese',
        topicId: 'tv-g3-vocab',
        format: 'multiple_choice',
        prompt: 'Thành ngữ nào thể hiện tinh thần đoàn kết, giúp đỡ lẫn nhau?',
        options: [
          'A. Lá lành đùm lá rách',
          'B. Nước chảy đá mòn',
          'C. Đi một ngày đàng học một sàng khôn',
          'D. Ăn quả nhớ kẻ trồng cây'
        ],
        correctAnswer: 'A. Lá lành đùm lá rách',
        solutionExplanation: '"Lá lành đùm lá rách" khuyên con người biết sẻ chia, đùm bọc người có hoàn cảnh khó khăn.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv3-v2',
        grade: 3,
        subject: 'vietnamese',
        topicId: 'tv-g3-vocab',
        format: 'multiple_choice',
        prompt: 'Từ nào đồng nghĩa với từ "quê hương"?',
        options: ['A. Giang sơn, xứ sở', 'B. Thành phố', 'C. Trường lớp', 'D. Vũ trụ'],
        correctAnswer: 'A. Giang sơn, xứ sở',
        solutionExplanation: 'Quê hương, xứ sở, quê quán là những từ cùng nói về nơi chôn rau cắt rốn.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'tv3-v3',
        grade: 3,
        subject: 'vietnamese',
        topicId: 'tv-g3-vocab',
        format: 'fill_blank',
        prompt: 'Điền từ thích hợp vào câu tục ngữ: "Bán anh em xa, mua láng giềng ..."',
        correctAnswer: 'gần',
        solutionExplanation: 'Câu tục ngữ đề cao tình nghĩa xóm giềng thân thiết lúc tối lửa tắt đèn.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv3-v4',
        grade: 3,
        subject: 'vietnamese',
        topicId: 'tv-g3-vocab',
        format: 'multiple_choice',
        prompt: 'Từ nào chỉ hoạt động nghiên cứu, sáng chế?',
        options: ['A. Phát minh', 'B. Trồng trọt', 'C. Đi dạo', 'D. Ngắm cảnh'],
        correctAnswer: 'A. Phát minh',
        solutionExplanation: '"Phát minh" là sáng tạo ra cái mới chưa từng có trước đó.',
        cognitiveLevel: 'Nhận biết'
      }
    ]
  },
  {
    id: 'tv-g3-writing',
    grade: 3,
    subject: 'vietnamese',
    title: 'Luyện viết đoạn văn ngắn (Kể, Tả)',
    weekRange: 'Tuần 22 - 27',
    description: 'Cách viết đoạn văn từ 5 - 7 câu kể về một người thân hoặc tả một đồ dùng học tập.',
    iconName: 'PenTool',
    badgeColor: 'rose',
    learningGoals: ['Biết cấu trúc đoạn văn: câu mở đoạn, thân đoạn, kết đoạn', 'Dùng từ ngữ sinh động và liên kết câu chặt chẽ'],
    questions: [
      {
        id: 'tv3-w1',
        grade: 3,
        subject: 'vietnamese',
        topicId: 'tv-g3-writing',
        format: 'multiple_choice',
        prompt: 'Câu nào thích hợp nhất làm CÂU MỞ ĐOẠN cho đoạn văn tả chiếc cặp sách?',
        options: [
          'A. Nhân dịp năm học mới, mẹ mua tặng em một chiếc cặp sách màu xanh rất xinh xắn.',
          'B. Chiếc khóa bằng đồng sáng bóng loáng.',
          'C. Em sẽ luôn giữ gìn cặp cẩn thận để dùng được lâu.',
          'D. Bên trong cặp có ba ngăn rộng rãi.'
        ],
        correctAnswer: 'A. Nhân dịp năm học mới, mẹ mua tặng em một chiếc cặp sách màu xanh rất xinh xắn.',
        solutionExplanation: 'Câu A giới thiệu được đối tượng miêu tả (chiếc cặp sách) và thời điểm có nó, đóng vai trò câu mở đoạn.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv3-w2',
        grade: 3,
        subject: 'vietnamese',
        topicId: 'tv-g3-writing',
        format: 'multiple_choice',
        prompt: 'Khi viết đoạn văn, chữ cái đầu đoạn cần trình bày như thế nào?',
        options: ['A. Viết lùi vào một ô và viết hoa', 'B. Viết sát lề và viết chữ thường', 'C. Xuống dòng sau mỗi từ', 'D. Viết cách lề 5 ô'],
        correctAnswer: 'A. Viết lùi vào một ô và viết hoa',
        solutionExplanation: 'Quy chuẩn đoạn văn: câu đầu đoạn lùi vào 1 ô, viết hoa chữ cái đầu và cuối đoạn có dấu chấm kết thúc.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'tv3-w3',
        grade: 3,
        subject: 'vietnamese',
        topicId: 'tv-g3-writing',
        format: 'multiple_choice',
        prompt: 'Câu nào bày tỏ tình cảm phù hợp cho câu kết đoạn văn về thầy cô giáo?',
        options: [
          'A. Em luôn ghi nhớ công ơn dạy dỗ của thầy cô và hứa sẽ chăm ngoan học giỏi.',
          'B. Thầy giáo em mặc áo sơ mi màu trắng.',
          'C. Thầy cầm phấn viết lên bảng.',
          'D. Giờ học kết thúc lúc 11 giờ trưa.'
        ],
        correctAnswer: 'A. Em luôn ghi nhớ công ơn dạy dỗ của thầy cô và hứa sẽ chăm ngoan học giỏi.',
        solutionExplanation: 'Câu kết đoạn thường nêu tình cảm, cảm xúc hoặc lời hứa của bản thân.',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'tv3-w4',
        grade: 3,
        subject: 'vietnamese',
        topicId: 'tv-g3-writing',
        format: 'fill_blank',
        prompt: 'Một đoạn văn chuẩn mực thường gồm 3 phần: Mở đoạn, Thân đoạn và ... đoạn.',
        correctAnswer: 'Kết',
        solutionExplanation: 'Cấu trúc 3 phần: Mở đoạn - Thân đoạn - Kết đoạn.',
        cognitiveLevel: 'Thông hiểu'
      }
    ]
  },

  // ==========================================
  // LỚP 4 - TOÁN
  // ==========================================
  {
    id: 'math-g4-fraction',
    grade: 4,
    subject: 'math',
    title: 'Phân số và Các phép tính với Phân số',
    weekRange: 'Tuần 20 - 26',
    description: 'Khái niệm phân số, phân số bằng nhau, quy đồng mẫu số, cộng trừ nhân chia hai phân số.',
    iconName: 'Divide',
    badgeColor: 'emerald',
    learningGoals: ['Cộng trừ hai phân số khác mẫu số bằng cách quy đồng mẫu số', 'Không cộng mẫu số với mẫu số'],
    questions: [
      {
        id: 'm4-1',
        grade: 4,
        subject: 'math',
        topicId: 'math-g4-fraction',
        format: 'multiple_choice',
        prompt: 'Tính: 1/2 + 1/3 = ?',
        options: ['A. 2/5', 'B. 5/6', 'C. 1/6', 'D. 2/6'],
        correctAnswer: 'B. 5/6',
        solutionExplanation: 'Quy đồng mẫu số chung là 6: 1/2 = 3/6, 1/3 = 2/6. Do đó: 3/6 + 2/6 = (3+2)/6 = 5/6.',
        cognitiveLevel: 'Vận dụng',
        commonErrors: [
          {
            pattern: 'A. 2/5',
            category: 'Cộng tử với tử, mẫu với mẫu sai quy tắc',
            explanation: 'Em đã lấy tử cộng tử (1+1=2) và mẫu cộng mẫu (2+3=5). Đây là lỗi rất phổ biến khi mới học phân số!',
            hint: 'Hai phân số khác mẫu số KHÔNG được cộng trực tiếp! Em phải quy đồng về cùng mẫu số chung là 6 trước nhé!'
          }
        ]
      },
      {
        id: 'm4-2',
        grade: 4,
        subject: 'math',
        topicId: 'math-g4-fraction',
        format: 'multiple_choice',
        prompt: 'Bác Ba ở xã Vĩnh Điều có một mảnh ruộng. Bác gieo lúa mùa trên 3/5 diện tích ruộng, gieo hoa màu trên 1/5 diện tích. Hỏi bác Ba đã sử dụng bao nhiêu phần diện tích mảnh ruộng?',
        options: ['A. 4/5 diện tích', 'B. 4/10 diện tích', 'C. 2/5 diện tích', 'D. 1/5 diện tích'],
        correctAnswer: 'A. 4/5 diện tích',
        solutionExplanation: 'Cùng mẫu số 5, ta cộng hai tử số: 3/5 + 1/5 = 4/5 diện tích.',
        cognitiveLevel: 'Vận dụng',
        isAnGiangContext: true,
        commonErrors: [
          {
            pattern: 'B. 4/10 diện tích',
            category: 'Cộng cả mẫu số khi hai phân số cùng mẫu',
            explanation: 'Hai phân số đã cùng mẫu số là 5 thì ta GIỮ NGUYÊN mẫu số, chỉ cộng tử số thôi nha!',
            hint: 'Mẫu số 5 giữ nguyên: (3 + 1)/5 = 4/5.'
          }
        ]
      },
      {
        id: 'm4-3',
        grade: 4,
        subject: 'math',
        topicId: 'math-g4-fraction',
        format: 'fill_blank',
        prompt: 'Tính: 3/4 x 2/5 = ? (Nhập phân số dạng rút gọn a/b)',
        correctAnswer: '3/10',
        solutionExplanation: 'Nhân hai phân số: (3 x 2)/(4 x 5) = 6/20. Rút gọn chia cả tử và mẫu cho 2 được 3/10.',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'm4-4',
        grade: 4,
        subject: 'math',
        topicId: 'math-g4-fraction',
        format: 'multiple_choice',
        prompt: 'Phân số nào sau đây bằng phân số 3/4?',
        options: ['A. 9/12', 'B. 6/7', 'C. 4/3', 'D. 12/20'],
        correctAnswer: 'A. 9/12',
        solutionExplanation: 'Nhân cả tử và mẫu của 3/4 với 3 ta được 9/12.',
        cognitiveLevel: 'Thông hiểu'
      }
    ]
  },
  {
    id: 'math-g4-mean',
    grade: 4,
    subject: 'math',
    title: 'Tìm số Trung bình cộng & Bài toán Tổng - Hiệu',
    weekRange: 'Tuần 10 - 16',
    description: 'Quy tắc tìm số trung bình cộng của nhiều số; giải bài toán tìm hai số khi biết tổng và hiệu.',
    iconName: 'BarChart2',
    badgeColor: 'sky',
    learningGoals: ['Nắm vững công thức Số lớn = (Tổng + Hiệu) : 2, Số bé = (Tổng - Hiệu) : 2', 'Tính trung bình cộng chính xác'],
    questions: [
      {
        id: 'm4-m1',
        grade: 4,
        subject: 'math',
        topicId: 'math-g4-mean',
        format: 'fill_blank',
        prompt: 'Tìm số trung bình cộng của các số: 12, 18 và 30. (Nhập số)',
        correctAnswer: '20',
        solutionExplanation: 'Tổng = 12 + 18 + 30 = 60. Có 3 số nên Trung bình cộng = 60 : 3 = 20.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'm4-m2',
        grade: 4,
        subject: 'math',
        topicId: 'math-g4-mean',
        format: 'multiple_choice',
        prompt: 'Hai lớp 4A và 4B trường TH-THCS Vĩnh Điều gom được tất cả 120kg giấy vụn. Lớp 4A gom nhiều hơn lớp 4B là 20kg. Hỏi lớp 4A gom được bao nhiêu kg giấy vụn?',
        options: ['A. 70 kg', 'B. 50 kg', 'C. 60 kg', 'D. 80 kg'],
        correctAnswer: 'A. 70 kg',
        solutionExplanation: 'Số lớn (Lớp 4A) = (Tổng + Hiệu) : 2 = (120 + 20) : 2 = 140 : 2 = 70 (kg).',
        cognitiveLevel: 'Vận dụng',
        isAnGiangContext: true,
        commonErrors: [
          {
            pattern: 'B. 50 kg',
            category: 'Nhầm số lớn sang số bé',
            explanation: '50kg là số giấy vụn của lớp 4B (số bé). Đề bài đang hỏi lớp 4A (gom nhiều hơn)!',
            hint: 'Lớp 4A gom nhiều hơn nên là số lớn: (Tổng + Hiệu) : 2.'
          }
        ]
      },
      {
        id: 'm4-m3',
        grade: 4,
        subject: 'math',
        topicId: 'math-g4-mean',
        format: 'fill_blank',
        prompt: 'Muốn tìm số trung bình cộng của 4 số, ta tính tổng của 4 số đó rồi chia cho mấy?',
        correctAnswer: '4',
        solutionExplanation: 'Lấy tổng các số chia cho số lượng các số hạng (ở đây có 4 số nên chia cho 4).',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'm4-m4',
        grade: 4,
        subject: 'math',
        topicId: 'math-g4-mean',
        format: 'multiple_choice',
        prompt: 'Tổng hai số là 84, hiệu hai số là 16. Số bé là:',
        options: ['A. 34', 'B. 50', 'C. 30', 'D. 42'],
        correctAnswer: 'A. 34',
        solutionExplanation: 'Số bé = (84 - 16) : 2 = 68 : 2 = 34.',
        cognitiveLevel: 'Vận dụng'
      }
    ]
  },
  {
    id: 'math-g4-angles',
    grade: 4,
    subject: 'math',
    title: 'Góc nhọn, Góc tù, Góc bẹt & Hai đường thẳng song song',
    weekRange: 'Tuần 6 - 10',
    description: 'Nhận biết các loại góc so với góc vuông (dùng ê ke). Khái niệm vuông góc, song song.',
    iconName: 'Shapes',
    badgeColor: 'amber',
    learningGoals: ['Phân biệt góc nhọn (< 90°), góc vuông (90°), góc tù (> 90°), góc bẹt (180°)', 'Nhận biết 2 đường thẳng song song'],
    questions: [
      {
        id: 'm4-a1',
        grade: 4,
        subject: 'math',
        topicId: 'math-g4-angles',
        format: 'multiple_choice',
        prompt: 'Góc có số đo lớn hơn góc vuông nhưng nhỏ hơn góc bẹt được gọi là:',
        options: ['A. Góc tù', 'B. Góc nhọn', 'C. Góc vuông', 'D. Góc tròn'],
        correctAnswer: 'A. Góc tù',
        solutionExplanation: 'Theo định nghĩa hình học 4: Góc tù lớn hơn góc vuông và nhỏ hơn góc bẹt.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'm4-a2',
        grade: 4,
        subject: 'math',
        topicId: 'math-g4-angles',
        format: 'fill_blank',
        prompt: 'Góc bẹt bằng mấy lần góc vuông? (Nhập số)',
        correctAnswer: '2',
        solutionExplanation: 'Góc bẹt bằng 180°, bằng 2 lần góc vuông (90° x 2 = 180°).',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'm4-a3',
        grade: 4,
        subject: 'math',
        topicId: 'math-g4-angles',
        format: 'multiple_choice',
        prompt: 'Hai mép đối diện của một quyển sách giáo khoa Toán 4 là hình ảnh của hai đường thẳng:',
        options: ['A. Song song với nhau', 'B. Cắt nhau vuông góc', 'C. Trùng khít lên nhau', 'D. Chéo nhau'],
        correctAnswer: 'A. Song song với nhau',
        solutionExplanation: 'Hai mép đối diện của hình chữ nhật không bao giờ cắt nhau, đó là hai đường thẳng song song.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'm4-a4',
        grade: 4,
        subject: 'math',
        topicId: 'math-g4-angles',
        format: 'multiple_choice',
        prompt: 'Khi đồng hồ chỉ đúng 6 giờ, hai kim giờ và kim phút tạo thành góc gì?',
        options: ['A. Góc bẹt', 'B. Góc vuông', 'C. Góc nhọn', 'D. Góc tù'],
        correctAnswer: 'A. Góc bẹt',
        solutionExplanation: 'Lúc 6 giờ, kim dài chỉ số 12, kim ngắn chỉ số 6 tạo thành một đường thẳng (góc bẹt 180°).',
        cognitiveLevel: 'Vận dụng'
      }
    ]
  },

  // ==========================================
  // LỚP 4 - TIẾNG VIỆT
  // ==========================================
  {
    id: 'tv-g4-sentences',
    grade: 4,
    subject: 'vietnamese',
    title: 'Thành phần câu: Chủ ngữ, Vị ngữ & Trạng ngữ',
    weekRange: 'Tuần 18 - 24',
    description: 'Xác định nòng cốt câu (CN - VN), nhận biết các loại trạng ngữ chỉ nơi chốn, thời gian, nguyên nhân.',
    iconName: 'PenTool',
    badgeColor: 'teal',
    learningGoals: ['Xác định chính xác Chủ ngữ và Vị ngữ', 'Phân biệt Trạng ngữ chỉ nơi chốn (Ở đâu?), thời gian (Bao giờ?)'],
    readingPassage: {
      title: 'Lễ hội Đua bò Bảy Núi - An Giang',
      content: 'Hằng năm, vào dịp Tết Đôn-ta của đồng bào Khmer, vùng Bảy Núi An Giang lại rộn rã bước chân du khách gần xa về trẩy hội đua bò. Dưới làn nước bùn bắn tung tóe, từng đôi bò lực lưỡng căng mình phi nước đại trong tiếng reo hò, cổ vũ náo nhiệt vang động cả một góc trời quê hương.',
      authorOrOrigin: 'Nét đẹp văn hóa An Giang',
      vocabularyNotes: [
        { word: 'Tết Đôn-ta', meaning: 'Lễ cúng ông bà truyền thống đầy ý nghĩa nhân văn của đồng bào Khmer Nam Bộ' },
        { word: 'Phi nước đại', meaning: 'Chạy rất nhanh với tốc độ tối đa' }
      ]
    },
    questions: [
      {
        id: 'tv4-1',
        grade: 4,
        subject: 'vietnamese',
        topicId: 'tv-g4-sentences',
        format: 'multiple_choice',
        prompt: 'Trong câu: "Dưới làn nước bùn, từng đôi bò lực lưỡng căng mình phi nước đại.", bộ phận nào là TRẠNG NGỮ?',
        options: [
          'A. Dưới làn nước bùn',
          'B. từng đôi bò lực lưỡng',
          'C. căng mình phi nước đại',
          'D. làn nước bùn'
        ],
        correctAnswer: 'A. Dưới làn nước bùn',
        solutionExplanation: '"Dưới làn nước bùn" trả lời cho câu hỏi Ở đâu?, ngăn cách với nòng cốt câu bằng dấu phẩy, đóng vai trò là Trạng ngữ chỉ nơi chốn.',
        cognitiveLevel: 'Thông hiểu',
        isAnGiangContext: true,
        commonErrors: [
          {
            pattern: 'B. từng đôi bò lực lưỡng',
            category: 'Nhầm Chủ ngữ thành Trạng ngữ',
            explanation: '"Từng đôi bò lực lưỡng" trả lời câu hỏi Ai/Con gì? nên đó là CHỦ NGỮ, không phải trạng ngữ.',
            hint: 'Trạng ngữ đứng trước dấu phẩy và bổ sung thông tin nơi chốn, thời gian!'
          }
        ]
      },
      {
        id: 'tv4-2',
        grade: 4,
        subject: 'vietnamese',
        topicId: 'tv-g4-sentences',
        format: 'multiple_choice',
        prompt: 'Chủ ngữ trong câu: "Hương hoa tràm thoang thoảng bay khắp cánh rừng." là:',
        options: ['A. Hương hoa tràm', 'B. Hương hoa', 'C. bay khắp cánh rừng', 'D. cánh rừng'],
        correctAnswer: 'A. Hương hoa tràm',
        solutionExplanation: '"Hương hoa tràm" trả lời cho câu hỏi Cái gì? đóng vai trò làm Chủ ngữ.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv4-3',
        grade: 4,
        subject: 'vietnamese',
        topicId: 'tv-g4-sentences',
        format: 'fill_blank',
        prompt: 'Trạng ngữ "Hằng năm, vào dịp Tết Đôn-ta" là trạng ngữ chỉ ... (nhập 1 từ: nơi chốn / thời gian / mục đích)',
        correctAnswer: 'thời gian',
        solutionExplanation: 'Cụm từ chỉ mốc thời gian diễn ra sự việc (trả lời câu hỏi Khi nào?).',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'tv4-4',
        grade: 4,
        subject: 'vietnamese',
        topicId: 'tv-g4-sentences',
        format: 'multiple_choice',
        prompt: 'Thành phần bắt buộc phải có để tạo thành một câu đơn hoàn chỉnh là:',
        options: ['A. Chủ ngữ và Vị ngữ', 'B. Trạng ngữ và Vị ngữ', 'C. Chỉ cần Trạng ngữ', 'D. Chỉ cần Chủ ngữ'],
        correctAnswer: 'A. Chủ ngữ và Vị ngữ',
        solutionExplanation: 'Chủ ngữ và Vị ngữ là nòng cốt câu bắt buộc trong câu đơn tiếng Việt.',
        cognitiveLevel: 'Nhận biết'
      }
    ]
  },
  {
    id: 'tv-g4-vocab',
    grade: 4,
    subject: 'vietnamese',
    title: 'Từ ghép và Từ láy',
    weekRange: 'Tuần 5 - 10',
    description: 'Phân biệt từ đơn, từ phức; trong từ phức phân biệt từ ghép (đẳng lập, chính phụ) và từ láy.',
    iconName: 'Sparkles',
    badgeColor: 'rose',
    learningGoals: ['Phân biệt chuẩn xác giữa từ ghép và từ láy', 'Nhận diện các kiểu quan hệ âm và nghĩa'],
    questions: [
      {
        id: 'tv4-v1',
        grade: 4,
        subject: 'vietnamese',
        topicId: 'tv-g4-vocab',
        format: 'multiple_choice',
        prompt: 'Từ nào sau đây là TỪ LÁY?',
        options: ['A. Róc rách', 'B. Nhà cửa', 'C. Xe đạp', 'D. Đất nước'],
        correctAnswer: 'A. Róc rách',
        solutionExplanation: '"Róc rách" có sự lặp lại phụ âm đầu "r" và gợi tả âm thanh tiếng nước chảy, đó là từ láy âm.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv4-v2',
        grade: 4,
        subject: 'vietnamese',
        topicId: 'tv-g4-vocab',
        format: 'multiple_choice',
        prompt: 'Từ "chùa chiền" là từ loại nào?',
        options: ['A. Từ ghép', 'B. Từ láy', 'C. Từ đơn', 'D. Từ mượn tiếng Anh'],
        correctAnswer: 'A. Từ ghép',
        solutionExplanation: 'Cả "chùa" và "chiền" (tiếng Việt cổ) đều có nghĩa chỉ nơi thờ cúng, nên "chùa chiền" là từ ghép đẳng lập, không phải từ láy.',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'tv4-v3',
        grade: 4,
        subject: 'vietnamese',
        topicId: 'tv-g4-vocab',
        format: 'fill_blank',
        prompt: 'Từ phức gồm có 2 loại chính: Từ ghép và từ ...',
        correctAnswer: 'láy',
        solutionExplanation: 'Từ phức chia thành 2 loại: từ ghép và từ láy.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'tv4-v4',
        grade: 4,
        subject: 'vietnamese',
        topicId: 'tv-g4-vocab',
        format: 'multiple_choice',
        prompt: 'Nhóm từ nào dưới đây TOÀN LÀ TỪ LÁY?',
        options: [
          'A. Xanh xao, long lanh, rì rào',
          'B. Núi non, nhà cửa, ruộng đồng',
          'C. Học sinh, giáo viên, lớp học',
          'D. Cây cối, chim chóc, sách vở'
        ],
        correctAnswer: 'A. Xanh xao, long lanh, rì rào',
        solutionExplanation: 'Cả 3 từ ở đáp án A đều có sự hòa phối ngữ âm gợi hình, gợi cảm.',
        cognitiveLevel: 'Thông hiểu'
      }
    ]
  },
  {
    id: 'tv-g4-description',
    grade: 4,
    subject: 'vietnamese',
    title: 'Tập làm văn: Miêu tả Cây cối & Con vật',
    weekRange: 'Tuần 14 - 20',
    description: 'Quan sát chi tiết, lập dàn ý và viết bài văn miêu tả có hình ảnh sinh động.',
    iconName: 'BookOpen',
    badgeColor: 'amber',
    learningGoals: ['Quan sát theo trình tự hợp lý (tổng thể đến chi tiết)', 'Sử dụng các giác quan khi miêu tả'],
    questions: [
      {
        id: 'tv4-d1',
        grade: 4,
        subject: 'vietnamese',
        topicId: 'tv-g4-description',
        format: 'multiple_choice',
        prompt: 'Trình tự miêu tả cây cối thường được thực hiện như thế nào?',
        options: [
          'A. Tả bao quát rồi đến tả chi tiết từng bộ phận (hoặc theo từng thời kỳ phát triển)',
          'B. Chỉ tả gốc cây rồi kết luận',
          'C. Tả từ trong ra ngoài không theo trật tự nào',
          'D. Chỉ tả lá cây khi rụng'
        ],
        correctAnswer: 'A. Tả bao quát rồi đến tả chi tiết từng bộ phận (hoặc theo từng thời kỳ phát triển)',
        solutionExplanation: 'Bài văn miêu tả cây cối chuẩn thường đi từ bao quát đến cụ thể các bộ phận (gốc, thân, cành, lá, hoa, quả).',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv4-d2',
        grade: 4,
        subject: 'vietnamese',
        topicId: 'tv-g4-description',
        format: 'multiple_choice',
        prompt: 'Khi miêu tả cây thốt nốt ở vùng Bảy Núi An Giang, chi tiết nào ĐẶC TRƯNG nhất?',
        options: [
          'A. Thân thẳng tắp như cột chống trời, tán lá xòe tròn như chiếc quạt khổng lồ',
          'B. Thân bò lan sát mặt đất đầy gai nhọn',
          'C. Cành khẳng khiu rụng hết lá vào mùa đông',
          'D. Lá hình kim mọc thành từng búi'
        ],
        correctAnswer: 'A. Thân thẳng tắp như cột chống trời, tán lá xòe tròn như chiếc quạt khổng lồ',
        solutionExplanation: 'Cây thốt nốt có đặc trưng thân cây thẳng vút cao, tán lá xòe tròn rộng đặc trưng của vùng đồng bằng Thất Sơn.',
        cognitiveLevel: 'Vận dụng',
        isAnGiangContext: true
      },
      {
        id: 'tv4-d3',
        grade: 4,
        subject: 'vietnamese',
        topicId: 'tv-g4-description',
        format: 'fill_blank',
        prompt: 'Bài văn miêu tả hoàn chỉnh gồm 3 phần: Mở bài, Thân bài và ... bài.',
        correctAnswer: 'Kết',
        solutionExplanation: 'Bố cục 3 phần: Mở bài, Thân bài, Kết bài.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'tv4-d4',
        grade: 4,
        subject: 'vietnamese',
        topicId: 'tv-g4-description',
        format: 'multiple_choice',
        prompt: 'Trong bài văn tả con vật, phần nào dưới đây thuộc phần THÂN BÀI?',
        options: [
          'A. Tả ngoại hình và thói quen sinh hoạt của con vật',
          'B. Giới thiệu tên con vật và ai nuôi nó',
          'C. Bày tỏ tình cảm gắn bó của em với con vật',
          'D. Lời hứa chăm sóc con vật'
        ],
        correctAnswer: 'A. Tả ngoại hình và thói quen sinh hoạt của con vật',
        solutionExplanation: 'Thân bài tập trung tả chi tiết hình dáng và hoạt động đặc trưng của con vật.',
        cognitiveLevel: 'Thông hiểu'
      }
    ]
  },

  // ==========================================
  // LỚP 5 - TOÁN
  // ==========================================
  {
    id: 'math-g5-decimal',
    grade: 5,
    subject: 'math',
    title: 'Số thập phân & Các phép tính với Số thập phân',
    weekRange: 'Tuần 7 - 15',
    description: 'Hàng của số thập phân, cộng trừ nhân chia số thập phân, nhân chia nhẩm với 10, 100, 0.1, 0.01.',
    iconName: 'Calculator',
    badgeColor: 'emerald',
    learningGoals: ['Cộng trừ nhân chia số thập phân thành thạo', 'Quy tắc lùi dấu phẩy khi nhân chia nhẩm'],
    questions: [
      {
        id: 'm5-1',
        grade: 5,
        subject: 'math',
        topicId: 'math-g5-decimal',
        format: 'multiple_choice',
        prompt: 'Tính nhẩm: 2,5 x 10 = ?',
        options: ['A. 25', 'B. 2,50', 'C. 250', 'D. 0,25'],
        correctAnswer: 'A. 25',
        solutionExplanation: 'Muốn nhân một số thập phân với 10, ta chỉ việc chuyển dấu phẩy sang bên phải một chữ số: 2,5 x 10 = 25.',
        cognitiveLevel: 'Thông hiểu',
        commonErrors: [
          {
            pattern: 'B. 2,50',
            category: 'Thêm số 0 vào sau đuôi như số tự nhiên',
            explanation: '2,50 vẫn chính là 2,5! Em không thể chỉ việc thêm số 0 vào đuôi khi nhân số thập phân với 10.',
            hint: 'Quy tắc vàng: Nhân với 10 thì DỜI DẤU PHẨY sang PHẢI 1 chữ số nhé!'
          },
          {
            pattern: 'D. 0,25',
            category: 'Nhầm lẫn chiều chuyển dấu phẩy giữa phép nhân và phép chia',
            explanation: 'Dời dấu phẩy sang trái là PHÉP CHIA cho 10, không phải phép nhân!',
            hint: 'Nhân với 10 làm số lớn lên (dời dấu phẩy sang phải). Chia cho 10 làm số bé đi (dời sang trái).'
          }
        ]
      },
      {
        id: 'm5-2',
        grade: 5,
        subject: 'math',
        topicId: 'math-g5-decimal',
        format: 'fill_blank',
        prompt: 'Đặt tính rồi tính: 45,6 + 18,75 = ? (Nhập số thập phân dùng dấu phẩy)',
        correctAnswer: '64,35',
        solutionExplanation: 'Viết các chữ số ở cùng một hàng thẳng cột với nhau (dấu phẩy thẳng dấu phẩy): 45,60 + 18,75 = 64,35.',
        cognitiveLevel: 'Vận dụng',
        commonErrors: [
          {
            pattern: '63,35',
            category: 'Quên số nhớ khi cộng hàng phần mười',
            explanation: '6 + 7 = 13 (viết 3 nhớ 1), em quên cộng 1 sang hàng đơn vị.',
            hint: 'Hãy nhớ cộng 1 đơn vị nhớ sang hàng đơn vị: 5 + 8 = 13 thêm 1 là 14!'
          }
        ]
      },
      {
        id: 'm5-3',
        grade: 5,
        subject: 'math',
        topicId: 'math-g5-decimal',
        format: 'multiple_choice',
        prompt: 'Chữ số 8 trong số thập phân 14,385 thuộc hàng nào?',
        options: ['A. Hàng phần trăm', 'B. Hàng phần mười', 'C. Hàng phần nghìn', 'D. Hàng chục'],
        correctAnswer: 'A. Hàng phần trăm',
        solutionExplanation: 'Sau dấu phẩy: chữ số 3 là hàng phần mười, chữ số 8 là hàng phần trăm, chữ số 5 là hàng phần nghìn.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'm5-4',
        grade: 5,
        subject: 'math',
        topicId: 'math-g5-decimal',
        format: 'fill_blank',
        prompt: 'Tính: 15,6 : 3 = ? (Nhập số thập phân có dấu phẩy)',
        correctAnswer: '5,2',
        solutionExplanation: '15 chia 3 được 5; đánh dấu phẩy vào thương; 6 chia 3 được 2. Kết quả 5,2.',
        cognitiveLevel: 'Thông hiểu'
      }
    ]
  },
  {
    id: 'math-g5-percentage',
    grade: 5,
    subject: 'math',
    title: 'Tỉ số phần trăm & 3 Bài toán cơ bản về Tỉ số phần trăm',
    weekRange: 'Tuần 16 - 20',
    description: 'Tìm tỉ số phần trăm của hai số, tìm giá trị phần trăm của một số, tìm một số khi biết giá trị phần trăm.',
    iconName: 'Divide',
    badgeColor: 'sky',
    learningGoals: ['Thành thạo tìm tỉ số % của 2 số', 'Giải toán thực tế tính tiền lãi, giảm giá, năng suất lúa vụ đông xuân'],
    questions: [
      {
        id: 'm5-p1',
        grade: 5,
        subject: 'math',
        topicId: 'math-g5-percentage',
        format: 'multiple_choice',
        prompt: 'Trường TH-THCS Vĩnh Điều có 400 học sinh, trong đó có 220 học sinh nữ. Hỏi học sinh nữ chiếm bao nhiêu phần trăm số học sinh toàn trường?',
        options: ['A. 55%', 'B. 45%', 'C. 50%', 'D. 60%'],
        correctAnswer: 'A. 55%',
        solutionExplanation: 'Tỉ số phần trăm học sinh nữ: (220 : 400) x 100 = 0,55 x 100 = 55%.',
        cognitiveLevel: 'Vận dụng',
        isAnGiangContext: true
      },
      {
        id: 'm5-p2',
        grade: 5,
        subject: 'math',
        topicId: 'math-g5-percentage',
        format: 'fill_blank',
        prompt: 'Tìm 20% của 150 kg đường thốt nốt. (Nhập số kg)',
        correctAnswer: '30',
        solutionExplanation: '150 x 20 : 100 = 30 kg.',
        cognitiveLevel: 'Thông hiểu',
        isAnGiangContext: true
      },
      {
        id: 'm5-p3',
        grade: 5,
        subject: 'math',
        topicId: 'math-g5-percentage',
        format: 'multiple_choice',
        prompt: 'Phân số 3/4 được viết dưới dạng tỉ số phần trăm là:',
        options: ['A. 75%', 'B. 34%', 'C. 80%', 'D. 25%'],
        correctAnswer: 'A. 75%',
        solutionExplanation: '3/4 = 0,75 = 75%.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'm5-p4',
        grade: 5,
        subject: 'math',
        topicId: 'math-g5-percentage',
        format: 'fill_blank',
        prompt: 'Biết 25% của một số là 50. Số đó là bao nhiêu? (Nhập số)',
        correctAnswer: '200',
        solutionExplanation: 'Số đó là: 50 : 25 x 100 = 200.',
        cognitiveLevel: 'Vận dụng'
      }
    ]
  },
  {
    id: 'math-g5-motion',
    grade: 5,
    subject: 'math',
    title: 'Toán Chuyển động đều (Vận tốc, Quãng đường, Thời gian)',
    weekRange: 'Tuần 27 - 31',
    description: 'Mối quan hệ s = v x t; v = s : t; t = s : v; bài toán hai xe chuyển động ngược chiều, cùng chiều.',
    iconName: 'Shapes',
    badgeColor: 'amber',
    learningGoals: ['Đổi đúng đơn vị đo thời gian (phút sang giờ)', 'Áp dụng công thức chuyển động ngược chiều gặp nhau'],
    questions: [
      {
        id: 'm5-mo1',
        grade: 5,
        subject: 'math',
        topicId: 'math-g5-motion',
        format: 'multiple_choice',
        prompt: 'Một ca nô chạy trên sông Tiền từ Châu Đốc đến Tân Châu quãng đường 36 km hết 1,2 giờ. Vận tốc của ca nô là:',
        options: ['A. 30 km/giờ', 'B. 36 km/giờ', 'C. 43,2 km/giờ', 'D. 25 km/giờ'],
        correctAnswer: 'A. 30 km/giờ',
        solutionExplanation: 'Vận tốc v = s : t = 36 : 1,2 = 30 (km/giờ).',
        cognitiveLevel: 'Vận dụng',
        isAnGiangContext: true
      },
      {
        id: 'm5-mo2',
        grade: 5,
        subject: 'math',
        topicId: 'math-g5-motion',
        format: 'fill_blank',
        prompt: 'Một người đi xe máy với vận tốc 40 km/giờ trong thời gian 2 giờ 30 phút. Quãng đường người đó đi được là bao nhiêu km? (Nhập số)',
        correctAnswer: '100',
        solutionExplanation: 'Đổi 2 giờ 30 phút = 2,5 giờ. Quãng đường s = 40 x 2,5 = 100 km.',
        cognitiveLevel: 'Vận dụng',
        commonErrors: [
          {
            pattern: '92',
            category: 'Lấy vận tốc nhân thẳng với số phút chưa quy đổi',
            explanation: '2 giờ 30 phút phải đổi sang số thập phân là 2,5 giờ trước khi nhân!',
            hint: '30 phút = 30/60 = 0,5 giờ. Vậy 2 giờ 30 phút = 2,5 giờ.'
          }
        ]
      },
      {
        id: 'm5-mo3',
        grade: 5,
        subject: 'math',
        topicId: 'math-g5-motion',
        format: 'multiple_choice',
        prompt: 'Công thức tính quãng đường khi biết vận tốc (v) và thời gian (t) là:',
        options: ['A. s = v x t', 'B. s = v : t', 'C. s = t : v', 'D. s = v + t'],
        correctAnswer: 'A. s = v x t',
        solutionExplanation: 'Quãng đường bằng vận tốc nhân với thời gian: s = v x t.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'm5-mo4',
        grade: 5,
        subject: 'math',
        topicId: 'math-g5-motion',
        format: 'fill_blank',
        prompt: 'Đổi: 1 giờ 15 phút = ... giờ (nhập số thập phân dùng dấu phẩy)',
        correctAnswer: '1,25',
        solutionExplanation: '15 phút = 15/60 = 0,25 giờ. Vậy 1 giờ 15 phút = 1,25 giờ.',
        cognitiveLevel: 'Thông hiểu'
      }
    ]
  },

  // ==========================================
  // LỚP 5 - TIẾNG VIỆT
  // ==========================================
  {
    id: 'tv-g5-polysemy',
    grade: 5,
    subject: 'vietnamese',
    title: 'Từ đồng nghĩa, Từ trái nghĩa & Từ nhiều nghĩa',
    weekRange: 'Tuần 3 - 9',
    description: 'Phân biệt sắc thái biểu cảm của từ đồng nghĩa; phân biệt từ đồng âm và từ nhiều nghĩa.',
    iconName: 'Sparkles',
    badgeColor: 'teal',
    learningGoals: ['Phân biệt từ nhiều nghĩa (có mối liên hệ chuyển nghĩa) và từ đồng âm (ngẫu nhiên trùng âm)', 'Chọn từ đồng nghĩa thích hợp với ngữ cảnh'],
    readingPassage: {
      title: 'Hạt ngọc trời Ba Chúc',
      content: 'Cánh đồng Ba Chúc trải dài dưới chân dãy Thất Sơn hùng vĩ. Những hạt gạo nàng nhen trắng trong, thơm dẻo là kết tinh từ mồ hôi, giọt nước mắt và tình yêu đất đai cháy bỏng của những người nông dân chân lấm tay bùn. Hạt gạo nuôi lớn bao thế hệ người con An Giang trưởng thành, đi dựng xây non sông gấm vóc.',
      authorOrOrigin: 'Ký sự miền Tây Nam Bộ',
      vocabularyNotes: [
        { word: 'Gạo nàng nhen', meaning: 'Giống lúa mùa đặc sản nổi tiếng thơm ngon của đồng bào Khmer Bảy Núi' },
        { word: 'Non sông gấm vóc', meaning: 'Hình ảnh ẩn dụ ngợi ca đất nước Việt Nam tươi đẹp như gấm lụa quý' }
      ]
    },
    questions: [
      {
        id: 'tv5-1',
        grade: 5,
        subject: 'vietnamese',
        topicId: 'tv-g5-polysemy',
        format: 'multiple_choice',
        prompt: 'Từ "chân" trong "chân dãy Thất Sơn" được dùng theo nghĩa nào?',
        options: ['A. Nghĩa chuyển', 'B. Nghĩa gốc', 'C. Từ đồng âm', 'D. Biểu tượng'],
        correctAnswer: 'A. Nghĩa chuyển',
        solutionExplanation: 'Nghĩa gốc của "chân" là bộ phận nâng đỡ cơ thể người/động vật. "Chân núi/chân dãy Thất Sơn" là phần dưới cùng tiếp giáp với mặt đất, phỏng theo nghĩa gốc nên là NGHĨA CHUYỂN.',
        cognitiveLevel: 'Thông hiểu',
        isAnGiangContext: true,
        commonErrors: [
          {
            pattern: 'B. Nghĩa gốc',
            category: 'Hiểu sai khái niệm nghĩa gốc và nghĩa chuyển',
            explanation: 'Dãy núi không phải sinh vật sống để có đôi chân thật. Đây là biện pháp chuyển nghĩa theo phương thức ẩn dụ!',
            hint: 'Nghĩa gốc chỉ bộ phận người hoặc động vật. Ở đây chỉ vị trí chân núi là nghĩa chuyển!'
          }
        ]
      },
      {
        id: 'tv5-2',
        grade: 5,
        subject: 'vietnamese',
        topicId: 'tv-g5-polysemy',
        format: 'multiple_choice',
        prompt: 'Cặp từ nào dưới đây là cặp TỪ ĐỒNG ÂM?',
        options: [
          'A. Con ruồi đậu trên mâm xôi đậu',
          'B. Cánh đồng lúa chín - Suy nghĩ chín chắn',
          'C. Ăn cơm - Ăn ảnh',
          'D. Đi bộ - Đi nghỉ mát'
        ],
        correctAnswer: 'A. Con ruồi đậu trên mâm xôi đậu',
        solutionExplanation: '"Đậu" (hành động dừng lại của chim/ruồi) và "đậu" (loại hạt đậu) là hai từ hoàn toàn khác nhau về nghĩa, chỉ ngẫu nhiên phát âm giống nhau. Đó là từ đồng âm.',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'tv5-3',
        grade: 5,
        subject: 'vietnamese',
        topicId: 'tv-g5-polysemy',
        format: 'fill_blank',
        prompt: 'Tìm từ trái nghĩa với từ "dũng cảm" (nhập 1 từ):',
        correctAnswer: 'hèn nhát',
        solutionExplanation: 'Trái nghĩa với dũng cảm là hèn nhát (hoặc nhút nhát).',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'tv5-4',
        grade: 5,
        subject: 'vietnamese',
        topicId: 'tv-g5-polysemy',
        format: 'multiple_choice',
        prompt: 'Từ đồng nghĩa nào thể hiện sự hy sinh cao cả vì Tổ quốc của các anh hùng liệt sĩ?',
        options: ['A. Hy sinh', 'B. Chết', 'C. Ngoẻo', 'D. Mất mạng'],
        correctAnswer: 'A. Hy sinh',
        solutionExplanation: 'Từ "hy sinh" mang sắc thái trang trọng, tôn kính và biết ơn sâu sắc đối với người đã cống hiến trọn đời cho quê hương đất nước.',
        cognitiveLevel: 'Thông hiểu'
      }
    ]
  },
  {
    id: 'tv-g5-cohesion',
    grade: 5,
    subject: 'vietnamese',
    title: 'Liên kết câu trong đoạn văn (Phép lặp, Phép thế, Từ nối)',
    weekRange: 'Tuần 16 - 22',
    description: 'Cách nối các câu trong đoạn văn bằng cách thay thế từ ngữ, lặp từ ngữ, hoặc dùng từ ngữ nối.',
    iconName: 'BookOpen',
    badgeColor: 'sky',
    learningGoals: ['Nhận biết phép thay thế từ ngữ và đại từ liên kết', 'Khắc phục lỗi câu văn rời rạc trong bài tập làm văn'],
    questions: [
      {
        id: 'tv5-c1',
        grade: 5,
        subject: 'vietnamese',
        topicId: 'tv-g5-cohesion',
        format: 'multiple_choice',
        prompt: 'Đoạn văn: "Bác Hồ là vị lãnh tụ muôn vàn kính yêu của dân tộc ta. Người đã cống hiến trọn cuộc đời vì độc lập tự do của Tổ quốc." liên kết bằng phép nào?',
        options: ['A. Phép thay thế từ ngữ', 'B. Phép lặp từ ngữ', 'C. Phép nối bằng quan hệ từ', 'D. Phép đối lập'],
        correctAnswer: 'A. Phép thay thế từ ngữ',
        solutionExplanation: 'Từ "Người" ở câu thứ hai thay thế cho "Bác Hồ" ở câu thứ nhất để tránh lặp từ, đó là phép thay thế.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv5-c2',
        grade: 5,
        subject: 'vietnamese',
        topicId: 'tv-g5-cohesion',
        format: 'multiple_choice',
        prompt: 'Cặp quan hệ từ "Mặc dù ... nhưng ..." biểu thị mối quan hệ gì giữa hai vế câu ghép?',
        options: ['A. Tương phản', 'B. Nguyên nhân - kết quả', 'C. Điều kiện - kết quả', 'D. Tăng tiến'],
        correctAnswer: 'A. Tương phản',
        solutionExplanation: '"Mặc dù ... nhưng ..." diễn tả hai sự việc có tính chất trái ngược, tương phản nhau.',
        cognitiveLevel: 'Nhận biết'
      },
      {
        id: 'tv5-c3',
        grade: 5,
        subject: 'vietnamese',
        topicId: 'tv-g5-cohesion',
        format: 'fill_blank',
        prompt: 'Điền quan hệ từ thích hợp vào chỗ trống: "Vì trời mưa to ... đường làng Vĩnh Điều trở nên trơn trượt."',
        correctAnswer: 'nên',
        solutionExplanation: 'Cặp quan hệ từ biểu thị nguyên nhân - kết quả: "Vì ... nên ...".',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'tv5-c4',
        grade: 5,
        subject: 'vietnamese',
        topicId: 'tv-g5-cohesion',
        format: 'multiple_choice',
        prompt: 'Để nối các câu văn, từ nào dưới đây là TỪ NGỮ NỐI?',
        options: ['A. Tuy nhiên, ngoài ra, hơn nữa', 'B. Bàn ghế, trường học', 'C. Chạy nhảy, vui đùa', 'D. Xanh tươi, vàng rực'],
        correctAnswer: 'A. Tuy nhiên, ngoài ra, hơn nữa',
        solutionExplanation: 'Các từ ngữ "tuy nhiên", "ngoài ra", "hơn nữa" là từ ngữ chuyển tiếp, liên kết giữa các câu.',
        cognitiveLevel: 'Nhận biết'
      }
    ]
  },
  {
    id: 'tv-g5-essay',
    grade: 5,
    subject: 'vietnamese',
    title: 'Tập làm văn: Tả người & Viết bài văn hoàn chỉnh',
    weekRange: 'Tuần 20 - 28',
    description: 'Miêu tả chân dung, ánh mắt, nụ cười, giọng nói, hoạt động và tính tình của người thân hoặc thầy cô.',
    iconName: 'PenTool',
    badgeColor: 'amber',
    learningGoals: ['Khắc họa tính tình qua hành động cụ thể', 'Bộc lộ cảm xúc sâu sắc và tự nhiên'],
    questions: [
      {
        id: 'tv5-e1',
        grade: 5,
        subject: 'vietnamese',
        topicId: 'tv-g5-essay',
        format: 'multiple_choice',
        prompt: 'Khi tả ngoại hình một người cao tuổi (ông hoặc bà), chi tiết nào gợi cảm xúc chân thực nhất?',
        options: [
          'A. Đôi bàn tay gầy gộc, nổi rõ từng đường gân xanh in dấu bao năm tháng nhọc nhằn',
          'B. Bộ quần áo mới tinh mua ở siêu thị',
          'C. Chiếc đồng hồ điện tử đeo trên tay',
          'D. Bước đi nhảy chân sáo như học sinh mầm non'
        ],
        correctAnswer: 'A. Đôi bàn tay gầy gộc, nổi rõ từng đường gân xanh in dấu bao năm tháng nhọc nhằn',
        solutionExplanation: 'Đôi bàn tay in dấu thời gian là chi tiết tiêu biểu, giàu tính nhân văn và gợi lòng hiếu thảo.',
        cognitiveLevel: 'Vận dụng'
      },
      {
        id: 'tv5-e2',
        grade: 5,
        subject: 'vietnamese',
        topicId: 'tv-g5-essay',
        format: 'multiple_choice',
        prompt: 'Phần kết bài mở rộng trong bài văn tả người có đặc điểm gì?',
        options: [
          'A. Không chỉ nêu tình cảm trực tiếp mà còn liên hệ đến bài học cuộc sống, suy nghĩ và ước mơ tương lai',
          'B. Chỉ viết đúng một câu "Em rất yêu người đó."',
          'C. Tả lại quần áo một lần nữa',
          'D. Nhắc lại họ tên người được tả'
        ],
        correctAnswer: 'A. Không chỉ nêu tình cảm trực tiếp mà còn liên hệ đến bài học cuộc sống, suy nghĩ và ước mơ tương lai',
        solutionExplanation: 'Kết bài mở rộng mở ra những liên tưởng, tình cảm sâu xa và hành động thiết thực của người viết.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv5-e3',
        grade: 5,
        subject: 'vietnamese',
        topicId: 'tv-g5-essay',
        format: 'fill_blank',
        prompt: 'Trong bài văn tả người, hai phần chính cần khắc họa ở thân bài là Tả ngoại hình và Tả ... (hoạt động/tính tình)',
        correctAnswer: 'hoạt động',
        solutionExplanation: 'Tả ngoại hình và tả hoạt động (tính tình) là hai trọng tâm của thân bài.',
        cognitiveLevel: 'Thông hiểu'
      },
      {
        id: 'tv5-e4',
        grade: 5,
        subject: 'vietnamese',
        topicId: 'tv-g5-essay',
        format: 'multiple_choice',
        prompt: 'Cách mở bài gián tiếp trong bài văn tả cô giáo thường bắt đầu bằng cách:',
        options: [
          'A. Dẫn dắt từ một câu thơ, bài hát hoặc kỷ niệm ấm áp về mái trường rồi mới giới thiệu cô giáo',
          'B. Nói ngay: "Cô giáo em tên là Lan."',
          'C. Tả ngay đôi mắt của cô',
          'D. Nói cô mặc áo dài màu hồng'
        ],
        correctAnswer: 'A. Dẫn dắt từ một câu thơ, bài hát hoặc kỷ niệm ấm áp về mái trường rồi mới giới thiệu cô giáo',
        solutionExplanation: 'Mở bài gián tiếp tạo sự hấp dẫn, lôi cuốn người đọc bằng cách dẫn dắt khéo léo.',
        cognitiveLevel: 'Vận dụng'
      }
    ]
  }
];
