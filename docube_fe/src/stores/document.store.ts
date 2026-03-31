/**
 * Document Store - Lưu trạng thái filter/search cho trang documents
 */
import { create } from 'zustand';
import type { FileType } from '@/shared/types';

interface DocumentFilters {
  searchQuery: string;
  selectedSchoolId: string | null;
  selectedDepartmentId: string | null;
  selectedFileType: FileType | null;
  sortBy: string;
}

interface DocumentStore extends DocumentFilters {
  setSearchQuery: (q: string) => void;
  setSelectedSchool: (id: string | null) => void;
  setSelectedDepartment: (id: string | null) => void;
  setSelectedFileType: (type: FileType | null) => void;
  setSortBy: (sort: string) => void;
  resetFilters: () => void;
}

const defaultFilters: DocumentFilters = {
  searchQuery: '',
  selectedSchoolId: null,
  selectedDepartmentId: null,
  selectedFileType: null,
  sortBy: 'createdAt,desc',
};

export const useDocumentStore = create<DocumentStore>((set) => ({
  ...defaultFilters,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedSchool: (selectedSchoolId) =>
    set({ selectedSchoolId, selectedDepartmentId: null }),
  setSelectedDepartment: (selectedDepartmentId) => set({ selectedDepartmentId }),
  setSelectedFileType: (selectedFileType) => set({ selectedFileType }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set(defaultFilters),
}));
