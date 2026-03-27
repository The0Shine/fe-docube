import { Box, Container, Grid, Title, Group, Anchor } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { SchoolHero } from './components/SchoolHero';
import { CourseList } from './components/CourseList';
import { DocumentGrid } from './components/DocumentGrid';
import { SchoolSidebar } from './components/SchoolSidebar';
import { MOCK_COURSES, MOCK_DOCUMENTS } from './types';

export function SchoolDetailPage() {
  return (
    <Box bg="white" style={{ minHeight: '100vh' }}>
      <SchoolHero />

      <Container size="xl" py="xl" mt={-40} style={{ position: 'relative', zIndex: 20 }}>
        <Grid gutter="xl">
            {/* Main Content (Left) */}
          <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
             <Box bg="white" p="xl" style={{ borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                
                {/* Courses Section */}
                <Box mb={40}>
                    <Group justify="space-between" mb="lg">
                        <Title order={2} size="h3">Courses (409)</Title>
                        {/* Pagination or Alphabet filter could go here */}
                    </Group>
                    <CourseList courses={MOCK_COURSES} />
                </Box>

                {/* Popular Documents */}
                <Box mb={40}>
                    <Group justify="space-between" mb="lg">
                         <Title order={2} size="h3">Popular documents</Title>
                         <Anchor size="sm" c="dimmed" display="flex" style={{ alignItems: 'center' }}>
                            View all <IconChevronRight size={14} />
                         </Anchor>
                    </Group>
                    <DocumentGrid documents={MOCK_DOCUMENTS} />
                </Box>

                 {/* Recent Documents */}
                 <Box mb={40}>
                    <Group justify="space-between" mb="lg">
                         <Title order={2} size="h3">Recent documents</Title>
                    </Group>
                    <DocumentGrid documents={MOCK_DOCUMENTS} />
                </Box>

             </Box>
          </Grid.Col>

          {/* Sidebar (Right) */}
          <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
            <SchoolSidebar />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
