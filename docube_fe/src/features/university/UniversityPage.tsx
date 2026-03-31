import { Container, Title, Box, Stack, Group, Text, Anchor, Skeleton, SimpleGrid } from '@mantine/core';
import { UniversityHero } from './components/UniversityHero';
import { SchoolList } from './components/SchoolList';
import { IconChevronRight } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { schoolApi } from '@/shared/services';
import type { SchoolResponse } from '@/shared/types';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function UniversityPage() {
  const [schools, setSchools] = useState<SchoolResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    schoolApi.getAll()
      .then(setSchools)
      .catch(() => setSchools([]))
      .finally(() => setLoading(false));
  }, []);

  // Map SchoolResponse → University shape expected by SchoolList
  const asUniversity = (s: SchoolResponse) => ({ id: s.id, name: s.name, slug: s.id });

  return (
    <Box bg="white" style={{ minHeight: '100vh' }}>
      <UniversityHero />

      <Container size="lg" py="xl">
        <Stack gap={40}>
          {/* Schools list */}
          <Box>
            <Title order={2} size="h3" mb="lg">Các trường đại học</Title>

            {loading ? (
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} height={36} radius="sm" />
                ))}
              </SimpleGrid>
            ) : (
              <>
                {/* Alphabet filter */}
                <Text size="sm" c="dimmed" mb="md">Tìm kiếm trường theo chữ cái đầu</Text>
                <Group gap={4} mb="xl" wrap="wrap">
                  {ALPHABET.map((char) => (
                    <Anchor
                      key={char}
                      href={`#${char}`}
                      fw={600}
                      p={8}
                      size="sm"
                      style={{ borderRadius: '4px', textDecoration: 'none' }}
                    >
                      {char}
                    </Anchor>
                  ))}
                  <IconChevronRight size={16} color="gray" />
                </Group>

                <SchoolList schools={schools.map(asUniversity)} />
              </>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
