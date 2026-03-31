import {
  Container, Title, Stack, Paper, Group, Text, TextInput,
  Textarea, Select, NumberInput, Button, Skeleton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { documentApi, schoolApi } from '@/shared/services';
import { notifications } from '@mantine/notifications';
import type { SchoolResponse, DepartmentResponse } from '@/shared/types';

export function EditDocumentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [schools, setSchools] = useState<SchoolResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
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
    if (!id) return;
    Promise.all([documentApi.getById(id), schoolApi.getAll()])
      .then(([doc, schoolList]) => {
        setSchools(schoolList);
        form.setValues({
          title: doc.title,
          description: doc.description,
          price: doc.price,
          schoolId: doc.schoolId ?? null,
          departmentId: doc.departmentId ?? null,
        });
        if (doc.schoolId) {
          schoolApi.getDepartments(doc.schoolId).then(setDepartments).catch(() => {});
        }
      })
      .catch(() => navigate('/private/my-documents'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSchoolChange = (schoolId: string | null) => {
    form.setFieldValue('schoolId', schoolId);
    form.setFieldValue('departmentId', null);
    setDepartments([]);
    if (schoolId) {
      schoolApi.getDepartments(schoolId).then(setDepartments).catch(() => {});
    }
  };

  const handleSubmit = form.onSubmit(async (values) => {
    setSubmitting(true);
    try {
      await documentApi.update(id!, {
        title: values.title,
        description: values.description || undefined,
        price: values.price,
        schoolId: values.schoolId,
        departmentId: values.departmentId,
      });
      notifications.show({ message: 'Cập nhật tài liệu thành công!', color: 'green' });
      navigate(`/documents/${id}`);
    } finally {
      setSubmitting(false);
    }
  });

  if (loading) {
    return (
      <Container size="sm" py="xl">
        <Stack gap="md">
          <Skeleton height={32} width={200} />
          <Skeleton height={400} />
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        <Stack gap={4}>
          <Title order={2} fw={700}>✏️ Chỉnh sửa tài liệu</Title>
          <Text c="dimmed" size="sm">Cập nhật thông tin tài liệu</Text>
        </Stack>

        <Paper withBorder radius="md" p="xl">
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

              <Group justify="flex-end" mt="sm">
                <Button variant="subtle" color="gray" onClick={() => navigate(-1)}>
                  Huỷ
                </Button>
                <Button
                  type="submit"
                  leftSection={<IconCheck size={16} />}
                  loading={submitting}
                >
                  Lưu thay đổi
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  );
}
