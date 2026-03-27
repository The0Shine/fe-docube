import { SimpleGrid, Text, UnstyledButton, Group, Box } from '@mantine/core';
import { IconSchool } from '@tabler/icons-react';
import type { University } from '../types';
import { useNavigate } from 'react-router-dom';

interface SchoolListProps {
  schools: University[];
}

export function SchoolList({ schools }: SchoolListProps) {
  const navigate = useNavigate();

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="xs">
      {schools.map((school) => (
        <UnstyledButton
          key={school.id}
          p="xs"
          style={{
            borderRadius: '8px',
            transition: 'background-color 0.2s',
          }}
          onClick={() => navigate(`/university/${school.slug}`)}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Group gap="sm" wrap="nowrap" align="flex-start">
             <Box mt={2} c="blue">
                 <IconSchool size={20} />
             </Box>
            <Text size="sm" fw={500} c="blue" lh={1.4} style={{ flex: 1 }}>
              {school.name}
            </Text>
          </Group>
        </UnstyledButton>
      ))}
    </SimpleGrid>
  );
}
