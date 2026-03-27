export interface Course {
  id: string;
  code: string;
  name: string;
  documentCount: number;
}

export interface Document {
  id: string;
  title: string;
  subject: string;
  thumbnailUrl?: string; // We'll use placaholders/colors
  likes: string;
}

export const MOCK_COURSES: Course[] = [
  { id: '1', code: 'CPL', name: 'Công pháp quốc tế', documentCount: 12 },
  { id: '2', code: 'VMO', name: 'Kinh tế vĩ mô', documentCount: 45 },
  { id: '3', code: 'NNA', name: 'Nguyên lý kế toán', documentCount: 20 },
  { id: '4', code: 'TC', name: 'Tài chính doanh nghiệp', documentCount: 10 },
  { id: '5', code: 'TAC', name: 'Tiếng Anh chuyên ngành', documentCount: 8 },
  { id: '6', code: 'THDC', name: 'Tin học đại cương', documentCount: 150 },
  { id: '7', code: 'KTV', name: 'Kinh tế vi mô', documentCount: 30 },
  { id: '8', code: 'LLCT', name: 'Lý luận chính trị', documentCount: 100 },
  { id: '9', code: 'KTCT', name: 'Kinh tế chính trị', documentCount: 50 },
  { id: '10', code: 'PLDC', name: 'Pháp luật đại cương', documentCount: 200 },
  { id: '11', code: 'XHH', name: 'Xã hội học', documentCount: 10 },
  { id: '12', code: 'TK', name: 'Thống kê', documentCount: 22 },
];

export const MOCK_DOCUMENTS: Document[] = [
  { id: '1', title: 'Giáo trình Công pháp quốc tế', subject: 'Công pháp quốc tế', likes: '100% (5)' },
  { id: '2', title: 'Bài tập nhóm Kinh tế vĩ mô (có lời giải)', subject: 'Kinh tế vĩ mô', likes: '95% (12)' },
  { id: '3', title: 'Tổng hợp công thức Nguyên lý kế toán', subject: 'Nguyên lý kế toán', likes: '98% (20)' },
  { id: '4', title: 'Đề cương ôn tập Tài chính doanh nghiệp', subject: 'Tài chính DN', likes: '100% (8)' },
  { id: '5', title: 'Từ vựng Tiếng Anh chuyên ngành Tài chính', subject: 'Tiếng Anh', likes: '90% (15)' },
];
