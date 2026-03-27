import { SimpleGrid, Text, Group, UnstyledButton, ThemeIcon, Box } from '@mantine/core';
import { IconFolder } from '@tabler/icons-react';
import type { Course } from '../types';

interface CourseListProps {
  courses: Course[];
}

export function CourseList({ courses }: CourseListProps) {
  return (
    <SimpleGrid cols={{ base: 1, xs: 2, sm: 3 }} spacing="md" verticalSpacing="md">
      {courses.map((course) => (
        <UnstyledButton key={course.id}>
          <Group align="flex-start" wrap="nowrap">
            <ThemeIcon color="green" variant="light" size="md" radius="sm">
              <IconFolder size={18} />
            </ThemeIcon>
            <Box style={{ flex: 1 }}>
              <Text c="blue" fw={500} size="sm" lh={1.3} lineClamp={2}>
                {course.name}
              </Text>
              <Text c="dimmed" size="xs">
                {course.documentCount} documents
              </Text>
            </Box>
          </Group>
        </UnstyledButton>
      ))}
    </SimpleGrid>
  );
}

