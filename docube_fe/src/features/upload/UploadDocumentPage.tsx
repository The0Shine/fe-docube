import {
  Container, Title, Stack, Paper, Group, Text, TextInput,
  Textarea, Select, NumberInput, Button, Divider,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import {
  IconUpload, IconX, IconFile, IconCheck,
  IconFileTypePdf, IconFileTypeDocx, IconFileText,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentApi, schoolApi } from '@/shared/services';
import { notifications } from '@mantine/notifications';
import type { SchoolResponse, DepartmentResponse } from '@/shared/types';

const ACCEPTED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
];

function FileIcon({ name }: { name: string }) {
  if (name.endsWith('.pdf')) return <IconFileTypePdf size={32} color="var(--mantine-color-red-6)" />;
  if (name.match(/\.docx?$/)) return <IconFileTypeDocx size={32} color="var(--mantine-color-blue-6)" />;
  return <IconFileText size={32} color="var(--mantine-color-gray-6)" />;
}

function formatFileSize(bytes: number) {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export function UploadDocumentPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [schools, setSchools] = useState<SchoolResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      price: 0,
      schoolId: null as string | null,
      departmentId: null as string | null,
    },
    validate: {
      title: (v) => v.trim().length > 0 ? null : 'Tiêu đề là bắt buộc',
      price: (v) => v >= 0 ? null : 'Giá không được âm',
    },
  });

  useEffect(() => {
    schoolApi.getAll().then(setSchools).catch(() => {});
  }, []);

  const handleSchoolChange = (schoolId: string | null) => {
    form.setFieldValue('schoolId', schoolId);
    form.setFieldValue('departmentId', null);
    setDepartments([]);
    if (schoolId) {
      schoolApi.getDepartments(schoolId).then(setDepartments).catch(() => {});
    }
  };

  const handleSubmit = form.onSubmit(async (values) => {
    if (!file) {
      notifications.show({ message: 'Vui lòng chọn file để đăng.', color: 'orange' });
      return;
    }
    setSubmitting(true);
    try {
      const doc = await documentApi.create(file, {
        title: values.title,
        description: values.description || undefined,
        price: values.price,
        schoolId: values.schoolId || null,
        departmentId: values.departmentId || null,
      });
      notifications.show({ title: 'Đăng tài liệu thành công!', message: doc.title, color: 'green' });
      navigate(`/documents/${doc.id}`);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        <Stack gap={4}>
          <Title order={2} fw={700}>📤 Đăng tài liệu</Title>
          <Text c="dimmed" size="sm">Chia sẻ tài liệu học tập với cộng đồng</Text>
        </Stack>

        <Paper withBorder radius="md" p="xl">
          <Stack gap="xl">
            {/* Dropzone */}
            <Stack gap="sm">
              <Text fw={600} size="sm">File tài liệu *</Text>
              {!file ? (
                <Dropzone
                  onDrop={(files) => {
                    if (files[0]) {
                      setFile(files[0]);
                      if (!form.values.title) {
                        form.setFieldValue('title', files[0].name.replace(/\.[^.]+$/, ''));
                      }
                    }
                  }}
                  accept={ACCEPTED_MIME}
                  maxFiles={1}
                  radius="md"
                >
                  <Group justify="center" gap="xl" py="xl">
                    <Dropzone.Accept><IconUpload size={40} color="var(--mantine-color-primary-6)" /></Dropzone.Accept>
                    <Dropzone.Reject><IconX size={40} color="var(--mantine-color-red-6)" /></Dropzone.Reject>
                    <Dropzone.Idle><IconFile size={40} color="var(--mantine-color-gray-5)" /></Dropzone.Idle>
                    <Stack gap={4}>
                      <Text size="md" fw={600} ta="center">Kéo thả file vào đây</Text>
                      <Text size="sm" c="dimmed" ta="center">PDF, DOCX, TXT được hỗ trợ</Text>
                    </Stack>
                  </Group>
                </Dropzone>
              ) : (
                <Paper withBorder radius="md" p="md">
                  <Group justify="space-between">
                    <Group gap="sm">
                      <FileIcon name={file.name} />
                      <Stack gap={2}>
                        <Text size="sm" fw={600}>{file.name}</Text>
                        <Text size="xs" c="dimmed">{formatFileSize(file.size)}</Text>
                      </Stack>
                    </Group>
                    <Group gap="xs">
                      <IconCheck size={16} color="var(--mantine-color-green-6)" />
                      <Button
                        variant="subtle"
                        color="red"
                        size="xs"
                        onClick={() => setFile(null)}
                      >
                        Xoá
                      </Button>
                    </Group>
                  </Group>
                </Paper>
              )}
            </Stack>

            <Divider />

            {/* Metadata form */}
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Tiêu đề *"
                  placeholder="Nhập tiêu đề tài liệu"
                  {...form.getInputProps('title')}
                  radius="md"
                />

                <Textarea
                  label="Mô tả"
                  placeholder="Mô tả ngắn về nội dung tài liệu..."
                  rows={4}
                  {...form.getInputProps('description')}
                  radius="md"
                />

                <Group grow>
                  <Select
                    label="Trường học"
                    placeholder="Chọn trường"
                    data={schools.map((s) => ({ value: s.id, label: s.name }))}
                    value={form.values.schoolId}
                    onChange={handleSchoolChange}
                    clearable
                    searchable
                    radius="md"
                  />
                  <Select
                    label="Khoa / Bộ môn"
                    placeholder="Chọn khoa"
                    data={departments.map((d) => ({ value: d.id, label: d.name }))}
                    value={form.values.departmentId}
                    onChange={(v) => form.setFieldValue('departmentId', v)}
                    clearable
                    disabled={!form.values.schoolId}
                    radius="md"
                  />
                </Group>

                <NumberInput
                  label="Giá (VNĐ)"
                  description="Nhập 0 nếu tài liệu miễn phí"
                  min={0}
                  step={1000}
                  {...form.getInputProps('price')}
                  radius="md"
                  suffix="đ"
                  thousandSeparator="."
                  decimalSeparator=","
                />

                <Button
                  type="submit"
                  size="lg"
                  radius="xl"
                  fullWidth
                  mt="sm"
                  loading={submitting}
                  leftSection={<IconUpload size={18} />}
                >
                  Đăng tài liệu
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
