import { Group, TextInput, Select, SegmentedControl, Button, Stack, Box } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { schoolApi } from '@/shared/services';
import { useDocumentStore } from '@/stores';
import type { SchoolResponse, DepartmentResponse, FileType } from '@/shared/types';

const FILE_TYPE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'PDF', label: 'PDF' },
  { value: 'WORD', label: 'Word' },
  { value: 'TEXT', label: 'Text' },
];

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Mới nhất' },
  { value: 'createdAt,asc', label: 'Cũ nhất' },
  { value: 'price,asc', label: 'Giá tăng dần' },
  { value: 'price,desc', label: 'Giá giảm dần' },
];

export function DocumentFilters() {
  const {
    searchQuery, selectedSchoolId, selectedDepartmentId,
    selectedFileType, sortBy,
    setSearchQuery, setSelectedSchool, setSelectedDepartment,
    setSelectedFileType, setSortBy, resetFilters,
  } = useDocumentStore();

  const [schools, setSchools] = useState<SchoolResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);

  useEffect(() => {
    schoolApi.getAll().then(setSchools).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedSchoolId) { setDepartments([]); return; }
    schoolApi.getDepartments(selectedSchoolId).then(setDepartments).catch(() => {});
  }, [selectedSchoolId]);

  const hasActiveFilters =
    searchQuery || selectedSchoolId || selectedDepartmentId || selectedFileType;

  return (
    <Stack gap="md">
      {/* Search */}
      <TextInput
        placeholder="Tìm kiếm tài liệu..."
        leftSection={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        radius="md"
        size="md"
      />

      {/* Filters row */}
      <Group gap="sm" wrap="wrap">
        <Select
          placeholder="Trường học"
          data={schools.map((s) => ({ value: s.id, label: s.name }))}
          value={selectedSchoolId}
          onChange={setSelectedSchool}
          clearable
          searchable
          radius="md"
          style={{ minWidth: 180 }}
        />

        <Select
          placeholder="Khoa / Bộ môn"
          data={departments.map((d) => ({ value: d.id, label: d.name }))}
          value={selectedDepartmentId}
          onChange={setSelectedDepartment}
          clearable
          disabled={!selectedSchoolId}
          radius="md"
          style={{ minWidth: 180 }}
        />

        <Box>
          <SegmentedControl
            value={selectedFileType ?? ''}
            onChange={(v) => setSelectedFileType((v || null) as FileType | null)}
            data={FILE_TYPE_OPTIONS}
            radius="md"
            size="sm"
          />
        </Box>

        <Select
          data={SORT_OPTIONS}
          value={sortBy}
          onChange={(v) => setSortBy(v ?? 'createdAt,desc')}
          radius="md"
          style={{ minWidth: 150 }}
        />

        {hasActiveFilters && (
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            leftSection={<IconX size={14} />}
            onClick={resetFilters}
          >
            Reset
          </Button>
        )}
      </Group>
    </Stack>
  );
}
